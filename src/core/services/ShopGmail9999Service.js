const BASE_URL = 'https://shopgmail9999.com/api/ApiV2';

export class ShopGmail9999Service {
  constructor(apiKey, options = {}) {
    this.apiKey = `${apiKey || ''}`.trim();
    this.timeoutMs = Number(options.timeoutMs || 20000);
    this.logger = typeof options.logger === 'function' ? options.logger : null;
    this.sleep = typeof options.sleep === 'function' ? options.sleep : ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    if (!this.apiKey) throw new Error('Thiếu ShopGmail9999 API key.');
  }

  buildUrl(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    url.searchParams.set('apikey', this.apiKey);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && `${value}` !== '') url.searchParams.set(key, `${value}`);
    });
    return url.toString();
  }

  async request(endpoint, params = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(this.buildUrl(endpoint, params), { method: 'GET', signal: controller.signal });
      const text = await response.text();
      let data = null;
      try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
      if (!response.ok) throw new Error(`ShopGmail9999 HTTP ${response.status}: ${data?.message || data?.msg || text || response.statusText}`);
      if (data?.status === 'error' || data?.success === false) throw new Error(data?.message || data?.msg || 'ShopGmail9999 API trả lỗi.');
      return data;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('ShopGmail9999 API timeout.');
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  async getUserInfo() {
    const raw = await this.request('GetUserInfo');
    const data = raw?.data || raw;
    return { username: data?.username || '', balance: Number(data?.balance ?? 0), banned: Number(data?.banned ?? 0), raw };
  }

  async getStock(service = 'chatgpt') {
    const raw = await this.request('GetStockOtpGmail', { service });
    const data = raw?.data || raw;
    return { service: data?.service || service, stock: Number(data?.stock ?? raw?.stock ?? 0), raw };
  }

  async createOrder(service = 'chatgpt') {
    const raw = await this.request('CreateOrder', { service });
    const data = raw?.data || raw;
    const email = data?.email || data?.gmail || data?.mail || '';
    const orderId = data?.orderid || data?.orderId || data?.order_id || data?.id || '';
    if (!email || !orderId) throw new Error(`ShopGmail9999 CreateOrder thiếu email/orderid: ${raw?.msg || raw?.message || 'unknown'}`);
    return { email, orderId, service: data?.service || service, status: data?.status || 'created', createdAt: data?.createdat || data?.createdAt || new Date().toISOString(), raw };
  }

  extractOtp(payload) {
    const data = payload?.data || payload || {};
    const candidates = [data?.otp, data?.code, data?.OTP, payload?.otp, payload?.code, data?.body, data?.Body, payload?.message, payload?.msg];
    for (const value of candidates) {
      const match = `${value || ''}`.match(/\b(\d{6})\b/);
      if (match) return match[1];
    }
    return '';
  }

  async checkOtp2(orderId, options = {}) {
    const raw = await this.request('CheckOtp2', { orderid: orderId, ...(options.getBody ? { getbody: 'true' } : {}) });
    return { otp: this.extractOtp(raw), status: raw?.data?.status || raw?.status || '', raw };
  }

  async waitForOtp(orderId, options = {}) {
    const retries = Math.max(1, Number(options.retries || 30));
    const delayMs = Math.max(1000, Number(options.delayMs || 4000));
    const shouldStop = typeof options.shouldStop === 'function' ? options.shouldStop : () => false;
    for (let attempt = 1; attempt <= retries; attempt += 1) {
      if (shouldStop()) throw new Error('FORCE_STOP_REQUESTED');
      const result = await this.checkOtp2(orderId, { getBody: true });
      if (result.otp) {
        if (!options.rejectOtp || result.otp !== options.rejectOtp) return result.otp;
        if (this.logger) this.logger(`⏳ ShopGmail9999 trả OTP cũ ${result.otp}; bỏ qua, chờ OTP mới (${attempt}/${retries})...`, 'WARNING');
      } else if (this.logger) {
        this.logger(`⏳ ShopGmail9999 chưa có OTP (${attempt}/${retries}), poll lại sau ${Math.round(delayMs / 1000)}s...`);
      }
      if (typeof options.onRetry === 'function') await options.onRetry({ attempt, result });
      await this.sleep(delayMs);
    }
    return '';
  }
}
