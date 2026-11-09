// 첫 관리자 만들기: pnpm --filter @quiz/server admin:create -- <아이디> <닉네임> <비밀번호>
import { loadConfig } from '../src/config.ts';
import { openDb } from '../src/db.ts';
import { AppContext } from '../src/context.ts';
import { createUser } from '../src/auth.ts';

const [username, nickname, password] = process.argv.slice(2).filter((a) => a !== '--');
if (!username || !nickname || !password || password.length < 8) {
  console.error('사용: admin:create -- <아이디> <닉네임> <비밀번호(8자 이상)>');
  process.exit(1);
}
const config = loadConfig();
const ctx = new AppContext(openDb(config.databasePath), config);
const u = createUser(ctx, { username, nickname, password, role: 'admin' });
console.log(`관리자 만듦: ${u.username} (${u.nickname})`);
