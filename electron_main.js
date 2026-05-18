import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { runCreator, stopCreator, forceStopCreator, ChatGPTAccountCreatorCore } from './account_creator_core.js';
import { MailOtpService } from './src/core/services/MailOtpService.js';
import { HistoryStore } from './history_store.js';
import {
  getBundledChromiumExecutablePath,
  getBundledFirefoxExecutablePath,
  resolveBundledBrowsersDir,
  describeBundledBrowsersDirSource,
} from './src/shared/browserPaths.js';
import { ensureDir, ensureFile, readJsonFile } from './src/shared/fsUtils.js';
import { deployVercelRelay } from './src/core/vercelRelayService.js';
import { SMSPoolService } from './src/core/services/SMSPoolService.js';
import { ClonemupService } from './src/core/services/ClonemupService.js';
import { KhommoService } from './src/core/services/KhommoService.js';
import { ShopGmail9999Service } from './src/core/services/ShopGmail9999Service.js';
import { HotmailAccountRepository } from './src/core/repositories/HotmailAccountRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRootDir = path.resolve(__dirname);
const APP_VERSION = app.getVersion();
const PUBLIC_UPDATE_REPO_OWNER = 'NDuyPhuc';
const PUBLIC_UPDATE_REPO_NAME = 'CodexAccountStudio-Releases';
const PUBLIC_RELEASES_URL = `https://github.com/${PUBLIC_UPDATE_REPO_OWNER}/${PUBLIC_UPDATE_REPO_NAME}/releases`;

let mainWindow = null;
let activeRun = null;
let isRunning = false;
let runMeta = null;
let latestRunFailure = null;
let workspaceState = null;
let preflightState = null;
let authState = {
  authenticated: true,
  loading: false,
};
let updateState = {
  checking: false,
  available: false,
  downloading: false,
  downloaded: false,
  currentVersion: APP_VERSION,
  latestVersion: APP_VERSION,
  releaseName: '',
  releaseDate: '',
  releaseNotes: [],
  progressPercent: 0,
  progressTransferred: 0,
  progressTotal: 0,
  bytesPerSecond: 0,
  checkedAt: '',
  downloadedAt: '',
  setupExePath: '',
  runningExePath: process.execPath,
  releaseUrl: PUBLIC_RELEASES_URL,
  error: '',
};
let updaterReady = false;
let updaterInitialized = false;

const userDataDir = app.getPath('userData');
const historyStore = new HistoryStore(path.join(userDataDir, 'run_history.json'));
const workspaceStateFile = path.join(userDataDir, 'workspace_state.json');
const defaultWorkspaceDir = path.join(userDataDir, 'workspace');
const bundledUrbanVpnExtensionDir = path.join(appRootDir, 'vendor', 'extensions', 'urban-vpn');

function hasValidExtensionManifest(extensionPath) {
  return Boolean(extensionPath && fs.existsSync(path.join(extensionPath, 'manifest.json')));
}

function resolveUrbanVpnExtensionPath(config = {}) {
  const configuredPath = `${config.vpn_extension_path || ''}`.trim();
  if (configuredPath) return path.resolve(configuredPath);
  return bundledUrbanVpnExtensionDir;
}

function sendToRenderer(channel, payload) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send(channel, payload);
}

function saveWorkspaceState() {
  ensureDir(path.dirname(workspaceStateFile));
  fs.writeFileSync(workspaceStateFile, JSON.stringify(workspaceState, null, 2), 'utf-8');
}

function buildWorkspaceFromDir(dirPath) {
  const workspaceDir = path.resolve(dirPath);
  return {
    workspaceDir,
    accountsFile: path.join(workspaceDir, 'accounts.txt'),
    hotmailAccountsFile: path.join(workspaceDir, 'accounts-hotmail.txt'),
    configFile: path.join(workspaceDir, 'config.json'),
    smsStateFile: path.join(workspaceDir, 'sms_state.json'),
    proxyPoolsFile: path.join(workspaceDir, 'proxy_pools.json'),
    logDir: workspaceDir,
  };
}

function getWorkspaceDataFilePath(kind) {
  if (!workspaceState) throw new Error('Workspace chưa sẵn sàng.');

  switch (`${kind || ''}`.trim().toLowerCase()) {
    case 'accounts':
      return workspaceState.accountsFile;
    case 'sms':
      return workspaceState.smsStateFile;
    case 'hotmail':
      return workspaceState.hotmailAccountsFile;
    case 'proxy':
      return workspaceState.proxyPoolsFile;
    default:
      throw new Error('Loại data không hợp lệ.');
  }
}

function ensureWorkspaceFiles(state) {
  ensureDir(state.workspaceDir);
  ensureFile(state.accountsFile, '');
  ensureFile(state.hotmailAccountsFile, '');
  ensureFile(state.smsStateFile, '[]');
  ensureFile(state.proxyPoolsFile, '[]');
  ensureFile(
    state.configFile,
    JSON.stringify(
      {
        max_workers: 3,
        headless: false,
        slow_mo: 1000,
        timeout: 30000,
        password: '@1234567890a',
        router_password: '123456',
        selected_mail_domain: 'thangterter.online',
        random_mail_domain: false,
        mail_domains: [
          'otpmail.online',
          'crossabc.site',
          '999ai.org',
          'hungzero.co.uk',
          'cutongman.online',
          'nguyenvantruong.io.vn',
          'thangterter.online',
          'mail1h.com',
          'edumail.ovh',
          'hotmail',
          'hotmail-khommo',
          'gmail-shopgmail9999',
        ],
        clonemup_api_key: '',
        clonemup_hotmail_product_id: 7614,
        khommo_api_key: '',
        khommo_hotmail_product_id: 7511,
        vpn_enabled: true,
        vpn_extension_path: '',
        verify_provider: '9router',
        cliproxyapi_auth_url: '',
        cliproxyapi_executable_path: '',
        cliproxyapi_config_path: '',
        cpl_test_card_number: '',
        cpl_test_card_expiry: '',
        cpl_test_card_cvc: '',
      },
      null,
      2,
    ),
  );
}

function emitUpdateChanged() {
  sendToRenderer('update:changed', updateState);
}

function setAuthState(patch) {
  authState = {
    ...authState,
    ...patch,
  };
}

function setUpdateState(patch) {
  updateState = {
    ...updateState,
    ...patch,
    runningExePath: process.execPath,
  };
  emitUpdateChanged();
}

function toPreflightCheck(id, label, ok, severity, detail, fix) {
  return {
    id,
    label,
    ok,
    severity,
    detail,
    fix,
  };
}

function buildPreflightState() {
  const bundledBrowsersDir = resolveBundledBrowsersDir(appRootDir);
  const bundledBrowsersSource = describeBundledBrowsersDirSource(appRootDir);
  const checks = [
    toPreflightCheck(
      'workspace_dir',
      'Workspace directory',
      Boolean(workspaceState?.workspaceDir && fs.existsSync(workspaceState.workspaceDir)),
      'fatal',
      workspaceState?.workspaceDir
        ? `Workspace: ${workspaceState.workspaceDir}`
        : 'Chưa có thư mục workspace.',
      'Chọn lại thư mục dữ liệu hợp lệ trước khi chạy.',
    ),
    toPreflightCheck(
      'accounts_file',
      'accounts.txt',
      Boolean(workspaceState?.accountsFile && fs.existsSync(workspaceState.accountsFile)),
      'warning',
      workspaceState?.accountsFile || 'accounts.txt chưa có đường dẫn.',
      'Kiểm tra workspace hoặc tạo accounts.txt nếu cần import tài khoản.',
    ),
    toPreflightCheck(
      'sms_state_file',
      'sms_state.json',
      Boolean(workspaceState?.smsStateFile && fs.existsSync(workspaceState.smsStateFile)),
      'warning',
      workspaceState?.smsStateFile || 'sms_state.json chưa có đường dẫn.',
      'Tạo hoặc restore sms_state.json trong workspace.',
    ),
    toPreflightCheck(
      'config_file',
      'config.json',
      Boolean(workspaceState?.configFile && fs.existsSync(workspaceState.configFile)),
      'fatal',
      workspaceState?.configFile || 'config.json chưa có đường dẫn.',
      'Tạo hoặc restore config.json trong workspace.',
    ),
    toPreflightCheck(
      'bundled_firefox',
      'Bundled Firefox',
      Boolean(getBundledFirefoxExecutablePath(bundledBrowsersDir)),
      'fatal',
      getBundledFirefoxExecutablePath(bundledBrowsersDir) || `Thiếu Firefox trong ${bundledBrowsersDir}`,
      'Build lại app sau khi chạy npm run install-browsers.',
    ),
    toPreflightCheck(
      'bundled_chromium',
      'Bundled Chromium',
      Boolean(getBundledChromiumExecutablePath(bundledBrowsersDir)),
      'fatal',
      getBundledChromiumExecutablePath(bundledBrowsersDir) || `Thiếu Chromium trong ${bundledBrowsersDir}`,
      'Build lại app sau khi chạy npm run install-browsers.',
    ),
  ];

  if (process.platform === 'linux') {
    const hasGuiSession = Boolean(process.env.DISPLAY || process.env.WAYLAND_DISPLAY);
    checks.push(
      toPreflightCheck(
        'linux_gui_session',
        'Linux GUI session',
        hasGuiSession,
        'fatal',
        hasGuiSession
          ? `DISPLAY=${process.env.DISPLAY || ''} WAYLAND_DISPLAY=${process.env.WAYLAND_DISPLAY || ''}`
          : 'Không thấy DISPLAY/WAYLAND_DISPLAY. App cần desktop session để mở browser headful.',
        'Mở app trong Ubuntu Desktop session, hoặc cấu hình Xvfb nếu chạy server/headless.',
      ),
    );
  }

  const config = workspaceState?.configFile ? readJsonFile(workspaceState.configFile, {}) : {};
  const vpnEnabled = config.vpn_enabled !== false;
  const vpnExtensionPath = resolveUrbanVpnExtensionPath(config);
  checks.push(
    toPreflightCheck(
      'urban_vpn_extension',
      'Urban VPN extension',
      !vpnEnabled || hasValidExtensionManifest(vpnExtensionPath),
      'warning',
      vpnEnabled
        ? `VPN bật. Extension path: ${vpnExtensionPath}`
        : 'VPN tắt. Browser sẽ không load Urban VPN extension.',
      'Copy Urban VPN unpacked extension vào vendor/extensions/urban-vpn hoặc nhập path chứa manifest.json.',
    ),
  );

  const fatalChecks = checks.filter((check) => !check.ok && check.severity === 'fatal');
  const warningChecks = checks.filter((check) => !check.ok && check.severity === 'warning');
  const status = fatalChecks.length > 0 ? 'fatal' : warningChecks.length > 0 ? 'warning' : 'ok';

  return {
    checkedAt: new Date().toISOString(),
    status,
    canRun: fatalChecks.length === 0,
    summary:
      status === 'ok'
        ? 'Ready: mọi kiểm tra critical đã pass.'
        : status === 'warning'
          ? 'Warning: app vẫn có thể chạy nhưng có mục cần kiểm tra.'
          : 'Blocked: thiếu runtime hoặc workspace critical.',
    bundledBrowsersDir,
    bundledBrowsersSource,
    checks,
  };
}

function refreshPreflightState() {
  preflightState = buildPreflightState();
  return preflightState;
}

function emitPreflightChanged() {
  refreshPreflightState();
  sendToRenderer('preflight:changed', preflightState);
}

function buildFailureDialogDetail(failure) {
  if (!failure) return 'Không có dữ liệu chẩn đoán.';
  return [
    `Step: ${failure.step || 'n/a'}`,
    `Action: ${failure.action || 'n/a'}`,
    `Selector: ${failure.selector || 'n/a'}`,
    `URL: ${failure.url || 'n/a'}`,
    `Title: ${failure.title || 'n/a'}`,
    `Screenshot: ${failure.screenshotPath || 'n/a'}`,
    `HTML: ${failure.htmlPath || 'n/a'}`,
    `JSON: ${failure.diagnosticPath || 'n/a'}`,
    `Error: ${failure.errorMessage || 'n/a'}`,
    failure.extra?.suggestion ? `Suggestion: ${failure.extra.suggestion}` : '',
  ].filter(Boolean).join('\n');
}

async function showFailureDialog(failure) {
  if (!mainWindow || mainWindow.isDestroyed() || !failure) return;
  try {
    await dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Run thất bại',
      message: `Step lỗi: ${failure.step || 'unknown'}`,
      detail: buildFailureDialogDetail(failure),
      buttons: ['OK'],
      noLink: true,
    });
  } catch {
    // ignore dialog errors
  }
}

function loadWorkspaceState() {
  const raw = readJsonFile(workspaceStateFile, null);
  const dirPath = raw?.workspaceDir || defaultWorkspaceDir;
  workspaceState = buildWorkspaceFromDir(dirPath);
  ensureWorkspaceFiles(workspaceState);
  persistWorkspaceConfig();
  saveWorkspaceState();
  refreshPreflightState();
}

function parseAccountsFile(accountsPath) {
  if (!fs.existsSync(accountsPath)) return [];
  try {
    const lines = fs.readFileSync(accountsPath, 'utf-8').split('\n').filter(Boolean);
    return lines.map((line, index) => {
      const [email = '', password = '', status = 'unknown'] = line.split('|');
      return {
        id: `${index + 1}-${email}`,
        index: index + 1,
        email,
        password,
        status,
      };
    });
  } catch {
    return [];
  }
}

function parseSmsStateFile(smsPath) {
  if (!fs.existsSync(smsPath)) return [];
  try {
    const raw = fs.readFileSync(smsPath, 'utf-8');
    const data = JSON.parse(raw);
    const normalized = Array.isArray(data) ? data : data && typeof data === 'object' ? [data] : [];

    return normalized.map((item, index) => ({
      id: `${item.orderId || 'no-order'}-${index + 1}`,
      index: index + 1,
      orderId: item.orderId || '',
      phoneNumber: item.phoneNumber || '',
      usageCount: Number(item.usageCount || 0),
      updatedAt: item.updatedAt || '',
    }));
  } catch {
    return [];
  }
}

function getHotmailRepository() {
  return new HotmailAccountRepository(workspaceState.hotmailAccountsFile);
}

function parseHotmailAccountsFile(hotmailPath) {
  return new HotmailAccountRepository(hotmailPath).list();
}

function getHotmailRunnableCount() {
  return getHotmailRepository().countRunnable();
}

