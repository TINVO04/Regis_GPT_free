import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import {
  getBundledChromiumExecutablePath,
  getBundledFirefoxExecutablePath,
} from '../src/shared/browserPaths.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const bundledBrowsersDir = path.join(rootDir, 'bundled-browsers');
const installLockPath = path.join(bundledBrowsersDir, '__dirlock');


function getFirefoxExecutableSuffix() {
  if (process.platform === 'darwin') return path.join('firefox', 'Nightly.app', 'Contents', 'MacOS', 'firefox');
  if (process.platform === 'linux') return path.join('firefox', 'firefox');
  return path.join('firefox', 'firefox.exe');
}

function getChromiumExecutableSuffix() {
  if (process.platform === 'darwin') return path.join('chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium');
  if (process.platform === 'linux') return path.join('chrome-linux64', 'chrome');
  return path.join('chrome-win64', 'chrome.exe');
}

function getPlaywrightCliPath() {
  const cliCandidates = [
    path.join(rootDir, 'node_modules', 'playwright', 'cli.js'),
    path.join(rootDir, 'node_modules', 'playwright-core', 'cli.js'),
  ];

  return cliCandidates.find((candidate) => fs.existsSync(candidate)) || '';
}

function listBundledBrowserDirectories() {
  if (!fs.existsSync(bundledBrowsersDir)) return [];
  return fs
    .readdirSync(bundledBrowsersDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function describeBundledBrowserDirectories() {
  const entries = listBundledBrowserDirectories();
  return entries.length > 0 ? entries.join(', ') : '(empty)';
}

function getBundledFirefoxExecutablePathSafe() {
  return getBundledFirefoxExecutablePath(bundledBrowsersDir);
}

function getBundledChromiumExecutablePathSafe() {
  return getBundledChromiumExecutablePath(bundledBrowsersDir);
}

function isFirefoxInstalled() {
  return Boolean(getBundledFirefoxExecutablePathSafe());
}

function isChromiumInstalled() {
  return Boolean(getBundledChromiumExecutablePathSafe());
}


function areRequiredBrowsersInstalled() {
  return isFirefoxInstalled() && isChromiumInstalled();
}

function getInstallEnv() {
  return {
    ...process.env,
    PLAYWRIGHT_BROWSERS_PATH: bundledBrowsersDir,
  };
}

function printLinuxInstallDepsHint() {
  if (process.platform !== 'linux') return;
  console.error('Linux hint: nếu browser install/launch lỗi do thiếu thư viện hệ thống, chạy:');
  console.error('  sudo npx playwright install-deps chromium firefox');
  console.error('  npm run install-browsers');
}

function ensureExecutablePermission(executablePath) {
  if (process.platform === 'win32' || !executablePath) return;
  fs.chmodSync(executablePath, 0o755);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForConcurrentInstall(timeoutMs = 5 * 60 * 1000) {
  const startedAt = Date.now();
  let waitingLogged = false;

  while (Date.now() - startedAt < timeoutMs) {
    if (areRequiredBrowsersInstalled()) {
      return {
        firefox: getBundledFirefoxExecutablePathSafe(),
        chromium: getBundledChromiumExecutablePathSafe(),
      };

    }

    if (!fs.existsSync(installLockPath)) return null;

    if (!waitingLogged) {
      console.log(`[playwright] Install lock detected at ${installLockPath}. Waiting for concurrent install to finish...`);
      waitingLogged = true;
    }

    await sleep(2000);
  }

  throw new Error(`Timed out waiting for Playwright install lock to clear: ${installLockPath}`);
}

async function runInstall() {
  const cliPath = getPlaywrightCliPath();
  if (!cliPath) {
    throw new Error('Không tìm thấy Playwright CLI trong node_modules.');
  }

  fs.mkdirSync(bundledBrowsersDir, { recursive: true });

  for (const browserName of ['firefox', 'chromium']) {
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [cliPath, 'install', browserName], {
        cwd: rootDir,
        stdio: 'inherit',
        env: getInstallEnv(),
      });

      child.on('error', reject);
      child.on('exit', (code) => {
        if (code === 0) {
          resolve();
          return;
        }
        reject(new Error(`Playwright install ${browserName} failed with exit code ${code}`));
      });
    });
  }
}

async function main() {
  console.log(`[playwright] Platform=${process.platform}, arch=${process.arch}`);
  console.log(`[playwright] Browser target directory: ${bundledBrowsersDir}`);
  console.log(`[playwright] Expected Firefox suffix: ${getFirefoxExecutableSuffix()}`);
  console.log(`[playwright] Expected Chromium suffix: ${getChromiumExecutableSuffix()}`);
  console.log(`[playwright] Existing browser directories: ${describeBundledBrowserDirectories()}`);

  const existingFirefox = getBundledFirefoxExecutablePathSafe();
  const existingChromium = getBundledChromiumExecutablePathSafe();

  if (existingFirefox && existingChromium) {
    ensureExecutablePermission(existingFirefox);
    ensureExecutablePermission(existingChromium);
    console.log(`[playwright] Firefox already bundled at ${existingFirefox}`);
    console.log(`[playwright] Chromium already bundled at ${existingChromium}`);
    return;
  }

  const concurrentInstallResult = await waitForConcurrentInstall();
  if (concurrentInstallResult?.firefox && concurrentInstallResult?.chromium) {
    ensureExecutablePermission(concurrentInstallResult.firefox);
    ensureExecutablePermission(concurrentInstallResult.chromium);
    console.log(`[playwright] Firefox became available while waiting: ${concurrentInstallResult.firefox}`);
    console.log(`[playwright] Chromium became available while waiting: ${concurrentInstallResult.chromium}`);
    return;
  }

  console.log(`[playwright] Required browsers missing. Installing bundled browsers into ${bundledBrowsersDir}`);
  try {
    await runInstall();
  } catch (error) {
    if (fs.existsSync(installLockPath)) {
      const recovered = await waitForConcurrentInstall();
      if (recovered?.firefox && recovered?.chromium) {
        ensureExecutablePermission(recovered.firefox);
        ensureExecutablePermission(recovered.chromium);
        console.log(`[playwright] Firefox became available after lock recovery: ${recovered.firefox}`);
        console.log(`[playwright] Chromium became available after lock recovery: ${recovered.chromium}`);
        console.log(`[playwright] Browser directories after lock recovery: ${describeBundledBrowserDirectories()}`);
        return;
      }
    }

    printLinuxInstallDepsHint();
    throw error;
  }

  console.log(`[playwright] Browser directories after install: ${describeBundledBrowserDirectories()}`);
  const installedFirefox = getBundledFirefoxExecutablePathSafe();
  const installedChromium = getBundledChromiumExecutablePathSafe();
  if (!installedFirefox) {
    throw new Error(`Cài Firefox cho Playwright xong nhưng không tìm thấy executable trong bundled-browsers. Browser directories: ${describeBundledBrowserDirectories()}`);
  }
  if (!installedChromium) {
    throw new Error(`Cài Chromium cho Playwright xong nhưng không tìm thấy executable trong bundled-browsers. Browser directories: ${describeBundledBrowserDirectories()}`);
  }

  ensureExecutablePermission(installedFirefox);
  ensureExecutablePermission(installedChromium);
  console.log(`[playwright] Firefox installed successfully at ${installedFirefox}`);
  console.log(`[playwright] Chromium installed successfully at ${installedChromium}`);

}

main().catch((error) => {
  console.error(error.message || error);
  printLinuxInstallDepsHint();
  process.exit(1);
});
