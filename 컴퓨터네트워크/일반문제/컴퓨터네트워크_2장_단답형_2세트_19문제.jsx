// 컴퓨터네트워크_2장_단답형_2세트_19문제.jsx
// 근거: 수업자료 Chapter 2 Application Layer (응용 원리, SMTP/POP3/IMAP, DNS)
const META = {
  group: "컴퓨터네트워크",
  unit: "2장",
  title: "2장 응용 계층 단답형 2세트 19문제"
};

const SA_QUESTIONS = [
  {
    category: "응용 구조",
    question: "항상 켜져 있고 영구적인 IP 주소를 가지며 확장을 위해 데이터 센터를 사용하는 쪽은 클라이언트와 (    ) 중 어느 쪽인가?",
    answers: ["서버", "server"],
    displayAnswer: "서버",
    explanation: "클라이언트-서버 구조의 서버는 always-on host다."
  },
  {
    category: "응용 구조",
    question: "P2P에서 새 피어가 서비스 수요뿐 아니라 서비스 용량도 가져오는 성질을 무엇이라 하는가?",
    answers: ["자가 확장성", "자가확장성", "자체 확장성", "자기 확장성", "self scalability", "self-scalability", "selfscalability"],
    displayAnswer: "자가 확장성(Self scalability)",
    explanation: "새 피어는 새로운 서비스 용량과 새로운 서비스 수요를 함께 가져온다."
  },
  {
    category: "전송 서비스",
    question: "파일 전송처럼 100% 신뢰성이 필요한 응용이 요구하는 전송 서비스 요소는?",
    answers: ["데이터 무결성", "무결성", "data integrity", "integrity", "데이터무결성"],
    displayAnswer: "데이터 무결성(Data integrity)",
    explanation: "응용이 필요로 하는 전송 서비스는 데이터 무결성, 타이밍, 처리율, 보안이다."
  },
  {
    category: "TCP 서비스",
    question: "송신자가 수신자를 압도하지 않도록 하는 TCP 서비스는?",
    answers: ["흐름 제어", "흐름제어", "flow control"],
    displayAnswer: "흐름 제어(Flow control)",
    explanation: "TCP는 흐름 제어와 혼잡 제어를 제공한다."
  },
  {
    category: "TCP 서비스",
    question: "네트워크가 과부하일 때 송신자를 늦추는 TCP 서비스는?",
    answers: ["혼잡 제어", "혼잡제어", "congestion control"],
    displayAnswer: "혼잡 제어(Congestion control)",
    explanation: "혼잡 제어는 네트워크 과부하 시 송신자 속도를 줄인다."
  },
  {
    category: "이메일",
    question: "메일을 작성, 편집, 읽는 메일 리더 프로그램(Outlook, Thunderbird 등)을 무엇이라 하는가?",
    answers: ["사용자 에이전트", "유저 에이전트", "user agent", "ua", "사용자에이전트"],
    displayAnswer: "사용자 에이전트(User Agent)",
    explanation: "user agent는 메일 리더이며 이메일의 세 구성 요소 중 하나다."
  },
  { category: "SMTP", question: "SMTP 메시지(헤더와 본문)는 몇 비트 ASCII여야 하는가? (숫자만 입력)",
    answers: ["7", "7비트", "7 비트", "7bit", "7-bit"],
    displayAnswer: "7",
    hint: "8보다 하나 작음",
    explanation: "SMTP 메시지는 7-bit ASCII여야 하므로 이진 데이터는 MIME(Base64 등)으로 인코딩해야 한다." },
  { category: "이메일", question: "이메일 시스템의 세 가지 주요 구성 요소는 사용자 에이전트, 메일 서버, 그리고 무엇인가? (약어)",
    answers: ["smtp", "simple mail transfer protocol"],
    displayAnswer: "SMTP",
    hint: "메일 서버 사이 전송 프로토콜",
    explanation: "메일 3요소: user agent, mail server, SMTP." },
  { category: "이메일", question: "메일 서버에서 아직 보내지 못한(보낼) 메시지를 담아 두는 곳은? (영어 두 단어 또는 한글)",
    answers: ["message queue", "메시지 큐", "메시지큐", "메세지 큐", "메세지큐", "송신 큐", "messagequeue"],
    displayAnswer: "message queue(메시지 큐)",
    hint: "queue",
    explanation: "mailbox = 사용자가 받은 메시지, message queue = 보낼 메시지." },
  {
    category: "SMTP와 HTTP",
    question: "HTTP는 pull 방식이고 SMTP는 어떤 방식인가?",
    answers: ["push", "푸시", "푸쉬"],
    displayAnswer: "push",
    explanation: "SMTP는 push, HTTP는 pull이다."
  },
  {
    category: "MIME",
    question: "MIME 헤더에서 데이터를 어떤 방식으로 인코딩했는지 나타내는 헤더 이름은?",
    answers: ["content-transfer-encoding", "content transfer encoding", "contenttransferencoding", "content-transfer-encoding:"],
    displayAnswer: "Content-Transfer-Encoding",
    explanation: "예: Content-Transfer-Encoding: base64."
  },
  {
    category: "MIME",
    question: "MIME 타입 중 msword, octet-stream 같은 하위 타입을 갖는 상위 타입은?",
    answers: ["application", "애플리케이션", "어플리케이션"],
    displayAnswer: "application",
    explanation: "application은 reader가 처리해야 볼 수 있는 기타 데이터를 가리킨다."
  },
  {
    category: "Base64",
    question: "Base64 표에서 값 62에 해당하는 문자는?",
    answers: ["+", "플러스", "더하기"],
    displayAnswer: "+",
    explanation: "값 62는 +, 63은 /이다."
  },
  { category: "POP3", question: "POP3가 세션 사이에 사용자 상태를 유지하지 않는 성질을 영어 한 단어로 쓰면?",
    answers: ["stateless", "스테이트리스", "무상태"],
    displayAnswer: "stateless",
    hint: "state가 없음",
    explanation: "POP3는 세션 간 stateless, IMAP은 세션 간 상태(폴더 등)를 유지한다." },
  { category: "메일 접근", question: "Gmail처럼 웹 브라우저에서 HTTP로 메일을 읽고 보내는 방식을 무엇이라 하는가?",
    answers: ["웹메일", "웹 메일", "webmail", "web mail", "web-based email", "웹기반 메일"],
    displayAnswer: "웹메일",
    hint: "web + mail",
    explanation: "메일 접근 프로토콜: POP3, IMAP, 그리고 웹메일은 HTTP." },
  {
    category: "DNS 레코드",
    question: "메일 서버의 이름을 알려 주는 DNS 레코드 타입은?",
    answers: ["mx", "mx 레코드", "mx record"],
    displayAnswer: "MX",
    explanation: "MX 레코드의 value는 이름과 연결된 메일 서버의 이름이다."
  },
  {
    category: "DNS 레코드",
    question: "호스트 이름을 IP 주소에 매핑하는 DNS 레코드 타입은?",
    answers: ["a", "a 레코드", "a record"],
    displayAnswer: "A",
    explanation: "A 레코드의 name은 호스트 이름이고 value는 IP 주소다."
  },
  {
    category: "DNS 레코드",
    question: "NS 레코드의 value는 어떤 서버의 호스트 이름인가? (서버 종류를 쓰시오)",
    answers: ["권한 있는 dns 서버", "권한있는 dns 서버", "권한 있는 이름 서버", "권한있는 이름서버", "권한 있는 네임 서버", "authoritative dns server", "authoritative name server", "authoritative", "권한 서버", "권한 있는 서버"],
    displayAnswer: "권한 있는(Authoritative) 이름 서버",
    explanation: "NS 레코드의 name은 도메인이고 value는 그 도메인의 권한 있는 이름 서버의 호스트 이름이다."
  },
  {
    category: "로컬 DNS",
    question: "DNS 계층 구조에 엄격히 속하지 않으며 default name server라고도 불리는 서버는?",
    answers: ["로컬 dns 서버", "로컬 dns", "로컬 네임 서버", "로컬 이름 서버", "local dns server", "local name server", "local dns"],
    displayAnswer: "로컬 DNS 서버",
    explanation: "각 ISP가 하나씩 가지며 질의를 계층 구조로 전달하는 프록시 역할을 한다."
  },
];
