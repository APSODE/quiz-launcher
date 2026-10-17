// 컴퓨터네트워크_1장_단답형_2세트_18문제.jsx
// 근거: 수업자료 Chapter 1 Introduction
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 Introduction 단답형 2세트 18문제"
};

const SA_QUESTIONS = [
  { category: "인터넷 구조", question: "네트워크의 가장자리에서 네트워크 응용을 실행하는 장치를 무엇이라 하는가? (호스트의 다른 이름)",
    answers: ["종단 시스템", "종단시스템", "end system", "end systems", "엔드 시스템", "단말 시스템"],
    displayAnswer: "종단 시스템(end system)",
    hint: "end ...",
    explanation: "host = end system: 네트워크 앱을 실행하는 연결 장치." },
  { category: "인터넷 구조", question: "통신 링크의 종류(fiber, copper, radio, satellite) 중 빛을 이용하는 것은? (한글)",
    answers: ["광섬유", "광 섬유", "fiber", "fibre", "광케이블", "광 케이블"],
    displayAnswer: "광섬유(fiber)",
    hint: "fiber",
    explanation: "통신 링크: fiber(광섬유), copper(구리선), radio(무선), satellite(위성). 전송률 = bandwidth." },
  { category: "회선 교환", question: "회선 교환에서 링크 자원은 사용자 사이에 공유되는가, 전용으로 할당되는가? (두 글자)",
    answers: ["전용", "전용 할당", "전용할당", "dedicated"],
    displayAnswer: "전용",
    hint: "dedicated",
    explanation: "회선 교환은 전용 자원(공유 없음), 패킷 교환은 자원 공유." },
  { category: "패킷 교환", question: "라우터 안에서 입력 링크로 들어온 패킷을 적절한 출력 링크로 옮기는 동작은?",
    answers: ["포워딩", "forwarding", "전달", "포워드"],
    displayAnswer: "포워딩(forwarding)",
    hint: "routing과 짝",
    explanation: "forwarding = 라우터 입력 → 적절한 출력 링크(로컬), routing = 출발지–목적지 경로 결정." },
  { category: "패킷 교환", question: "출발지에서 목적지까지 패킷이 지나갈 경로를 결정하는 것은?",
    answers: ["라우팅", "routing", "경로 설정", "경로설정", "경로 결정", "경로결정"],
    displayAnswer: "라우팅(routing)",
    hint: "route",
    explanation: "routing = 출발지–목적지 경로 결정, 라우팅 알고리즘이 포워딩 테이블을 채운다." },
  { category: "프로토콜 계층", question: "인터넷 프로토콜 스택에서 datagram을 출발지에서 목적지까지 라우팅하는 계층은?",
    answers: ["네트워크", "네트워크 계층", "네트워크계층", "network", "network layer"],
    displayAnswer: "네트워크(network) 계층",
    hint: "IP가 속한 계층",
    explanation: "network 계층: datagram 라우팅(IP, 라우팅 프로토콜)." },
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
