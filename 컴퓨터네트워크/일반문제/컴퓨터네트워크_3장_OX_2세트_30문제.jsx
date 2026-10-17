// 컴퓨터네트워크_3장_OX_2세트_30문제.jsx
// 근거: 수업자료 Chapter 3 Transport Layer, Checksum
const META = {
  group: "컴퓨터네트워크",
  unit: "3장",
  title: "3장 전송 계층 OX 2세트 30문제"
};

const OX_QUESTIONS = [
  {
    category: "전송 계층",
    question: "전송 계층은 송신 측에서 응용 메시지를 세그먼트로 나누어 네트워크 계층에 넘기고, 수신 측에서 세그먼트를 메시지로 재조립한다.",
    answer: true,
    explanation: "send side: breaks app messages into segments, rcv side: reassembles segments into messages."
  },
  {
    category: "전송 계층",
    question: "UDP는 지연 보장과 대역폭 보장을 제공한다.",
    answer: false,
    explanation: "TCP와 UDP 모두 지연 보장과 대역폭 보장은 제공하지 않는다."
  },
  {
    category: "역다중화",
    question: "목적지 포트 번호가 같으면 출발지 IP나 출발지 포트가 달라도 UDP 세그먼트는 같은 소켓으로 전달된다.",
    answer: true,
    explanation: "UDP 역다중화는 목적지 포트 번호만으로 소켓을 결정한다."
  },
  {
    category: "역다중화",
    question: "비영속 HTTP를 쓰는 웹 서버는 모든 요청에 대해 같은 TCP 소켓을 재사용한다.",
    answer: false,
    explanation: "비영속 HTTP는 요청마다 서로 다른 소켓을 쓴다."
  },
  {
    category: "UDP 체크섬",
    question: "인터넷 체크섬은 세그먼트 내용의 합을 그대로 체크섬 필드에 넣는다(보수를 취하지 않는다).",
    answer: false,
    explanation: "합의 보수(complement)를 취한 값을 체크섬으로 넣는다. 수신자는 모든 워드와 체크섬을 더해 확인한다."
  },
  {
    category: "UDP 체크섬",
    question: "수신자가 계산한 체크섬이 체크섬 필드 값과 같으면 전송 중 오류가 전혀 없었음이 보장된다.",
    answer: false,
    explanation: "같으면 오류가 검출되지 않은 것이며 오류가 있어도 검출 못할 수 있다."
  },
  {
    category: "rdt",
    question: "rdt2.1에서는 ACK나 NAK가 손상되면 송신자가 현재 패킷을 재전송하고 수신자는 순서 번호로 중복 패킷을 버린다.",
    answer: true,
    explanation: "송신자는 패킷에 순서 번호를 붙이고 수신자는 중복을 상위 계층으로 올리지 않는다."
  },
  {
    category: "rdt",
    question: "rdt3.0에서 ACK가 지연되어 조기 타임아웃이 일어나 재전송된 중복 패킷을 수신자는 새 데이터로 상위 계층에 전달한다.",
    answer: false,
    explanation: "순서 번호로 중복임을 판별해 버리고 ACK만 다시 보낸다."
  },
  {
    category: "정지-대기",
    question: "정지-대기 방식은 링크 용량이 커도 패킷 하나를 보내고 응답을 기다리므로 링크 활용률이 매우 낮다.",
    answer: true,
    explanation: "1 Gbps 링크에서 RTT 30ms, 1KB 패킷 하나씩이면 처리율이 약 33kB/sec에 불과하다."
  },
  {
    category: "파이프라이닝",
    question: "3개의 패킷을 파이프라이닝하면 정지-대기에 비해 활용률이 3배가 된다.",
    answer: true,
    explanation: "3-packet pipelining increases utilization by a factor of 3."
  },
  {
    category: "파이프라이닝",
    question: "파이프라이닝을 하면 한 번에 하나만 전송하므로 필요한 순서 번호 범위가 줄어든다.",
    answer: false,
    explanation: "파이프라이닝은 여러 패킷이 동시에 미확인 상태이므로 순서 번호 범위를 늘려야 한다."
  },
  {
    category: "GBN",
    question: "GBN 송신자는 중복 ACK를 받으면 무시한다.",
    answer: true,
    explanation: "GBN overview에서 Duplicate ACK: Ignore it이다."
  },
  {
    category: "GBN",
    question: "GBN 수신자는 순서가 어긋난 패킷을 받으면 버리고, 순서대로 받은 가장 높은 번호의 패킷에 대한 ACK를 다시 보낸다.",
    answer: true,
    explanation: "out-of-order pkt: discard, re-ACK pkt with highest in-order seq #."
  },
  {
    category: "SR",
    question: "SR 수신자는 윈도우 없이 RecvBase 하나만 유지한다.",
    answer: false,
    explanation: "SR 수신자는 RecvBase와 WindowSize를 가지며 윈도우 범위 안의 패킷을 버퍼링한다."
  },
  {
    category: "SR",
    question: "SR에서 송수신 윈도우가 같을 때 순서 번호 공간이 윈도우 크기 이상이기만 하면 충돌 없이 동작한다.",
    answer: false,
    explanation: "순서 번호 공간은 SN+RN 이상이어야 한다. 같은 크기라면 윈도우의 두 배 이상이어야 한다."
  },
  {
    category: "SR",
    question: "SR 송신자는 ACK(n)을 받으면 n을 수신 완료로 표시하고, n이 가장 작은 미확인 패킷이면 윈도우 기준점을 이동한다.",
    answer: true,
    explanation: "mark pkt n as received하고 smallest unACKed이면 window base를 advance한다."
  },
  { category: "전송 계층", question: "전송 계층 프로토콜은 종단 시스템에서만 동작하고 라우터에서는 동작하지 않는다.",
    answer: true,
    explanation: "전송 계층은 end system에서만 실행된다. 라우터는 network 계층까지만 처리한다." },
  { category: "전송 계층", question: "네트워크 계층은 프로세스 간, 전송 계층은 호스트 간 논리적 통신을 제공한다.",
    answer: false,
    explanation: "반대다. 네트워크 계층 = 호스트 간, 전송 계층 = 프로세스 간 논리적 통신." },
  { category: "역다중화", question: "TCP 소켓은 출발지 IP, 출발지 포트, 목적지 IP, 목적지 포트의 4-tuple 모두로 식별된다.",
    answer: true,
    explanation: "TCP 역다중화는 4-tuple을 모두 사용하고, UDP는 목적지 IP·포트만 사용한다." },
  { category: "UDP", question: "UDP는 연결 설정 과정을 거치므로 연결 설정 지연이 생긴다.",
    answer: false,
    explanation: "UDP는 연결 설정이 없어(no handshaking) 연결 설정 지연이 없다." },
  { category: "UDP", question: "UDP는 송신자와 수신자 사이에 연결 상태를 유지하지 않는다.",
    answer: true,
    explanation: "UDP 장점: 연결 설정 없음, 연결 상태 없음, 작은 헤더, 혼잡 제어 없음." },
  { category: "UDP", question: "UDP 헤더의 length 필드는 헤더를 포함한 UDP 세그먼트 전체의 바이트 수이다.",
    answer: true,
    explanation: "length = 헤더를 포함한 UDP 세그먼트의 바이트 수." },
  { category: "UDP", question: "UDP는 혼잡 제어가 없어 송신자가 원하는 속도로 보낼 수 있다.",
    answer: true,
    explanation: "UDP에는 혼잡 제어가 없어 원하는 만큼 빠르게 보낼 수 있다(UDP의 장점 중 하나)." },
  { category: "rdt", question: "rdt1.0은 비트 오류가 생길 수 있는 채널을 가정한다.",
    answer: false,
    explanation: "rdt1.0은 비트 오류도 손실도 없는 완전히 신뢰할 수 있는 채널을 가정한다. 비트 오류는 rdt2.x부터 다룬다." },
  { category: "rdt", question: "rdt2.0의 피드백 메시지는 ACK와 NAK이다.",
    answer: true,
    explanation: "rdt2.0 = 오류 검출 + 피드백(ACK/NAK)." },
  { category: "rdt", question: "rdt2.2는 ACK에 더해 NAK를 새로 도입한 버전이다.",
    answer: false,
    explanation: "rdt2.2는 NAK를 없애고(NAK-free) 마지막 정상 패킷의 ACK만 보낸다. 중복 ACK가 NAK 역할을 한다." },
  { category: "rdt", question: "rdt3.0의 송신자는 '합리적인' 시간 동안 ACK를 기다리고 오지 않으면 재전송한다.",
    answer: true,
    explanation: "rdt3.0은 손실 대비 카운트다운 타이머를 사용한다." },
  { category: "GBN", question: "GBN 송신자는 미확인 패킷마다 타이머를 하나씩 둔다.",
    answer: false,
    explanation: "GBN은 가장 오래된 미확인 패킷에 대한 타이머 하나만 둔다. 패킷마다 타이머를 두는 것은 SR이다." },
  { category: "SR", question: "SR 송신자는 타임아웃이 나면 그 패킷 이후에 보낸 패킷까지 모두 재전송한다.",
    answer: false,
    explanation: "그것은 GBN이다. SR은 타이머가 만료된 패킷만 재전송한다." },
  { category: "UDP 체크섬", question: "UDP 체크섬은 UDP 헤더만을 대상으로 계산한다.",
    answer: false,
    explanation: "UDP/TCP 체크섬은 pseudoheader + 헤더 + 데이터를 대상으로 한다. 헤더만 대상으로 하는 것은 IP 체크섬이다." },
];
