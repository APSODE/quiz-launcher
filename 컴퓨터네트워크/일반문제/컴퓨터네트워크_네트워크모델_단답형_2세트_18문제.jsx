// 컴퓨터네트워크_네트워크모델_단답형_2세트_18문제.jsx
// 근거: 수업자료 '네트워크 모델', '데이터 흐름'
const META = {
  group: "컴퓨터네트워크",
  unit: "네트워크 모델",
  title: "네트워크 모델 단답형 2세트 18문제"
};

const SA_QUESTIONS = [
  {
    category: "표현 계층",
    question: "웹 통신의 암호화에 쓰이는, 표현 계층의 암호화/복호화 예로 든 프로토콜은?",
    answers: ["ssl/tls", "tls/ssl", "ssl", "tls", "ssl tls", "ssl, tls"],
    displayAnswer: "SSL/TLS",
    explanation: "SSL/TLS로 암호화된 웹 통신이 표현 계층의 암호화 예다."
  },
  {
    category: "OSI 계층",
    question: "OSI 7계층 중 4번째 계층은 무엇인가?",
    answers: ["전송", "전송 계층", "전송계층", "transport", "transport layer"],
    displayAnswer: "전송 계층",
    explanation: "1 물리, 2 데이터 링크, 3 네트워크, 4 전송, 5 세션, 6 표현, 7 응용 순서다."
  },
  {
    category: "OSI 계층",
    question: "네트워크 계층은 OSI 7계층 중 몇 번째 계층인가? (숫자만 입력)",
    answers: ["3", "3번", "3번째", "3계층", "세번째", "세 번째"],
    displayAnswer: "3",
    explanation: "네트워크 계층은 3계층이며 라우터가 대표 장치다."
  },
  {
    category: "세션 계층",
    question: "세션 계층의 기능 중 누가 언제 데이터를 보낼지 관리하는 것을 무엇이라 하는가?",
    answers: ["대화 제어", "대화제어", "dialog control", "dialogue control", "다이얼로그 컨트롤"],
    displayAnswer: "대화 제어(Dialog control)",
    explanation: "세션 계층은 세션 생성, 대화 제어, 동기화, 오류 복구, 종료 관리를 한다."
  },
  {
    category: "데이터 링크 계층",
    question: "여러 장치가 동시에 매체로 데이터를 전송할 때 이를 제어하는 규칙을 무엇이라 하는가?",
    answers: ["매체 접근 제어", "매체접근제어", "mac", "medium access control", "media access control", "매체 접근 제어(mac)"],
    displayAnswer: "매체 접근 제어(MAC)",
    explanation: "MAC은 Medium Access Control의 약자로 데이터 링크 계층의 기능이다."
  },
  {
    category: "네트워크 장치",
    question: "리피터와 허브가 속한 OSI 계층은?",
    answers: ["물리", "물리 계층", "물리계층", "1계층", "physical", "physical layer"],
    displayAnswer: "물리 계층",
    explanation: "물리 계층 장치로 리피터와 허브가 있다."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 모델에서 IP(Internet Protocol)라고도 불리며 경로 설정과 패킷 스위칭을 담당하는 계층은?",
    answers: ["인터넷", "인터넷 계층", "인터넷계층", "internet", "internet layer"],
    displayAnswer: "인터넷 계층",
    explanation: "OSI의 네트워크 계층에 해당한다."
  },
  {
    category: "네트워크 분류",
    question: "LAN의 영역은 대략 몇 km 이내인가? (숫자만 입력)",
    answers: ["1", "1km", "1 km", "1.0", "1키로"],
    displayAnswer: "1km",
    explanation: "LAN ~1km, MAN 1~100km, WAN 100km~다."
  },
  {
    category: "네트워크 분류",
    question: "WAN의 영역은 대략 몇 km 이상인가? (숫자만 입력)",
    answers: ["100", "100km", "100 km", "100.0"],
    displayAnswer: "100km",
    explanation: "WAN은 100km 이상의 넓은 지역을 연결한다."
  },
  {
    category: "주소",
    question: "IPv6 주소는 몇 비트로 구성되는가? (숫자만 입력)",
    answers: ["128", "128.0", "128.00", "128비트", "128 비트", "128.0비트", "128.0 비트", "128.00비트", "128.00 비트", "128bit", "128 bit", "128.0bit", "128.0 bit", "128.00bit", "128.00 bit"],
    displayAnswer: "128",
    explanation: "IPv4는 32비트, IPv6는 128비트다."
  },
  {
    category: "상위 계층 식별",
    question: "IPv4 헤더의 Protocol 필드 값 17이 가리키는 전송 계층 프로토콜은?",
    answers: ["udp", "유디피"],
    displayAnswer: "UDP",
    explanation: "6은 TCP, 17은 UDP, 1은 ICMP다."
  },
  {
    category: "상위 계층 식별",
    question: "이더넷 헤더의 EtherType 값 0x0806이 가리키는 상위 프로토콜은?",
    answers: ["arp", "에이알피"],
    displayAnswer: "ARP",
    explanation: "0x0800은 IPv4, 0x0806은 ARP, 0x86DD는 IPv6다."
  },
  {
    category: "상위 계층 식별",
    question: "UDP에서 DHCP 서버가 사용하는 포트 번호는? (숫자만 입력)",
    answers: ["67", "67번", "67번 포트"],
    displayAnswer: "67",
    explanation: "DHCP 서버는 67, 클라이언트는 68이다."
  },
  {
    category: "주소",
    question: "IP 주소를 자동으로 할당해 주는 프로토콜의 약어는?",
    answers: ["dhcp", "디에이치씨피"],
    displayAnswer: "DHCP",
    explanation: "IP 주소는 DHCP로 자동 할당하거나 수동으로 설정할 수 있다."
  },
  {
    category: "주소",
    question: "MAC 주소가 부여되는 하드웨어인 네트워크 인터페이스 카드의 약어는?",
    answers: ["nic", "닉"],
    displayAnswer: "NIC",
    explanation: "MAC 주소는 NIC에 부여되는 고유한 하드웨어 주소다."
  },
  {
    category: "신뢰성",
    question: "신호가 전송 매체를 따라 이동하면서 점점 약해지는 현상을 무엇이라 하는가?",
    answers: ["신호 감쇠", "신호감쇠", "감쇠", "attenuation", "signal attenuation"],
    displayAnswer: "신호 감쇠",
    explanation: "신호 감쇠와 잡음, 간섭은 오류(Error)의 원인이다."
  },
  {
    category: "신뢰성",
    question: "큐(버퍼)가 가득 차 패킷이 삭제되는 상황을 가리키는 용어는? (네트워크 정체로 발생)",
    answers: ["오버플로우", "오버플로", "overflow", "버퍼 오버플로우", "큐 오버플로우"],
    displayAnswer: "오버플로우(Overflow)",
    explanation: "네트워크 정체로 큐에서 오버플로우가 발생하면 손실이 생긴다."
  },
  {
    category: "데이터 흐름",
    question: "수신 측에서 헤더를 제거하며 상위 계층으로 올려 보내는 과정을 무엇이라 하는가?",
    answers: ["디캡슐화", "역캡슐화", "decapsulation", "de-encapsulation"],
    displayAnswer: "디캡슐화(Decapsulation)",
    explanation: "송신 측은 캡슐화, 수신 측은 디캡슐화를 수행한다."
  },
];
