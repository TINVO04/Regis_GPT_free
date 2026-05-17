const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  startRun: (payload) => ipcRenderer.invoke('run:start', payload),
  stopRun: () => ipcRenderer.invoke('run:stop'),
  forceStopRun: () => ipcRenderer.invoke('run:force-stop'),
  refreshData: () => ipcRenderer.invoke('data:refresh'),
  saveAccounts: (rows) => ipcRenderer.invoke('data:save-accounts', rows),
  saveSmsState: (rows) => ipcRenderer.invoke('data:save-sms-state', rows),
  saveConfig: (payload) => ipcRenderer.invoke('config:save', payload),
  getSmsPoolBalance: (payload) => ipcRenderer.invoke('smspool:get-balance', payload),
  getShopGmail9999Profile: (payload) => ipcRenderer.invoke('shopgmail9999:get-profile', payload),
  getClonemupProfile: (payload) => ipcRenderer.invoke('clonemup:get-profile', payload),
  buyHotmailAccounts: (payload) => ipcRenderer.invoke('clonemup:buy-hotmail', payload),
  saveHotmailAccounts: (rows) => ipcRenderer.invoke('data:save-hotmail-accounts', rows),
  importHotmailAccounts: (text) => ipcRenderer.invoke('data:import-hotmail-accounts', text),
  listHistory: (limit = 100) => ipcRenderer.invoke('history:list', limit),
  getRunState: () => ipcRenderer.invoke('run:state'),
  getWorkspace: () => ipcRenderer.invoke('workspace:get'),
  getPreflightState: () => ipcRenderer.invoke('preflight:get'),
  chooseWorkspace: () => ipcRenderer.invoke('workspace:choose'),
  getUpdateState: () => ipcRenderer.invoke('update:get-state'),
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  downloadUpdate: () => ipcRenderer.invoke('update:download'),
  quitAndInstallUpdate: () => ipcRenderer.invoke('update:quit-and-install'),
  openUpdateReleasePage: () => ipcRenderer.invoke('update:open-release-page'),
  listProxyPools: () => ipcRenderer.invoke('proxy:list'),
  saveProxyPools: (rows) => ipcRenderer.invoke('proxy:save', rows),
  batchImportProxies: (text) => ipcRenderer.invoke('proxy:batch-import', text),
  deployVercelRelay: (payload) => ipcRenderer.invoke('proxy:deploy-vercel-relay', payload),
  testProxy: (pool) => ipcRenderer.invoke('proxy:test', pool),
  openExternalUrl: (url) => ipcRenderer.invoke('shell:open-external', url),
  openDataFile: (kind) => ipcRenderer.invoke('shell:open-data-file', kind),
  openWorkspaceFolder: () => ipcRenderer.invoke('workspace:open-folder'),

  onLogLine: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('log:line', handler);
    return () => ipcRenderer.removeListener('log:line', handler);
  },

  onRunStatus: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('run:status', handler);
    return () => ipcRenderer.removeListener('run:status', handler);
  },

  onRunEvent: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('run:event', handler);
    return () => ipcRenderer.removeListener('run:event', handler);
  },

  onRunFailure: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('run:failure', handler);
    return () => ipcRenderer.removeListener('run:failure', handler);
  },

  onHistoryUpdated: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('history:updated', handler);
    return () => ipcRenderer.removeListener('history:updated', handler);
  },

  onWorkspaceChanged: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('workspace:changed', handler);
    return () => ipcRenderer.removeListener('workspace:changed', handler);
  },

  onUpdateChanged: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('update:changed', handler);
    return () => ipcRenderer.removeListener('update:changed', handler);
  },

  onPreflightChanged: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('preflight:changed', handler);
    return () => ipcRenderer.removeListener('preflight:changed', handler);
  },
});

