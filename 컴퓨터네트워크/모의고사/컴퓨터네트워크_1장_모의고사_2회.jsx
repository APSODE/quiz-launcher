// 근거: 수업자료 Chapter 1 Introduction (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 모의고사 2회",
  topic: "OX + 빈칸 + 회선 교환 계산"
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
  {
    category: "지연",
    question: "큐잉 지연은 라우터의 혼잡 수준에 따라 달라진다.",
    answer: true,
    explanation: "출력 링크에서 전송을 기다리는 시간이므로 혼잡도에 의존한다."
  },
  {
    category: "지연",
    question: "전송 지연은 패킷 길이 L이 길수록 커진다.",
    answer: true,
    explanation: "dtrans = L/R이므로 L에 비례한다."
  },
  {
    category: "지연",
    question: "전송 지연과 전파 지연은 이름만 다를 뿐 같은 개념이다.",
    answer: false,
    explanation: "전송 지연은 패킷을 링크로 밀어 넣는 시간(L/R), 전파 지연은 링크를 따라 이동하는 시간(d/s)이다."
  },
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
  {
    category: "지연",
    question: "처리 지연에서는 비트 오류를 검사하는 것 외에 어느 (        ) 링크로 보낼지를 결정한다.",
    answers: ["출력", "output", "출력 링크"],
    displayAnswer: "출력",
    explanation: "처리 지연은 비트 오류 검사와 출력 링크 결정을 포함한다."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택에서 선 위를 흐르는 비트 자체를 다루는 계층은 (        ) 계층이다.",
    answers: ["물리", "물리 계층", "physical"],
    displayAnswer: "물리",
    explanation: "물리 계층은 bits on the wire를 담당한다."
  },

  // ===== 3번 회선 교환 계산 (4문제) =====
  {
    category: "회선 교환",
    question: "링크 전송률이 1.5 Mbps이고 TDM을 사용하며 한 프레임을 24개의 슬롯으로 나누어 슬롯 하나를 회선 하나에 할당한다.\n회선 하나가 사용할 수 있는 전송률은 몇 kbps인가? (숫자만 입력)",
    answers: ["62.5", "62.50", "62.500", "62.5kbps", "62.5 kbps", "62.50kbps", "62.50 kbps", "62.500kbps", "62.500 kbps", "62.5kb/s", "62.5 kb/s", "62.50kb/s", "62.50 kb/s", "62.500kb/s", "62.500 kb/s"],
    displayAnswer: "62.5 kbps",
    explanation: "1500 kbps / 24 = 62.5 kbps."
  },
  {
    category: "회선 교환",
    question: "링크 전송률이 1.5 Mbps이고 TDM을 사용하며 한 프레임을 24개의 슬롯으로 나누어 슬롯 하나를 회선 하나에 할당한다.\n이 회선으로 640,000비트 파일을 전송하는 데 걸리는 시간은 몇 초인가? (회선 설정 시간은 제외, 숫자만 입력)",
    answers: ["10.24", "10.240", "10.2400", "10.24s", "10.24 s", "10.240s", "10.240 s", "10.2400s", "10.2400 s", "10.24초", "10.24 초", "10.240초", "10.240 초", "10.2400초", "10.2400 초", "10.24sec", "10.24 sec", "10.240sec", "10.240 sec", "10.2400sec", "10.2400 sec"],
    displayAnswer: "10.24 초",
    explanation: "640000 / 62500 = 10.24초."
  },
  {
    category: "회선 교환",
    question: "링크 전송률이 1.5 Mbps이고 TDM을 사용하며 한 프레임을 24개의 슬롯으로 나누어 슬롯 하나를 회선 하나에 할당한다.\n회선 설정에 500 ms가 걸린다면 설정부터 파일 전송 완료까지 몇 초인가? (파일은 640,000비트, 숫자만 입력)",
    answers: ["10.74", "10.740", "10.7400", "10.74s", "10.74 s", "10.740s", "10.740 s", "10.7400s", "10.7400 s", "10.74초", "10.74 초", "10.740초", "10.740 초", "10.7400초", "10.7400 초", "10.74sec", "10.74 sec", "10.740sec", "10.740 sec", "10.7400sec", "10.7400 sec"],
    displayAnswer: "10.74 초",
    explanation: "0.5 + 10.24 = 10.74초."
  },
  {
    category: "회선 교환",
    question: "링크 전송률이 2 Mbps이고 회선교환으로 사용자마다 200 kbps를 전용 할당한다. 동시에 수용할 수 있는 사용자는 최대 몇 명인가? (숫자만 입력)",
    answers: ["10", "10.0", "10.00", "10명", "10 명", "10.0명", "10.0 명", "10.00명", "10.00 명"],
    displayAnswer: "10명",
    explanation: "2000 kbps / 200 kbps = 10명."
  },

  // ===== 4번 메시지 분할 (2문제) =====
  {
    category: "저장 후 전달",
    question: "송신 호스트와 수신 호스트 사이에 링크가 3개(라우터 2대)이고 각 링크 전송률은 2 Mbps이다. 전파, 처리, 큐잉 지연은 무시하고 라우터는 저장 후 전달 방식이다. 보낼 메시지의 크기는 24000비트이다.\n메시지를 분할하지 않고 통째로 보낼 때 수신 호스트에 도착하는 시간은 몇 ms인가? (숫자만 입력)",
    answers: ["36", "36.0", "36.00", "36ms", "36 ms", "36.0ms", "36.0 ms", "36.00ms", "36.00 ms", "36밀리초", "36 밀리초", "36.0밀리초", "36.0 밀리초", "36.00밀리초", "36.00 밀리초", "36msec", "36 msec", "36.0msec", "36.0 msec", "36.00msec", "36.00 msec"],
    displayAnswer: "36 ms",
    explanation: "링크 하나에 24000/2×10^6 = 12 ms가 걸리고 링크가 3개이므로 36 ms."
  },
  {
    category: "저장 후 전달",
    question: "송신 호스트와 수신 호스트 사이에 링크가 3개(라우터 2대)이고 각 링크 전송률은 2 Mbps이다. 전파, 처리, 큐잉 지연은 무시하고 라우터는 저장 후 전달 방식이다. 보낼 메시지의 크기는 24000비트이다.\n메시지를 8000비트 패킷 3개로 나누어 연속 전송하고, 라우터가 앞 패킷을 전달하는 동안 다음 패킷을 받을 수 있다면 모두 도착하는 데 걸리는 시간은 몇 ms인가? (숫자만 입력)",
    answers: ["20", "20.0", "20.00", "20ms", "20 ms", "20.0ms", "20.0 ms", "20.00ms", "20.00 ms", "20밀리초", "20 밀리초", "20.0밀리초", "20.0 밀리초", "20.00밀리초", "20.00 밀리초", "20msec", "20 msec", "20.0msec", "20.0 msec", "20.00msec", "20.00 msec"],
    displayAnswer: "20 ms",
    explanation: "패킷 하나의 전송 지연은 4 ms이다. 첫 패킷이 12 ms에 도착하고 이후 4 ms마다 하나씩 도착하므로 12 + 2×4 = 20 ms."
  },

  // ===== 5번 전파 지연·단위 변환 (3문제) =====
  {
    category: "전파 지연",
    question: "링크 길이가 36,000 km이고 전파 속도가 2×10^8 m/sec일 때 전파 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["180", "180.0", "180.00", "180ms", "180 ms", "180.0ms", "180.0 ms", "180.00ms", "180.00 ms", "180밀리초", "180 밀리초", "180.0밀리초", "180.0 밀리초", "180.00밀리초", "180.00 밀리초", "180msec", "180 msec", "180.0msec", "180.0 msec", "180.00msec", "180.00 msec"],
    displayAnswer: "180 ms",
    explanation: "dprop = 3.6×10^7 / 2×10^8 = 0.18초 = 180 ms."
  },
  {
    category: "전송 지연",
    question: "크기가 1500바이트인 패킷을 12 Mbps 링크로 전송할 때 전송 지연은 몇 ms인가? (1바이트 = 8비트, 숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1ms", "1 ms", "1.0ms", "1.0 ms", "1.00ms", "1.00 ms", "1밀리초", "1 밀리초", "1.0밀리초", "1.0 밀리초", "1.00밀리초", "1.00 밀리초", "1msec", "1 msec", "1.0msec", "1.0 msec", "1.00msec", "1.00 msec"],
    displayAnswer: "1 ms",
    explanation: "1500 × 8 = 12000비트이고 12000 / (12×10^6) = 0.001초 = 1 ms."
  },
  {
    category: "노달 지연",
    question: "전파 지연 20 ms, 전송 지연 4 ms, 처리 지연 0.5 ms이고 노달 지연이 27 ms일 때 큐잉 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["2.5", "2.50", "2.500", "2.5ms", "2.5 ms", "2.50ms", "2.50 ms", "2.500ms", "2.500 ms", "2.5밀리초", "2.5 밀리초", "2.50밀리초", "2.50 밀리초", "2.500밀리초", "2.500 밀리초", "2.5msec", "2.5 msec", "2.50msec", "2.50 msec", "2.500msec", "2.500 msec"],
    displayAnswer: "2.5 ms",
    explanation: "27 - (20 + 4 + 0.5) = 2.5 ms."
  },
];
