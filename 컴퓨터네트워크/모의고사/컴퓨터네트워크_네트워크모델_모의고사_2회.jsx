// 컴퓨터네트워크_네트워크모델_모의고사_2회.jsx
// 근거: 수업자료 '네트워크 모델', '데이터 흐름' (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "네트워크 모델",
  title: "네트워크 모델 모의고사 2회",
  topic: "OX · 빈칸 · 경로상 주소 변화 · 상위 계층 식별 · 네트워크 분류"
};

const QUESTIONS = [

  // ===== 1번 OX (20문제) =====
  {
    category: "상위 계층 식별",
    question: "UDP 포트 번호 53은 DNS를 가리킨다.",
    answer: true,
    explanation: "DNS는 TCP/UDP 53번 포트를 쓴다."
  },
  {
    category: "상위 계층 식별",
    question: "TCP 포트 번호 80은 SMTP를 가리킨다.",
    answer: false,
    explanation: "80은 HTTP이고 SMTP는 25번이다."
  },
  {
    category: "상위 계층 식별",
    question: "TCP 포트 번호 25는 SMTP를 가리킨다.",
    answer: true,
    explanation: "SMTP는 메일 전송 프로토콜이며 25번 포트를 쓴다."
  },
  {
    category: "상위 계층 식별",
    question: "이더넷 EtherType 값 0x86DD는 ARP를 가리킨다.",
    answer: false,
    explanation: "0x86DD는 IPv6이고 ARP는 0x0806이다."
  },
  {
    category: "주소",
    question: "IPv6 주소는 128비트이며 16진수 그룹으로 표기한다.",
    answer: true,
    explanation: "예: 2001:0db8:85a3::8a2e:0370:7334"
  },
  {
    category: "주소",
    question: "IPv4 주소는 128비트로 구성된다.",
    answer: false,
    explanation: "IPv4는 32비트(0~255 숫자 4개)이다."
  },
  {
    category: "주소",
    question: "IP 주소는 DHCP를 통해 자동으로 할당되거나 수동으로 설정할 수 있다.",
    answer: true,
    explanation: "IP 주소는 변경 가능한 논리적 주소이다."
  },
  {
    category: "주소",
    question: "MAC 주소는 6쌍의 16진수로 표기하는 48비트 주소이다.",
    answer: true,
    explanation: "예: 00:1A:2B:3C:4D:5E"
  },
  {
    category: "주소",
    question: "IP 주소는 NIC에 부여되어 장치 자체를 고유하게 식별하는 하드웨어 주소이다.",
    answer: false,
    explanation: "그것은 MAC 주소의 설명이다."
  },
  {
    category: "주소",
    question: "IP 주소의 목적은 장치의 위치 식별과 라우팅이고 MAC 주소의 목적은 장치 자체 식별과 프레임 전달이다.",
    answer: true,
    explanation: "IP는 네트워크 계층, MAC은 데이터 링크 계층에서 쓴다."
  },
  {
    category: "데이터 흐름",
    question: "최종 수신자의 목적지 판단은 MAC 주소가 아니라 IP 주소를 보고 이루어진다.",
    answer: true,
    explanation: "수신 호스트는 IP 주소를 보고 자신에게 온 데이터임을 판단한다."
  },
  {
    category: "데이터 흐름",
    question: "수신 호스트는 목적지 포트 번호만 보고 자신에게 온 패킷인지 최종 판단한다.",
    answer: false,
    explanation: "자신에게 온 데이터인지는 IP 주소로 판단하고 포트 번호는 응용 프로그램을 가려낸다."
  },
  {
    category: "신뢰성",
    question: "링크 계층 재전송은 순서 번호를 사용해 신뢰성을 제공한다.",
    answer: false,
    explanation: "링크 계층은 순서 번호 없이 각 데이터마다 응답한다. 순서 번호를 쓰는 것은 TCP이다."
  },
  {
    category: "신뢰성",
    question: "TCP의 재전송은 데이터와 ACK에 순서 번호를 사용해 종단 간 신뢰성을 제공한다.",
    answer: true,
    explanation: "전송 계층 재전송은 종단 간 신뢰성이다."
  },
  {
    category: "네트워크 분류",
    question: "LAN은 대략 100km 이상의 영역을 연결하는 네트워크이다.",
    answer: false,
    explanation: "LAN은 ~1km, WAN이 100km~이다."
  },
  {
    category: "네트워크 분류",
    question: "WAN의 예로 통신 사업자가 구축한 망(SK 브로드밴드, KT, LG 유플러스)이 있다.",
    answer: true,
    explanation: "WAN은 넓은 지역에 걸친 광역 네트워크이다."
  },
  {
    category: "신뢰성",
    question: "데이터 손실의 두 분류 중 큐에서 삭제되는 것은 '오류'이고 오류 검색 후 폐기되는 것은 '손실'이다.",
    answer: false,
    explanation: "큐에서 삭제되는 것이 손실(Loss), 오류 검출 후 폐기되는 것이 오류(Error)이다."
  },
  {
    category: "신뢰성",
    question: "큐 오버플로로 인한 손실은 TCP의 재전송으로 신뢰성을 제공할 수 있다.",
    answer: true,
    explanation: "전송 계층(TCP)에서 재전송을 통해 신뢰성을 제공한다."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 모델에서 경로 설정과 패킷 스위칭은 전송 계층이 담당한다.",
    answer: false,
    explanation: "경로 설정과 패킷 스위칭은 인터넷 계층(네트워크 계층)의 역할이다."
  },
  {
    category: "네트워크 모델",
    question: "OSI 모델은 실질적으로 현재 인터넷에서 가장 널리 사용되는 구현 모델이다.",
    answer: false,
    explanation: "OSI는 참조 모델이고 실제 인터넷에서 사용되는 것은 TCP/IP 모델이다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "상위 계층 식별",
    question: "UDP 포트 번호 53이 가리키는 응용 계층 프로토콜은 (        )이다.",
    answers: ["dns"],
    displayAnswer: "DNS",
    explanation: "DNS는 TCP/UDP 53번 포트를 사용한다."
  },
  {
    category: "상위 계층 식별",
    question: "이메일 전송에 쓰이는 SMTP의 포트 번호는 (        )번이다. (숫자만 입력)",
    answers: ["25", "25번", "25번 포트"],
    displayAnswer: "25",
    explanation: "HTTP는 80, HTTPS는 443이다."
  },
  {
    category: "주소",
    question: "IPv4 주소는 0~255 범위의 숫자 (        )개로 구성된다. (숫자만 입력)",
    answers: ["4", "4개", "네 개", "네개", "사"],
    displayAnswer: "4",
    explanation: "예: 192.168.0.1은 32비트 주소이다."
  },
  {
    category: "계층별 장치",
    question: "리피터와 허브는 OSI 7계층 중 (        )번째 계층의 장치이다. (숫자만 입력)",
    answers: ["1", "1번", "1번째", "1계층", "첫 번째", "첫번째"],
    displayAnswer: "1",
    explanation: "물리 계층(1계층) 장치이다."
  },
  {
    category: "신뢰성",
    question: "큐(버퍼)에서 삭제되어 데이터가 사라지는 것을 (        )이라 한다. (손실/오류 중에서)",
    answers: ["손실", "loss"],
    displayAnswer: "손실(Loss)",
    explanation: "오류는 오류 검출 후 폐기되는 것이다."
  },
  {
    category: "신뢰성",
    question: "ACK도 일종의 (        )이므로 데이터 전송 과정과 동일하게 진행된다.",
    answers: ["데이터", "data"],
    displayAnswer: "데이터",
    explanation: "ACK도 손실되거나 오류가 생길 수 있다."
  },

  // ===== 3번 경로를 따라 변하는 주소 (4문제) =====
  {
    category: "데이터 흐름",
    question: "호스트 H1이 라우터 R1, R2를 차례로 거쳐 호스트 H2에 데이터를 보낸다. 경로는 H1-R1, R1-R2, R2-H2의 세 구간이며 모든 구간은 이더넷이다. H1의 MAC은 m1, R1의 H1 쪽 인터페이스 MAC은 m2로 한다.\nH1이 만든 이더넷 프레임의 목적지 MAC 주소는 무엇의 MAC 주소인가? (기호로 답하시오)",
    answers: ["m2"],
    displayAnswer: "m2",
    explanation: "목적지 MAC은 최종 수신자가 아니라 다음 수신자(R1의 인터페이스)의 MAC이다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1이 라우터 R1, R2를 차례로 거쳐 호스트 H2에 데이터를 보낸다. 경로는 H1-R1, R1-R2, R2-H2의 세 구간이며 모든 구간은 이더넷이다. H1의 MAC은 m1, R1의 H1 쪽 인터페이스 MAC은 m2로 한다.\nH1에서 H2까지 가는 동안 이더넷 헤더는 구간마다 새로 만들어진다. 몇 번 만들어지는가? (숫자만 입력)",
    answers: ["3", "3.0", "3.00", "3번", "3 번", "3.0번", "3.0 번", "3.00번", "3.00 번", "3회", "3 회", "3.0회", "3.0 회", "3.00회", "3.00 회"],
    displayAnswer: "3번",
    explanation: "구간이 3개이므로 이더넷 헤더도 3번 만들어진다. 라우터가 R1, R2 두 곳에서 다시 만든다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1이 라우터 R1, R2를 차례로 거쳐 호스트 H2에 데이터를 보낸다. 경로는 H1-R1, R1-R2, R2-H2의 세 구간이며 모든 구간은 이더넷이다. H1의 MAC은 m1, R1의 H1 쪽 인터페이스 MAC은 m2로 한다.\nH1에서 H2까지 가는 동안 IP 헤더의 출발지 IP 주소가 바뀌는 횟수는? (숫자만 입력)",
    answers: ["0", "0.0", "0.00", "0번", "0 번", "0.0번", "0.0 번", "0.00번", "0.00 번", "0회", "0 회", "0.0회", "0.0 회", "0.00회", "0.00 회"],
    displayAnswer: "0번",
    explanation: "IP 주소는 종단 간 유지되며 전송 과정에서 변경되지 않는다."
  },
  {
    category: "데이터 흐름",
    question: "호스트 H1이 라우터 R1, R2를 차례로 거쳐 호스트 H2에 데이터를 보낸다. 경로는 H1-R1, R1-R2, R2-H2의 세 구간이며 모든 구간은 이더넷이다. H1의 MAC은 m1, R1의 H1 쪽 인터페이스 MAC은 m2로 한다.\nH1에서 H2까지 가는 동안 이더넷 헤더의 목적지 MAC 주소로 서로 다른 값이 쓰이는 횟수는? (숫자만 입력)",
    answers: ["3", "3.0", "3.00", "3번", "3 번", "3.0번", "3.0 번", "3.00번", "3.00 번", "3회", "3 회", "3.0회", "3.0 회", "3.00회", "3.00 회", "3개", "3 개", "3.0개", "3.0 개", "3.00개", "3.00 개"],
    displayAnswer: "3",
    explanation: "구간 1, 2, 3에서 각각 R1, R2, H2의 MAC이 쓰여 서로 다른 값 3개가 쓰인다."
  },

  // ===== 4번 DNS 질의 패킷 (3문제) =====
  {
    category: "상위 계층 식별",
    question: "호스트가 임의의 송신자 포트 40000번에서 DNS 서버에 UDP로 질의를 보낸다. DNS 서버의 포트는 53번이고 IPv4와 이더넷을 사용한다.\n질의 패킷의 UDP 헤더에서 목적지 포트 번호는? (숫자만 입력)",
    answers: ["53", "53.0", "53.00"],
    displayAnswer: "53",
    explanation: "DNS의 포트 번호는 53이다."
  },
  {
    category: "상위 계층 식별",
    question: "호스트가 임의의 송신자 포트 40000번에서 DNS 서버에 UDP로 질의를 보낸다. DNS 서버의 포트는 53번이고 IPv4와 이더넷을 사용한다.\n질의 패킷의 IP 헤더에서 Protocol 필드 값은? (숫자만 입력)",
    answers: ["17", "17.0", "17.00"],
    displayAnswer: "17",
    explanation: "UDP는 17, TCP는 6이다."
  },
  {
    category: "상위 계층 식별",
    question: "호스트가 임의의 송신자 포트 40000번에서 DNS 서버에 UDP로 질의를 보낸다. DNS 서버의 포트는 53번이고 IPv4와 이더넷을 사용한다.\n질의 패킷의 이더넷 헤더에서 EtherType 값은? (16진수로 입력)",
    answers: ["0x0800", "0800", "800", "0x800"],
    displayAnswer: "0x0800",
    explanation: "IPv4는 0x0800이다."
  },

  // ===== 5번 네트워크 분류 (3문제) =====
  {
    category: "네트워크 분류",
    question: "수업자료의 기준은 LAN ~1km, MAN 1~100km, WAN 100km~이다.\n한 건물 안 0.5km 범위를 연결한 네트워크는 LAN, MAN, WAN 중 무엇인가?",
    answers: ["lan", "랜"],
    displayAnswer: "LAN",
    explanation: "~1km 이내는 LAN이다."
  },
  {
    category: "네트워크 분류",
    question: "수업자료의 기준은 LAN ~1km, MAN 1~100km, WAN 100km~이다.\n도시 하나에 해당하는 30km 범위를 연결한 네트워크는 LAN, MAN, WAN 중 무엇인가?",
    answers: ["man", "맨"],
    displayAnswer: "MAN",
    explanation: "1~100km는 MAN이다."
  },
  {
    category: "네트워크 분류",
    question: "수업자료의 기준은 LAN ~1km, MAN 1~100km, WAN 100km~이다.\n서로 다른 도시를 잇는 500km 범위의 네트워크는 LAN, MAN, WAN 중 무엇인가?",
    answers: ["wan", "완"],
    displayAnswer: "WAN",
    explanation: "100km 이상은 WAN이다."
  },
];
