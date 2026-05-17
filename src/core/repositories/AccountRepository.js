import fs from 'fs';

export class AccountRepository {
  constructor(accountsFile) {
    this.accountsFile = accountsFile;
  }

  parseAccounts() {
    if (!fs.existsSync(this.accountsFile)) return [];
    try {
      return fs.readFileSync(this.accountsFile, 'utf-8')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split('|');
          return {
            email: parts[0] || '',
            password: parts[1] || '',
            status: parts[2] || '',
            raw: line,
          };
        })
        .filter((account) => account.email && account.password);
    } catch {
      return [];
    }
  }

  getAccountsByStatus(status, limit = 0) {
    const target = `${status || ''}`.trim().toLowerCase();
    if (!target) return [];
    const accounts = this.parseAccounts()
      .filter((account) => `${account.status || ''}`.trim().toLowerCase() === target)
      .map(({ email, password, status: accountStatus }) => ({ email, password, status: accountStatus }));
    const safeLimit = Number.parseInt(limit, 10) || 0;
    return safeLimit > 0 ? accounts.slice(0, safeLimit) : accounts;
  }

  getPendingAccounts() {
    return this.getAccountsByStatus('pending');
  }

  saveAccount(email, password, status = 'pending') {
    const target = `${email || ''}`.trim().toLowerCase();
    if (!target) return false;

    const lineToSave = `${email}|${password}|${status}`;
    if (!fs.existsSync(this.accountsFile)) {
      fs.writeFileSync(this.accountsFile, `${lineToSave}\n`, 'utf-8');
      return true;
    }

    const lines = fs.readFileSync(this.accountsFile, 'utf-8').split('\n');
    let found = false;
    const nextLines = lines.map((line) => {
      if (!line.trim()) return line;
      const parts = line.split('|');
      const lineEmail = `${parts[0] || ''}`.trim().toLowerCase();
      if (lineEmail === target) {
        found = true;
        return lineToSave;
      }
      return line;
    });

    if (!found) nextLines.push(lineToSave);
    fs.writeFileSync(this.accountsFile, `${nextLines.filter((line) => line.trim()).join('\n')}\n`, 'utf-8');
    return true;
  }

  updateAccountStatus(email, newStatus) {
    if (!fs.existsSync(this.accountsFile)) return false;
    const lines = fs.readFileSync(this.accountsFile, 'utf-8').split('\n');
    const target = `${email || ''}`.trim().toLowerCase();
    let found = false;
    const newLines = lines.map((line) => {
      const parts = line.split('|');
      const lineEmail = `${parts[0] || ''}`.trim().toLowerCase();
      if (lineEmail === target) {
        found = true;
        return `${parts[0]}|${parts[1]}|${newStatus}`;
      }
      return line;
    });
    fs.writeFileSync(this.accountsFile, newLines.join('\n'));
    return found;
  }

  deleteAccount(email) {
    if (!fs.existsSync(this.accountsFile)) return false;
    const target = `${email || ''}`.trim().toLowerCase();
    if (!target) return false;
    const lines = fs.readFileSync(this.accountsFile, 'utf-8').split('\n');
    const nextLines = lines.filter((line) => {
      if (!line.trim()) return false;
      const [lineEmail] = line.split('|');
      return `${lineEmail || ''}`.trim().toLowerCase() !== target;
    });
    fs.writeFileSync(this.accountsFile, nextLines.length ? `${nextLines.join('\n')}\n` : '', 'utf-8');
    return nextLines.length !== lines.filter((line) => line.trim()).length;
  }
}
