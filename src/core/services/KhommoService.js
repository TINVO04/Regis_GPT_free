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

  async getProduct(productId = 1) {
    this.assertApiKey();
    const endpoints = [
      this.buildUrl('product.php', { api_key: this.apiKey, product: productId }),
      this.buildUrl('product', { api_key: this.apiKey, product: productId }),
      this.buildUrl('products.php', { api_key: this.apiKey, product: productId }),
    ];
    let lastError = null;
    for (const url of endpoints) {
      try {
        const data = await this.fetchWithTimeout(url, { method: 'GET', headers: { Accept: 'application/json' } });
        return { raw: data, summary: this.extractProductSummary(data) || this.summarizeRaw(data) };
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('Không đọc được product Khommo.');
  }

  extractPrimaryProduct(data) {
    if (!data || typeof data !== 'object') return null;
    if (Array.isArray(data.product) && data.product[0] && typeof data.product[0] === 'object') return data.product[0];
    if (Array.isArray(data.products) && data.products[0] && typeof data.products[0] === 'object') return data.products[0];
    if (data.product && typeof data.product === 'object' && !Array.isArray(data.product)) return data.product;
    if (data.data?.product && typeof data.data.product === 'object') return data.data.product;
    return null;
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

  extractProductSummary(data) {
    if (!data || typeof data !== 'object') return '';
    const primaryProduct = this.extractPrimaryProduct(data);
    const parts = [];
    const pushIf = (label, value) => {
      if (value === undefined || value === null || `${value}`.trim() === '') return;
      parts.push(`${label}=${`${value}`.trim()}`);
    };
    pushIf('status', data.status || data.result || data.product_status || data.data?.status);
    pushIf('msg', data.msg || data.message || data.error || data.note);
    pushIf('id', primaryProduct?.id || data.id || data.product_id || data.data?.id);
    pushIf('name', primaryProduct?.name || data.name || data.product_name || data.data?.name);
    pushIf('stock', primaryProduct?.amount || primaryProduct?.stock || data.stock || data.quantity || data.available || data.data?.stock);
    pushIf('price', primaryProduct?.price || data.price || data.cost || data.amount || data.data?.price);
    pushIf('min', primaryProduct?.min || data.min || data.data?.min);
    pushIf('max', primaryProduct?.max || data.max || data.data?.max);
    return parts.join(', ');
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
