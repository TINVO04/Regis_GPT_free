import fs from 'fs';
import path from 'path';

export class RuntimeLogger {
  constructor({ logDir, onLog = null, getLabel = null } = {}) {
    this.logDir = logDir;
    this.onLog = typeof onLog === 'function' ? onLog : null;
    this.getLabel = typeof getLabel === 'function' ? getLabel : null;
    this.lastLogMessage = '';
    this.lastLogAt = 0;
  }

  log(message, level = null) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const label = (this.getLabel && this.getLabel()) || level || 'INFO';
    const logLine = `[${timestamp}] [${label}] ${message}`;

    if (message === this.lastLogMessage && Date.now() - this.lastLogAt < 4000) return;
    this.lastLogMessage = message;
    this.lastLogAt = Date.now();

    if (this.onLog) this.onLog(logLine);
    else console.log(logLine);

    const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const logFileName = `log-${dateStr}.txt`;
    fs.appendFileSync(path.join(this.logDir, logFileName), `${logLine}\n`, 'utf-8');
  }
}
