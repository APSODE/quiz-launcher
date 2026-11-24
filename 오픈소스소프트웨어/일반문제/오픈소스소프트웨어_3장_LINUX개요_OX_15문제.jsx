// 업로드: 445 나무젓가락 도둑(ronaldo) · 2026-11-24
const META = {"group":"오픈소스소프트웨어","exam":"기말고사","unit":"3장","title":"3장 LINUX개요 OX 15문제","topic":"리눅스 구조 · 터미널 · 기초 명령","uploader":"ronaldo"};

const QUESTIONS = [
  {"id":"umwux1lrt23q9","category":"리눅스 역사","question":"리누스 토르발스가 뉴스 그룹에 리눅스 개발 소식을 포스팅한 1991년 8월 26일이 리눅스 탄생일이다.","answer":true,"explanation":"1991년 8월 26일 토르발스가 뉴스 그룹에 리눅스 개발 소식을 포스팅한 날을 리눅스 탄생일로 본다. [p.2]","source":"3장 p.2","difficulty":"기초"},
  {"id":"umwux1lruhte0","category":"리눅스 특징","question":"리눅스는 다중 처리(Multi-Tasking) 시스템이다.","answer":true,"explanation":"리눅스는 다중 사용자(Multi-User)이면서 다중 처리(Multi-Tasking)를 지원하는 시스템이다. [p.5]","source":"3장 p.5","difficulty":"기초"},
  {"id":"umwux1lrvv2gq","category":"터미널","question":"터미널을 열었을 때의 기본 디렉터리는 루트 디렉터리(/)이다.","answer":false,"explanation":"터미널의 기본 디렉터리는 루트(/)가 아니라 사용자의 홈 디렉터리이다. [p.14]","source":"3장 p.14","difficulty":"표준"},
  {"id":"umwux1lrwnwh9","category":"리눅스 특징","question":"리눅스는 대부분 C언어로 작성되어 있다.","answer":true,"explanation":"리눅스는 대부분 C언어로 작성되어 있어 이식성이 뛰어나다. [p.5]","source":"3장 p.5","difficulty":"기초"},
  {"id":"umwux1lrxzbma","category":"리눅스 단점","question":"리눅스는 이식성이 뛰어나므로 모든 하드웨어 플랫폼에서 별도 확인 없이 작동한다.","answer":false,"explanation":"이식성이 우수하지만 모든 플랫폼에서 작동하는 것은 아니므로 설치 전 지원 하드웨어인지 확인해야 한다. [p.6]","source":"3장 p.6","difficulty":"표준"},
  {"id":"umwux1lrywdq7","category":"파일 구조","question":"리눅스의 파일 구조는 root(/)를 정점으로 한 계층적 트리(Tree) 구조이다.","answer":true,"explanation":"리눅스는 root(/)를 정점으로 하는 계층적 Tree 구조의 파일 구조를 가진다. [p.7]","source":"3장 p.7","difficulty":"기초"},
  {"id":"umwux1lrz3pn2","category":"GNU/리눅스","question":"GNU/리눅스는 GNU 프로젝트의 커널에 리눅스의 응용 프로그램을 결합한 형태이다.","answer":false,"explanation":"GNU/리눅스는 리눅스 커널에 GNU 프로젝트의 응용 프로그램을 결합한 형태로, 커널과 응용 프로그램의 출처가 반대로 서술되었다. [p.3]","source":"3장 p.3","difficulty":"표준"},
  {"id":"umwux1ls0a6wj","category":"장치 파일","question":"리눅스는 장치를 파일화하여 특정 하드웨어에 대한 명령을 지정된 장치 파일에 대해 수행한다.","answer":true,"explanation":"리눅스는 장치를 파일로 다루며, 예로 tty(teletype writer)와 /dev/pts/0 ~ /dev/pts/63 같은 장치 파일이 있다. [p.7]","source":"3장 p.7","difficulty":"기초"},
  {"id":"umwux1ls1m9cj","category":"프롬프트","question":"터미널 프롬프트에서 `#`은 일반 사용자를 나타내는 기호이다.","answer":false,"explanation":"bash 쉘의 일반 사용자 프롬프트는 `$`이고, `#`은 시스템 관리자(root)의 프롬프트이다. [p.14]","source":"3장 p.14","difficulty":"표준"},
  {"id":"umwux1ls27838","category":"Ubuntu","question":"Ubuntu의 LTS 버전은 일반 버전과 마찬가지로 매 6개월마다 출시된다.","answer":false,"explanation":"일반 버전은 매 6개월마다 공개되지만 LTS(Long Term Support) 버전은 2년에 한 번씩 출시된다. [p.9]","source":"3장 p.9","difficulty":"표준"},
  {"id":"umwux1ls3lq3r","category":"명령 형식","question":"리눅스 명령에서 옵션은 한 번에 하나만 사용할 수 있다.","answer":false,"explanation":"옵션은 `-` 또는 `--`로 시작하며 여러 개를 동시에 사용할 수 있다. [p.16]","source":"3장 p.16","difficulty":"기초"},
  {"id":"umwux1ls49ht1","category":"프롬프트 설정","question":"프롬프트 설정 기호 `\\u@\\h:\\w`에서 `\\u`는 hostname을 의미한다.","answer":false,"explanation":"`\\u`는 username, `\\h`는 hostname, `\\w`는 working directory를 의미한다. [p.14]","source":"3장 p.14","difficulty":"표준"},
  {"id":"umwux1ls5jix9","category":"Ubuntu","question":"Ubuntu는 GNOME을 기본 GUI 데스크톱 환경으로 사용한다.","answer":true,"explanation":"Ubuntu LINUX는 GNOME(GNU Network Object Model Environment)을 기본 GUI 데스크톱 환경으로 사용한다. [p.9]","source":"3장 p.9","difficulty":"기초"},
  {"id":"umwux1ls6izhs","category":"리눅스 배포판","question":"리눅스 배포판이란 응용 프로그램 없이 리눅스 커널만 단독으로 배포하는 것을 말한다.","answer":false,"explanation":"리눅스 배포판은 리눅스 커널과 관련 응용 프로그램을 독자적으로 엮어서 배포하는 것이다. [p.4]","source":"3장 p.4","difficulty":"기초"},
  {"id":"umwux1ls7o0xj","category":"리눅스 특징","question":"리눅스는 동적 라이브러리를 지원한다.","answer":true,"explanation":"리눅스는 가상 메모리를 사용하고 동적 라이브러리를 지원한다. [p.7]","source":"3장 p.7","difficulty":"기초"},
];
