// 컴퓨터네트워크_3장_OX_4세트_24문제.jsx
// 근거: 수업자료 Chapter 3 Transport Layer, Checksum
const META = {
  group: "컴퓨터네트워크",
  unit: "3장",
  title: "3장 전송 계층 OX 4세트 24문제"
};

const OX_QUESTIONS = [
  {
    category: "TCP 개요",
    question: "TCP는 전이중(full duplex)이어서 같은 연결에서 양방향으로 데이터가 흐를 수 있다.",
    answer: true,
    explanation: "full duplex data: bi-directional data flow in same connection."
  },
  {
    category: "TCP 개요",
    question: "TCP는 데이터 교환 전에 상대방이 연결을 설정할 의사가 있는지 서로 알 필요가 없다.",
    answer: false,
    explanation: "연결 설정(핸드셰이킹)으로 양쪽이 연결 설정 의사와 상태를 서로 확인한다."
  },
  {
    category: "TCP 개요",
    question: "TCP는 파이프라이닝되며 윈도우 크기는 혼잡 제어와 흐름 제어가 정한다.",
    answer: true,
    explanation: "TCP congestion and flow control set window size."
  },
  {
    category: "TCP 개요",
    question: "TCP는 여러 송신자와 여러 수신자를 함께 연결하는 다대다 연결을 지원한다.",
    answer: false,
    explanation: "TCP는 점대점 연결로 송신자 하나, 수신자 하나다."
  },
  {
    category: "TCP 순서/ACK",
    question: "TCP의 acknowledgement number는 방금 받은 세그먼트의 마지막 바이트 번호이다.",
    answer: false,
    explanation: "수신자가 다음에 받기를 기대하는 바이트 번호이다."
  },
  {
    category: "TCP 순서/ACK",
    question: "TCP는 세그먼트 단위로 순서 번호를 매긴다.",
    answer: false,
    explanation: "바이트 스트림 번호로 센다. 순서 번호는 세그먼트 첫 번째 바이트의 번호다."
  },
  {
    category: "TCP 순서/ACK",
    question: "TCP의 초기 순서 번호는 난수 생성 함수로 정하며 반드시 0이나 1에서 시작하지는 않는다.",
    answer: true,
    explanation: "Sequence Number 초기 값은 Random number로 생성한다."
  },
  {
    category: "TCP 순서/ACK",
    question: "순서가 어긋난 세그먼트를 TCP 수신자가 어떻게 처리할지는 TCP 명세가 정하지 않고 구현에 맡긴다.",
    answer: true,
    explanation: "TCP spec doesn't say, up to implementer."
  },
  {
    category: "RTT 추정",
    question: "TCP는 한 번에 하나의 RTT 측정만 진행하며 측정이 서로 겹치지 않는다.",
    answer: true,
    explanation: "There is only one measurement ongoing at any time."
  },
  {
    category: "RTT 추정",
    question: "TimeoutInterval이 너무 길면 조기 타임아웃과 불필요한 재전송이 늘어난다.",
    answer: false,
    explanation: "너무 짧을 때 조기 타임아웃이 생기고, 너무 길면 손실에 대한 반응이 느려진다."
  },
  {
    category: "RTT 추정",
    question: "EstimatedRTT의 변동이 크면 안전 마진(DevRTT 항)을 더 크게 잡는다.",
    answer: true,
    explanation: "large variation in EstimatedRTT → larger safety margin."
  },
  {
    category: "RTT 추정",
    question: "DevRTT는 SampleRTT의 평균값을 나타낸다.",
    answer: false,
    explanation: "DevRTT는 SampleRTT가 EstimatedRTT에서 벗어난 정도(편차)의 추정값이다."
  },
  {
    category: "TCP 송신자",
    question: "단순화된 TCP 송신자는 ACK 값 y가 SendBase보다 작아도 SendBase를 y로 갱신한다.",
    answer: false,
    explanation: "y > SendBase일 때만 SendBase를 y로 갱신한다."
  },
  {
    category: "TCP 송신자",
    question: "단순화된 TCP 송신자는 타임아웃이 발생하면 아직 ACK되지 않은 가장 작은 순서 번호의 세그먼트를 재전송하고 타이머를 다시 시작한다.",
    answer: true,
    explanation: "retransmit not-yet-acked segment with smallest seq. #, start timer."
  },
  {
    category: "재전송 시나리오",
    question: "누적 ACK 덕분에 첫 ACK가 손실되어도 이어서 더 큰 ACK가 도착하면 첫 세그먼트를 재전송하지 않고 넘어갈 수 있다.",
    answer: true,
    explanation: "cumulative ACK scenario에서 ACK=120이 도착하면 이전 세그먼트도 확인된다."
  },
  {
    category: "ACK 생성",
    question: "TCP 수신자는 순서대로 세그먼트가 도착하면 항상 즉시 ACK를 보낸다.",
    answer: false,
    explanation: "기대한 번호의 세그먼트가 순서대로 도착하고 이전 데이터가 모두 ACK된 상태라면 지연 ACK로 다음 세그먼트를 최대 500ms 기다린다."
  },
  {
    category: "ACK 생성",
    question: "순서대로 세그먼트가 연속 도착해 ACK가 하나 보류 중이면 단일 누적 ACK로 두 세그먼트를 즉시 확인한다.",
    answer: true,
    explanation: "immediately send single cumulative ACK, ACKing both in-order segments."
  },
  {
    category: "ACK 생성",
    question: "갭을 메우는 세그먼트가 도착해도 수신자는 ACK를 보내지 않는다.",
    answer: false,
    explanation: "세그먼트가 갭의 하한에서 시작하면 즉시 ACK를 보낸다."
  },
  {
    category: "흐름 제어",
    question: "송신자는 미확인(in-flight) 데이터의 양을 수신자의 rwnd 이하로 제한해 수신 버퍼가 넘치지 않도록 보장한다.",
    answer: true,
    explanation: "sender limits amount of unacked data to receiver's rwnd value."
  },
  {
    category: "흐름 제어",
    question: "TCP 수신 버퍼(RcvBuffer)의 크기는 고정값이라 운영체제가 조정할 수 없다.",
    answer: false,
    explanation: "소켓 옵션으로 설정하며 많은 운영체제가 자동으로 조정한다."
  },
  {
    category: "연결 종료",
    question: "TCP에서 한쪽이 FIN을 보낸 뒤에도 그 쪽은 상대방이 보내는 데이터를 받을 수 있다.",
    answer: true,
    explanation: "half close: FIN을 보낸 쪽은 더 보낼 수 없지만 받을 수는 있다."
  },
  {
    category: "TCP 연결",
    question: "FIN 세그먼트는 데이터를 싣지 않아도 순서 번호를 소비하지 않는다.",
    answer: false,
    explanation: "데이터 없는 FIN도 순서 번호를 1 소비한다."
  },
  {
    category: "TCP 연결",
    question: "3-way handshake의 세 번째 단계인 ACK 세그먼트는 데이터를 실을 수 없다.",
    answer: false,
    explanation: "step 3의 ACK 세그먼트는 데이터를 포함할 수 있다."
  },
  {
    category: "TCP 연결",
    question: "3-way handshake의 두 번째 단계에서 서버는 SYNACK을 보내며 버퍼를 할당하고 자신의 초기 순서 번호를 지정한다.",
    answer: true,
    explanation: "server allocates buffers, specifies server initial seq. #."
  },
];
