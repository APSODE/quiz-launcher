// 컴퓨터네트워크_네트워크모델_단답형_3세트_15문제.jsx
// 근거: 수업자료 '네트워크 모델', '데이터 흐름'
const META = {
  group: "컴퓨터네트워크",
  unit: "네트워크 모델",
  title: "네트워크 모델 단답형 3세트 15문제"
};

const SA_QUESTIONS = [
  {
    category: "표현 계층",
    question: "서로 다른 시스템 간에 데이터 형식이 다를 때 이를 맞춰 주는 표현 계층의 기능을 무엇이라 하는가?",
    answers: ["데이터 형식 변환", "형식 변환", "데이터형식변환", "형식변환", "translation", "변환"],
    displayAnswer: "데이터 형식 변환(Translation)",
    explanation: "예: ASCII와 EBCDIC, JPEG와 BMP 사이의 변환."
  },
  {
    category: "표현 계층",
    question: "ZIP이나 GZIP처럼 데이터 크기를 줄이는 처리를 하는 OSI 계층은?",
    answers: ["표현", "표현 계층", "표현계층", "presentation", "presentation layer", "6계층"],
    displayAnswer: "표현 계층",
    explanation: "표현 계층은 형식 변환, 인코딩, 암호화, 압축을 담당한다."
  },
  {
    category: "전송 계층",
    question: "종단 프로세스 간 데이터 전송을 보장하고 흐름 제어와 오류 제어를 수행하는 계층은?",
    answers: ["전송", "전송 계층", "전송계층", "transport", "transport layer", "4계층"],
    displayAnswer: "전송 계층",
    explanation: "TCP와 UDP가 이 계층의 대표 프로토콜이다."
  },
  {
    category: "네트워크 계층",
    question: "IP 주소 할당과 목적지까지의 최적 경로 설정을 담당하는 계층은?",
    answers: ["네트워크", "네트워크 계층", "네트워크계층", "network", "network layer", "3계층"],
    displayAnswer: "네트워크 계층",
    explanation: "RIP, OSPF 같은 경로 설정 프로토콜이 이 계층에 속한다."
  },
  {
    category: "데이터 링크 계층",
    question: "물리적으로 직접 연결된 이웃 장치 간의 데이터 전달과 에러 검출, 복구를 담당하는 계층은?",
    answers: ["데이터 링크", "데이터 링크 계층", "데이터링크", "데이터링크 계층", "링크 계층", "링크", "data link", "data link layer", "2계층"],
    displayAnswer: "데이터 링크 계층",
    explanation: "프레임 전송, MAC 주소, 매체 접근 제어를 수행한다."
  },
  {
    category: "물리 계층",
    question: "비트 1과 0을 신호로 바꿔 장치 간에 실제로 전송하는 계층은?",
    answers: ["물리", "물리 계층", "물리계층", "physical", "physical layer", "1계층"],
    displayAnswer: "물리 계층",
    explanation: "물리 계층 장치는 리피터와 허브다."
  },
  {
    category: "계층별 장치",
    question: "PC, 서버, 스마트폰은 OSI 계층 중 어느 계층의 장치로 분류되는가?",
    answers: ["응용", "응용 계층", "응용계층", "application", "application layer", "7계층"],
    displayAnswer: "응용 계층",
    explanation: "계층별 장치: 응용(PC, 서버, 스마트폰), 네트워크(라우터), 데이터 링크(스위치), 물리(리피터, 허브)."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 모델은 몇 개의 계층으로 구성되는가? (숫자만 입력)",
    answers: ["4", "4.0", "4.00", "4개", "4 개", "4.0개", "4.0 개", "4.00개", "4.00 개", "4계층", "4 계층", "4.0계층", "4.0 계층", "4.00계층", "4.00 계층"],
    displayAnswer: "4개",
    explanation: "응용, 전송, 인터넷, 네트워크 접속의 4계층이다."
  },
  {
    category: "인터넷",
    question: "전 세계의 수많은 LAN과 WAN이 서로 연결된 거대한 네트워크를 무엇이라 하는가?",
    answers: ["인터넷", "internet"],
    displayAnswer: "인터넷",
    explanation: "연결된 네트워크끼리는 서로 동일한 프로토콜을 사용한다."
  },
  {
    category: "상위 계층 식별",
    question: "이더넷 헤더의 EtherType 값 0x0800이 가리키는 상위 프로토콜은?",
    answers: ["ipv4", "ip", "ip v4", "아이피", "ip4"],
    displayAnswer: "IPv4",
    explanation: "0x0806은 ARP, 0x86DD는 IPv6이다."
  },
  {
    category: "상위 계층 식별",
    question: "전송 계층에서 포트 번호 25번이 나타내는 응용 프로토콜은?",
    answers: ["smtp", "에스엠티피"],
    displayAnswer: "SMTP",
    explanation: "80은 HTTP, 443은 HTTPS, 53은 DNS다."
  },
  {
    category: "주소",
    question: "NIC에 부여되며 장치 자체를 고유하게 식별하는 하드웨어 주소는?",
    answers: ["mac 주소", "mac", "mac주소", "맥 주소", "맥주소", "물리 주소", "물리적 주소", "물리주소"],
    displayAnswer: "MAC 주소",
    explanation: "MAC은 48비트, 데이터 링크 계층에서 사용한다."
  },
  {
    category: "라우팅",
    question: "IP 주소를 기준으로 목적지까지 패킷이 갈 경로를 정하는 동작을 무엇이라 하는가?",
    answers: ["라우팅", "routing", "경로 설정", "경로설정", "경로 결정", "경로 선택"],
    displayAnswer: "라우팅(경로 설정)",
    explanation: "네트워크 계층(인터넷 계층)의 핵심 기능이다."
  },
  {
    category: "상위 계층 식별",
    question: "IPv4 헤더의 Protocol 필드 값 1이 가리키는 프로토콜은?",
    answers: ["icmp", "아이씨엠피"],
    displayAnswer: "ICMP",
    explanation: "6은 TCP, 17은 UDP, 1은 ICMP다."
  },
  {
    category: "신뢰성",
    question: "외부 전자기파나 열잡음 등이 신호에 섞여 데이터가 왜곡되는 현상을 무엇이라 하는가?",
    answers: ["잡음", "잡음과 간섭", "잡음 및 간섭", "간섭", "noise", "노이즈", "잡음, 간섭"],
    displayAnswer: "잡음(및 간섭)",
    explanation: "신호 감쇠와 잡음, 간섭은 오류의 원인이다."
  },
];
