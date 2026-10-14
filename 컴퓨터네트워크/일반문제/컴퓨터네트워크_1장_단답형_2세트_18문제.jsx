// 컴퓨터네트워크_1장_단답형_2세트_18문제.jsx
// 근거: 수업자료 Chapter 1 Introduction
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 Introduction 단답형 2세트 18문제"
};

const SA_QUESTIONS = [
  {
    category: "노달 지연",
    question: "dnodal = dproc + dqueue + dtrans + (    ) 에서 빈칸에 들어갈 지연은?",
    answers: ["dprop", "전파 지연", "전파지연", "propagation delay", "propagation", "전파"],
    displayAnswer: "dprop(전파 지연)",
    explanation: "노달 지연은 처리, 큐잉, 전송, 전파 지연의 합이다."
  },
  {
    category: "전송 지연",
    question: "길이 1000비트인 패킷을 1 Mbps 링크로 전송할 때 전송 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1ms", "1 ms", "1.0ms", "1.0 ms", "1.00ms", "1.00 ms", "1밀리초", "1 밀리초", "1.0밀리초", "1.0 밀리초", "1.00밀리초", "1.00 밀리초", "1msec", "1 msec", "1.0msec", "1.0 msec", "1.00msec", "1.00 msec"],
    displayAnswer: "1ms",
    hint: "L/R",
    explanation: "dtrans = L/R = 1000/10^6 = 0.001초 = 1ms이다."
  },
  {
    category: "전송 지연",
    question: "길이 5000비트인 패킷을 10 Mbps 링크로 전송할 때 전송 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["0.5", "0.50", "0.500", "0.5ms", "0.5 ms", "0.50ms", "0.50 ms", "0.500ms", "0.500 ms", "0.5밀리초", "0.5 밀리초", "0.50밀리초", "0.50 밀리초", "0.500밀리초", "0.500 밀리초", "0.5msec", "0.5 msec", "0.50msec", "0.50 msec", "0.500msec", "0.500 msec", ".5", ".5ms", ".5 ms"],
    displayAnswer: "0.5ms",
    hint: "L/R",
    explanation: "5000/(10×10^6)=0.0005초=0.5ms이다."
  },
  {
    category: "전파 지연",
    question: "링크 길이가 2000km이고 전파 속도가 2×10^8 m/sec일 때 전파 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["10", "10.0", "10.00", "10ms", "10 ms", "10.0ms", "10.0 ms", "10.00ms", "10.00 ms", "10밀리초", "10 밀리초", "10.0밀리초", "10.0 밀리초", "10.00밀리초", "10.00 밀리초", "10msec", "10 msec", "10.0msec", "10.0 msec", "10.00msec", "10.00 msec"],
    displayAnswer: "10ms",
    hint: "d/s, 단위 변환 주의",
    explanation: "dprop = d/s = (2×10^6 m)/(2×10^8 m/s) = 0.01초 = 10ms이다."
  },
  {
    category: "저장 후 전달",
    question: "출발지에서 목적지까지 링크가 3개(라우터 2개)이고 각 링크 전송률이 1 Mbps이다. 12000비트 패킷 1개를 저장 후 전달 방식으로 보낼 때 종단 간 전송 시간은 몇 ms인가? (전송 지연만 고려, 숫자만 입력)",
    answers: ["36", "36.0", "36.00", "36ms", "36 ms", "36.0ms", "36.0 ms", "36.00ms", "36.00 ms", "36밀리초", "36 밀리초", "36.0밀리초", "36.0 밀리초", "36.00밀리초", "36.00 밀리초", "36msec", "36 msec", "36.0msec", "36.0 msec", "36.00msec", "36.00 msec"],
    displayAnswer: "36ms",
    hint: "링크마다 L/R",
    explanation: "링크마다 12000/10^6=12ms가 걸리고 링크가 3개이므로 3×12=36ms다."
  },
  {
    category: "큐잉 지연",
    question: "트래픽 강도 La/R에서 R은 무엇을 나타내는가?",
    answers: ["링크 대역폭", "링크대역폭", "대역폭", "링크 전송률", "링크 용량", "link bandwidth", "bandwidth", "전송률"],
    displayAnswer: "링크 대역폭(전송률)",
    explanation: "a는 평균 패킷 도착률, L은 패킷 길이, R은 링크 대역폭이다."
  },
  {
    category: "큐",
    question: "라우터 출력 링크에서 대기하는 패킷들이 사용하는 큐의 방식은? (영문 약어)",
    answers: ["fifo", "선입선출", "선입 선출"],
    displayAnswer: "FIFO",
    explanation: "패킷 교환의 출력 링크에서는 FIFO 큐를 사용한다."
  },
  {
    category: "호스트",
    question: "호스트가 응용 메시지를 L비트 길이로 잘게 나눈 데이터 덩어리를 무엇이라 하는가?",
    answers: ["패킷", "packet"],
    displayAnswer: "패킷",
    explanation: "호스트의 송신 기능은 메시지를 패킷으로 나눠 전송률 R로 액세스 네트워크에 보내는 것이다."
  },
  {
    category: "액세스 네트워크",
    question: "무선 LAN에서 기지국(base station)을 부르는 다른 이름은?",
    answers: ["액세스 포인트", "access point", "ap", "엑세스 포인트", "억세스 포인트"],
    displayAnswer: "액세스 포인트(AP)",
    explanation: "무선 LAN은 base station, 곧 access point를 통해 라우터에 연결된다."
  },
  {
    category: "액세스 네트워크",
    question: "통신사가 제공하는 광역 무선 접속 기술인 3G 다음 세대의 대표 이름은?",
    answers: ["lte", "4g", "4g lte", "4g(lte)", "lte(4g)"],
    displayAnswer: "4G (LTE)",
    explanation: "Wide-area wireless access는 3G, 4G: LTE다."
  },
  {
    category: "회선 교환",
    question: "회선 교환의 3단계 중 첫 번째 단계는 무엇인가?",
    answers: ["연결 설정", "연결설정", "connection establishment", "연결 수립", "연결 확립", "호 설정"],
    displayAnswer: "연결 설정(Connection Establishment)",
    explanation: "연결 설정, 데이터 전송, 연결 해제 순서다."
  },
  {
    category: "인터넷 구조",
    question: "경쟁하는 ISP들을 피어링 링크로 서로 연결해 주는 지점을 가리키는 약어는?",
    answers: ["ixp", "internet exchange point", "인터넷 교환 지점", "인터넷 익스체인지 포인트", "인터넷 교환점"],
    displayAnswer: "IXP(Internet Exchange Point)",
    explanation: "ISP들은 IXP에서 peering link로 연결된다."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택에서 유선 LAN의 대표적인 링크 계층 프로토콜은?",
    answers: ["이더넷", "ethernet", "에더넷"],
    displayAnswer: "이더넷(Ethernet)",
    explanation: "링크 계층 예로 Ethernet, 802.11(WiFi), PPP가 있다."
  },
  {
    category: "프로토콜 계층",
    question: "한 계층의 구현이 바뀌어도 나머지 시스템에 영향을 주지 않도록 시스템을 나누는 계층화의 이점은?",
    answers: ["모듈화", "모듈성", "modularization", "modularity", "모듈화 용이"],
    displayAnswer: "모듈화(Modularization)",
    explanation: "모듈화는 유지보수와 갱신을 쉽게 한다."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택에서 프로세스 간 데이터 전송을 담당하는 계층은?",
    answers: ["전송", "전송 계층", "전송계층", "transport", "transport layer"],
    displayAnswer: "전송 계층",
    explanation: "transport: process-process data transfer이며 TCP, UDP가 있다."
  },
  {
    category: "캡슐화",
    question: "응용 계층 데이터에 하위 계층이 헤더를 차례로 덧붙이는 과정을 무엇이라 하는가?",
    answers: ["캡슐화", "encapsulation", "인캡슐레이션"],
    displayAnswer: "캡슐화(Encapsulation)",
    explanation: "송신 측은 계층을 내려가며 헤더를 붙인다."
  },
  {
    category: "캡슐화",
    question: "응용 계층의 데이터 단위 이름은?",
    answers: ["메시지", "message"],
    displayAnswer: "메시지(Message)",
    explanation: "응용 계층은 메시지, 전송 계층은 세그먼트다."
  },
  {
    category: "네트워크 구조",
    question: "네트워크 코어를 이루며 데이터를 전달하는 대표적인 장치는?",
    answers: ["라우터", "router"],
    displayAnswer: "라우터",
    explanation: "Core는 데이터 전달, Edge는 데이터 생산, 보유, 이용을 담당한다."
  },
];
