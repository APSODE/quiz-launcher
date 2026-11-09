#!/bin/sh
# SQLite 온라인 백업 → /opt/quiz/backups/quiz-YYYYmmdd-HHMM.sqlite, 14일 지난 것은 지운다.
# cron: /etc/cron.d/quiz-backup 에 `0 4 * * * root /opt/quiz/backup.sh >> /opt/quiz/backups/backup.log 2>&1` (docs/배포.md)
set -eu
TS=$(date +%Y%m%d-%H%M)
docker exec quiz node -e "const {DatabaseSync}=require('node:sqlite');new DatabaseSync(process.env.DATABASE_PATH).exec(\"VACUUM INTO '/backups/quiz-$TS.sqlite'\")"
find /opt/quiz/backups -name 'quiz-*.sqlite' -mtime +14 -delete
echo "$(date '+%F %T') 백업 quiz-$TS.sqlite"
