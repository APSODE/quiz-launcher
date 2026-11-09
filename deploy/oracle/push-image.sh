#!/bin/sh
# 이 PC(x86_64)에서 이미지를 빌드해 서버로 보낸다. 서버에서 빌드하지 않으므로 1GB 서버도 안전하다.
# 사용: deploy/oracle/push-image.sh [ssh 호스트, 기본 oracle]
set -eu
HOST=${1:-oracle}
cd "$(dirname "$0")/../.."
docker build -t quiz-launcher:local .
docker save quiz-launcher:local | gzip -1 | ssh "$HOST" 'gunzip | sudo docker load'
ssh "$HOST" 'cd /opt/quiz && sudo docker compose up -d && sudo docker image prune -f >/dev/null'
echo "배포 완료: $HOST"
