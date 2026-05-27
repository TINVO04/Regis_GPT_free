export class SMSPoolService {
  static COUNTRIES = {
    1: { id: 1, name: 'United States', dialCode: '+1', code: 'US', maxPrice: '0.07' },
    12: { id: 12, name: 'Philippines', dialCode: '+63', code: 'PH', maxPrice: '0.07' },
    9: { id: 9, name: 'Indonesia', dialCode: '+62', code: 'ID', maxPrice: '0.08' },
    101: { id: 101, name: 'Georgia', dialCode: '+995', code: 'GE', maxPrice: '0.08' },
    7: { id: 7, name: 'Kazakhstan', dialCode: '+7', code: 'KZ', maxPrice: '0.09' },
  };

  static defaultCountry = 12;

  static onStatus = null;

  static normalizeCountry(country = 12) {
    const id = Number.parseInt(country, 10) || 12;
    return SMSPoolService.COUNTRIES[id] || SMSPoolService.COUNTRIES[12];
  }

  static normalizeMaxPrice(value = '') {
    const raw = `${value ?? ''}`.trim().replace(',', '.');
    if (!raw) return '';
    const parsed = Number.parseFloat(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) return '';
    return parsed.toFixed(2);
  }

  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.country = SMSPoolService.normalizeCountry(options.country ?? SMSPoolService.defaultCountry);
    this.maxPrice = SMSPoolService.normalizeMaxPrice(options.maxPrice ?? '');
  }

  isStopped(shouldStop) {
    return typeof shouldStop === 'function' && shouldStop();
  }

  logStatus(message = '') {
    const line = `${message || ''}`.trim();
    if (!line) return;
    console.log(line);
    if (typeof SMSPoolService.onStatus === 'function') {
      SMSPoolService.onStatus(line);
    }
  }

  async sleep(ms, shouldStop = () => false, onTick = null) {
    const stepMs = 1000;
    let elapsedMs = 0;
    while (elapsedMs < ms) {
      if (this.isStopped(shouldStop)) return false;
      const waitMs = Math.min(stepMs, ms - elapsedMs);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      elapsedMs += waitMs;
      if (typeof onTick === 'function' && (elapsedMs === ms || elapsedMs % 5000 === 0)) {
        onTick(Math.max(0, ms - elapsedMs));
      }
    }
    return true;
  }

  async fetchJson(url, { timeoutMs = 15000, shouldStop = () => false, method = 'GET', body = null, headers = undefined } = {}) {
    if (this.isStopped(shouldStop)) throw new Error('SMSPool request stopped');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { method, body, headers, signal: controller.signal });
      if (this.isStopped(shouldStop)) throw new Error('SMSPool request stopped');
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') throw new Error(`SMSPool request timeout after ${timeoutMs}ms`);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async getBalance(shouldStop = () => false) {
    const url = 'https://api.smspool.net/request/balance';
    const body = new URLSearchParams({ key: this.apiKey });
    try {
      const res = await this.fetchJson(url, {
        timeoutMs: 15000,
        shouldStop,
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (res?.balance !== undefined) {
        return { ok: true, balance: `${res.balance}`, raw: res };
      }
      throw new Error(res?.message || res?.error || 'SMSPool balance response không hợp lệ.');
    } catch (error) {
      throw new Error(`SMSPool Balance Error: ${error.message}`);
    }
  }

  stripHtml(value = '') {
    return `${value || ''}`
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&/gi, '&')
      .replace(/</gi, '<')
      .replace(/>/gi, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }

  isTransientPurchaseFailure(message = '') {
    const normalized = this.stripHtml(message).toLowerCase();
    return /all available slots are currently occupied|available slots.*occupied|try again in|try again later|please be patient|rate limit|too many/i.test(normalized);
  }

  async buyNumber(shouldStop = () => false) {
    const country = SMSPoolService.normalizeCountry(this.country?.id ?? this.country);
    const maxPrice = SMSPoolService.normalizeMaxPrice(this.maxPrice) || country.maxPrice;
    const url = `https://api.smspool.net/purchase/sms?key=${this.apiKey}&service=671&country=${country.id}&max_price=${maxPrice}`;
    const maxAttempts = 4;
    const retryDelayMs = country.id === 1 ? 15000 : 30000;
    let lastMessage = '';

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        this.logStatus(`[SMSPool] Đang thuê số ${country.name} ${country.dialCode} (ID ${country.id}) cho OpenAI/ChatGPT, max_price=${maxPrice}, lần ${attempt}/${maxAttempts}...`);
        const res = await this.fetchJson(url, { timeoutMs: 15000, shouldStop });
        if (res.success) {
          this.logStatus(`[SMSPool] Đã thuê số mới ${country.name} ${country.dialCode}: +${res.cc}${res.phonenumber} (ID: ${res.orderid})`);
          return res;
        }

        lastMessage = this.stripHtml(res.message || res.error || 'Hết số hoặc không đủ số dư');
        if (!this.isTransientPurchaseFailure(lastMessage) || attempt >= maxAttempts) {
          throw new Error(lastMessage);
        }

        this.logStatus(`[SMSPool] Pool ${country.name} đang bận (${lastMessage}). Chờ ${Math.round(retryDelayMs / 1000)}s rồi thử thuê lại (${attempt}/${maxAttempts})...`);
        const shouldContinue = await this.sleep(retryDelayMs, shouldStop, (remainingMs) => {
          if (remainingMs > 0) this.logStatus(`[SMSPool] Vẫn đang chờ pool ${country.name}; còn khoảng ${Math.round(remainingMs / 1000)}s...`);
        });
        if (!shouldContinue) throw new Error('SMSPool request stopped');
      } catch (error) {
        lastMessage = this.stripHtml(error.message || lastMessage || 'SMSPool purchase failed');
        if (!this.isTransientPurchaseFailure(lastMessage) || attempt >= maxAttempts) {
          throw new Error(`SMSPool API Error: ${lastMessage}`);
        }

        this.logStatus(`[SMSPool] Thuê số ${country.name} lỗi tạm thời (${lastMessage}). Chờ ${Math.round(retryDelayMs / 1000)}s rồi thử lại (${attempt}/${maxAttempts})...`);
        const shouldContinue = await this.sleep(retryDelayMs, shouldStop, (remainingMs) => {
          if (remainingMs > 0) this.logStatus(`[SMSPool] Vẫn đang chờ pool ${country.name}; còn khoảng ${Math.round(remainingMs / 1000)}s...`);
        });
        if (!shouldContinue) throw new Error('SMSPool API Error: SMSPool request stopped');
      }
    }

    throw new Error(`SMSPool API Error: ${lastMessage || 'Không thuê được số SMS mới'}`);
  }

  classifyResendFailure(message = '') {
    const normalized = `${message || ''}`.toLowerCase();
    if (/expired|archive|archived|not active|completed|already completed|too old/i.test(normalized)) {
      return { reasonCode: 'expired', permanent: true };
    }
    if (/not found|does not exist|unknown order|order.*missing|no order/i.test(normalized)) {
      return { reasonCode: 'not_found', permanent: true };
    }
    if (/invalid.*order|invalid.*id|orderid|order id|bad order/i.test(normalized)) {
      return { reasonCode: 'invalid_order', permanent: true };
    }
    if (/only\s+re-?send\s+to\s+a\s+phonenumber\s+that\s+has\s+received\s+a\s+sms|only\s+resend\s+to\s+a\s+phonenumber\s+that\s+has\s+received\s+a\s+sms|has\s+received\s+a\s+sms/i.test(normalized)) {
      return { reasonCode: 'no_received_sms_for_resend', permanent: true };
    }
    if (/timeout|timed out/i.test(normalized)) {
      return { reasonCode: 'api_timeout', permanent: false };
    }
    if (/stopped|aborted/i.test(normalized)) {
      return { reasonCode: 'stopped', permanent: false };
    }
    if (/rate limit|too many|try again later/i.test(normalized)) {
      return { reasonCode: 'rate_limited', permanent: false };
    }
    return { reasonCode: 'resend_failed', permanent: false };
  }

  async resendSMSDetailed(orderId, shouldStop = () => false) {
    const url = `https://api.smspool.net/sms/resend?key=${this.apiKey}&orderid=${orderId}`;
    try {
      const res = await this.fetchJson(url, { timeoutMs: 15000, shouldStop });
      if (res.success) {
        const message = res.message || 'SMSPool resend accepted';
        console.log(`[SMSPool] ♻️ Đã yêu cầu Resend cho Order ID: ${orderId}`);
        return { ok: true, message, raw: res, reasonCode: 'ok', permanent: false };
      }

      const message = res.message || res.error || res.status || 'SMSPool resend failed without message';
      const classification = this.classifyResendFailure(message);
      return { ok: false, message: `${message}`, raw: res, ...classification };
    } catch (error) {
      const message = error.message || 'SMSPool resend request failed';
      const classification = this.classifyResendFailure(message);
      return { ok: false, message, raw: null, ...classification };
    }
  }

  async resendSMS(orderId, shouldStop = () => false) {
    const result = await this.resendSMSDetailed(orderId, shouldStop);
    return result.ok;
  }

  async getCode(orderId, shouldStop = () => false) {
    const url = `https://api.smspool.net/sms/check?key=${this.apiKey}&orderid=${orderId}`;
    for (let i = 0; i < 18; i += 1) {
      if (this.isStopped(shouldStop)) return null;
      try {
        const res = await this.fetchJson(url, { timeoutMs: 10000, shouldStop });
        if (res.status === 3 && res.sms) return res.sms;
      } catch {
        // ignore transient check failures
      }
      const shouldContinue = await this.sleep(5000, shouldStop);
      if (!shouldContinue) return null;
    }
    return null;
  }
}
