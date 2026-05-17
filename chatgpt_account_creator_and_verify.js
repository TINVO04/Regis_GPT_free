/**
 * ChatGPT Account Creator CLI Wrapper
 */

import readline from 'readline';
import { runCreator, stopCreator } from './account_creator_core.js';

function parseArgs(argv) {
  const args = {
    mode: 'create_verify',
    count: null,
    smspoolKey: process.env.SMSPOOL_KEY || '',
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === '--mode' && argv[i + 1]) { args.mode = argv[i + 1]; i++; }
    else if (token === '--count' && argv[i + 1]) { args.count = parseInt(argv[i + 1], 10); i++; }
    else if (token === '--sms-key' && argv[i + 1]) { args.smspoolKey = argv[i + 1]; i++; }
    else if (token === 'sms' || token === '--sms') { args.mode = 'create_verify'; }
  }
  return args;
}

async function askCount() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await new Promise((resolve) => rl.question('\n📝 Bạn muốn HOÀN THIỆN bao nhiêu tài khoản? ', resolve));
    const count = parseInt(answer, 10);
    if (isNaN(count) || count <= 0) throw new Error('Vui lòng nhập số lượng hợp lệ (>0).');
    return count;
  } finally { rl.close(); }
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  console.log('🤖 ChatGPT Account Creator');
  console.log(`🛠  MODE: ${parsed.mode}`);
  console.log('='.repeat(60));

  const count = parsed.count && parsed.count > 0 ? parsed.count : await askCount();

  await runCreator({
    count,
    mode: parsed.mode,
    smspoolKey: parsed.smspoolKey,
  });
}

process.on('SIGINT', () => {
  console.log('\n\n🛑 Script interrupted.');
  stopCreator();
  setTimeout(() => process.exit(0), 500);
});

main().catch((error) => {
  console.error(`\n❌ Error: ${error.message}`);
  process.exit(1);
});
