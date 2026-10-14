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
  {
    category: "TCP 개요",
    question: "TCP는 점대점(point-to-point) 연결로 한 명의 송신자와 한 명의 수신자를 가진다.",
    answer: true,
    explanation: "point-to-point: one sender, one receiver."
  },
  {
    category: "TCP 개요",
    question: "TCP는 메시지 경계를 보존하여 응용 계층이 보낸 메시지 단위로 전달한다.",
    answer: false,
    explanation: "TCP는 메시지 경계가 없는 신뢰적이고 순서 보장되는 바이트 스트림이다."
  },
  {
    category: "TCP 순서 번호",
    question: "TCP 세그먼트의 순서 번호는 그 세그먼트 데이터의 첫 번째 바이트의 바이트 스트림 번호이다.",
    answer: true,
    explanation: "sequence numbers: byte stream number of first byte in segment's data."
  },
  {
    category: "TCP ACK",
    question: "TCP 수신자는 순서가 어긋난 세그먼트가 도착하면 ACK를 지연시켰다가 보낸다.",
    answer: false,
    explanation: "갭이 감지되면 다음 기대 바이트 번호를 담은 중복 ACK를 즉시 보낸다. 지연 ACK는 순서대로 도착한 경우에 쓴다."
  },
  {
    category: "빠른 재전송",
    question: "송신자가 같은 데이터에 대한 ACK를 3번 중복해서 받으면 타임아웃을 기다리지 않고 가장 작은 순서 번호의 미확인 세그먼트를 재전송한다.",
    answer: true,
    explanation: "TCP fast retransmit이다."
  },
  {
    category: "흐름 제어",
    question: "TCP 송신자의 윈도우 크기는 min(RWND, CWND)로 정해진다.",
    answer: true,
    explanation: "수신 윈도우와 혼잡 윈도우 중 작은 값이 송신 윈도우다."
  },
  {
    category: "TCP 타이머",
    question: "시간대기 타이머(Time-Waited Timer)의 값은 MSL(최대 세그먼트 수명)과 같다.",
    answer: false,
    explanation: "시간대기 타이머 값은 2 × MSL이며 MSL은 보통 2분이다."
  },
  {
    category: "TCP 연결",
    question: "SYN+ACK 세그먼트는 데이터를 싣지 못하지만 순서 번호를 1 소비한다.",
    answer: true,
    explanation: "SYN, SYN+ACK, 데이터 없는 FIN은 각각 순서 번호 1을 소비한다."
  },
  {
    category: "혼잡 제어",
    question: "혼잡 제어와 흐름 제어는 같은 문제를 다루는 동일한 개념이다.",
    answer: false,
    explanation: "흐름 제어는 수신자 버퍼 보호, 혼잡 제어는 네트워크 과부하 방지다."
  },
  {
    category: "혼잡 비용",
    question: "혼잡 상황에서 불필요한 재전송이 늘면 같은 굿풋(goodput)을 얻기 위해 더 많은 작업이 필요하다.",
    answer: true,
    explanation: "unneeded retransmissions는 링크가 여러 복사본을 나르게 해 goodput을 줄인다."
  },
  {
    category: "혼잡 제어",
    question: "TCP Tahoe는 3중복 ACK에서는 cwnd를 절반으로 줄이고 타임아웃에서만 1로 줄인다.",
    answer: false,
    explanation: "Tahoe는 타임아웃이든 3중복 ACK든 항상 cwnd를 1로 설정한다. 절반으로 줄이는 것은 Reno다."
  },
  {
    category: "혼잡 제어",
    question: "혼잡 회피 단계에서는 ACK 하나를 받을 때마다 cwnd에 MSS×(MSS/cwnd)를 더한다.",
    answer: true,
    explanation: "결과적으로 RTT마다 1 MSS씩 선형 증가한다."
  },
  {
    category: "TCP 처리율",
    question: "손실이 발생하는 윈도우 크기가 W일 때 평균 TCP 처리율은 W/RTT이다.",
    answer: false,
    explanation: "평균 윈도우 크기는 W의 3/4이므로 평균 처리율은 (3/4)W/RTT다."
  },
  {
    category: "공정성",
    question: "링크에 이미 TCP 연결 9개가 있을 때 새 응용이 TCP 연결 1개를 열면 링크 용량의 절반(R/2)을 얻는다.",
    answer: false,
    explanation: "연결 1개를 열면 R/10을 얻는다. 11개를 열어야 R/2를 얻는다."
  },
];
