// 컴퓨터네트워크 중간고사 모의고사 6회
// 기출 형식: OX, 빈칸, DNS, 순서 번호 공간, GBN, UDP 역다중화 — 2026-10-17 시험범위(지연 · TCP 3.5 이후 · 계산 문제 제외)에 맞게 수정
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 6회",
  topic: "OX · 빈칸 · DNS 등록 · 순서 번호 공간 · GBN · UDP 역다중화"
};

const QUESTIONS = [

  // ===== 1번 OX (10문제) =====
  {
    category: "OSI 계층",
    question: "표현 계층(Presentation)은 데이터의 암호화, 압축, 형식 변환을 담당한다.",
    answer: true,
    explanation: "표현 계층은 응용 계층 데이터의 표현 방식(변환, 암호화, 압축)을 처리한다."
  },
  {
    category: "OSI 계층",
    question: "세션 계층(Session)은 종단 간 신뢰성 있는 전달과 오류 복구를 책임진다.",
    answer: false,
    explanation: "세션 계층은 대화(세션)의 설정, 유지, 동기화를 담당한다. 종단 간 신뢰성은 전송 계층의 역할이다."
  },
  {
    category: "네트워크 분류",
    question: "LAN은 일반적으로 약 1km 이내의 좁은 범위를 연결하는 네트워크이다.",
    answer: true,
    explanation: "LAN은 건물이나 캠퍼스 정도의 좁은 지역을 연결하며 WAN은 그보다 훨씬 넓은 범위를 연결한다."
  },
  { category: "프로토콜 계층", question: "인터넷 프로토콜 스택에서 network 계층은 출발지에서 목적지까지 datagram을 라우팅한다.",
    answer: true,
    explanation: "network = datagram 라우팅(IP)." },
  {
    category: "SMTP",
    question: "SMTP는 TCP의 25번 포트를 사용한다.",
    answer: true,
    explanation: "SMTP는 신뢰성이 필요하므로 TCP를 사용하며 서버 포트는 25번이다."
  },
  {
    category: "SMTP와 HTTP",
    question: "여러 객체를 전달할 때 SMTP는 객체마다 별도 메시지를 쓰고 HTTP는 하나의 메시지에 모두 담는다.",
    answer: false,
    explanation: "반대다. HTTP는 각 객체를 별도의 응답 메시지로 전송하고 SMTP는 여러 객체를 하나의 메시지에 담는다."
  },
  { category: "GBN", question: "GBN은 누적 ACK와 하나의 재전송 타이머를 사용한다.",
    answer: true,
    explanation: "GBN: 누적 ACK, 타이머 1개, 타임아웃 시 이후 전부 재전송." },
  { category: "SR", question: "SR 수신자는 순서가 어긋나게 도착한 패킷을 항상 버린다.",
    answer: false,
    explanation: "SR 수신자는 윈도우 안의 패킷을 버퍼에 저장한다." },
  { category: "rdt", question: "rdt2.2는 ACK와 함께 NAK도 사용한다.",
    answer: false,
    explanation: "rdt2.2는 NAK-free 프로토콜이다(중복 ACK가 NAK 역할)." },
  { category: "UDP", question: "UDP는 네트워크가 혼잡하면 송신 속도를 줄이는 혼잡 제어를 제공한다.",
    answer: false,
    explanation: "UDP에는 혼잡 제어가 없다." },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 모델에서 OSI의 물리 계층과 데이터 링크 계층에 해당하는 계층은 (        ) 계층이다.",
    answers: ["네트워크 접속", "네트워크접속", "네트워크 인터페이스", "네트워크인터페이스", "링크", "링크 계층", "네트워크 접근", "network access", "network interface"],
    displayAnswer: "네트워크 접속(Network Access) 계층",
    explanation: "TCP/IP 4계층은 응용, 전송, 인터넷, 네트워크 접속 계층이다."
  },
  {
    category: "주소",
    question: "IP 주소는 OSI 7계층 중 (        ) 계층의 주소이다.",
    answers: ["네트워크", "네트워크 계층", "3계층", "3", "network", "network layer"],
    displayAnswer: "네트워크 계층(3계층)",
    explanation: "MAC은 데이터 링크, IP는 네트워크, 포트는 전송 계층의 주소다."
  },
  {
    category: "SMTP",
    question: "SMTP 서버가 사용하는 포트 번호는 (        )번이다.",
    answers: ["25", "25.0", "25.00", "25번", "25 번", "25.0번", "25.0 번", "25.00번", "25.00 번"],
    displayAnswer: "25",
    explanation: "SMTP는 TCP 25번 포트를 사용한다."
  },
  {
    category: "체크섬",
    question: "UDP와 TCP의 체크섬 계산에 쓰이는, IP 주소 등을 포함한 가상의 헤더를 (        )라 한다.",
    answers: ["의사 헤더", "의사헤더", "pseudo header", "pseudoheader", "pseudo-header", "가상 헤더", "가상헤더"],
    displayAnswer: "의사 헤더(Pseudo Header)",
    explanation: "의사 헤더는 전송되지 않고 체크섬 계산에만 쓰인다."
  },
  { category: "rdt", question: "rdt2.1에서 재전송된 중복 패킷을 구분하려고 패킷에 붙이는 것은 (        )이다.",
    answers: ["순서 번호", "순서번호", "시퀀스 번호", "시퀀스번호", "seq", "seq #", "sequence number"],
    displayAnswer: "순서 번호",
    hint: "seq #",
    explanation: "ACK/NAK 손상 대비 → 순서 번호 추가, 수신자는 중복 폐기." },
  { category: "GBN", question: "GBN 송신자는 중복 ACK를 받으면 (        )한다.",
    answers: ["무시", "무시를", "ignore"],
    displayAnswer: "무시",
    hint: "아무것도 안 함",
    explanation: "GBN 송신자는 중복 ACK를 무시한다." },

  // ===== 3번 DNS 등록 (3문제) =====
  {
    category: "DNS",
    question: "ourlab.com 도메인을 등록 기관(registrar)에 등록한다. 권한 있는 DNS 서버의 이름은 dns1.ourlab.com, IP 주소는 192.0.2.1이다. 또한 웹 서버 www.ourlab.com의 IP 주소는 192.0.2.80이다. 레코드는 (name, value, type) 형식으로 쓴다.\n등록 기관이 .com TLD 서버에 넣는 첫 번째 레코드 (ourlab.com, ?, NS)를 완성하시오. 괄호 안 형식 그대로 쓰시오.",
    answers: ["ourlab.com, dns1.ourlab.com, ns", "(ourlab.com, dns1.ourlab.com, ns)", "ourlab.com,dns1.ourlab.com,ns", "(ourlab.com,dns1.ourlab.com,ns)", "ourlab.com dns1.ourlab.com ns", "(ourlab.com dns1.ourlab.com ns)"],
    displayAnswer: "(ourlab.com, dns1.ourlab.com, NS)",
    hint: "name, value, type 순서",
    explanation: "NS 레코드의 value는 해당 도메인의 권한 있는 DNS 서버 이름이다."
  },
  {
    category: "DNS",
    question: "ourlab.com 도메인을 등록 기관(registrar)에 등록한다. 권한 있는 DNS 서버의 이름은 dns1.ourlab.com, IP 주소는 192.0.2.1이다. 또한 웹 서버 www.ourlab.com의 IP 주소는 192.0.2.80이다. 레코드는 (name, value, type) 형식으로 쓴다.\n등록 기관이 .com TLD 서버에 넣는 두 번째 레코드(권한 서버의 IP를 알려 주는 레코드)를 쓰시오.",
    answers: ["dns1.ourlab.com, 192.0.2.1, a", "(dns1.ourlab.com, 192.0.2.1, a)", "dns1.ourlab.com,192.0.2.1,a", "(dns1.ourlab.com,192.0.2.1,a)", "dns1.ourlab.com 192.0.2.1 a", "(dns1.ourlab.com 192.0.2.1 a)"],
    displayAnswer: "(dns1.ourlab.com, 192.0.2.1, A)",
    hint: "타입 A",
    explanation: "A 레코드는 호스트 이름을 IP 주소에 매핑한다."
  },
  {
    category: "DNS",
    question: "ourlab.com 도메인을 등록 기관(registrar)에 등록한다. 권한 있는 DNS 서버의 이름은 dns1.ourlab.com, IP 주소는 192.0.2.1이다. 또한 웹 서버 www.ourlab.com의 IP 주소는 192.0.2.80이다. 레코드는 (name, value, type) 형식으로 쓴다.\n권한 있는 DNS 서버 dns1.ourlab.com에 저장해야 하는 웹 서버용 레코드를 쓰시오.",
    answers: ["www.ourlab.com, 192.0.2.80, a", "(www.ourlab.com, 192.0.2.80, a)", "www.ourlab.com,192.0.2.80,a", "(www.ourlab.com,192.0.2.80,a)", "www.ourlab.com 192.0.2.80 a", "(www.ourlab.com 192.0.2.80 a)"],
    displayAnswer: "(www.ourlab.com, 192.0.2.80, A)",
    explanation: "권한 서버는 자기 도메인 호스트의 A 레코드를 가진다."
  },

  // ===== 4번 순서 번호 공간과 윈도우 (4문제) =====
  {
    category: "순서 번호",
    question: "순서 번호를 3비트로 표현하는 프로토콜을 가정한다. 순서 번호는 0부터 7까지이다.\n사용 가능한 서로 다른 순서 번호는 몇 개인가? (숫자만 입력)",
    answers: ["8", "8.0", "8.00", "8개", "8 개", "8.0개", "8.0 개", "8.00개", "8.00 개"],
    displayAnswer: "8개",
    explanation: "2^3=8개이다."
  },
  {
    category: "순서 번호",
    question: "순서 번호를 3비트로 표현하는 프로토콜을 가정한다. 순서 번호는 0부터 7까지이다.\nGBN에서 허용되는 최대 윈도우 크기는? (숫자만 입력)",
    answers: ["7", "7.0", "7.00"],
    displayAnswer: "7",
    explanation: "GBN은 윈도우가 순서 번호 공간보다 1 작은 2^k-1이어야 하므로 7이다."
  },
  {
    category: "순서 번호",
    question: "순서 번호를 3비트로 표현하는 프로토콜을 가정한다. 순서 번호는 0부터 7까지이다.\n송신 윈도우와 수신 윈도우가 같은 크기인 SR에서 허용되는 최대 윈도우 크기는? (숫자만 입력)",
    answers: ["4", "4.0", "4.00"],
    displayAnswer: "4",
    explanation: "SR은 윈도우가 순서 번호 공간의 절반 이하여야 하므로 8/2=4이다."
  },
  {
    category: "순서 번호",
    question: "순서 번호를 3비트로 표현하는 프로토콜을 가정한다. 순서 번호는 0부터 7까지이다.\nSR에서 송신 윈도우를 5로 하면 수신 윈도우의 최대 크기는? (숫자만 입력)",
    answers: ["3", "3.0", "3.00"],
    displayAnswer: "3",
    hint: "송신 윈도우 + 수신 윈도우 ≤ 순서 번호 공간",
    explanation: "송신 윈도우와 수신 윈도우의 합이 순서 번호 공간 크기 이하여야 하므로 8-5=3이다."
  },

  // ===== 5번 GBN 손실 (4문제) =====
  { category: "GBN", question: "Window Size(N)=4인 GBN 송신자가 pkt0~pkt5를 보내야 한다. pkt0~pkt3은 모두 정상 확인되었고, 그 사이 윈도우가 열려 보낸 pkt4의 첫 전송만 손실되었다.\nACK3을 받은 직후 SendBase 값은? (숫자만 입력)",
    answers: ["4"],
    displayAnswer: "4",
    hint: "가장 오래된 미확인",
    explanation: "ACK3(누적)으로 pkt0~3 확인 → SendBase 4, 윈도우 4~7." },
  { category: "GBN", question: "위 상황(N=4, pkt4 손실)에서 수신자가 pkt5를 받았을 때 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["3", "ack3", "ack 3"],
    displayAnswer: "3 (ACK3)",
    hint: "순서대로 받은 마지막",
    explanation: "기다리는 번호는 4 → pkt5 폐기, ACK3 재전송(송신자는 무시)." },
  { category: "GBN", question: "위 상황(N=4, pkt4 손실)에서 pkt4의 타이머가 만료되었을 때 재전송되는 패킷 번호를 모두 쓰면?",
    answers: ["4, 5", "4,5", "4 5", "pkt4, pkt5", "pkt4,pkt5", "pkt4 pkt5"],
    displayAnswer: "pkt4, pkt5",
    hint: "이후 보낸 것 전부",
    explanation: "SendBase 4, NextSeqNum 6 → pkt4, pkt5 재전송." },
  { category: "GBN", question: "위 상황(N=4, pkt4 손실)에서 수신자가 폐기하는 패킷 번호를 모두 쓰면?",
    answers: ["5", "pkt5"],
    displayAnswer: "pkt5",
    hint: "pkt4 뒤에 온 것",
    explanation: "pkt4가 빠졌으므로 첫 전송된 pkt5는 순서가 어긋나 폐기된다." },

  // ===== 6번 UDP와 역다중화 (5문제) =====
  { category: "다중화/역다중화", question: "서버의 UDP 포트 5000으로 클라이언트 A(포트 1111)와 B(포트 2222)가 세그먼트를 보냈다. 서버에서 두 세그먼트는 몇 개의 소켓으로 전달되는가? (숫자만 입력)",
    answers: ["1", "1개", "하나"],
    displayAnswer: "1개",
    hint: "목적지 포트가 같음",
    explanation: "UDP는 목적지 IP·포트로 소켓을 정한다 → 같은 소켓." },
  { category: "다중화/역다중화", question: "같은 두 클라이언트가 서버의 TCP 포트 80에 각각 연결하면 서버의 연결 소켓은 몇 개인가? (숫자만 입력)",
    answers: ["2", "2개", "두 개"],
    displayAnswer: "2개",
    hint: "4-tuple",
    explanation: "TCP는 4-tuple로 식별하므로 출발지가 다르면 다른 소켓." },
  { category: "UDP", question: "UDP 헤더를 이루는 필드는 모두 몇 개인가? (숫자만 입력)",
    answers: ["4", "4개", "네 개"],
    displayAnswer: "4개",
    hint: "포트 두 개 + 2",
    explanation: "source port, dest port, length, checksum." },
  { category: "UDP", question: "UDP 헤더의 length 필드는 헤더를 포함하는가? (예/아니오)",
    answers: ["예", "네", "포함", "포함한다", "yes", "o"],
    displayAnswer: "예(포함)",
    hint: "세그먼트 전체",
    explanation: "length = 헤더를 포함한 UDP 세그먼트의 바이트 수." },
  { category: "UDP", question: "DNS가 주로 사용하는 전송 계층 프로토콜은? (약어)",
    answers: ["udp", "user datagram protocol"],
    displayAnswer: "UDP",
    hint: "비연결형",
    explanation: "UDP 용도: DNS, SNMP, 스트리밍 멀티미디어." },
];
