#!/bin/sh
# 컨테이너 시작 준비: 배포 키 설정 → 콘텐츠 작업 사본 clone(처음 한 번) → git 설정 → 서버 실행
set -eu

: "${CONTENT_REPO_URL:?CONTENT_REPO_URL 을 .env 에 설정하세요 (예: git@github.com:APSODE/quiz-launcher.git)}"
: "${PUBLIC_ORIGIN:?PUBLIC_ORIGIN 을 .env 에 설정하세요 (예: https://quiz.example.com)}"
: "${GITHUB_WEBHOOK_SECRET:?GITHUB_WEBHOOK_SECRET 을 .env 에 설정하세요}"

mkdir -p "$(dirname "$DATABASE_PATH")"

# 배포 키 (읽기 전용으로 마운트된 파일을 권한 600 으로 복사)
KEY_SRC="${GIT_DEPLOY_KEY_FILE:-/run/secrets/deploy_key}"
if [ -f "$KEY_SRC" ]; then
  mkdir -p "$HOME/.ssh"
  cp "$KEY_SRC" "$HOME/.ssh/id_deploy"
  chmod 600 "$HOME/.ssh/id_deploy"
  export GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_deploy -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/data/known_hosts"
else
  echo "[entrypoint] 배포 키가 없습니다($KEY_SRC). SSH 주소면 clone · push 가 실패합니다. HTTPS + 토큰 주소를 쓰는 경우는 무시하세요." >&2
fi

# 콘텐츠 작업 사본: 처음 한 번만 clone. 이후에는 서버가 webhook 으로 pull 한다
if [ ! -d "$CONTENT_DIR/.git" ]; then
  echo "[entrypoint] 콘텐츠 clone: $CONTENT_REPO_URL ($CONTENT_BRANCH) → $CONTENT_DIR"
  git clone --branch "$CONTENT_BRANCH" "$CONTENT_REPO_URL" "$CONTENT_DIR"
fi
git config --global --add safe.directory "$CONTENT_DIR"
git -C "$CONTENT_DIR" config core.hooksPath tools/hooks        # 승인 커밋도 pre-commit 훅(check · 번들)을 거친다
# 원격에 훅이 실행 권한 없이(100644) 저장돼 있어도 돌도록: 권한을 주고, 권한 변경은 git 이 변경으로 보지 않게 한다
git -C "$CONTENT_DIR" config core.fileMode false
chmod +x "$CONTENT_DIR"/tools/hooks/* 2>/dev/null || true
git -C "$CONTENT_DIR" config user.name  "${GIT_AUTHOR_NAME:-quiz-server}"
git -C "$CONTENT_DIR" config user.email "${GIT_AUTHOR_EMAIL:-quiz-server@localhost}"

exec "$@"
