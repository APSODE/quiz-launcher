// 운영체제_1장_개요_단답형_15문제_4.jsx
const META = { group: "운영체제", unit: "1장", title: "개요 단답형 15문제 (4)", topic: "유닉스 · iOS · 윈도우 · 시스템 소프트웨어" };

const SA_QUESTIONS = [
  { category: "유닉스", question: "유닉스가 작은 도구를 조합해 쓰는 구조를 갖는다는 특징을 두 글자로 줄여 부르면? (○○식 설계)", answers: ["모듈", "모듈식", "모듈식 설계", "modular"], displayAnswer: "모듈식 설계", explanation: "기능이 독립 모듈로 나뉜다." },
  { category: "iOS", question: "애플 기기 전용으로 하드웨어·소프트웨어·서비스가 통합된 환경을 흔히 무엇이라 하는가?", answers: ["애플 생태계", "생태계", "apple ecosystem", "ecosystem"], displayAnswer: "애플 생태계", explanation: "일관된 사용자 경험이 장점이다." },
  { category: "윈도우", question: "윈도우의 장점으로 가장 널리 꼽히는, 여러 소프트웨어와 하드웨어를 지원하는 성질은?", answers: ["호환성", "compatibility"], displayAnswer: "호환성", explanation: "소프트웨어·하드웨어 호환성이 장점이다." },
  { category: "시스템 소프트웨어", question: "컴퓨터에 내장되어 하드웨어 기본 동작을 제어하는 저수준 소프트웨어로, ROM 등에 저장되는 것은?", answers: ["펌웨어", "firmware"], displayAnswer: "펌웨어", explanation: "시스템 소프트웨어의 하나이다." },
  { category: "OS 역사", question: "초기에 작업을 모아 두었다가 한 번에 처리하던 시스템은?", answers: ["일괄 처리 시스템", "일괄처리시스템", "배치 처리 시스템", "배치 처리", "batch processing system", "batch"], displayAnswer: "일괄 처리 시스템", explanation: "단일 CPU, 단일 프로그램 구조였다." },
  { category: "OS 유형", question: "여러 사용자가 동시에 사용할 수 있고 각 사용자가 여러 작업을 실행할 수 있는 운영체제 유형은?", answers: ["다중 사용자 운영체제", "다중 사용자", "다중사용자 운영체제", "multi-user os", "multi user os"], displayAnswer: "다중 사용자 운영체제", explanation: "유닉스와 리눅스가 대표적이다." },
  { category: "운영 방식", question: "여러 컴퓨터가 네트워크로 연결되어 작업을 나누어 처리하는 운영 방식은?", answers: ["분산 처리 시스템", "분산 시스템", "분산처리시스템", "분산 처리", "distributed system"], displayAnswer: "분산 처리 시스템", explanation: "분산 데이터베이스가 한 예이다." },
  { category: "리눅스", question: "소스 코드가 공개되어 누구나 수정하고 배포할 수 있는 소프트웨어 방식은?", answers: ["오픈 소스", "오픈소스", "open source", "opensource"], displayAnswer: "오픈 소스", explanation: "리눅스와 안드로이드가 해당한다." },
  { category: "OS 역할", question: "프로세스, 메모리, 파일 시스템, 디스크, 입출력 장치처럼 운영체제가 관리하는 대상을 통틀어 무엇이라 하는가?", answers: ["자원", "시스템 자원", "resource"], displayAnswer: "자원", explanation: "자원 관리가 운영체제의 핵심 역할이다." },
  { category: "운영 방식", question: "클라우드 서비스 모델 중 서버·스토리지·네트워크 같은 인프라를 제공하는 모델은? (영문 약자)", answers: ["IaaS", "iaas", "Infrastructure as a Service"], displayAnswer: "IaaS", explanation: "SaaS는 소프트웨어, PaaS는 플랫폼." },
  { category: "커널", question: "응용 프로그램이 하드웨어 자원을 직접 관리하도록 커널의 추상화를 최소화한 커널 구조는?", answers: ["엑소커널", "exokernel", "엑소 커널"], displayAnswer: "엑소커널", explanation: "마이크로커널보다도 커널 기능을 더 줄인 구조이다." },
  { category: "OS 구성", question: "키보드 명령어로 조작하는 인터페이스를 영문 약자로 무엇이라 하는가?", answers: ["CLI", "command line interface", "명령줄 인터페이스", "커맨드 라인 인터페이스"], displayAnswer: "CLI", explanation: "그래픽 방식은 GUI이다." },
  { category: "운영 방식", question: "클라우드 서비스 모델 중 완성된 소프트웨어를 서비스로 제공하는 모델의 영문 약자는?", answers: ["SaaS", "saas", "Software as a Service"], displayAnswer: "SaaS", explanation: "IaaS는 인프라, PaaS는 플랫폼이다." },
  { category: "OS 목표", question: "운영체제가 다른 하드웨어나 규모에서도 쓰일 수 있게 하는 목표를 이동성과 무엇이라 하는가?", answers: ["확장성", "scalability", "extensibility"], displayAnswer: "확장성", explanation: "이동성 및 확장성이 목표이다." },
  { category: "OS 유형", question: "한 사용자가 여러 프로그램을 동시에 실행할 수 있는 운영체제 유형을 사용자 수와 작업 수로 나타내면?", answers: ["단일 사용자 다중 작업", "단일사용자 다중작업", "단일 사용자 다중 작업 운영체제"], displayAnswer: "단일 사용자 다중 작업", explanation: "사용자 수(단일/다중)와 동시 작업 수(단일/다중)로 구분한다." },
];
