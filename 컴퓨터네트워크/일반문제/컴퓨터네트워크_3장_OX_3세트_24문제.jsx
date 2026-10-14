// 컴퓨터네트워크_3장_OX_3세트_24문제.jsx
// 근거: 수업자료 Chapter 3 Transport Layer, Checksum
const META = {
  group: "컴퓨터네트워크",
  unit: "3장",
  title: "3장 전송 계층 OX 3세트 24문제"
};

const OX_QUESTIONS = [
  {
    category: "전송 계층",
    question: "전송 계층은 네트워크 계층의 서비스에 의존하면서 그 서비스를 향상시킨다.",
    answer: true,
    explanation: "relies on, enhances network layer services."
  },
  {
    category: "전송 계층",
    question: "인터넷의 전송 계층 프로토콜은 TCP 하나뿐이다.",
    answer: false,
    explanation: "인터넷은 TCP와 UDP를 제공한다."
  },
  {
    category: "UDP",
    question: "UDP는 연결 설정과 혼잡 제어를 모두 제공하는 정교한 프로토콜이다.",
    answer: false,
    explanation: "UDP는 최선형 IP를 최소한으로만 확장한 no-frills 프로토콜이며 연결 설정도 혼잡 제어도 없다."
  },
  {
    category: "UDP",
    question: "UDP 헤더는 TCP 헤더보다 크다.",
    answer: false,
    explanation: "UDP는 헤더가 작다(출발지/목적지 포트, 길이, 체크섬)."
  },
  {
    category: "UDP",
    question: "UDP 위에서 신뢰적 전송이 필요하면 응용 계층에서 신뢰성을 추가할 수 있다.",
    answer: true,
    explanation: "reliable transfer over UDP: add reliability at application layer."
  },
  {
    category: "역다중화",
    question: "서버 호스트는 여러 TCP 소켓을 동시에 지원하며 각 소켓은 자신의 4-튜플로 식별된다.",
    answer: true,
    explanation: "웹 서버는 연결하는 클라이언트마다 다른 소켓을 가진다."
  },
  {
    category: "역다중화",
    question: "서로 다른 호스트에서 온 TCP 세그먼트라도 출발지 포트 번호가 같으면 같은 소켓으로 전달된다.",
    answer: false,
    explanation: "출발지 IP, 출발지 포트, 목적지 IP, 목적지 포트 네 값을 모두 사용하므로 출발지 IP가 다르면 다른 소켓이다."
  },
  {
    category: "체크섬",
    question: "UDP 체크섬은 응용 데이터만 대상으로 하고 UDP 헤더는 계산에서 제외한다.",
    answer: false,
    explanation: "UDP 체크섬은 헤더 필드를 포함한 세그먼트 내용 전체를 16비트 정수의 열로 보고 계산한다."
  },
  {
    category: "체크섬",
    question: "UDP와 TCP 체크섬은 의사 헤더, UDP/TCP 헤더, 응용 계층에서 온 데이터의 세 부분을 포함한다.",
    answer: true,
    explanation: "IP 체크섬은 IP 헤더만을 대상으로 한다."
  },
  {
    category: "체크섬",
    question: "IP 체크섬은 IP 헤더를 16비트 단위로 나누어 모두 더한 뒤 그 합의 보수를 체크섬 필드에 넣는다.",
    answer: true,
    explanation: "IP 헤더만 계산 대상이다."
  },
  {
    category: "rdt",
    question: "rdt2.0은 정지-대기 방식으로, 송신자가 패킷 하나를 보낸 뒤 수신자의 응답을 기다린다.",
    answer: true,
    explanation: "stop and wait: sender sends one packet, then waits for receiver response."
  },
  {
    category: "rdt",
    question: "rdt2.0에서 ACK나 NAK가 손상되어도 송신자는 수신자의 상태를 정확히 알 수 있다.",
    answer: false,
    explanation: "ACK/NAK가 손상되면 송신자는 수신자에게 무슨 일이 있었는지 알 수 없어 순서 번호가 필요하다."
  },
  {
    category: "rdt",
    question: "rdt2.2에서 같은 번호에 대한 중복 ACK를 받은 송신자는 NAK를 받은 것과 같은 행동(현재 패킷 재전송)을 한다.",
    answer: true,
    explanation: "NAK 대신 마지막으로 정상 수신한 패킷의 ACK를 보내는 방식이다."
  },
  {
    category: "rdt",
    question: "rdt3.0의 타이머는 채널에 패킷 손실이 없을 때만 필요하다.",
    answer: false,
    explanation: "손실(데이터, ACK)에 대처하기 위해 타이머와 재전송이 필요하다."
  },
  {
    category: "파이프라이닝",
    question: "파이프라이닝에서는 송신자나 수신자 쪽에서 버퍼링이 필요할 수 있다.",
    answer: true,
    explanation: "여러 개의 미확인 패킷이 동시에 존재하기 때문이다."
  },
  {
    category: "정지-대기",
    question: "정지-대기에서는 한 번에 여러 개의 패킷이 미확인 상태로 전송 중일 수 있다.",
    answer: false,
    explanation: "정지-대기는 한 번에 패킷 하나만 보내고 응답을 기다린다."
  },
  {
    category: "GBN",
    question: "GBN 송신자는 가장 오래된 미확인 패킷에 대한 타이머 하나를 사용한다.",
    answer: true,
    explanation: "타이머가 만료되면 타이머가 설정된 패킷과 그 이후의 미확인 패킷을 재전송한다."
  },
  {
    category: "GBN",
    question: "GBN의 ACK(n)은 순서 번호 n까지의 모든 패킷을 확인하는 누적 ACK이다.",
    answer: true,
    explanation: "ACK(n): ACKs all pkts up to, including seq # n."
  },
  {
    category: "GBN",
    question: "GBN 수신자는 순서가 어긋난 패킷을 받으면 아무 응답도 보내지 않는다.",
    answer: false,
    explanation: "버리고 순서대로 받은 가장 높은 번호 패킷에 대해 ACK를 다시 보낸다."
  },
  {
    category: "SR",
    question: "SR 수신자는 윈도우 범위 안에서 순서가 어긋나 도착한 패킷을 버퍼에 보관한다.",
    answer: true,
    explanation: "나중에 순서가 맞으면 보관된 패킷도 함께 상위 계층에 전달한다."
  },
  {
    category: "SR",
    question: "SR 송신자의 재전송은 타임아웃된 패킷 하나에 대해서만 이루어진다.",
    answer: true,
    explanation: "타이머가 만료된 그 패킷만 다시 보낸다."
  },
  {
    category: "SR",
    question: "SR에서 이미 ACK한 패킷이 다시 도착하면 수신자는 아무 응답 없이 무시한다.",
    answer: false,
    explanation: "ACK가 손실되었을 수 있으므로 ACK(n)을 다시 보낸다."
  },
  {
    category: "체크섬",
    question: "TCP 헤더에는 체크섬 필드가 없어 오류 검출을 하지 않는다.",
    answer: false,
    explanation: "TCP 헤더에도 UDP와 같은 인터넷 체크섬이 있다."
  },
  {
    category: "SR",
    question: "SR에서는 송신 윈도우를 순서 번호 공간 크기만큼 크게 잡아도 수신자가 새 패킷과 재전송 패킷을 구분할 수 있다.",
    answer: false,
    explanation: "윈도우가 너무 크면 재전송된 패킷을 새 데이터로 오인한다. 순서 번호 공간은 SN+RN 이상이어야 한다."
  },
];
