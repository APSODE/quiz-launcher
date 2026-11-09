# 문제 실행기 v2 — API 서버 + 웹 정적 파일을 컨테이너 하나로 (docs/배포.md)
# 빌드: docker compose build   실행: docker compose up -d

# ── 1) 의존성 설치 + 웹 빌드 ──
FROM node:26-bookworm-slim AS build
RUN npm i -g pnpm@9.15.9
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/core/package.json packages/core/
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile
COPY packages packages
COPY apps apps
RUN pnpm --filter @quiz/web build \
 && pnpm prune --prod

# ── 2) 실행 이미지 ──
FROM node:26-bookworm-slim
# git: 콘텐츠 pull · 승인 커밋 · push / openssh-client: 배포 키로 push / tini: 신호 전달 · 좀비 정리
RUN apt-get update \
 && apt-get install -y --no-install-recommends git openssh-client ca-certificates tini \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build --chown=node:node /app /app
COPY --chown=node:node docker/entrypoint.sh /app/docker/entrypoint.sh
RUN chmod +x /app/docker/entrypoint.sh \
 && mkdir -p /data && chown node:node /data

ENV NODE_ENV=production \
    PORT=8787 \
    DATABASE_PATH=/data/db/quiz.sqlite \
    CONTENT_DIR=/data/content \
    CONTENT_BRANCH=master \
    WEB_DIST=/app/apps/web/dist

USER node
VOLUME ["/data"]
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8787)+'/api/auth/me').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["tini", "--", "/app/docker/entrypoint.sh"]
CMD ["node", "apps/server/src/index.ts"]
