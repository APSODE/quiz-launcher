// 운영체제_1장_개요_단답형_15문제_3.jsx
const META = { group: "운영체제", unit: "1장", title: "개요 단답형 15문제 (3)", topic: "리눅스 · 시스템 소프트웨어 · MS-DOS · OS 목표" };

const SA_QUESTIONS = [
  { category: "리눅스", question: "같은 리눅스 커널을 바탕으로 여러 구성을 묶어 배포한 형태를 무엇이라 하는가?", answers: ["배포판", "리눅스 배포판", "distribution", "distro"], displayAnswer: "배포판", explanation: "우분투, 데비안 등이 있다." },
  { category: "시스템 소프트웨어", question: "사용자가 직접 쓰는 문서 작성, 게임 같은 프로그램은 어떤 유형의 소프트웨어인가?", answers: ["응용 소프트웨어", "응용소프트웨어", "애플리케이션", "application software", "응용 프로그램"], displayAnswer: "응용 소프트웨어", explanation: "시스템 소프트웨어 위에서 사용자의 특정 목적을 수행한다." },
  { category: "MS-DOS", question: "MS-DOS처럼 한 번에 한 사용자가 한 작업만 실행하는 운영체제 유형은?", answers: ["단일 사용자 단일 작업", "단일 사용자 및 단일 작업", "단일사용자 단일작업", "single user single task"], displayAnswer: "단일 사용자 단일 작업", explanation: "명령줄 인터페이스를 사용한다." },
  { category: "OS 목표", question: "운영체제 목표 중 시스템 오류나 고장에도 정상 동작을 유지하는 성질을 두 단어로 쓰면? (안정성과 ○○)", answers: ["신뢰성", "reliability"], displayAnswer: "신뢰성", explanation: "안정성과 신뢰성이 목표이다." },
  { category: "운영 방식", question: "마감 시간 안에 반드시 작업을 끝내야 하는 운영 방식으로, 경성과 연성으로 나뉘는 것은?", answers: ["실시간 시스템", "실시간 처리 시스템", "실시간", "real-time system", "real time system", "RTOS"], displayAnswer: "실시간 시스템", explanation: "마감 준수가 핵심이다." },
  { category: "OS 역사", question: "메모리에 여러 프로그램을 올려 한 프로그램이 입출력을 기다릴 때 다른 프로그램이 CPU를 쓰게 하는 방식은?", answers: ["멀티 프로그래밍", "멀티프로그래밍", "다중 프로그래밍", "multiprogramming"], displayAnswer: "멀티 프로그래밍", explanation: "CPU 유휴 시간을 줄인다." },
  { category: "OS 구성", question: "쉘이라고도 불리는, 운영체제에서 사용자 인터페이스를 담당하는 구성요소를 한글로 무엇이라 하는가?", answers: ["인터페이스", "사용자 인터페이스", "쉘", "셸"], displayAnswer: "인터페이스(쉘)", explanation: "커널과 사용자 사이에 위치한다." },
  { category: "유닉스", question: "유닉스가 여러 종류의 하드웨어에 옮겨 쓰기 쉬운 성질을 무엇이라 하는가?", answers: ["휴대성", "이식성", "portability"], displayAnswer: "휴대성(이식성)", explanation: "유닉스의 장점 중 하나이다." },
  { category: "커널", question: "응용 프로그램이 하드웨어 자원을 쓰기 위해 커널에 서비스를 요청하는 통로는?", answers: ["시스템 호출", "시스템호출", "시스템 콜", "시스템콜", "system call"], displayAnswer: "시스템 호출", explanation: "커널이 처리해 결과를 돌려준다." },
  { category: "운영 방식", question: "하나의 물리 자원 위에 여러 개의 독립된 가상 환경을 만들어 쓰는 기술은?", answers: ["가상화", "virtualization", "가상화 시스템"], displayAnswer: "가상화", explanation: "가상 머신이 대표적이다." },
  { category: "OS 구성", question: "아이콘과 창을 마우스로 조작하는 그래픽 기반 인터페이스를 영문 약자로 무엇이라 하는가?", answers: ["GUI", "graphical user interface", "그래픽 사용자 인터페이스"], displayAnswer: "GUI", explanation: "CLI와 대비된다." },
  { category: "커널", question: "커널의 구성 중 프로세스 생성·스케줄링·종료를 맡는 부분은 무엇인가?", answers: ["프로세스 관리자", "프로세스관리자", "process manager", "프로세스 관리"], displayAnswer: "프로세스 관리자", explanation: "메모리 관리자, 장치 관리자 등과 함께 커널을 구성한다." },
  { category: "커널", question: "대부분의 서비스가 하나의 커널 안에 모여 있어 빠르지만 한 모듈의 오류가 전체에 영향을 줄 수 있는 커널 구조는?", answers: ["모놀리식 커널", "모놀리식", "모놀리틱", "모놀리틱 커널", "monolithic", "monolithic kernel"], displayAnswer: "모놀리식 커널", explanation: "마이크로커널과 대비된다." },
  { category: "유닉스", question: "유닉스의 특징 중 하나의 시스템을 여러 사람이 동시에 쓸 수 있는 성질은?", answers: ["다중 사용자", "멀티 유저", "멀티유저", "multi-user", "multi user", "다중사용자"], displayAnswer: "다중 사용자(Multi-User)", explanation: "다중 작업(Multi-Tasking)도 지원한다." },
  { category: "안드로이드", question: "안드로이드가 기반으로 하는 커널은 무엇인가?", answers: ["리눅스 커널", "리눅스", "linux kernel", "linux"], displayAnswer: "리눅스 커널", explanation: "오픈 소스 모바일 운영체제이다." },
];
