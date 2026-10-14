// 컴퓨터네트워크_1장_OX_4세트_20문제.jsx
// 근거: 수업자료 Chapter 1 Introduction
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 Introduction OX 4세트 20문제"
};

const OX_QUESTIONS = [
  {
    category: "엣지와 코어",
    question: "네트워크 엣지는 데이터를 생산, 보유, 이용하는 영역으로 PC, 노트북, 서버, 스마트폰이 속한다.",
    answer: true,
    explanation: "엣지는 사용자 쪽, 코어는 전달 쪽이다."
  },
  {
    category: "엣지와 코어",
    question: "네트워크 코어는 데이터를 전달하는 영역이며 라우터가 대표적이다.",
    answer: true,
    explanation: "Core: 데이터 전달, 라우터."
  },
  {
    category: "엣지와 코어",
    question: "라우터는 네트워크 엣지에서 데이터를 생산하는 장치이다.",
    answer: false,
    explanation: "라우터는 코어에서 데이터를 전달하는 장치다."
  },
  {
    category: "호스트",
    question: "호스트는 응용 메시지를 길이 L비트의 패킷으로 나누어 전송률 R로 접속망에 보낸다.",
    answer: true,
    explanation: "패킷 하나를 링크에 내보내는 데 걸리는 시간이 L/R이다."
  },
  {
    category: "호스트",
    question: "링크 전송률은 링크의 물리적 길이를 뜻한다.",
    answer: false,
    explanation: "링크 전송률은 링크 용량(대역폭), 즉 초당 보낼 수 있는 비트 수다."
  },
  {
    category: "회선 교환",
    question: "회선 교환에서는 통신 중 다른 사용자가 같은 자원을 쓸 수 있도록 큐를 사용해 자원을 공유한다.",
    answer: false,
    explanation: "회선 교환은 자원을 전용으로 할당하며 큐를 사용하지 않는다."
  },
  {
    category: "인터넷 구조",
    question: "인터넷은 접속 ISP들이 서로 연결되어 만들어진 네트워크의 네트워크(network of networks)이다.",
    answer: true,
    explanation: "임의의 두 호스트가 패킷을 주고받을 수 있도록 접속 ISP들을 상호 연결한다."
  },
  {
    category: "인터넷 구조",
    question: "하나의 글로벌 ISP가 모든 접속 ISP를 연결하는 구조에서는 고객 ISP와 제공자 ISP 사이에 경제적 합의가 필요 없다.",
    answer: false,
    explanation: "고객 ISP와 제공자 ISP는 경제적 합의를 맺는다."
  },
  {
    category: "인터넷 구조",
    question: "ISP 간 연결에서는 오직 하나의 글로벌 ISP만 존재하며 지역 네트워크는 생기지 않는다.",
    answer: false,
    explanation: "경쟁하는 ISP들이 IXP로 연결되고 지역 네트워크가 접속망과 ISP를 연결하기도 한다."
  },
  {
    category: "프로토콜 계층",
    question: "계층화는 명시적 구조를 통해 복잡한 시스템의 구성 요소와 그 관계를 파악하게 해 준다.",
    answer: true,
    explanation: "layered reference model로 논의할 수 있다."
  },
  {
    category: "프로토콜 계층",
    question: "FTP, SMTP, HTTP는 인터넷 프로토콜 스택에서 응용 계층 프로토콜의 예이다.",
    answer: true,
    explanation: "응용 계층은 네트워크 응용을 지원한다."
  },
  {
    category: "프로토콜 계층",
    question: "TCP와 UDP는 전송 계층의 프로토콜이며 프로세스 간 데이터 전송을 담당한다.",
    answer: true,
    explanation: "transport: process-process data transfer."
  },
  {
    category: "프로토콜 계층",
    question: "링크 계층은 데이터그램을 출발지에서 목적지까지 라우팅하는 계층이다.",
    answer: false,
    explanation: "그것은 네트워크 계층이다. 링크 계층은 이웃한 네트워크 요소 간 데이터 전송을 맡는다."
  },
  {
    category: "프로토콜 계층",
    question: "물리 계층은 선 위를 흐르는 비트(bits on the wire)를 다룬다.",
    answer: true,
    explanation: "물리 계층은 비트를 실제 매체로 전달한다."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 스택에 표현·세션 계층의 서비스가 필요하면 전송 계층에서 구현해야 한다.",
    answer: false,
    explanation: "필요한 경우 응용 계층에서 구현해야 한다."
  },
  {
    category: "캡슐화",
    question: "송신 측에서는 각 계층이 상위 계층에서 받은 데이터에 자신의 헤더를 붙여 아래 계층으로 넘긴다.",
    answer: true,
    explanation: "응용 메시지에 전송 헤더, 네트워크 헤더, 링크 헤더가 차례로 붙는다."
  },
  {
    category: "캡슐화",
    question: "라우터는 프레임을 응용 계층까지 올려 처리한 뒤 다시 내려보내 전달한다.",
    answer: false,
    explanation: "라우터는 네트워크 계층까지만 처리한다."
  },
  {
    category: "캡슐화",
    question: "캡슐화 결과 프레임에서는 전송 계층 헤더가 링크 계층 헤더보다 바깥쪽에 붙는다.",
    answer: false,
    explanation: "가장 바깥쪽 헤더가 링크 계층 헤더다. 전송 계층 헤더는 메시지 바로 앞에 붙는다."
  },
  {
    category: "지연과 손실",
    question: "처리 지연은 비트 오류를 검사하고 출력 링크를 결정하는 데 걸리는 시간이다.",
    answer: true,
    explanation: "dproc은 보통 1ms 미만이다."
  },
  {
    category: "지연과 손실",
    question: "큐잉 지연은 패킷을 링크에 내보내는 데 걸리는 시간이다.",
    answer: false,
    explanation: "링크에 내보내는 시간은 전송 지연이다. 큐잉 지연은 출력 링크에서 전송을 기다리는 시간이다."
  },
];
