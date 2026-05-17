import fs from 'fs';
import path from 'path';

export class AuthStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.ensureFile();
  }

  ensureFile() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({ authenticated: false }, null, 2), 'utf-8');
    }
  }

  read() {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : { authenticated: false };
    } catch {
      return { authenticated: false };
    }
  }

  save(session) {
    const payload = {
      authenticated: true,
      ...session,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(this.filePath, JSON.stringify(payload, null, 2), 'utf-8');
    return payload;
  }

  clear() {
    const payload = { authenticated: false, updatedAt: new Date().toISOString() };
    fs.writeFileSync(this.filePath, JSON.stringify(payload, null, 2), 'utf-8');
    return payload;
  }
}
