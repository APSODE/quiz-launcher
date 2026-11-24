// 업로드: 445 나무젓가락 도둑(ronaldo) · 2026-11-24
const META = {"group":"오픈소스소프트웨어","exam":"기말고사","unit":"2장","title":"2장 LINUX실습환경구축 OX 15문제","topic":"VirtualBox · Ubuntu 설치","uploader":"ronaldo"};

const QUESTIONS = [
  {"id":"umwut4zqf2l8c","category":"가상화 용어","question":"게스트 운영체제는 VirtualBox로 생성한 가상머신 안에서 동작하는 운영체제이다.","answer":true,"explanation":"게스트 운영체제(Guest OS)는 VirtualBox로 생성한 가상머신 안에서 동작하는 운영체제이다. [p.5]","source":"2장 p.5","difficulty":"기초"},
  {"id":"umwut4zqg950r","category":"가상화 용어","question":"가상머신은 VirtualBox가 설치되는 물리적인 하드웨어를 말한다.","answer":false,"explanation":"가상머신은 VirtualBox가 게스트 운영체제를 위해 생성한 가상의 컴퓨터이며, 물리적 하드웨어가 아니다. [p.5]","source":"2장 p.5","difficulty":"표준"},
  {"id":"umwut4zqha7mi","category":"VirtualBox 설치","question":"VirtualBox 설치 시 extension pack도 함께 다운로드해야 한다.","answer":false,"explanation":"다운로드 안내에서 extension pack은 `(download X)`로 표시되어 있어 다운로드하지 않는다. [p.2]","source":"2장 p.2","difficulty":"기초"},
  {"id":"umwut4zqimk7d","category":"BIOS 설정","question":"VM에서 멀티코어 CPU 기능을 사용하려면 BIOS에서 가상화 지원을 활성화해야 한다.","answer":true,"explanation":"VM에서 멀티코어 CPU 기능을 사용하기 위해 BIOS에서 가상화 지원을 `Enable`로 활성화해야 한다. [p.4]","source":"2장 p.4","difficulty":"기초"},
  {"id":"umwut4zqjb72a","category":"Ubuntu 설치","question":"설치 대상 배포판 Ubuntu 26.04 LTS에서 LTS는 Long Term Support를 뜻한다.","answer":true,"explanation":"설치 대상 ISO 이미지는 Ubuntu 26.04 LTS이며, LTS는 Long Term Support의 약자이다. [p.8]","source":"2장 p.8","difficulty":"기초"},
  {"id":"umwut4zqkizwm","category":"BIOS 설정","question":"부팅 시 BIOS 진입 키는 F2 한 가지로만 제시되어 있다.","answer":false,"explanation":"BIOS 진입 키 예시로 F2 / DEL / ESC / F1 / F10 / F11 / F12 등 여러 키가 제시되어 있다. [p.4]","source":"2장 p.4","difficulty":"기초"},
  {"id":"umwut4zqm499o","category":"가상 머신 설정","question":"[디스플레이]-[화면] 탭의 '3차원 가속 사용하기'는 반드시 체크해야 하는 필수 설정이다.","answer":false,"explanation":"비디오 메모리는 128MB로 설정하고, 3차원 가속 사용하기는 필요한 경우에만 체크한다. [p.12]","source":"2장 p.12","difficulty":"표준"},
  {"id":"umwut4zqn4lqy","category":"게스트 확장","question":"게스트 확장 CD 이미지는 게스트 운영체제를 설치하기 전에 삽입한다.","answer":false,"explanation":"게스트 확장 CD 이미지는 게스트 운영체제 설치 후 [장치]-[게스트 확장 CD 이미지 삽입]으로 넣는다. [p.11]","source":"2장 p.11","difficulty":"표준"},
  {"id":"umwut4zqo1rdn","category":"게스트 확장","question":"게스트 확장 설치 후 \"컴퓨터끄기\"에서 [다시시작]을 클릭하면 화면 크기 조정이 가능해진다.","answer":true,"explanation":"게스트 확장 설치 후 \"컴퓨터끄기\" 선택 뒤 [다시시작]을 클릭하면 화면 크기 조정이 가능해진다. [p.19]","source":"2장 p.19","difficulty":"기초"},
  {"id":"umwut4zqp2kb5","category":"공유 폴더","question":"공유 폴더를 추가하기만 하면 별도 절차 없이 게스트 OS에서 바로 접근할 수 있다.","answer":false,"explanation":"공유 폴더 추가 후 터미널에서 adduser 명령으로 사용자를 그룹에 추가하고 게스트 OS를 재부팅해야 접근할 수 있다. [p.23]","source":"2장 p.23","difficulty":"표준"},
  {"id":"umwut4zqqof0n","category":"공유 폴더","question":"공유 폴더는 게스트 OS에서 공유한 폴더를 호스트 OS에서 네트워크를 통해 접근하도록 설정한 폴더이다.","answer":false,"explanation":"방향이 반대이다. 공유 폴더는 호스트 OS에서 공유한 폴더를 게스트 OS에서 네트워크를 통해 접근하도록 설정한 폴더이다. [p.23~24]","source":"2장 p.23~24","difficulty":"표준"},
  {"id":"umwut4zqr62t9","category":"디스크 저장 방식","question":"가상 머신 생성 안내에서 디스크 저장 방식은 향후 디스크 크기 변동이 가능한 방식으로 선택한다.","answer":true,"explanation":"안내된 저장 방식은 동적할당이며, 동적할당은 향후 디스크 크기 변동이 가능한 방식이다. [p.9]","source":"2장 p.9","difficulty":"표준"},
  {"id":"umwut4zqspvh3","category":"한글 패키지","question":"한글 패키지는 Korean을 설치하면 재로그인이나 로그아웃 없이 즉시 적용된다.","answer":false,"explanation":"Region & Language / Manage Installed Languages에서 Korean을 설치한 뒤 재로그인/로그아웃 등으로 적용한다. [p.21~22]","source":"2장 p.21~22","difficulty":"기초"},
  {"id":"umwut4zqty3xu","category":"공유 폴더","question":"새 공유 폴더를 추가할 때 '자동 마운트' 항목을 체크한다.","answer":true,"explanation":"새 공유 폴더 추가 시 폴더 경로 선택, 자동 마운트 체크, 마운트 지점 입력, 항상 사용하기 체크를 한다. [p.23~24]","source":"2장 p.23~24","difficulty":"기초"},
];
