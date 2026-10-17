// 근거: 수업자료 Chapter 1 Introduction (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 모의고사 2회",
  topic: "OX + 빈칸 + 회선/패킷 교환 · 데이터 단위"
};

const QUESTIONS = [

  // ===== 1번 OX (20문제) =====
  {
    category: "인터넷 구성",
    question: "통신 링크에는 유선 링크만 있고 무선이나 위성은 링크가 아니다.",
    answer: false,
    explanation: "광섬유, 구리선, 무선, 위성 모두 통신 링크이다."
  },
  {
    category: "인터넷 구성",
    question: "인터넷에서 라우터는 종단 시스템에 속한다.",
    answer: false,
    explanation: "라우터는 패킷 스위치이고 종단 시스템은 호스트이다."
  },
  {
    category: "프로토콜",
    question: "인터넷에서 일어나는 모든 통신 활동은 프로토콜의 지배를 받는다.",
    answer: true,
    explanation: "모든 통신 활동은 프로토콜로 규율된다."
  },
  {
    category: "접속망",
    question: "접속망을 평가할 때는 대역폭만 고려하면 충분하고 공유형인지 전용형인지는 상관없다.",
    answer: false,
    explanation: "접속망의 고려사항은 대역폭과 공유/전용 여부이다."
  },
  {
    category: "접속망",
    question: "WiFi(802.11)는 건물 내 무선 LAN이고 이동통신(3G, 4G LTE)은 통신사가 제공하는 넓은 지역의 무선 접속이다.",
    answer: true,
    explanation: "무선 LAN은 건물 내, 광역 무선 접속은 통신사가 수십 km 범위로 제공한다."
  },
  {
    category: "호스트",
    question: "호스트는 응용 메시지를 L비트 길이의 패킷으로 쪼개어 전송률 R로 접속망에 내보낸다.",
    answer: true,
    explanation: "패킷 전송 지연은 L/R이다."
  },
  {
    category: "엣지와 코어",
    question: "네트워크 코어의 주요 역할은 데이터를 생산하고 보유하는 것이다.",
    answer: false,
    explanation: "그것은 엣지의 역할이다. 코어는 데이터를 전달한다."
  },
  {
    category: "패킷 교환",
    question: "패킷 헤더에는 출발지 주소, 목적지 주소, 제어 정보가 들어 있다.",
    answer: true,
    explanation: "라우터는 이 정보로 경로를 정한다."
  },
  {
    category: "패킷 교환",
    question: "라우터는 전달 테이블에서 도착 패킷의 출발지 주소를 찾아 출력 링크를 정한다.",
    answer: false,
    explanation: "전달 테이블은 도착 패킷 헤더의 목적지 주소 값을 출력 링크에 대응시킨다."
  },
  {
    category: "패킷 교환",
    question: "패킷 교환은 통신 전에 반드시 전용 경로를 설정해야 한다.",
    answer: false,
    explanation: "전용 경로 설정은 회선 교환의 특징이다."
  },
  {
    category: "패킷 교환",
    question: "패킷 교환의 출력 링크 큐는 FIFO 방식이다.",
    answer: true,
    explanation: "요청 순서대로 처리하는 FIFO 큐이다."
  },
  {
    category: "회선 교환",
    question: "회선 교환에서 TDM은 주파수 대역을 나누어 사용자에게 할당한다.",
    answer: false,
    explanation: "TDM은 시간 슬롯으로 나눈다. 주파수 대역을 나누는 것은 FDM이다."
  },
  {
    category: "회선 교환",
    question: "회선 교환에서는 통신 중에 자원이 전용으로 할당되어 다른 사용자와 공유하지 않는다.",
    answer: true,
    explanation: "Dedicated resources: no sharing."
  },
  {
    category: "패킷 vs 회선",
    question: "활동 시간이 일부분인 사용자가 많을 때 패킷 교환은 회선 교환보다 더 많은 사용자를 수용할 수 있다.",
    answer: true,
    explanation: "패킷 교환은 사용자가 항상 활동하지 않는 점을 이용해 링크를 공유한다."
  },
  {
    category: "인터넷 구조",
    question: "고객 ISP와 제공자 ISP 사이에는 경제적 합의가 있다.",
    answer: true,
    explanation: "customer-provider 관계는 경제적 합의에 기반한다."
  },
  { category: "패킷 교환", question: "패킷 교환에서 버퍼가 가득 찬 상태로 도착한 패킷은 버려질 수 있다.",
    answer: true,
    explanation: "도착률 > 전송률이 이어지면 큐잉, 버퍼가 가득 차면 손실." },
  { category: "프로토콜 계층", question: "인터넷 프로토콜 스택에서 TCP와 UDP는 transport 계층의 프로토콜이다.",
    answer: true,
    explanation: "transport 계층: TCP, UDP. 프로세스 간 데이터 전송." },
  { category: "회선 교환", question: "회선 교환에서는 사용자가 쉬는 동안 할당된 자원을 다른 사용자가 대신 쓸 수 있다.",
    answer: false,
    explanation: "회선 교환은 자원을 전용으로 할당하므로 쉬는 동안에도 다른 사용자가 쓸 수 없다(idle). 공유는 패킷 교환의 특징이다." },
  {
    category: "프로토콜 계층",
    question: "계층화에서는 한 계층의 구현이 바뀌면 나머지 계층도 모두 수정해야 한다.",
    answer: false,
    explanation: "모듈화 덕분에 한 계층의 구현 변경은 나머지 시스템에 투명하다."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택에서 네트워크 계층은 이더넷과 WiFi를 사용하는 계층이다.",
    answer: false,
    explanation: "이더넷, 802.11, PPP는 링크 계층이다. 네트워크 계층은 IP와 라우팅 프로토콜이다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "엣지와 코어",
    question: "서버가 모여 있는 시설을 흔히 데이터 (        )라 한다.",
    answers: ["센터", "데이터센터", "데이터 센터", "center"],
    displayAnswer: "센터(데이터 센터)",
    explanation: "서버는 흔히 데이터 센터에 있다."
  },
  {
    category: "회선 교환",
    question: "회선 교환에서 연결 설정, 데이터 전송 다음에 오는 마지막 단계는 연결 (        )이다.",
    answers: ["해제", "연결 해제", "종료", "release"],
    displayAnswer: "해제",
    explanation: "3단계는 연결 설정, 데이터 전송, 연결 해제이다."
  },
  {
    category: "패킷 교환",
    question: "패킷 교환에서 패킷 전체가 도착해야 다음 링크로 내보낼 수 있는 방식을 (        ) 방식이라 한다.",
    answers: ["저장 후 전달", "저장후전달", "store and forward", "store-and-forward", "저장 후 전송"],
    displayAnswer: "저장 후 전달(store-and-forward)",
    explanation: "라우터는 패킷 전체를 받은 뒤 출력 링크로 전송한다."
  },
  {
    category: "인터넷 구조",
    question: "서로 경쟁하는 ISP들을 연결하는 지점을 인터넷 (        ) 포인트라 한다.",
    answers: ["익스체인지", "교환", "exchange", "교환 지점"],
    displayAnswer: "익스체인지(exchange)",
    explanation: "IXP(Internet eXchange Point)는 피어링 링크로 ISP들을 연결한다."
  },
  { category: "패킷 교환", question: "라우터 안에서 입력 링크의 패킷을 적절한 출력 링크로 옮기는 것을 (        )이라 한다.",
    answers: ["포워딩", "forwarding", "전달", "포워드"],
    displayAnswer: "포워딩",
    hint: "routing과 짝",
    explanation: "forwarding(로컬) vs routing(경로 결정)." },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택에서 선 위를 흐르는 비트 자체를 다루는 계층은 (        ) 계층이다.",
    answers: ["물리", "물리 계층", "physical"],
    displayAnswer: "물리",
    explanation: "물리 계층은 bits on the wire를 담당한다."
  },

  // ===== 3번 교환 방식 (4문제) =====
  { category: "회선 교환", question: "회선 교환에서 링크를 주파수 대역으로 나누는 다중화 방식은 (        )이다. (약어)",
    answers: ["fdm", "frequency division multiplexing", "주파수 분할 다중화", "주파수분할다중화"],
    displayAnswer: "FDM",
    hint: "Frequency ...",
    explanation: "FDM = 주파수 분할, TDM = 시간 분할." },
  { category: "회선 교환", question: "회선 교환의 첫 번째 단계는 연결 (        )이다.",
    answers: ["설정", "수립", "setup", "확립"],
    displayAnswer: "설정",
    hint: "통신 전에 먼저",
    explanation: "회선 교환: 연결 설정 → 데이터 전송 → 연결 해제." },
  { category: "패킷 교환", question: "패킷 교환에서 출력 링크로의 도착률이 전송률보다 크면 패킷은 (        )에서 기다린다.",
    answers: ["큐", "버퍼", "queue", "buffer", "대기열", "큐(버퍼)"],
    displayAnswer: "큐(버퍼)",
    hint: "queue",
    explanation: "도착률 > 전송률이면 큐(버퍼)에서 대기, 가득 차면 손실." },
  { category: "엣지와 코어", question: "네트워크 엣지의 호스트는 클라이언트와 (        )로 나뉜다.",
    answers: ["서버", "server"],
    displayAnswer: "서버",
    hint: "데이터 센터에 있음",
    explanation: "호스트 = 클라이언트 + 서버, 서버는 주로 데이터 센터에 있다." },

  // ===== 4번 엣지 · 접속망 (2문제) =====
  { category: "접속망", question: "무선 LAN에서 종단 시스템을 라우터에 연결하는 기지국을 (        )라 한다.",
    answers: ["액세스 포인트", "액세스포인트", "access point", "ap", "접속점"],
    displayAnswer: "액세스 포인트(AP)",
    hint: "AP",
    explanation: "무선 LAN(WiFi)은 access point를 통해 접속한다." },
  { category: "캡슐화", question: "인터넷 스택에서 응용 계층의 데이터 단위는 (        )이다.",
    answers: ["메시지", "메세지", "message"],
    displayAnswer: "메시지",
    hint: "message",
    explanation: "응용 = Message." },

  // ===== 5번 데이터 단위 · 계층 (3문제) =====
  { category: "캡슐화", question: "인터넷 스택에서 네트워크 계층의 데이터 단위는 (        )이다.",
    answers: ["데이터그램", "datagram", "데이타그램"],
    displayAnswer: "데이터그램(Datagram)",
    hint: "data...",
    explanation: "네트워크 계층 = Datagram." },
  { category: "프로토콜 계층", question: "스위치는 인터넷 스택의 (        ) 계층까지 처리한다.",
    answers: ["링크", "링크 계층", "링크계층", "link", "link layer", "데이터 링크", "데이터링크"],
    displayAnswer: "링크",
    hint: "라우터보다 한 단계 아래",
    explanation: "스위치는 link까지, 라우터는 network까지." },
  { category: "프로토콜 계층", question: "계층화의 장점 중 한 계층의 구현을 바꿔도 다른 계층에 영향이 없게 하는 성질을 (        )라 한다.",
    answers: ["모듈화", "모듈성", "modularization", "modularity"],
    displayAnswer: "모듈화",
    hint: "module",
    explanation: "계층화 이유: 구조 식별, 모듈화로 유지보수·갱신 용이." },
];
