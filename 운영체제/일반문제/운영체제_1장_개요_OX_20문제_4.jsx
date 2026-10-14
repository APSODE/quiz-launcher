// 운영체제_1장_개요_OX_20문제_4.jsx
const META = { group: "운영체제", unit: "1장", title: "개요 OX 20문제 (4)", topic: "MS-DOS · OS 구성 · OS 역사 · OS 역할" };

const OX_QUESTIONS = [
  { category: "유닉스", question: "유닉스는 다중 사용자와 다중 작업을 지원하며 모듈식 설계와 파일 시스템 계층 구조를 갖는다.", answer: true, explanation: "휴대성이 높아 여러 하드웨어로 이식되었다." },
  { category: "OS 역사", question: "멀티 프로그래밍은 한 번에 하나의 프로그램만 메모리에 올리는 방식이다.", answer: false, explanation: "여러 프로그램을 동시에 메모리에 올린다." },
  { category: "유닉스", question: "유닉스는 특정 하드웨어에서만 실행되도록 설계되어 이식성이 매우 낮다.", answer: false, explanation: "휴대성(이식성)이 높은 것이 특징이다." },
  { category: "OS 구성", question: "커널은 사용자에게 명령어 입력 창을 제공하는 인터페이스이다.", answer: false, explanation: "그것은 쉘의 역할이다." },
  { category: "OS 유형", question: "운영체제 유형은 단일 사용자 운영체제 한 가지뿐이다.", answer: false, explanation: "다중 사용자, 실시간, 분산 운영체제 등이 있다." },
  { category: "OS 역사", question: "운영체제는 일괄 처리에서 멀티 프로그래밍, 시분할, 모바일·클라우드·가상화 순으로 발전해 왔다.", answer: true, explanation: "각 단계는 자원 활용도와 사용 편의를 높이는 방향이다." },
  { category: "OS 구성", question: "커널은 하드웨어와 직접 맞닿아 프로세스·메모리·장치·파일 시스템 관리를 담당한다.", answer: true, explanation: "커널은 운영체제의 핵심이다." },
  { category: "시스템 소프트웨어", question: "장치 드라이버는 사용자가 직접 문서를 작성하는 데 쓰는 응용 소프트웨어이다.", answer: false, explanation: "장치 드라이버는 하드웨어를 제어하게 해 주는 시스템 소프트웨어이다." },
  { category: "윈도우", question: "윈도우는 소스 코드가 공개된 오픈 소스 운영체제이다.", answer: false, explanation: "리눅스가 오픈 소스이며 윈도우는 상용 운영체제이다." },
  { category: "운영 방식", question: "경성 실시간 시스템은 마감 시간을 어기면 치명적인 결과가 생길 수 있는 시스템이다.", answer: true, explanation: "연성 실시간은 마감을 어겨도 품질이 저하될 뿐이다." },
  { category: "리눅스", question: "리눅스는 배포판이 하나뿐이라 환경에 따라 선택할 수 없다.", answer: false, explanation: "우분투, 데비안 등 다양한 배포판이 있다." },
  { category: "OS 구성", question: "쉘은 사용자의 명령을 받아 커널에 전달하는 사용자 인터페이스 구성요소이다.", answer: true, explanation: "쉘은 CLI나 GUI 형태일 수 있다." },
  { category: "커널", question: "모놀리식 커널은 대부분의 운영체제 서비스가 하나의 커널 안에 모여 있는 구조이다.", answer: true, explanation: "구조가 단순하고 빠르지만 한 모듈의 오류가 전체에 영향을 줄 수 있다." },
  { category: "MS-DOS", question: "MS-DOS는 마우스로 아이콘을 눌러 조작하는 GUI 운영체제이다.", answer: false, explanation: "MS-DOS는 CLI이다." },
  { category: "OS 역할", question: "운영체제의 역할은 응용 프로그램 개발만을 지원하는 것이고 자원 관리는 포함되지 않는다.", answer: false, explanation: "자원 관리가 가장 핵심적인 역할이다." },
  { category: "커널", question: "커널의 역할에는 프로세스 관리, 메모리 관리, 장치 관리, 파일 시스템 관리, 시스템 호출 처리가 있다.", answer: true, explanation: "그 밖에 보안 및 보호도 담당한다." },
  { category: "커널", question: "하이브리드 커널은 모놀리식과 마이크로커널의 장점을 절충한 구조이다.", answer: true, explanation: "현대 운영체제에 널리 쓰인다." },
  { category: "유닉스", question: "BSD, System V, 리눅스, macOS는 유닉스 계열의 영향을 받은 운영체제이다.", answer: true, explanation: "유닉스는 많은 OS의 뿌리가 되었다." },
  { category: "OS 역사", question: "일괄 처리 시스템은 여러 프로그램을 동시에 메모리에 올려 번갈아 실행한다.", answer: false, explanation: "그것은 멀티 프로그래밍이다." },
  { category: "안드로이드", question: "안드로이드는 리눅스 커널을 기반으로 한 오픈 소스 모바일 운영체제이다.", answer: true, explanation: "다양한 기기를 지원하지만 버전 파편화 문제가 있다." },
];
