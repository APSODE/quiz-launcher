// 컴퓨터네트워크_2장_단답형_3세트_15문제.jsx
// 근거: 수업자료 Chapter 2 Application Layer (응용 원리, SMTP/POP3/IMAP, DNS)
const META = {
  group: "컴퓨터네트워크",
  unit: "2장",
  title: "2장 응용 계층 단답형 3세트 15문제"
};

const SA_QUESTIONS = [
  {
    category: "응용 구조",
    question: "클라이언트-서버 구조에서 간헐적으로 연결되거나 동적 IP를 가질 수 있는 쪽은?",
    answers: ["클라이언트", "client"],
    displayAnswer: "클라이언트",
    explanation: "서버는 항상 켜져 있고 영구 IP를 가진다."
  },
  {
    category: "전송 서비스",
    question: "응용이 필요로 하는 전송 서비스는 데이터 무결성, 타이밍, 처리율, 그리고 무엇인가?",
    answers: ["보안", "security", "보안성"],
    displayAnswer: "보안",
    explanation: "보안에는 암호화, 데이터 무결성 등이 있다."
  },
  {
    category: "전송 서비스",
    question: "인터넷 전화처럼 낮은 지연이 있어야 효과적인 응용이 요구하는 전송 서비스 요소는?",
    answers: ["타이밍", "시간", "지연", "timing", "시간 민감성", "시간 제약"],
    displayAnswer: "타이밍",
    explanation: "대화형 게임, 인터넷 전화는 시간에 민감하다."
  },
  {
    category: "전송 서비스",
    question: "최소 처리율이 필요한 멀티미디어와 달리, 얻을 수 있는 처리율을 그대로 활용하는 응용을 무엇이라 하는가?",
    answers: ["탄력적 응용", "탄력적", "elastic", "elastic app", "탄력 응용", "elastic apps", "탄력적응용", "탄력적 앱"],
    displayAnswer: "탄력적(Elastic) 응용",
    explanation: "파일 전송, 이메일, 웹 문서는 탄력적이다."
  },
  {
    category: "전송 프로토콜",
    question: "신뢰적 전송, 흐름 제어, 혼잡 제어, 연결 설정을 모두 제공하는 인터넷 전송 프로토콜은?",
    answers: ["tcp", "티씨피"],
    displayAnswer: "TCP",
    explanation: "UDP는 이들을 제공하지 않는다."
  },
  {
    category: "SMTP",
    question: "SMTP 전송의 세 단계는 핸드셰이킹, 메시지 전송, 그리고 무엇인가?",
    answers: ["종료", "closure", "연결 종료", "마무리", "연결종료", "닫기", "종결"],
    displayAnswer: "종료(closure)",
    explanation: "handshaking(greeting), transfer of messages, closure."
  },
  { category: "SMTP", question: "SMTP 서버가 메시지 본문의 끝을 판단하는 표시는? (CRLF로 둘러싸인 한 글자)",
    answers: [".", "crlf.crlf", "<crlf>.<crlf>", "마침표", "점", "온점"],
    displayAnswer: "CRLF.CRLF (마침표 한 줄)",
    hint: "마침표",
    explanation: "SMTP는 마침표만 있는 줄(CRLF.CRLF)로 메시지 끝을 판단한다." },
  {
    category: "SMTP",
    question: "Alice가 Bob에게 메일을 보낼 때 Alice의 사용자 에이전트가 메시지를 가장 먼저 보내는 곳은?",
    answers: ["alice의 메일 서버", "앨리스의 메일 서버", "자신의 메일 서버", "송신자의 메일 서버", "송신 메일 서버", "발신 메일 서버", "alice 메일 서버", "메일 서버", "앨리스 메일 서버", "alice의 서버"],
    displayAnswer: "Alice의 메일 서버",
    explanation: "메시지는 Alice 메일 서버의 송신 큐에 놓인 뒤 SMTP로 Bob의 메일 서버에 전송된다."
  },
  {
    category: "SMTP와 HTTP",
    question: "HTTP는 각 객체를 별도 응답 메시지로 보내고, SMTP는 여러 객체를 하나의 어떤 메시지로 보내는가?",
    answers: ["멀티파트", "multipart", "멀티파트 메시지", "multipart 메시지", "multipart message", "다중 파트", "다중파트"],
    displayAnswer: "멀티파트(multipart) 메시지",
    explanation: "multipart/mixed 형식과 boundary로 구분한다."
  },
  {
    category: "MIME",
    question: "MIME의 Content-Type 헤더는 type/(    ) 형식으로 쓴다. 빈칸에 들어갈 말은?",
    answers: ["subtype", "서브타입", "하위 타입", "하위타입", "서브 타입", "부타입"],
    displayAnswer: "subtype",
    explanation: "예: image/jpeg, text/plain."
  },
  {
    category: "메일 접근",
    question: "POP와 비교해 서버에 저장된 메시지를 조작하는 기능 등이 더 많은 메일 접근 프로토콜은?",
    answers: ["imap", "아이맵"],
    displayAnswer: "IMAP",
    explanation: "IMAP은 폴더 구성 등 서버 측 메시지 관리를 지원한다."
  },
  { category: "Base64", question: "Base64 표에서 값 63에 해당하는 문자는?",
    answers: ["/", "슬래시", "slash"],
    displayAnswer: "/",
    hint: "62는 '+'",
    explanation: "0~25 A~Z, 26~51 a~z, 52~61 0~9, 62 '+', 63 '/'. 패딩은 '='." },
  {
    category: "POP3",
    question: "POP3에서 메시지를 내려받은 뒤에도 서버에 사본을 남겨 두어 여러 클라이언트에 사본이 생기게 하는 모드는?",
    answers: ["download-and-keep", "download and keep", "다운로드 후 유지", "download-keep", "다운로드 후 보관", "다운로드 앤 킵", "downloadandkeep", "다운로드하고 유지", "다운로드 및 유지"],
    displayAnswer: "download-and-keep",
    explanation: "download-and-delete는 내려받은 뒤 서버에서 삭제한다."
  },
  {
    category: "DNS",
    question: "DNS를 하나의 중앙 서버로 구성하면 그 서버의 고장이 전체 장애로 이어지는 문제를 무엇이라 하는가?",
    answers: ["단일 장애점", "단일장애점", "single point of failure", "spof", "단일 고장점", "단일 실패 지점", "단일 장애 지점"],
    displayAnswer: "단일 장애점(Single point of failure)",
    explanation: "중앙 집중 DNS는 단일 장애점, 트래픽 양, 먼 데이터베이스, 유지보수 문제가 있다."
  },
  {
    category: "DNS 서비스",
    question: "복제된 여러 웹 서버의 IP 주소를 하나의 이름에 대응시켜 요청을 나누는 DNS 서비스는?",
    answers: ["부하 분산", "부하분산", "load distribution", "로드 밸런싱", "load balancing", "로드밸런싱", "로드 분산", "부하 균형"],
    displayAnswer: "부하 분산(Load distribution)",
    explanation: "replicated Web servers: many IP addresses correspond to one name."
  },
];
