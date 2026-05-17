import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'javascript-obfuscator';
import {
  getBundledChromiumExecutablePath,
  getBundledFirefoxExecutablePath,
} from '../src/shared/browserPaths.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, '.protected_release');
const protectedBuildOutputDir = 'release_build_protected';

const includePaths = [
  'account_creator_core.js',
  'auth_store.js',
  'device_fingerprint.js',
  'chatgpt_account_creator_and_verify.js',
  'electron_main.js',
  'electron_preload.cjs',
  'history_store.js',
  'package.json',
  'package-lock.json',
  'config.json',
  'accounts.txt',
  'sms_state.json',
  'ui',
  'scripts',
  'src',
  'vendor',
  'bundled-browsers',
  'node_modules/playwright',
  'node_modules/playwright-core',
  'node_modules/playwright-firefox',
  'node_modules/playwright-chromium',
  'node_modules/otplib',
  'node_modules/@otplib',
];

const sensitiveFiles = [
  'account_creator_core.js',
  'device_fingerprint.js',
  'history_store.js',
];

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

function describeBrowserInstallFix() {
  if (process.platform === 'linux') {
    return 'Delete bundled-browsers, then run "sudo npx playwright install-deps chromium firefox" and "npm run install-browsers" on Ubuntu/Linux.';
  }
  return 'Run "npm run install-browsers" on the same OS used for packaging.';
}

function ensureExecutablePermission(executablePath) {
  if (process.platform === 'win32' || !executablePath) return;
  fs.chmodSync(executablePath, 0o755);
}
function removeDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function cleanProtectedWorkspace() {
  if (!fs.existsSync(outDir)) return;

  try {
    removeDir(outDir);
    return;
  } catch (error) {
    console.warn(`[build-protect] Full cleanup skipped: ${error.message}`);
  }

  for (const rel of includePaths) {
    const target = path.join(outDir, rel);
    try {
      removeDir(target);
    } catch (error) {
      console.warn(`[build-protect] Skipped locked path: ${target} (${error.message})`);
    }
  }
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function obfuscateFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const result = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.2,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.08,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 8,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
  });
  fs.writeFileSync(filePath, result.getObfuscatedCode(), 'utf-8');
}

function patchPackageJson() {
  const pkgPath = path.join(outDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.main = 'electron_main.js';
  pkg.build = pkg.build || {};
  pkg.build.directories = pkg.build.directories || {};
  pkg.build.directories.output = protectedBuildOutputDir;
  pkg.scripts = {
    'desktop:dev': 'electron .',
    'install-browsers': 'node scripts/install-playwright-firefox.mjs',
    'postinstall': 'node scripts/install-playwright-firefox.mjs',
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
}

function ensureBundledFirefoxReady(baseDir, label) {
  const executablePath = getBundledFirefoxExecutablePath(path.join(baseDir, 'bundled-browsers'));
  if (!executablePath) {
    throw new Error(`Bundled Firefox missing or wrong platform in ${label}. ${describeBrowserInstallFix()}`);
  }

  ensureExecutablePermission(executablePath);
  console.log(`[playwright] Bundled Firefox verified in ${label}: ${executablePath}`);
}

function ensureBundledChromiumReady(baseDir, label) {
  const executablePath = getBundledChromiumExecutablePath(path.join(baseDir, 'bundled-browsers'));
  if (!executablePath) {
    throw new Error(`Bundled Chromium missing or wrong platform in ${label}. ${describeBrowserInstallFix()}`);
  }

  ensureExecutablePermission(executablePath);
  console.log(`[playwright] Bundled Chromium verified in ${label}: ${executablePath}`);
}


const requiredRuntimeFiles = [
  'src/shared/browserPaths.js',
  'src/shared/fsUtils.js',
  'src/core/services/SMSPoolService.js',
  'src/core/services/MailOtpService.js',
  'src/core/services/ClonemupService.js',
  'src/core/services/ShopGmail9999Service.js',
  'src/core/services/RuntimeLogger.js',
  'src/core/repositories/AccountRepository.js',
  'src/core/repositories/HotmailAccountRepository.js',
  'src/core/repositories/ShopGmail9999StateRepository.js',
  'src/core/repositories/SmsStateRepository.js',
  'src/core/vercelRelayService.js',
  'vendor/extensions/urban-vpn/manifest.json',
];

function ensureRequiredRuntimeFilesReady(baseDir, label) {
  const missing = requiredRuntimeFiles.filter((rel) => !fs.existsSync(path.join(baseDir, rel)));
  if (missing.length > 0) {
    throw new Error(`Required runtime files missing in ${label}: ${missing.join(', ')}`);
  }

  console.log(`[build-protect] Runtime source files verified in ${label}: ${requiredRuntimeFiles.length} files`);
}

function ensureUrbanVpnExtensionReady(baseDir, label) {
  const manifestPath = path.join(baseDir, 'vendor', 'extensions', 'urban-vpn', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Urban VPN extension missing in ${label}: ${manifestPath}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  if (!manifest.manifest_version || !manifest.name) {
    throw new Error(`Urban VPN manifest invalid in ${label}: ${manifestPath}`);
  }

  console.log(`[build-protect] Urban VPN extension verified in ${label}: ${manifestPath}`);
}

function ensureOtplibRuntimeReady(baseDir, label) {
  const required = [
    'node_modules/otplib/package.json',
    'node_modules/@otplib/core/package.json',
    'node_modules/@otplib/plugin-crypto/package.json',
    'node_modules/@otplib/plugin-thirty-two/package.json',
  ];
  const missing = required.filter((rel) => !fs.existsSync(path.join(baseDir, rel)));
  if (missing.length > 0) {
    throw new Error(`TOTP runtime dependencies missing in ${label}: ${missing.join(', ')}`);
  }

  console.log(`[build-protect] TOTP runtime dependencies verified in ${label}: ${required.length} packages`);
}

function main() {
  console.log(`[build-protect] Preparing protected release on platform=${process.platform}, arch=${process.arch}`);
  cleanProtectedWorkspace();
  ensureBundledFirefoxReady(rootDir, 'project root');
  ensureBundledChromiumReady(rootDir, 'project root');
  ensureRequiredRuntimeFilesReady(rootDir, 'project root');
  ensureOtplibRuntimeReady(rootDir, 'project root');
  ensureUrbanVpnExtensionReady(rootDir, 'project root');
  fs.mkdirSync(outDir, { recursive: true });


  for (const rel of includePaths) {
    const src = path.join(rootDir, rel);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(outDir, rel);
    copyRecursive(src, dest);
  }

  ensureBundledFirefoxReady(outDir, '.protected_release');
  ensureBundledChromiumReady(outDir, '.protected_release');
  ensureRequiredRuntimeFilesReady(outDir, '.protected_release');
  ensureOtplibRuntimeReady(outDir, '.protected_release');
  ensureUrbanVpnExtensionReady(outDir, '.protected_release');
  patchPackageJson();


  for (const rel of sensitiveFiles) {
    const filePath = path.join(outDir, rel);
    if (fs.existsSync(filePath)) obfuscateFile(filePath);
  }

  console.log(`Protected release prepared at: ${outDir}`);
  console.log(`Desktop artifacts will be emitted to: ${path.join(outDir, protectedBuildOutputDir)}`);
  console.log('Next step: npm run desktop:dist');
}

main();
