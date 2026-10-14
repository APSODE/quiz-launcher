// 컴퓨터네트워크 중간고사 모의고사 6회
// 기출 형식: OX, 빈칸, DNS, 순서 번호 공간, TCP 송신자, 연결 설정 및 종료
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 6회",
  topic: "OX · 빈칸 · DNS 등록 · 순서 번호 공간 · TCP 송신자 · 연결 설정/종료"
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
  {
    category: "지연",
    question: "전파 지연(propagation delay)은 패킷의 길이에 비례한다.",
    answer: false,
    explanation: "전파 지연은 링크 길이를 전파 속도로 나눈 값이다. 패킷 길이에 비례하는 것은 전송 지연이다."
  },
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
  {
    category: "TCP 파이프라이닝",
    question: "TCP는 파이프라이닝을 사용하며 누적 ACK와 단일 재전송 타이머를 쓴다.",
    answer: true,
    explanation: "TCP는 GBN과 유사하게 누적 ACK와 하나의 타이머를 사용한다."
  },
  {
    category: "TCP 수신",
    question: "TCP 수신자는 순서가 어긋나게 도착한 세그먼트를 항상 버린다.",
    answer: false,
    explanation: "TCP 명세는 처리 방식을 정하지 않으며 구현에 따라 버퍼에 보관할 수 있다. 항상 버리는 것은 GBN 수신자다."
  },
  {
    category: "혼잡 제어",
    question: "TCP Reno에서 타임아웃이 발생하면 ssthresh를 cwnd/2로 정하고 cwnd를 1 MSS로 줄여 슬로 스타트를 시작한다.",
    answer: true,
    explanation: "타임아웃은 심한 혼잡 신호이므로 ssthresh=cwnd/2, cwnd=1 MSS로 하고 슬로 스타트로 들어간다."
  },
  {
    category: "공정성",
    question: "TCP는 UDP 트래픽과 링크를 공유할 때도 완벽히 공정하게 대역폭을 나눈다.",
    answer: false,
    explanation: "UDP는 혼잡 제어를 하지 않아 TCP가 양보하게 되므로 공정하지 않다."
  },

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
  {
    category: "TCP 연결",
    question: "TCP 3-way handshake에서 서버가 두 번째로 보내는 세그먼트는 (        )이다.",
    answers: ["synack", "syn+ack", "syn ack", "syn-ack", "syn/ack", "syn + ack"],
    displayAnswer: "SYNACK",
    explanation: "SYN → SYNACK → ACK 순서다."
  },
  {
    category: "혼잡 제어",
    question: "TCP Reno는 같은 ACK를 (        ) 번 연속 중복으로 받으면 Fast Retransmit을 수행한다.",
    answers: ["3", "3.0", "3.00", "3번", "3 번", "3.0번", "3.0 번", "3.00번", "3.00 번", "3개", "3 개", "3.0개", "3.0 개", "3.00개", "3.00 개", "세", "삼", "세 번", "삼 번"],
    displayAnswer: "3번",
    explanation: "triple duplicate ACK, 즉 중복 ACK 3개를 받으면 손실로 판단한다."
  },

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

  // ===== 5번 단순화된 TCP 송신자 (4문제) =====
  {
    category: "TCP 송신자",
    question: "단순화된 TCP 송신자의 InitialSeqNum은 5000이고 처음에 SendBase=NextSeqNum=5000이다. 송신자가 200바이트 세그먼트 3개를 연속으로 보냈다(순서 번호 5000, 5200, 5400).\n전송 직후 NextSeqNum은? (숫자만 입력)",
    answers: ["5600", "5600.0", "5600.00"],
    displayAnswer: "5600",
    explanation: "5000+200×3=5600이다."
  },
  {
    category: "TCP 송신자",
    question: "단순화된 TCP 송신자의 InitialSeqNum은 5000이고 처음에 SendBase=NextSeqNum=5000이다. 송신자가 200바이트 세그먼트 3개를 연속으로 보냈다(순서 번호 5000, 5200, 5400).\n이후 ACK 5400을 받았다. SendBase는? (숫자만 입력)",
    answers: ["5400", "5400.0", "5400.00"],
    displayAnswer: "5400",
    explanation: "ACK 번호는 다음에 기대하는 바이트 번호이므로 SendBase가 5400으로 이동한다."
  },
  {
    category: "TCP 송신자",
    question: "단순화된 TCP 송신자의 InitialSeqNum은 5000이고 처음에 SendBase=NextSeqNum=5000이다. 송신자가 200바이트 세그먼트 3개를 연속으로 보냈다(순서 번호 5000, 5200, 5400).\nACK 5400을 받은 직후 확인되지 않은 바이트 수는? (숫자만 입력)",
    answers: ["200", "200.0", "200.00", "200바이트", "200 바이트", "200.0바이트", "200.0 바이트", "200.00바이트", "200.00 바이트"],
    displayAnswer: "200",
    explanation: "NextSeqNum-SendBase=5600-5400=200이다."
  },
  {
    category: "TCP 송신자",
    question: "단순화된 TCP 송신자의 InitialSeqNum은 5000이고 처음에 SendBase=NextSeqNum=5000이다. 송신자가 200바이트 세그먼트 3개를 연속으로 보냈다(순서 번호 5000, 5200, 5400).\nACK 5400을 받은 뒤 타임아웃이 발생하면 재전송하는 세그먼트의 순서 번호는? (숫자만 입력)",
    answers: ["5400", "5400.0", "5400.00"],
    displayAnswer: "5400",
    hint: "가장 오래된 미확인 세그먼트",
    explanation: "TCP는 확인되지 않은 가장 오래된 세그먼트, 즉 SendBase 위치의 세그먼트 하나를 재전송한다."
  },

  // ===== 6번 연결 설정과 종료의 순서 번호 (5문제) =====
  {
    category: "TCP 연결",
    question: "클라이언트의 ISN(초기 순서 번호)은 x=4000, 서버의 ISN은 y=9000이다. 클라이언트가 3-way handshake로 연결을 설정한 뒤 300바이트 데이터를 한 세그먼트로 보내고, 서버가 ACK를 보낸다. 그 후 클라이언트가 FIN을 보낸다. SYN과 FIN은 순서 번호를 1 소비하고 ACK만 있는 세그먼트는 소비하지 않는다.\n서버의 SYNACK 세그먼트의 확인 응답 번호(ack)는? (숫자만 입력)",
    answers: ["4001", "4001.0", "4001.00"],
    displayAnswer: "4001",
    explanation: "클라이언트 SYN이 순서 번호 1을 소비하므로 ack=x+1=4001이다."
  },
  {
    category: "TCP 연결",
    question: "클라이언트의 ISN(초기 순서 번호)은 x=4000, 서버의 ISN은 y=9000이다. 클라이언트가 3-way handshake로 연결을 설정한 뒤 300바이트 데이터를 한 세그먼트로 보내고, 서버가 ACK를 보낸다. 그 후 클라이언트가 FIN을 보낸다. SYN과 FIN은 순서 번호를 1 소비하고 ACK만 있는 세그먼트는 소비하지 않는다.\nhandshake의 세 번째 ACK 세그먼트의 확인 응답 번호(ack)는? (숫자만 입력)",
    answers: ["9001", "9001.0", "9001.00"],
    displayAnswer: "9001",
    explanation: "서버 SYN이 1을 소비하므로 ack=y+1=9001이다."
  },
  {
    category: "TCP 연결",
    question: "클라이언트의 ISN(초기 순서 번호)은 x=4000, 서버의 ISN은 y=9000이다. 클라이언트가 3-way handshake로 연결을 설정한 뒤 300바이트 데이터를 한 세그먼트로 보내고, 서버가 ACK를 보낸다. 그 후 클라이언트가 FIN을 보낸다. SYN과 FIN은 순서 번호를 1 소비하고 ACK만 있는 세그먼트는 소비하지 않는다.\n클라이언트가 보내는 300바이트 데이터 세그먼트의 순서 번호는? (숫자만 입력)",
    answers: ["4001", "4001.0", "4001.00"],
    displayAnswer: "4001",
    explanation: "SYN이 4000을 소비했으므로 데이터는 4001부터 시작한다."
  },
  {
    category: "TCP 연결",
    question: "클라이언트의 ISN(초기 순서 번호)은 x=4000, 서버의 ISN은 y=9000이다. 클라이언트가 3-way handshake로 연결을 설정한 뒤 300바이트 데이터를 한 세그먼트로 보내고, 서버가 ACK를 보낸다. 그 후 클라이언트가 FIN을 보낸다. SYN과 FIN은 순서 번호를 1 소비하고 ACK만 있는 세그먼트는 소비하지 않는다.\n서버가 그 데이터에 대해 보내는 ACK의 확인 응답 번호(ack)는? (숫자만 입력)",
    answers: ["4301", "4301.0", "4301.00"],
    displayAnswer: "4301",
    explanation: "4001+300=4301이다."
  },
  {
    category: "TCP 연결",
    question: "클라이언트의 ISN(초기 순서 번호)은 x=4000, 서버의 ISN은 y=9000이다. 클라이언트가 3-way handshake로 연결을 설정한 뒤 300바이트 데이터를 한 세그먼트로 보내고, 서버가 ACK를 보낸다. 그 후 클라이언트가 FIN을 보낸다. SYN과 FIN은 순서 번호를 1 소비하고 ACK만 있는 세그먼트는 소비하지 않는다.\n클라이언트가 FIN을 순서 번호 4301로 보냈을 때 서버가 응답하는 ACK의 확인 응답 번호(ack)는? (숫자만 입력)",
    answers: ["4302", "4302.0", "4302.00"],
    displayAnswer: "4302",
    explanation: "FIN도 순서 번호를 1 소비하므로 ack=4301+1=4302이다."
  },
];
