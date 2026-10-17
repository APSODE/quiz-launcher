// 근거: 수업자료 Chapter 1 Introduction (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 모의고사 1회",
  topic: "OX + 빈칸 + 교환 방식 · 계층 개념"
};

const QUESTIONS = [

  // ===== 1번 OX (20문제) =====
  {
    category: "인터넷 구성",
    question: "인터넷의 종단 시스템(호스트)은 네트워크 응용을 실행한다.",
    answer: true,
    explanation: "호스트는 종단 시스템이며 네트워크 응용을 실행하는 장치이다."
  },
  {
    category: "인터넷 구성",
    question: "라우터와 스위치는 종단 시스템(호스트)의 일종이다.",
    answer: false,
    explanation: "라우터와 스위치는 패킷을 전달하는 패킷 스위치이다."
  },
  {
    category: "인터넷 구성",
    question: "링크의 전송 속도를 나타내는 대역폭의 단위는 미터(m)이다.",
    answer: false,
    explanation: "전송 속도(대역폭)의 단위는 bps(초당 비트 수)이다."
  },
  {
    category: "프로토콜",
    question: "프로토콜은 메시지의 형식과 순서, 그리고 메시지 송수신 시 취할 동작을 정의한다.",
    answer: true,
    explanation: "프로토콜의 정의 그대로이다."
  },
  {
    category: "프로토콜",
    question: "프로토콜은 사람 사이의 의사소통에는 존재하지 않고 기계 사이에만 존재한다.",
    answer: false,
    explanation: "사람의 인사나 질문 같은 규약도 프로토콜의 비유로 제시되었다."
  },
  {
    category: "접속망",
    question: "기업이나 대학의 접속망에서는 이더넷 스위치를 통해 종단 시스템이 연결되는 것이 일반적이다.",
    answer: true,
    explanation: "기관 접속망은 주로 이더넷이며 종단 시스템이 이더넷 스위치에 연결된다."
  },
  {
    category: "접속망",
    question: "무선 LAN(WiFi)은 기지국 역할을 하는 액세스 포인트를 통해 종단 시스템을 라우터에 연결한다.",
    answer: true,
    explanation: "공유 무선 접속망은 기지국(액세스 포인트)을 통해 연결된다."
  },
  {
    category: "엣지와 코어",
    question: "라우터는 네트워크 엣지에 속하고 서버와 PC는 네트워크 코어에 속한다.",
    answer: false,
    explanation: "엣지는 PC, 노트북, 서버, 스마트폰이고 코어는 라우터이다."
  },
  {
    category: "패킷 교환",
    question: "패킷 교환에서 각 패킷은 독립적으로 라우팅된다.",
    answer: true,
    explanation: "각 패킷은 헤더의 주소 정보를 가지고 독립적으로 경로가 정해진다."
  },
  {
    category: "패킷 교환",
    question: "저장 후 전달 방식에서는 패킷의 첫 비트가 도착하는 즉시 다음 링크로 전송을 시작한다.",
    answer: false,
    explanation: "패킷 전체가 도착해야 다음 링크로 전송할 수 있다."
  },
  {
    category: "패킷 교환",
    question: "출력 링크의 도착률이 전송 속도를 일정 기간 초과하면 패킷은 큐에서 대기하며 큐가 가득 차면 손실될 수 있다.",
    answer: true,
    explanation: "큐잉과 손실이 발생하는 원인이다."
  },
  {
    category: "회선 교환",
    question: "회선 교환은 연결 설정, 데이터 전송, 연결 해제의 3단계로 이루어진다.",
    answer: true,
    explanation: "전용 경로를 설정한 뒤 통신하고 해제한다."
  },
  {
    category: "회선 교환",
    question: "회선 교환은 자원을 사용자 사이에 공유하므로 사용자가 많아져도 성능 저하가 없다.",
    answer: false,
    explanation: "자원을 공유하지 않고 전용으로 할당하므로 수용 사용자 수가 제한된다."
  },
  {
    category: "회선 교환",
    question: "회선 교환에서 라우터 내부 동작은 입력 링크에서 출력 링크로 바로 전달하며 큐를 두지 않는다.",
    answer: true,
    explanation: "회선 교환은 저장 후 전달이 없고 큐도 없다."
  },
  {
    category: "인터넷 구조",
    question: "접속 ISP들을 모두 서로 직접 연결하면 연결 수가 O(N²)로 늘어나 확장성이 없다.",
    answer: true,
    explanation: "그래서 글로벌 ISP, IXP, 지역 네트워크 같은 구조가 등장했다."
  },
  {
    category: "인터넷 구조",
    question: "IXP는 종단 시스템을 라우터에 연결해 주는 접속망이다.",
    answer: false,
    explanation: "IXP는 경쟁하는 ISP들을 피어링 링크로 상호 연결하는 지점이다."
  },
  { category: "프로토콜 계층", question: "인터넷 프로토콜 스택은 application, transport, network, link, physical의 5계층이다.",
    answer: true,
    explanation: "인터넷 스택 5계층. OSI의 presentation·session은 없고 필요하면 응용에서 구현한다." },
  { category: "프로토콜 계층", question: "스위치는 network 계층까지 처리하여 IP 주소로 경로를 정한다.",
    answer: false,
    explanation: "스위치는 link 계층까지, 라우터가 network 계층까지 처리한다." },
  { category: "접속망", question: "WiFi(802.11)는 통신사가 제공하는 수십 km 범위의 광역 무선 접속이다.",
    answer: false,
    explanation: "WiFi는 건물 안 무선 LAN(약 100ft). 수십 km 범위는 셀룰러 광역 무선 접속(1~10Mbps)이다." },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택에서 링크 계층은 프로세스 사이의 데이터 전송을 담당한다.",
    answer: false,
    explanation: "프로세스 간 전송은 전송 계층이다. 링크 계층은 근접한 네트워크 요소 사이의 전송을 담당한다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "접속망",
    question: "무선 접속에서 종단 시스템과 라우터를 이어 주는 기지국을 다른 말로 (        )라 한다.",
    answers: ["액세스 포인트", "access point", "accesspoint", "ap", "엑세스 포인트", "액세스포인트"],
    displayAnswer: "액세스 포인트(access point)",
    explanation: "기지국은 액세스 포인트라고도 부른다."
  },
  {
    category: "패킷 교환",
    question: "라우터가 어떤 경로로 보낼지 알고리즘으로 경로를 정하는 일을 (        )이라 하고 입력에서 출력 링크로 옮기는 일을 포워딩이라 한다.",
    answers: ["라우팅", "routing"],
    displayAnswer: "라우팅",
    explanation: "라우팅은 출발지-목적지 경로를 결정하고 포워딩은 패킷을 출력 링크로 옮기는 일이다."
  },
  {
    category: "회선 교환",
    question: "회선 교환에서 하나의 링크를 여러 사용자가 나누어 쓰는 방식 중 주파수 대역을 나누는 방식은 (        )이다.",
    answers: ["fdm", "주파수 분할 다중화", "주파수분할다중화", "주파수 분할"],
    displayAnswer: "FDM(주파수 분할 다중화)",
    explanation: "FDM은 주파수, TDM은 시간 슬롯으로 나눈다."
  },
  { category: "프로토콜 계층", question: "인터넷 프로토콜 스택에서 datagram을 출발지에서 목적지까지 라우팅하는 계층은 (        ) 계층이다.",
    answers: ["네트워크", "네트워크 계층", "네트워크계층", "network", "network layer"],
    displayAnswer: "네트워크",
    hint: "IP가 속한 계층",
    explanation: "network 계층: IP, 라우팅 프로토콜." },
  {
    category: "지연",
    question: "패킷이 가득 찬 큐에 도착했을 때 폐기되는 현상을 패킷 (        )이라 한다.",
    answers: ["손실", "loss", "패킷 손실"],
    displayAnswer: "손실",
    explanation: "손실된 패킷은 이전 노드나 출발지가 재전송하거나 재전송되지 않을 수도 있다."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택에서 프로세스 사이의 데이터 전송을 담당하는 계층은 (        ) 계층이다.",
    answers: ["전송", "전송 계층", "transport"],
    displayAnswer: "전송",
    explanation: "전송 계층은 TCP와 UDP를 사용한다."
  },

  // ===== 3번 교환 방식 (3문제) =====
  { category: "회선 교환", question: "회선 교환의 3단계는 연결 설정 → 데이터 전송 → 연결 (        )이다.",
    answers: ["해제", "종료", "끊기", "teardown"],
    displayAnswer: "해제",
    hint: "마지막 단계",
    explanation: "회선 교환: 연결 설정 → 데이터 전송 → 연결 해제." },
  { category: "회선 교환", question: "회선 교환에서 링크를 시간 슬롯으로 나누어 쓰는 다중화 방식은 (        )이다. (약어)",
    answers: ["tdm", "time division multiplexing", "시분할 다중화", "시분할다중화"],
    displayAnswer: "TDM",
    hint: "Time ...",
    explanation: "FDM = 주파수 분할, TDM = 시간 분할." },
  { category: "패킷 교환", question: "패킷 교환에서 출력 링크 큐가 패킷을 처리하는 순서는 (        )이다. (영문 약어)",
    answers: ["fifo", "first in first out", "선입선출", "선입 선출"],
    displayAnswer: "FIFO",
    hint: "먼저 온 것이 먼저",
    explanation: "패킷 교환의 출력 큐는 FIFO, 회선 교환에는 큐가 없다." },

  // ===== 4번 인터넷 구조 · 데이터 단위 (2문제) =====
  { category: "인터넷 구조", question: "ISP들이 서로 연결되는 지점을 (        )라 한다. (약어)",
    answers: ["ixp", "internet exchange point", "인터넷 교환 지점"],
    displayAnswer: "IXP",
    hint: "I?P",
    explanation: "IXP = Internet exchange point." },
  { category: "캡슐화", question: "인터넷 스택에서 전송 계층의 데이터 단위는 (        )이다.",
    answers: ["세그먼트", "segment", "세그멘트"],
    displayAnswer: "세그먼트(Segment)",
    hint: "seg...",
    explanation: "응용 Message, 전송 Segment, 네트워크 Datagram, 링크 Frame." },

  // ===== 5번 계층 (2문제) =====
  { category: "캡슐화", question: "인터넷 스택에서 링크 계층의 데이터 단위는 (        )이다.",
    answers: ["프레임", "frame"],
    displayAnswer: "프레임(Frame)",
    hint: "frame",
    explanation: "링크 계층 헤더 + datagram = Frame." },
  { category: "프로토콜 계층", question: "라우터는 인터넷 스택의 (        ) 계층까지 처리한다.",
    answers: ["네트워크", "네트워크 계층", "네트워크계층", "network", "network layer"],
    displayAnswer: "네트워크",
    hint: "스위치는 link까지",
    explanation: "라우터는 network 계층까지, 스위치는 link 계층까지 처리한다." },

  // ===== 6번 인터넷 구조 · 패킷 헤더 (2문제) =====
  { category: "인터넷 구조", question: "N개의 access ISP를 모두 서로 직접 연결하면 연결 수가 O(        )로 늘어나 확장할 수 없다. (N 기호로 쓰시오)",
    answers: ["n²", "n^2", "n2", "n*n", "n제곱", "n 제곱"],
    displayAnswer: "N²",
    hint: "N의 제곱",
    explanation: "모든 access ISP를 직접 연결하면 O(N²) 연결이 필요해 확장 불가 → global ISP, IXP 등으로 연결." },
  { category: "패킷 교환", question: "패킷 헤더에는 출발지 주소, 목적지 주소와 (        ) 정보가 들어 있다.",
    answers: ["제어", "제어 정보", "제어정보", "control", "control information"],
    displayAnswer: "제어",
    hint: "control",
    explanation: "패킷 헤더: 출발지·목적지 주소, 제어 정보. 패킷마다 독립적으로 라우팅된다." },
];
