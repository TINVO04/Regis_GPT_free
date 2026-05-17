export class SMSPoolService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  isStopped(shouldStop) {
    return typeof shouldStop === 'function' && shouldStop();
  }

  async sleep(ms, shouldStop = () => false) {
    const stepMs = 250;
    let elapsedMs = 0;
    while (elapsedMs < ms) {
      if (this.isStopped(shouldStop)) return false;
      const waitMs = Math.min(stepMs, ms - elapsedMs);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      elapsedMs += waitMs;
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

  async buyNumber(shouldStop = () => false) {
    const url = `https://api.smspool.net/purchase/sms?key=${this.apiKey}&service=671&country=1&max_price=0.07`;
    try {
      const res = await this.fetchJson(url, { timeoutMs: 15000, shouldStop });
      if (res.success) {
        console.log(`[SMSPool] Đã thuê số mới: +${res.cc}${res.phonenumber} (ID: ${res.orderid})`);
        return res;
      }
      throw new Error(res.message || 'Hết số hoặc không đủ số dư');
    } catch (error) {
      throw new Error(`SMSPool API Error: ${error.message}`);
    }
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
