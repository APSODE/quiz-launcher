// 컴퓨터네트워크_중간고사_모의고사_4.jsx
// 2024, 2025 기출 형식(OX, 빈칸, DNS, 재전송, 윈도우, 타임아웃)을 따른 모의고사 4회
// 정답은 수업자료 기준으로 직접 풀이한 것이다.
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 4회",
  topic: "OX · 빈칸 · DNS 레코드 · GBN · SR · 정지-대기 흐름"
};

const QUESTIONS = [

  // ===== 1번 OX (10문제) =====
  {
    category: "패킷 스위칭",
    question: "저장 후 전달(store-and-forward) 방식은 회선 교환에서 사용되는 개념이다.",
    answer: false,
    explanation: "저장 후 전달은 패킷 교환의 개념이다. 회선 교환은 store and forward 없이 입력에서 출력 링크로 바로 전달한다."
  },
  { category: "회선 교환", question: "회선 교환은 연결 설정, 데이터 전송, 연결 해제의 3단계로 이루어진다.",
    answer: true,
    explanation: "회선 교환 3단계." },
  {
    category: "MIME",
    question: "MIME는 메일 헤더에 콘텐츠 타입을 선언해 이미지 같은 비텍스트 데이터도 메일로 보낼 수 있게 한다.",
    answer: true,
    explanation: "Content-Type: type/subtype 형식이며 이진 데이터는 base64 등으로 인코딩한다."
  },
  {
    category: "메일 접근",
    question: "POP3는 서버에 폴더를 두어 메시지를 정리하게 하며 세션 간 사용자 상태를 유지한다.",
    answer: false,
    explanation: "폴더와 세션 간 상태 유지는 IMAP의 특징이다. POP3는 세션 간 상태를 유지하지 않는다(stateless)."
  },
  {
    category: "DNS",
    question: "로컬 DNS 서버가 TLD 서버 정보를 캐시해 두므로 루트 서버는 자주 방문되지 않는다.",
    answer: true,
    explanation: "이름 서버는 한 번 알게 된 매핑을 캐시하고 TLD 서버 정보도 로컬 이름 서버에 주로 캐시된다."
  },
  {
    category: "DNS",
    question: "DNS 캐시 항목은 한 번 저장되면 호스트의 IP가 바뀌어도 삭제되지 않는다.",
    answer: false,
    explanation: "캐시 항목은 TTL이 지나면 삭제된다. 다만 TTL이 만료되기 전까지는 오래된 정보일 수 있다."
  },
  { category: "rdt", question: "rdt2.0은 패킷 하나를 보내고 응답을 기다리는 정지-대기 방식이다.",
    answer: true,
    explanation: "rdt2.0~3.0은 stop-and-wait." },
  { category: "GBN", question: "GBN 수신자는 순서가 어긋난 패킷을 저장할 수신 버퍼를 가진다.",
    answer: false,
    explanation: "GBN 수신자는 버퍼가 없다(폐기). 수신 버퍼는 SR에 있다." },
  { category: "SR", question: "SR 송신자는 미확인 패킷마다 타이머를 둔다.",
    answer: true,
    explanation: "SR = 패킷별 타이머, GBN = 타이머 1개." },
  { category: "UDP", question: "UDP는 흐름 제어를 제공한다.",
    answer: false,
    explanation: "UDP는 신뢰성·흐름·혼잡 제어·연결 설정을 모두 제공하지 않는다." },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "OSI 모델",
    question: "OSI 7계층 중 데이터 형식 변환, 인코딩, 암호화, 압축을 담당하는 계층은 (        )이다.",
    answers: ["표현 계층", "표현계층", "표현", "6계층", "presentation layer", "presentation"],
    displayAnswer: "표현 계층(Presentation Layer)",
    hint: "6계층",
    explanation: "표현 계층은 데이터를 상대 시스템이 이해할 수 있는 형태로 가공한다."
  },
  {
    category: "MIME",
    question: "메일 헤더에 콘텐츠 타입을 선언해 멀티미디어 데이터를 보낼 수 있게 한 확장 규격은 (        )이다.",
    answers: ["mime", "multipurpose internet mail extension", "multipurpose internet mail extensions"],
    displayAnswer: "MIME",
    explanation: "MIME = Multipurpose Internet Mail Extension이다."
  },
  {
    category: "DNS",
    question: "DNS에서 접촉한 서버가 이름 해석의 부담을 모두 떠안아 대신 해석해 주는 방식을 (        ) 질의라 한다.",
    answers: ["재귀적", "재귀", "재귀 질의", "재귀적 질의", "recursive", "recursive query"],
    displayAnswer: "재귀적(Recursive)",
    explanation: "반복적 질의는 '이 서버에 물어보라'고 답하고, 재귀적 질의는 접촉한 서버가 직접 해석한다."
  },
  { category: "rdt", question: "rdt2.2에서 NAK의 역할을 하는 것은 (        ) ACK이다.",
    answers: ["중복", "duplicate", "중복된", "같은"],
    displayAnswer: "중복",
    hint: "같은 번호가 또",
    explanation: "rdt2.2: 중복 ACK = NAK." },
  { category: "다중화/역다중화", question: "UDP 소켓은 목적지 IP와 목적지 (        ) 번호로 식별된다.",
    answers: ["포트", "port"],
    displayAnswer: "포트",
    hint: "HTTP 80",
    explanation: "UDP demux = 목적지 IP·포트, TCP demux = 4-tuple." },
  { category: "파이프라이닝", question: "파이프라이닝의 두 방식은 GBN과 (        )이다. (약어)",
    answers: ["sr", "selective repeat", "선택적 반복", "선택적반복"],
    displayAnswer: "SR",
    hint: "Selective ...",
    explanation: "pipelining: Go-Back-N, Selective Repeat." },

  // ===== 3번 DNS 레코드 (3문제) =====
  {
    category: "DNS",
    question: "kit.ac.kr 대학의 메일 서버 이름은 mx1.kit.ac.kr이고 IP 주소는 211.45.67.89이다. 레코드는 (name, value, type) 형식으로 쓴다.\nkit.ac.kr 앞으로 온 메일을 받을 서버를 알려 주는 레코드는?",
    answers: ["kit.ac.kr, mx1.kit.ac.kr, mx", "(kit.ac.kr, mx1.kit.ac.kr, mx)", "kit.ac.kr,mx1.kit.ac.kr,mx", "(kit.ac.kr,mx1.kit.ac.kr,mx)", "kit.ac.kr mx1.kit.ac.kr mx", "(kit.ac.kr mx1.kit.ac.kr mx)"],
    displayAnswer: "(kit.ac.kr, mx1.kit.ac.kr, MX)",
    hint: "type은 MX",
    explanation: "MX 레코드는 name이 메일을 받을 도메인이고 value가 메일 서버의 이름이다."
  },
  {
    category: "DNS",
    question: "kit.ac.kr 대학의 메일 서버 이름은 mx1.kit.ac.kr이고 IP 주소는 211.45.67.89이다. 레코드는 (name, value, type) 형식으로 쓴다.\n메일 서버 이름 mx1.kit.ac.kr을 IP 주소로 매핑하는 레코드는?",
    answers: ["mx1.kit.ac.kr, 211.45.67.89, a", "(mx1.kit.ac.kr, 211.45.67.89, a)", "mx1.kit.ac.kr,211.45.67.89,a", "(mx1.kit.ac.kr,211.45.67.89,a)", "mx1.kit.ac.kr 211.45.67.89 a", "(mx1.kit.ac.kr 211.45.67.89 a)"],
    displayAnswer: "(mx1.kit.ac.kr, 211.45.67.89, A)",
    hint: "type은 A",
    explanation: "MX 레코드의 value로 쓰인 이름은 A 레코드를 통해 IP 주소가 된다."
  },
  {
    category: "DNS",
    question: "NS 레코드의 name에는 도메인과 호스트 이름 중 무엇이 들어가는가?",
    answers: ["도메인", "도메인 이름", "도메인이름", "도메인명", "domain", "domain name"],
    displayAnswer: "도메인(Domain)",
    explanation: "NS 레코드는 name이 도메인(예: foo.com)이고 value가 그 도메인의 권한 있는 이름 서버의 호스트 이름이다."
  },

  // ===== 4번 GBN 손실 (4문제) =====
  { category: "GBN", question: "Window Size(N)=3인 GBN 송신자가 pkt0~pkt4를 보내야 한다. 처음에 pkt0~pkt2를 보냈고 pkt1의 첫 전송만 손실되었다.\nACK0을 받은 뒤 송신자가 새로 보내는 패킷 번호는? (숫자만 입력)",
    answers: ["3", "pkt3"],
    displayAnswer: "pkt3",
    hint: "윈도우 1~3",
    explanation: "ACK0 → SendBase 1, 윈도우 1~3 → pkt3 전송." },
  { category: "GBN", question: "위 상황(N=3, pkt1 손실)에서 수신자가 pkt2, pkt3을 받았을 때 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["0", "ack0", "ack 0"],
    displayAnswer: "0 (ACK0)",
    hint: "순서대로 받은 마지막",
    explanation: "기다리는 번호는 1 → pkt2, pkt3 폐기, ACK0을 다시 보낸다(송신자는 무시)." },
  { category: "GBN", question: "위 상황(N=3, pkt1 손실)에서 pkt1의 타이머가 만료되었을 때 재전송되는 패킷 번호를 모두 쓰면?",
    answers: ["1, 2, 3", "1,2,3", "1 2 3", "pkt1, pkt2, pkt3", "pkt1,pkt2,pkt3", "pkt1 pkt2 pkt3", "1~3", "1-3"],
    displayAnswer: "pkt1, pkt2, pkt3",
    hint: "이후 보낸 것 전부",
    explanation: "타임아웃 직전 SendBase 1, NextSeqNum 4 → pkt1~pkt3 재전송." },
  { category: "GBN", question: "위 상황(N=3, pkt1 손실)에서 재전송된 패킷이 확인되어 ACK3까지 받은 뒤 보내는 패킷 번호는? (숫자만 입력)",
    answers: ["4", "pkt4"],
    displayAnswer: "pkt4",
    hint: "남은 패킷",
    explanation: "ACK1 → 윈도우 2~4 → pkt4 전송. 마지막 패킷이다." },

  // ===== 5번 SR ACK 도착 순서 (4문제) =====
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 손실은 없다. 수신자가 보낸 ACK0이 지연되어 송신자에게는 ACK1, ACK0 순서로 도착한다. 송신자는 윈도우가 이동하면 즉시 보낼 수 있는 새 패킷을 모두 전송한다.\n송신자가 ACK1을 수신한 직후의 SendBase 값은? (숫자만 입력)",
    answers: ["0", "0.0", "0.00"],
    displayAnswer: "0",
    hint: "pkt0은 아직 확인되지 않았다",
    explanation: "ACK1이 먼저 도착해도 pkt0이 미확인이라 윈도우는 이동하지 않는다. ACK0이 도착하면 미확인 중 가장 작은 번호가 pkt2가 되어 윈도우가 2~5로 이동하고 pkt4, pkt5를 전송한다. "
  },
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 손실은 없다. 수신자가 보낸 ACK0이 지연되어 송신자에게는 ACK1, ACK0 순서로 도착한다. 송신자는 윈도우가 이동하면 즉시 보낼 수 있는 새 패킷을 모두 전송한다.\n송신자가 ACK0까지 수신한 직후의 SendBase 값은? (숫자만 입력)",
    answers: ["2", "2.0", "2.00"],
    displayAnswer: "2",
    hint: "pkt0, pkt1이 모두 확인되었다",
    explanation: "ACK1이 먼저 도착해도 pkt0이 미확인이라 윈도우는 이동하지 않는다. ACK0이 도착하면 미확인 중 가장 작은 번호가 pkt2가 되어 윈도우가 2~5로 이동하고 pkt4, pkt5를 전송한다. "
  },
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 손실은 없다. 수신자가 보낸 ACK0이 지연되어 송신자에게는 ACK1, ACK0 순서로 도착한다. 송신자는 윈도우가 이동하면 즉시 보낼 수 있는 새 패킷을 모두 전송한다.\n송신자가 ACK0까지 수신한 직후의 WindowRange는? (예: 0~3 형식으로 입력)",
    answers: ["2~5", "2 ~ 5", "2-5", "2 - 5", "2–5", "2 – 5", "[2,5]", "[2, 5]", "2부터 5", "2부터 5까지", "2~5까지"],
    displayAnswer: "2~5",
    hint: "SendBase부터 N개",
    explanation: "ACK1이 먼저 도착해도 pkt0이 미확인이라 윈도우는 이동하지 않는다. ACK0이 도착하면 미확인 중 가장 작은 번호가 pkt2가 되어 윈도우가 2~5로 이동하고 pkt4, pkt5를 전송한다. "
  },
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 손실은 없다. 수신자가 보낸 ACK0이 지연되어 송신자에게는 ACK1, ACK0 순서로 도착한다. 송신자는 윈도우가 이동하면 즉시 보낼 수 있는 새 패킷을 모두 전송한다.\n송신자가 ACK0까지 수신하고 새 패킷을 전송한 직후의 NextSeqNum 값은? (숫자만 입력)",
    answers: ["6", "6.0", "6.00"],
    displayAnswer: "6",
    hint: "다음에 보낼 새 패킷의 번호",
    explanation: "ACK1이 먼저 도착해도 pkt0이 미확인이라 윈도우는 이동하지 않는다. ACK0이 도착하면 미확인 중 가장 작은 번호가 pkt2가 되어 윈도우가 2~5로 이동하고 pkt4, pkt5를 전송한다. pkt4, pkt5를 전송했으므로 다음에 보낼 새 패킷은 pkt6이다."
  },

  // ===== 6번 정지-대기 rdt3.0 흐름 (4문제) =====
  { category: "정지-대기", question: "정지-대기 rdt3.0(순서 번호 0, 1 번갈아 사용)으로 pkt0, pkt1, pkt2를 보낸다. pkt0과 pkt2는 문제없이 확인되고, pkt1은 정상 도착했지만 ACK1이 손실되었다.\n송신자가 보낸 데이터 패킷은 재전송을 포함해 모두 몇 번인가? (숫자만 입력)",
    answers: ["4", "4번", "4회"],
    displayAnswer: "4번",
    hint: "ACK1이 오지 않음",
    explanation: "pkt0, pkt1, (ACK1 손실 → 타임아웃) pkt1 재전송, pkt2 → 4번." },
  { category: "정지-대기", question: "위 상황에서 수신자가 중복으로 판단해 상위 계층에 전달하지 않는 패킷은? (예: pkt0)",
    answers: ["1", "pkt1"],
    displayAnswer: "pkt1(재전송분)",
    hint: "재전송된 것",
    explanation: "재전송된 pkt1은 이미 받은 패킷이므로 순서 번호로 중복임을 알고 폐기한다." },
  { category: "정지-대기", question: "위 상황에서 수신자가 보낸 ACK는 재전송된 것을 포함해 모두 몇 개인가? (숫자만 입력)",
    answers: ["4", "4개"],
    displayAnswer: "4개",
    hint: "중복 pkt1에도 ACK",
    explanation: "ACK0, ACK1(손실), ACK1(중복 pkt1에 대해 다시), ACK2 → 4개." },
  { category: "rdt", question: "rdt2.1 이후 정지-대기 방식에서 패킷 구분에 필요한 순서 번호는 몇 가지면 충분한가? (숫자만 입력)",
    answers: ["2", "2개", "2가지", "두 개"],
    displayAnswer: "2",
    hint: "0과 1",
    explanation: "정지-대기에서는 0과 1 두 개의 순서 번호를 번갈아 쓰면 충분하다." },
];