async function buyKhommoHotmailForRun({ apiKey = '', amount = 1, productId = 7511, reason = 'run', status = 'mail_ready' } = {}) {
  const safeApiKey = `${apiKey || ''}`.trim();
  const safeAmount = Math.max(1, Number.parseInt(amount, 10) || 0);
  const requestedProductId = Number.parseInt(productId, 10);
  const safeProductId = [7511, 6000].includes(requestedProductId) ? requestedProductId : 7511;
  if (!safeApiKey) throw new Error('Thiếu Khommo API key để tự mua Hotmail.');
  const service = new KhommoService(safeApiKey);
  sendToRenderer('log:line', { line: `[Khommo] ${reason}: tự mua ${safeAmount} Hotmail product=${safeProductId} vì chưa đủ mail_ready.` });
  const result = await service.buyProductInBatches({
    totalAmount: safeAmount,
    productId: safeProductId,
    batchSize: safeAmount,
    onProgress: (event) => {
      if (event.type === 'batch-start') sendToRenderer('log:line', { line: `[Khommo] Auto-buy batch ${event.batchIndex}/${event.totalBatches}, amount=${event.amount}, attempt=${event.attempt}` });
      if (event.type === 'batch-success') sendToRenderer('log:line', { line: `[Khommo] Auto-buy OK, nhận ${event.received}, trans=${event.transId || 'n/a'}` });
      if (event.type === 'batch-error') sendToRenderer('log:line', { line: `[Khommo] Auto-buy lỗi: ${event.message}` });
    },
  });
  const repo = getHotmailRepository();
  const append = repo.appendPurchasedAccounts(result.lines);
  const normalizedStatus = repo.normalizeStatus(status || 'mail_ready', 'mail_ready');
  if (append.added.length > 0 && normalizedStatus !== 'mail_ready') {
    append.added.forEach((row) => repo.updateAccountStatus(row.email, normalizedStatus));
  }
  sendToRenderer('data:changed', readWorkspaceData());
  if (append.rejected.length > 0) {
    sendToRenderer('log:line', { line: `[Khommo] Auto-buy có ${append.rejected.length} dòng bị bỏ qua do thiếu OAuth fields.` });
  }
  sendToRenderer('log:line', { line: `[Khommo] Auto-buy đã thêm ${append.added.length}/${safeAmount} Hotmail vào accounts-hotmail.txt với status=${normalizedStatus}.` });
  return { ...append, result };
}

function removeHotmailOnOtpExhaustedLog(line = '') {
  const text = `${line || ''}`;
  const match = text.match(/Hotmail code\/messages API không lấy được OTP cho\s+([^\s]+)\s+sau\s+(\d+)\/(\d+)\s+lần thử/i);
  if (!match) return false;
  const [, email, attemptText, maxText] = match;
  const attempts = Number.parseInt(attemptText, 10) || 0;
  const maxRetries = Number.parseInt(maxText, 10) || 0;
  if (!email || attempts < maxRetries || maxRetries < 5) return false;
  const removed = getHotmailRepository().deleteAccount(email);
  if (removed) {
    sendToRenderer('log:line', { line: `[Hotmail] Đã loại ${email} khỏi accounts-hotmail.txt vì chờ OTP hết ${attempts}/${maxRetries} vẫn không có.` });
    sendToRenderer('data:changed', readWorkspaceData());
  }
  return removed;
}

function maskSecret(value, visible = 6) {
  const text = `${value || ''}`;
  if (!text) return '';
  if (text.length <= visible) return '*'.repeat(text.length);
  return `${text.slice(0, visible)}…${text.slice(-4)}`;
}

function serializeHotmailRows(rows = []) {
  const repo = getHotmailRepository();
  return rows.map((row) => repo.serializeRow(row)).filter(Boolean).join('\n');
}

function serializeAccountsRows(rows = []) {
  if (!Array.isArray(rows)) throw new Error('Accounts payload không hợp lệ.');
  return rows
    .map((row) => ({
      email: `${row?.email || ''}`.trim(),
      password: `${row?.password || ''}`.trim(),
      status: `${row?.status || 'pending'}`.trim() || 'pending',
    }))
    .filter((row) => row.email)
    .map((row) => `${row.email}|${row.password}|${row.status}`)
    .join('\n');
}

function serializeSmsRows(rows = []) {
  if (!Array.isArray(rows)) throw new Error('SMS payload không hợp lệ.');
  return rows
    .map((row) => ({
      orderId: `${row?.orderId || ''}`.trim(),
      phoneNumber: `${row?.phoneNumber || ''}`.trim(),
      usageCount: Math.max(0, Number.parseInt(row?.usageCount ?? 0, 10) || 0),
      updatedAt: `${row?.updatedAt || ''}`.trim() || new Date().toISOString(),
    }))
    .filter((row) => row.orderId && row.phoneNumber);
}

function isProxyPoolRunnable(item = {}) {
  const type = `${item.type || ''}`.trim().toLowerCase();
  const apiKey = `${item.kunProxyApiKey || item.kunproxyApiKey || item.kunproxy_api_key || ''}`.trim();
  const apiMeta = `${item.kunProxyOrderCode || item.kunproxyOrderCode || item.kunproxy_order_code || item.kunProxyLoaiProxy || item.kunproxyLoaiProxy || item.kunproxy_loaiproxy || ''}`.trim();
  return Boolean(item.proxyUrl || type === 'kunproxy_api' || apiKey || apiMeta);
}

function parseProxyPoolsFile(proxyPath) {
  if (!fs.existsSync(proxyPath)) return [];
  try {
    const raw = fs.readFileSync(proxyPath, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.map(normalizeProxyPool).filter(isProxyPoolRunnable) : [];
  } catch {
    return [];
  }
}

function normalizeProxyUrlFormat(value) {
  const raw = `${value || ''}`.trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  const parts = raw.split(':');
  if (parts.length === 4) {
    const [host, port, user, pass] = parts.map((part) => part.trim());
    if (host && port && user && pass) {
      return `http://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}`;
    }
  }
  if (parts.length === 2) {
    const [host, port] = parts.map((part) => part.trim());
    if (host && port) return `http://${host}:${port}`;
  }
  return raw;
}

function normalizeProxyPool(item = {}) {
  const now = new Date().toISOString();
  const hasApiKey = Boolean(`${item.kunProxyApiKey || item.kunproxyApiKey || item.kunproxy_api_key || ''}`.trim());
  const hasApiMeta = Boolean(`${item.kunProxyOrderCode || item.kunproxyOrderCode || item.kunproxy_order_code || item.kunProxyLoaiProxy || item.kunproxyLoaiProxy || item.kunproxy_loaiproxy || ''}`.trim());
  const inputType = `${item.type || ''}`.trim().toLowerCase();
  const type = hasApiKey || hasApiMeta || inputType === 'kunproxy_api' ? 'kunproxy_api' : inputType || 'custom';
  return {
    id: `${item.id || `proxy_${Date.now()}_${Math.random().toString(16).slice(2)}`}`,
    name: `${item.name || (type === 'kunproxy_api' ? 'KunProxy API' : 'Proxy Pool')}`.trim(),
    type,
    proxyUrl: normalizeProxyUrlFormat(item.proxyUrl || item.url || ''),
    kunProxyApiKey: `${item.kunProxyApiKey || item.kunproxyApiKey || item.kunproxy_api_key || ''}`.trim(),
    kunProxyOrderCode: `${item.kunProxyOrderCode || item.kunproxyOrderCode || item.kunproxy_order_code || ''}`.trim(),
    kunProxyLoaiProxy: `${item.kunProxyLoaiProxy || item.kunproxyLoaiProxy || item.kunproxy_loaiproxy || ''}`.trim(),
    noProxy: `${item.noProxy || 'localhost,127.0.0.1,internal'}`.trim(),
    active: item.active !== false,
    strict: item.strict === true,
    createdAt: item.createdAt || now,
    updatedAt: now,
  };
}

function serializeProxyPools(rows = []) {
  if (!Array.isArray(rows)) throw new Error('Proxy pools payload không hợp lệ.');
  const normalizedRows = rows.map(normalizeProxyPool);
  const runnableRows = normalizedRows.filter(isProxyPoolRunnable);
  if (rows.length > 0 && runnableRows.length === 0) {
    throw new Error('Không có proxy hợp lệ để lưu. Với proxy API hãy nhập API key và mã đơn hàng/loại proxy.');
  }
  return runnableRows;
}

function parseProxyImportLine(line) {
  const value = `${line || ''}`.trim();
  if (!value) return null;
  return normalizeProxyUrlFormat(value);
}

function getActiveProxyPool() {
  const pools = parseProxyPoolsFile(workspaceState.proxyPoolsFile).filter((item) => item.active && item.proxyUrl);
  return pools[0] || null;
}

function requestText(url, options = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const client = target.protocol === 'https:' ? https : http;
    const req = client.request(target, { method: options.method || 'GET', headers: options.headers || {}, timeout: options.timeoutMs || 15000 }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf-8') }));
    });
    req.on('timeout', () => req.destroy(new Error('Timeout khi test proxy.')));
    req.on('error', reject);
    req.end(options.body);
  });
}

async function resolveKunProxyPool(pool = {}) {
  const normalized = normalizeProxyPool(pool);
  if (normalized.type !== 'kunproxy_api') return normalized;
  if (!normalized.kunProxyApiKey) throw new Error('Thiếu API key proxy.');
  if (!normalized.kunProxyOrderCode && !normalized.kunProxyLoaiProxy) throw new Error('Thiếu mã đơn hàng hoặc loại proxy.');

  const isProxyXoay = /key_xoay|proxy\s*xoay/i.test(`${normalized.kunProxyLoaiProxy} ${normalized.kunProxyOrderCode} ${normalized.name}`);
  if (isProxyXoay) {
    const params = new URLSearchParams({ key: normalized.kunProxyApiKey, live: '5' });
    const url = `https://api.proxyxoay.org/api/key_xoay.php?${params.toString()}`;
    const result = await requestText(url, { timeoutMs: 20000 });
    if (result.status < 200 || result.status >= 300) throw new Error(`ProxyXoay HTTP ${result.status}: ${result.body.slice(0, 160)}`);

    let data;
    try {
      data = JSON.parse(result.body);
    } catch {
      throw new Error(`ProxyXoay trả JSON không hợp lệ: ${result.body.slice(0, 160)}`);
    }

    const proxyUrl = data?.proxyhttp || data?.proxy || data?.proxyhttps || '';
    if (!proxyUrl) throw new Error(`ProxyXoay không trả proxy hợp lệ: ${data?.message || JSON.stringify(data).slice(0, 160)}`);

    return normalizeProxyPool({
      ...normalized,
      proxyUrl,
      name: normalized.name || 'ProxyXoay API',
    });
  }

  const params = new URLSearchParams({ key: normalized.kunProxyApiKey, sukien: 'listproxy' });
  if (normalized.kunProxyOrderCode) params.set('ma_don_hang', normalized.kunProxyOrderCode);
  else params.set('loaiproxy', normalized.kunProxyLoaiProxy);

  const url = `https://app.kunproxy.com/api/proxy.php?${params.toString()}`;
  const result = await requestText(url, { timeoutMs: 20000 });
  if (result.status < 200 || result.status >= 300) throw new Error(`KunProxy HTTP ${result.status}: ${result.body.slice(0, 160)}`);

  let data;
  try {
    data = JSON.parse(result.body);
  } catch {
    throw new Error(`KunProxy trả JSON không hợp lệ: ${result.body.slice(0, 160)}`);
  }

  const rows = Array.isArray(data) ? data : [data];
  const okRows = rows.filter((item) => Number(item?.maloi ?? 0) === 0 && item?.proxy);
  const selected = okRows[0];
  if (!selected) {
    const first = rows[0] || {};
    throw new Error(`KunProxy không trả proxy hợp lệ: ${first?.message || first?.comen || JSON.stringify(first).slice(0, 160)}`);
  }

  return normalizeProxyPool({
    ...normalized,
    proxyUrl: selected.proxy,
    name: normalized.name || `KunProxy ${selected.idproxy || ''}`.trim(),
  });
}

function persistProxyPools(rows = []) {
  fs.writeFileSync(workspaceState.proxyPoolsFile, JSON.stringify(serializeProxyPools(rows), null, 2), 'utf-8');
}

function disableRuntimeProxyPool(pool = {}, reason = '', sendLog = () => {}) {
  const proxyUrl = `${pool.proxyUrl || ''}`.trim();
  const proxyId = `${pool.id || ''}`.trim();
  if (!proxyUrl && !proxyId) return false;

  const storedPools = parseProxyPoolsFile(workspaceState.proxyPoolsFile);
  let disabled = false;
  const nextPools = storedPools.map((item) => {
    const sameProxy = proxyUrl && `${item.proxyUrl || ''}`.trim() === proxyUrl;
    const sameId = proxyId && `${item.id || ''}`.trim() === proxyId;
    if ((sameProxy || sameId) && item.active !== false) {
      disabled = true;
      return { ...item, active: false, updatedAt: new Date().toISOString() };
    }
    return item;
  });

  if (!disabled) return false;
  persistProxyPools(nextPools);
  sendLog(`[Proxy] Disable proxy lỗi runtime "${pool.name || proxyUrl || proxyId}": ${reason || 'proxy runtime error'}`);
  sendToRenderer('data:changed', readWorkspaceData());
  return true;
}

async function prepareProxyPoolsForRun({ sendLog = () => {} } = {}) {
  const storedPools = parseProxyPoolsFile(workspaceState.proxyPoolsFile);
  const nextStoredPools = storedPools.map((item) => ({ ...item }));
  const runnablePools = [];

  for (const pool of storedPools.filter((item) => item.active && item.type !== 'vercel_relay')) {
    try {
      const resolved = pool.type === 'kunproxy_api' ? await resolveKunProxyPool(pool) : normalizeProxyPool(pool);
      if (!resolved.proxyUrl) throw new Error('Không có Proxy URL sau khi resolve.');
      await testProxyPool(resolved);
      await testProxyCanOpenChatGpt(resolved);
      runnablePools.push(resolved);
      sendLog(`[Proxy] OK ${resolved.name || resolved.proxyUrl}: ${resolved.proxyUrl}`);
    } catch (error) {
      const index = nextStoredPools.findIndex((item) => item.id === pool.id);
      if (index >= 0) nextStoredPools[index].active = false;
      sendLog(`[Proxy] Disable proxy lỗi "${pool.name || pool.proxyUrl || pool.id}": ${error.message || error}`);
    }
  }

  persistProxyPools(nextStoredPools);
  if (!runnablePools.length) sendLog('[Proxy] Không còn proxy dùng được. Tool sẽ chạy bằng IP máy.');
  else sendLog(`[Proxy] Sẵn sàng ${runnablePools.length} proxy dùng được cho phiên RUN.`);
  return runnablePools;
}

