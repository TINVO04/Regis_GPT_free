import fs from 'fs';
import path from 'path';

export class HotmailAccountRepository {
  constructor(accountsFile) {
    this.accountsFile = accountsFile;
  }

  ensureFile() {
    const dir = path.dirname(this.accountsFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.accountsFile)) fs.writeFileSync(this.accountsFile, '', 'utf-8');
  }

  validStatuses() {
    return new Set(['mail_ready', 'pending', 'verify', 'error']);
  }

  normalizeStatus(value, fallback = 'mail_ready') {
    const status = `${value || ''}`.trim().toLowerCase();
    return this.validStatuses().has(status) ? status : fallback;
  }

  getTotpStatusCandidate(parts = []) {
    if (!Array.isArray(parts)) return '';
    const candidate = `${parts[3] || ''}`.trim();
    return this.validStatuses().has(candidate.toLowerCase()) ? candidate : '';
  }

  normalizeTotpSecret(value = '') {
    return `${value || ''}`.replace(/\s+/g, '').toUpperCase();
  }

  isLikelyTotpSecret(value = '') {
    const secret = this.normalizeTotpSecret(value);
    return secret.length >= 16 && /^[A-Z2-7]+=*$/.test(secret);
  }

  parseLine(line, index = 0) {
    const raw = `${line || ''}`.trim();
    if (!raw) return null;

    const pipeParts = raw.includes('|') ? raw.split('|').map((part) => part.trim()) : null;
    const spaceParts = !pipeParts ? raw.split(/\s+/).map((part) => part.trim()).filter(Boolean) : null;
    const parts = pipeParts || spaceParts || [];
    if (parts.length < 2) return null;

    const [email = '', password = '', third = '', fourth = ''] = parts;
    if (!email || !password) return null;

    const isTotpFormat = parts.length >= 3 && !parts[3] && this.isLikelyTotpSecret(third);
    const isTotpFormatWithStatus = parts.length >= 4 && this.isLikelyTotpSecret(third) && this.validStatuses().has(`${parts[3] || ''}`.trim().toLowerCase());
    if (isTotpFormat || isTotpFormatWithStatus) {
      return {
        id: `${index + 1}-${email}`,
        index: index + 1,
        email,
        password,
        refreshToken: '',
        clientId: '',
        recoveryEmail: '',
        totpSecret: this.normalizeTotpSecret(third),
        accountType: 'totp',
        status: this.normalizeStatus(this.getTotpStatusCandidate(parts), 'mail_ready'),
      };
    }

    const refreshToken = third;
    const clientId = fourth;
    const fifth = parts[4] || '';
    const sixth = parts[5] || '';
    const fifthIsStatus = this.validStatuses().has(fifth.toLowerCase());
    const sixthIsStatus = this.validStatuses().has(sixth.toLowerCase());
    const recoveryEmail = fifth && !fifthIsStatus ? fifth : '';
    const status = fifthIsStatus ? this.normalizeStatus(fifth) : this.normalizeStatus(sixthIsStatus ? sixth : '', 'mail_ready');

    return {
      id: `${index + 1}-${email}`,
      index: index + 1,
      email,
      password,
      refreshToken,
      clientId,
      recoveryEmail,
      totpSecret: '',
      accountType: 'oauth2',
      status,
    };
  }

  serializeRow(row = {}) {
    const email = `${row.email || row.mail || ''}`.trim();
    const password = `${row.password || row.pass || ''}`.trim();
    const refreshToken = `${row.refreshToken || row.refresh_token || ''}`.trim();
    const clientId = `${row.clientId || row.client_id || ''}`.trim();
    const recoveryEmail = `${row.recoveryEmail || row.recovery_email || ''}`.trim();
    const totpSecret = this.normalizeTotpSecret(row.totpSecret || row.totp_secret || '');
    const status = this.normalizeStatus(row.status || 'mail_ready');
    const accountType = `${row.accountType || row.account_type || ''}`.trim().toLowerCase() || (totpSecret ? 'totp' : 'oauth2');
    if (!email || !password) return '';
    if (accountType === 'totp' && totpSecret) return `${email}|${password}|${totpSecret}|${status}`;
    if (recoveryEmail) return `${email}|${password}|${refreshToken}|${clientId}|${recoveryEmail}|${status}`;
    return `${email}|${password}|${refreshToken}|${clientId}|${status}`;
  }

  list() {
    this.ensureFile();
    const lines = fs.readFileSync(this.accountsFile, 'utf-8').split('\n').filter(Boolean);
    return lines.map((line, index) => this.parseLine(line, index)).filter(Boolean);
  }

  isRunnableStatus(status) {
    const value = `${status || ''}`.trim().toLowerCase();
    return value === 'pending';
  }

  countRunnable() {
    return this.list().filter((row) => this.isRunnableStatus(row.status)).length;
  }

  getReadyMailAccounts(limit = Number.MAX_SAFE_INTEGER) {
    const safeLimit = Math.max(1, Number.parseInt(limit, 10) || Number.MAX_SAFE_INTEGER);
    return this.list()
      .filter((row) => `${row.status || ''}`.trim().toLowerCase() === 'mail_ready')
      .slice(0, safeLimit);
  }

  getPendingAccounts(limit = Number.MAX_SAFE_INTEGER) {
    const safeLimit = Math.max(1, Number.parseInt(limit, 10) || Number.MAX_SAFE_INTEGER);
    return this.list()
      .filter((row) => this.isRunnableStatus(row.status))
      .slice(0, safeLimit);
  }

  findByEmail(email) {
    const target = `${email || ''}`.trim().toLowerCase();
    if (!target) return null;
    return this.list().find((row) => row.email.toLowerCase() === target) || null;
  }

  isSupportedHotmailDomain(email) {
    return /@(hotmail\.com|outlook\.[a-z.]+|live\.[a-z.]+)$/i.test(`${email || ''}`.trim());
  }

  appendManualAccounts(text = '', defaultStatus = 'mail_ready') {
    this.ensureFile();
    const currentRows = this.list();
    const seen = new Set(currentRows.map((row) => row.email.toLowerCase()));
    const added = [];
    const skipped = [];
    const rejected = [];
    const lines = `${text || ''}`.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    lines.forEach((line, lineIndex) => {
      const rowNumber = lineIndex + 1;
      const parsed = this.parseLine(line, currentRows.length + added.length);
      const parts = line.includes('|')
        ? line.split('|').map((part) => part.trim()).filter(Boolean)
        : line.split(/\s+/).map((part) => part.trim()).filter(Boolean);

      if (!parsed?.email || !parsed?.password) {
        rejected.push({ line: rowNumber, email: parts[0] || '', reason: 'missing_required_fields' });
        return;
      }

      if (parsed.accountType === 'oauth2') {
        if (parts.length < 4 || !parsed.refreshToken || !parsed.clientId) {
          rejected.push({ line: rowNumber, email: parsed.email, reason: 'missing_oauth_fields' });
          return;
        }
      }

      if (parsed.accountType === 'totp' && !this.isLikelyTotpSecret(parsed.totpSecret)) {
        rejected.push({ line: rowNumber, email: parsed.email, reason: 'invalid_totp_secret' });
        return;
      }

      if (!this.isSupportedHotmailDomain(parsed.email)) {
        rejected.push({ line: rowNumber, email: parsed.email, reason: 'unsupported_mail_domain' });
        return;
      }

      const key = parsed.email.toLowerCase();
      if (seen.has(key)) {
        skipped.push({ line: rowNumber, email: parsed.email, reason: 'duplicate_email' });
        return;
      }

      seen.add(key);
      added.push({
        ...parsed,
        id: `${currentRows.length + added.length + 1}-${parsed.email}`,
        index: currentRows.length + added.length + 1,
        status: this.normalizeStatus(parsed.status || defaultStatus, this.normalizeStatus(defaultStatus)),
      });
    });

    if (added.length > 0) this.saveRows([...currentRows, ...added]);
    return { added, skipped, rejected, total: currentRows.length + added.length };
  }

  appendPurchasedAccounts(lines = []) {
    this.ensureFile();
    const currentRows = this.list();
    const seen = new Set(currentRows.map((row) => row.email.toLowerCase()));
    const added = [];
    const rejected = [];

    for (const line of lines) {
      const parsed = this.parseLine(line, currentRows.length + added.length);
      if (!parsed?.email || !parsed?.password) {
        rejected.push({ line, reason: 'missing_email_or_password' });
        continue;
      }
      if (!parsed.refreshToken || !parsed.clientId) {
        rejected.push({ line, reason: 'missing_oauth_fields' });
        continue;
      }
      const key = parsed.email.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      parsed.status = 'mail_ready';
      parsed.accountType = 'oauth2';
      parsed.totpSecret = '';
      added.push(parsed);
    }

    if (added.length > 0) this.saveRows([...currentRows, ...added]);
    return { added, rejected, total: currentRows.length + added.length };
  }

  saveRows(rows = []) {
    this.ensureFile();
    if (!Array.isArray(rows)) throw new Error('Hotmail accounts payload không hợp lệ.');
    const content = rows.map((row) => this.serializeRow(row)).filter(Boolean).join('\n');
    const tmpFile = `${this.accountsFile}.tmp`;
    fs.writeFileSync(tmpFile, content ? `${content}\n` : '', 'utf-8');
    fs.renameSync(tmpFile, this.accountsFile);
  }

  updateAccountStatus(email, newStatus) {
    this.ensureFile();
    const target = `${email || ''}`.trim().toLowerCase();
    if (!target) return false;
    let changed = false;
    const rows = this.list().map((row) => {
      if (row.email.toLowerCase() !== target) return row;
      changed = true;
      return { ...row, status: newStatus };
    });
    if (changed) this.saveRows(rows);
    return changed;
  }

  deleteAccount(email) {
    this.ensureFile();
    const target = `${email || ''}`.trim().toLowerCase();
    if (!target) return false;
    let removed = false;
    const rows = this.list().filter((row) => {
      const shouldRemove = row.email.toLowerCase() === target;
      if (shouldRemove) removed = true;
      return !shouldRemove;
    });
    if (removed) this.saveRows(rows);
    return removed;
  }

  markPending(email) {
    return this.updateAccountStatus(email, 'pending');
  }

  markVerify(email) {
    return this.updateAccountStatus(email, 'verify');
  }

  markError(email) {
    return this.updateAccountStatus(email, 'error');
  }
}
