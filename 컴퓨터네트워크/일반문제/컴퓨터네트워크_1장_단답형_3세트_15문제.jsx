// 컴퓨터네트워크_1장_단답형_3세트_15문제.jsx
// 근거: 수업자료 Chapter 1 Introduction
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 Introduction 단답형 3세트 15문제"
};

const SA_QUESTIONS = [
  {
    category: "접속망",
    question: "종단 시스템을 가장자리 라우터에 연결하는 네트워크를 무엇이라 하는가?",
    answers: ["접속망", "액세스 네트워크", "access network", "접속 네트워크", "엑세스 네트워크", "액세스망", "억세스 네트워크"],
    displayAnswer: "접속망(Access network)",
    explanation: "가정, 기관(학교, 회사), 모바일 접속망 등이 있다."
  },
  {
    category: "엣지와 코어",
    question: "PC, 노트북, 서버, 스마트폰처럼 데이터를 생산하고 이용하는 네트워크 영역은?",
    answers: ["네트워크 엣지", "엣지", "network edge", "edge", "네트워크 가장자리", "에지", "네트워크 에지"],
    displayAnswer: "네트워크 엣지",
    explanation: "라우터가 데이터를 전달하는 중심부는 네트워크 코어다."
  },
  {
    category: "엣지와 코어",
    question: "라우터들이 서로 연결되어 데이터를 전달하는 네트워크의 중심부를 무엇이라 하는가?",
    answers: ["네트워크 코어", "코어", "network core", "core", "네트워크 중심부"],
    displayAnswer: "네트워크 코어",
    explanation: "코어는 상호 연결된 라우터들의 망이다."
  },
  {
    category: "프로토콜",
    question: "프로토콜은 메시지의 형식과 (    ), 그리고 메시지 송수신 시 취하는 행동을 정의한다. 빈칸은?",
    answers: ["순서", "전송 순서", "송수신 순서", "메시지 순서", "order"],
    displayAnswer: "순서",
    explanation: "format, order, actions taken의 세 요소다."
  },
  {
    category: "라우팅과 포워딩",
    question: "라우터가 패킷 헤더 값을 보고 출력 링크를 찾는 데 쓰는 표는?",
    answers: ["포워딩 테이블", "포워딩테이블", "forwarding table", "전달 테이블", "로컬 포워딩 테이블", "local forwarding table"],
    displayAnswer: "포워딩 테이블",
    explanation: "라우팅 알고리즘이 이 표의 내용을 정한다."
  },
  {
    category: "회선 교환",
    question: "회선 교환에서는 송신 장치와 수신 장치 사이에 어떤 경로가 설정되는가?",
    answers: ["전용 경로", "전용", "전용 회선", "전용 경로 설정", "dedicated path", "dedicated", "전용경로"],
    displayAnswer: "전용 경로",
    explanation: "자원을 전용으로 할당하며 공유하지 않는다."
  },
  {
    category: "패킷 교환",
    question: "패킷 헤더에는 출발지 주소, 목적지 주소와 함께 어떤 정보가 들어 있는가?",
    answers: ["제어 정보", "제어정보", "control information", "control info", "제어"],
    displayAnswer: "제어 정보",
    explanation: "각 패킷은 독립적으로 라우팅된다."
  },
  {
    category: "지연",
    question: "큐잉 지연의 크기는 라우터의 무엇에 따라 달라지는가?",
    answers: ["혼잡", "혼잡 수준", "혼잡도", "혼잡 정도", "congestion", "congestion level", "혼잡 수준(정도)"],
    displayAnswer: "혼잡 수준",
    explanation: "트래픽 강도 La/R이 1에 가까울수록 커진다."
  },
  {
    category: "전송 지연",
    question: "패킷 길이 2000비트를 2 Mbps 링크로 전송할 때 전송 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1ms", "1 ms", "1.0ms", "1.0 ms", "1.00ms", "1.00 ms", "1밀리초", "1 밀리초", "1.0밀리초", "1.0 밀리초", "1.00밀리초", "1.00 밀리초", "1msec", "1 msec", "1.0msec", "1.0 msec", "1.00msec", "1.00 msec"],
    displayAnswer: "1ms",
    hint: "L/R",
    explanation: "L/R = 2000/(2×10^6) = 0.001초 = 1ms."
  },
  {
    category: "저장 후 전달",
    question: "링크 2개(라우터 1개)로 연결된 경로에서 전송 지연이 각각 1ms인 패킷 2개를 연달아 보낸다. 저장 후 전달 방식에서 두 번째 패킷이 목적지에 완전히 도착하는 시각은 몇 ms인가? (전송 지연만 고려, 첫 패킷 전송 시작 시각 0, 숫자만 입력)",
    answers: ["3", "3.0", "3.00", "3ms", "3 ms", "3.0ms", "3.0 ms", "3.00ms", "3.00 ms", "3밀리초", "3 밀리초", "3.0밀리초", "3.0 밀리초", "3.00밀리초", "3.00 밀리초", "3msec", "3 msec", "3.0msec", "3.0 msec", "3.00msec", "3.00 msec"],
    displayAnswer: "3ms",
    hint: "라우터는 패킷 전체를 받은 뒤 전송",
    explanation: "첫 링크에서 패킷1은 0~1, 패킷2는 1~2ms에 전송된다. 라우터는 패킷1을 1~2, 패킷2를 2~3ms에 전달하므로 패킷2는 3ms에 도착한다."
  },
  {
    category: "전파 지연",
    question: "링크 길이가 1000km이고 전파 속도가 2×10^8 m/sec일 때 전파 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["5", "5.0", "5.00", "5ms", "5 ms", "5.0ms", "5.0 ms", "5.00ms", "5.00 ms", "5밀리초", "5 밀리초", "5.0밀리초", "5.0 밀리초", "5.00밀리초", "5.00 밀리초", "5msec", "5 msec", "5.0msec", "5.0 msec", "5.00msec", "5.00 msec"],
    displayAnswer: "5ms",
    hint: "d/s",
    explanation: "d/s = (10^6 m)/(2×10^8 m/s) = 0.005초 = 5ms."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택에서 데이터그램을 출발지에서 목적지까지 라우팅하는 계층은?",
    answers: ["네트워크", "네트워크 계층", "네트워크계층", "network", "network layer"],
    displayAnswer: "네트워크 계층",
    explanation: "IP와 라우팅 프로토콜이 이 계층에 속한다."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택에서 물리 계층이 다루는 것은 선 위의 무엇인가?",
    answers: ["비트", "bits", "bit", "bits on the wire"],
    displayAnswer: "비트",
    explanation: "bits on the wire."
  },
  {
    category: "프로토콜 계층",
    question: "OSI의 표현·세션 서비스가 인터넷 스택에서 필요할 때 이를 구현하는 계층은?",
    answers: ["응용", "응용 계층", "응용계층", "application", "application layer"],
    displayAnswer: "응용 계층",
    explanation: "인터넷 스택에는 표현, 세션 계층이 없으므로 응용에서 구현한다."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택에서 라우터가 처리하는 가장 높은 계층은?",
    answers: ["네트워크", "네트워크 계층", "네트워크계층", "network", "network layer", "3계층"],
    displayAnswer: "네트워크 계층",
    explanation: "스위치는 링크 계층까지, 라우터는 네트워크 계층까지 처리한다."
  },
];
