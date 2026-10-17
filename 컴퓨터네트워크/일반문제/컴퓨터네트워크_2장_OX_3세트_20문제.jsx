// 컴퓨터네트워크_2장_OX_3세트_20문제.jsx
// 근거: 수업자료 Chapter 2 Application Layer (응용 원리, SMTP/POP3/IMAP, DNS)
const META = {
  group: "컴퓨터네트워크",
  unit: "2장",
  title: "2장 응용 계층 OX 3세트 20문제"
};

const OX_QUESTIONS = [
  {
    category: "응용 구조",
    question: "클라이언트-서버 구조에서 클라이언트는 간헐적으로 연결될 수 있고 동적 IP 주소를 가질 수 있다.",
    answer: true,
    explanation: "서버는 항상 켜져 있고 영구 IP를 가지지만 클라이언트는 그렇지 않을 수 있다."
  },
  {
    category: "응용 구조",
    question: "P2P 구조에서도 항상 켜져 있는 서버가 모든 요청을 처리한다.",
    answer: false,
    explanation: "P2P는 항상 켜져 있는 서버 없이 임의의 종단 시스템들이 직접 통신한다."
  },
  {
    category: "전송 서비스 요구",
    question: "인터넷 전화나 대화형 게임 같은 응용은 효과적으로 동작하려면 낮은 지연이 필요하다.",
    answer: true,
    explanation: "이런 응용은 타이밍(지연)에 민감하다."
  },
  {
    category: "전송 서비스 요구",
    question: "이메일과 웹 문서는 데이터 손실을 어느 정도 허용하는 응용이다.",
    answer: false,
    explanation: "파일 전송, 이메일, 웹 문서는 손실이 없어야 한다(no loss)."
  },
  {
    category: "전송 프로토콜",
    question: "TCP는 클라이언트와 서버 프로세스 사이에 연결 설정이 필요한 연결 지향 서비스이다.",
    answer: true,
    explanation: "TCP는 connection-oriented이다."
  },
  {
    category: "전송 프로토콜",
    question: "UDP는 신뢰적 전송을 제공하지 않지만 데이터 전송 전에 연결 설정은 반드시 거쳐야 한다.",
    answer: false,
    explanation: "UDP는 연결 설정도 제공하지 않는다. 비연결형이다."
  },
  {
    category: "SMTP",
    question: "SMTP에서는 송신 메일 서버가 수신 메일 서버로 직접 메시지를 전송한다.",
    answer: true,
    explanation: "direct transfer: sending server to receiving server."
  },
  {
    category: "SMTP",
    question: "SMTP는 핸드셰이킹, 메시지 전송, 종료의 3단계로 동작하며 명령은 ASCII 텍스트, 응답은 상태 코드와 문구로 이루어진다.",
    answer: true,
    explanation: "HTTP처럼 명령/응답 상호작용 방식이다."
  },
  {
    category: "SMTP",
    question: "Alice가 Bob에게 메일을 보낼 때 Alice의 사용자 에이전트가 Bob의 메일 서버와 직접 TCP 연결을 연다.",
    answer: false,
    explanation: "Alice의 UA는 자신의 메일 서버로 보내고, Alice 메일 서버의 SMTP 클라이언트가 Bob의 메일 서버와 TCP 연결을 연다."
  },
  { category: "SMTP와 HTTP", question: "SMTP는 HTTP처럼 수신 측이 서버에서 메일을 끌어오는 pull 방식이다.",
    answer: false,
    explanation: "HTTP는 pull, SMTP는 송신 측이 밀어 넣는 push 방식이다." },
  {
    category: "SMTP와 HTTP",
    question: "HTTP는 각 객체를 별도의 응답 메시지에 담아 전송한다.",
    answer: true,
    explanation: "반면 SMTP는 여러 객체를 multipart 메시지 하나에 담아 보낸다."
  },
  {
    category: "SMTP와 HTTP",
    question: "SMTP는 하나의 메시지에 한 개의 객체만 담을 수 있다.",
    answer: false,
    explanation: "SMTP는 여러 객체를 multipart 메시지로 보낼 수 있다."
  },
  {
    category: "MIME",
    question: "multipart 메시지에서는 boundary 문자열로 각 부분을 구분한다.",
    answer: true,
    explanation: "Content-Type: multipart/mixed; boundary=... 형식이다."
  },
  { category: "POP3", question: "POP3의 download-and-delete 모드에서는 메시지를 내려받은 뒤 서버에서 지운다.",
    answer: true,
    explanation: "download-and-delete는 내려받고 서버에서 지우므로 클라이언트를 바꾸면 이미 받은 메일을 다시 읽을 수 없다." },
  {
    category: "POP3",
    question: "POP3는 세션 사이에 상태를 유지하지 않는다(stateless across sessions).",
    answer: true,
    explanation: "IMAP은 폴더 구성과 메시지-폴더 매핑을 세션 간에도 유지한다."
  },
  {
    category: "메일 접근",
    question: "gmail 같은 웹메일은 HTTP를 이용해 메일을 읽는다.",
    answer: true,
    explanation: "메일 접근 프로토콜에는 POP, IMAP 외에 HTTP도 있다."
  },
  {
    category: "IMAP",
    question: "IMAP은 폴더 이름과 메시지 ID의 대응을 세션 간에 유지하지 못한다.",
    answer: false,
    explanation: "IMAP은 사용자 상태(폴더 이름과 메시지 ID 대응)를 세션 간에 유지한다."
  },
  {
    category: "DNS",
    question: "루트 이름 서버는 전 세계에 13대의 물리 서버만 존재한다.",
    answer: false,
    explanation: "13개의 논리적 루트 서버가 있으며 각각이 전 세계에 여러 번 복제되어 있다."
  },
  {
    category: "DNS",
    question: "TLD 서버 정보는 로컬 이름 서버에 캐시되지 않으므로 루트 서버는 매번 방문된다.",
    answer: false,
    explanation: "TLD 서버 정보가 로컬 이름 서버에 캐시되므로 루트 서버는 자주 방문되지 않는다."
  },
  {
    category: "DNS",
    question: "DNS 캐시 항목은 항상 최신 정보임이 보장된다.",
    answer: false,
    explanation: "캐시 항목은 오래될 수 있고, 호스트의 IP가 바뀌면 모든 TTL이 만료될 때까지 알려지지 않을 수 있다(best effort)."
  },
];
