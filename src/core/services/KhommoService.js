export class KhommoService {
  constructor(apiKey, options = {}) {
    this.apiKey = `${apiKey || ''}`.trim();
    this.baseUrl = options.baseUrl || 'https://khommo.vn/api';
    this.timeoutMs = Math.max(5000, Number.parseInt(options.timeoutMs ?? 30000, 10) || 30000);
  }

  assertApiKey() {
    if (!this.apiKey) throw new Error('Thiếu Khommo API key.');
  }

  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      const text = await response.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = null; }
      if (!response.ok) {
        const message = data?.msg || data?.message || data?.error || text || `HTTP ${response.status}`;
        throw new Error(message);
      }
      return data ?? text;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Timeout khi gọi Khommo API.');
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  buildUrl(pathname, params = {}) {
    const url = new URL(`${this.baseUrl}/${pathname}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && `${value}` !== '') url.searchParams.set(key, `${value}`);
    });
    return url.toString();
  }

  async getProfile() {
    this.assertApiKey();
    const endpoints = [
      this.buildUrl('profile.php', { api_key: this.apiKey }),
      this.buildUrl('profile', { api_key: this.apiKey }),
      this.buildUrl('user.php', { api_key: this.apiKey }),
    ];
    let lastError = null;
    for (const url of endpoints) {
      try {
        const data = await this.fetchWithTimeout(url, { method: 'GET', headers: { Accept: 'application/json' } });
        return { raw: data, balance: this.extractBalance(data) };
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('Không kiểm tra được số dư Khommo.');
  }

  async getProducts() {
    this.assertApiKey();
    const endpoints = [
      this.buildUrl('products.php', { api_key: this.apiKey }),
      this.buildUrl('products', { api_key: this.apiKey }),
    ];
    let lastError = null;
    for (const url of endpoints) {
      try {
        const data = await this.fetchWithTimeout(url, { method: 'GET', headers: { Accept: 'application/json' } });
        return { raw: data, products: this.extractProductList(data) };
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('Không đọc được danh sách sản phẩm Khommo.');
  }

  async getProduct(productId = 1) {
    this.assertApiKey();
    const endpoints = [
      this.buildUrl('product.php', { api_key: this.apiKey, id: productId }),
      this.buildUrl('product.php', { api_key: this.apiKey, product: productId }),
      this.buildUrl('product.php', { api_key: this.apiKey, product_id: productId }),
      this.buildUrl('product', { api_key: this.apiKey, id: productId }),
    ];
    let lastError = null;
    for (const url of endpoints) {
      try {
        const data = await this.fetchWithTimeout(url, { method: 'GET', headers: { Accept: 'application/json' } });
        const info = this.extractProductInfo(data, productId);
        return { raw: data, summary: info.summary || this.summarizeRaw(data), info };
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('Không đọc được product Khommo.');
  }

  extractProductList(data) {
    if (!data || typeof data !== 'object') return [];
    const results = [];
    const seen = new Set();
    const visit = (item) => {
      if (!item || typeof item !== 'object') return;
      if (seen.has(item)) return;
      seen.add(item);
      if (item.id || item.product_id || item.product || item.pid || item.productId) results.push(item);
      if (Array.isArray(item)) {
        item.forEach(visit);
        return;
      }
      Object.values(item).forEach((value) => {
        if (value && typeof value === 'object') visit(value);
      });
    };
    visit(data);
    return results;
  }

  extractPrimaryProduct(data, productId = '') {
    if (!data || typeof data !== 'object') return null;
    const wantedId = `${productId || ''}`.trim();
    const listMatches = this.extractProductList(data);
    if (listMatches.length) {
      const exact = listMatches.find((item) => wantedId && `${item.id ?? item.product_id ?? item.product ?? item.pid ?? ''}`.trim() === wantedId);
      return exact || listMatches[0];
    }
    const arrays = [data.product, data.products, data.data, data.data?.product, data.data?.products, data.items, data.list]
      .filter(Array.isArray);
    for (const items of arrays) {
      const exact = items.find((item) => item && typeof item === 'object' && wantedId && `${item.id ?? item.product_id ?? item.product ?? item.pid ?? ''}`.trim() === wantedId);
      if (exact) return exact;
      const first = items.find((item) => item && typeof item === 'object');
      if (first) return first;
    }
    if (data.product && typeof data.product === 'object' && !Array.isArray(data.product)) return data.product;
    if (data.data?.product && typeof data.data.product === 'object' && !Array.isArray(data.data.product)) return data.data.product;
    if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) return data.data;
    return data;
  }

  summarizeRaw(data) {
    if (!data || typeof data !== 'object') return '';
    const primaryProduct = this.extractPrimaryProduct(data);
    const candidates = [
      data.msg, data.message, data.error, data.status, data.result, data.note,
      data.data?.msg, data.data?.message, data.data?.status, primaryProduct?.name,
    ].filter((value) => value !== undefined && value !== null && `${value}`.trim() !== '');
    return candidates.map((value) => `${value}`.trim()).slice(0, 4).join(' | ');
  }

  extractProductInfo(data, productId = '') {
    if (!data || typeof data !== 'object') return { id: `${productId || ''}`.trim(), summary: '' };
    const primaryProduct = this.extractPrimaryProduct(data, productId);
    const pick = (...values) => values.find((value) => value !== undefined && value !== null && `${value}`.trim() !== '');
    const pickByKeys = (source, keys = []) => {
      if (!source || typeof source !== 'object') return '';
      for (const [key, value] of Object.entries(source)) {
        const normalizedKey = `${key}`.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        if (keys.includes(normalizedKey) && value !== undefined && value !== null && `${value}`.trim() !== '') return value;
      }
      return '';
    };
    const id = pick(primaryProduct?.id, primaryProduct?.product_id, primaryProduct?.product, primaryProduct?.pid, primaryProduct?.productId, data.id, data.product_id, data.data?.id, productId);
    const name = pick(primaryProduct?.name, primaryProduct?.product_name, primaryProduct?.title, primaryProduct?.service, data.name, data.product_name, data.data?.name);
    const stock = pick(
      pickByKeys(primaryProduct, ['stock', 'quantity', 'available', 'warehouse', 'kho', 'amount', 'total', 'remain', 'remaining', 'remains', 'inventory', 'instock', 'inwarehouse', 'count', 'live', 'totalstore', 'totalstock']),
      pickByKeys(data, ['stock', 'quantity', 'available', 'warehouse', 'kho', 'amount', 'total', 'remain', 'remaining', 'inventory', 'instock', 'count', 'live']),
      pickByKeys(data.data, ['stock', 'quantity', 'available', 'warehouse', 'kho', 'amount', 'total', 'remain', 'remaining', 'inventory', 'instock', 'count', 'live']),
    );
    const price = pick(
      pickByKeys(primaryProduct, ['price', 'cost', 'money', 'amountprice', 'unitprice', 'rate', 'gia', 'giaban', 'pricevnd', 'pricevn', 'vnd', 'sellprice', 'priceusd', 'usd']),
      pickByKeys(data, ['price', 'cost', 'money', 'amountprice', 'unitprice', 'rate', 'gia', 'giaban', 'pricevnd', 'pricevn', 'vnd', 'sellprice', 'priceusd', 'usd']),
      pickByKeys(data.data, ['price', 'cost', 'money', 'amountprice', 'unitprice', 'rate', 'gia', 'giaban', 'pricevnd', 'pricevn', 'vnd', 'sellprice', 'priceusd', 'usd']),
    );
    const status = pick(data.status, data.result, data.product_status, data.data?.status, primaryProduct?.status);
    const message = pick(data.msg, data.message, data.error, data.note, data.data?.message);
    const min = pick(primaryProduct?.min, data.min, data.data?.min);
    const max = pick(primaryProduct?.max, data.max, data.data?.max);
    const parts = [];
    const pushIf = (label, value) => {
      if (value === undefined || value === null || `${value}`.trim() === '') return;
      parts.push(`${label}=${`${value}`.trim()}`);
    };
    pushIf('status', status);
    pushIf('msg', message);
    pushIf('id', id);
    pushIf('name', name);
    pushIf('stock', stock);
    pushIf('price', price);
    pushIf('min', min);
    pushIf('max', max);
    return {
      id: `${id ?? productId ?? ''}`.trim(),
      name: name ? `${name}`.trim() : '',
      stock: stock === undefined || stock === null ? '' : `${stock}`.trim(),
      price: price === undefined || price === null ? '' : `${price}`.trim(),
      status: status ? `${status}`.trim() : '',
      message: message ? `${message}`.trim() : '',
      min: min === undefined || min === null ? '' : `${min}`.trim(),
      max: max === undefined || max === null ? '' : `${max}`.trim(),
      summary: parts.join(', '),
    };
  }

  extractProductSummary(data, productId = '') {
    return this.extractProductInfo(data, productId).summary;
  }

  isMaintenanceMessage(message = '') {
    return /bảo trì|maintenance/i.test(`${message || ''}`);
  }

  buildBuyParams({ productId = 1, amount = 1, coupon = '' } = {}) {
    const safeAmount = Math.max(1, Number.parseInt(amount, 10) || 0);
    if (!safeAmount) throw new Error('Số lượng mua phải lớn hơn 0.');
    return {
      action: 'buyProduct',
      id: `${productId}`,
      amount: `${safeAmount}`,
      coupon: `${coupon || ''}`,
      api_key: this.apiKey,
    };
  }

  async buyProductWithTransport(params, transport = 'get') {
    const endpoints = ['buy_product', 'buy_product.php'];
    const failures = [];
    for (const endpoint of endpoints) {
      try {
        if (transport === 'get') {
          const data = await this.fetchWithTimeout(this.buildUrl(endpoint, params), { method: 'GET', headers: { Accept: 'application/json' } });
          return { data, transport: `${transport}:${endpoint}` };
        }
        if (transport === 'post-form-data') {
          const body = new FormData();
          Object.entries(params).forEach(([key, value]) => body.set(key, `${value}`));
          const data = await this.fetchWithTimeout(this.buildUrl(endpoint), { method: 'POST', headers: { Accept: 'application/json' }, body });
          return { data, transport: `${transport}:${endpoint}` };
        }
        if (transport === 'post-urlencoded') {
          const body = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => body.set(key, `${value}`));
          const data = await this.fetchWithTimeout(this.buildUrl(endpoint), {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
          });
          return { data, transport: `${transport}:${endpoint}` };
        }
      } catch (error) {
        failures.push(`${endpoint}: ${error.message}`);
      }
    }
    throw new Error(failures.join(' || ') || `Unsupported Khommo transport: ${transport}`);
  }

  normalizePurchasedLines(data) {
    const rawItems = [
      ...(Array.isArray(data?.data) ? data.data : []),
      ...(Array.isArray(data?.accounts) ? data.accounts : []),
      ...(Array.isArray(data?.products) ? data.products : []),
      ...(Array.isArray(data?.items) ? data.items : []),
    ];
    return rawItems.map((item) => {
      if (typeof item === 'string') return item.trim();
      const email = item?.email || item?.mail || item?.username || '';
      const password = item?.password || item?.pass || '';
      const refreshToken = item?.refreshToken || item?.refresh_token || item?.token || '';
      const clientId = item?.clientId || item?.client_id || item?.client || '';
      const recoveryEmail = item?.recoveryEmail || item?.recovery_email || '';
      return [email, password, refreshToken, clientId, recoveryEmail].map((value) => `${value || ''}`.trim()).filter(Boolean).join('|');
    }).filter(Boolean);
  }

  async buyProduct({ productId = 1, amount = 1, coupon = '' } = {}) {
    this.assertApiKey();
    const params = this.buildBuyParams({ productId, amount, coupon });
    const transports = ['get', 'post-form-data', 'post-urlencoded'];
    const failures = [];
    for (const transport of transports) {
      try {
        const { data, transport: usedTransport } = await this.buyProductWithTransport(params, transport);
        const status = `${data?.status || data?.result || ''}`.toLowerCase();
        const ok = status === 'success' || status === 'true' || data?.success === true || data?.ok === true;
        if (!ok) {
          const detail = this.summarizeRaw(data);
          failures.push({ transport: usedTransport, message: detail || data?.msg || data?.message || data?.error || 'Mua Hotmail Khommo thất bại.' });
          continue;
        }
        return {
          status: data.status || data.result || 'success',
          message: data.msg || data.message || 'Tạo đơn hàng thành công.',
          transId: data.trans_id || data.transId || data.order_id || data.orderId || '',
          lines: this.normalizePurchasedLines(data),
          raw: data,
          rawSummary: this.summarizeRaw(data),
          transport: usedTransport,
          attemptedTransports: failures.map((item) => `${item.transport} => ${item.message}`),
        };
      } catch (error) {
        failures.push({ transport, message: error.message || 'Unknown transport error' });
      }
    }
    const aggregateError = new Error(failures.map((item) => `${item.transport} => ${item.message}`).join(' || ') || 'Mua Hotmail Khommo thất bại.');
    aggregateError.transportFailures = failures;
    throw aggregateError;
  }

  async buyProductInBatches({ totalAmount, productId = 1, batchSize = 100, coupon = '', onProgress = null } = {}) {
    const requested = Math.max(1, Number.parseInt(totalAmount, 10) || 0);
    const safeBatchSize = Math.max(1, Number.parseInt(batchSize, 10) || 100);
    if (!requested) throw new Error('Số lượng mua phải lớn hơn 0.');
    const allLines = [];
    const transactions = [];
    const failedBatches = [];
    const totalBatches = Math.ceil(requested / safeBatchSize);
    let productSummary = '';
    try {
      const productInfo = await this.getProduct(productId);
      productSummary = productInfo.summary || this.summarizeRaw(productInfo.raw);
      if (onProgress && productSummary) onProgress({ type: 'product-check', productId, summary: productSummary });
    } catch (error) {
      if (onProgress) onProgress({ type: 'product-check-error', productId, message: error.message });
    }
    for (let offset = 0, batchIndex = 1; offset < requested; offset += safeBatchSize, batchIndex += 1) {
      const amount = Math.min(safeBatchSize, requested - offset);
      let lastError = null;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          if (onProgress) onProgress({ type: 'batch-start', batchIndex, totalBatches, amount, attempt, productSummary });
          const result = await this.buyProduct({ productId, amount, coupon });
          allLines.push(...result.lines);
          transactions.push({ transId: result.transId, amount, received: result.lines.length, message: result.message, rawSummary: result.rawSummary || '', transport: result.transport || '', attemptedTransports: result.attemptedTransports || [] });
          if (onProgress) onProgress({ type: 'batch-success', batchIndex, totalBatches, amount, received: result.lines.length, transId: result.transId, productSummary, rawSummary: result.rawSummary || '', transport: result.transport || '', attemptedTransports: result.attemptedTransports || [] });
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          const failures = Array.isArray(error.transportFailures) ? error.transportFailures : [];
          const message = `${error.message || ''}`.toLowerCase();
          const maintenanceStop = failures.length > 0 ? failures.every((item) => this.isMaintenanceMessage(item?.message || '')) : this.isMaintenanceMessage(message);
          const hardStop = maintenanceStop || /không đủ|insufficient|balance|hết hàng|out of stock|sold out|invalid api|api key/i.test(message);
          if (onProgress) onProgress({ type: 'batch-error', batchIndex, totalBatches, amount, attempt, message: error.message, productSummary, maintenanceStop, transportFailures: failures });
          if (hardStop || attempt >= 3) break;
          await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
        }
      }
      if (lastError) {
        failedBatches.push({ batchIndex, amount, message: lastError.message, productSummary, transportFailures: Array.isArray(lastError.transportFailures) ? lastError.transportFailures : [] });
        break;
      }
    }
    return { requested, purchased: allLines.length, lines: allLines, transactions, failedBatches, productSummary };
  }

  extractBalance(data) {
    const candidates = [data?.balance, data?.money, data?.cash, data?.amount, data?.data?.balance, data?.data?.money, data?.data?.cash, data?.user?.balance, data?.profile?.balance];
    const found = candidates.find((value) => value !== undefined && value !== null && `${value}` !== '');
    return found === undefined ? '' : `${found}`;
  }
}