async function testProxyPool(pool = {}) {
  const startedAt = Date.now();
  const normalized = normalizeProxyPool(pool);
  if (!normalized.proxyUrl) throw new Error('Thiếu Proxy URL.');

  if (normalized.type === 'vercel_relay') {
    const testUrl = `${normalized.proxyUrl}${normalized.proxyUrl.includes('?') ? '&' : '?'}url=${encodeURIComponent('https://api.ipify.org?format=json')}`;
    const result = await requestText(testUrl, { timeoutMs: 20000 });
    if (result.status < 200 || result.status >= 300) throw new Error(`Relay HTTP ${result.status}: ${result.body.slice(0, 160)}`);
    return { ok: true, type: 'vercel_relay', status: result.status, latencyMs: Date.now() - startedAt, body: result.body.slice(0, 300) };
  }

  const proxy = new URL(normalized.proxyUrl);
  const target = 'http://ip-api.com/json/?fields=query,country,regionName,city,isp,org';
  const headers = { Host: 'ip-api.com', 'User-Agent': 'CodexAccountStudio/ProxyTest' };
  if (proxy.username || proxy.password) {
    headers['Proxy-Authorization'] = `Basic ${Buffer.from(`${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`).toString('base64')}`;
  }
  const result = await new Promise((resolve, reject) => {
    const req = http.request({
      host: proxy.hostname,
      port: proxy.port || 80,
      method: 'GET',
      path: target,
      headers,
      timeout: 20000,
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf-8') }));
    });
    req.on('timeout', () => req.destroy(new Error('Timeout khi test proxy.')));
    req.on('error', reject);
    req.end();
  });
  if (result.status < 200 || result.status >= 300) throw new Error(`Proxy HTTP ${result.status}: ${result.body.slice(0, 160)}`);
  return { ok: true, type: 'custom', status: result.status, latencyMs: Date.now() - startedAt, body: result.body.slice(0, 300) };
}

async function testProxyCanOpenChatGpt(pool = {}) {
  const normalized = normalizeProxyPool(pool);
  if (!normalized.proxyUrl || normalized.type === 'vercel_relay') return { ok: true, skipped: true };

  const startedAt = Date.now();
  const proxy = new URL(normalized.proxyUrl);
  const authHeader = proxy.username || proxy.password
    ? `Basic ${Buffer.from(`${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`).toString('base64')}`
    : '';

  const testHost = 'auth.openai.com';
  const result = await new Promise((resolve, reject) => {
    const req = http.request({
      host: proxy.hostname,
      port: proxy.port || 80,
      method: 'CONNECT',
      path: `${testHost}:443`,
      headers: {
        Host: `${testHost}:443`,
        ...(authHeader ? { 'Proxy-Authorization': authHeader } : {}),
      },
      timeout: 15000,
    });

    req.on('connect', (res, socket) => {
      socket.destroy();
      resolve({ status: res.statusCode, statusMessage: res.statusMessage || '' });
    });
    req.on('timeout', () => req.destroy(new Error('Timeout khi kiểm tra proxy vào OpenAI.')));
    req.on('error', reject);
    req.end();
  });

  if (result.status !== 200) {
    throw new Error(`Proxy không mở được ${testHost}: CONNECT ${result.status} ${result.statusMessage}`.trim());
  }

  return { ok: true, type: normalized.type || 'custom', status: result.status, latencyMs: Date.now() - startedAt };
}

function assertCanEditWorkspaceData() {
  if (isRunning) {
    return 'Đang chạy tiến trình. Hãy stop/chờ xong rồi sửa dữ liệu.';
  }
  return '';
}

function readWorkspaceData() {
  ensureWorkspaceFiles(workspaceState);
  const config = readJsonFile(workspaceState.configFile, {});
  const normalizedConfig = {
    ...config,
    cliproxyapi_executable_path: `${config.cliproxyapi_executable_path || getDefaultCliProxyApiExecutablePath()}`.trim(),
    cliproxyapi_config_path: `${config.cliproxyapi_config_path || getDefaultCliProxyApiConfigPath()}`.trim(),
  };
  return {
    workspace: {
      ...workspaceState,
      exists: fs.existsSync(workspaceState.workspaceDir),
    },
    config: normalizedConfig,
    accounts: parseAccountsFile(workspaceState.accountsFile),
    hotmailAccounts: parseHotmailAccountsFile(workspaceState.hotmailAccountsFile),
    hotmailRunnableCount: getHotmailRunnableCount(),
    smsState: parseSmsStateFile(workspaceState.smsStateFile),
    proxyPools: parseProxyPoolsFile(workspaceState.proxyPoolsFile),
  };
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

function normalizeReleaseNotes(input) {
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') {
          return `${item.note || item.text || item.name || ''}`.trim();
        }
        return '';
      })
      .filter(Boolean);
  }

  if (typeof input === 'string') {
    return input
      .split('\n')
      .map((line) => line.replace(/^[-*\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  return [];
}

function getReleaseDate(info) {
  const candidate = info?.releaseDate || info?.releaseDateString || info?.publishedAt || '';
  return `${candidate}`.trim();
}

function markUpdateIdleError(message) {
  setUpdateState({
    checking: false,
    downloading: false,
    downloaded: false,
    available: false,
    currentVersion: APP_VERSION,
    latestVersion: APP_VERSION,
    releaseName: '',
    releaseDate: '',
    releaseNotes: [],
    progressPercent: 0,
    progressTransferred: 0,
    progressTotal: 0,
    bytesPerSecond: 0,
    checkedAt: new Date().toISOString(),
    downloadedAt: '',
    releaseUrl: PUBLIC_RELEASES_URL,
    error: message,
  });
}

function configureAutoUpdater() {
  if (updaterInitialized) return;
  updaterInitialized = true;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false;
  autoUpdater.allowDowngrade = false;

  autoUpdater.on('checking-for-update', () => {
    setUpdateState({
      checking: true,
      downloading: false,
      downloaded: false,
      progressPercent: 0,
      progressTransferred: 0,
      progressTotal: 0,
      bytesPerSecond: 0,
      checkedAt: new Date().toISOString(),
      error: '',
    });
  });

  autoUpdater.on('update-available', (info) => {
    setUpdateState({
      checking: false,
      available: true,
      downloading: false,
      downloaded: false,
      currentVersion: APP_VERSION,
      latestVersion: `${info?.version || APP_VERSION}`.trim() || APP_VERSION,
      releaseName: `${info?.releaseName || info?.version || ''}`.trim(),
      releaseDate: getReleaseDate(info),
      releaseNotes: normalizeReleaseNotes(info?.releaseNotes),
      progressPercent: 0,
      progressTransferred: 0,
      progressTotal: 0,
      bytesPerSecond: 0,
      checkedAt: new Date().toISOString(),
      downloadedAt: '',
      releaseUrl: `${info?.releaseUrl || PUBLIC_RELEASES_URL}`.trim() || PUBLIC_RELEASES_URL,
      error: '',
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    setUpdateState({
      checking: false,
      available: false,
      downloading: false,
      downloaded: false,
      currentVersion: APP_VERSION,
      latestVersion: `${info?.version || APP_VERSION}`.trim() || APP_VERSION,
      releaseName: `${info?.releaseName || ''}`.trim(),
      releaseDate: getReleaseDate(info),
      releaseNotes: normalizeReleaseNotes(info?.releaseNotes),
      progressPercent: 0,
      progressTransferred: 0,
      progressTotal: 0,
      bytesPerSecond: 0,
      checkedAt: new Date().toISOString(),
      downloadedAt: '',
      releaseUrl: `${info?.releaseUrl || PUBLIC_RELEASES_URL}`.trim() || PUBLIC_RELEASES_URL,
      error: '',
    });
  });

  autoUpdater.on('download-progress', (progress) => {
    setUpdateState({
      checking: false,
      available: true,
      downloading: true,
      downloaded: false,
      progressPercent: Number(progress?.percent || 0),
      progressTransferred: Number(progress?.transferred || 0),
      progressTotal: Number(progress?.total || 0),
      bytesPerSecond: Number(progress?.bytesPerSecond || 0),
      error: '',
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    const downloadedFile = info?.downloadedFile || info?.file || info?.path || '';
    setUpdateState({
      checking: false,
      available: true,
      downloading: false,
      downloaded: true,
      latestVersion: `${info?.version || updateState.latestVersion || APP_VERSION}`.trim() || APP_VERSION,
      releaseName: `${info?.releaseName || updateState.releaseName || ''}`.trim(),
      releaseDate: getReleaseDate(info) || updateState.releaseDate,
      releaseNotes: normalizeReleaseNotes(info?.releaseNotes).length > 0 ? normalizeReleaseNotes(info?.releaseNotes) : updateState.releaseNotes,
      progressPercent: 100,
      progressTransferred: updateState.progressTotal || updateState.progressTransferred,
      bytesPerSecond: 0,
      downloadedAt: new Date().toISOString(),
      setupExePath: `${downloadedFile || updateState.setupExePath || ''}`,
      releaseUrl: `${info?.releaseUrl || updateState.releaseUrl || PUBLIC_RELEASES_URL}`.trim() || PUBLIC_RELEASES_URL,
      error: '',
    });
  });

  autoUpdater.on('error', (error) => {
    markUpdateIdleError(error?.message || 'Không kiểm tra được cập nhật.');
  });

  updaterReady = true;
}

async function checkForAppUpdate() {
  if (!updaterReady) {
    markUpdateIdleError('Auto updater chưa sẵn sàng trong môi trường hiện tại.');
    return { ok: false, message: updateState.error, update: updateState };
  }

  try {
    await autoUpdater.checkForUpdates();
    return { ok: true, update: updateState };
  } catch (error) {
    markUpdateIdleError(error.message || 'Không kiểm tra được cập nhật.');
    return { ok: false, message: updateState.error, update: updateState };
  }
}

async function downloadAppUpdate() {
  if (!updaterReady) {
    return { ok: false, message: 'Auto updater chưa sẵn sàng.' };
  }

  if (!updateState.available) {
    return { ok: false, message: 'Chưa có bản cập nhật khả dụng.' };
  }

  if (updateState.downloaded) {
    return { ok: true, update: updateState, alreadyDownloaded: true };
  }

  if (updateState.downloading) {
    return { ok: true, update: updateState, alreadyDownloading: true };
  }

  try {
    setUpdateState({ downloading: true, error: '' });
    const downloadedFiles = await autoUpdater.downloadUpdate();
    const setupExePath = Array.isArray(downloadedFiles)
      ? downloadedFiles.find((filePath) => `${filePath || ''}`.toLowerCase().endsWith('.exe')) || downloadedFiles[0] || ''
      : `${downloadedFiles || ''}`;
    setUpdateState({ setupExePath });
    return { ok: true, update: updateState };
  } catch (error) {
    markUpdateIdleError(error.message || 'Tải cập nhật thất bại.');
    return { ok: false, message: updateState.error, update: updateState };
  }
}

async function quitAndInstallAppUpdate() {
  if (!updaterReady) {
    return { ok: false, message: 'Auto updater chưa sẵn sàng.' };
  }

  if (!updateState.downloaded) {
    return { ok: false, message: 'Bản cập nhật chưa tải xong.' };
  }

  setImmediate(() => {
    autoUpdater.quitAndInstall(false, true);
  });
  return { ok: true };
}

async function openUpdateReleasePage() {
  const targetUrl = updateState.releaseUrl || PUBLIC_RELEASES_URL;
  await shell.openExternal(targetUrl);
  return { ok: true, url: targetUrl };
}

async function openExternalUrl(rawUrl) {
  try {
    const target = new URL(`${rawUrl || ''}`);
    if (!['https:', 'http:'].includes(target.protocol)) {
      return { ok: false, message: 'Chỉ hỗ trợ mở link http/https.' };
    }
    await shell.openExternal(target.toString());
    return { ok: true, url: target.toString() };
  } catch (error) {
    return { ok: false, message: error.message || 'Link không hợp lệ.' };
  }
}

async function openWorkspaceDataFile(kind) {
  try {
    ensureWorkspaceFiles(workspaceState);
    const targetPath = getWorkspaceDataFilePath(kind);
    const shellError = await shell.openPath(targetPath);
    if (shellError) {
      return { ok: false, message: shellError, path: targetPath };
    }
    return { ok: true, path: targetPath };
  } catch (error) {
    return { ok: false, message: error.message || 'Không mở được data file.' };
  }
}

async function openWorkspaceFolder() {
  try {
    if (!workspaceState?.workspaceDir) {
      return { ok: false, message: 'Workspace chưa sẵn sàng.' };
    }
    ensureWorkspaceFiles(workspaceState);
    const targetPath = workspaceState.workspaceDir;
    const shellError = await shell.openPath(targetPath);
    if (shellError) {
      return { ok: false, message: shellError, path: targetPath };
    }
    return { ok: true, path: targetPath, workspaceDir: targetPath };
  } catch (error) {
    return { ok: false, message: error.message || 'Không mở được workspace.' };
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1480,
    height: 960,
    minWidth: 1240,
    minHeight: 780,
    backgroundColor: '#0b0f1a',
    title: 'Codex Account Studio',
    webPreferences: {
      preload: path.join(__dirname, 'electron_preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'ui', 'index.html'));
}
ipcMain.handle('update:get-state', async () => ({ ok: true, update: updateState }));
ipcMain.handle('update:check', async () => checkForAppUpdate());
ipcMain.handle('update:download', async () => downloadAppUpdate());
ipcMain.handle('update:quit-and-install', async () => quitAndInstallAppUpdate());
ipcMain.handle('update:open-release-page', async () => openUpdateReleasePage());

function persistWorkspaceConfig(patch = {}) {
  const current = readJsonFile(workspaceState.configFile, {});
  const nextConfig = {
    max_workers: 3,
    headless: false,
    slow_mo: 1000,
    timeout: 30000,
    password: '@1234567890a',
    smspool_key: '',
    mail_domains: [],
    selected_mail_domain: 'thangterter.online',
    random_mail_domain: false,
    router_password: '123456',
    router_url: 'http://localhost:20128/dashboard/providers/codex',
    proxy_round_robin: false,
    proxy_apply_rotate: false,
    proxy_sticky: 1,
    clonemup_api_key: '',
    khommo_api_key: '',
    shopgmail9999_api_key: '',
    shopgmail9999_service: 'chatgpt',
    shopgmail9999_otp_retries: 30,
    shopgmail9999_otp_delay_seconds: 4,
    create_pay_unlink_stage2_dry_run: true,
    create_pay_unlink_stage2_allow_submit: false,
    cpl_test_card_number: '',
    cpl_test_card_expiry: '',
    cpl_test_card_cvc: '',
    clonemup_hotmail_product_id: 7614,
    khommo_hotmail_product_id: 7511,
    vpn_enabled: true,
    vpn_extension_path: '',
    verify_provider: '9router',
    cliproxyapi_auth_url: '',
    cliproxyapi_executable_path: getDefaultCliProxyApiExecutablePath(),
    cliproxyapi_config_path: getDefaultCliProxyApiConfigPath(),
    ...current,
    ...patch,
  };

  fs.writeFileSync(workspaceState.configFile, JSON.stringify(nextConfig, null, 2), 'utf-8');
  return nextConfig;
}

function normalizeVerifyProvider(value = '') {
  const provider = `${value || ''}`.trim().toLowerCase();
  if (['cliproxyapi', 'cli-proxy-api', 'cli_proxy_api'].includes(provider)) return 'cliproxyapi';
  return '9router';
}

function isValidCliProxyApiAuthUrl(value = '') {
  try {
    const url = new URL(`${value || ''}`.trim());
    return url.protocol === 'https:' && url.hostname === 'auth.openai.com' && /\/oauth\/authorize$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function getDefaultCliProxyApiExecutablePath() {
  return process.platform === 'win32'
    ? 'C:\\Users\\tinvo\\Downloads\\windows\\window\\CLIProxyAPI\\cli-proxy-api.exe'
    : 'cli-proxy-api';
}

function getDefaultCliProxyApiConfigPath() {
  return process.platform === 'win32'
    ? 'C:\\Users\\tinvo\\Downloads\\windows\\window\\CLIProxyAPI\\config.yaml'
    : '';
}

function buildCliProxyApiCommand(payload = {}, current = {}) {
  const executablePath = `${payload.cliProxyApiExecutablePath || current.cliproxyapi_executable_path || getDefaultCliProxyApiExecutablePath()}`.trim();
  const configPath = `${payload.cliProxyApiConfigPath || current.cliproxyapi_config_path || getDefaultCliProxyApiConfigPath()}`.trim();
  const args = [];
  if (configPath) args.push('-config', configPath);
  args.push('-codex-login', '-no-browser');
  return { executablePath, configPath, args };
}

function extractCliProxyApiAuthUrl(text = '') {
  const match = `${text}`.match(/https:\/\/auth\.openai\.com\/oauth\/authorize[^\s"'<>]*/i);
  return match ? match[0].trim() : '';
}

function captureCliProxyApiAuthUrl({ executablePath, args, timeoutMs = 45000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!executablePath) {
      reject(new Error('Thiếu CLIProxyAPI executable path.'));
      return;
    }

    let settled = false;
    let outputTail = '';
    const child = spawn(executablePath, args, {
      shell: false,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      reject(new Error(`Không bắt được OAuth URL từ CLIProxyAPI sau ${Math.round(timeoutMs / 1000)}s. Kiểm tra executable/config.`));
    }, timeoutMs);

    const finish = (authUrl) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve({ authUrl, process: child });
    };

    const handleData = (chunk) => {
      const text = chunk.toString('utf-8');
      outputTail = `${outputTail}${text}`.slice(-6000);
      const authUrl = extractCliProxyApiAuthUrl(outputTail);
      if (authUrl) finish(authUrl);
    };

    child.stdout.on('data', handleData);
    child.stderr.on('data', handleData);
    child.once('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(new Error(`Không chạy được CLIProxyAPI: ${error.message}`));
    });
    child.once('exit', (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(new Error(`CLIProxyAPI thoát trước khi trả OAuth URL (code=${code ?? 'n/a'}, signal=${signal || 'n/a'}).`));
    });
  });
}

function stopCliProxyApiCapture(captureProcess) {
  if (!captureProcess || captureProcess.killed) return;
  try {
    captureProcess.kill();
  } catch {
    // ignore cleanup errors
  }
}

function patchPlaywrightLaunchVisibility({ headless = false } = {}) {
  globalThis.__codexBrowserHeadless = headless === true;

  const buildLaunchOptions = (options = {}) => ({
    ...options,
    headless: globalThis.__codexBrowserHeadless === true ? true : false,
  });

  const patchLaunch = (browserType, label = 'browser') => {
    if (!browserType || browserType.__codexLaunchVisibilityPatched) return;

    if (typeof browserType.launchPersistentContext === 'function') {
      const originalLaunchPersistentContext = browserType.launchPersistentContext;
      browserType.launchPersistentContext = function patchedLaunchPersistentContext(userDataDir, options = {}) {
        return originalLaunchPersistentContext.call(this, userDataDir, buildLaunchOptions(options));
      };
    }

    if (typeof browserType.launch === 'function') {
      const originalLaunch = browserType.launch;
      browserType.launch = function patchedLaunch(options = {}) {
        return originalLaunch.call(this, buildLaunchOptions(options));
      };
    }

    browserType.__codexLaunchVisibilityPatched = true;
    sendToRenderer('log:line', { line: `[Browser] Đã patch ${label}: chỉ dùng Headless khi bật checkbox.` });
  };

  try {
    const playwright = require('playwright');
    patchLaunch(playwright?.chromium, 'Playwright Chromium');
    patchLaunch(playwright?.firefox, 'Playwright Firefox/Nightly');
  } catch (error) {
    sendToRenderer('log:line', { line: `[Browser] Không patch được Playwright minimize: ${error.message}` });
  }

  try {
    const playwrightExtra = require('playwright-extra');
    patchLaunch(playwrightExtra?.chromium, 'Playwright Extra Chromium');
  } catch (error) {
    sendToRenderer('log:line', { line: `[Browser] Không patch được Playwright Extra minimize: ${error.message}` });
  }
}

function normalizeConfigPatch(payload = {}) {
  const current = readJsonFile(workspaceState.configFile, {});
  const keepString = (value, currentValue = '', fallback = '') => {
    const text = `${value ?? ''}`.trim();
    if (text) return text;
    return `${currentValue ?? fallback ?? ''}`.trim();
  };
  const keepLowerString = (value, currentValue = '', fallback = '') => keepString(value, currentValue, fallback).toLowerCase();
  const keepSecret = (value, currentValue = '') => {
    const text = `${value ?? ''}`.trim();
    return text || `${currentValue ?? ''}`.trim();
  };

  return {
    smspool_key: keepSecret(payload?.smspoolKey, current.smspool_key),
    password: keepString(payload?.password, current.password, '@1234567890a'),
    selected_mail_domain: keepLowerString(payload?.selectedMailDomain, current.selected_mail_domain, 'thangterter.online'),
    random_mail_domain: payload?.randomMailDomain === true,
    headless: payload?.headless === true,
    router_password: keepString(payload?.routerPassword, current.router_password, '123456'),
    proxy_round_robin: payload?.proxyRoundRobin === true,
    proxy_apply_rotate: payload?.proxyApplyRotate === true,
    proxy_sticky: Math.max(1, Number.parseInt(payload?.proxySticky ?? current.proxy_sticky ?? 1, 10) || 1),
    clonemup_api_key: keepSecret(payload?.clonemupApiKey, current.clonemup_api_key),
    khommo_api_key: keepSecret(payload?.khommoApiKey, current.khommo_api_key),
    shopgmail9999_api_key: keepSecret(payload?.shopgmail9999ApiKey, current.shopgmail9999_api_key),
    shopgmail9999_service: keepLowerString(payload?.shopgmail9999Service, current.shopgmail9999_service, 'chatgpt') || 'chatgpt',
    shopgmail9999_otp_retries: Math.max(1, Number.parseInt(payload?.shopgmail9999OtpRetries ?? current.shopgmail9999_otp_retries ?? 30, 10) || 30),
    shopgmail9999_otp_delay_seconds: Math.max(1, Number.parseInt(payload?.shopgmail9999OtpDelaySeconds ?? current.shopgmail9999_otp_delay_seconds ?? 4, 10) || 4),
    create_pay_unlink_stage2_dry_run: payload?.createPayUnlinkDryRun !== false,
    create_pay_unlink_stage2_allow_submit: payload?.createPayUnlinkAllowSubmit === true,
    cpl_test_card_number: keepSecret(payload?.cplTestCardNumber, current.cpl_test_card_number),
    cpl_test_card_expiry: keepSecret(payload?.cplTestCardExpiry, current.cpl_test_card_expiry),
    cpl_test_card_cvc: keepSecret(payload?.cplTestCardCvc, current.cpl_test_card_cvc),
    clonemup_hotmail_product_id: Math.max(1, Number.parseInt(payload?.clonemupHotmailProductId ?? current.clonemup_hotmail_product_id ?? 7614, 10) || 7614),
    khommo_hotmail_product_id: [7511, 6000].includes(Number.parseInt(payload?.khommoHotmailProductId ?? current.khommo_hotmail_product_id ?? 7511, 10))
      ? Number.parseInt(payload?.khommoHotmailProductId ?? current.khommo_hotmail_product_id ?? 7511, 10)
      : 7511,
    verify_provider: normalizeVerifyProvider(payload?.verifyProvider ?? current.verify_provider ?? '9router'),
    cliproxyapi_auth_url: keepSecret(payload?.cliProxyApiAuthUrl, current.cliproxyapi_auth_url),
    cliproxyapi_executable_path: keepString(payload?.cliProxyApiExecutablePath, current.cliproxyapi_executable_path, getDefaultCliProxyApiExecutablePath()),
    cliproxyapi_config_path: keepString(payload?.cliProxyApiConfigPath, current.cliproxyapi_config_path, getDefaultCliProxyApiConfigPath()),
    vpn_enabled: payload?.vpnEnabled !== false,
    vpn_extension_path: keepString(payload?.vpnExtensionPath, current.vpn_extension_path),
  };
}

ipcMain.handle('config:save', async (_event, payload) => {
  try {
    const config = persistWorkspaceConfig(normalizeConfigPatch(payload));
    return { ok: true, message: 'Đã lưu config thành công.', config };
  } catch (error) {
    return { ok: false, message: error.message };
  }
});

ipcMain.handle('smspool:get-balance', async (_event, payload) => {

  const current = readJsonFile(workspaceState.configFile, {});
  const smspoolKey = `${payload?.smspoolKey || current.smspool_key || ''}`.trim();
  if (!smspoolKey) {
    return { ok: false, message: 'Thiếu SMSPool API key.' };
  }

  try {
    const smsPool = new SMSPoolService(smspoolKey);
    const result = await smsPool.getBalance();
    return { ok: true, balance: result.balance, raw: result.raw, checkedAt: new Date().toISOString() };
  } catch (error) {
    return { ok: false, message: error.message || 'Không kiểm tra được số dư SMSPool.' };
  }
});

ipcMain.handle('clonemup:get-profile', async (_event, payload) => {
  const current = readJsonFile(workspaceState.configFile, {});
  const apiKey = `${payload?.apiKey || current.clonemup_api_key || ''}`.trim();
  if (!apiKey) return { ok: false, message: 'Thiếu Clonemup API key.' };
  try {
    const service = new ClonemupService(apiKey);
    const result = await service.getProfile();
    return { ok: true, balance: result.balance, raw: result.raw, checkedAt: new Date().toISOString(), hotmailRunnableCount: getHotmailRunnableCount() };
  } catch (error) {
    return { ok: false, message: error.message || 'Không kiểm tra được số dư Clonemup.' };
  }
});

ipcMain.handle('khommo:get-profile', async (_event, payload) => {
  const current = readJsonFile(workspaceState.configFile, {});
  const apiKey = `${payload?.apiKey || current.khommo_api_key || ''}`.trim();
  if (!apiKey) return { ok: false, message: 'Thiếu Khommo API key.' };
  try {
    const service = new KhommoService(apiKey);
    const profile = await service.getProfile();
    const products = [
      { ok: true, productId: 7511, id: '7511', price: '196', stock: '', name: 'Hotmail OAuth', summary: '7511 • Hotmail OAuth • 196đ/acc • còn dùng' },
      { ok: true, productId: 6000, id: '6000', price: '350', stock: '', name: 'Hotmail OAuth', summary: '6000 • Hotmail OAuth • 350đ/acc' },
    ];
    return { ok: true, balance: profile.balance, raw: profile.raw, products, checkedAt: new Date().toISOString(), hotmailRunnableCount: getHotmailRunnableCount() };
  } catch (error) {
    return { ok: false, message: error.message || 'Không kiểm tra được số dư Khommo.' };
  }
});

ipcMain.handle('shopgmail9999:get-profile', async (_event, payload) => {
  const current = readJsonFile(workspaceState.configFile, {});
  const apiKey = `${payload?.apiKey || current.shopgmail9999_api_key || ''}`.trim();
  const serviceName = `${payload?.service || current.shopgmail9999_service || 'chatgpt'}`.trim().toLowerCase() || 'chatgpt';
  if (!apiKey) return { ok: false, message: 'Thiếu ShopGmail9999 API key.' };
  try {
    const service = new ShopGmail9999Service(apiKey);
    const [profile, stock] = await Promise.all([service.getUserInfo(), service.getStock(serviceName)]);
    return { ok: true, balance: profile.balance, username: profile.username, banned: profile.banned, stock: stock.stock, service: stock.service, checkedAt: new Date().toISOString(), raw: { profile: profile.raw, stock: stock.raw } };
  } catch (error) {
    return { ok: false, message: error.message || 'Không kiểm tra được ShopGmail9999.' };
  }
});

ipcMain.handle('clonemup:buy-hotmail', async (_event, payload) => {
  if (isRunning) return { ok: false, message: 'Đang RUN. Hãy chờ xong hoặc Stop trước khi mua Hotmail.' };

  const current = readJsonFile(workspaceState.configFile, {});
  const apiKey = `${payload?.apiKey || current.clonemup_api_key || ''}`.trim();
  const amount = Math.max(1, Number.parseInt(payload?.amount, 10) || 0);
  const productId = Math.max(1, Number.parseInt(payload?.productId ?? current.clonemup_hotmail_product_id ?? 7614, 10) || 7614);
  const batchSize = amount;
  if (!apiKey) return { ok: false, message: 'Thiếu Clonemup API key.' };
  if (!amount) return { ok: false, message: 'Số lượng mua phải lớn hơn 0.' };

  try {
    const service = new ClonemupService(apiKey);
    const result = await service.buyProductInBatches({
      totalAmount: amount,
      productId,
      batchSize,
      onProgress: (event) => {
        if (event.type === 'product-check' && event.summary) sendToRenderer('log:line', { line: `[Clonemup] Product ${productId} info: ${event.summary}` });
        if (event.type === 'product-check-error') sendToRenderer('log:line', { line: `[Clonemup] Không đọc được info product ${productId}: ${event.message}` });
        if (event.type === 'batch-start') sendToRenderer('log:line', { line: `[Clonemup] Mua Hotmail product=${productId} batch ${event.batchIndex}/${event.totalBatches}, amount=${event.amount}, attempt=${event.attempt}` });
        if (event.type === 'batch-success') sendToRenderer('log:line', { line: `[Clonemup] Product ${productId} batch ${event.batchIndex}/${event.totalBatches} OK, nhận ${event.received}, trans=${event.transId || 'n/a'}, transport=${event.transport || 'n/a'}${event.rawSummary ? ` • ${event.rawSummary}` : ''}` });
        if (event.type === 'batch-error') {
          const transportDetail = Array.isArray(event.transportFailures) && event.transportFailures.length > 0
            ? ` • ${event.transportFailures.map((item) => `${item.transport} => ${item.message}`).join(' || ')}`
            : '';
          sendToRenderer('log:line', { line: `[Clonemup] Product ${productId} batch ${event.batchIndex}/${event.totalBatches} lỗi attempt=${event.attempt}${event.maintenanceStop ? ' • upstream maintenance' : ''}: ${event.message}${event.productSummary ? ` • ${event.productSummary}` : ''}${transportDetail}` });
        }
      },
    });
    const append = getHotmailRepository().appendPurchasedAccounts(result.lines);
    if (append.rejected.length > 0) {
      sendToRenderer('log:line', { line: `[Clonemup] Có ${append.rejected.length} dòng Hotmail thiếu field. Dev có thể xem response thô trên Clonemup; app không log token cho khách.` });
    }
    let profile = null;
    try { profile = await service.getProfile(); } catch { profile = null; }
    return {
      ok: true,
      message: `Đã mua ${append.added.length}/${amount} Hotmail.`,
      purchased: append.added.length,
      requested: amount,
      transactions: result.transactions,
      failedBatches: result.failedBatches,
      balance: profile?.balance || '',
      checkedAt: new Date().toISOString(),
      ...readWorkspaceData(),
    };
  } catch (error) {
    return { ok: false, message: error.message || 'Mua Hotmail thất bại.', ...readWorkspaceData() };
  }
});

ipcMain.handle('khommo:buy-hotmail', async (_event, payload) => {
  if (isRunning) return { ok: false, message: 'Đang RUN. Hãy chờ xong hoặc Stop trước khi mua Hotmail.' };

  const current = readJsonFile(workspaceState.configFile, {});
  const apiKey = `${payload?.apiKey || current.khommo_api_key || ''}`.trim();
  const amount = Math.max(1, Number.parseInt(payload?.amount, 10) || 0);
  const requestedProductId = Number.parseInt(payload?.productId ?? current.khommo_hotmail_product_id ?? 7511, 10);
  const productId = [7511, 6000].includes(requestedProductId) ? requestedProductId : 7511;
  const batchSize = amount;
  if (!apiKey) return { ok: false, message: 'Thiếu Khommo API key.' };
  if (!amount) return { ok: false, message: 'Số lượng mua phải lớn hơn 0.' };

  try {
    const service = new KhommoService(apiKey);
    const result = await service.buyProductInBatches({
      totalAmount: amount,
      productId,
      batchSize,
      onProgress: (event) => {
        if (event.type === 'product-check' && event.summary) sendToRenderer('log:line', { line: `[Khommo] Product ${productId} info: ${event.summary}` });
        if (event.type === 'product-check-error') sendToRenderer('log:line', { line: `[Khommo] Không đọc được info product ${productId}: ${event.message}` });
        if (event.type === 'batch-start') sendToRenderer('log:line', { line: `[Khommo] Mua Hotmail product=${productId} batch ${event.batchIndex}/${event.totalBatches}, amount=${event.amount}, attempt=${event.attempt}` });
        if (event.type === 'batch-success') sendToRenderer('log:line', { line: `[Khommo] Product ${productId} batch ${event.batchIndex}/${event.totalBatches} OK, nhận ${event.received}, trans=${event.transId || 'n/a'}, transport=${event.transport || 'n/a'}${event.rawSummary ? ` • ${event.rawSummary}` : ''}` });
        if (event.type === 'batch-error') {
          const transportDetail = Array.isArray(event.transportFailures) && event.transportFailures.length > 0
            ? ` • ${event.transportFailures.map((item) => `${item.transport} => ${item.message}`).join(' || ')}`
            : '';
          sendToRenderer('log:line', { line: `[Khommo] Product ${productId} batch ${event.batchIndex}/${event.totalBatches} lỗi attempt=${event.attempt}${event.maintenanceStop ? ' • upstream maintenance' : ''}: ${event.message}${event.productSummary ? ` • ${event.productSummary}` : ''}${transportDetail}` });
        }
      },
    });
    const append = getHotmailRepository().appendPurchasedAccounts(result.lines);
    if (append.rejected.length > 0) {
      sendToRenderer('log:line', { line: `[Khommo] Có ${append.rejected.length} dòng Hotmail thiếu field. Kiểm tra product format: email|password|refreshToken|clientId|recoveryEmail.` });
    }
    let profile = null;
    try { profile = await service.getProfile(); } catch { profile = null; }
    return {
      ok: true,
      message: `Đã mua ${append.added.length}/${amount} Hotmail từ Khommo.`,
      purchased: append.added.length,
      requested: amount,
      transactions: result.transactions,
      failedBatches: result.failedBatches,
      balance: profile?.balance || '',
      checkedAt: new Date().toISOString(),
      ...readWorkspaceData(),
    };
  } catch (error) {
    return { ok: false, message: error.message || 'Mua Hotmail Khommo thất bại.', ...readWorkspaceData() };
  }
});

ipcMain.handle('run:start', async (_event, payload) => {
  if (isRunning) {
    return { ok: false, message: 'Đang có tiến trình chạy. Hãy stop trước.' };
  }

  const count = Number.parseInt(payload?.count, 10);
  const mode = payload?.mode || 'create_verify';
  const savedConfig = readJsonFile(workspaceState.configFile, {});
  const smspoolKey = (payload?.smspoolKey || '').trim();
  const password = (payload?.password || '').trim();
  const routerPassword = `${payload?.routerPassword || ''}`.trim();
  const vpnEnabled = payload?.vpnEnabled !== false;
  const vpnExtensionPath = `${payload?.vpnExtensionPath || ''}`.trim();

  const isCreatePayUnlinkMode = mode === 'create_pay_unlink';
  const selectedMailDomain = isCreatePayUnlinkMode ? 'gmail-shopgmail9999' : `${payload?.selectedMailDomain || ''}`.trim().toLowerCase();
  const randomMailDomain = isCreatePayUnlinkMode ? false : payload?.randomMailDomain === true;
  const headless = payload?.headless === true;
  const shopgmail9999ApiKey = `${payload?.shopgmail9999ApiKey || ''}`.trim();
  const clonemupApiKey = selectedMailDomain === 'hotmail-khommo'
    ? `${payload?.khommoApiKey || savedConfig.khommo_api_key || ''}`.trim()
    : `${payload?.clonemupApiKey || savedConfig.clonemup_api_key || ''}`.trim();
  const createPayUnlinkStage = `${payload?.createPayUnlinkStage || 'stage1'}`.trim().toLowerCase();
  const createPayUnlinkAllowSubmit = payload?.createPayUnlinkAllowSubmit === true;
  const createPayUnlinkDryRun = !createPayUnlinkAllowSubmit;
  const cplTestCardNumber = `${payload?.cplTestCardNumber || process.env.CPL_TEST_CARD_NUMBER || savedConfig.cpl_test_card_number || ''}`.trim();
  const cplTestCardExpiry = `${payload?.cplTestCardExpiry || process.env.CPL_TEST_CARD_EXPIRY || savedConfig.cpl_test_card_expiry || ''}`.trim();
  const cplTestCardCvc = `${payload?.cplTestCardCvc || process.env.CPL_TEST_CARD_CVC || savedConfig.cpl_test_card_cvc || ''}`.trim();
  const verifyProvider = normalizeVerifyProvider(payload?.verifyProvider || savedConfig.verify_provider || '9router');
  const cliProxyApiCommand = buildCliProxyApiCommand(payload, savedConfig);
  let cliProxyApiAuthUrl = '';
  let cliProxyApiCaptureProcess = null;
  const needsVerifyProvider = mode === 'verify' || mode === 'create_verify' || (isCreatePayUnlinkMode && createPayUnlinkStage === 'stage4');

  if (Number.isNaN(count) || count <= 0) {
    return { ok: false, message: 'Số lượng phải lớn hơn 0.' };
  }

  if ((mode === 'verify' || mode === 'create_verify' || (isCreatePayUnlinkMode && createPayUnlinkStage === 'stage4')) && !smspoolKey) {
    return { ok: false, message: 'Mode có verify hoặc Mode 4 Stage 4 cần SMSPool API key để xác minh phone/9Router.' };
  }

  const patchHotmailOtpHandling = () => {
    if (ChatGPTAccountCreatorCore.prototype.__hotmailOtpHandlingPatched) return;

    const removeAccountTxtPending = (email = '') => {
      const target = `${email || ''}`.trim().toLowerCase();
      if (!target || !fs.existsSync(workspaceState.accountsFile)) return false;
      const lines = fs.readFileSync(workspaceState.accountsFile, 'utf-8').split(/\r?\n/);
      const nextLines = lines.filter((line) => {
        if (!line.trim()) return false;
        const [lineEmail] = line.split('|');
        return `${lineEmail || ''}`.trim().toLowerCase() !== target;
      });
      const changed = nextLines.length !== lines.filter((line) => line.trim()).length;
      if (changed) fs.writeFileSync(workspaceState.accountsFile, nextLines.length ? `${nextLines.join('\n')}\n` : '', 'utf-8');
      return changed;
    };

    const originalRemoveHotmailAccount = ChatGPTAccountCreatorCore.prototype.removeHotmailAccount;
    if (typeof originalRemoveHotmailAccount === 'function') {
      ChatGPTAccountCreatorCore.prototype.removeHotmailAccount = function patchedRemoveHotmailAccount(email, ...args) {
        const result = originalRemoveHotmailAccount.call(this, email, ...args);
        const removedFromAccounts = removeAccountTxtPending(email);
        if (result || removedFromAccounts) {
          sendToRenderer('log:line', { line: `[Hotmail] Đã bỏ ${email} khỏi danh sách ${result ? 'accounts-hotmail.txt' : ''}${result && removedFromAccounts ? ' và ' : ''}${removedFromAccounts ? 'accounts.txt' : ''} để chuyển sang Hotmail mới.` });
          sendToRenderer('data:changed', readWorkspaceData());
        }
        return result;
      };
    }

    const originalGetHotmailOauthCode = ChatGPTAccountCreatorCore.prototype.getHotmailOauthCode;
    if (typeof originalGetHotmailOauthCode === 'function') {
      ChatGPTAccountCreatorCore.prototype.getHotmailOauthCode = async function patchedGetHotmailOauthCode(hotmailAccount, ...args) {
        const currentMode = `${this.mode || this.config?.mode || mode || ''}`.trim().toLowerCase();
        const isCreateFlow = currentMode === 'create' || currentMode === 'create_verify' || currentMode === 'create_pay_unlink';
        const isVerifyFlow = currentMode === 'verify';
        const email = `${hotmailAccount?.email || hotmailAccount || ''}`.trim();

        const firstCode = await originalGetHotmailOauthCode.call(this, hotmailAccount, ...args);
        if (firstCode || !email) return firstCode;

        if (isCreateFlow) {
          this.log?.(`[Hotmail] Create: ${email} hết OTP 7/7, bỏ mail này ngay và chuyển sang Hotmail mới, không login/chờ lại.`, 'WARNING');
          if (typeof this.removeHotmailAccount === 'function') this.removeHotmailAccount(email);
          return null;
        }

        if (isVerifyFlow) {
          this.log?.(`[Hotmail] Verify: ${email} chưa lấy được OTP sau 7/7, retry login/get OTP thêm 1 lần trước khi bỏ mail.`, 'WARNING');
          const secondCode = await originalGetHotmailOauthCode.call(this, hotmailAccount, ...args);
          if (secondCode) return secondCode;
          this.log?.(`[Hotmail] Verify: ${email} vẫn không có OTP sau retry, bỏ mail này và chuyển sang Hotmail mới.`, 'WARNING');
          if (typeof this.removeHotmailAccount === 'function') this.removeHotmailAccount(email);
          return null;
        }

        return null;
      };
    }

    ChatGPTAccountCreatorCore.prototype.__hotmailOtpHandlingPatched = true;
  };

  const patchCreateAccountOtpRetries = () => {
    if (ChatGPTAccountCreatorCore.prototype.__createAccountOtpRetriesPatched) return;

    const normalizeCreateOtpRetries = (value) => {
      const parsed = Number.parseInt(value, 10);
      return Math.min(7, Math.max(1, Number.isNaN(parsed) ? 7 : parsed));
    };

    const originalGetVerificationCode = ChatGPTAccountCreatorCore.prototype.getVerificationCode;
    if (typeof originalGetVerificationCode === 'function') {
      ChatGPTAccountCreatorCore.prototype.getVerificationCode = function patchedGetVerificationCode(email, maxRetries = 7, delay = 5, options = {}) {
        return originalGetVerificationCode.call(this, email, normalizeCreateOtpRetries(maxRetries), delay, options);
      };
    }

    const originalClickResendEmailIfVisible = ChatGPTAccountCreatorCore.prototype.clickResendEmailIfVisible;
    if (typeof originalClickResendEmailIfVisible === 'function') {
      ChatGPTAccountCreatorCore.prototype.clickResendEmailIfVisible = function patchedClickResendEmailIfVisible(page, label = 'email verification') {
        const normalizedLabel = `${label || ''}`.replace(/(tạo account\s*\()(\d+)\/\d+(\))/i, (_match, prefix, attempt, suffix) => `${prefix}${Math.min(7, Number.parseInt(attempt, 10) || 1)}/7${suffix}`);
        return originalClickResendEmailIfVisible.call(this, page, normalizedLabel || label);
      };
    }

    const originalDetectChatGptCreateState = ChatGPTAccountCreatorCore.prototype.detectChatGptCreateState;
    if (typeof originalDetectChatGptCreateState === 'function') {
      ChatGPTAccountCreatorCore.prototype.detectChatGptCreateState = async function patchedDetectChatGptCreateState(page, ...args) {
        const proxyError = await page.evaluate(() => {
          const text = `${document.body?.innerText || ''}`;
          const title = `${document.title || ''}`;
          const href = `${window.location?.href || ''}`;
          const haystack = `${title}\n${href}\n${text}`;
          const matched = /proxy server is refusing connections|407\s+Proxy Authentication Required|ERR_PROXY|NS_ERROR_PROXY|proxy authentication required|problem loading page/i.test(haystack);
          if (!matched) return null;
          const line = text.split(/\r?\n/).map((item) => item.trim()).find((item) => /proxy|407|refusing/i.test(item)) || title || href;
          return { step: 'blocked_error', detail: `proxy_runtime_error: ${line}` };
        }).catch(() => null);

        if (proxyError) {
          this.log?.(`❌ Proxy runtime lỗi khi tạo account: ${proxyError.detail}`, 'ERROR');
          return proxyError;
        }

        const canTreatCreateAsCompletedAfterProfile = this.__createCompletedAfterMailOtpProfileSubmit === true
          && Date.now() - Number(this.__createCompletedAfterMailOtpProfileSubmitAt || 0) < 5 * 60 * 1000;

        if (canTreatCreateAsCompletedAfterProfile) {
          this.log?.('✅ Đã nhập OTP mail + tên/tuổi và bấm Tạo/Continue, xem như create hoàn thành và đưa account vào pending.');
          return { step: 'home', detail: 'create_completed_after_mail_otp_and_profile_submit' };
        }

        const canTreatChatGptHomeAsCreateSuccess = this.__mailOtpSubmittedForCreateSuccess === true
          && Date.now() - Number(this.__mailOtpSubmittedAt || 0) < 5 * 60 * 1000;

        if (canTreatChatGptHomeAsCreateSuccess) {
          const chatGptHome = await page.evaluate(() => {
            const href = `${window.location?.href || ''}`;
            const host = `${window.location?.hostname || ''}`.toLowerCase();
            const pathname = `${window.location?.pathname || ''}`.toLowerCase();
            const title = `${document.title || ''}`;
            const text = `${document.body?.innerText || ''}`;
            const hasCodeInput = Boolean(document.querySelector('input[name="code"], input[inputmode="numeric"], input[autocomplete="one-time-code"]'));
            const hasAuthForm = /verify your email|enter code|email code|mã xác minh|verification code/i.test(text) || hasCodeInput;
            const isChatGptHost = host === 'chatgpt.com' || host.endsWith('.chatgpt.com') || host === 'chat.openai.com';
            const isAuthPath = /\/auth|\/login|\/signup|\/verify/i.test(pathname);
            const hasChatGptShell = /chatgpt/i.test(title)
              || /new chat|search chats|projects|codex|ask away|tips for getting started|okay,? let'?s go|message chatgpt|free offer/i.test(text);
            if (isChatGptHost && !isAuthPath && !hasAuthForm && hasChatGptShell) {
              return { step: 'home', detail: `chatgpt_home_after_mail_otp: ${href}` };
            }
            return null;
          }).catch(() => null);

          if (chatGptHome) {
            this.log?.(`✅ Đã vào ChatGPT sau OTP mail, xem như tạo account thành công: ${chatGptHome.detail}`);
            return chatGptHome;
          }
        }

        return originalDetectChatGptCreateState.call(this, page, ...args);
      };
    }

    ChatGPTAccountCreatorCore.prototype.__createAccountOtpRetriesPatched = true;
  };

  const patchHotmailStatusRefresh = () => {
    if (ChatGPTAccountCreatorCore.prototype.__hotmailStatusRefreshPatched) return;

    const emitHotmailStatusChanged = (email = '', status = '') => {
      sendToRenderer('data:changed', readWorkspaceData());
      if (/^(pending|verify)$/i.test(`${status || ''}`)) {
        sendToRenderer('log:line', { line: `[Hotmail] Đã làm mới bảng accounts-hotmail.txt: ${email} -> ${status}` });
      }
    };

    const originalUpdateHotmailAccountStatus = ChatGPTAccountCreatorCore.prototype.updateHotmailAccountStatus;
    if (typeof originalUpdateHotmailAccountStatus === 'function') {
      ChatGPTAccountCreatorCore.prototype.updateHotmailAccountStatus = function patchedUpdateHotmailAccountStatus(email, status, options = {}) {
        const result = originalUpdateHotmailAccountStatus.call(this, email, status, options);
        if (result) emitHotmailStatusChanged(email, status);
        return result;
      };
    }

    ChatGPTAccountCreatorCore.prototype.__hotmailStatusRefreshPatched = true;
  };

  const patchCreateOtpProfileOrder = () => {
    if (ChatGPTAccountCreatorCore.prototype.__createOtpProfileOrderPatched) return;

    const delayedProfiles = new WeakMap();
    const originalFillSignupProfile = ChatGPTAccountCreatorCore.prototype.fillSignupProfile;
    if (typeof originalFillSignupProfile === 'function') {
      ChatGPTAccountCreatorCore.prototype.fillSignupProfile = async function patchedFillSignupProfile(page, state, generatedName, options = {}) {
        const shouldDelayProfile = options?.clickSubmit === false && options?.__afterOtpProfileFill !== true;
        if (shouldDelayProfile) {
          const codeInput = state?.codeInput || page.locator('input[name="code"], input[inputmode="numeric"], input[autocomplete="one-time-code"]').first();
          const hasCodeInput = await codeInput.isVisible({ timeout: 800 }).catch(() => false);
          if (hasCodeInput) {
            delayedProfiles.set(page, { state, generatedName });
            this.log?.('✉️ Đã tới bước OTP + profile. Chờ và nhập OTP trước, sau đó mới nhập tên/tuổi...');
            return;
          }
        }

        return originalFillSignupProfile.call(this, page, state, generatedName, options);
      };
    }

    const originalClickLocatorWithRetry = ChatGPTAccountCreatorCore.prototype.clickLocatorWithRetry;
    if (typeof originalClickLocatorWithRetry === 'function' && typeof originalFillSignupProfile === 'function') {
      const markCreateCompletedAfterMailOtpProfileSubmit = (core, reason = '') => {
        core.__createCompletedAfterMailOtpProfileSubmit = true;
        core.__createCompletedAfterMailOtpProfileSubmitAt = Date.now();
        core.log?.(`✅ Đã nhập OTP mail + tên/tuổi và bấm Tạo/Continue${reason ? ` (${reason})` : ''}. Không chờ kiểm tra thêm, chuyển account sang pending.`);
      };

      ChatGPTAccountCreatorCore.prototype.clickLocatorWithRetry = async function patchedClickLocatorWithRetry(locator, options = {}) {
        const label = `${options?.label || ''}`;
        if (/sign\s*up|submit\s+sau\s+email|continue\s+sau\s+email/i.test(label)) {
          this.__mailOtpSubmittedForCreateSuccess = false;
          this.__mailOtpSubmittedAt = 0;
          this.__createCompletedAfterMailOtpProfileSubmit = false;
          this.__createCompletedAfterMailOtpProfileSubmitAt = 0;
        }

        const delayed = this.__currentCreatePage ? delayedProfiles.get(this.__currentCreatePage) : null;
        const isOtpProfileSubmit = Boolean(delayed && /OTP.*profile|profile.*OTP/i.test(label));
        if (isOtpProfileSubmit) {
          delayedProfiles.delete(this.__currentCreatePage);
          this.log?.('👤 OTP đã nhập xong, bắt đầu nhập tên/tuổi trước khi bấm Continue cuối màn OTP + profile...');
          await originalFillSignupProfile.call(this, this.__currentCreatePage, delayed.state, delayed.generatedName, {
            clickSubmit: false,
            __afterOtpProfileFill: true,
          });
        }

        const result = await originalClickLocatorWithRetry.call(this, locator, options);
        const isMailOtpSubmit = /OTP\s*mail|submit\s+(?:lại\s+)?sau\s+OTP|sau\s+OTP\s+mail/i.test(label);
        if (isMailOtpSubmit) {
          this.__mailOtpSubmittedForCreateSuccess = true;
          this.__mailOtpSubmittedAt = Date.now();
        }

        const hasFreshMailOtpSubmit = this.__mailOtpSubmittedForCreateSuccess === true
          && Date.now() - Number(this.__mailOtpSubmittedAt || 0) < 5 * 60 * 1000;
        const isProfileSubmitAfterOtp = hasFreshMailOtpSubmit
          && /profile|tên|tuổi|full\s*name|how\s*old|finish\s*creating|create\s*account|tạo|continue\s+cuối|submit\s+profile|signup\s+profile/i.test(label)
          && !/submit\s+sau\s+email|continue\s+sau\s+email/i.test(label);

        if (isOtpProfileSubmit || isProfileSubmitAfterOtp) {
          markCreateCompletedAfterMailOtpProfileSubmit(this, isOtpProfileSubmit ? 'OTP + profile cùng trang' : 'profile sau OTP');
        }
        return result;
      };
    }

    const originalWaitForChatGptCreateState = ChatGPTAccountCreatorCore.prototype.waitForChatGptCreateState;
    if (typeof originalWaitForChatGptCreateState === 'function') {
      ChatGPTAccountCreatorCore.prototype.waitForChatGptCreateState = async function patchedWaitForChatGptCreateState(page, expectedSteps, options = {}) {
        this.__currentCreatePage = page;
        return originalWaitForChatGptCreateState.call(this, page, expectedSteps, options);
      };
    }

    ChatGPTAccountCreatorCore.prototype.__createOtpProfileOrderPatched = true;
  };

  const patchSmsPhoneRejectedFastRetry = () => {
    if (ChatGPTAccountCreatorCore.prototype.__smsPhoneRejectedFastRetryPatched) return;

    const detectOpenAiPhoneRejected = async (page) => {
      if (!page) return false;
      return page.locator('body').innerText({ timeout: 1200 }).then((text) => {
        const normalizedText = `${text || ''}`.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
        return /unable\s+to\s+send\s+a\s+verification\s+code\s+to\s+this\s+phone\s+number/i.test(normalizedText)
          || /phone\s+number\s+is\s+not\s+valid/i.test(normalizedText)
          || /phone\s+number\s+already\s+in\s+use/i.test(normalizedText)
          || /already\s+in\s+use[\s\S]{0,80}(?:different\s+phone\s+number|different\s+number)/i.test(normalizedText)
          || /invalid\s+phone\s+number/i.test(normalizedText)
          || /please\s+try\s+again\s+later\s+or\s+use\s+a\s+different\s+number/i.test(normalizedText)
          || /use\s+a\s+different\s+phone\s+number/i.test(normalizedText)
          || /too\s+many\s+phone\s+verification\s+requests/i.test(normalizedText)
          || /please\s+try\s+again\s+later/i.test(normalizedText)
          || /quá\s+nhiều\s+yêu\s+cầu\s+xác\s+minh\s+số\s+điện\s+thoại/i.test(normalizedText)
          || /không\s+thể\s+gửi\s+mã[\s\S]{0,120}số\s+điện\s+thoại/i.test(normalizedText);
      }).catch(() => false);
    };

    const addUniqueOrderId = (items = [], orderId = '') => {
      const normalized = `${orderId || ''}`.trim();
      if (normalized && !items.includes(normalized)) items.push(normalized);
    };

    const purgeUsedUpSmsItems = (core, reason = 'used_up') => {
      if (!Array.isArray(core?.smsList)) return 0;
      const before = core.smsList.length;
      core.smsList = core.smsList.filter((item) => Number(item?.usageCount || 0) < 3);
      const removed = before - core.smsList.length;
      if (removed > 0) {
        core.saveSMSState?.();
        core.log?.(`🧹 Đã xoá ${removed} số SMS usageCount >= 3 khỏi danh sách ứng viên (${reason}) để khỏi kiểm tra lại.`);
      }
      return removed;
    };

    const getPhoneInputLocator = async (page) => {
      if (!page) return null;
      const selectors = [
        'input[type="tel"]',
        'input[autocomplete="tel"]',
        'input[inputmode="tel"]',
        'input[name*="phone" i]',
        'input[id*="phone" i]',
        'input[placeholder*="phone" i]',
        'input[aria-label*="phone" i]',
        'input:not([type="hidden"]):not([name="code"]):not([autocomplete="one-time-code"])',
      ];

      for (const selector of selectors) {
        const locator = page.locator(selector).first();
        if (await locator.isVisible({ timeout: 700 }).catch(() => false)) return locator;
      }

      return null;
    };

    const fillPhoneNumberOnCurrentPage = async (core, page, smsItem) => {
      const phoneNumber = `${smsItem?.phoneNumber || ''}`.trim();
      if (!page || !phoneNumber) return false;

      await core.selectUsPhoneCountry?.(page).catch(() => false);
      const phoneInput = await getPhoneInputLocator(page);
      if (!phoneInput) return false;

      await phoneInput.click({ timeout: 5000 }).catch(() => {});
      await phoneInput.fill('', { timeout: 5000 }).catch(async () => {
        await page.keyboard.press('Control+A').catch(() => {});
        await page.keyboard.press('Backspace').catch(() => {});
      });
      await phoneInput.fill(phoneNumber, { timeout: 8000 });
      core.log?.(`📲 Đã xoá số cũ và nhập số mới ngay trên trang hiện tại: +${phoneNumber} (Order ${smsItem.orderId || 'unknown'}).`);
      return true;
    };

    const retryRejectedPhoneOnSamePage = async (core, page, locator, options, originalClickLocatorWithRetry, detectRejected) => {
      const context = core.__smsPhoneRetryContext;
      const currentItem = core.__smsCurrentItem;
      if (!context?.smsService || !currentItem?.orderId || typeof core.getValidSmsItem !== 'function') return false;

      const activeItemRef = currentItem;
      let lastRejectedOrderId = `${activeItemRef.orderId || ''}`.trim();
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        if (lastRejectedOrderId) {
          const itemInState = core.__smsCurrentStateItem?.orderId === lastRejectedOrderId
            ? core.__smsCurrentStateItem
            : core.findSmsItemByOrderId?.(lastRejectedOrderId) || activeItemRef;
          core.exhaustSmsItem?.(itemInState, 'phone_rejected_same_page_retry');
          addUniqueOrderId(context.excludedOrderIds, lastRejectedOrderId);
          addUniqueOrderId(context.exhaustedOrderIds, lastRejectedOrderId);
          purgeUsedUpSmsItems(core, 'phone_rejected_same_page_retry');
        }

        core.log?.(`🔁 Thử lấy số SMS mới và nhập lại ngay trên cùng trang verify (${attempt}/3), không thoát/login lại...`, 'WARNING');
        const nextItem = await core.getValidSmsItem(
          context.smsService,
          context.excludedOrderIds,
          context.incorrectOrderIds,
          context.exhaustedOrderIds,
        );
        if (!nextItem?.phoneNumber || !nextItem?.orderId) return false;

        const nextStateItem = core.findSmsItemByOrderId?.(nextItem.orderId) || nextItem;
        core.__smsCurrentStateItem = nextStateItem;
        Object.assign(activeItemRef, nextItem);
        core.__smsCurrentItem = activeItemRef;
        const filled = await fillPhoneNumberOnCurrentPage(core, page, activeItemRef);
        if (!filled) return false;

        const clicked = await originalClickLocatorWithRetry.call(core, locator, options);
        if (!clicked) return false;
        await core.sleep?.(2500);

        const stillRejected = await detectRejected(page);
        if (!stillRejected) return true;
        core.log?.('📵 Số mới cũng bị OpenAI từ chối. Sẽ bỏ số này và thử số khác trên cùng trang.', 'WARNING');
        lastRejectedOrderId = `${activeItemRef.orderId || ''}`.trim();
      }

      return false;
    };

    const detectSmsCodePage = async (page) => {
      if (!page) return false;
      const codeSelectors = [
        'input[autocomplete="one-time-code"]',
        'input[name="code"]',
        'input[inputmode="numeric"]',
        'input[type="tel"][maxlength="6"]',
        'input[aria-label*="code" i]',
        'input[placeholder*="code" i]',
      ];
      for (const selector of codeSelectors) {
        if (await page.locator(selector).first().isVisible({ timeout: 600 }).catch(() => false)) return true;
      }
      return page.locator('body').innerText({ timeout: 800 }).then((text) => /enter\s+(?:the\s+)?(?:6[-\s]?)?code|verification\s+code|we\s+sent\s+(?:a\s+)?code/i.test(`${text || ''}`)).catch(() => false);
    };

    const goBackToPhoneInput = async (core, page) => {
      if (!page) return false;
      if (await getPhoneInputLocator(page)) return true;

      const backLocators = [
        'button[aria-label*="back" i]',
        'a[aria-label*="back" i]',
        'button:has-text("Back")',
        'a:has-text("Back")',
        'button:has-text("Change")',
        'a:has-text("Change")',
      ];
      for (const selector of backLocators) {
        const backButton = page.locator(selector).first();
        if (await backButton.isVisible({ timeout: 700 }).catch(() => false)) {
          await backButton.click({ timeout: 3000 }).catch(() => {});
          await core.sleep?.(1500);
          if (await getPhoneInputLocator(page)) return true;
        }
      }

      await page.goBack({ waitUntil: 'domcontentloaded', timeout: 12000 }).catch(() => null);
      await core.sleep?.(2000);
      if (await getPhoneInputLocator(page)) return true;

      await page.keyboard.press('Alt+Left').catch(() => {});
      await core.sleep?.(1500);
      return Boolean(await getPhoneInputLocator(page));
    };

    const retrySmsTimeoutPhoneOnSameSession = async (core, smsService, timedOutOrderId, originalGetCode, shouldStop = () => false) => {
      const context = core?.__smsPhoneRetryContext;
      const page = core?.__smsLastPhonePage || core?.__currentCreatePage;
      const locator = core?.__smsLastPhoneSubmitLocator;
      const options = core?.__smsLastPhoneSubmitOptions || { label: 'Continue / Send code sau phone' };
      const activeItemRef = core?.__smsCurrentItem;
      if (!context?.smsService || !page || !locator || !activeItemRef || typeof core.getValidSmsItem !== 'function') return null;

      let lastTimedOutOrderId = `${timedOutOrderId || activeItemRef.orderId || ''}`.trim();
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        if (typeof shouldStop === 'function' && shouldStop()) return null;
        if (lastTimedOutOrderId) {
          const itemInState = core.__smsCurrentStateItem?.orderId === lastTimedOutOrderId
            ? core.__smsCurrentStateItem
            : core.findSmsItemByOrderId?.(lastTimedOutOrderId) || activeItemRef;
          core.exhaustSmsItem?.(itemInState, 'sms_code_timeout_same_session_retry');
          addUniqueOrderId(context.excludedOrderIds, lastTimedOutOrderId);
          addUniqueOrderId(context.exhaustedOrderIds, lastTimedOutOrderId);
          purgeUsedUpSmsItems(core, 'sms_code_timeout_same_session_retry');
        }

        core.log?.(`⌛ Số SMS order ${lastTimedOutOrderId || 'unknown'} đã vào trang nhập mã nhưng không có code. Quay lại trang nhập số và đổi số mới cùng phiên (${attempt}/3)...`, 'WARNING');
        const canInputPhone = await goBackToPhoneInput(core, page);
        if (!canInputPhone) {
          core.log?.('⚠️ Không quay lại được trang nhập số sau SMS timeout, để core retry theo cơ chế cũ.', 'WARNING');
          return null;
        }

        const nextItem = await core.getValidSmsItem(
          smsService,
          context.excludedOrderIds,
          context.incorrectOrderIds,
          context.exhaustedOrderIds,
        );
        if (!nextItem?.phoneNumber || !nextItem?.orderId) return null;

        const nextStateItem = core.findSmsItemByOrderId?.(nextItem.orderId) || nextItem;
        core.__smsCurrentStateItem = nextStateItem;
        Object.assign(activeItemRef, nextItem);
        core.__smsCurrentItem = activeItemRef;

        const filled = await fillPhoneNumberOnCurrentPage(core, page, activeItemRef);
        if (!filled) return null;

        const clicked = await ChatGPTAccountCreatorCore.prototype.__smsOriginalClickLocatorWithRetry.call(core, locator, options);
        if (!clicked) return null;
        await core.sleep?.(2500);

        if (await detectOpenAiPhoneRejected(page)) {
          core.log?.('📵 Số mới bị từ chối sau khi đổi vì timeout. Tiếp tục bỏ số và thử số khác.', 'WARNING');
          lastTimedOutOrderId = `${activeItemRef.orderId || ''}`.trim();
          continue;
        }

        if (!await detectSmsCodePage(page)) {
          core.log?.('⚠️ Sau khi đổi số chưa thấy trang nhập mã SMS, vẫn thử chờ code rồi để core xử lý nếu thất bại.', 'WARNING');
        }

        const code = await originalGetCode.call(smsService, activeItemRef.orderId, shouldStop);
        if (code) {
          core.log?.(`✅ Số SMS mới đã có code sau khi đổi trong cùng phiên (Order ${activeItemRef.orderId}).`);
          return code;
        }
        lastTimedOutOrderId = `${activeItemRef.orderId || ''}`.trim();
      }

      return null;
    };

    const originalGetValidSmsItem = ChatGPTAccountCreatorCore.prototype.getValidSmsItem;
    if (typeof originalGetValidSmsItem === 'function') {
      ChatGPTAccountCreatorCore.prototype.getValidSmsItem = async function patchedSamePageGetValidSmsItem(smsService, excludedOrderIds = [], incorrectOrderIds = [], exhaustedOrderIds = [], ...args) {
        if (smsService) smsService.__smsRetryCore = this;
        this.__smsPhoneRetryContext = { smsService, excludedOrderIds, incorrectOrderIds, exhaustedOrderIds };
        purgeUsedUpSmsItems(this, 'before_pick_candidate');
        const smsItem = await originalGetValidSmsItem.call(this, smsService, excludedOrderIds, incorrectOrderIds, exhaustedOrderIds, ...args);
        this.__smsCurrentStateItem = smsItem;
        this.__smsCurrentItem = smsItem ? { ...smsItem } : smsItem;
        return this.__smsCurrentItem;
      };
    }

    const originalSaveSMSState = ChatGPTAccountCreatorCore.prototype.saveSMSState;
    if (typeof originalSaveSMSState === 'function') {
      ChatGPTAccountCreatorCore.prototype.saveSMSState = function patchedSamePageSaveSMSState(...args) {
        const holder = this.__smsCurrentItem;
        const stateItem = this.__smsCurrentStateItem;
        if (holder?.orderId && stateItem?.orderId === holder.orderId) {
          stateItem.usageCount = Number(holder.usageCount || stateItem.usageCount || 0);
          stateItem.phoneNumber = holder.phoneNumber || stateItem.phoneNumber;
          stateItem.updatedAt = holder.updatedAt || stateItem.updatedAt || new Date().toISOString();
        }
        if (!this.__purgingUsedUpSmsItems) {
          this.__purgingUsedUpSmsItems = true;
          try {
            purgeUsedUpSmsItems(this, 'before_save_state');
          } finally {
            this.__purgingUsedUpSmsItems = false;
          }
        }
        return originalSaveSMSState.call(this, ...args);
      };
    }

    const originalDetectPhoneMaxUsageExceeded = ChatGPTAccountCreatorCore.prototype.detectPhoneMaxUsageExceeded;
    if (typeof originalDetectPhoneMaxUsageExceeded === 'function') {
      ChatGPTAccountCreatorCore.prototype.detectPhoneMaxUsageExceeded = async function patchedDetectPhoneMaxUsageExceeded(page, ...args) {
        const originalResult = await originalDetectPhoneMaxUsageExceeded.call(this, page, ...args);
        if (originalResult) return originalResult;

        const phoneRejected = await detectOpenAiPhoneRejected(page);
        if (phoneRejected) {
          this.log?.('📵 OpenAI báo số này đang bị chặn/rate-limit gửi OTP. Bỏ số hiện tại và lấy số SMS khác ngay, không chờ OTP.', 'WARNING');
          return true;
        }

        return false;
      };
    }

    const originalClickLocatorWithRetry = ChatGPTAccountCreatorCore.prototype.clickLocatorWithRetry;
    if (typeof originalClickLocatorWithRetry === 'function') {
      ChatGPTAccountCreatorCore.prototype.__smsOriginalClickLocatorWithRetry = originalClickLocatorWithRetry;
      ChatGPTAccountCreatorCore.prototype.clickLocatorWithRetry = async function patchedSmsPhoneClickLocatorWithRetry(locator, options = {}) {
        const label = `${options?.label || ''}`;
        const isPhoneSubmit = /phone|send\s*code\s*sau\s*phone|continue\s*\/\s*send\s*code/i.test(label);
        if (isPhoneSubmit) {
          this.__smsLastPhoneSubmitLocator = locator;
          this.__smsLastPhoneSubmitOptions = { ...options };
          this.__smsLastPhonePage = typeof locator?.page === 'function' ? locator.page() : this.__currentCreatePage;
        }
        const result = await originalClickLocatorWithRetry.call(this, locator, options);
        if (result && isPhoneSubmit) {
          await this.sleep?.(2500);
          const page = typeof locator?.page === 'function' ? locator.page() : this.__currentCreatePage;
          const phoneRejected = await detectOpenAiPhoneRejected(page);
          if (phoneRejected) {
            this.log?.('📵 OpenAI vừa báo lỗi/rate-limit số sau khi bấm Continue. Sẽ xoá số cũ và thử số mới ngay trên trang hiện tại.', 'WARNING');
            const samePageRetried = await retryRejectedPhoneOnSamePage(this, page, locator, options, originalClickLocatorWithRetry, detectOpenAiPhoneRejected);
            if (samePageRetried) return true;

            const orderId = `${this.__smsCurrentItem?.orderId || ''}`.trim();
            throw new Error(`PHONE_MAX_USAGE_EXCEEDED:${orderId || 'unknown'}`);
          }
        }
        return result;
      };
    }

    if (!SMSPoolService.prototype.__smsCodeTimeoutSameSessionPatched) {
      const originalGetCode = SMSPoolService.prototype.getCode;
      if (typeof originalGetCode === 'function') {
        SMSPoolService.prototype.getCode = async function patchedSmsTimeoutSameSessionGetCode(orderId, shouldStop = () => false, ...args) {
          const code = await originalGetCode.call(this, orderId, shouldStop, ...args);
          if (code) return code;

          const core = this.__smsRetryCore;
          if (!core?.__smsPhoneRetryContext || core.__smsCodeTimeoutRetryActive) return code;

          core.__smsCodeTimeoutRetryActive = true;
          try {
            const sameSessionCode = await retrySmsTimeoutPhoneOnSameSession(core, this, orderId, originalGetCode, shouldStop);
            return sameSessionCode || code;
          } finally {
            core.__smsCodeTimeoutRetryActive = false;
          }
        };
        SMSPoolService.prototype.__smsCodeTimeoutSameSessionPatched = true;
      }
    }

    ChatGPTAccountCreatorCore.prototype.__smsPhoneRejectedFastRetryPatched = true;
  };

  const patchCliProxyApiCoreRetry = () => {
    ChatGPTAccountCreatorCore.prototype.__cliProxyApiRefreshBeforeVerify = async () => {
      await captureFreshCliProxyApiAuthUrl('trước khi bắt đầu verify');
    };
    ChatGPTAccountCreatorCore.prototype.__cliProxyApiRefreshBeforeCodex = async () => {
      await captureFreshCliProxyApiAuthUrl('trước khi mở OAuth Codex');
    };

    if (ChatGPTAccountCreatorCore.prototype.__cliProxyApiFreshRetryPatched) return;

    const originalGetCliProxyApiAuthUrl = ChatGPTAccountCreatorCore.prototype.getCliProxyApiAuthUrl;
    ChatGPTAccountCreatorCore.prototype.getCliProxyApiAuthUrl = function patchedGetCliProxyApiAuthUrl(...args) {
      const runtimeProvider = this.normalizeVerifyProvider?.(this.runtimeVerifyProvider || this.config?.verify_provider || '9router') || '9router';
      if (runtimeProvider === 'cliproxyapi') {
        const freshUrl = readJsonFile(this.configFile || workspaceState.configFile, {}).cliproxyapi_auth_url || '';
        if (freshUrl && this.config) this.config.cliproxyapi_auth_url = freshUrl;
      }
      return originalGetCliProxyApiAuthUrl.apply(this, args);
    };

    const originalVerifyWithRetry = ChatGPTAccountCreatorCore.prototype.verifyWithRetry;
    ChatGPTAccountCreatorCore.prototype.verifyWithRetry = async function patchedVerifyWithRetry(...args) {
      const runtimeProvider = this.normalizeVerifyProvider?.(this.runtimeVerifyProvider || this.config?.verify_provider || '9router') || '9router';
      if (runtimeProvider === 'cliproxyapi' && typeof ChatGPTAccountCreatorCore.prototype.__cliProxyApiRefreshBeforeVerify === 'function') {
        await ChatGPTAccountCreatorCore.prototype.__cliProxyApiRefreshBeforeVerify();
      }
      return originalVerifyWithRetry.apply(this, args);
    };

    const originalAddCodexTo9Router = ChatGPTAccountCreatorCore.prototype.addCodexTo9Router;
    ChatGPTAccountCreatorCore.prototype.addCodexTo9Router = async function patchedAddCodexTo9Router(...args) {
      const runtimeProvider = this.normalizeVerifyProvider?.(this.runtimeVerifyProvider || this.config?.verify_provider || '9router') || '9router';
      if (runtimeProvider === 'cliproxyapi' && typeof ChatGPTAccountCreatorCore.prototype.__cliProxyApiRefreshBeforeCodex === 'function') {
        await ChatGPTAccountCreatorCore.prototype.__cliProxyApiRefreshBeforeCodex();
      }
      return originalAddCodexTo9Router.apply(this, args);
    };

    ChatGPTAccountCreatorCore.prototype.__cliProxyApiFreshRetryPatched = true;
  };

  const captureFreshCliProxyApiAuthUrl = async (label = '') => {
    stopCliProxyApiCapture(cliProxyApiCaptureProcess);
    cliProxyApiCaptureProcess = null;
    sendToRenderer('log:line', { line: `[CLIProxyAPI] Đang chạy ${cliProxyApiCommand.executablePath} ${cliProxyApiCommand.args.join(' ')} để lấy OAuth URL mới${label ? ` (${label})` : ''}...` });
    const capture = await captureCliProxyApiAuthUrl({
      executablePath: cliProxyApiCommand.executablePath,
      args: cliProxyApiCommand.args,
      timeoutMs: 45000,
    });
    if (!isValidCliProxyApiAuthUrl(capture.authUrl)) {
      stopCliProxyApiCapture(capture.process);
      throw new Error('CLIProxyAPI không trả Auth URL hợp lệ từ auth.openai.com/oauth/authorize.');
    }
    cliProxyApiAuthUrl = capture.authUrl;
    cliProxyApiCaptureProcess = capture.process;
    persistWorkspaceConfig(normalizeConfigPatch({
      ...payload,
      ...(isCreatePayUnlinkMode ? { selectedMailDomain, randomMailDomain } : {}),
      cliProxyApiAuthUrl,
      cliProxyApiExecutablePath: cliProxyApiCommand.executablePath,
      cliProxyApiConfigPath: cliProxyApiCommand.configPath,
    }));
    sendToRenderer('log:line', { line: '[CLIProxyAPI] Đã bắt OAuth URL mới bằng -no-browser. OAuth sẽ chỉ mở trong browser automation, không mở thêm tab Edge mặc định.' });
    return cliProxyApiAuthUrl;
  };

  patchHotmailOtpHandling();
  patchCreateAccountOtpRetries();
  patchHotmailStatusRefresh();
  patchCreateOtpProfileOrder();
  patchSmsPhoneRejectedFastRetry();

  if (needsVerifyProvider && verifyProvider === 'cliproxyapi') {
    try {
      patchCliProxyApiCoreRetry();
      await captureFreshCliProxyApiAuthUrl('account 1');
    } catch (error) {
      stopCliProxyApiCapture(cliProxyApiCaptureProcess);
      return { ok: false, message: error.message || 'Không lấy được OAuth URL từ CLIProxyAPI.' };
    }
  }

  if (isCreatePayUnlinkMode && createPayUnlinkStage === 'stage1' && !shopgmail9999ApiKey) {
    return { ok: false, message: 'Mode 4 Stage 1 cần ShopGmail9999 API key để lấy Gmail @gmail.com.' };
  }

  if (selectedMailDomain === 'gmail-shopgmail9999' && createPayUnlinkStage === 'stage1' && !shopgmail9999ApiKey) {
    return { ok: false, message: 'Domain Gmail - ShopGmail9999 cần ShopGmail9999 API key.' };
  }

  if (isCreatePayUnlinkMode && createPayUnlinkStage === 'stage2' && (!cplTestCardNumber || !cplTestCardExpiry || !cplTestCardCvc)) {
    stopCliProxyApiCapture(cliProxyApiCaptureProcess);
    return { ok: false, message: 'Mode 4 Stage 2 cần nhập card number, expiry, CVC trong UI hoặc cấu hình env CPL_TEST_CARD_NUMBER, CPL_TEST_CARD_EXPIRY, CPL_TEST_CARD_CVC.' };
  }

  if (!password && !readJsonFile(workspaceState.configFile, {}).password) {
    stopCliProxyApiCapture(cliProxyApiCaptureProcess);
    return { ok: false, message: 'Thiếu password. Hãy nhập password hoặc lưu trong config.json.' };
  }

  const configPayload = isCreatePayUnlinkMode
    ? { ...payload, selectedMailDomain, randomMailDomain }
    : { ...payload };
  if (needsVerifyProvider && verifyProvider === 'cliproxyapi') {
    configPayload.cliProxyApiAuthUrl = cliProxyApiAuthUrl;
    configPayload.cliProxyApiExecutablePath = cliProxyApiCommand.executablePath;
    configPayload.cliProxyApiConfigPath = cliProxyApiCommand.configPath;
  }
  persistWorkspaceConfig(normalizeConfigPatch(configPayload));
  patchPlaywrightLaunchVisibility({ headless });

  if ((mode === 'create' || mode === 'create_verify') && selectedMailDomain === 'hotmail-khommo') {
    const repo = getHotmailRepository();
    const readyCount = repo.getReadyMailAccounts().length;
    const pendingCount = repo.getPendingAccounts().length;
    const neededStatus = mode === 'create_verify' ? 'pending' : 'mail_ready';
    const availableCount = mode === 'create_verify' ? pendingCount : readyCount;
    const missingCount = Math.max(0, count - availableCount);
    if (missingCount > 0) {
      const khommoProductId = [7511, 6000].includes(Number.parseInt(payload?.khommoHotmailProductId ?? savedConfig.khommo_hotmail_product_id ?? 7511, 10))
        ? Number.parseInt(payload?.khommoHotmailProductId ?? savedConfig.khommo_hotmail_product_id ?? 7511, 10)
        : 7511;
      try {
        const purchased = await buyKhommoHotmailForRun({
          apiKey: clonemupApiKey,
          amount: missingCount,
          productId: khommoProductId,
          reason: `RUN ${mode}`,
          status: neededStatus,
        });
        if (purchased.added.length < missingCount) {
          stopCliProxyApiCapture(cliProxyApiCaptureProcess);
          return { ok: false, message: `Khommo chỉ mua được ${purchased.added.length}/${missingCount} Hotmail cần thêm cho status=${neededStatus}.`, ...readWorkspaceData() };
        }
        if (mode === 'create_verify') {
          sendToRenderer('log:line', { line: `[Khommo] RUN create_verify đang cần account pending để verify. Đã mua mail mới và set pending để core không lấy email cũ trong accounts.txt.` });
        }
      } catch (error) {
        stopCliProxyApiCapture(cliProxyApiCaptureProcess);
        return { ok: false, message: error.message || 'Không tự mua được Hotmail Khommo trước khi RUN.', ...readWorkspaceData() };
      }
    }
  }

  const nextPreflight = refreshPreflightState();
  if (!nextPreflight.canRun) {
    stopCliProxyApiCapture(cliProxyApiCaptureProcess);
    return {
      ok: false,
      message: `Preflight blocked: ${nextPreflight.summary}`,
      preflight: nextPreflight,
    };
  }

  isRunning = true;
  latestRunFailure = null;
  const startedAt = new Date();
  runMeta = { mode, count, startedAt: startedAt.toISOString(), workspaceDir: workspaceState.workspaceDir };

  sendToRenderer('run:status', { status: 'running', mode, count, startedAt: runMeta.startedAt, workspaceDir: workspaceState.workspaceDir });

  const preparedProxyPools = await prepareProxyPoolsForRun({
    sendLog: (line) => sendToRenderer('log:line', { line }),
  });

  let currentRuntimeProxyPool = preparedProxyPools[0] || null;
  const validateRuntimeProxyBeforeRun = async (pool = null, accountIndex = 1) => {
    if (!pool?.proxyUrl) return null;
    const label = pool.name || pool.proxyUrl || pool.id || `proxy account ${accountIndex}`;
    sendToRenderer('log:line', { line: `[Proxy] Kiểm tra proxy trước khi mở ChatGPT account ${accountIndex}: ${label}` });
    try {
      const result = await testProxyCanOpenChatGpt(pool);
      sendToRenderer('log:line', { line: `[Proxy] OK mở được auth.openai.com (${result.latencyMs || 0}ms): ${label}` });
      return pool;
    } catch (error) {
      disableRuntimeProxyPool(pool, error.message || error, (line) => sendToRenderer('log:line', { line }));
      return null;
    }
  };

  const pickProxyPoolsForRun = (accountIndex = 1) => {
    const availableProxyPools = preparedProxyPools.filter((pool) => pool?.active !== false);
    if (!availableProxyPools.length) return [];
    if (payload?.proxyRoundRobin !== true) return availableProxyPools;
    const sticky = Math.max(1, Number.parseInt(payload?.proxySticky ?? 1, 10) || 1);
    const normalizedAccountIndex = Math.max(1, Number.parseInt(accountIndex, 10) || 1);
    const proxyIndex = Math.floor((normalizedAccountIndex - 1) / sticky) % availableProxyPools.length;
    const selectedProxy = availableProxyPools[proxyIndex] || availableProxyPools[0];
    return selectedProxy ? [selectedProxy] : [];
  };

  const buildRunOptions = (runCount, proxyAccountIndex = 1) => {
    const runtimeProxyPools = pickProxyPoolsForRun(proxyAccountIndex);
    currentRuntimeProxyPool = runtimeProxyPools[0] || null;
    return {
    count: runCount,
    mode,
    smspoolKey,
    password,
    routerPassword,
    selectedMailDomain: selectedMailDomain === 'hotmail-khommo' ? 'hotmail' : selectedMailDomain,
    randomMailDomain,
    headless,
    shopgmail9999ApiKey,
    clonemupApiKey,
    workspaceDir: workspaceState.workspaceDir,
    accountsFile: workspaceState.accountsFile,
    hotmailAccountsFile: workspaceState.hotmailAccountsFile,
    configFile: workspaceState.configFile,
    smsStateFile: workspaceState.smsStateFile,
    logDir: workspaceState.logDir,
    createPayUnlinkStage,
    createPayUnlinkDryRun,
    createPayUnlinkAllowSubmit,
    cplTestCardNumber,
    cplTestCardExpiry,
    cplTestCardCvc,
    verifyProvider,
    cliProxyApiAuthUrl,
    cliProxyApiExecutablePath: cliProxyApiCommand.executablePath,
    cliProxyApiConfigPath: cliProxyApiCommand.configPath,
    proxyPool: currentRuntimeProxyPool,
    proxyPools: runtimeProxyPools.length ? runtimeProxyPools : preparedProxyPools,
    proxyRoundRobin: payload?.proxyRoundRobin === true,
    proxyApplyRotate: payload?.proxyApplyRotate === true,
    proxySticky: Math.max(1, Number.parseInt(payload?.proxySticky ?? 1, 10) || 1),
    vpnEnabled,
    vpnExtensionPath,
    onLog: (line) => {
      const normalizedLine = `${line || ''}`.replace(/(tạo account\s*\()(\d+)\/24(\))/gi, (_match, prefix, attempt, suffix) => `${prefix}${Math.min(7, Number.parseInt(attempt, 10) || 1)}/7${suffix}`);
      sendToRenderer('log:line', { line: normalizedLine });
      if (/proxy_runtime_error|407\s+Proxy Authentication Required|proxy server is refusing connections|proxy authentication required/i.test(normalizedLine)) {
        disableRuntimeProxyPool(currentRuntimeProxyPool || preparedProxyPools[0] || null, normalizedLine, (proxyLine) => sendToRenderer('log:line', { line: proxyLine }));
      }
      removeHotmailOnOtpExhaustedLog(normalizedLine);
    },
    onState: (state) => {
      if (state?.type === 'failure') {
        latestRunFailure = state;
        sendToRenderer('run:failure', state);
      }
      sendToRenderer('run:event', state);
    },
  };
  };

  activeRun = (async () => {
    if (!(needsVerifyProvider && verifyProvider === 'cliproxyapi')) {
      currentRuntimeProxyPool = await validateRuntimeProxyBeforeRun(pickProxyPoolsForRun(1)[0] || null, 1);
      return runCreator(buildRunOptions(count, 1));
    }

    let totalSuccessful = 0;
    let totalFailed = 0;
    let latestSummary = null;
    let forced = false;

    for (let accountIndex = 1; accountIndex <= count; accountIndex += 1) {
      if (accountIndex > 1) {
        await captureFreshCliProxyApiAuthUrl(`account ${accountIndex}`);
      }

      currentRuntimeProxyPool = await validateRuntimeProxyBeforeRun(pickProxyPoolsForRun(accountIndex)[0] || null, accountIndex);
      sendToRenderer('log:line', { line: `[CLIProxyAPI] Verify account ${accountIndex}/${count} bằng OAuth URL mới.` });
      latestSummary = await runCreator(buildRunOptions(1, accountIndex));
      totalSuccessful += Number.parseInt(latestSummary?.successful ?? 0, 10) || 0;
      totalFailed += Number.parseInt(latestSummary?.failed ?? 0, 10) || 0;
      forced = latestSummary?.forced === true;

      stopCliProxyApiCapture(cliProxyApiCaptureProcess);
      cliProxyApiCaptureProcess = null;

      if (forced) break;
    }

    return {
      ...(latestSummary || {}),
      successful: totalSuccessful,
      failed: totalFailed,
      forced,
    };
  })();

  activeRun
    .then(async (summary) => {
      stopCliProxyApiCapture(cliProxyApiCaptureProcess);
      const finishedAt = new Date();
      const durationSec = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);
      const failure = summary?.latestFailure || latestRunFailure;
      const runStatus = summary?.forced ? 'force-stopped' : 'done';
      const historyEntry = {
        id: `${startedAt.getTime()}`,
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        durationSec,
        mode,
        count,
        successful: summary.successful,
        failed: summary.failed,
        status: runStatus,
        workspaceDir: workspaceState.workspaceDir,
        latestFailure: failure,
      };
      historyStore.append(historyEntry);

      sendToRenderer('run:status', {
        status: runStatus,
        summary,
        durationSec,
        workspaceDir: workspaceState.workspaceDir,
        latestFailure: failure,
      });

      if (failure) await showFailureDialog(failure);
      sendToRenderer('history:updated', historyStore.list(100));
    })
    .catch(async (error) => {
      stopCliProxyApiCapture(cliProxyApiCaptureProcess);
      const finishedAt = new Date();
      const durationSec = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);
      const historyEntry = {
        id: `${startedAt.getTime()}`,
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        durationSec,
        mode,
        count,
        successful: 0,
        failed: 0,
        status: 'error',
        error: error.message,
        latestFailure: latestRunFailure,
        workspaceDir: workspaceState.workspaceDir,
      };
      historyStore.append(historyEntry);

      sendToRenderer('run:status', {
        status: 'error',
        error: error.message,
        latestFailure: latestRunFailure,
        workspaceDir: workspaceState.workspaceDir,
      });

      if (latestRunFailure) await showFailureDialog(latestRunFailure);
      sendToRenderer('history:updated', historyStore.list(100));
    })
    .finally(() => {
      isRunning = false;
      activeRun = null;
      runMeta = null;
    });

  return { ok: true };
});

ipcMain.handle('run:stop', async () => {
  if (!isRunning) return { ok: false, message: 'Không có tiến trình nào đang chạy.' };
  stopCreator();
  return { ok: true, message: 'Đã gửi lệnh dừng mềm.' };
});

ipcMain.handle('run:force-stop', async () => {
  if (!isRunning) return { ok: false, message: 'Không có tiến trình nào đang chạy.' };
  await forceStopCreator();
  return { ok: true, message: 'Đã gửi lệnh Force Stop. Browser đang chạy sẽ đóng ngay.' };
});

ipcMain.handle('data:refresh', async () => ({ ok: true, ...readWorkspaceData() }));
ipcMain.handle('data:save-accounts', async (_event, rows) => {
  const blockedReason = assertCanEditWorkspaceData();
  if (blockedReason) return { ok: false, message: blockedReason };

  try {
    const content = serializeAccountsRows(rows);
    fs.writeFileSync(workspaceState.accountsFile, content ? `${content}\n` : '', 'utf-8');
    return { ok: true, message: 'Đã lưu accounts.txt.', ...readWorkspaceData() };
  } catch (error) {
    return { ok: false, message: error.message };
  }
});
ipcMain.handle('data:save-sms-state', async (_event, rows) => {
  const blockedReason = assertCanEditWorkspaceData();
  if (blockedReason) return { ok: false, message: blockedReason };

  try {
    fs.writeFileSync(workspaceState.smsStateFile, JSON.stringify(serializeSmsRows(rows), null, 2), 'utf-8');
    return { ok: true, message: 'Đã lưu SMS state.', ...readWorkspaceData() };
  } catch (error) {
    return { ok: false, message: error.message };
  }
});
ipcMain.handle('data:save-hotmail-accounts', async (_event, rows) => {
  const blockedReason = assertCanEditWorkspaceData();
  if (blockedReason) return { ok: false, message: blockedReason };

  try {
    const content = serializeHotmailRows(rows);
    fs.writeFileSync(workspaceState.hotmailAccountsFile, content ? `${content}\n` : '', 'utf-8');
    return { ok: true, message: 'Đã lưu accounts-hotmail.txt.', ...readWorkspaceData() };
  } catch (error) {
    return { ok: false, message: error.message };
  }
});
ipcMain.handle('data:import-hotmail-accounts', async (_event, payload) => {
  const blockedReason = assertCanEditWorkspaceData();
  if (blockedReason) return { ok: false, message: blockedReason };

  try {
    const text = typeof payload === 'string' ? payload : `${payload?.text || ''}`;
    const status = getHotmailRepository().normalizeStatus(payload?.status || 'mail_ready');
    const result = getHotmailRepository().appendManualAccounts(text, status);
    return {
      ok: true,
      message: `Đã add ${result.added.length} Hotmail status=${status}. Trùng: ${result.skipped.length}. Lỗi: ${result.rejected.length}.`,
      added: result.added.length,
      skipped: result.skipped.length,
      rejected: result.rejected.length,
      rejectedRows: result.rejected,
      skippedRows: result.skipped,
      ...readWorkspaceData(),
    };
  } catch (error) {
    return { ok: false, message: error.message, ...readWorkspaceData() };
  }
});
ipcMain.handle('history:list', async (_event, limit = 100) => ({ ok: true, items: historyStore.list(limit) }));
ipcMain.handle('proxy:list', async () => ({ ok: true, proxyPools: parseProxyPoolsFile(workspaceState.proxyPoolsFile) }));
ipcMain.handle('proxy:save', async (_event, rows) => {
  const blockedReason = assertCanEditWorkspaceData();
  if (blockedReason) return { ok: false, message: blockedReason };
  try {
    persistProxyPools(rows);
    return { ok: true, message: 'Đã lưu Proxy Pools.', proxyPools: parseProxyPoolsFile(workspaceState.proxyPoolsFile) };
  } catch (error) {
    return { ok: false, message: error.message };
  }
});
ipcMain.handle('proxy:batch-import', async (_event, text) => {
  const blockedReason = assertCanEditWorkspaceData();
  if (blockedReason) return { ok: false, message: blockedReason };
  try {
    const current = parseProxyPoolsFile(workspaceState.proxyPoolsFile);
    const imported = `${text || ''}`.split(/\r?\n/).map(parseProxyImportLine).filter(Boolean).map((proxyUrl, index) => normalizeProxyPool({ name: `Imported Proxy ${index + 1}`, proxyUrl, type: 'custom' }));
    const next = serializeProxyPools([...current, ...imported]);
    persistProxyPools(next);
    return { ok: true, message: `Đã import ${imported.length} proxy.`, proxyPools: next };
  } catch (error) {
    return { ok: false, message: error.message };
  }
});
ipcMain.handle('proxy:deploy-vercel-relay', async (_event, payload) => {
  const blockedReason = assertCanEditWorkspaceData();
  if (blockedReason) return { ok: false, message: blockedReason };
  try {
    const result = await deployVercelRelay({ token: payload?.token, projectName: payload?.projectName, teamId: payload?.teamId, sharedSecret: payload?.sharedSecret });
    const current = parseProxyPoolsFile(workspaceState.proxyPoolsFile);
    const relay = normalizeProxyPool({ name: result.projectName || 'Vercel Relay', type: 'vercel_relay', proxyUrl: result.proxyUrl, strict: false, active: true });
    const next = serializeProxyPools([...current, relay]);
    persistProxyPools(next);
    return { ok: true, message: 'Deploy Vercel Relay thành công.', relay, result: { ...result, token: undefined }, proxyPools: next };
  } catch (error) {
    return { ok: false, message: error.message };
  }
});
ipcMain.handle('proxy:test', async (_event, pool) => {
  try {
    const result = await testProxyPool(await resolveKunProxyPool(pool));
    return { ok: true, message: `Proxy hoạt động. Latency ${result.latencyMs}ms.`, result };
  } catch (error) {
    return { ok: false, message: error.message };
  }
});
ipcMain.handle('shell:open-external', async (_event, url) => openExternalUrl(url));
ipcMain.handle('shell:open-data-file', async (_event, kind) => openWorkspaceDataFile(kind));
ipcMain.handle('workspace:open-folder', async () => openWorkspaceFolder());
ipcMain.handle('run:state', async () => ({ ok: true, isRunning, runMeta, workspace: workspaceState }));
ipcMain.handle('workspace:get', async () => ({ ok: true, workspace: workspaceState }));
ipcMain.handle('preflight:get', async () => ({ ok: true, preflight: refreshPreflightState() }));

ipcMain.handle('workspace:choose', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Chọn thư mục dữ liệu / source',
    properties: ['openDirectory'],
    defaultPath: workspaceState.workspaceDir,
  });

  if (result.canceled || !result.filePaths?.[0]) {
    return { ok: false, canceled: true, workspace: workspaceState };
  }

  workspaceState = buildWorkspaceFromDir(result.filePaths[0]);
  ensureWorkspaceFiles(workspaceState);
  saveWorkspaceState();
  emitPreflightChanged();

  const payload = { ok: true, workspace: workspaceState, ...readWorkspaceData() };
  sendToRenderer('workspace:changed', payload.workspace);
  return payload;
});

app.whenReady().then(async () => {
  loadWorkspaceState();
  configureAutoUpdater();
  await checkForAppUpdate();
  createWindow();
  emitPreflightChanged();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
