const el = {
  dashboardShell: document.getElementById('dashboard-shell'),
  updateCard: document.getElementById('update-card'),
  updateVersionText: document.getElementById('update-version-text'),
  updateMetaText: document.getElementById('update-meta-text'),
  updateNotesText: document.getElementById('update-notes-text'),
  updateProgressTrack: document.getElementById('update-progress-track'),
  updateProgressBar: document.getElementById('update-progress-bar'),
  updatePathText: document.getElementById('update-path-text'),
  checkUpdateBtn: document.getElementById('check-update-button'),
  downloadUpdateBtn: document.getElementById('download-update-button'),
  installUpdateBtn: document.getElementById('install-update-button'),
  openReleasePageBtn: document.getElementById('open-release-page-button'),
  preflightCard: document.getElementById('preflight-card'),
  preflightBadge: document.getElementById('preflight-badge'),
  preflightStatusText: document.getElementById('preflight-status-text'),
  preflightSummaryText: document.getElementById('preflight-summary-text'),
  preflightList: document.getElementById('preflight-list'),
  smsKey: document.getElementById('sms-key-input'),
  smsBalanceCard: document.getElementById('sms-balance-card'),
  smsBalanceValue: document.getElementById('sms-balance-value'),
  smsBalanceMeta: document.getElementById('sms-balance-meta'),
  smsBalanceCheckBtn: document.getElementById('sms-balance-check-button'),
  smsPoolOpenBtn: document.getElementById('smspool-open-button'),
  clonemupKey: document.getElementById('clonemup-key-input'),
  clonemupBalanceCard: document.getElementById('clonemup-balance-card'),
  clonemupBalanceValue: document.getElementById('clonemup-balance-value'),
  clonemupBalanceMeta: document.getElementById('clonemup-balance-meta'),
  clonemupBalanceCheckBtn: document.getElementById('clonemup-balance-check-button'),
  clonemupProductSelect: document.getElementById('clonemup-product-select'),
  clonemupProductId: document.getElementById('clonemup-product-id-input'),
  clonemupProductPriceNote: document.getElementById('clonemup-product-price-note'),
  clonemupOpenBtn: document.getElementById('clonemup-open-button'),
  khommoKey: document.getElementById('khommo-key-input'),
  khommoBalanceCard: document.getElementById('khommo-balance-card'),
  khommoBalanceValue: document.getElementById('khommo-balance-value'),
  khommoBalanceMeta: document.getElementById('khommo-balance-meta'),
  khommoBalanceCheckBtn: document.getElementById('khommo-balance-check-button'),
  khommoProductSelect: document.getElementById('khommo-product-select'),
  khommoProductPriceNote: document.getElementById('khommo-product-price-note'),
  khommoOpenBtn: document.getElementById('khommo-open-button'),
  shopgmail9999Key: document.getElementById('shopgmail9999-key-input'),
  shopgmail9999BalanceCard: document.getElementById('shopgmail9999-balance-card'),
  shopgmail9999BalanceValue: document.getElementById('shopgmail9999-balance-value'),
  shopgmail9999BalanceMeta: document.getElementById('shopgmail9999-balance-meta'),
  shopgmail9999BalanceCheckBtn: document.getElementById('shopgmail9999-balance-check-button'),
  shopgmail9999OpenBtn: document.getElementById('shopgmail9999-open-button'),
  hotmailBuyAmount: document.getElementById('hotmail-buy-amount-input'),
  hotmailBuyBtn: document.getElementById('hotmail-buy-button'),
  hotmailImportTextarea: document.getElementById('hotmail-import-textarea'),
  hotmailImportStatus: document.getElementById('hotmail-import-status-select'),
  hotmailImportBtn: document.getElementById('hotmail-import-button'),
  hotmailRunnableCount: document.getElementById('hotmail-runnable-count'),
  password: document.getElementById('password-input'),
  routerPassword: document.getElementById('router-password-input'),
  verifyProvider: document.getElementById('verify-provider-select'),
  verifyProviderSwitch: document.getElementById('verify-provider-switch'),
  cliProxyApiAuthUrl: document.getElementById('cliproxyapi-auth-url-input'),
  cliProxyApiExecutable: document.getElementById('cliproxyapi-executable-input'),
  cliProxyApiConfig: document.getElementById('cliproxyapi-config-input'),
  cliProxyApiField: document.querySelector('.cliproxyapi-panel'),
  verifyProviderNote: document.getElementById('verify-provider-note'),
  mailDomain: document.getElementById('mail-domain-select'),
  randomMailDomain: document.getElementById('random-mail-domain-input'),
  headless: document.getElementById('headless-input'),
  count: document.getElementById('count-input'),
  mode: document.getElementById('mode-select'),
  runtimeConfigCard: document.querySelector('.runtime-config-card'),
  mode4WarningNote: document.getElementById('mode4-warning-note'),
  createPayUnlinkStage: document.getElementById('create-pay-unlink-stage-select'),
  createPayUnlinkStageField: document.getElementById('create-pay-unlink-stage-select')?.closest('.mode4-only'),
  createPayUnlinkSubmit: document.getElementById('create-pay-unlink-submit-checkbox'),
  createPayUnlinkSubmitField: document.getElementById('create-pay-unlink-submit-checkbox')?.closest('.mode4-submit-toggle'),
  cplCardNumber: document.getElementById('cpl-card-number-input'),
  cplCardNumberField: document.getElementById('cpl-card-number-input')?.closest('.mode4-stage2-only'),
  cplCardExpiry: document.getElementById('cpl-card-expiry-input'),
  cplCardExpiryField: document.getElementById('cpl-card-expiry-input')?.closest('.mode4-stage2-only'),
  cplCardCvc: document.getElementById('cpl-card-cvc-input'),
  cplCardCvcField: document.getElementById('cpl-card-cvc-input')?.closest('.mode4-stage2-only'),
  vpnEnabled: document.getElementById('vpn-enabled-input'),
  vpnExtensionPath: document.getElementById('vpn-extension-path-input'),
  vpnStatusBadge: document.getElementById('vpn-status-badge'),
  runBtn: document.getElementById('run-button'),
  stopBtn: document.getElementById('stop-button'),
  forceStopBtn: document.getElementById('force-stop-button'),
  saveConfigBtn: document.getElementById('save-config-button'),
  refreshBtn: document.getElementById('refresh-button'),
  chooseWorkspaceBtn: document.getElementById('choose-workspace-button'),
  workspaceOpenBtn: document.getElementById('workspace-open-button'),
  workspacePath: document.getElementById('workspace-path'),
  workspaceMeta: document.getElementById('workspace-files-meta'),
  saveConfigStatus: document.getElementById('save-config-status'),
  runDot: document.getElementById('run-indicator-dot'),
  runText: document.getElementById('run-indicator-text'),
  logOutput: document.getElementById('log-output'),
  logCount: document.getElementById('log-count-badge'),
  pauseLogBtn: document.getElementById('pause-log-button'),
  copyLogBtn: document.getElementById('copy-log-button'),
  clearLogBtn: document.getElementById('clear-log-button'),
  logFilterGroup: document.getElementById('log-filter-group'),
  accountsBody: document.getElementById('accounts-table-body'),
  smsBody: document.getElementById('sms-table-body'),
  historyBody: document.getElementById('history-table-body'),
  accountsCount: document.getElementById('accounts-count-badge'),
  smsCount: document.getElementById('sms-count-badge'),
  historyCount: document.getElementById('history-count-badge'),
  accountsEditBtn: document.getElementById('accounts-edit-button'),
  accountsSaveBtn: document.getElementById('accounts-save-button'),
  accountsOpenBtn: document.getElementById('accounts-open-button'),
  smsEditBtn: document.getElementById('sms-edit-button'),
  smsSaveBtn: document.getElementById('sms-save-button'),
  smsOpenBtn: document.getElementById('sms-open-button'),
  accountsStats: document.getElementById('accounts-stats'),
  smsStats: document.getElementById('sms-stats'),
  hotmailBody: document.getElementById('hotmail-table-body'),
  hotmailCount: document.getElementById('hotmail-count-badge'),
  hotmailEditBtn: document.getElementById('hotmail-edit-button'),
  hotmailSaveBtn: document.getElementById('hotmail-save-button'),
  hotmailOpenBtn: document.getElementById('hotmail-open-button'),
  hotmailStats: document.getElementById('hotmail-stats'),
  hotmailSearch: document.getElementById('hotmail-search-input'),
  hotmailPager: document.getElementById('hotmail-pager'),
  historyStats: document.getElementById('history-stats'),
  accountsSearch: document.getElementById('accounts-search-input'),
  smsSearch: document.getElementById('sms-search-input'),
  historySearch: document.getElementById('history-search-input'),
  accountsPager: document.getElementById('accounts-pager'),
  smsPager: document.getElementById('sms-pager'),
  historyPager: document.getElementById('history-pager'),
  runStatusBadge: document.getElementById('run-status-badge'),
  proxyCount: document.getElementById('proxy-count-badge'),
  proxyLogCount: document.getElementById('proxy-log-count-badge'),
  proxyLogOutput: document.getElementById('proxy-log-output'),
  proxyLogClearBtn: document.getElementById('proxy-log-clear-button'),
  proxyOpenBtn: document.getElementById('proxy-open-button'),
  proxyList: document.getElementById('proxy-list'),
  proxyRoundRobin: document.getElementById('proxy-round-robin-input'),
  proxyApplyRotate: document.getElementById('proxy-apply-rotate-input'),
  proxySticky: document.getElementById('proxy-sticky-input'),
  vercelRelayBtn: document.getElementById('vercel-relay-button'),
  proxyImportBtn: document.getElementById('proxy-import-button'),
  proxyBulkToggleBtn: document.getElementById('proxy-bulk-toggle-button'),
  proxyAddBtn: document.getElementById('proxy-add-button'),
  proxyModalBackdrop: document.getElementById('proxy-modal-backdrop'),
  proxyAddModal: document.getElementById('proxy-add-modal'),
  proxyImportModal: document.getElementById('proxy-import-modal'),
  vercelRelayModal: document.getElementById('vercel-relay-modal'),
  proxyNameInput: document.getElementById('proxy-name-input'),
  proxyUrlInput: document.getElementById('proxy-url-input'),
  proxyKunProxyApiInput: document.getElementById('proxy-kunproxy-api-input'),
  proxyKunProxyFields: document.getElementById('proxy-kunproxy-fields'),
  proxyKunProxyKeyInput: document.getElementById('proxy-kunproxy-key-input'),
  proxyKunProxyOrderInput: document.getElementById('proxy-kunproxy-order-input'),
  proxyNoProxyInput: document.getElementById('proxy-no-proxy-input'),
  proxyActiveInput: document.getElementById('proxy-active-input'),
  proxyStrictInput: document.getElementById('proxy-strict-input'),
  proxyImportTextarea: document.getElementById('proxy-import-textarea'),
  vercelTokenInput: document.getElementById('vercel-token-input'),
  vercelProjectInput: document.getElementById('vercel-project-input'),
  vercelSecretInput: document.getElementById('vercel-secret-input'),
  vercelTokenLink: document.querySelector('.token-link'),
};

let logLines = [];
let proxyLogLines = [];
let currentWorkspace = null;
let authState = {
  authenticated: true,
  loading: false,
  account: null,
  device: null,
  token: '',
  expiresAt: '',
  error: '',
};
let updateState = {
  checking: false,
  available: false,
  downloading: false,
  downloaded: false,
  currentVersion: '',
  latestVersion: '',
  releaseName: '',
  releaseDate: '',
  releaseNotes: [],
  progressPercent: 0,
  progressTransferred: 0,
  progressTotal: 0,
  bytesPerSecond: 0,
  checkedAt: '',
  downloadedAt: '',
  releaseUrl: '',
  error: '',
};
let preflightState = {
  checkedAt: '',
  status: 'checking',
  canRun: false,
  summary: 'Đang kiểm tra runtime...',
  bundledBrowsersDir: '',
  checks: [],
};
let saveConfigStatusTimer = null;
let smsBalanceRefreshTimer = null;
let currentRunStatus = 'idle';
let tableState = {
  accounts: { rows: [], query: '', page: 1, pageSize: 500, editing: false },
  sms: { rows: [], query: '', page: 1, pageSize: 100, editing: false },
  history: { rows: [], query: '', page: 1, pageSize: 50 },
  hotmail: { rows: [], query: '', page: 1, pageSize: 500, editing: false },
  proxyPools: { rows: [] },
};
let logUiState = {
  filter: 'all',
  autoScroll: true,
};
let activeProxySelection = null;

const runtimeInputs = [];

function initRuntimeInputs() {
  runtimeInputs.splice(
    0,
    runtimeInputs.length,
    el.smsKey,
    el.smsBalanceCheckBtn,
    el.smsPoolOpenBtn,
    el.clonemupKey,
    el.clonemupBalanceCheckBtn,
    el.clonemupOpenBtn,
    el.clonemupProductSelect,
    el.clonemupProductId,
    el.khommoKey,
    el.khommoBalanceCheckBtn,
    el.khommoOpenBtn,
    el.khommoProductSelect,
    el.shopgmail9999Key,
    el.shopgmail9999BalanceCheckBtn,
    el.shopgmail9999OpenBtn,
    el.hotmailBuyAmount,
    el.hotmailBuyBtn,
    el.hotmailImportTextarea,
    el.hotmailImportBtn,
    el.password,
    el.routerPassword,
    el.verifyProvider,
    el.cliProxyApiExecutable,
    el.cliProxyApiConfig,
    el.mailDomain,
    el.randomMailDomain,
    el.count,
    el.mode,
    el.createPayUnlinkStage,
    el.createPayUnlinkSubmit,
    el.proxyRoundRobin,
    el.proxyApplyRotate,
    el.proxySticky,
    el.proxyBulkToggleBtn,
    el.vpnEnabled,
    el.vpnExtensionPath,
    el.chooseWorkspaceBtn,
    el.saveConfigBtn,
    el.refreshBtn,
  );
}

function escapeHtml(text) {
  return `${text}`
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatFailureLog(failure) {
  if (!failure) return '[FAILURE] Không có dữ liệu chẩn đoán';

  const parts = [
    `step=${failure.step || 'n/a'}`,
    `action=${failure.action || 'n/a'}`,
    `selector=${failure.selector || 'n/a'}`,
    `url=${failure.url || 'n/a'}`,
    `title=${failure.title || 'n/a'}`,
  ];

  if (failure.screenshotPath) parts.push(`screenshot=${failure.screenshotPath}`);
  if (failure.htmlPath) parts.push(`html=${failure.htmlPath}`);
  if (failure.diagnosticPath) parts.push(`json=${failure.diagnosticPath}`);
  if (failure.errorMessage) parts.push(`error=${failure.errorMessage}`);

  return `[FAILURE] ${parts.join(' | ')}`;
}

function formatIsoDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN');
}

