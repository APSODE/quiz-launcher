// 운영체제_1장_개요_OX_20문제_3.jsx
const META = { group: "운영체제", unit: "1장", title: "개요 OX 20문제 (3)", topic: "MS-DOS · OS 목표 · OS 유형 · macOS" };

const OX_QUESTIONS = [
  { category: "유닉스", question: "유닉스는 한 번에 한 사용자만 사용할 수 있는 운영체제이다.", answer: false, explanation: "다중 사용자를 지원한다." },
  { category: "운영 방식", question: "분산 처리 시스템은 반드시 하나의 컴퓨터 안에서만 동작한다.", answer: false, explanation: "여러 컴퓨터가 네트워크로 협력한다." },
  { category: "운영 방식", question: "시분할 시스템은 CPU 시간을 짧게 나누어 여러 사용자가 동시에 쓰는 것처럼 보이게 한다.", answer: true, explanation: "대화형 처리에 적합하다." },
  { category: "리눅스", question: "리눅스는 오픈 소스이므로 다양한 배포판이 존재하고 서버 환경에서도 널리 쓰인다.", answer: true, explanation: "안정성과 보안, 유연성이 장점이다." },
  { category: "시스템 소프트웨어", question: "운영체제는 하드웨어와 응용 소프트웨어 사이에서 자원을 관리하는 시스템 소프트웨어이다.", answer: true, explanation: "운영체제는 하드웨어 자원을 관리하고 응용 프로그램이 이를 쓸 수 있게 중개한다." },
  { category: "MS-DOS", question: "MS-DOS는 명령줄 인터페이스를 사용하는 단일 사용자, 단일 작업 운영체제이다.", answer: true, explanation: "GUI를 제공하는 것은 이후의 윈도우이다." },
  { category: "운영 방식", question: "일괄 처리 시스템은 사용자가 실행 중에 대화하듯 명령을 입력하는 방식이다.", answer: false, explanation: "대화형은 시분할 시스템의 특징이다." },
  { category: "운영 방식", question: "연성 실시간 시스템은 마감 시간을 어기면 반드시 시스템이 실패한 것으로 본다.", answer: false, explanation: "엄격히 그렇게 보는 것은 경성 실시간이다." },
  { category: "운영 방식", question: "일괄 처리 시스템은 작업을 모아서 한꺼번에 처리하며 처리 도중 사용자 개입이 거의 없다.", answer: true, explanation: "초기 컴퓨터의 대표적인 운영 방식이다." },
  { category: "운영 방식", question: "시분할 시스템은 마감 시간 내 처리를 보장하는 것이 가장 중요한 목표이다.", answer: false, explanation: "마감 시간 보장은 실시간 시스템의 목표이다." },
  { category: "시스템 소프트웨어", question: "유틸리티와 장치 드라이버도 시스템 소프트웨어에 속한다.", answer: true, explanation: "시스템 소프트웨어에는 운영체제, 유틸리티, 장치 드라이버, 펌웨어 등이 있다." },
  { category: "OS 유형", question: "사용자 수와 동시 작업 수에 따라 단일 사용자 단일 작업, 단일 사용자 다중 작업, 다중 사용자 운영체제로 구분할 수 있다.", answer: true, explanation: "실시간 운영체제와 분산 운영체제도 별도 유형이다." },
  { category: "커널", question: "마이크로커널은 최소한의 핵심 기능만 커널에 두고 나머지 서비스는 분리하는 구조이다.", answer: true, explanation: "모놀리식 커널과 대비된다." },
  { category: "안드로이드", question: "안드로이드는 기기가 한 종류뿐이라 파편화 문제가 없다.", answer: false, explanation: "기기와 버전이 다양해 파편화 문제가 있다." },
  { category: "OS 목표", question: "운영체제의 목표에는 사용자 편의성 향상과 효율적 자원 관리가 포함된다.", answer: true, explanation: "안정성, 보안, 이동성과 확장성도 목표이다." },
  { category: "운영 방식", question: "SaaS는 개발자가 서버와 네트워크를 직접 구성하게 하는 클라우드 모델이다.", answer: false, explanation: "그것은 IaaS에 가깝다. SaaS는 완성된 소프트웨어를 제공한다." },
  { category: "운영 방식", question: "클라우드 컴퓨팅은 자원을 반드시 사용자 로컬 컴퓨터에 설치해 쓰는 방식이다.", answer: false, explanation: "인터넷을 통해 서비스 형태로 자원을 제공한다." },
  { category: "macOS", question: "macOS는 유닉스 기반 운영체제로 애플 생태계와 통합되어 있다.", answer: true, explanation: "그래픽 사용자 인터페이스를 제공한다." },
  { category: "MS-DOS", question: "MS-DOS는 여러 사용자가 동시에 접속해 쓰는 다중 사용자 운영체제이다.", answer: false, explanation: "단일 사용자, 단일 작업이다." },
  { category: "커널", question: "시스템 호출은 커널이 사용자 프로그램에 자원을 강제로 반납시키는 절차이다.", answer: false, explanation: "시스템 호출은 사용자 프로그램이 커널 기능을 요청하는 통로이다." },
];
