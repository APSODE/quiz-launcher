// 운영체제_1장_개요_모의고사_2회.jsx
const META = { group: "운영체제", unit: "1장", title: "개요 모의고사 2회", topic: "객관식 6 · OX 3 · 단답형 3" };

const QUESTIONS = [
  { category: "OS 구성", question: "운영체제의 구성요소 중 사용자와 커널 사이에서 명령을 전달하는 것은?", choices: ["쉘", "스케줄러", "메모리 관리자", "장치 드라이버"], answer: 0, explanation: "쉘(인터페이스)이 사용자 명령을 커널에 전달한다." },
  { category: "MS-DOS", question: "MS-DOS의 인터페이스 방식은?", choices: ["터치 UI", "GUI", "CLI", "음성 UI"], answer: 2, explanation: "명령줄 인터페이스를 사용한다." },
  { category: "운영 방식", question: "마감 시간을 지키는 것이 핵심인 운영 방식은?", choices: ["실시간 시스템", "일괄 처리 시스템", "시분할 시스템", "분산 처리 시스템"], answer: 0, explanation: "실시간 시스템은 주어진 시간 안에 작업을 완료해야 한다." },
  { category: "운영 방식", question: "IaaS, PaaS, SaaS를 제공하는 컴퓨팅 방식은?", choices: ["일괄 처리", "클라우드 컴퓨팅", "가상화", "시분할 처리"], answer: 1, explanation: "클라우드 컴퓨팅의 서비스 모델이다." },
  { category: "시스템 소프트웨어", question: "다음 중 시스템 소프트웨어가 아닌 것은?", choices: ["장치 드라이버", "운영체제", "워드프로세서", "유틸리티"], answer: 2, explanation: "워드프로세서는 응용 소프트웨어이다." },
  { category: "안드로이드", question: "안드로이드의 대표적인 단점은?", choices: ["앱 생태계", "리눅스 커널 기반", "오픈 소스", "파편화"], answer: 3, explanation: "기기·버전이 다양해 파편화가 발생한다." },
  { category: "OS 목표", question: "운영체제는 효율성 향상을 위해 보안과 안정성은 희생해야 한다.", answer: false, explanation: "안정성과 신뢰성, 보안 및 보호도 운영체제의 목표이다." },
  { category: "iOS", question: "iOS는 오픈 소스이고 다양한 제조사의 기기에서 자유롭게 설치해 쓸 수 있다.", answer: false, explanation: "iOS는 애플 기기 전용이다." },
  { category: "운영 방식", question: "가상화는 하나의 물리 자원 위에 여러 개의 가상 환경을 만들어 쓰는 기술이다.", answer: true, explanation: "가상 머신 등이 이에 해당한다." },
  { category: "OS 구성", question: "운영체제를 구성하는 두 요소 중 하드웨어와 직접 맞닿는 핵심 부분은 무엇인가?", answers: ["커널", "kernel", "커넬"], displayAnswer: "커널", explanation: "다른 한 요소는 쉘(인터페이스)이다." },
  { category: "안드로이드", question: "안드로이드 기기와 OS 버전이 다양해 업데이트와 호환이 일관되지 않는 문제는?", answers: ["파편화", "fragmentation"], displayAnswer: "파편화", explanation: "안드로이드의 대표적 단점이다." },
  { category: "시스템 소프트웨어", question: "디스크 정리, 백신처럼 시스템 관리를 돕는 보조 프로그램은 무엇인가?", answers: ["유틸리티", "utility", "유틸리티 프로그램"], displayAnswer: "유틸리티", explanation: "시스템 소프트웨어의 하나이다." },
];