function formatBytes(bytes) {
  const value = Number(bytes || 0);
  if (!Number.isFinite(value) || value <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = value;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 100 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function renderAuthState() {
  el.dashboardShell.classList.remove('hidden');
}

function setRunningState(running, statusText = 'Idle', isError = false) {
  currentRunStatus = running ? 'running' : isError ? 'error' : statusText.toLowerCase().includes('done') ? 'success' : 'idle';

  el.runDot.classList.remove('running', 'error', 'success');
  el.runStatusBadge?.classList.remove('is-idle', 'is-running', 'is-error', 'is-success', 'is-warning');

  if (running) {
    el.runDot.classList.add('running');
    el.runStatusBadge?.classList.add('is-running');
    el.runText.textContent = statusText;
    el.runBtn.disabled = true;
    el.stopBtn.disabled = false;
    el.forceStopBtn.disabled = false;
    tableState.accounts.editing = false;
    tableState.sms.editing = false;
    renderAccounts(tableState.accounts.rows);
    renderSms(tableState.sms.rows);
    runtimeInputs.forEach((input) => {
      if (input) input.disabled = true;
    });
    return;
  }

  if (isError) {
    el.runDot.classList.add('error');
    el.runStatusBadge?.classList.add('is-error');
  } else if (currentRunStatus === 'success') {
    el.runDot.classList.add('success');
    el.runStatusBadge?.classList.add('is-success');
  } else {
    el.runStatusBadge?.classList.add(preflightState.status === 'fatal' ? 'is-warning' : 'is-idle');
  }

  el.runText.textContent = statusText;
  el.runBtn.disabled = !authState.authenticated || preflightState.status === 'fatal';
  el.stopBtn.disabled = true;
  el.forceStopBtn.disabled = true;
  updateTableActionButtons('accounts');
  updateTableActionButtons('sms');
  runtimeInputs.forEach((input) => {
    if (input) input.disabled = !authState.authenticated;
  });
  const isCreatePayUnlinkMode = el.mode?.value === 'create_pay_unlink';
  if (isCreatePayUnlinkMode) {
    if (el.mailDomain) el.mailDomain.value = 'gmail-shopgmail9999';
    if (el.randomMailDomain) el.randomMailDomain.checked = false;
  }
  el.mailDomain.disabled = !authState.authenticated || isCreatePayUnlinkMode || (el.randomMailDomain?.checked === true);
  updateVpnUiState();
  el.saveConfigBtn.disabled = !authState.authenticated;
  el.refreshBtn.disabled = !authState.authenticated;
  el.chooseWorkspaceBtn.disabled = !authState.authenticated;
}

function getLogLevel(line) {
  const value = `${line}`.toLowerCase();
  if (value.includes('error') || value.includes('[failure]') || value.includes('failed') || value.includes('fail')) return 'error';
  if (value.includes('warn') || value.includes('warning') || value.includes('blocked')) return 'warning';
  return 'info';
}

function renderLog() {
  const filtered = logUiState.filter === 'all'
    ? logLines
    : logLines.filter((line) => getLogLevel(line) === logUiState.filter);

  el.logOutput.textContent = filtered.join('\n');
  el.logCount.textContent = `${filtered.length}/${logLines.length} lines`;
  if (logUiState.autoScroll) el.logOutput.scrollTop = el.logOutput.scrollHeight;
}

function renderProxyLog() {
  if (!el.proxyLogOutput || !el.proxyLogCount) return;
  el.proxyLogOutput.textContent = proxyLogLines.length ? proxyLogLines.join('\n') : 'Chưa có log proxy.';
  el.proxyLogCount.textContent = `${proxyLogLines.length} lines`;
  el.proxyLogOutput.scrollTop = el.proxyLogOutput.scrollHeight;
}

function isProxyLogLine(line = '') {
  const value = `${line || ''}`.toLowerCase();
  return value.includes('[proxy]') || value.includes('proxy-selected') || value.includes('kunproxy');
}

function pushProxyLog(line) {
  const timestamp = new Date().toLocaleTimeString('vi-VN', { hour12: false });
  proxyLogLines.push(`[${timestamp}] ${line}`);
  if (proxyLogLines.length > 300) proxyLogLines = proxyLogLines.slice(proxyLogLines.length - 300);
  renderProxyLog();
}

function pushLog(line) {
  logLines.push(line);
  if (logLines.length > 2000) logLines = logLines.slice(logLines.length - 2000);
  if (isProxyLogLine(line)) pushProxyLog(line);
  renderLog();
}

function setSaveConfigStatus(message = '', type = '') {
  if (saveConfigStatusTimer) {
    clearTimeout(saveConfigStatusTimer);
    saveConfigStatusTimer = null;
  }

  el.saveConfigStatus.textContent = message;
  el.saveConfigStatus.classList.remove('hidden', 'is-pending', 'is-success', 'is-error');
  el.saveConfigBtn.classList.remove('is-success', 'is-error');

  if (!message) {
    el.saveConfigStatus.classList.add('hidden');
    el.saveConfigBtn.textContent = '💾 Lưu config';
    return;
  }

  if (type === 'pending') {
    el.saveConfigStatus.classList.add('is-pending');
    return;
  }

  if (type === 'success') {
    el.saveConfigStatus.classList.add('is-success');
    el.saveConfigBtn.classList.add('is-success');
    el.saveConfigBtn.textContent = '✅ Đã lưu';
    saveConfigStatusTimer = window.setTimeout(() => {
      setSaveConfigStatus('', '');
    }, 2600);
    return;
  }

  if (type === 'error') {
    el.saveConfigStatus.classList.add('is-error');
    el.saveConfigBtn.classList.add('is-error');
    el.saveConfigBtn.textContent = '⚠ Lưu lỗi';
  }
}

function escapeAttr(text) {
  return escapeHtml(text).replaceAll('`', '&#96;');
}

function getStatusClass(status) {
  const value = `${status || 'unknown'}`.toLowerCase();
  if (value.includes('running')) return 'running';
  if (value.includes('verify') || value.includes('done') || value.includes('verified') || value.includes('active') || value.includes('ok') || value.includes('success')) return 'verified';
  if (value.includes('error') || value.includes('fail') || value.includes('blocked') || value.includes('expired')) return 'error';
  return 'pending';
}

function syncClonemupProductUi(options = {}) {
  const { silentLegacyNormalization = false } = options;
  const productId = Math.max(1, Number.parseInt(el.clonemupProductId?.value || '7614', 10) || 7614);
  if (el.clonemupProductSelect) {
    el.clonemupProductSelect.value = productId === 16133 ? '7614' : `${productId}`;
  }
  if (productId === 16133 && el.clonemupProductId) {
    el.clonemupProductId.value = 7614;
    if (!silentLegacyNormalization) {
      pushLog('[Clonemup] Product 16133 đã hết hàng, tự chuyển sang product 7614.');
    }
  }
  const activeProduct = Math.max(1, Number.parseInt(el.clonemupProductId?.value || '7614', 10) || 7614);
  if (el.clonemupProductPriceNote) {
    el.clonemupProductPriceNote.textContent = activeProduct === 7614
      ? 'Product 7614 • 297đ / hotmail'
      : `Product ${activeProduct} • kiểm tra giá trên Clonemup`;
  }
}

function getKhommoProductLabel(productId = 7511) {
  const id = Number.parseInt(productId, 10);
  if (id === 6000) return '6000 • Hotmail OAuth • 350đ/acc';
  return '7511 • Hotmail OAuth • 196đ/acc • còn dùng';
}

function syncKhommoProductUi() {
  const allowedIds = [7511, 6000];
  const selectedId = Number.parseInt(el.khommoProductSelect?.value || '7511', 10);
  const safeId = allowedIds.includes(selectedId) ? selectedId : 7511;
  if (el.khommoProductSelect) {
    el.khommoProductSelect.value = `${safeId}`;
    allowedIds.forEach((productId) => {
      const option = el.khommoProductSelect.querySelector(`option[value="${productId}"]`);
      if (option) option.textContent = getKhommoProductLabel(productId);
    });
  }
  if (el.khommoProductPriceNote) el.khommoProductPriceNote.textContent = getKhommoProductLabel(safeId);
}

function filterRows(rows, query, picker) {
  const value = query.trim().toLowerCase();
  if (!value) return rows;
  return rows.filter((row) => picker(row).toLowerCase().includes(value));
}

function paginateRows(rows, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { page: safePage, totalPages, start, rows: rows.slice(start, start + pageSize) };
}

function renderPager(target, kind, page, totalPages, totalRows, start, pageRows) {
  if (!target) return;
  const end = pageRows.length ? start + pageRows.length : 0;
  target.innerHTML = `
    <span>${totalRows ? `${start + 1}–${end}` : '0'} / ${totalRows}</span>
    <span class="pager-controls">
      <button type="button" data-page-kind="${kind}" data-page-action="prev" ${page <= 1 ? 'disabled' : ''}>Prev</button>
      <button type="button" data-page-kind="${kind}" data-page-action="next" ${page >= totalPages ? 'disabled' : ''}>Next</button>
    </span>
  `;
}

function emptyRow(colspan, message) {
  return `<tr><td class="empty-cell" colspan="${colspan}">✨ ${escapeHtml(message)}</td></tr>`;
}

function statusChip(status) {
  return `<span class="status-chip ${getStatusClass(status)}">${escapeHtml(status || 'unknown')}</span>`;
}

function tableInput(kind, index, field, value, type = 'text') {
  const disabled = currentRunStatus === 'running' ? ' disabled' : '';
  return `<input class="table-edit-input" type="${type}" data-table-kind="${kind}" data-row-index="${index}" data-field="${field}" value="${escapeAttr(value ?? '')}"${disabled} />`;
}

function tableStatusSelect(index, value, kind = 'accounts') {
  const current = `${value || 'pending'}`;
  const accountStatusOptions = [
    'pending',
    'verified',
    'error',
    'create_pay_unlink_stage1',
    'create_pay_unlink_stage2_ready',
    'create_pay_unlink_stage2_done',
    'create_pay_unlink_stage3_done',
    'create_pay_unlink_stage4_done',
    'create_pay_unlink_no_offer',
    'create_pay_unlink_captcha_required',
    'create_pay_unlink_stage2_login_failed',
    'create_pay_unlink_stage2_gmail_expired',
    'create_pay_unlink_stage2_session_failed',
    'create_pay_unlink_cancel_not_found',
    'create_pay_unlink_cancel_failed',
    'create_pay_unlink_stage4_failed',
    'create_pay_unlink_stage4_account_deleted',
    'create_pay_unlink_stage4_gmail_expired',
  ];
  const options = kind === 'hotmail' ? ['mail_ready', 'verify', 'error', 'pending'] : accountStatusOptions;
  if (current && !options.includes(current)) options.push(current);
  const disabled = currentRunStatus === 'running' ? ' disabled' : '';
  return `<select class="table-edit-input" data-table-kind="${kind}" data-row-index="${index}" data-field="status"${disabled}>
    ${options.map((option) => `<option value="${option}" ${option === current ? 'selected' : ''}>${option}</option>`).join('')}
  </select>`;
}

function deleteRowButton(kind, index) {
  const disabled = currentRunStatus === 'running' ? ' disabled' : '';
  return `<button type="button" class="row-delete-button" data-delete-kind="${kind}" data-row-index="${index}"${disabled}>Xóa dòng</button>`;
}

function updateTableActionButtons(kind) {
  const state = tableState[kind];
  const editBtn = kind === 'accounts' ? el.accountsEditBtn : kind === 'hotmail' ? el.hotmailEditBtn : el.smsEditBtn;
  const saveBtn = kind === 'accounts' ? el.accountsSaveBtn : kind === 'hotmail' ? el.hotmailSaveBtn : el.smsSaveBtn;
  if (!editBtn || !saveBtn) return;
  editBtn.textContent = state.editing ? 'Hủy' : 'Chỉnh sửa';
  saveBtn.classList.toggle('hidden', !state.editing);
  editBtn.disabled = currentRunStatus === 'running';
  saveBtn.disabled = currentRunStatus === 'running';
}


function renderWorkspace(workspace) {
  currentWorkspace = workspace || null;
  if (!workspace) {
    el.workspacePath.textContent = 'Chưa có workspace';
    el.workspaceMeta.textContent = 'Hãy chọn thư mục dữ liệu';
    if (el.workspaceOpenBtn) el.workspaceOpenBtn.disabled = true;
    return;
  }

  el.workspacePath.textContent = workspace.workspaceDir || '';
  el.workspacePath.title = workspace.workspaceDir || '';
  el.workspaceMeta.textContent = `accounts: ${workspace.accountsFile} • hotmail: ${workspace.hotmailAccountsFile || 'accounts-hotmail.txt'} • config: ${workspace.configFile} • sms: ${workspace.smsStateFile}`;
  el.workspaceMeta.title = el.workspaceMeta.textContent;
  if (el.workspaceOpenBtn) el.workspaceOpenBtn.disabled = !workspace.workspaceDir;
}

function updateVpnUiState() {
  const enabled = false;
  if (el.vpnEnabled) {
    el.vpnEnabled.checked = false;
    el.vpnEnabled.disabled = true;
  }
  if (el.vpnStatusBadge) {
    el.vpnStatusBadge.textContent = 'MAINTENANCE';
    el.vpnStatusBadge.classList.toggle('is-on', false);
    el.vpnStatusBadge.classList.toggle('is-off', false);
    el.vpnStatusBadge.classList.toggle('is-maintenance', true);
  }
  if (el.vpnExtensionPath) {
    el.vpnExtensionPath.disabled = true;
    el.vpnExtensionPath.placeholder = 'Urban VPN tạm thời bị vô hiệu hóa';
  }
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

function updateVerifyProviderUi() {
  const provider = normalizeVerifyProvider(el.verifyProvider?.value || '9router');
  const isCliProxyApi = provider === 'cliproxyapi';
  if (el.verifyProvider) el.verifyProvider.value = provider;
  if (el.cliProxyApiField) el.cliProxyApiField.classList.toggle('hidden', !isCliProxyApi);
  el.verifyProviderSwitch?.querySelectorAll('[data-verify-provider]').forEach((button) => {
    const active = normalizeVerifyProvider(button.dataset.verifyProvider) === provider;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  if (el.verifyProviderNote) {
    el.verifyProviderNote.classList.toggle('is-cliproxyapi', isCliProxyApi);
    el.verifyProviderNote.innerHTML = isCliProxyApi
      ? '<strong>CLIProxyAPI mode</strong><span>App tự chạy <code>-codex-login</code>, tự bắt OAuth URL, rồi mở browser verify. Hãy để CLIProxyAPI/config hợp lệ và không đóng process khi đang RUN.</span>'
      : '<strong>9Router mode</strong><span>Giữ nguyên flow cũ: mở 9Router, login, vào Providers → Codex, tool tự bấm Add.</span>';
  }
}

function setSmsBalanceState({ status = 'idle', balance = '', message = '', checkedAt = '' } = {}) {
  if (!el.smsBalanceCard) return;
  el.smsBalanceCard.classList.remove('is-idle', 'is-loading', 'is-success', 'is-error');
  el.smsBalanceCard.classList.add(`is-${status}`);

  if (status === 'loading') {
    el.smsBalanceValue.textContent = 'Đang kiểm tra...';
    el.smsBalanceMeta.textContent = 'Đang gọi SMSPool API balance.';
    if (el.smsBalanceCheckBtn) el.smsBalanceCheckBtn.disabled = true;
    return;
  }

  if (status === 'success') {
    el.smsBalanceValue.textContent = `$${balance}`;
    el.smsBalanceMeta.textContent = checkedAt ? `Cập nhật: ${formatIsoDate(checkedAt)}` : 'Đã cập nhật số dư SMSPool.';
    if (el.smsBalanceCheckBtn) el.smsBalanceCheckBtn.disabled = !authState.authenticated;
    return;
  }

  if (status === 'error') {
    el.smsBalanceValue.textContent = 'Lỗi kiểm tra';
    el.smsBalanceMeta.textContent = message || 'Không kiểm tra được số dư.';
    if (el.smsBalanceCheckBtn) el.smsBalanceCheckBtn.disabled = !authState.authenticated;
    return;
  }

  el.smsBalanceValue.textContent = 'Chưa kiểm tra';
  el.smsBalanceMeta.textContent = message || 'Bấm Check để xem số dư tài khoản.';
  if (el.smsBalanceCheckBtn) el.smsBalanceCheckBtn.disabled = !authState.authenticated;
}

async function refreshSmsPoolBalance({ silent = false, timeoutMs = 12000 } = {}) {
  const smspoolKey = el.smsKey.value.trim();
  const withTimeout = (promise, ms, fallback) => Promise.race([
    promise,
    new Promise((resolve) => window.setTimeout(() => resolve(fallback), ms)),
  ]);
  if (!authState.authenticated) {
    setSmsBalanceState({ status: 'idle', message: 'Đăng nhập trước khi check số dư.' });
    return null;
  }
  if (!smspoolKey) {
    setSmsBalanceState({ status: 'idle', message: 'Nhập và lưu SMSPool API key để tự kiểm tra số dư.' });
    if (!silent) pushLog('[SMSPool] Thiếu API key để kiểm tra số dư');
    return null;
  }

  setSmsBalanceState({ status: 'loading' });
  const result = await withTimeout(
    window.desktopAPI.getSmsPoolBalance({ smspoolKey }),
    timeoutMs,
    { ok: false, message: `SMSPool balance timeout sau ${Math.round(timeoutMs / 1000)}s.` },
  );
  if (!result.ok) {
    setSmsBalanceState({ status: 'error', message: result.message || 'Không kiểm tra được số dư.' });
    if (!silent) pushLog(`[SMSPool] Balance lỗi: ${result.message || 'Unknown error'}`);
    return null;
  }

  setSmsBalanceState({ status: 'success', balance: result.balance, checkedAt: result.checkedAt });
  if (!silent) pushLog(`[SMSPool] Balance: $${result.balance}`);
  return result;
}

function scheduleSmsPoolBalanceRefresh() {
  if (smsBalanceRefreshTimer) {
    window.clearInterval(smsBalanceRefreshTimer);
    smsBalanceRefreshTimer = null;
  }

  smsBalanceRefreshTimer = window.setInterval(() => {
    if (!authState.authenticated || currentRunStatus === 'running') return;
    refreshSmsPoolBalance({ silent: true });
  }, 60000);
}

function setClonemupBalanceState({ status = 'idle', balance = '', message = '', checkedAt = '', runnableCount = null } = {}) {
  if (!el.clonemupBalanceCard) return;
  el.clonemupBalanceCard.classList.remove('is-idle', 'is-loading', 'is-success', 'is-error');
  el.clonemupBalanceCard.classList.add(`is-${status}`);
  if (runnableCount !== null && el.hotmailRunnableCount) el.hotmailRunnableCount.textContent = `${runnableCount}`;

  if (status === 'loading') {
    el.clonemupBalanceValue.textContent = 'Đang kiểm tra...';
    el.clonemupBalanceMeta.innerHTML = `Đang gọi Clonemup API. Hotmail có thể RUN: <b id="hotmail-runnable-count">${el.hotmailRunnableCount?.textContent || '0'}</b>`;
    el.hotmailRunnableCount = document.getElementById('hotmail-runnable-count');
    if (el.clonemupBalanceCheckBtn) el.clonemupBalanceCheckBtn.disabled = true;
    return;
  }

  if (status === 'success') {
    el.clonemupBalanceValue.textContent = balance ? `${balance} VNĐ` : 'OK';
    el.clonemupBalanceMeta.innerHTML = `${checkedAt ? `Cập nhật: ${formatIsoDate(checkedAt)}` : 'Đã cập nhật.'} • Hotmail trắng có thể RUN: <b id="hotmail-runnable-count">${runnableCount ?? el.hotmailRunnableCount?.textContent ?? 0}</b>`;
    el.hotmailRunnableCount = document.getElementById('hotmail-runnable-count');
    if (el.clonemupBalanceCheckBtn) el.clonemupBalanceCheckBtn.disabled = !authState.authenticated;
    return;
  }

  if (status === 'error') {
    el.clonemupBalanceValue.textContent = 'Lỗi kiểm tra';
    el.clonemupBalanceMeta.textContent = message || 'Không kiểm tra được số dư.';
    if (el.clonemupBalanceCheckBtn) el.clonemupBalanceCheckBtn.disabled = !authState.authenticated;
    return;
  }

  el.clonemupBalanceValue.textContent = 'Chưa kiểm tra VNĐ';
  el.clonemupBalanceMeta.innerHTML = `Hotmail trắng có thể RUN: <b id="hotmail-runnable-count">${runnableCount ?? el.hotmailRunnableCount?.textContent ?? 0}</b>`;
  el.hotmailRunnableCount = document.getElementById('hotmail-runnable-count');
  if (el.clonemupBalanceCheckBtn) el.clonemupBalanceCheckBtn.disabled = !authState.authenticated;
}

function setKhommoBalanceState({ status = 'idle', balance = '', message = '', checkedAt = '', runnableCount = null } = {}) {
  if (!el.khommoBalanceCard) return;
  el.khommoBalanceCard.classList.remove('is-idle', 'is-loading', 'is-success', 'is-error');
  el.khommoBalanceCard.classList.add(`is-${status}`);
  if (runnableCount !== null && el.hotmailRunnableCount) el.hotmailRunnableCount.textContent = `${runnableCount}`;

  if (status === 'loading') {
    el.khommoBalanceValue.textContent = 'Đang kiểm tra...';
    el.khommoBalanceMeta.textContent = 'Đang gọi Khommo API.';
    if (el.khommoBalanceCheckBtn) el.khommoBalanceCheckBtn.disabled = true;
    return;
  }

  if (status === 'success') {
    el.khommoBalanceValue.textContent = balance ? `${balance} VNĐ` : 'OK';
    el.khommoBalanceMeta.textContent = checkedAt ? `Cập nhật: ${formatIsoDate(checkedAt)}` : 'Đã cập nhật.';
    if (el.khommoBalanceCheckBtn) el.khommoBalanceCheckBtn.disabled = !authState.authenticated;
    return;
  }

  if (status === 'error') {
    el.khommoBalanceValue.textContent = 'Lỗi kiểm tra';
    el.khommoBalanceMeta.textContent = message || 'Không kiểm tra được Khommo.';
    if (el.khommoBalanceCheckBtn) el.khommoBalanceCheckBtn.disabled = !authState.authenticated;
    return;
  }

  el.khommoBalanceValue.textContent = 'Chưa kiểm tra VNĐ';
  el.khommoBalanceMeta.textContent = message || 'Chọn mail domain “Hotmail của Khommo” để mua/run Hotmail Khommo.';
  if (el.khommoBalanceCheckBtn) el.khommoBalanceCheckBtn.disabled = !authState.authenticated;
}

function setShopGmail9999BalanceState({ status = 'idle', balance = '', stock = null, service = 'chatgpt', message = '', checkedAt = '' } = {}) {
  if (!el.shopgmail9999BalanceCard) return;
  el.shopgmail9999BalanceCard.classList.remove('is-idle', 'is-loading', 'is-success', 'is-error');
  el.shopgmail9999BalanceCard.classList.add(`is-${status}`);
  if (status === 'loading') {
    el.shopgmail9999BalanceValue.textContent = 'Đang kiểm tra...';
    el.shopgmail9999BalanceMeta.textContent = 'Đang gọi ShopGmail9999 API.';
    if (el.shopgmail9999BalanceCheckBtn) el.shopgmail9999BalanceCheckBtn.disabled = true;
    return;
  }
  if (status === 'success') {
    el.shopgmail9999BalanceValue.textContent = `${Number(balance || 0).toLocaleString('vi-VN')}đ`;
    el.shopgmail9999BalanceMeta.textContent = `${checkedAt ? `Cập nhật: ${formatIsoDate(checkedAt)}` : 'Đã cập nhật.'} • Stock ${service}: ${stock ?? 0} • 500đ/Gmail • OTP 10 phút`;
    if (el.shopgmail9999BalanceCheckBtn) el.shopgmail9999BalanceCheckBtn.disabled = !authState.authenticated;
    return;
  }
  if (status === 'error') {
    el.shopgmail9999BalanceValue.textContent = 'Lỗi kiểm tra';
    el.shopgmail9999BalanceMeta.textContent = message || 'Không kiểm tra được ShopGmail9999.';
    if (el.shopgmail9999BalanceCheckBtn) el.shopgmail9999BalanceCheckBtn.disabled = !authState.authenticated;
    return;
  }
  el.shopgmail9999BalanceValue.textContent = 'Chưa kiểm tra';
  el.shopgmail9999BalanceMeta.textContent = message || 'Gmail: 500đ/Gmail • 10 phút • có thể resend để lấy OTP.';
  if (el.shopgmail9999BalanceCheckBtn) el.shopgmail9999BalanceCheckBtn.disabled = !authState.authenticated;
}

async function refreshShopGmail9999Profile({ silent = false } = {}) {
  const apiKey = el.shopgmail9999Key?.value.trim() || '';
  if (!authState.authenticated) {
    setShopGmail9999BalanceState({ status: 'idle', message: 'Đăng nhập trước khi check ShopGmail9999.' });
    return null;
  }
  if (!apiKey) {
    setShopGmail9999BalanceState({ status: 'idle', message: 'Nhập ShopGmail9999 API key để kiểm tra số dư/stock.' });
    if (!silent) pushLog('[ShopGmail9999] Thiếu API key');
    return null;
  }
  setShopGmail9999BalanceState({ status: 'loading' });
  const result = await window.desktopAPI.getShopGmail9999Profile({ apiKey, service: 'chatgpt' });
  if (!result.ok) {
    setShopGmail9999BalanceState({ status: 'error', message: result.message || 'Không kiểm tra được ShopGmail9999.' });
    if (!silent) pushLog(`[ShopGmail9999] Lỗi: ${result.message || 'Unknown error'}`);
    return null;
  }
  setShopGmail9999BalanceState({ status: 'success', balance: result.balance, stock: result.stock, service: result.service, checkedAt: result.checkedAt });
  if (!silent) pushLog(`[ShopGmail9999] Balance=${Number(result.balance || 0).toLocaleString('vi-VN')}đ • Stock ${result.service}: ${result.stock}`);
  return result;
}

async function refreshClonemupProfile({ silent = false } = {}) {
  const apiKey = el.clonemupKey.value.trim();
  if (!authState.authenticated) {
    setClonemupBalanceState({ status: 'idle', message: 'Đăng nhập trước khi check số dư.' });
    return null;
  }
  if (!apiKey) {
    setClonemupBalanceState({ status: 'idle', message: 'Nhập Clonemup API key để kiểm tra số dư.' });
    if (!silent) pushLog('[Clonemup] Thiếu API key');
    return null;
  }
  setClonemupBalanceState({ status: 'loading' });
  const result = await window.desktopAPI.getClonemupProfile({ apiKey });
  if (!result.ok) {
    setClonemupBalanceState({ status: 'error', message: result.message || 'Không kiểm tra được số dư.' });
    if (!silent) pushLog(`[Clonemup] Balance lỗi: ${result.message || 'Unknown error'}`);
    return null;
  }
  setClonemupBalanceState({ status: 'success', balance: result.balance, checkedAt: result.checkedAt, runnableCount: result.hotmailRunnableCount });
  if (!silent) pushLog(`[Clonemup] Balance: ${result.balance || 'OK'} • Hotmail RUN=${result.hotmailRunnableCount ?? 0}`);
  return result;
}

async function refreshKhommoProfile({ silent = false } = {}) {
  const apiKey = el.khommoKey?.value.trim() || '';
  if (!authState.authenticated) {
    setKhommoBalanceState({ status: 'idle', message: 'Đăng nhập trước khi check số dư.' });
    return null;
  }
  if (!apiKey) {
    setKhommoBalanceState({ status: 'idle', message: 'Nhập Khommo API key để kiểm tra số dư.' });
    if (!silent) pushLog('[Khommo] Thiếu API key');
    return null;
  }
  setKhommoBalanceState({ status: 'loading' });
  const result = await window.desktopAPI.getKhommoProfile({ apiKey });
  if (!result.ok) {
    setKhommoBalanceState({ status: 'error', message: result.message || 'Không kiểm tra được số dư.' });
    if (!silent) pushLog(`[Khommo] Balance lỗi: ${result.message || 'Unknown error'}`);
    return null;
  }
  syncKhommoProductUi();
  setKhommoBalanceState({ status: 'success', balance: result.balance, checkedAt: result.checkedAt, runnableCount: result.hotmailRunnableCount });
  if (!silent) {
    pushLog(`[Khommo] Balance: ${result.balance || 'OK'} • Hotmail RUN=${result.hotmailRunnableCount ?? 0} • ${getKhommoProductLabel(el.khommoProductSelect?.value || 7511)}`);
  }
  return result;
}

async function buyHotmailAccounts() {
  const selectedMailDomain = `${el.mailDomain?.value || ''}`.trim().toLowerCase();
  const isKhommo = selectedMailDomain === 'hotmail-khommo';
  const isClonemup = selectedMailDomain === 'hotmail';
  if (!isKhommo && !isClonemup) return pushLog('[Hotmail] Hãy chọn Mail domain là hotmail (clonemup) hoặc Hotmail của Khommo trước khi mua.');
  const apiKey = isKhommo ? (el.khommoKey?.value.trim() || '') : el.clonemupKey.value.trim();
  const amount = Math.max(1, Number.parseInt(el.hotmailBuyAmount.value, 10) || 0);
  const label = isKhommo ? 'Khommo' : 'Clonemup';
  if (!apiKey) return pushLog(`[${label}] Thiếu API key để mua Hotmail`);
  if (!amount) return pushLog(`[${label}] Số lượng mua phải > 0`);
  const productId = isKhommo
    ? ([7511, 6000].includes(Number.parseInt(el.khommoProductSelect?.value || '7511', 10)) ? Number.parseInt(el.khommoProductSelect?.value || '7511', 10) : 7511)
    : Math.max(1, Number.parseInt(el.clonemupProductId?.value || '7614', 10) || 7614);
  el.hotmailBuyBtn.disabled = true;
  pushLog(`[${label}] Đang mua ${amount} Hotmail product=${productId}...`);
  const result = isKhommo
    ? await window.desktopAPI.buyKhommoHotmailAccounts({ apiKey, amount, productId })
    : await window.desktopAPI.buyHotmailAccounts({ apiKey, amount, productId });
  el.hotmailBuyBtn.disabled = currentRunStatus === 'running';
  if (!result.ok) {
    pushLog(`[${label}] Mua lỗi: ${result.message || 'Unknown error'}`);
    if (result.hotmailAccounts) renderHotmailAccounts(result.hotmailAccounts);
    return;
  }
  pushLog(`[${label}] ${result.message || `Đã mua ${result.purchased || 0} Hotmail trắng`}`);
  if (result.failedBatches?.length) pushLog(`[${label}] Dừng sau lỗi batch: ${result.failedBatches[0].message}`);
  if (result.hotmailAccounts) renderHotmailAccounts(result.hotmailAccounts);
  if (isKhommo) setKhommoBalanceState({ status: 'success', balance: result.balance, checkedAt: result.checkedAt, runnableCount: result.hotmailRunnableCount });
  else setClonemupBalanceState({ status: 'success', balance: result.balance, checkedAt: result.checkedAt, runnableCount: result.hotmailRunnableCount });
}

async function importHotmailAccounts() {
  const text = el.hotmailImportTextarea?.value.trim() || '';
  const importStatus = `${el.hotmailImportStatus?.value || 'mail_ready'}`.trim().toLowerCase() || 'mail_ready';
  if (!text) return pushLog('[Hotmail] Thiếu dữ liệu import. Format: email|password|refresh_token|client_id hoặc email|password|TOTP_SECRET');
  if (currentRunStatus === 'running') return pushLog('[Hotmail] Đang RUN, không thể add Hotmail. Hãy Stop hoặc chờ xong.');

  el.hotmailImportBtn.disabled = true;
  pushLog(`[Hotmail] Đang add Hotmail thủ công vào accounts-hotmail.txt với status=${importStatus}...`);
  const result = await window.desktopAPI.importHotmailAccounts({ text, status: importStatus });
  el.hotmailImportBtn.disabled = currentRunStatus === 'running';

  if (!result.ok) {
    pushLog(`[Hotmail] Add lỗi: ${result.message || 'Unknown error'}`);
    if (result.hotmailAccounts) renderHotmailAccounts(result.hotmailAccounts);
    return;
  }

  pushLog(`[Hotmail] ${result.message || `Added=${result.added || 0}, skipped=${result.skipped || 0}, rejected=${result.rejected || 0}`}`);
  if (result.rejectedRows?.length) {
    const preview = result.rejectedRows.slice(0, 3).map((row) => `line ${row.line}: ${row.reason}`).join('; ');
    pushLog(`[Hotmail] Rejected preview: ${preview}`);
  }
  if (result.hotmailAccounts) renderHotmailAccounts(result.hotmailAccounts);
  if (result.added > 0) el.hotmailImportTextarea.value = '';
}

async function openDataFile(kind, label) {
  const result = await window.desktopAPI.openDataFile(kind);
  if (!result?.ok) {
    pushLog(`[${label}] Không mở được data: ${result?.message || 'unknown error'}`);
    return;
  }
  pushLog(`[${label}] Đã mở data: ${result.path || kind}`);
}

function renderRuntimeConfig(config = {}) {
  if (config.smspool_key !== undefined) el.smsKey.value = config.smspool_key || '';
  if (config.password !== undefined) el.password.value = config.password || '';
  if (config.router_password !== undefined) el.routerPassword.value = config.router_password || '';
  if (el.verifyProvider && config.verify_provider !== undefined) el.verifyProvider.value = normalizeVerifyProvider(config.verify_provider);
  if (el.cliProxyApiAuthUrl && config.cliproxyapi_auth_url !== undefined) el.cliProxyApiAuthUrl.value = config.cliproxyapi_auth_url || '';
  if (el.cliProxyApiExecutable) el.cliProxyApiExecutable.value = config.cliproxyapi_executable_path || '';
  if (el.cliProxyApiConfig) el.cliProxyApiConfig.value = config.cliproxyapi_config_path || '';
  updateVerifyProviderUi();
  if (config.selected_mail_domain !== undefined) el.mailDomain.value = config.selected_mail_domain || el.mailDomain.value;
  if (el.randomMailDomain && config.random_mail_domain !== undefined) el.randomMailDomain.checked = config.random_mail_domain === true;
  if (el.headless && config.headless !== undefined) el.headless.checked = config.headless === true;
  if (config.clonemup_api_key !== undefined && el.clonemupKey) el.clonemupKey.value = config.clonemup_api_key || '';
  if (el.clonemupProductId) el.clonemupProductId.value = Math.max(1, Number.parseInt(config.clonemup_hotmail_product_id ?? 7614, 10) || 7614);
  syncClonemupProductUi({ silentLegacyNormalization: true });
  if (config.khommo_api_key !== undefined && el.khommoKey) el.khommoKey.value = config.khommo_api_key || '';
  if (el.khommoProductSelect) {
    const khommoProductId = Number.parseInt(config.khommo_hotmail_product_id ?? 7511, 10);
    el.khommoProductSelect.value = [7511, 6000].includes(khommoProductId) ? `${khommoProductId}` : '7511';
  }
  syncKhommoProductUi();
  if (config.shopgmail9999_api_key !== undefined && el.shopgmail9999Key) el.shopgmail9999Key.value = config.shopgmail9999_api_key || '';
  if (el.proxyRoundRobin && config.proxy_round_robin !== undefined) el.proxyRoundRobin.checked = config.proxy_round_robin === true;
  if (el.proxyApplyRotate && config.proxy_apply_rotate !== undefined) el.proxyApplyRotate.checked = config.proxy_apply_rotate === true;
  if (el.proxySticky && config.proxy_sticky !== undefined) el.proxySticky.value = Math.max(1, Number.parseInt(config.proxy_sticky, 10) || 1);
  if (el.vpnEnabled) el.vpnEnabled.checked = config.vpn_enabled !== false;
  if (el.vpnExtensionPath && config.vpn_extension_path !== undefined) el.vpnExtensionPath.value = config.vpn_extension_path || '';
  if (el.cplCardNumber && config.cpl_test_card_number !== undefined) el.cplCardNumber.value = config.cpl_test_card_number || '';
  if (el.cplCardExpiry && config.cpl_test_card_expiry !== undefined) el.cplCardExpiry.value = config.cpl_test_card_expiry || '';
  if (el.cplCardCvc && config.cpl_test_card_cvc !== undefined) el.cplCardCvc.value = config.cpl_test_card_cvc || '';
  if (el.mailDomain) el.mailDomain.disabled = !authState.authenticated || (el.randomMailDomain?.checked === true);
  window.applyCreatePayUnlinkUi?.();
  updateVpnUiState();
}

function renderUpdateState(nextState) {
  updateState = { ...updateState, ...nextState };

  const currentVersion = updateState.currentVersion || 'unknown';
  const latestVersion = updateState.latestVersion || currentVersion;
  const notes = Array.isArray(updateState.releaseNotes) ? updateState.releaseNotes.filter(Boolean) : [];
  const notePreview = notes.length > 0 ? notes.slice(0, 3).join(' • ') : 'Không có ghi chú phát hành';
  const releaseDateText = updateState.releaseDate ? formatIsoDate(updateState.releaseDate) : '';
  const downloadedAtText = updateState.downloadedAt ? formatIsoDate(updateState.downloadedAt) : '';
  const checkedAtText = updateState.checkedAt ? formatIsoDate(updateState.checkedAt) : '';
  const progressPercent = Math.max(0, Math.min(100, Number(updateState.progressPercent || 0)));
  const transferMeta = updateState.progressTotal > 0
    ? `${formatBytes(updateState.progressTransferred)} / ${formatBytes(updateState.progressTotal)}`
    : formatBytes(updateState.progressTransferred);

  el.updateCard.classList.remove('is-idle', 'is-checking', 'is-latest', 'is-available', 'is-error', 'is-downloading', 'is-downloaded');
  el.updateNotesText.textContent = notePreview;
  el.updateNotesText.classList.toggle('hidden', !notes.length && !updateState.error);
  el.updateProgressTrack.classList.add('hidden');
  if (el.updatePathText) {
    const pathItems = [
      updateState.setupExePath ? `Setup .exe: ${updateState.setupExePath}` : '',
      updateState.runningExePath ? `Đang chạy: ${updateState.runningExePath}` : '',
    ].filter(Boolean);
    el.updatePathText.textContent = pathItems.join(' • ');
    el.updatePathText.title = pathItems.join('\n');
    el.updatePathText.classList.toggle('hidden', pathItems.length === 0);
  }
  el.updateProgressBar.style.width = `${progressPercent}%`;
  el.checkUpdateBtn.disabled = !authState.authenticated;
  el.downloadUpdateBtn.classList.add('hidden');
  el.installUpdateBtn.classList.add('hidden');
  el.openReleasePageBtn.classList.add('hidden');
  el.downloadUpdateBtn.disabled = false;
  el.installUpdateBtn.disabled = false;

  if (updateState.checking) {
    el.updateCard.classList.add('is-checking');
    el.updateVersionText.textContent = `Version ${currentVersion} • Đang kiểm tra...`;
    el.updateMetaText.textContent = 'Đang đọc metadata bản phát hành từ GitHub Releases';
    el.checkUpdateBtn.disabled = true;
    return;
  }

  if (updateState.error) {
    el.updateCard.classList.add('is-error');
    el.updateVersionText.textContent = `Version ${currentVersion} • Check update thất bại`;
    el.updateMetaText.textContent = updateState.error;
    el.updateNotesText.textContent = 'Có thể mở trang Releases public để tải bản mới thủ công nếu cần.';
    el.updateNotesText.classList.remove('hidden');
    el.openReleasePageBtn.classList.remove('hidden');
    return;
  }

  if (updateState.downloaded) {
    el.updateCard.classList.add('is-downloaded');
    el.updateVersionText.textContent = `Version ${currentVersion} • Sẵn sàng cài ${latestVersion}`;
    el.updateMetaText.textContent = downloadedAtText
      ? `Đã tải xong lúc ${downloadedAtText}. Bấm nút để khởi động lại và cài.`
      : 'Bản cập nhật đã tải xong. Bấm nút để khởi động lại và cài.';
    el.installUpdateBtn.classList.remove('hidden');
    el.openReleasePageBtn.classList.remove('hidden');
    return;
  }

  if (updateState.downloading) {
    el.updateCard.classList.add('is-downloading');
    el.updateVersionText.textContent = `Version ${currentVersion} • Đang tải ${latestVersion} (${progressPercent.toFixed(1)}%)`;
    el.updateMetaText.textContent = `${transferMeta} • ${formatBytes(updateState.bytesPerSecond)}/s`;
    el.updateProgressTrack.classList.remove('hidden');
    el.downloadUpdateBtn.classList.remove('hidden');
    el.downloadUpdateBtn.disabled = true;
    el.openReleasePageBtn.classList.remove('hidden');
    return;
  }

  if (updateState.available) {
    el.updateCard.classList.add('is-available');
    el.updateVersionText.textContent = `Version ${currentVersion} • Có bản mới ${latestVersion}`;
    el.updateMetaText.textContent = `${updateState.releaseName || 'GitHub Release mới'}${releaseDateText ? ` • ${releaseDateText}` : ''}`;
    el.downloadUpdateBtn.classList.remove('hidden');
    el.openReleasePageBtn.classList.remove('hidden');
    return;
  }

  el.updateCard.classList.add('is-latest');
  el.updateVersionText.textContent = `Version ${currentVersion} • Đã mới nhất`;
  el.updateMetaText.textContent = checkedAtText
    ? `Lần check gần nhất: ${checkedAtText}`
    : 'Chưa có dữ liệu cập nhật';
  el.updateNotesText.classList.add('hidden');
}

function getPreflightBadgeText(status) {
  if (status === 'ok') return 'Ready';
  if (status === 'warning') return 'Warning';
  if (status === 'fatal') return 'Blocked';
  return 'Checking';
}

function renderPreflight(nextState) {
  preflightState = { ...preflightState, ...nextState };

  const status = preflightState.status || 'checking';
  el.preflightCard.classList.remove('is-ok', 'is-warning', 'is-fatal', 'is-checking');
  el.preflightBadge.classList.remove('is-ok', 'is-warning', 'is-fatal', 'is-checking');
  el.preflightCard.classList.add(`is-${status}`);
  el.preflightBadge.classList.add(`is-${status}`);
  el.preflightBadge.textContent = getPreflightBadgeText(status);
  el.preflightStatusText.textContent =
    status === 'ok'
      ? 'Runtime sẵn sàng để gửi khách chạy'
      : status === 'warning'
        ? 'Có cảnh báo nhưng app vẫn có thể chạy'
        : status === 'fatal'
          ? 'Thiếu thành phần critical, đang block Run'
          : 'Đang kiểm tra runtime...';
  el.preflightSummaryText.textContent = preflightState.summary || 'Chưa có dữ liệu preflight.';

  const checks = Array.isArray(preflightState.checks) ? preflightState.checks : [];
  el.preflightList.innerHTML = checks.length > 0
    ? checks.map((check) => `
        <div class="preflight-item ${check.ok ? 'is-ok' : `is-${check.severity || 'warning'}`}">
          <strong>${escapeHtml(check.label || check.id || 'Check')}</strong>
          <span>${escapeHtml(check.detail || '')}</span>
          ${check.ok ? '' : `<small>${escapeHtml(check.fix || '')}</small>`}
        </div>
      `).join('')
    : `
      <div class="preflight-item is-checking">
        <strong>Đang kiểm tra...</strong>
        <span>Chờ kết quả preflight</span>
      </div>
    `;

  if (!authState.authenticated) return;
  setRunningState(false, status === 'fatal' ? 'Blocked by preflight' : 'Idle', status === 'fatal');
}

function renderAccounts(rows) {
  tableState.accounts.rows = Array.isArray(rows) ? rows : [];
  const state = tableState.accounts;
  const total = state.rows.length;
  const done = state.rows.filter((row) => getStatusClass(row.status) === 'verified').length;
  const errors = state.rows.filter((row) => getStatusClass(row.status) === 'error').length;
  const filtered = filterRows(state.rows, state.query, (row) => `${row.email || ''} ${row.status || ''}`);
  const pageData = paginateRows(filtered, state.page, state.pageSize);
  state.page = pageData.page;

  el.accountsCount.textContent = `${filtered.length} rows`;
  el.accountsStats.textContent = `Total ${total} • Done ${done} • Error ${errors}`;
  updateTableActionButtons('accounts');

  el.accountsBody.innerHTML = pageData.rows.length
    ? pageData.rows.map((row) => {
      const rowIndex = state.rows.indexOf(row);
      return `
      <tr class="${state.editing ? 'is-editing' : ''}">
        <td class="cell-index" title="${escapeAttr(row.index ?? '')}">${escapeHtml(row.index ?? '')}</td>
        <td class="cell-text cell-email" title="${escapeAttr(row.email || '')}">${state.editing ? tableInput('accounts', rowIndex, 'email', row.email) : escapeHtml(row.email || '')}</td>
        <td class="cell-text" title="${escapeAttr(row.password || '')}">${state.editing ? tableInput('accounts', rowIndex, 'password', row.password) : escapeHtml(row.password || '')}</td>
        <td class="cell-status" title="${escapeAttr(row.status || '')}">${state.editing ? tableStatusSelect(rowIndex, row.status, 'accounts') : statusChip(row.status)}</td>
        <td class="cell-action">${state.editing ? deleteRowButton('accounts', rowIndex) : ''}</td>
      </tr>
    `;
    }).join('')
    : emptyRow(5, state.query ? 'Không tìm thấy account phù hợp' : 'Chưa có account trong accounts.txt');

  renderPager(el.accountsPager, 'accounts', pageData.page, pageData.totalPages, filtered.length, pageData.start, pageData.rows);
}

function renderSms(rows) {
  tableState.sms.rows = Array.isArray(rows) ? rows : [];
  const state = tableState.sms;
  const total = state.rows.length;
  const used = state.rows.filter((row) => Number(row.usageCount || 0) > 0).length;
  const unused = total - used;
  const filtered = filterRows(state.rows, state.query, (row) => `${row.orderId || ''} ${row.phoneNumber || ''} ${row.updatedAt || ''}`);
  const pageData = paginateRows(filtered, state.page, state.pageSize);
  state.page = pageData.page;

  el.smsCount.textContent = `${filtered.length} rows`;
  el.smsStats.textContent = `Total ${total} • Used ${used} • Unused ${unused}`;
  updateTableActionButtons('sms');

  el.smsBody.innerHTML = pageData.rows.length
    ? pageData.rows.map((row) => {
      const rowIndex = state.rows.indexOf(row);
      return `
      <tr class="${state.editing ? 'is-editing' : ''}">
        <td class="cell-index" title="${escapeAttr(row.index ?? '')}">${escapeHtml(row.index ?? '')}</td>
        <td class="cell-text" title="${escapeAttr(row.orderId || '')}">${state.editing ? tableInput('sms', rowIndex, 'orderId', row.orderId) : escapeHtml(row.orderId || '')}</td>
        <td class="cell-text" title="${escapeAttr(row.phoneNumber || '')}">${state.editing ? tableInput('sms', rowIndex, 'phoneNumber', row.phoneNumber) : escapeHtml(row.phoneNumber || '')}</td>
        <td class="cell-number" title="${escapeAttr(row.usageCount ?? '')}">${state.editing ? tableInput('sms', rowIndex, 'usageCount', row.usageCount, 'number') : escapeHtml(row.usageCount ?? '')}</td>
        <td class="cell-date" title="${escapeAttr(row.updatedAt || '')}">${state.editing ? tableInput('sms', rowIndex, 'updatedAt', row.updatedAt) : escapeHtml(row.updatedAt || '')}</td>
        <td class="cell-action">${state.editing ? deleteRowButton('sms', rowIndex) : ''}</td>
      </tr>
    `;
    }).join('')
    : emptyRow(6, state.query ? 'Không tìm thấy order/phone phù hợp' : 'Chưa có dữ liệu sms_state.json');

  renderPager(el.smsPager, 'sms', pageData.page, pageData.totalPages, filtered.length, pageData.start, pageData.rows);
}

function maskToken(value) {
  const text = `${value || ''}`;
  if (!text) return '';
  return text.length <= 14 ? '••••••' : `${text.slice(0, 8)}…${text.slice(-6)}`;
}

function getHotmailAccountType(row = {}) {
  return `${row.accountType || ''}`.trim().toLowerCase() || (row.totpSecret ? 'totp' : 'oauth2');
}

function formatHotmailCopyLine(row = {}) {
  const email = `${row.email || ''}`.trim();
  const password = `${row.password || ''}`.trim();
  const accountType = getHotmailAccountType(row);
  if (accountType === 'totp') {
    return [email, password, `${row.totpSecret || ''}`.trim()].join('|');
  }
  return [email, password, `${row.refreshToken || ''}`.trim(), `${row.clientId || ''}`.trim()].join('|');
}

function hotmailCopyButton(rowIndex, row = {}) {
  const accountType = getHotmailAccountType(row);
  const title = accountType === 'totp'
    ? 'Copy dạng mail|pass|2FA'
    : 'Copy dạng mail|pass|refresh_token|client_id';
  return `<button type="button" class="row-copy-button" data-copy-hotmail-row="${rowIndex}" title="${escapeAttr(title)}">Copy</button>`;
}

async function copyHotmailRow(rowIndex) {
  const row = tableState.hotmail.rows[Number(rowIndex)];
  if (!row) return;
  const text = formatHotmailCopyLine(row);
  try {
    await navigator.clipboard.writeText(text);
    pushLog(`[Hotmail] Đã copy ${getHotmailAccountType(row) === 'totp' ? 'mail|pass|2FA' : 'mail|pass|refresh_token|client_id'}: ${row.email || ''}`);
  } catch (error) {
    pushLog(`[Hotmail] Copy thất bại: ${error.message}`);
  }
}

function renderHotmailAccounts(rows) {
  tableState.hotmail.rows = Array.isArray(rows) ? rows : [];
  const state = tableState.hotmail;
  const total = state.rows.length;
  const mailReady = state.rows.filter((row) => `${row.status || ''}`.toLowerCase() === 'mail_ready').length;
  const runnable = state.rows.filter((row) => `${row.status || ''}`.toLowerCase() === 'pending').length;
  const verified = state.rows.filter((row) => `${row.status || ''}`.toLowerCase() === 'verify').length;
  const errors = state.rows.filter((row) => `${row.status || ''}`.toLowerCase() === 'error').length;
  const filtered = filterRows(state.rows, state.query, (row) => `${row.email || ''} ${row.status || ''} ${row.accountType || ''} ${row.refreshToken || ''} ${row.clientId || ''} ${row.totpSecret || ''}`);
  const pageData = paginateRows(filtered, state.page, state.pageSize);
  state.page = pageData.page;

  if (el.hotmailRunnableCount) el.hotmailRunnableCount.textContent = `${runnable}`;
  el.hotmailCount.textContent = `${filtered.length} rows`;
  el.hotmailStats.textContent = `Mail trắng ${mailReady} • ChatGPT pending ${runnable} • ChatGPT verify ${verified} • Error ${errors} • Total ${total}`;
  updateTableActionButtons('hotmail');

  el.hotmailBody.innerHTML = pageData.rows.length
    ? pageData.rows.map((row) => {
      const rowIndex = state.rows.indexOf(row);
      const accountType = getHotmailAccountType(row);
      const tokenOrSecretValue = accountType === 'totp' ? row.totpSecret : row.refreshToken;
      const typeOrClientIdValue = accountType === 'totp' ? 'totp' : row.clientId;
      return `
      <tr class="${state.editing ? 'is-editing' : ''}">
        <td class="cell-index" title="${escapeAttr(row.index ?? '')}">${escapeHtml(row.index ?? '')}</td>
        <td class="cell-text cell-email" title="${escapeAttr(row.email || '')}">${state.editing ? tableInput('hotmail', rowIndex, 'email', row.email) : escapeHtml(row.email || '')}</td>
        <td class="cell-text" title="${escapeAttr(row.password || '')}">${state.editing ? tableInput('hotmail', rowIndex, 'password', row.password) : escapeHtml(row.password || '')}</td>
        <td class="cell-text" title="${escapeAttr(tokenOrSecretValue || '')}">${state.editing ? tableInput('hotmail', rowIndex, accountType === 'totp' ? 'totpSecret' : 'refreshToken', tokenOrSecretValue) : escapeHtml(maskToken(tokenOrSecretValue))}</td>
        <td class="cell-text" title="${escapeAttr(typeOrClientIdValue || '')}">${state.editing ? tableInput('hotmail', rowIndex, accountType === 'totp' ? 'accountType' : 'clientId', typeOrClientIdValue) : escapeHtml(accountType === 'totp' ? 'TOTP' : maskToken(typeOrClientIdValue))}</td>
        <td class="cell-status" title="${escapeAttr(row.status || '')}">${state.editing ? tableStatusSelect(rowIndex, row.status, 'hotmail') : statusChip(row.status)}</td>
        <td class="cell-action">${state.editing ? deleteRowButton('hotmail', rowIndex) : hotmailCopyButton(rowIndex, row)}</td>
      </tr>
    `;
    }).join('')
    : emptyRow(7, state.query ? 'Không tìm thấy Hotmail phù hợp' : 'Chưa có dữ liệu accounts-hotmail.txt');

  renderPager(el.hotmailPager, 'hotmail', pageData.page, pageData.totalPages, filtered.length, pageData.start, pageData.rows);
}

function renderHistory(items) {
  tableState.history.rows = Array.isArray(items) ? items : [];
  const state = tableState.history;
  const ok = state.rows.reduce((sum, item) => sum + Number(item.successful || 0), 0);
  const fail = state.rows.reduce((sum, item) => sum + Number(item.failed || 0), 0);
  const running = state.rows.filter((item) => getStatusClass(item.status) === 'running').length;
  const filtered = filterRows(state.rows, state.query, (item) => `${item.mode || ''} ${item.status || ''} ${item.startedAt || ''}`);
  const pageData = paginateRows(filtered, state.page, state.pageSize);
  state.page = pageData.page;

  el.historyCount.textContent = `${filtered.length} items`;
  el.historyStats.textContent = `OK ${ok} • Fail ${fail} • Running ${running}`;

  el.historyBody.innerHTML = pageData.rows.length
    ? pageData.rows.map((item) => `
      <tr>
        <td class="cell-date" title="${escapeAttr(item.startedAt || '')}">${escapeHtml(item.startedAt || '')}</td>
        <td class="cell-text" title="${escapeAttr(item.mode || '')}">${escapeHtml(item.mode || '')}</td>
        <td class="cell-number" title="${escapeAttr(item.count ?? '')}">${escapeHtml(item.count ?? '')}</td>
        <td class="cell-number" title="${escapeAttr(item.successful ?? '')}">${escapeHtml(item.successful ?? '')}</td>
        <td class="cell-number" title="${escapeAttr(item.failed ?? '')}">${escapeHtml(item.failed ?? '')}</td>
        <td class="cell-number" title="${escapeAttr(`${item.durationSec ?? ''}s`)}">${escapeHtml(item.durationSec ?? '')}s</td>
        <td class="cell-status" title="${escapeAttr(item.status || '')}">${statusChip(item.status || '')}</td>
      </tr>
    `).join('')
    : emptyRow(7, state.query ? 'Không tìm thấy lịch sử phù hợp' : 'Chưa có lịch sử chạy');

  renderPager(el.historyPager, 'history', pageData.page, pageData.totalPages, filtered.length, pageData.start, pageData.rows);
}

function renderProxyPools(rows) {
  tableState.proxyPools.rows = Array.isArray(rows) ? rows : [];
  const total = tableState.proxyPools.rows.length;
  const active = tableState.proxyPools.rows.filter((item) => item.active).length;
  el.proxyCount.textContent = `Total: ${total} • Active: ${active}`;
  if (el.proxyBulkToggleBtn) {
    const shouldEnableAll = total > 0 && active < total;
    el.proxyBulkToggleBtn.textContent = shouldEnableAll ? '✅ Bật tất cả' : '⛔ Tắt tất cả';
    el.proxyBulkToggleBtn.disabled = currentRunStatus === 'running' || total === 0;
    el.proxyBulkToggleBtn.dataset.proxyBulkAction = shouldEnableAll ? 'enable' : 'disable';
  }
  el.proxyList.innerHTML = total
    ? `
      <div class="proxy-table-head">
        <span>Name</span>
        <span>Proxy URL</span>
        <span>Status</span>
        <span>Mode</span>
        <span>No Proxy</span>
        <span>Actions</span>
      </div>
      ${tableState.proxyPools.rows.map((item, index) => {
        const isSelected = activeProxySelection?.proxyId && activeProxySelection.proxyId === item.id;
        const isKunProxyApi = item.type === 'kunproxy_api';
        const proxyDisplay = isKunProxyApi
          ? `KunProxy API: ${item.kunProxyOrderCode || item.kunProxyLoaiProxy || 'listproxy'}`
          : item.proxyUrl || '';
        const typeDisplay = isSelected
          ? `Round Robin #${Number(activeProxySelection.proxyIndex ?? index) + 1}`
          : isKunProxyApi ? 'kunproxy_api • auto resolve' : item.type || 'custom';
        return `
        <div class="proxy-item ${item.active ? 'is-active' : ''} ${isSelected ? 'is-current' : ''}" data-proxy-id="${escapeAttr(item.id || '')}">
          <div class="proxy-main proxy-name" title="${escapeAttr(item.name || 'Proxy Pool')}">
            <strong>${escapeHtml(item.name || 'Proxy Pool')}</strong>
            <small>${escapeHtml(typeDisplay)}</small>
          </div>
          <span class="proxy-url" title="${escapeAttr(isKunProxyApi ? `${proxyDisplay} • key ${maskToken(item.kunProxyApiKey || '')}` : proxyDisplay)}">${escapeHtml(proxyDisplay)}</span>
          <span class="proxy-status ${item.active ? 'is-on' : 'is-off'}">${isSelected ? 'Using now' : item.active ? 'Active' : 'Off'}</span>
          <span class="proxy-mode">${item.strict ? 'Strict' : 'Fallback'}</span>
          <span class="proxy-no-proxy" title="${escapeAttr(item.noProxy || '')}">${escapeHtml(item.noProxy || '')}</span>
          <div class="proxy-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-proxy-test="${index}">Test</button>
            <button type="button" class="btn btn-ghost btn-sm" data-proxy-toggle="${index}">${item.active ? 'Disable' : 'Enable'}</button>
            <button type="button" class="btn btn-danger btn-sm" data-proxy-delete="${index}">Delete</button>
          </div>
        </div>
      `;
      }).join('')}
    `
    : '<div class="proxy-empty"><strong>No proxy pool entries yet</strong><span>Create a proxy pool entry, then it will be used by Create/Verify.</span></div>';

  if (activeProxySelection?.proxyId) {
    requestAnimationFrame(() => {
      const current = el.proxyList?.querySelector(`[data-proxy-id="${CSS.escape(activeProxySelection.proxyId)}"]`);
      current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    });
  }
}

function markCurrentProxySelection(selection) {
  activeProxySelection = selection?.proxyId ? selection : null;
  renderProxyPools(tableState.proxyPools.rows);
}

function updateKunProxyFieldsUi() {
  const enabled = el.proxyKunProxyApiInput?.checked === true;
  el.proxyKunProxyFields?.classList.toggle('hidden', !enabled);
  if (el.proxyUrlInput) {
    el.proxyUrlInput.disabled = enabled;
    el.proxyUrlInput.placeholder = enabled
      ? 'KunProxy API sẽ tự lấy proxy khi Test/RUN'
      : '58.187.157.67:42242:fxKUgS:WQgBdD hoặc http://user:pass@host:port';
  }
}

function resetProxyAddForm() {
  if (el.proxyNameInput) el.proxyNameInput.value = '';
  if (el.proxyUrlInput) el.proxyUrlInput.value = '';
  if (el.proxyKunProxyApiInput) el.proxyKunProxyApiInput.checked = false;
  if (el.proxyKunProxyKeyInput) el.proxyKunProxyKeyInput.value = '';
  if (el.proxyKunProxyOrderInput) el.proxyKunProxyOrderInput.value = '';
  if (el.proxyNoProxyInput) el.proxyNoProxyInput.value = 'localhost,127.0.0.1,internal';
  if (el.proxyActiveInput) el.proxyActiveInput.checked = true;
  if (el.proxyStrictInput) el.proxyStrictInput.checked = false;
  updateKunProxyFieldsUi();
}

function openProxyModal(kind) {
  el.proxyModalBackdrop.classList.remove('hidden');
  [el.proxyAddModal, el.proxyImportModal, el.vercelRelayModal].forEach((modal) => modal.classList.add('hidden'));
  if (kind === 'add') {
    resetProxyAddForm();
    el.proxyAddModal.classList.remove('hidden');
  }
  if (kind === 'import') el.proxyImportModal.classList.remove('hidden');
  if (kind === 'vercel') el.vercelRelayModal.classList.remove('hidden');
}

function closeProxyModal() {
  el.proxyModalBackdrop.classList.add('hidden');
  [el.proxyAddModal, el.proxyImportModal, el.vercelRelayModal].forEach((modal) => modal.classList.add('hidden'));
}

async function saveProxyRows(rows) {
  const result = await window.desktopAPI.saveProxyPools(rows);
  if (!result.ok) {
    pushLog(`[Proxy] Lưu thất bại: ${result.message}`);
    return false;
  }
  const nextRows = result.proxyPools || [];
  renderProxyPools(nextRows);
  pushLog(`[Proxy] ${result.message || 'Đã lưu Proxy Pools.'} Hiện có ${nextRows.length} proxy trong danh sách.`);
  if (rows.length > 0 && nextRows.length === 0) {
    pushLog('[Proxy] Cảnh báo: backend đã lưu nhưng trả về 0 proxy. Có thể entry bị lọc do thiếu Proxy URL/API type.');
  }
  return true;
}

async function refreshData() {
  const data = await window.desktopAPI.refreshData();
  if (data.ok) {
    renderWorkspace(data.workspace);
    renderAccounts(data.accounts || []);
    renderHotmailAccounts(data.hotmailAccounts || []);
    renderSms(data.smsState || []);
    renderProxyPools(data.proxyPools || []);

    const config = data.config || {};
    renderRuntimeConfig(config);
    await refreshSmsPoolBalance({ silent: true });
  }
}

async function refreshHistory() {
  const data = await window.desktopAPI.listHistory(100);
  if (data.ok) renderHistory(data.items || []);
}

function toggleTableEdit(kind) {
  const state = tableState[kind];
  if (!state || currentRunStatus === 'running') return;
  state.editing = !state.editing;
  if (kind === 'accounts') renderAccounts(state.rows);
  if (kind === 'sms') renderSms(state.rows);
  if (kind === 'hotmail') renderHotmailAccounts(state.rows);
}

async function saveEditableTable(kind) {
  const state = tableState[kind];
  if (!state) return;
  const result = kind === 'accounts'
    ? await window.desktopAPI.saveAccounts(state.rows)
    : kind === 'hotmail'
      ? await window.desktopAPI.saveHotmailAccounts(state.rows)
      : await window.desktopAPI.saveSmsState(state.rows);

  if (!result.ok) {
    pushLog(`[UI] Lưu ${kind} thất bại: ${result.message || 'Unknown error'}`);
    return;
  }

  state.editing = false;
  if (result.accounts) renderAccounts(result.accounts);
  if (result.hotmailAccounts) renderHotmailAccounts(result.hotmailAccounts);
  if (result.smsState) renderSms(result.smsState);
  pushLog(`[UI] Đã lưu ${kind === 'accounts' ? 'accounts.txt' : kind === 'hotmail' ? 'accounts-hotmail.txt' : 'SMS state'}`);
}


async function refreshPreflight(logResult = false) {
  const result = await window.desktopAPI.getPreflightState();
  if (!result.ok || !result.preflight) {
    renderPreflight({
      status: 'fatal',
      canRun: false,
      summary: result.message || 'Không lấy được preflight state.',
      checks: [],
    });
    if (logResult) pushLog(`[Preflight] Error: ${result.message || 'Unknown error'}`);
    return null;
  }

  renderPreflight(result.preflight);
  if (logResult) {
    pushLog(`[Preflight] ${getPreflightBadgeText(result.preflight.status)}: ${result.preflight.summary}`);
  }
  return result.preflight;
}

function getConfigPayload() {
  const selectedMailDomain = el.mode?.value === 'create_pay_unlink' ? 'gmail-shopgmail9999' : el.mailDomain.value.trim();
  const randomMailDomainChecked = el.mode?.value === 'create_pay_unlink' ? false : el.randomMailDomain?.checked === true;
  return {
    smspoolKey: el.smsKey.value.trim(),
    clonemupApiKey: el.clonemupKey?.value.trim() || '',
    clonemupHotmailProductId: Math.max(1, Number.parseInt(el.clonemupProductId?.value || '7614', 10) || 7614),
    khommoApiKey: el.khommoKey?.value.trim() || '',
    khommoHotmailProductId: [7511, 6000].includes(Number.parseInt(el.khommoProductSelect?.value || '7511', 10)) ? Number.parseInt(el.khommoProductSelect?.value || '7511', 10) : 7511,
    shopgmail9999ApiKey: el.shopgmail9999Key?.value.trim() || '',
    password: el.password.value.trim(),
    routerPassword: el.routerPassword.value.trim(),
    verifyProvider: normalizeVerifyProvider(el.verifyProvider?.value || '9router'),
    cliProxyApiAuthUrl: el.cliProxyApiAuthUrl?.value.trim() || '',
    cliProxyApiExecutablePath: el.cliProxyApiExecutable?.value.trim() || '',
    cliProxyApiConfigPath: el.cliProxyApiConfig?.value.trim() || '',
    selectedMailDomain,
    randomMailDomain: ['hotmail', 'hotmail-khommo', 'gmail-shopgmail9999'].includes(selectedMailDomain) ? false : randomMailDomainChecked,
    headless: el.headless?.checked === true,
    createPayUnlinkStage: el.createPayUnlinkStage?.value || 'stage1',
    createPayUnlinkDryRun: el.mode?.value === 'create_pay_unlink' ? false : el.createPayUnlinkSubmit?.checked !== true,
    createPayUnlinkAllowSubmit: el.mode?.value === 'create_pay_unlink' ? true : el.createPayUnlinkSubmit?.checked === true,
    cplTestCardNumber: el.cplCardNumber?.value.trim() || '',
    cplTestCardExpiry: el.cplCardExpiry?.value.trim() || '',
    cplTestCardCvc: el.cplCardCvc?.value.trim() || '',
    proxyRoundRobin: el.proxyRoundRobin?.checked === true,
    proxyApplyRotate: el.proxyApplyRotate?.checked === true,
    proxySticky: Math.max(1, Number.parseInt(el.proxySticky?.value || '1', 10) || 1),
    // Urban VPN tạm bảo trì: luôn tắt khi RUN để tránh chặn đóng gói/publish.
    vpnEnabled: false,
    vpnExtensionPath: '',
  };
}

function validateBeforeRun() {
  const mode = el.mode.value;
  const count = Number.parseInt(el.count.value, 10);
  const { smspoolKey, password, routerPassword, selectedMailDomain, randomMailDomain, shopgmail9999ApiKey, cplTestCardNumber, cplTestCardExpiry, cplTestCardCvc, verifyProvider } = getConfigPayload();

  if (!authState.authenticated) {
    pushLog('[UI] Bạn chưa đăng nhập');
    return null;
  }

  if (preflightState.status === 'fatal') {
    pushLog(`[Preflight] Blocked: ${preflightState.summary}`);
    return null;
  }

  if (Number.isNaN(count) || count <= 0) {
    pushLog('[UI] Count phải > 0');
    return null;
  }

  if ((mode === 'verify' || mode === 'create_verify' || (mode === 'create_pay_unlink' && el.createPayUnlinkStage?.value === 'stage4')) && !smspoolKey) {
    pushLog('[UI] Mode có Verify/Mode 4 Stage 4 cần SMSPool key');
    return null;
  }

  if ((mode === 'verify' || mode === 'create_verify' || (mode === 'create_pay_unlink' && el.createPayUnlinkStage?.value === 'stage4')) && verifyProvider === 'cliproxyapi') {
    pushLog('[CLIProxyAPI] RUN sẽ tự chạy -codex-login và tự lấy OAuth URL mới cho từng account. Không dùng lại Auth URL cũ.');
  }

  if (verifyProvider === 'cliproxyapi' && el.proxyApplyRotate?.checked === true) {
    pushLog('[UI] CLIProxyAPI không dùng 9Router Apply Proxy → One-to-one. Tool sẽ bỏ qua Apply Proxy cho verify provider này.');
  }

  if (mode === 'create_pay_unlink' && el.createPayUnlinkStage?.value === 'stage1' && !shopgmail9999ApiKey) {
    pushLog('[UI] Mode 4 Stage 1 cần ShopGmail9999 API key cho Gmail session');
    return null;
  }

  if (selectedMailDomain === 'gmail-shopgmail9999' && el.createPayUnlinkStage?.value === 'stage1' && !shopgmail9999ApiKey) {
    pushLog('[UI] Domain Gmail - ShopGmail9999 cần ShopGmail9999 API key');
    return null;
  }

  if (mode === 'create_pay_unlink' && el.createPayUnlinkStage?.value === 'stage2' && (!cplTestCardNumber || !cplTestCardExpiry || !cplTestCardCvc)) {
    pushLog('[UI] Mode 4 Stage 2 cần nhập Stage 2 card number, expiry, CVC rồi bấm Lưu config.');
    return null;
  }

  if ((mode === 'verify' || mode === 'create_verify') && ['hotmail', 'hotmail-khommo'].includes(selectedMailDomain)) {
    const pendingCount = tableState.hotmail.rows.filter((row) => `${row.status || ''}`.trim().toLowerCase() === 'pending').length;
    const mailReadyCount = tableState.hotmail.rows.filter((row) => `${row.status || ''}`.trim().toLowerCase() === 'mail_ready').length;
    const runnable = mode === 'verify' ? pendingCount : pendingCount + mailReadyCount;
    if (mode === 'verify' && runnable < count) {
      pushLog(`[Hotmail] Không đủ Hotmail đã tạo ChatGPT (pending) trong accounts-hotmail.txt để RUN. Cần ${count}, hiện có ${runnable} (pending=${pendingCount}). accounts.txt pending sẽ bị bỏ qua khi domain=hotmail.`);
      return null;
    }
    if (mode === 'create_verify' && runnable < count) {
      const sourceLabel = selectedMailDomain === 'hotmail-khommo' ? 'Khommo' : 'Clonemup';
      pushLog(`[Hotmail] Hiện có ${runnable}/${count} Hotmail có thể xử lý (pending=${pendingCount}, mail_ready=${mailReadyCount}). Thiếu ${count - runnable}; hãy mua thêm Hotmail từ ${sourceLabel} nếu core không tự thuê được.`);
    }
  }

  if (mode === 'create_pay_unlink') {
    if (el.mailDomain) el.mailDomain.value = 'gmail-shopgmail9999';
    if (el.randomMailDomain) el.randomMailDomain.checked = false;
    if (el.createPayUnlinkSubmit) el.createPayUnlinkSubmit.checked = true;
    if (el.createPayUnlinkStage?.value === 'stage3') {
      pushLog('[UI] Mode 4 Stage 3: sẽ click nút hủy gói cuối cùng `Hủy gói đăng ký` trên tài khoản test.');
    }
    if (el.createPayUnlinkStage?.value === 'stage4') {
      pushLog('[UI] Mode 4 Stage 4: đóng session ChatGPT rồi chạy Add Codex/Verify qua 9Router.');
    }
  }

  return { ...getConfigPayload(), mode, count };
}

async function handleRun() {
  const latestPreflight = await refreshPreflight(false);
  if (latestPreflight?.status === 'fatal') {
    pushLog(`[Preflight] Blocked: ${latestPreflight.summary}`);
    return;
  }

  const payload = validateBeforeRun();
  if (!payload) return;

  if (payload.proxyApplyRotate) {
    pushLog('[Proxy] One-to-one đang bật. Lưu ý: 9Router cần có từ 2 proxy trở lên để Apply Proxy → One-to-one (rotate) hoạt động ổn định. Tool sẽ tiếp tục chạy.');
  }

  setRunningState(true, `Running: ${payload.mode}`);
  pushLog(`[UI] Start run mode=${payload.mode}, count=${payload.count}, verifyProvider=${payload.verifyProvider === 'cliproxyapi' ? 'CLIProxyAPI' : '9Router'}`);
  if (payload.verifyProvider === 'cliproxyapi') {
    pushLog('[CLIProxyAPI] App sẽ chạy từng account riêng: trước mỗi account bắt OAuth URL mới, account xong thì đóng process callback cũ.');
  }

  const result = await window.desktopAPI.startRun(payload);
  if (!result.ok) {
    if (result.preflight) renderPreflight(result.preflight);
    setRunningState(false, 'Error', true);
    pushLog(`[UI] Start failed: ${result.message}`);
  }
}

async function handleAddProxy(event) {
  event.preventDefault();
  const useKunProxyApi = el.proxyKunProxyApiInput?.checked === true;
  const proxyUrl = el.proxyUrlInput.value.trim();
  const kunProxyApiKey = el.proxyKunProxyKeyInput?.value.trim() || '';
  const kunProxyOrderOrType = el.proxyKunProxyOrderInput?.value.trim() || '';

  if (!useKunProxyApi && !proxyUrl) return pushLog('[Proxy] Thiếu Proxy URL');
  if (useKunProxyApi && !kunProxyApiKey) return pushLog('[Proxy] Thiếu KunProxy/ProxyXoay API key');
  if (useKunProxyApi && !kunProxyOrderOrType) return pushLog('[Proxy] Thiếu mã đơn hàng hoặc loại proxy KunProxy/ProxyXoay');

  const baseName = el.proxyNameInput.value.trim() || (useKunProxyApi ? 'Proxy API' : 'Proxy Pool');
  const baseRow = {
    name: baseName,
    proxyUrl: useKunProxyApi ? '' : proxyUrl,
    noProxy: el.proxyNoProxyInput.value.trim() || 'localhost,127.0.0.1,internal',
    active: el.proxyActiveInput.checked,
    strict: el.proxyStrictInput.checked,
    type: useKunProxyApi ? 'kunproxy_api' : 'custom',
  };

  const rowsToAdd = [];
  if (useKunProxyApi) {
    const keys = kunProxyApiKey.split(/[\s,;]+/).map((key) => key.trim()).filter(Boolean);
    const parts = kunProxyOrderOrType.split(/\s+/).filter(Boolean);
    const orderCode = parts.find((part) => /^(KWL|OTO)\w+/i.test(part) || /^\d+$/.test(part));
    const loaiProxy = parts.find((part) => /^Key_/i.test(part)) || (!orderCode ? kunProxyOrderOrType : '');

    keys.forEach((key, index) => {
      const row = {
        ...baseRow,
        name: keys.length > 1 ? `${baseName} ${index + 1}` : baseName,
        kunProxyApiKey: key,
      };
      if (orderCode) row.kunProxyOrderCode = orderCode;
      if (loaiProxy) row.kunProxyLoaiProxy = loaiProxy;
      rowsToAdd.push(row);
    });
  } else {
    rowsToAdd.push(baseRow);
  }

  const ok = await saveProxyRows([...tableState.proxyPools.rows, ...rowsToAdd]);
  if (ok) {
    pushLog(`[Proxy] Đã add ${rowsToAdd.length} proxy pool${rowsToAdd.length > 1 ? 's' : ''}. Nếu chưa thấy danh sách, kéo xuống panel Proxy Pools ngay bên dưới ô log proxy.`);
    closeProxyModal();
  }
}

async function handleImportProxy(event) {
  event.preventDefault();
  const result = await window.desktopAPI.batchImportProxies(el.proxyImportTextarea.value);
  if (!result.ok) return pushLog(`[Proxy] Import lỗi: ${result.message}`);
  renderProxyPools(result.proxyPools || []);
  pushLog(`[Proxy] ${result.message}`);
  closeProxyModal();
}

async function handleDeployVercelRelay(event) {
  event.preventDefault();
  const token = el.vercelTokenInput.value.trim();
  if (!token) return pushLog('[Proxy] Thiếu Vercel API Token');
  pushLog('[Proxy] Đang deploy Vercel Relay...');
  const result = await window.desktopAPI.deployVercelRelay({
    token,
    projectName: el.vercelProjectInput.value.trim() || 'vercel-relay',
    sharedSecret: el.vercelSecretInput.value.trim(),
  });
  el.vercelTokenInput.value = '';
  if (!result.ok) return pushLog(`[Proxy] Deploy Vercel Relay lỗi: ${result.message}`);
  renderProxyPools(result.proxyPools || []);
  pushLog(`[Proxy] Deploy thành công: ${result.result?.proxyUrl || result.relay?.proxyUrl}`);
  closeProxyModal();
}

async function handleBulkToggleProxies() {
  if (currentRunStatus === 'running') return;
  const rows = tableState.proxyPools.rows;
  if (!rows.length) {
    pushLog('[Proxy] Chưa có proxy để bật/tắt toàn bộ');
    return;
  }

  const enableAll = rows.some((item) => !item.active);
  const nextRows = rows.map((item) => ({ ...item, active: enableAll }));
  const ok = await saveProxyRows(nextRows);
  if (ok) pushLog(`[Proxy] Đã ${enableAll ? 'bật' : 'tắt'} toàn bộ ${rows.length} proxy`);
}

async function handleProxyListClick(event) {
  const testIndex = event.target.closest('[data-proxy-test]')?.dataset.proxyTest;
  const toggleIndex = event.target.closest('[data-proxy-toggle]')?.dataset.proxyToggle;
  const deleteIndex = event.target.closest('[data-proxy-delete]')?.dataset.proxyDelete;
  if (testIndex !== undefined) {
    const row = tableState.proxyPools.rows[Number(testIndex)];
    if (!row) return;
    pushLog(`[Proxy] Đang test: ${row.name || row.proxyUrl}`);
    const result = await window.desktopAPI.testProxy(row);
    if (!result.ok) {
      pushLog(`[Proxy] Test thất bại: ${result.message}`);
      return;
    }
    let detail = result.result?.body || '';
    try {
      const parsed = JSON.parse(detail);
      detail = [parsed.query, parsed.country, parsed.city, parsed.isp || parsed.org].filter(Boolean).join(' • ');
    } catch {
      detail = detail.slice(0, 140);
    }
    pushLog(`[Proxy] Test OK: ${result.message}${detail ? ` | ${detail}` : ''}`);
  }
  if (toggleIndex !== undefined) {
    const rows = tableState.proxyPools.rows.map((item, index) => index === Number(toggleIndex) ? { ...item, active: !item.active } : item);
    await saveProxyRows(rows);
  }
  if (deleteIndex !== undefined) {
    const rows = tableState.proxyPools.rows.filter((_item, index) => index !== Number(deleteIndex));
    await saveProxyRows(rows);
  }
}

async function handleStop() {
  const result = await window.desktopAPI.stopRun();
  pushLog(`[UI] ${result.message || 'Đã gửi lệnh stop'}`);
}

async function handleForceStop() {
  const confirmed = window.confirm('Force Stop sẽ dừng ngay và đóng browser đang chạy. Account hiện tại có thể còn pending. Tiếp tục?');
  if (!confirmed) return;
  el.forceStopBtn.disabled = true;
  const result = await window.desktopAPI.forceStopRun();
  pushLog(`[UI] ${result.message || 'Đã gửi lệnh Force Stop'}`);
  if (!result.ok) el.forceStopBtn.disabled = false;
}

async function handleSaveConfig() {
  const payload = getConfigPayload();
  const withTimeout = (promise, ms, fallback) => Promise.race([
    promise,
    new Promise((resolve) => window.setTimeout(() => resolve(fallback), ms)),
  ]);

  el.saveConfigBtn.disabled = true;
  el.saveConfigBtn.classList.remove('is-success', 'is-error');
  el.saveConfigBtn.textContent = '⏳ Đang lưu...';
  setSaveConfigStatus('Đang lưu config workspace...', 'pending');

  try {
    const result = await withTimeout(
      window.desktopAPI.saveConfig(payload),
      8000,
      { ok: false, message: 'Lưu config timeout sau 8s. Hãy restart app nếu main process cũ đang treo.' },
    );

    if (!result.ok) {
      setSaveConfigStatus(`Lưu config thất bại: ${result.message || 'Unknown error'}`, 'error');
      pushLog(`[UI] Lưu config thất bại: ${result.message || 'Unknown error'}`);
      return;
    }

    if (result.config) {
      el.smsKey.value = `${result.config.smspool_key || ''}`;
      el.password.value = `${result.config.password || ''}`;
      el.routerPassword.value = `${result.config.router_password || '123456'}`;
      el.mailDomain.value = `${result.config.selected_mail_domain || 'thangterter.online'}`;
      if (el.randomMailDomain) el.randomMailDomain.checked = result.config.random_mail_domain === true;
      if (el.headless && result.config.headless !== undefined) el.headless.checked = result.config.headless === true;
      if (el.proxyRoundRobin) el.proxyRoundRobin.checked = result.config.proxy_round_robin === true;
      if (el.proxyApplyRotate) el.proxyApplyRotate.checked = result.config.proxy_apply_rotate === true;
      if (el.proxySticky) el.proxySticky.value = Math.max(1, Number.parseInt(result.config.proxy_sticky, 10) || 1);
      if (el.vpnEnabled) el.vpnEnabled.checked = result.config.vpn_enabled !== false;
      if (el.vpnExtensionPath) el.vpnExtensionPath.value = `${result.config.vpn_extension_path || ''}`;
      if (el.mailDomain) el.mailDomain.disabled = el.randomMailDomain?.checked === true;
      if (el.verifyProvider && result.config.verify_provider !== undefined) el.verifyProvider.value = normalizeVerifyProvider(result.config.verify_provider);
      if (el.cliProxyApiAuthUrl && result.config.cliproxyapi_auth_url !== undefined) el.cliProxyApiAuthUrl.value = `${result.config.cliproxyapi_auth_url || ''}`;
      if (el.cliProxyApiExecutable && result.config.cliproxyapi_executable_path !== undefined) el.cliProxyApiExecutable.value = `${result.config.cliproxyapi_executable_path || ''}`;
      if (el.cliProxyApiConfig && result.config.cliproxyapi_config_path !== undefined) el.cliProxyApiConfig.value = `${result.config.cliproxyapi_config_path || ''}`;
      updateVerifyProviderUi();
      if (el.clonemupKey && result.config.clonemup_api_key !== undefined) el.clonemupKey.value = `${result.config.clonemup_api_key || ''}`;
      if (el.clonemupProductId && result.config.clonemup_hotmail_product_id !== undefined) el.clonemupProductId.value = Math.max(1, Number.parseInt(result.config.clonemup_hotmail_product_id, 10) || 7614);
      syncClonemupProductUi({ silentLegacyNormalization: true });
      if (el.khommoKey && result.config.khommo_api_key !== undefined) el.khommoKey.value = `${result.config.khommo_api_key || ''}`;
      if (el.khommoProductSelect && result.config.khommo_hotmail_product_id !== undefined) {
        const khommoProductId = Number.parseInt(result.config.khommo_hotmail_product_id, 10);
        el.khommoProductSelect.value = [7511, 6000].includes(khommoProductId) ? `${khommoProductId}` : '7511';
      }
      syncKhommoProductUi();
      if (el.shopgmail9999Key && result.config.shopgmail9999_api_key !== undefined) el.shopgmail9999Key.value = `${result.config.shopgmail9999_api_key || ''}`;
      if (el.cplCardNumber && result.config.cpl_test_card_number !== undefined) el.cplCardNumber.value = `${result.config.cpl_test_card_number || ''}`;
      if (el.cplCardExpiry && result.config.cpl_test_card_expiry !== undefined) el.cplCardExpiry.value = `${result.config.cpl_test_card_expiry || ''}`;
      if (el.cplCardCvc && result.config.cpl_test_card_cvc !== undefined) el.cplCardCvc.value = `${result.config.cpl_test_card_cvc || ''}`;
      updateVpnUiState();
    }

    setSaveConfigStatus('✓ Đã lưu thành công vào config workspace', 'success');
    pushLog('[UI] Đã lưu config workspace');
    refreshSmsPoolBalance({ silent: true, timeoutMs: 5000 }).catch((error) => {
      pushLog(`[SMSPool] Check balance sau lưu lỗi: ${error.message || 'Unknown error'}`);
    });
  } catch (error) {
    setSaveConfigStatus(`Lưu config thất bại: ${error.message || 'Unknown error'}`, 'error');
    pushLog(`[UI] Lưu config thất bại: ${error.message || 'Unknown error'}`);
  } finally {
    el.saveConfigBtn.disabled = false;
  }
}

function handleAutoSaveConfigOnExit() {
  if (!authState.authenticated || !window.desktopAPI?.saveConfig) return;

  window.desktopAPI.saveConfig(getConfigPayload())
    .then((result) => {
      if (result?.ok) {
        pushLog('[UI] Đã tự lưu config trước khi thoát');
        return;
      }
      pushLog(`[UI] Tự lưu config khi thoát thất bại: ${result?.message || 'Unknown error'}`);
    })
    .catch((error) => {
      pushLog(`[UI] Tự lưu config khi thoát thất bại: ${error.message || 'Unknown error'}`);
    });
}

async function handleChooseWorkspace() {
  const result = await window.desktopAPI.chooseWorkspace();
  if (result.canceled) {
    pushLog('[UI] Đã hủy chọn thư mục dữ liệu');
    return;
  }

  if (result.ok) {
    renderWorkspace(result.workspace);
    renderAccounts(result.accounts || []);
    renderHotmailAccounts(result.hotmailAccounts || []);
    renderSms(result.smsState || []);
    renderProxyPools(result.proxyPools || []);
    renderRuntimeConfig(result.config || {});
    setSaveConfigStatus('', '');
    await refreshPreflight(true);
    await refreshSmsPoolBalance({ silent: true, timeoutMs: 5000 });
    pushLog(`[UI] Workspace mới: ${result.workspace.workspaceDir}`);
  }
}

async function checkForUpdates(logResult = true) {
  renderUpdateState({ checking: true, error: '' });
  const result = await window.desktopAPI.checkForUpdates();

  if (result.update) renderUpdateState(result.update);

  if (!logResult) return;
  if (result.ok && result.update?.available) {
    pushLog(`[UPDATE] Có bản mới ${result.update.latestVersion}`);
    return;
  }

  if (result.ok) {
    pushLog('[UPDATE] Đã kiểm tra. App đang là bản mới nhất.');
    return;
  }

  pushLog(`[UPDATE] Check thất bại: ${result.message || 'Unknown error'}`);
}

async function handleDownloadUpdate() {
  const result = await window.desktopAPI.downloadUpdate();
  if (!result.ok) {
    pushLog(`[UPDATE] ${result.message || 'Không tải được cập nhật'}`);
    return;
  }

  if (result.alreadyDownloaded) {
    pushLog('[UPDATE] Bản cập nhật đã tải xong trước đó.');
    return;
  }

  if (result.alreadyDownloading) {
    pushLog('[UPDATE] Đang tải bản cập nhật...');
    return;
  }

  pushLog('[UPDATE] Đã bắt đầu tải bản cập nhật.');
}

async function handleInstallUpdate() {
  const result = await window.desktopAPI.quitAndInstallUpdate();
  if (!result.ok) {
    pushLog(`[UPDATE] ${result.message || 'Chưa thể cài cập nhật'}`);
    return;
  }

  pushLog('[UPDATE] App sẽ khởi động lại để cài bản mới.');
}

async function handleOpenReleasePage() {
  const result = await window.desktopAPI.openUpdateReleasePage();
  if (!result.ok) {
    pushLog('[UPDATE] Không mở được trang GitHub Releases');
    return;
  }

  pushLog(`[UPDATE] Đã mở trang release: ${result.url}`);
}

async function handleOpenWorkspaceData() {
  const result = await window.desktopAPI.openWorkspaceFolder();
  if (!result?.ok) {
    pushLog(`[Workspace] Không mở được data: ${result?.message || 'unknown error'}`);
    return;
  }
  pushLog(`[Workspace] Đã mở data: ${result.path || result.workspaceDir || 'workspace'}`);
}

function bindEvents() {
  el.runBtn.addEventListener('click', handleRun);
  el.stopBtn.addEventListener('click', handleStop);
  el.forceStopBtn.addEventListener('click', handleForceStop);
  el.saveConfigBtn.addEventListener('click', handleSaveConfig);
  el.chooseWorkspaceBtn.addEventListener('click', handleChooseWorkspace);
  el.workspaceOpenBtn?.addEventListener('click', handleOpenWorkspaceData);
  el.checkUpdateBtn.addEventListener('click', () => checkForUpdates(true));
  el.downloadUpdateBtn.addEventListener('click', handleDownloadUpdate);
  el.installUpdateBtn.addEventListener('click', handleInstallUpdate);
  el.openReleasePageBtn.addEventListener('click', handleOpenReleasePage);
  window.addEventListener('beforeunload', handleAutoSaveConfigOnExit);
  const applyCreatePayUnlinkUi = () => {
    const enabled = el.mode?.value === 'create_pay_unlink';
    const stage = el.createPayUnlinkStage?.value || 'stage1';
    const cardFieldsEnabled = enabled;

    if (el.runtimeConfigCard) el.runtimeConfigCard.classList.toggle('is-mode4-warning', enabled);
    if (el.mode4WarningNote) el.mode4WarningNote.classList.toggle('hidden', !enabled);
    if (el.createPayUnlinkStageField) el.createPayUnlinkStageField.classList.add('hidden');
    if (el.createPayUnlinkSubmitField) el.createPayUnlinkSubmitField.classList.add('hidden');
    [el.cplCardNumberField, el.cplCardExpiryField, el.cplCardCvcField].forEach((field) => field?.classList.toggle('hidden', !cardFieldsEnabled));

    if (enabled) {
      if (el.mailDomain) el.mailDomain.value = 'gmail-shopgmail9999';
      if (el.randomMailDomain) el.randomMailDomain.checked = false;
      if (el.createPayUnlinkSubmit) el.createPayUnlinkSubmit.checked = true;
      pushLog(stage === 'stage4'
        ? '[UI] Mode 4 Stage 4: teardown session rồi Verify 9Router bằng flow hiện tại.'
        : stage === 'stage3'
          ? '[UI] Mode 4 Stage 3: hủy subscription bằng session đã lưu.'
          : '[UI] Mode 4: ép Gmail @gmail.com qua ShopGmail9999. Stage 2 luôn auto submit sau guard 0 ₫.');
    }
    if (el.createPayUnlinkStage) el.createPayUnlinkStage.disabled = true;
    if (el.createPayUnlinkSubmit) el.createPayUnlinkSubmit.disabled = false;
    if (el.cplCardNumber) el.cplCardNumber.disabled = !cardFieldsEnabled;
    if (el.cplCardExpiry) el.cplCardExpiry.disabled = !cardFieldsEnabled;
    if (el.cplCardCvc) el.cplCardCvc.disabled = !cardFieldsEnabled;
    if (el.mailDomain) el.mailDomain.disabled = enabled || (el.randomMailDomain?.checked === true);
  };
  window.applyCreatePayUnlinkUi = applyCreatePayUnlinkUi;

  el.mode?.addEventListener('change', applyCreatePayUnlinkUi);
  el.verifyProviderSwitch?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-verify-provider]');
    if (!button || currentRunStatus === 'running') return;
    if (el.verifyProvider) el.verifyProvider.value = normalizeVerifyProvider(button.dataset.verifyProvider);
    updateVerifyProviderUi();
    pushLog(`[UI] Verify provider: ${normalizeVerifyProvider(el.verifyProvider.value) === 'cliproxyapi' ? 'CLIProxyAPI' : '9Router'}`);
  });
  el.verifyProvider?.addEventListener('change', () => {
    updateVerifyProviderUi();
    pushLog(`[UI] Verify provider: ${normalizeVerifyProvider(el.verifyProvider.value) === 'cliproxyapi' ? 'CLIProxyAPI' : '9Router'}`);
  });
  updateVerifyProviderUi();
  el.createPayUnlinkStage?.addEventListener('change', () => {
    if (el.mode?.value !== 'create_pay_unlink') {
      el.mode.value = 'create_pay_unlink';
      pushLog('[UI] Đã tự chuyển Mode chạy sang Mode 4 vì bạn đổi Mode 4 stage.');
    }
    applyCreatePayUnlinkUi();
  });
  el.mailDomain?.addEventListener('change', () => {
    if (el.mailDomain) el.mailDomain.disabled = el.mode?.value === 'create_pay_unlink' || (el.randomMailDomain?.checked === true);
  });

  el.randomMailDomain?.addEventListener('change', () => {
    if (el.mode?.value === 'create_pay_unlink') {
      el.randomMailDomain.checked = false;
      pushLog('[UI] Mode 4 bắt buộc Gmail cố định, không dùng random domain.');
    }
    el.mailDomain.disabled = el.mode?.value === 'create_pay_unlink' || el.randomMailDomain.checked;
    pushLog(`[UI] Mail domain mode: ${el.randomMailDomain.checked ? 'random' : 'fixed'}`);
  });
  el.smsKey?.addEventListener('change', () => refreshSmsPoolBalance({ silent: true }));
  el.smsKey?.addEventListener('blur', () => refreshSmsPoolBalance({ silent: true }));
  el.smsBalanceCheckBtn?.addEventListener('click', () => refreshSmsPoolBalance({ silent: false }));
  el.smsPoolOpenBtn?.addEventListener('click', async () => {
    const result = await window.desktopAPI.openExternalUrl('https://www.smspool.net/');
    if (!result?.ok) pushLog(`[SMSPool] Không mở được website: ${result?.message || 'unknown error'}`);
  });
  el.clonemupKey?.addEventListener('change', () => refreshClonemupProfile({ silent: true }));
  el.clonemupKey?.addEventListener('blur', () => refreshClonemupProfile({ silent: true }));
  el.clonemupBalanceCheckBtn?.addEventListener('click', () => refreshClonemupProfile({ silent: false }));
  el.clonemupProductSelect?.addEventListener('change', () => {
    const selected = el.clonemupProductSelect.value;
    if (selected === '16133') return syncClonemupProductUi();
    if (el.clonemupProductId) el.clonemupProductId.value = selected || '7614';
    syncClonemupProductUi();
  });
  el.clonemupProductId?.addEventListener('change', syncClonemupProductUi);
  el.clonemupOpenBtn?.addEventListener('click', async () => {
    const result = await window.desktopAPI.openExternalUrl('http://clonemup.com/');
    if (!result?.ok) pushLog(`[Clonemup] Không mở được website: ${result?.message || 'unknown error'}`);
  });
  el.khommoKey?.addEventListener('change', () => refreshKhommoProfile({ silent: true }));
  el.khommoKey?.addEventListener('blur', () => refreshKhommoProfile({ silent: true }));
  el.khommoBalanceCheckBtn?.addEventListener('click', () => refreshKhommoProfile({ silent: false }));
  el.khommoProductSelect?.addEventListener('change', () => syncKhommoProductUi());
  el.khommoOpenBtn?.addEventListener('click', async () => {
    const result = await window.desktopAPI.openExternalUrl('https://khommo.vn/document-api');
    if (!result?.ok) pushLog(`[Khommo] Không mở được website: ${result?.message || 'unknown error'}`);
  });
  el.shopgmail9999Key?.addEventListener('change', () => refreshShopGmail9999Profile({ silent: true }));
  el.shopgmail9999Key?.addEventListener('blur', () => refreshShopGmail9999Profile({ silent: true }));
  el.shopgmail9999BalanceCheckBtn?.addEventListener('click', () => refreshShopGmail9999Profile({ silent: false }));
  el.shopgmail9999OpenBtn?.addEventListener('click', async () => {
    const result = await window.desktopAPI.openExternalUrl('https://api.shopgmail9999.com/');
    if (!result?.ok) pushLog(`[ShopGmail9999] Không mở được website: ${result?.message || 'unknown error'}`);
  });
  el.hotmailBuyBtn?.addEventListener('click', buyHotmailAccounts);
  el.hotmailImportBtn?.addEventListener('click', importHotmailAccounts);
  el.accountsOpenBtn?.addEventListener('click', () => openDataFile('accounts', 'Accounts'));
  el.smsOpenBtn?.addEventListener('click', () => openDataFile('sms', 'SMS State'));
  el.hotmailOpenBtn?.addEventListener('click', () => openDataFile('hotmail', 'Hotmail'));
  el.proxyOpenBtn?.addEventListener('click', () => openDataFile('proxy', 'Proxy Pools'));
  el.proxyBulkToggleBtn?.addEventListener('click', handleBulkToggleProxies);

  el.vpnEnabled?.addEventListener('change', () => {
    // Urban VPN đang bảo trì: khóa toggle ở OFF.
    el.vpnEnabled.checked = false;
    updateVpnUiState();
    pushLog('[UI] Urban VPN đang bảo trì, tạm thời bị vô hiệu hóa.');
  });

  el.pauseLogBtn.addEventListener('click', () => {
    logUiState.autoScroll = !logUiState.autoScroll;
    el.pauseLogBtn.textContent = logUiState.autoScroll ? 'Pause' : 'Resume';
    renderLog();
  });
  el.copyLogBtn.addEventListener('click', async () => {
    const text = el.logOutput.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      pushLog('[UI] Đã copy log đang hiển thị');
    } catch (error) {
      pushLog(`[UI] Copy log thất bại: ${error.message}`);
    }
  });
  el.clearLogBtn.addEventListener('click', () => {
    logLines = [];
    renderLog();
  });
  el.logFilterGroup.addEventListener('click', (event) => {
    const button = event.target.closest('[data-log-filter]');
    if (!button) return;
    logUiState.filter = button.dataset.logFilter || 'all';
    el.logFilterGroup.querySelectorAll('[data-log-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
    renderLog();
  });

  el.accountsSearch.addEventListener('input', () => {
    tableState.accounts.query = el.accountsSearch.value;
    tableState.accounts.page = 1;
    renderAccounts(tableState.accounts.rows);
  });
  el.smsSearch.addEventListener('input', () => {
    tableState.sms.query = el.smsSearch.value;
    tableState.sms.page = 1;
    renderSms(tableState.sms.rows);
  });
  el.historySearch.addEventListener('input', () => {
    tableState.history.query = el.historySearch.value;
    tableState.history.page = 1;
    renderHistory(tableState.history.rows);
  });
  el.hotmailSearch?.addEventListener('input', () => {
    tableState.hotmail.query = el.hotmailSearch.value;
    tableState.hotmail.page = 1;
    renderHotmailAccounts(tableState.hotmail.rows);
  });
  el.accountsEditBtn.addEventListener('click', () => toggleTableEdit('accounts'));
  el.accountsSaveBtn.addEventListener('click', () => saveEditableTable('accounts'));
  el.smsEditBtn.addEventListener('click', () => toggleTableEdit('sms'));
  el.smsSaveBtn.addEventListener('click', () => saveEditableTable('sms'));
  el.hotmailEditBtn?.addEventListener('click', () => toggleTableEdit('hotmail'));
  el.hotmailSaveBtn?.addEventListener('click', () => saveEditableTable('hotmail'));
  document.addEventListener('input', (event) => {
    const input = event.target.closest('[data-table-kind][data-row-index][data-field]');
    if (!input) return;
    const state = tableState[input.dataset.tableKind];
    const row = state?.rows[Number(input.dataset.rowIndex)];
    if (!row) return;
    const nextValue = input.dataset.field === 'usageCount' ? Number(input.value || 0) : input.value;
    row[input.dataset.field] = nextValue;
    if (input.dataset.tableKind === 'hotmail') {
      const normalizedType = `${row.accountType || ''}`.trim().toLowerCase() || (row.totpSecret ? 'totp' : 'oauth2');
      if (input.dataset.field === 'totpSecret') {
        row.accountType = 'totp';
        row.totpSecret = `${nextValue || ''}`.trim();
        row.refreshToken = '';
        row.clientId = '';
        row.recoveryEmail = '';
      } else if (input.dataset.field === 'refreshToken' || input.dataset.field === 'clientId') {
        if (normalizedType !== 'totp') row.accountType = 'oauth2';
      } else if (input.dataset.field === 'accountType') {
        row.accountType = `${nextValue || ''}`.trim().toLowerCase() === 'totp' ? 'totp' : normalizedType;
      }
    }
  });
  document.addEventListener('change', (event) => {
    const input = event.target.closest('select[data-table-kind][data-row-index][data-field]');
    if (!input) return;
    const state = tableState[input.dataset.tableKind];
    const row = state?.rows[Number(input.dataset.rowIndex)];
    if (row) row[input.dataset.field] = input.value;
  });

  document.addEventListener('click', (event) => {
    const copyButton = event.target.closest('[data-copy-hotmail-row]');
    if (copyButton) {
      copyHotmailRow(copyButton.dataset.copyHotmailRow);
      return;
    }

    const deleteButton = event.target.closest('[data-delete-kind][data-row-index]');
    if (!deleteButton) return;
    const kind = deleteButton.dataset.deleteKind;
    const state = tableState[kind];
    const index = Number(deleteButton.dataset.rowIndex);
    if (currentRunStatus === 'running') {
      pushLog('[UI] Đang RUN, không cho xóa bảng tạm. Hãy Stop/Force Stop hoặc chờ xong.');
      return;
    }
    if (!state?.rows[index]) return;
    const confirmed = window.confirm(`Xóa dòng ${kind} này khỏi bảng tạm? Bấm Lưu để ghi thay đổi vào file.`);
    if (!confirmed) return;
    state.rows.splice(index, 1);
    if (kind === 'accounts') renderAccounts(state.rows);
    if (kind === 'sms') renderSms(state.rows);
    if (kind === 'hotmail') renderHotmailAccounts(state.rows);
    pushLog(`[UI] Đã xóa 1 dòng ${kind} khỏi bảng tạm. Bấm Lưu để ghi vào file.`);
  });
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page-kind][data-page-action]');
    if (!button) return;
    const kind = button.dataset.pageKind;
    const action = button.dataset.pageAction;
    const state = tableState[kind];
    if (!state) return;
    state.page += action === 'next' ? 1 : -1;
    if (kind === 'accounts') renderAccounts(state.rows);
    if (kind === 'sms') renderSms(state.rows);
    if (kind === 'hotmail') renderHotmailAccounts(state.rows);
    if (kind === 'history') renderHistory(state.rows);
  });

  el.proxyAddBtn?.addEventListener('click', () => openProxyModal('add'));
  el.proxyImportBtn?.addEventListener('click', () => openProxyModal('import'));
  el.vercelRelayBtn?.addEventListener('click', () => openProxyModal('vercel'));
  el.proxyKunProxyApiInput?.addEventListener('change', updateKunProxyFieldsUi);
  updateKunProxyFieldsUi();
  el.proxyAddModal?.addEventListener('submit', handleAddProxy);
  el.proxyImportModal?.addEventListener('submit', handleImportProxy);
  el.vercelRelayModal?.addEventListener('submit', handleDeployVercelRelay);
  el.proxyList?.addEventListener('click', handleProxyListClick);
  el.proxyLogClearBtn?.addEventListener('click', () => {
    proxyLogLines = [];
    renderProxyLog();
  });
  renderProxyLog();
  document.querySelectorAll('[data-close-proxy-modal]').forEach((btn) => btn.addEventListener('click', closeProxyModal));

  el.refreshBtn.addEventListener('click', async () => {
    if (!authState.authenticated) return;
    await refreshData();
    await refreshHistory();
    pushLog('[UI] Đã refresh bảng dữ liệu');
  });

  if (el.vercelTokenLink) {
    el.vercelTokenLink.addEventListener('click', async (event) => {
      event.preventDefault();
      const href = el.vercelTokenLink.href || 'https://vercel.com/account/tokens';
      const result = await window.desktopAPI.openExternalUrl(href);
      if (!result?.ok) pushLog(`[Proxy] Không mở được Vercel token page: ${result?.message || 'unknown error'}`);
    });
  }

  window.desktopAPI.onLogLine((payload) => {
    if (typeof payload === 'string') {
      pushLog(payload);
      return;
    }
    pushLog(payload?.line || `${payload?.timestamp || ''} ${payload?.message || ''}`.trim());
  });

  window.desktopAPI.onRunEvent((payload) => {
    if (payload?.type === 'proxy-selected') {
      markCurrentProxySelection(payload);
      const totalText = payload.targetCount ? `/${payload.targetCount}` : '';
      pushLog(`[Proxy] Đang dùng proxy ${Number(payload.proxyIndex ?? 0) + 1}/${payload.proxyTotal} cho account ${payload.accountNum}${totalText}: ${payload.proxyName || payload.proxyUrl}`);
    }
    if (payload?.type === 'summary') {
      markCurrentProxySelection(null);
      pushLog(`[SUMMARY] mode=${payload.mode} | ok=${payload.successful} | fail=${payload.failed}`);
    }
  });

  window.desktopAPI.onRunFailure((payload) => {
    pushLog(formatFailureLog(payload));
  });

  window.desktopAPI.onRunStatus(async (payload) => {
    if (payload.status === 'running') {
      setRunningState(true, `Running: ${payload.mode}`);
      if (payload.workspaceDir) pushLog(`[UI] Workspace: ${payload.workspaceDir}`);
      return;
    }

    if (payload.status === 'done') {
      setRunningState(false, 'Done');
      markCurrentProxySelection(null);
      pushLog(`[UI] Done in ${payload.durationSec}s`);
      if (payload.latestFailure) pushLog(formatFailureLog(payload.latestFailure));
      await refreshData();
      await refreshHistory();
      return;
    }

    if (payload.status === 'force-stopped') {
      setRunningState(false, 'Force Stopped', true);
      markCurrentProxySelection(null);
      pushLog(`[UI] Force Stopped in ${payload.durationSec}s`);
      await refreshData();
      await refreshHistory();
      return;
    }

    if (payload.status === 'error') {
      setRunningState(false, 'Error', true);
      markCurrentProxySelection(null);
      pushLog(`[UI] Error: ${payload.error}`);
      if (payload.latestFailure) pushLog(formatFailureLog(payload.latestFailure));
      await refreshHistory();
    }
  });

  window.desktopAPI.onHistoryUpdated((items) => {
    renderHistory(items || []);
  });

  window.desktopAPI.onWorkspaceChanged(async (workspace) => {
    renderWorkspace(workspace);
    try {
      await refreshData();
      await refreshHistory();
    } catch (error) {
      pushLog(`[Workspace] Refresh sau khi đổi workspace thất bại: ${error.message || 'Unknown error'}`);
    }
  });
  window.desktopAPI.onUpdateChanged((nextState) => {
    renderUpdateState(nextState);

    if (nextState?.available && !nextState?.downloading && !nextState?.downloaded) {
      pushLog(`[UPDATE] Có bản mới ${nextState.latestVersion}. Sẵn sàng tải.`);
    }
    if (nextState?.downloading) {
      pushLog(`[UPDATE] Đang tải ${nextState.latestVersion}: ${(Number(nextState.progressPercent || 0)).toFixed(1)}%`);
    }
    if (nextState?.downloaded) {
      pushLog(`[UPDATE] Đã tải xong bản ${nextState.latestVersion}. Chờ cài đặt.`);
    }
    if (nextState?.error) {
      pushLog(`[UPDATE] Lỗi updater: ${nextState.error}`);
    }
  });

  window.desktopAPI.onPreflightChanged((payload) => {
    renderPreflight(payload || {});
  });
}

async function initAuthenticatedState() {
  await refreshData();
  await refreshHistory();

  const workspace = await window.desktopAPI.getWorkspace();
  if (workspace.ok) renderWorkspace(workspace.workspace);

  const runState = await window.desktopAPI.getRunState();
  if (runState.ok) {
    if (runState.workspace) renderWorkspace(runState.workspace);
    if (runState.isRunning) {
      setRunningState(true, `Running: ${runState.runMeta?.mode || 'unknown'}`);
      return;
    }
  }

  const preflight = await refreshPreflight(true);
  setRunningState(false, preflight?.status === 'fatal' ? 'Blocked by preflight' : 'Idle', preflight?.status === 'fatal');
}

async function init() {
  initRuntimeInputs();
  bindEvents();
  renderAuthState();
  renderUpdateState({
    checking: false,
    available: false,
    downloading: false,
    downloaded: false,
    currentVersion: '1.1.4',
    latestVersion: '1.1.4',
    releaseName: '',
    releaseDate: '',
    releaseNotes: [],
    progressPercent: 0,
    progressTransferred: 0,
    progressTotal: 0,
    bytesPerSecond: 0,
    checkedAt: '',
    downloadedAt: '',
    releaseUrl: '',
    error: '',
  });

  const update = await window.desktopAPI.getUpdateState();
  if (update.ok && update.update) renderUpdateState(update.update);

  if (el.randomMailDomain) el.mailDomain.disabled = el.randomMailDomain.checked;
  updateVpnUiState();

  if (authState.authenticated) {
    await initAuthenticatedState();
    return;
  }

  setRunningState(false, 'Locked');
  pushLog('[UI] Chưa đăng nhập');
}

init().catch((error) => {
  pushLog(`[UI] Init failed: ${error.message}`);
  setRunningState(false, 'Init Error', true);
});
