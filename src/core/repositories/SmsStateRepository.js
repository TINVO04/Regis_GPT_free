import fs from 'fs';

export class SmsStateRepository {
  constructor(smsStateFile) {
    this.smsStateFile = smsStateFile;
  }

  load() {
    if (!fs.existsSync(this.smsStateFile)) return [];
    try {
      const data = JSON.parse(fs.readFileSync(this.smsStateFile, 'utf-8'));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  save(items) {
    fs.writeFileSync(this.smsStateFile, JSON.stringify(items, null, 2));
  }
}
