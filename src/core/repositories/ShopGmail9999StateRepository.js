import fs from 'fs';
import path from 'path';

export class ShopGmail9999StateRepository {
  constructor(stateFile) {
    this.stateFile = stateFile;
  }

  ensureFile() {
    const dir = path.dirname(this.stateFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.stateFile)) fs.writeFileSync(this.stateFile, '{}', 'utf-8');
  }

  load() {
    this.ensureFile();
    try {
      const parsed = JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'));
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  save(state) {
    this.ensureFile();
    fs.writeFileSync(this.stateFile, JSON.stringify(state || {}, null, 2), 'utf-8');
  }

  getOrderByEmail(email) {
    const state = this.load();
    return state[`${email || ''}`.trim().toLowerCase()] || null;
  }

  upsertOrder(email, order = {}) {
    const key = `${email || order.email || ''}`.trim().toLowerCase();
    if (!key) return null;
    const now = new Date();
    const state = this.load();
    const createdAt = order.createdAt || now.toISOString();
    const expiresAt = order.expiresAt || new Date(new Date(createdAt).getTime() + 10 * 60 * 1000).toISOString();
    state[key] = {
      ...(state[key] || {}),
      email: order.email || key,
      orderId: order.orderId || order.orderid || state[key]?.orderId || '',
      service: order.service || state[key]?.service || 'chatgpt',
      status: order.status || state[key]?.status || 'created',
      createdAt,
      expiresAt,
      updatedAt: now.toISOString(),
      lastOtp: order.lastOtp || state[key]?.lastOtp || '',
    };
    this.save(state);
    return state[key];
  }

  markVerified(email, otp = '') {
    return this.upsertOrder(email, { status: 'verified', lastOtp: otp });
  }

  markExpired(email) {
    return this.upsertOrder(email, { status: 'expired' });
  }
}
