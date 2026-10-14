// 컴퓨터네트워크_중간고사_모의고사_1.jsx
// 2024, 2025 기출 형식(OX, 빈칸, DNS, 재전송, 윈도우, 타임아웃)을 따른 모의고사 1회
// 정답은 수업자료 기준으로 직접 풀이한 것이다.
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 1회",
  topic: "OX · 빈칸 · DNS · 재전송 번호 · GBN · TCP 타임아웃"
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
  {
    category: "패킷 지연",
    question: "전송 지연은 패킷 길이를 링크 대역폭으로 나눈 값(L/R)이다.",
    answer: true,
    explanation: "d_trans = L/R이다. 링크 길이를 전파 속도로 나눈 d/s는 전파 지연이다."
  },
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
  {
    category: "TCP",
    question: "TCP 세그먼트의 ACK 번호는 수신자가 마지막으로 받은 바이트의 번호이다.",
    answer: false,
    explanation: "ACK 번호는 수신자가 다음에 받기를 기대하는 바이트 번호다. 예를 들어 1000~1399를 모두 받았다면 ACK=1400이다."
  },
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
  {
    category: "패킷 지연",
    question: "큐잉 지연은 라우터의 (        ) 정도에 따라 크게 달라진다.",
    answers: ["혼잡", "혼잡도", "혼잡 정도", "혼잡 수준", "congestion", "congestion level", "정체", "트래픽"],
    displayAnswer: "혼잡(Congestion)",
    hint: "도착률이 링크 전송률에 가까워질수록 커진다",
    explanation: "d_queue는 출력 링크에서 전송을 기다리는 시간이며 라우터의 혼잡 수준에 의존한다."
  },
  {
    category: "응용 계층",
    question: "서로 다른 메일 서버 사이에서 메일을 전송하는 프로토콜은 (        )이다.",
    answers: ["smtp", "simple mail transfer protocol"],
    displayAnswer: "SMTP",
    explanation: "SMTP는 TCP 25번 포트를 사용해 발신 메일 서버에서 수신 메일 서버로 메일을 직접 전달한다."
  },
  {
    category: "TCP",
    question: "TCP는 데이터를 보내기 전에 3-way handshake로 연결을 설정하는 (        ) 지향 프로토콜이다.",
    answers: ["연결", "연결형", "연결 지향", "연결지향", "connection", "connection-oriented", "connection oriented"],
    displayAnswer: "연결(Connection-oriented)",
    explanation: "TCP는 connection-oriented이고 UDP는 connectionless다."
  },
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

  // ===== 4번 손실 시 GBN, SR, TCP의 번호 (4문제) =====
  {
    category: "재전송 번호",
    question: "송신자가 150바이트 길이의 DATA1~DATA4를 연속 전송했고 DATA3이 전송 중 손실되었다(DATA1, DATA2, DATA4만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다(ACK1, ACK2, ACK3 순). 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 2001이다.\nGBN, SR, TCP 어느 방식이든 같은 값인 DATA4의 순서번호(첫 바이트 번호)는? (숫자만 입력)",
    answers: ["2301", "2301.0", "2301.00", "2301번", "2301 번", "2301.0번", "2301.0 번", "2301.00번", "2301.00 번"],
    displayAnswer: "2301",
    hint: "DATA1의 순서번호부터 구한다",
    explanation: "ACK1=2001이므로 DATA1은 1851~2000, DATA2는 2001~2150, DATA3은 2151~2300(손실), DATA4는 2301~2450이다. DATA4의 순서번호는 2301이다."
  },
  {
    category: "재전송 번호",
    question: "송신자가 150바이트 길이의 DATA1~DATA4를 연속 전송했고 DATA3이 전송 중 손실되었다(DATA1, DATA2, DATA4만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다(ACK1, ACK2, ACK3 순). 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 2001이다.\nGBN에서 ACK3의 순서번호는? (숫자만 입력)",
    answers: ["2001", "2001.0", "2001.00", "2001번", "2001 번", "2001.0번", "2001.0 번", "2001.00번", "2001.00 번"],
    displayAnswer: "2001",
    hint: "순서대로 받은 마지막 데이터의 번호",
    explanation: "ACK1=2001이므로 DATA1은 1851~2000, DATA2는 2001~2150, DATA3은 2151~2300(손실), DATA4는 2301~2450이다. GBN 수신자는 DATA4를 순서 어긋남으로 버리고 순서대로 받은 마지막 데이터 DATA2의 번호로 ACK를 다시 보낸다. 따라서 ACK3은 DATA2의 순서번호 2001이다."
  },
  {
    category: "재전송 번호",
    question: "송신자가 150바이트 길이의 DATA1~DATA4를 연속 전송했고 DATA3이 전송 중 손실되었다(DATA1, DATA2, DATA4만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다(ACK1, ACK2, ACK3 순). 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 2001이다.\nSR에서 ACK3의 순서번호는? (숫자만 입력)",
    answers: ["2301", "2301.0", "2301.00", "2301번", "2301 번", "2301.0번", "2301.0 번", "2301.00번", "2301.00 번"],
    displayAnswer: "2301",
    hint: "방금 받은 데이터의 번호",
    explanation: "ACK1=2001이므로 DATA1은 1851~2000, DATA2는 2001~2150, DATA3은 2151~2300(손실), DATA4는 2301~2450이다. SR 수신자는 순서가 어긋난 DATA4도 버퍼에 저장하고 받은 데이터의 번호로 개별 ACK를 보낸다. 따라서 ACK3은 DATA4의 순서번호 2301이다."
  },
  {
    category: "재전송 번호",
    question: "송신자가 150바이트 길이의 DATA1~DATA4를 연속 전송했고 DATA3이 전송 중 손실되었다(DATA1, DATA2, DATA4만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다(ACK1, ACK2, ACK3 순). 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 2001이다.\nTCP에서 ACK3의 확인응답 번호는? (숫자만 입력)",
    answers: ["2151", "2151.0", "2151.00", "2151번", "2151 번", "2151.0번", "2151.0 번", "2151.00번", "2151.00 번"],
    displayAnswer: "2151",
    hint: "다음에 받기를 기대하는 바이트 번호",
    explanation: "ACK1=2001이므로 DATA1은 1851~2000, DATA2는 2001~2150, DATA3은 2151~2300(손실), DATA4는 2301~2450이다. TCP의 ACK 번호는 다음에 기대하는 바이트 번호다. DATA3(2151~)이 빠졌으므로 DATA4가 도착해도 2151인 중복 ACK다."
  },

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

  // ===== 6번 TCP 타임아웃 (4문제) =====
  {
    category: "TCP 타이머",
    question: "TCP에서 측정한 SampleRTT가 첫 번째는 2.0초, 두 번째는 3.2초였다. 첫 샘플로 EstimatedRTT=SampleRTT, DevRTT=SampleRTT/2로 초기화하고(RFC 2988), 두 번째 샘플부터 α=0.125, β=0.25를 적용한다. 두 번째 샘플에서는 EstimatedRTT를 먼저 갱신한 뒤 갱신된 EstimatedRTT로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4×DevRTT이다.\n첫 번째 샘플 직후의 TimeoutInterval은 몇 초인가? (숫자만 입력)",
    answers: ["6", "6.0", "6.00", "6초", "6 초", "6.0초", "6.0 초", "6.00초", "6.00 초"],
    displayAnswer: "6초",
    hint: "DevRTT 초기값은 SampleRTT/2",
    explanation: "첫 샘플: EstimatedRTT=2.0, DevRTT=1.0, Timeout=2.0+4×1.0=6.0\n둘째 샘플: EstimatedRTT=0.875×2.0+0.125×3.2=2.15, DevRTT=0.75×1.0+0.25×|3.2−2.15|=1.0125, Timeout=2.15+4×1.0125=6.2\n"
  },
  {
    category: "TCP 타이머",
    question: "TCP에서 측정한 SampleRTT가 첫 번째는 2.0초, 두 번째는 3.2초였다. 첫 샘플로 EstimatedRTT=SampleRTT, DevRTT=SampleRTT/2로 초기화하고(RFC 2988), 두 번째 샘플부터 α=0.125, β=0.25를 적용한다. 두 번째 샘플에서는 EstimatedRTT를 먼저 갱신한 뒤 갱신된 EstimatedRTT로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4×DevRTT이다.\n두 번째 샘플 후의 EstimatedRTT는 몇 초인가? (숫자만 입력)",
    answers: ["2.15", "2.150", "2.1500", "2.15초", "2.15 초", "2.150초", "2.150 초", "2.1500초", "2.1500 초"],
    displayAnswer: "2.15초",
    hint: "(1-α)×기존값 + α×SampleRTT",
    explanation: "첫 샘플: EstimatedRTT=2.0, DevRTT=1.0, Timeout=2.0+4×1.0=6.0\n둘째 샘플: EstimatedRTT=0.875×2.0+0.125×3.2=2.15, DevRTT=0.75×1.0+0.25×|3.2−2.15|=1.0125, Timeout=2.15+4×1.0125=6.2\n"
  },
  {
    category: "TCP 타이머",
    question: "TCP에서 측정한 SampleRTT가 첫 번째는 2.0초, 두 번째는 3.2초였다. 첫 샘플로 EstimatedRTT=SampleRTT, DevRTT=SampleRTT/2로 초기화하고(RFC 2988), 두 번째 샘플부터 α=0.125, β=0.25를 적용한다. 두 번째 샘플에서는 EstimatedRTT를 먼저 갱신한 뒤 갱신된 EstimatedRTT로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4×DevRTT이다.\n두 번째 샘플 후의 DevRTT는 몇 초인가? (숫자만 입력)",
    answers: ["1.0125", "1.01250", "1.012500", "1.0125초", "1.0125 초", "1.01250초", "1.01250 초", "1.012500초", "1.012500 초"],
    displayAnswer: "1.0125초",
    hint: "(1-β)×기존 DevRTT + β×|SampleRTT−EstimatedRTT|",
    explanation: "첫 샘플: EstimatedRTT=2.0, DevRTT=1.0, Timeout=2.0+4×1.0=6.0\n둘째 샘플: EstimatedRTT=0.875×2.0+0.125×3.2=2.15, DevRTT=0.75×1.0+0.25×|3.2−2.15|=1.0125, Timeout=2.15+4×1.0125=6.2\n"
  },
  {
    category: "TCP 타이머",
    question: "TCP에서 측정한 SampleRTT가 첫 번째는 2.0초, 두 번째는 3.2초였다. 첫 샘플로 EstimatedRTT=SampleRTT, DevRTT=SampleRTT/2로 초기화하고(RFC 2988), 두 번째 샘플부터 α=0.125, β=0.25를 적용한다. 두 번째 샘플에서는 EstimatedRTT를 먼저 갱신한 뒤 갱신된 EstimatedRTT로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4×DevRTT이다.\n두 번째 샘플 후에 설정되는 TimeoutInterval은 몇 초인가? (숫자만 입력)",
    answers: ["6.2", "6.20", "6.200", "6.2초", "6.2 초", "6.20초", "6.20 초", "6.200초", "6.200 초"],
    displayAnswer: "6.2초",
    hint: "TimeoutInterval = EstimatedRTT + 4×DevRTT",
    explanation: "첫 샘플: EstimatedRTT=2.0, DevRTT=1.0, Timeout=2.0+4×1.0=6.0\n둘째 샘플: EstimatedRTT=0.875×2.0+0.125×3.2=2.15, DevRTT=0.75×1.0+0.25×|3.2−2.15|=1.0125, Timeout=2.15+4×1.0125=6.2\n"
  },
];
