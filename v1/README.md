# v1 — 옛 단일 HTML 실행기 (유지 안 함)

- `quiz_launcher.html` · `quiz_bundle.js` · `build-bundle.js`. 현재 앱은 v2(`apps/` · `packages/`)이고, 이 폴더는 참고용으로만 남겨 둔다.
- v2는 이 폴더의 어떤 파일도 쓰지 않는다(검사 도구는 `tools/jsx-parser.js` 사용, v2 서버 테스트 샌드박스는 이 폴더를 빼고 만든다). 경로 · 의존성이 부딪치면 v2를 우선한다.
- 콘텐츠(과목 폴더 · `플러그인/`)는 레포 루트에 그대로 있다. v1을 열어 보려면 `node v1/build-bundle.js`로 묶음 파일을 다시 만든 뒤 `v1/quiz_launcher.html`을 연다(pre-commit 훅은 더 이상 묶음 파일을 만들지 않는다).
