// 컴퓨터네트워크_중간고사_모의고사_1.jsx
// 2024, 2025 기출 형식(OX, 빈칸, DNS, 재전송, 윈도우, 타임아웃)을 따른 모의고사 1회
// 정답은 수업자료 기준으로 직접 풀이한 것이다.
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 1회",
  topic: "OX · 빈칸 · DNS · SR · GBN · DNS 질의 흐름"
};

const QUESTIONS = [

  // ===== 1번 OX (10문제) =====
  {
    category: "회선 교환",
    question: "회선 교환은 연결 설정 후 자원을 독점하므로 패킷 교환보다 같은 링크를 더 많은 사용자가 나누어 쓰기에 불리하다.",
    answer: true,
    explanation: "회선 교환은 전용 자원을 확보하고 공유하지 않는다. 반면 패킷 교환은 1Mbps 링크에서 35명이 쓰더라도 동시에 10명 초과로 활성일 확률이 0.0004보다 작아 더 많은 사용자를 지원한다."
  },
  {
    category: "패킷 교환",
    question: "포워딩(forwarding)은 패킷이 출발지에서 목적지까지 거칠 전체 경로를 결정하는 동작이다.",
    answer: false,
    explanation: "전체 경로를 결정하는 것은 라우팅(routing)이다. 포워딩은 라우터가 입력 링크의 패킷을 알맞은 출력 링크로 옮기는 동작이다."
  },
  { category: "패킷 교환", question: "패킷 교환에서 패킷 헤더에는 출발지 주소와 목적지 주소가 들어 있어 패킷마다 독립적으로 라우팅된다.",
    answer: true,
    explanation: "패킷 헤더: 출발지·목적지 주소, 제어 정보. 패킷마다 독립 라우팅." },
  {
    category: "UDP",
    question: "UDP는 데이터를 보내기 전에 핸드셰이킹으로 연결을 설정해 신뢰성을 보장한다.",
    answer: false,
    explanation: "UDP는 비연결형(connectionless)이라 핸드셰이킹이 없고 신뢰성도 보장하지 않는다."
  },
  {
    category: "DNS",
    question: "DNS는 계층 구조의 여러 이름 서버로 구현된 분산 데이터베이스이다.",
    answer: true,
    explanation: "루트, TLD, 권한 있는 DNS 서버의 계층 구조이며 중앙집중식으로 두면 단일 장애점과 트래픽 집중 문제가 생긴다."
  },
  { category: "SR", question: "SR의 ACK는 누적 ACK이다.",
    answer: false,
    explanation: "SR은 개별 ACK, GBN이 누적 ACK다." },
  {
    category: "GBN",
    question: "GBN 수신자는 순서가 어긋나 도착한 패킷을 버퍼링하지 않고 버린다.",
    answer: true,
    explanation: "GBN 수신자는 순서가 어긋난 패킷을 버리고 순서대로 받은 마지막 패킷의 ACK를 다시 보낸다. 버퍼링은 SR의 특징이다."
  },
  {
    category: "상위 계층 식별",
    question: "IPv4 헤더의 Protocol 필드 값 17은 TCP를 의미한다.",
    answer: false,
    explanation: "Protocol 필드 값 6은 TCP, 17은 UDP, 1은 ICMP다."
  },
  {
    category: "네트워크 장치",
    question: "데이터 링크 계층의 대표적인 장비는 스위치이다.",
    answer: true,
    explanation: "계층별 장비는 네트워크: 라우터, 데이터 링크: 스위치, 물리: 리피터와 허브다."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택(5계층)에는 표현 계층과 세션 계층이 별도의 계층으로 존재한다.",
    answer: false,
    explanation: "인터넷 스택에는 이 두 계층이 없고, 필요하면 해당 기능을 응용 계층에서 구현해야 한다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "OSI 모델",
    question: "OSI 7계층 중 IP 주소를 이용해 목적지까지의 최적 경로를 설정하는 계층은 (        )이다.",
    answers: ["네트워크 계층", "네트워크계층", "네트워크", "3계층", "network layer", "network"],
    displayAnswer: "네트워크 계층(Network Layer)",
    hint: "3계층",
    explanation: "네트워크 계층은 IP 주소 할당과 목적지에 대한 최적 경로 설정을 담당하며 RIP, OSPF가 그 예다."
  },
  { category: "패킷 교환", question: "라우터 출력 링크의 큐는 (        ) 방식으로 패킷을 내보낸다. (영문 약어)",
    answers: ["fifo", "first in first out", "선입선출", "선입 선출"],
    displayAnswer: "FIFO",
    hint: "먼저 온 것이 먼저",
    explanation: "패킷 교환의 출력 큐 = FIFO." },
  {
    category: "응용 계층",
    question: "서로 다른 메일 서버 사이에서 메일을 전송하는 프로토콜은 (        )이다.",
    answers: ["smtp", "simple mail transfer protocol"],
    displayAnswer: "SMTP",
    explanation: "SMTP는 TCP 25번 포트를 사용해 발신 메일 서버에서 수신 메일 서버로 메일을 직접 전달한다."
  },
  { category: "전송 서비스", question: "UDP와 달리 TCP는 데이터를 보내기 전에 연결을 설정하는 (        ) 지향 서비스이다.",
    answers: ["연결", "connection", "커넥션"],
    displayAnswer: "연결",
    hint: "connection-oriented",
    explanation: "TCP: 신뢰 전송, 흐름·혼잡 제어, 연결 지향. UDP: 비연결." },
  {
    category: "UDP",
    question: "UDP 헤더는 출발지 포트, 목적지 포트, 길이, (        ) 네 개 필드로 구성된다.",
    answers: ["체크섬", "checksum", "검사합", "체크 섬"],
    displayAnswer: "체크섬(Checksum)",
    explanation: "UDP 세그먼트 헤더는 source port, dest port, length, checksum이다."
  },
  {
    category: "GBN",
    question: "GBN 수신자는 순서대로 받은 마지막 패킷의 번호를 담아 (        ) ACK를 보낸다.",
    answers: ["누적", "누적 ack", "누적ack", "cumulative", "cumulative ack"],
    displayAnswer: "누적(Cumulative)",
    explanation: "GBN은 누적 ACK, SR은 개별 ACK를 사용한다."
  },

  // ===== 3번 DNS 레코드 (3문제) =====
  {
    category: "DNS",
    question: "abc.co.kr 회사는 웹 서버 www.abc.co.kr(203.0.113.10), 메일 서버 mail.abc.co.kr, 자체 DNS 서버 ns.abc.co.kr(203.0.113.53)을 운영한다. 레코드는 (name, value, type) 형식으로 쓴다.\n도메인 등록 기관이 상위 TLD 서버에 넣는, abc.co.kr의 권한 있는 이름 서버를 알려 주는 레코드는?",
    answers: ["abc.co.kr, ns.abc.co.kr, ns", "(abc.co.kr, ns.abc.co.kr, ns)", "abc.co.kr,ns.abc.co.kr,ns", "(abc.co.kr,ns.abc.co.kr,ns)", "abc.co.kr ns.abc.co.kr ns", "(abc.co.kr ns.abc.co.kr ns)"],
    displayAnswer: "(abc.co.kr, ns.abc.co.kr, NS)",
    hint: "type은 NS",
    explanation: "NS 레코드는 name이 도메인이고 value가 그 도메인의 권한 있는 이름 서버의 호스트 이름이다."
  },
  {
    category: "DNS",
    question: "abc.co.kr 회사는 웹 서버 www.abc.co.kr(203.0.113.10), 메일 서버 mail.abc.co.kr, 자체 DNS 서버 ns.abc.co.kr(203.0.113.53)을 운영한다. 레코드는 (name, value, type) 형식으로 쓴다.\n위 NS 레코드와 함께 TLD 서버에 등록되어, 이름 서버 ns.abc.co.kr의 IP 주소를 알려 주는 레코드는?",
    answers: ["ns.abc.co.kr, 203.0.113.53, a", "(ns.abc.co.kr, 203.0.113.53, a)", "ns.abc.co.kr,203.0.113.53,a", "(ns.abc.co.kr,203.0.113.53,a)", "ns.abc.co.kr 203.0.113.53 a", "(ns.abc.co.kr 203.0.113.53 a)"],
    displayAnswer: "(ns.abc.co.kr, 203.0.113.53, A)",
    hint: "type은 A",
    explanation: "NS 레코드의 value는 호스트 이름이라 그 이름을 IP로 바꿔 줄 A 레코드가 함께 필요하다. 수업자료의 networkutopia.com 예시와 같은 구조다."
  },
  {
    category: "DNS",
    question: "abc.co.kr 회사는 웹 서버 www.abc.co.kr(203.0.113.10), 메일 서버 mail.abc.co.kr, 자체 DNS 서버 ns.abc.co.kr(203.0.113.53)을 운영한다. 레코드는 (name, value, type) 형식으로 쓴다.\n회사의 권한 있는 DNS 서버에 만드는, abc.co.kr 앞으로 온 메일을 받을 서버를 알려 주는 레코드는?",
    answers: ["abc.co.kr, mail.abc.co.kr, mx", "(abc.co.kr, mail.abc.co.kr, mx)", "abc.co.kr,mail.abc.co.kr,mx", "(abc.co.kr,mail.abc.co.kr,mx)", "abc.co.kr mail.abc.co.kr mx", "(abc.co.kr mail.abc.co.kr mx)"],
    displayAnswer: "(abc.co.kr, mail.abc.co.kr, MX)",
    hint: "type은 MX",
    explanation: "MX 레코드는 name이 메일을 받을 도메인이고 value가 메일 서버의 이름이다."
  },

  // ===== 4번 SR 손실 (4문제) =====
  { category: "SR", question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 pkt2의 첫 전송만 손실되었다. 수신자는 도착한 패킷마다 개별 ACK를 보낸다.\n송신자가 받는 ACK 번호를 받은 순서대로 쓰면? (예: 0, 1)",
    answers: ["0, 1, 3", "0,1,3", "0 1 3", "pkt0, pkt1, pkt3", "pkt0,pkt1,pkt3", "pkt0 pkt1 pkt3", "ack0, ack1, ack3", "ack0,ack1,ack3", "ack0 ack1 ack3"],
    displayAnswer: "ACK0, ACK1, ACK3",
    hint: "도착한 패킷 번호 그대로",
    explanation: "pkt0, pkt1은 바로 전달(ACK0, ACK1), pkt3은 버퍼 저장(ACK3). pkt2는 오지 않았으므로 ACK2가 없다." },
  { category: "SR", question: "위 상황(N=4, pkt2 손실)에서 수신자가 버퍼에 저장하는 패킷 번호를 모두 쓰면?",
    answers: ["3", "pkt3"],
    displayAnswer: "pkt3",
    hint: "pkt2 뒤에 온 것",
    explanation: "RecvBase = 2에서 pkt3이 먼저 와서 버퍼에 저장된다." },
  { category: "SR", question: "위 상황(N=4, pkt2 손실)에서 송신자가 ACK0, ACK1, ACK3을 받은 직후 SendBase 값은? (숫자만 입력)",
    answers: ["2"],
    displayAnswer: "2",
    hint: "가장 작은 미확인 번호",
    explanation: "ACK0·1로 SendBase 2. ACK3은 pkt3만 확인하므로 SendBase는 2에 머문다." },
  { category: "SR", question: "위 상황(N=4, pkt2 손실)에서 재전송된 pkt2가 도착하면 수신자가 상위 계층에 한꺼번에 전달하는 패킷은 모두 몇 개인가? (숫자만 입력)",
    answers: ["2", "2개", "두 개"],
    displayAnswer: "2개 (pkt2, pkt3)",
    hint: "버퍼에 있던 것까지",
    explanation: "pkt2와 버퍼의 pkt3을 함께 전달 → 2개, RecvBase 4." },

  // ===== 5번 GBN 상태값 (4문제) =====
  {
    category: "GBN",
    question: "Window Size(N)=4인 GBN에서 송신자가 pkt0~pkt3을 연속 전송했고 pkt1이 손실되었다(pkt0, pkt2, pkt3은 도착). 수신자는 도착한 패킷마다 ACK를 보내므로 송신자는 ACK를 세 번 수신한다. 송신자는 첫 ACK를 받자마자 윈도우가 이동해 pkt4를 전송한다(pkt4는 아직 수신자에 도착하지 않았다).\n수신자가 pkt3을 받고 전송한 ACK 번호는? (숫자만 입력)",
    answers: ["0", "0.0", "0.00", "ack0", "ack 0"],
    displayAnswer: "ACK0 (0)",
    hint: "정상 수신한 마지막 패킷의 번호",
    explanation: "pkt2, pkt3은 순서 어긋남이라 버려지고 둘 다 마지막으로 정상 수신한 pkt0의 ACK0이 다시 전송된다. 송신자는 ACK0을 세 번 받는다. 따라서 pkt3에 대한 응답은 ACK0이다."
  },
  {
    category: "GBN",
    question: "Window Size(N)=4인 GBN에서 송신자가 pkt0~pkt3을 연속 전송했고 pkt1이 손실되었다(pkt0, pkt2, pkt3은 도착). 수신자는 도착한 패킷마다 ACK를 보내므로 송신자는 ACK를 세 번 수신한다. 송신자는 첫 ACK를 받자마자 윈도우가 이동해 pkt4를 전송한다(pkt4는 아직 수신자에 도착하지 않았다).\n송신자가 세 번째 ACK를 수신한 직후의 SendBase 값은? (숫자만 입력)",
    answers: ["1", "1.0", "1.00"],
    displayAnswer: "1",
    hint: "아직 ACK를 받지 못한 가장 오래된 패킷",
    explanation: "pkt2, pkt3은 순서 어긋남이라 버려지고 둘 다 마지막으로 정상 수신한 pkt0의 ACK0이 다시 전송된다. 송신자는 ACK0을 세 번 받는다. 누적 ACK0으로 pkt0만 확인되었고 가장 오래된 미확인 패킷은 pkt1이므로 SendBase=1이다. 중복 ACK는 무시한다."
  },
  {
    category: "GBN",
    question: "Window Size(N)=4인 GBN에서 송신자가 pkt0~pkt3을 연속 전송했고 pkt1이 손실되었다(pkt0, pkt2, pkt3은 도착). 수신자는 도착한 패킷마다 ACK를 보내므로 송신자는 ACK를 세 번 수신한다. 송신자는 첫 ACK를 받자마자 윈도우가 이동해 pkt4를 전송한다(pkt4는 아직 수신자에 도착하지 않았다).\n송신자가 세 번째 ACK를 수신한 직후의 NextSeqNum 값은? (숫자만 입력)",
    answers: ["5", "5.0", "5.00"],
    displayAnswer: "5",
    hint: "다음에 보낼 새 패킷의 번호",
    explanation: "pkt2, pkt3은 순서 어긋남이라 버려지고 둘 다 마지막으로 정상 수신한 pkt0의 ACK0이 다시 전송된다. 송신자는 ACK0을 세 번 받는다. pkt0~pkt4를 전송했으므로 다음에 보낼 새 패킷은 pkt5이고, NextSeqNum은 그 번호인 5다."
  },
  {
    category: "GBN",
    question: "Window Size(N)=4인 GBN에서 송신자가 pkt0~pkt3을 연속 전송했고 pkt1이 손실되었다(pkt0, pkt2, pkt3은 도착). 수신자는 도착한 패킷마다 ACK를 보내므로 송신자는 ACK를 세 번 수신한다. 송신자는 첫 ACK를 받자마자 윈도우가 이동해 pkt4를 전송한다(pkt4는 아직 수신자에 도착하지 않았다).\n송신자가 세 번째 ACK를 수신한 직후의 WindowRange는? (예: 0~3 형식으로 입력)",
    answers: ["1~4", "1 ~ 4", "1-4", "1 - 4", "1–4", "1 – 4", "[1,4]", "[1, 4]", "1부터 4", "1부터 4까지", "1~4까지"],
    displayAnswer: "1~4",
    hint: "SendBase부터 N개",
    explanation: "pkt2, pkt3은 순서 어긋남이라 버려지고 둘 다 마지막으로 정상 수신한 pkt0의 ACK0이 다시 전송된다. 송신자는 ACK0을 세 번 받는다. SendBase=1이고 N=4이므로 WindowRange는 1~4다. 1, 2, 3은 전송 후 ACK 대기, 4는 전송 완료(미확인)다."
  },

  // ===== 6번 DNS 질의 흐름 (4문제) =====
  { category: "DNS", question: "호스트 cis.poly.edu가 gaia.cs.umass.edu의 IP 주소를 알고 싶다. Local DNS 서버(dns.poly.edu)의 캐시는 비어 있다. 호스트 → Local DNS 질의를 1번으로 하여 메시지마다 번호를 붙인다.\niterated query일 때, 호스트가 답을 받을 때까지 오가는 DNS 메시지는 모두 몇 개인가? (숫자만 입력)",
    answers: ["8", "8개"],
    displayAnswer: "8개",
    hint: "질의 + 응답",
    explanation: "1 host→local, 2 local→root, 3 root→local, 4 local→TLD, 5 TLD→local, 6 local→권한, 7 권한→local, 8 local→host." },
  { category: "DNS", question: "호스트 cis.poly.edu가 gaia.cs.umass.edu의 IP 주소를 알고 싶다. Local DNS 서버(dns.poly.edu)의 캐시는 비어 있다. 호스트 → Local DNS 질의를 1번으로 하여 메시지마다 번호를 붙인다.\niterated query일 때, Local DNS 서버가 다른 DNS 서버에 보내는 질의는 몇 개인가? (숫자만 입력)",
    answers: ["3", "3개"],
    displayAnswer: "3개",
    hint: "Root, TLD, 권한",
    explanation: "Local DNS가 Root, TLD, 권한 있는 서버에 차례로 직접 묻는다 → 3개." },
  { category: "DNS", question: "호스트 cis.poly.edu가 gaia.cs.umass.edu의 IP 주소를 알고 싶다. Local DNS 서버(dns.poly.edu)의 캐시는 비어 있다. 호스트 → Local DNS 질의를 1번으로 하여 메시지마다 번호를 붙인다.\n같은 조회를 recursive query로 하면 Local DNS 서버가 상위 서버에 보내는 질의는 몇 개인가? (숫자만 입력)",
    answers: ["1", "1개", "하나"],
    displayAnswer: "1개",
    hint: "부담을 넘김",
    explanation: "recursive: Local DNS는 Root에 한 번 묻고, 나머지는 Root → TLD → 권한 서버가 대신 묻는다." },
  { category: "DNS", question: "호스트 cis.poly.edu가 gaia.cs.umass.edu의 IP 주소를 알고 싶다. Local DNS 서버(dns.poly.edu)의 캐시는 비어 있다. 호스트 → Local DNS 질의를 1번으로 하여 메시지마다 번호를 붙인다.\niterated query에서 .edu TLD 서버가 Local DNS에 알려 주는 것은 어떤 서버의 정보인가?",
    answers: ["권한 있는 dns 서버", "권한 있는 서버", "권한dns서버", "권한 dns 서버", "authoritative", "authoritative dns server", "dns.cs.umass.edu", "권한 있는 네임 서버"],
    displayAnswer: "권한 있는 DNS 서버(dns.cs.umass.edu)",
    hint: "dns.cs.umass.edu",
    explanation: "Root는 TLD 서버를, TLD는 권한 있는 서버(dns.cs.umass.edu)를 알려 준다(다음에 물어볼 서버)." },
];
