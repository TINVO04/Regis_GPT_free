import fs from 'fs';
import path from 'path';

export function resolveAppAsarUnpackedDir(baseDir) {
  const parts = path.resolve(baseDir).split(path.sep);
  const index = parts.lastIndexOf('app.asar');
  if (index === -1) return '';
  const clone = [...parts];
  clone[index] = 'app.asar.unpacked';
  return clone.join(path.sep);
}

function getBundledBrowsersDirCandidates(baseDir) {
  const candidates = [];
  const pushCandidate = (candidatePath, source) => {
    if (!candidatePath) return;
    const normalizedPath = path.resolve(candidatePath);
    if (candidates.some((item) => item.path === normalizedPath)) return;
    candidates.push({ path: normalizedPath, source });
  };

  const resourcesPath = `${process.resourcesPath || ''}`.trim();
  if (resourcesPath) {
    pushCandidate(path.join(resourcesPath, 'app.asar.unpacked', 'bundled-browsers'), 'electron_resources_app_asar_unpacked');
    pushCandidate(path.join(resourcesPath, 'bundled-browsers'), 'electron_resources');
  }

  const unpacked = resolveAppAsarUnpackedDir(baseDir);
  if (unpacked) pushCandidate(path.join(unpacked, 'bundled-browsers'), 'baseDir_app_asar_unpacked');
  pushCandidate(path.join(baseDir, 'bundled-browsers'), 'baseDir');

  return candidates;
}

export function resolveBundledBrowsersDir(baseDir) {
  const candidates = getBundledBrowsersDirCandidates(baseDir);
  const existing = candidates.find((candidate) => fs.existsSync(candidate.path));
  return existing?.path || candidates[0]?.path || path.resolve(baseDir, 'bundled-browsers');
}

export function describeBundledBrowsersDirSource(baseDir) {
  const candidates = getBundledBrowsersDirCandidates(baseDir);
  const existing = candidates.find((candidate) => fs.existsSync(candidate.path));
  return existing?.source || candidates[0]?.source || 'baseDir';
}

export function getFirefoxExecutableSuffix() {
  if (process.platform === 'darwin') return path.join('firefox', 'Nightly.app', 'Contents', 'MacOS', 'firefox');
  if (process.platform === 'win32') return path.join('firefox', 'firefox.exe');
  return path.join('firefox', 'firefox');
}

export function getChromiumExecutableSuffix() {
  if (process.platform === 'darwin') return path.join('chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium');
  if (process.platform === 'win32') return path.join('chrome-win64', 'chrome.exe');
  return path.join('chrome-linux64', 'chrome');
}

export function getFirefoxExecutableSuffixCandidates() {
  return Array.from(new Set([
    getFirefoxExecutableSuffix(),
    path.join('firefox', process.platform === 'win32' ? 'firefox.exe' : 'firefox'),
  ]));
}

export function getChromiumExecutableSuffixCandidates() {
  return Array.from(new Set([
    getChromiumExecutableSuffix(),
    path.join('chrome-win64', 'chrome.exe'),
    path.join('chrome-linux64', 'chrome'),
    path.join('chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
  ]));
}

function findExecutableByName(dir, executableNames) {
  if (!fs.existsSync(dir)) return '';
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (executableNames.includes(entry.name)) return fullPath;
    }
  }
  return '';
}

export function getBundledExecutablePath(prefix, suffixCandidates, baseDir, fallbackExecutableNames = []) {
  if (!fs.existsSync(baseDir)) return '';
  const entries = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${prefix}-`))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    for (const suffix of suffixCandidates) {
      const candidate = path.join(baseDir, entry.name, suffix);
      if (fs.existsSync(candidate)) return candidate;
    }
  }

  if (fallbackExecutableNames.length > 0) {
    for (const entry of entries) {
      const fallback = findExecutableByName(path.join(baseDir, entry.name), fallbackExecutableNames);
      if (fallback) return fallback;
    }
  }

  return '';
}

export function getBundledFirefoxExecutablePath(baseDir) {
  return getBundledExecutablePath('firefox', getFirefoxExecutableSuffixCandidates(), baseDir, ['firefox.exe', 'firefox']);
}

export function getBundledChromiumExecutablePath(baseDir) {
  return getBundledExecutablePath('chromium', getChromiumExecutableSuffixCandidates(), baseDir, ['chrome.exe', 'chrome', 'Chromium']);
}
