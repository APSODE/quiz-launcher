// 컴퓨터네트워크_네트워크모델_모의고사_1회.jsx
// 근거: 수업자료 '네트워크 모델', '데이터 흐름' (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "네트워크 모델",
  title: "네트워크 모델 모의고사 1회",
  topic: "OX · 빈칸 · 데이터 흐름 · 식별 필드 · 신뢰성"
};

const QUESTIONS = [

  // ===== 1번 OX (20문제) =====
  {
    category: "캡슐화",
    question: "송신 측에서 이더넷 헤더는 IP 패킷을 감싸며 가장 바깥쪽에 붙는다.",
    answer: true,
    explanation: "송신 측은 응용 데이터에 TCP 헤더, IP 헤더, 이더넷 헤더를 차례로 붙인다."
  },
  {
    category: "캡슐화",
    question: "수신 측에서는 가장 안쪽에 있는 TCP 헤더부터 먼저 제거한다.",
    answer: false,
    explanation: "가장 바깥쪽 이더넷 헤더부터 제거하며 올라가는 디캡슐화이다."
  },
  {
    category: "라우터",
    question: "라우터는 IP 헤더의 목적지 IP 주소를 보고 다음 전달 경로를 결정한다.",
    answer: true,
    explanation: "라우터는 네트워크 계층(IP 기반 라우팅) 장치이다."
  },
  {
    category: "라우터",
    question: "라우터는 패킷을 전달할 때 TCP 헤더의 포트 번호를 기준으로 경로를 결정한다.",
    answer: false,
    explanation: "라우터의 전달 결정은 IP 주소에 기반하며 포트 번호는 종단 호스트의 운영체제가 사용한다."
  },
  {
    category: "계층별 장치",
    question: "스위치는 데이터 링크 계층에서 동작하는 장치이다.",
    answer: true,
    explanation: "계층별 장치는 물리: 리피터, 허브, 데이터 링크: 스위치, 네트워크: 라우터이다."
  },
  {
    category: "주소",
    question: "IP 주소는 NIC 제조 시 부여되는 하드웨어 주소이며 변경할 수 없다.",
    answer: false,
    explanation: "그것은 MAC 주소의 설명이다. IP 주소는 논리적 주소로 DHCP 등으로 바뀔 수 있다."
  },
  {
    category: "주소",
    question: "MAC 주소는 일반적으로 제조 시 정해지지만 일부는 소프트웨어로 변경할 수도 있다.",
    answer: true,
    explanation: "변경 불가: 일반적으로 제조 시 하드 코딩되며 일부는 소프트웨어로 변경 가능하다."
  },
  {
    category: "상위 계층 식별",
    question: "IPv4 헤더의 Protocol 필드 값 6은 ICMP를 의미한다.",
    answer: false,
    explanation: "6은 TCP, 17은 UDP, 1은 ICMP이다."
  },
  {
    category: "상위 계층 식별",
    question: "TCP 포트 번호 443은 HTTPS를 의미한다.",
    answer: true,
    explanation: "80은 HTTP, 443은 HTTPS, 25는 SMTP이다."
  },
  {
    category: "상위 계층 식별",
    question: "UDP에서 DHCP 서버가 사용하는 포트 번호는 68번이다.",
    answer: false,
    explanation: "DHCP 서버는 67번, DHCP 클라이언트는 68번이다."
  },
  {
    category: "상위 계층 식별",
    question: "응용 계층은 최상위 계층이므로 상위 계층을 식별하는 정보를 헤더에 포함하지 않는다.",
    answer: true,
    explanation: "상위 계층 식별 필드는 링크, 네트워크, 전송 계층에 있다."
  },
  {
    category: "계층 역할",
    question: "네트워크 계층은 이웃 장치 사이의 프레임 오류를 검출하고 복구한다.",
    answer: false,
    explanation: "그것은 데이터 링크 계층의 역할이다."
  },
  {
    category: "신뢰성",
    question: "링크 계층 재전송은 이웃 장치 간 신뢰성을, 전송 계층 재전송은 종단 간 신뢰성을 제공한다.",
    answer: true,
    explanation: "링크 계층은 순서 번호 없이 각 데이터마다 응답하고 TCP는 순서 번호를 사용한다."
  },
  {
    category: "TCP/IP 모델",
    question: "OSI의 세션 계층은 TCP/IP 모델에서 전송 계층에 합쳐진다.",
    answer: false,
    explanation: "세션 계층은 표현, 응용 계층과 함께 TCP/IP의 응용 계층에 합쳐진다."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 모델에서 OSI의 응용, 표현, 세션 계층의 기능은 응용 계층 하나가 담당한다.",
    answer: true,
    explanation: "효율성을 고려해 세 계층을 하나로 묶었다."
  },
  {
    category: "네트워크 분류",
    question: "LAN, MAN, WAN 중 망 구성이 가장 단순한 것은 WAN이다.",
    answer: false,
    explanation: "망 구성 복잡도는 LAN 단순, MAN 보통, WAN 복잡이다."
  },
  {
    category: "네트워크 분류",
    question: "WAN은 LAN이나 MAN보다 망의 크기가 크고 구성이 복잡하다.",
    answer: true,
    explanation: "영역은 LAN ~1km, MAN 1~100km, WAN 100km~이다."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 모델의 인터넷 계층은 OSI의 데이터 링크 계층에 해당한다.",
    answer: false,
    explanation: "인터넷 계층은 OSI의 네트워크 계층에 해당한다."
  },
  {
    category: "표현 계층",
    question: "표현 계층은 사람이 이해하거나 시스템 간에 호환되도록 데이터를 가공하는 역할을 한다.",
    answer: true,
    explanation: "형식 변환, 인코딩, 암호화, 압축을 수행한다."
  },
  {
    category: "택배 비유",
    question: "택배 비유에서 응용 계층은 화물을 어느 길로 보낼지 경로를 정하는 일에 해당한다.",
    answer: false,
    explanation: "경로를 정하는 것은 네트워크 계층(도로 표지판)이다. 응용 계층은 무엇을 보낼지(화물 주문)에 해당한다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "데이터 단위",
    question: "OSI 7~5계층에서 다루는 데이터를 Message 단위라 하고, 4계층 이하에서 다루는 데이터는 (        ) 단위라 한다.",
    answers: ["packet", "패킷"],
    displayAnswer: "Packet(패킷)",
    explanation: "OSI 7~5계층은 Message 단위, 4계층 이하는 Packet 단위로 구분한다."
  },
  {
    category: "포트",
    question: "수신 호스트의 운영체제가 받은 데이터를 어떤 응용 프로그램에 전달할지 결정할 때 쓰는 값은 (        ) 번호이다.",
    answers: ["포트", "포트 번호", "포트번호", "port", "port number"],
    displayAnswer: "포트 번호",
    explanation: "전송 계층 헤더의 포트 번호가 응용을 식별한다."
  },
  {
    category: "상위 계층 식별",
    question: "이더넷 EtherType 필드 값 0x0806은 상위 프로토콜이 (        )임을 나타낸다.",
    answers: ["arp"],
    displayAnswer: "ARP",
    explanation: "0x0800은 IPv4, 0x86DD는 IPv6이다."
  },
  {
    category: "계층별 장치",
    question: "스위치는 OSI 7계층 중 (        )번째 계층의 장치이다. (숫자만 입력)",
    answers: ["2", "2번", "2번째", "2계층", "두 번째", "두번째"],
    displayAnswer: "2",
    explanation: "스위치는 데이터 링크 계층(2계층) 장치이다."
  },
  {
    category: "세션 계층",
    question: "세션 종료 관리에서 정상 종료(graceful)와 구분해 처리하는 비정상적인 종료를 (        ) 종료라 한다.",
    answers: ["강제", "강제 종료", "abortive", "비정상", "비정상 종료"],
    displayAnswer: "강제(abortive) 종료",
    explanation: "세션 계층은 세션 종료를 정상 종료와 강제 종료로 나누어 관리한다."
  },
  {
    category: "링크 주소",
    question: "WAN 내부에서 전용 회선, PPP, MPLS 등을 쓰는 구간은 MAC 대신 해당 기술의 (        ) 체계를 사용한다.",
    answers: ["주소", "주소 체계", "address", "주소체계"],
    displayAnswer: "주소(체계)",
    explanation: "Ethernet/Wi-Fi 링크를 쓰는 구간에서만 MAC 주소가 필요하다."
  },

  // ===== 3번 데이터 흐름 · 식별 필드 (9문제) =====
  { category: "데이터 흐름", question: "패킷이 라우터를 거칠 때마다 바뀌는 주소는 IP 주소와 MAC 주소 중 무엇인가?",
    answers: ["mac", "mac 주소", "mac주소", "물리 주소", "하드웨어 주소"],
    displayAnswer: "MAC 주소",
    hint: "L2 주소",
    explanation: "MAC은 홉마다(현재 송신자 → 다음 수신자) 바뀌고, IP는 종단 간 유지된다." },
  { category: "데이터 흐름", question: "IP 헤더의 출발지 IP 주소는 최초 송신자와 현재 송신자 중 누구의 주소인가?",
    answers: ["최초 송신자", "최초송신자", "최초 송신자의 주소", "처음 송신자"],
    displayAnswer: "최초 송신자",
    hint: "종단 간 유지",
    explanation: "출발지 IP = 최초 송신자, 목적지 IP = 최종 수신자." },
  { category: "데이터 흐름", question: "이더넷 헤더의 목적지 MAC 주소는 최종 수신자와 다음 수신자 중 누구의 주소인가?",
    answers: ["다음 수신자", "다음수신자", "다음 장치", "다음 수신자의 주소"],
    displayAnswer: "다음 수신자",
    hint: "홉마다 바뀜",
    explanation: "출발지 MAC = 현재 송신자, 목적지 MAC = 다음 수신자." },
  { category: "상위 계층 식별", question: "IPv4 헤더의 Protocol 필드 값 6이 가리키는 프로토콜은?",
    answers: ["tcp", "transmission control protocol"],
    displayAnswer: "TCP",
    hint: "UDP는 17",
    explanation: "Protocol: 1 ICMP, 2 IGMP, 6 TCP, 17 UDP, 89 OSPF." },
  { category: "상위 계층 식별", question: "이더넷 EtherType 값 0x0800이 가리키는 상위 프로토콜은?",
    answers: ["ipv4", "ip", "ip v4", "internet protocol version 4"],
    displayAnswer: "IPv4",
    hint: "IPv6가 아님",
    explanation: "0x0800 IPv4, 0x86DD IPv6, 0x0806 ARP." },
  { category: "상위 계층 식별", question: "이더넷 EtherType 값 0x86DD가 가리키는 상위 프로토콜은?",
    answers: ["ipv6", "ip v6", "internet protocol version 6"],
    displayAnswer: "IPv6",
    hint: "128비트 주소",
    explanation: "0x86DD = IPv6." },
  { category: "상위 계층 식별", question: "TCP 포트 80번이 가리키는 응용 프로토콜은?",
    answers: ["http", "hypertext transfer protocol"],
    displayAnswer: "HTTP",
    hint: "웹",
    explanation: "TCP 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS." },
  { category: "상위 계층 식별", question: "UDP 포트 68번을 사용하는 것은 DHCP 서버와 DHCP 클라이언트 중 무엇인가?",
    answers: ["dhcp 클라이언트", "클라이언트", "dhcp client", "client", "dhcp클라이언트"],
    displayAnswer: "DHCP 클라이언트",
    hint: "서버는 67",
    explanation: "UDP 67 = DHCP 서버, 68 = DHCP 클라이언트." },
  { category: "주소", question: "IP 주소를 집 주소에 비유한다면, MAC 주소는 무엇에 비유되는가?",
    answers: ["택배 바코드", "바코드", "택배바코드", "운송장 바코드"],
    displayAnswer: "택배 바코드",
    hint: "택배 상자에 붙은 것",
    explanation: "IP = 집 주소(위치), MAC = 택배 바코드(장치 자체 식별)." },

  // ===== 4번 신뢰성 (3문제) =====
  { category: "신뢰성", question: "네트워크 계층은 재전송으로 신뢰성을 제공하는가? (예/아니오)",
    answers: ["아니오", "아니요", "no", "x", "제공하지 않는다", "제공 안 함"],
    displayAnswer: "아니오",
    hint: "IP는 best effort",
    explanation: "네트워크 계층은 신뢰성을 제공하지 않는다. 재전송은 전송 계층(종단 간)과 링크 계층(이웃 간)에서 한다." },
  { category: "신뢰성", question: "전송 계층의 재전송이 제공하는 신뢰성은 종단 간과 이웃 간 중 어느 범위인가?",
    answers: ["종단 간", "종단간", "end-to-end", "end to end", "종단 대 종단"],
    displayAnswer: "종단 간",
    hint: "출발지 ↔ 최종 목적지",
    explanation: "전송 계층 = 종단 간(순서 번호 사용), 링크 계층 = 이웃 간(순서 번호 없이 데이터마다 응답)." },
  { category: "신뢰성", question: "손실(Loss)은 큐(버퍼)가 있는 모든 (        )에서 발생할 수 있다.",
    answers: ["계층", "layer", "레이어"],
    displayAnswer: "계층",
    hint: "layer",
    explanation: "큐 오버플로로 인한 손실은 큐가 있는 모든 계층에서 발생할 수 있다." },
];
