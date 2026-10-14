// 운영체제_1장_개요_기출스타일_2회.jsx
const META = { group: "운영체제", unit: "1장", title: "개요 기출 스타일 2회", topic: "작년 기출 형식(단답·OX)을 본뜬 생성 문제" };

const QUESTIONS = [
  { category: "운영 방식", question: "마감 시간을 어겨도 결과 품질이 떨어질 뿐 치명적이지는 않은 실시간 시스템은 무엇인가?", answers: ["연성 실시간 시스템", "연성 실시간", "연성", "soft real-time", "soft real time", "soft"], displayAnswer: "연성 실시간 시스템", explanation: "마감을 어기면 치명적인 것은 경성 실시간 시스템이다." },
  { category: "커널", question: "메모리 할당과 회수를 담당하는 커널 구성요소는?", answers: ["메모리 관리자", "메모리관리자", "memory manager", "메모리 관리"], displayAnswer: "메모리 관리자", explanation: "프로세스 관리자와 함께 커널을 구성한다." },
  { category: "커널", question: "모놀리식 커널과 대비되며 서비스를 사용자 영역 서버로 분리하는 커널은?", answers: ["마이크로커널", "마이크로 커널", "microkernel"], displayAnswer: "마이크로커널", explanation: "안정성이 높지만 서비스 간 통신 오버헤드가 생긴다." },
  { category: "운영 방식", question: "한 CPU의 시간을 짧게 나누어 여러 사용자가 동시에 쓰는 것처럼 보이게 하는 운영 방식은?", answers: ["시분할 시스템", "시분할", "시분할 처리 시스템", "time sharing", "time sharing system"], displayAnswer: "시분할 시스템", explanation: "대화형 처리에 적합하다." },
  { category: "운영 방식", question: "IaaS는 서버·스토리지 같은 인프라를, SaaS는 완성된 소프트웨어를 서비스 형태로 제공한다.", answer: true, explanation: "PaaS는 개발·실행 플랫폼을 제공한다." },
  { category: "커널", question: "마이크로커널은 모든 운영체제 서비스를 하나의 커널 안에 모아 둔 구조이다.", answer: false, explanation: "그것은 모놀리식 커널이다." },
  { category: "윈도우", question: "윈도우는 사용자 친화적인 GUI와 폭넓은 소프트웨어·하드웨어 호환성을 장점으로 한다.", answer: true, explanation: "보안 취약점 공격이 많은 점은 단점으로 꼽힌다." },
  { category: "안드로이드", question: "안드로이드는 윈도우 NT 커널을 기반으로 한다.", answer: false, explanation: "리눅스 커널 기반이다." },
];
