// 운영체제_1장_개요_기출스타일_1회.jsx
const META = { group: "운영체제", unit: "1장", title: "개요 기출 스타일 1회", topic: "작년 기출 형식(단답·OX)을 본뜬 생성 문제" };

const QUESTIONS = [
  { category: "운영 방식", question: "클라우드 서비스 모델 중 개발·배포 플랫폼을 제공하는 모델은? (영문 약자)", answers: ["PaaS", "paas", "Platform as a Service"], displayAnswer: "PaaS", explanation: "애플리케이션 개발에 집중하게 해 준다." },
  { category: "운영 방식", question: "인터넷을 통해 컴퓨팅 자원을 서비스 형태로 빌려 쓰는 방식은?", answers: ["클라우드 컴퓨팅", "클라우드컴퓨팅", "클라우드", "cloud computing"], displayAnswer: "클라우드 컴퓨팅", explanation: "SaaS, PaaS, IaaS로 나뉜다." },
  { category: "운영 방식", question: "경성 실시간 시스템의 영문 표기 중 'Hard'에 해당하는 한글은?", answers: ["경성", "경성 실시간", "경성 실시간 시스템", "hard"], displayAnswer: "경성", explanation: "연성(Soft)과 구분한다." },
  { category: "운영 방식", question: "일괄 처리와 달리 사용자가 실행 중에 명령을 입력하며 즉시 응답을 받는 방식을 가리키는 말은?", answers: ["대화형", "대화형 처리", "대화형 시스템", "interactive", "interactive system"], displayAnswer: "대화형(Interactive)", explanation: "시분할 시스템이 이를 가능하게 한다." },
  { category: "OS 역할", question: "운영체제가 없으면 응용 프로그램이 하드웨어를 직접 제어해야 하므로 자원 사용이 비효율적이고 충돌 위험이 커진다.", answer: true, explanation: "운영체제는 효율적 자원 사용과 안정성을 제공한다." },
  { category: "macOS", question: "macOS는 윈도우 기반으로 만들어진 운영체제이다.", answer: false, explanation: "macOS는 유닉스 기반이다." },
  { category: "OS 역사", question: "멀티 프로그래밍은 한 CPU에서 여러 프로그램을 메모리에 올려 CPU 유휴 시간을 줄이는 방식이다.", answer: true, explanation: "한 프로그램이 입출력을 기다릴 때 다른 프로그램이 CPU를 쓴다." },
  { category: "커널", question: "커널 유형은 모놀리식 커널 한 가지뿐이다.", answer: false, explanation: "마이크로커널, 하이브리드 커널, 엑소커널도 있다." },
];
