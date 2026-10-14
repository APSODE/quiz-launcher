// 근거: 수업자료 Chapter 1 Introduction (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 모의고사 1회",
  topic: "OX + 빈칸 + 지연 계산"
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
  {
    category: "지연",
    question: "전파 지연은 패킷 길이 L을 링크 대역폭 R로 나눈 값이다.",
    answer: false,
    explanation: "L/R은 전송 지연이다. 전파 지연은 링크 길이 d를 전파 속도 s로 나눈 값이다."
  },
  {
    category: "지연",
    question: "트래픽 강도 La/R이 1을 넘으면 평균 큐잉 지연은 무한대가 된다.",
    answer: true,
    explanation: "서비스할 수 있는 양보다 더 많은 작업이 도착하기 때문이다."
  },
  {
    category: "지연",
    question: "트래픽 강도가 0에 가까우면 평균 큐잉 지연은 매우 크다.",
    answer: false,
    explanation: "La/R이 0에 가까우면 큐잉 지연이 작고 1에 가까워질수록 커진다."
  },
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
  {
    category: "지연",
    question: "노달 지연은 처리 지연, 큐잉 지연, 전송 지연, (        ) 지연의 합이다.",
    answers: ["전파", "전파 지연", "propagation"],
    displayAnswer: "전파",
    explanation: "dnodal = dproc + dqueue + dtrans + dprop 이다."
  },
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

  // ===== 3번 단일 링크 지연 (3문제) =====
  {
    category: "전송 지연",
    question: "패킷 길이는 8000비트이고 링크 전송률은 2 Mbps, 링크 길이는 1500 km, 전파 속도는 2×10^8 m/sec이다.\n전송 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["4", "4.0", "4.00", "4ms", "4 ms", "4.0ms", "4.0 ms", "4.00ms", "4.00 ms", "4밀리초", "4 밀리초", "4.0밀리초", "4.0 밀리초", "4.00밀리초", "4.00 밀리초", "4msec", "4 msec", "4.0msec", "4.0 msec", "4.00msec", "4.00 msec"],
    displayAnswer: "4 ms",
    explanation: "dtrans = L/R = 8000 / (2×10^6) = 0.004초 = 4 ms."
  },
  {
    category: "전파 지연",
    question: "패킷 길이는 8000비트이고 링크 전송률은 2 Mbps, 링크 길이는 1500 km, 전파 속도는 2×10^8 m/sec이다.\n전파 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["7.5", "7.50", "7.500", "7.5ms", "7.5 ms", "7.50ms", "7.50 ms", "7.500ms", "7.500 ms", "7.5밀리초", "7.5 밀리초", "7.50밀리초", "7.50 밀리초", "7.500밀리초", "7.500 밀리초", "7.5msec", "7.5 msec", "7.50msec", "7.50 msec", "7.500msec", "7.500 msec"],
    displayAnswer: "7.5 ms",
    explanation: "dprop = d/s = 1.5×10^6 / 2×10^8 = 0.0075초 = 7.5 ms."
  },
  {
    category: "노달 지연",
    question: "패킷 길이는 8000비트이고 링크 전송률은 2 Mbps, 링크 길이는 1500 km, 전파 속도는 2×10^8 m/sec이다.\n처리 지연과 큐잉 지연을 무시할 때, 패킷의 마지막 비트가 수신 측에 도착할 때까지 걸리는 시간은 몇 ms인가? (숫자만 입력)",
    answers: ["11.5", "11.50", "11.500", "11.5ms", "11.5 ms", "11.50ms", "11.50 ms", "11.500ms", "11.500 ms", "11.5밀리초", "11.5 밀리초", "11.50밀리초", "11.50 밀리초", "11.500밀리초", "11.500 밀리초", "11.5msec", "11.5 msec", "11.50msec", "11.50 msec", "11.500msec", "11.500 msec"],
    displayAnswer: "11.5 ms",
    explanation: "전송 지연 4 ms + 전파 지연 7.5 ms = 11.5 ms."
  },

  // ===== 4번 저장 후 전달 (2문제) =====
  {
    category: "저장 후 전달",
    question: "송신 호스트와 수신 호스트 사이에 라우터 2대가 있어 링크가 3개이고, 각 링크의 전송률은 1 Mbps이다. 패킷 길이는 5000비트이며 전파, 처리, 큐잉 지연은 무시한다. 라우터는 저장 후 전달 방식이다.\n패킷 1개가 송신 호스트에서 수신 호스트까지 가는 데 걸리는 총 시간은 몇 ms인가? (숫자만 입력)",
    answers: ["15", "15.0", "15.00", "15ms", "15 ms", "15.0ms", "15.0 ms", "15.00ms", "15.00 ms", "15밀리초", "15 밀리초", "15.0밀리초", "15.0 밀리초", "15.00밀리초", "15.00 밀리초", "15msec", "15 msec", "15.0msec", "15.0 msec", "15.00msec", "15.00 msec"],
    displayAnswer: "15 ms",
    explanation: "링크마다 5000/10^6 = 5 ms가 걸리고 링크가 3개이므로 15 ms."
  },
  {
    category: "저장 후 전달",
    question: "링크 2개(라우터 1대)를 지나는 경로에서 링크 전송률이 모두 1 Mbps이고 패킷 길이가 5000비트인 패킷 4개를 연속으로 보낸다. 라우터가 앞 패킷을 전달하는 동안 송신 호스트는 다음 패킷을 전송할 수 있다고 하고, 전파, 처리, 큐잉 지연은 무시할 때 4개가 모두 도착하는 데 걸리는 시간은 몇 ms인가? (숫자만 입력)",
    answers: ["25", "25.0", "25.00", "25ms", "25 ms", "25.0ms", "25.0 ms", "25.00ms", "25.00 ms", "25밀리초", "25 밀리초", "25.0밀리초", "25.0 밀리초", "25.00밀리초", "25.00 밀리초", "25msec", "25 msec", "25.0msec", "25.0 msec", "25.00msec", "25.00 msec"],
    displayAnswer: "25 ms",
    explanation: "첫 패킷이 도착하는 데 10 ms가 걸리고 이후 5 ms마다 한 개씩 도착하므로 10 + 3×5 = 25 ms. (N+1)×L/R = 5×5 = 25 ms."
  },

  // ===== 5번 노달 지연 합 (2문제) =====
  {
    category: "노달 지연",
    question: "처리 지연 0.2 ms, 큐잉 지연 1.8 ms, 전송 지연 3 ms, 전파 지연 5 ms인 한 노드의 노달 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["10", "10.0", "10.00", "10ms", "10 ms", "10.0ms", "10.0 ms", "10.00ms", "10.00 ms", "10밀리초", "10 밀리초", "10.0밀리초", "10.0 밀리초", "10.00밀리초", "10.00 밀리초", "10msec", "10 msec", "10.0msec", "10.0 msec", "10.00msec", "10.00 msec"],
    displayAnswer: "10 ms",
    explanation: "0.2 + 1.8 + 3 + 5 = 10 ms."
  },
  {
    category: "노달 지연",
    question: "한 노드에서 처리 지연 0.1 ms, 전송 지연 2 ms, 전파 지연 6 ms이고 노달 지연이 11 ms이다. 큐잉 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["2.9", "2.90", "2.900", "2.9ms", "2.9 ms", "2.90ms", "2.90 ms", "2.900ms", "2.900 ms", "2.9밀리초", "2.9 밀리초", "2.90밀리초", "2.90 밀리초", "2.900밀리초", "2.900 밀리초", "2.9msec", "2.9 msec", "2.90msec", "2.90 msec", "2.900msec", "2.900 msec"],
    displayAnswer: "2.9 ms",
    explanation: "큐잉 지연 = 11 - (0.1 + 2 + 6) = 2.9 ms."
  },

  // ===== 6번 트래픽 강도 (2문제) =====
  {
    category: "트래픽 강도",
    question: "링크 전송률 R = 1 Mbps, 패킷 길이 L = 1000비트, 평균 패킷 도착률 a = 800 패킷/초일 때 트래픽 강도 La/R은? (숫자만 입력)",
    answers: ["0.8", "0.80", "0.800"],
    displayAnswer: "0.8",
    explanation: "La/R = 1000 × 800 / 10^6 = 0.8이다."
  },
  {
    category: "트래픽 강도",
    question: "같은 링크에서 평균 패킷 도착률이 1500 패킷/초로 늘면 트래픽 강도는 1.5가 된다. 이때 평균 큐잉 지연은 어떻게 되는가?",
    answers: ["무한대", "무한", "무한히 커진다", "무한히 커짐", "infinite", "infinity", "∞", "발산"],
    displayAnswer: "무한대",
    explanation: "La/R > 1이면 처리 가능한 양보다 도착하는 양이 많아 평균 지연이 무한대가 된다."
  },
];
