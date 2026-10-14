// 컴퓨터네트워크_네트워크모델_모의고사_1회.jsx
// 근거: 수업자료 '네트워크 모델', '데이터 흐름' (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "네트워크 모델",
  title: "네트워크 모델 모의고사 1회",
  topic: "OX · 빈칸 · 데이터 흐름 헤더 값 · 캡슐화 크기"
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

  // ===== 3번 데이터 흐름 헤더 값 (9문제) =====
  {
    category: "데이터 흐름",
    question: "호스트 H1(IP 주소 A, MAC 주소 m1)이 라우터 R을 거쳐 호스트 H2(IP 주소 B, MAC 주소 m4)의 웹 서버에 HTTP 요청을 보낸다. R의 H1 쪽 인터페이스 MAC은 m2, H2 쪽 인터페이스 MAC은 m3이다. H1의 송신자 포트는 2000, 웹 서버 포트는 80이다. H1과 R 사이를 구간 1, R과 H2 사이를 구간 2라 한다. (모든 구간은 이더넷, 주소는 기호로 답하시오)\n구간 1의 이더넷 헤더에서 출발지 MAC 주소는?",
    answers: ["m1"],
    displayAnswer: "m1",
    explanation: "출발지 MAC은 현재 송신자(H1)의 MAC이다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1(IP 주소 A, MAC 주소 m1)이 라우터 R을 거쳐 호스트 H2(IP 주소 B, MAC 주소 m4)의 웹 서버에 HTTP 요청을 보낸다. R의 H1 쪽 인터페이스 MAC은 m2, H2 쪽 인터페이스 MAC은 m3이다. H1의 송신자 포트는 2000, 웹 서버 포트는 80이다. H1과 R 사이를 구간 1, R과 H2 사이를 구간 2라 한다. (모든 구간은 이더넷, 주소는 기호로 답하시오)\n구간 1의 이더넷 헤더에서 목적지 MAC 주소는?",
    answers: ["m2"],
    displayAnswer: "m2",
    explanation: "목적지 MAC은 다음 수신자(R의 H1 쪽 인터페이스)의 MAC이다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1(IP 주소 A, MAC 주소 m1)이 라우터 R을 거쳐 호스트 H2(IP 주소 B, MAC 주소 m4)의 웹 서버에 HTTP 요청을 보낸다. R의 H1 쪽 인터페이스 MAC은 m2, H2 쪽 인터페이스 MAC은 m3이다. H1의 송신자 포트는 2000, 웹 서버 포트는 80이다. H1과 R 사이를 구간 1, R과 H2 사이를 구간 2라 한다. (모든 구간은 이더넷, 주소는 기호로 답하시오)\n구간 2의 이더넷 헤더에서 출발지 MAC 주소는?",
    answers: ["m3"],
    displayAnswer: "m3",
    explanation: "라우터를 거치며 출발지 MAC은 현재 송신자(R의 H2 쪽 인터페이스)로 바뀐다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1(IP 주소 A, MAC 주소 m1)이 라우터 R을 거쳐 호스트 H2(IP 주소 B, MAC 주소 m4)의 웹 서버에 HTTP 요청을 보낸다. R의 H1 쪽 인터페이스 MAC은 m2, H2 쪽 인터페이스 MAC은 m3이다. H1의 송신자 포트는 2000, 웹 서버 포트는 80이다. H1과 R 사이를 구간 1, R과 H2 사이를 구간 2라 한다. (모든 구간은 이더넷, 주소는 기호로 답하시오)\n구간 2의 이더넷 헤더에서 목적지 MAC 주소는?",
    answers: ["m4"],
    displayAnswer: "m4",
    explanation: "다음 수신자는 최종 수신자 H2이므로 m4이다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1(IP 주소 A, MAC 주소 m1)이 라우터 R을 거쳐 호스트 H2(IP 주소 B, MAC 주소 m4)의 웹 서버에 HTTP 요청을 보낸다. R의 H1 쪽 인터페이스 MAC은 m2, H2 쪽 인터페이스 MAC은 m3이다. H1의 송신자 포트는 2000, 웹 서버 포트는 80이다. H1과 R 사이를 구간 1, R과 H2 사이를 구간 2라 한다. (모든 구간은 이더넷, 주소는 기호로 답하시오)\n구간 2의 IP 헤더에서 출발지 IP 주소는?",
    answers: ["a", "ip a", "ip 주소 a"],
    displayAnswer: "A",
    explanation: "IP 주소는 종단 간 유지되어 최초 송신자 H1의 주소 A가 그대로이다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1(IP 주소 A, MAC 주소 m1)이 라우터 R을 거쳐 호스트 H2(IP 주소 B, MAC 주소 m4)의 웹 서버에 HTTP 요청을 보낸다. R의 H1 쪽 인터페이스 MAC은 m2, H2 쪽 인터페이스 MAC은 m3이다. H1의 송신자 포트는 2000, 웹 서버 포트는 80이다. H1과 R 사이를 구간 1, R과 H2 사이를 구간 2라 한다. (모든 구간은 이더넷, 주소는 기호로 답하시오)\n구간 2의 IP 헤더에서 목적지 IP 주소는?",
    answers: ["b", "ip b", "ip 주소 b"],
    displayAnswer: "B",
    explanation: "목적지 IP는 최종 수신자 H2의 주소 B이다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1(IP 주소 A, MAC 주소 m1)이 라우터 R을 거쳐 호스트 H2(IP 주소 B, MAC 주소 m4)의 웹 서버에 HTTP 요청을 보낸다. R의 H1 쪽 인터페이스 MAC은 m2, H2 쪽 인터페이스 MAC은 m3이다. H1의 송신자 포트는 2000, 웹 서버 포트는 80이다. H1과 R 사이를 구간 1, R과 H2 사이를 구간 2라 한다. (모든 구간은 이더넷, 주소는 기호로 답하시오)\n구간 2의 TCP 헤더에서 목적지 포트 번호는? (숫자만 입력)",
    answers: ["80", "80.0", "80.00"],
    displayAnswer: "80",
    explanation: "웹 서버(HTTP)의 포트 80이며 라우터를 거쳐도 변하지 않는다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1(IP 주소 A, MAC 주소 m1)이 라우터 R을 거쳐 호스트 H2(IP 주소 B, MAC 주소 m4)의 웹 서버에 HTTP 요청을 보낸다. R의 H1 쪽 인터페이스 MAC은 m2, H2 쪽 인터페이스 MAC은 m3이다. H1의 송신자 포트는 2000, 웹 서버 포트는 80이다. H1과 R 사이를 구간 1, R과 H2 사이를 구간 2라 한다. (모든 구간은 이더넷, 주소는 기호로 답하시오)\n구간 2의 IP 헤더에서 상위 계층이 TCP임을 알려 주는 Protocol 필드 값은? (숫자만 입력)",
    answers: ["6", "6.0", "6.00"],
    displayAnswer: "6",
    explanation: "6은 TCP, 17은 UDP, 1은 ICMP이다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1(IP 주소 A, MAC 주소 m1)이 라우터 R을 거쳐 호스트 H2(IP 주소 B, MAC 주소 m4)의 웹 서버에 HTTP 요청을 보낸다. R의 H1 쪽 인터페이스 MAC은 m2, H2 쪽 인터페이스 MAC은 m3이다. H1의 송신자 포트는 2000, 웹 서버 포트는 80이다. H1과 R 사이를 구간 1, R과 H2 사이를 구간 2라 한다. (모든 구간은 이더넷, 주소는 기호로 답하시오)\n구간 2의 이더넷 헤더에서 상위 계층이 IPv4임을 알려 주는 EtherType 값은? (16진수로 입력)",
    answers: ["0x0800", "0800", "800", "0x800"],
    displayAnswer: "0x0800",
    explanation: "0x0806은 ARP, 0x86DD는 IPv6이다."
  },

  // ===== 4번 캡슐화 크기 (3문제) =====
  {
    category: "캡슐화",
    question: "응용 계층에서 1000바이트의 HTTP 요청 메시지를 만든다. TCP 헤더는 20바이트, IP 헤더는 20바이트, 이더넷 헤더는 14바이트이고 이더넷 트레일러 등 다른 필드는 없다고 가정한다.\n전송 계층을 거친 데이터(세그먼트)의 크기는 몇 바이트인가? (숫자만 입력)",
    answers: ["1020", "1020.0", "1020.00", "1020바이트", "1020 바이트", "1020.0바이트", "1020.0 바이트", "1020.00바이트", "1020.00 바이트", "1020byte", "1020 byte", "1020.0byte", "1020.0 byte", "1020.00byte", "1020.00 byte", "1020bytes", "1020 bytes", "1020.0bytes", "1020.0 bytes", "1020.00bytes", "1020.00 bytes", "1020b", "1020 b", "1020.0b", "1020.0 b", "1020.00b", "1020.00 b"],
    displayAnswer: "1020바이트",
    explanation: "메시지 1000 + TCP 헤더 20 = 1020바이트."
  },
  {
    category: "캡슐화",
    question: "응용 계층에서 1000바이트의 HTTP 요청 메시지를 만든다. TCP 헤더는 20바이트, IP 헤더는 20바이트, 이더넷 헤더는 14바이트이고 이더넷 트레일러 등 다른 필드는 없다고 가정한다.\n네트워크 계층을 거친 데이터(IP 패킷)의 크기는 몇 바이트인가? (숫자만 입력)",
    answers: ["1040", "1040.0", "1040.00", "1040바이트", "1040 바이트", "1040.0바이트", "1040.0 바이트", "1040.00바이트", "1040.00 바이트", "1040byte", "1040 byte", "1040.0byte", "1040.0 byte", "1040.00byte", "1040.00 byte", "1040bytes", "1040 bytes", "1040.0bytes", "1040.0 bytes", "1040.00bytes", "1040.00 bytes", "1040b", "1040 b", "1040.0b", "1040.0 b", "1040.00b", "1040.00 b"],
    displayAnswer: "1040바이트",
    explanation: "1020 + IP 헤더 20 = 1040바이트."
  },
  {
    category: "캡슐화",
    question: "응용 계층에서 1000바이트의 HTTP 요청 메시지를 만든다. TCP 헤더는 20바이트, IP 헤더는 20바이트, 이더넷 헤더는 14바이트이고 이더넷 트레일러 등 다른 필드는 없다고 가정한다.\n링크 계층을 거쳐 전송되는 프레임의 크기는 몇 바이트인가? (숫자만 입력)",
    answers: ["1054", "1054.0", "1054.00", "1054바이트", "1054 바이트", "1054.0바이트", "1054.0 바이트", "1054.00바이트", "1054.00 바이트", "1054byte", "1054 byte", "1054.0byte", "1054.0 byte", "1054.00byte", "1054.00 byte", "1054bytes", "1054 bytes", "1054.0bytes", "1054.0 bytes", "1054.00bytes", "1054.00 bytes", "1054b", "1054 b", "1054.0b", "1054.0 b", "1054.00b", "1054.00 b"],
    displayAnswer: "1054바이트",
    explanation: "1040 + 이더넷 헤더 14 = 1054바이트."
  },
];
