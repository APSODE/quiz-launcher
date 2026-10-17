// 근거: 수업자료 Chapter 3 Transport Layer, Checksum (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "3장",
  title: "3장 모의고사 1회",
  topic: "OX + 빈칸 + rdt · GBN/SR · 역다중화 · 체크섬 개념"
};

const QUESTIONS = [

  // ===== 1번 OX (20문제) =====
  {
    category: "체크섬",
    question: "UDP 체크섬은 의사 헤더, UDP 헤더, 응용 계층에서 온 데이터를 모두 계산 대상으로 한다.",
    answer: true,
    explanation: "UDP/TCP 체크섬은 IP 체크섬과 달리 세 부분을 포함한다."
  },
  {
    category: "체크섬",
    question: "IP 체크섬은 IP 헤더와 그 뒤의 데이터 전체를 계산 대상으로 한다.",
    answer: false,
    explanation: "IP 체크섬은 IP 헤더만 16비트 단위로 나누어 더한 뒤 보수를 취한다."
  },
  {
    category: "rdt",
    question: "rdt2.0에서 ACK나 NAK가 손상될 수 있으므로 송신자가 단순히 재전송하면 중복 패킷이 생길 수 있고, 이를 구분하려면 순서 번호가 필요하다.",
    answer: true,
    explanation: "중복 패킷 처리를 위해 순서 번호를 추가한 것이 rdt2.1이다."
  },
  {
    category: "rdt",
    question: "rdt3.0의 타이머는 데이터나 ACK의 손실에 대처하기 위해 필요하다.",
    answer: true,
    explanation: "타임아웃이 나면 재전송한다."
  },
  {
    category: "파이프라이닝",
    question: "파이프라이닝에서는 확인되지 않은 패킷을 여러 개 보낼 수 있으므로 순서 번호의 범위를 줄여도 된다.",
    answer: false,
    explanation: "순서 번호의 범위를 늘려야 하고 송신자나 수신자에 버퍼링이 필요하다."
  },
  {
    category: "GBN",
    question: "GBN 수신자는 순서가 어긋나게 도착한 패킷을 버퍼에 저장해 둔다.",
    answer: false,
    explanation: "GBN은 순서가 어긋난 패킷을 버리며 수신 버퍼가 없다."
  },
  {
    category: "GBN",
    question: "GBN 송신자의 타이머는 ACK를 받지 못한 가장 오래된 패킷에 대한 1개이다.",
    answer: true,
    explanation: "타임아웃되면 윈도우 안의 확인되지 않은 패킷을 모두 재전송한다."
  },
  {
    category: "SR",
    question: "SR 수신자는 정상적으로 받은 각 패킷에 대해 개별 ACK를 보낸다.",
    answer: true,
    explanation: "SR은 개별 ACK를 사용하고 수신 버퍼가 있다."
  },
  {
    category: "SR",
    question: "SR 송신자는 타임아웃이 나면 확인되지 않은 모든 패킷을 다시 보낸다.",
    answer: false,
    explanation: "SR은 패킷마다 타이머가 있고 타임아웃된 해당 패킷만 재전송한다."
  },
  {
    category: "SR",
    question: "SR에서 송신 윈도우 크기가 SN, 수신 윈도우 크기가 RN일 때 순서 번호 공간은 SN + RN 이상이어야 한다.",
    answer: true,
    explanation: "그렇지 않으면 수신자가 중복 패킷을 새 패킷으로 받아들이는 문제가 생긴다."
  },
  { category: "전송 계층", question: "전송 계층 프로토콜은 종단 시스템에서만 동작한다.",
    answer: true,
    explanation: "transport 계층은 end system에서만 실행되고 라우터에서는 동작하지 않는다." },
  { category: "전송 계층", question: "네트워크 계층은 호스트 간, 전송 계층은 프로세스 간 논리적 통신을 제공한다.",
    answer: true,
    explanation: "network = 호스트 간, transport = 프로세스 간 논리적 통신." },
  { category: "역다중화", question: "TCP 소켓은 목적지 포트 번호만으로 식별된다.",
    answer: false,
    explanation: "TCP 소켓은 출발지·목적지 IP와 포트의 4-tuple로 식별된다. 목적지 IP·포트만 쓰는 것은 UDP다." },
  { category: "UDP", question: "UDP는 연결 설정 없이 데이터를 보내므로 연결 설정으로 인한 지연이 없다.",
    answer: true,
    explanation: "UDP 장점: 연결 설정 없음(지연 없음), 상태 없음, 작은 헤더, 혼잡 제어 없음." },
  { category: "UDP", question: "UDP 헤더의 length 필드는 헤더를 제외한 데이터 부분의 길이이다.",
    answer: false,
    explanation: "UDP length는 헤더를 포함한 UDP 세그먼트 전체의 바이트 수다." },
  { category: "rdt", question: "rdt2.2는 NAK 없이 ACK만으로 동작한다.",
    answer: true,
    explanation: "rdt2.2(NAK-free): 마지막 정상 패킷의 ACK를 보내며 중복 ACK가 NAK 역할을 한다." },
  { category: "GBN", question: "GBN 수신자는 받은 패킷마다 그 번호의 개별 ACK를 보낸다.",
    answer: false,
    explanation: "GBN은 누적 ACK(순서대로 받은 마지막 번호)를 보낸다. 개별 ACK는 SR이다." },
  {
    category: "역다중화",
    question: "UDP 소켓은 출발지 IP, 출발지 포트, 목적지 IP, 목적지 포트의 4-튜플로 식별된다.",
    answer: false,
    explanation: "UDP 소켓은 목적지 IP와 목적지 포트로 식별되고 4-튜플로 식별하는 것은 TCP이다."
  },
  { category: "체크섬", question: "1의 보수 합을 구할 때 최상위 비트에서 넘친 carry는 버린다.",
    answer: false,
    explanation: "carry는 버리지 않고 결과의 최하위 비트에 다시 더한다." },
  {
    category: "rdt",
    question: "rdt3.0은 정확하지만 정지-대기 방식이라 링크 이용률이 높다.",
    answer: false,
    explanation: "정지-대기는 링크 이용률이 매우 낮아 성능이 좋지 않다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "GBN",
    question: "GBN 수신자가 순서에 맞게 받은 마지막 패킷의 번호를 알리는 ACK 방식을 (        ) ACK라 한다.",
    answers: ["누적", "cumulative", "누적 ack", "누적ack"],
    displayAnswer: "누적(cumulative)",
    explanation: "GBN은 누적 ACK, SR은 개별 ACK를 사용한다."
  },
  {
    category: "SR",
    question: "SR에서 수신자가 순서가 어긋난 패킷을 (        )에 저장해 두었다가 순서대로 상위 계층에 전달한다.",
    answers: ["버퍼", "수신 버퍼", "buffer", "버퍼링"],
    displayAnswer: "버퍼",
    explanation: "SR은 수신 버퍼가 있고 GBN과 정지-대기에는 없다."
  },
  { category: "UDP", question: "UDP는 연결 설정과 혼잡 제어가 없는 (        )형 전송 프로토콜이다.",
    answers: ["비연결", "비연결형", "connectionless", "비 연결"],
    displayAnswer: "비연결",
    hint: "connection-less",
    explanation: "UDP: connectionless, best effort." },
  { category: "GBN", question: "GBN 송신자의 변수 중 아직 ACK를 받지 못한 가장 오래된 패킷 번호는 (        )이다.",
    answers: ["sendbase", "send base", "send_base", "센드베이스"],
    displayAnswer: "SendBase",
    hint: "Send...",
    explanation: "GBN 송신 변수: SendBase, NextSeqNum, WindowSize." },
  {
    category: "UDP",
    question: "UDP는 헤더에 출발지 포트, 목적지 포트, 길이, (        )를 가진다.",
    answers: ["체크섬", "checksum"],
    displayAnswer: "체크섬",
    explanation: "UDP 헤더는 8바이트로 이 네 필드로 구성된다."
  },
  { category: "rdt", question: "rdt2.0에서 수신자가 패킷에 오류가 있음을 알리는 메시지는 (        )이다.",
    answers: ["nak", "nack", "negative acknowledgement", "negative acknowledgment", "부정 응답"],
    displayAnswer: "NAK",
    hint: "ACK의 반대",
    explanation: "rdt2.0: ACK(정상) / NAK(오류)." },

  // ===== 3번 정지-대기 rdt3.0 흐름 (4문제) =====
  { category: "rdt3.0", question: "정지-대기 rdt3.0(순서 번호 0, 1 번갈아 사용)에서 송신자가 pkt0을 보냈고 수신자는 정상 수신해 ACK0을 보냈지만 ACK0이 손실되었다.\n송신자는 다음에 무엇을 하는가? (예: pkt1 전송)",
    answers: ["pkt0 재전송", "pkt0을 재전송", "pkt0 재전송한다", "재전송", "pkt0을 다시 전송", "pkt0 다시 전송"],
    displayAnswer: "pkt0 재전송",
    hint: "ACK를 못 받음",
    explanation: "ACK0을 받지 못했으므로 타이머가 만료되면 pkt0을 재전송한다." },
  { category: "rdt3.0", question: "위 상황에서 재전송된 pkt0을 받은 수신자는 이 패킷을 무엇으로 판단하는가? (두 글자)",
    answers: ["중복", "중복 패킷", "중복패킷", "duplicate"],
    displayAnswer: "중복",
    hint: "이미 받은 것",
    explanation: "수신자는 이미 pkt0을 받았고 다음 순서 번호 1을 기다리므로 순서 번호로 중복임을 안다." },
  { category: "rdt3.0", question: "위 상황에서 수신자는 재전송된 pkt0을 상위 계층에 다시 전달하는가? (예/아니오)",
    answers: ["아니오", "아니요", "no", "x", "전달하지 않는다", "안 한다"],
    displayAnswer: "아니오",
    hint: "중복은 전달 안 함",
    explanation: "중복 패킷은 폐기(전달하지 않음)하고 ACK만 다시 보낸다." },
  { category: "rdt3.0", question: "위 상황에서 수신자가 재전송된 pkt0에 대해 다시 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["0", "ack0", "ack 0"],
    displayAnswer: "0 (ACK0)",
    hint: "받은 패킷 번호 그대로",
    explanation: "ACK0을 다시 보내야 송신자가 pkt1로 넘어갈 수 있다." },

  // ===== 4번 GBN과 SR 시나리오 (6문제) =====
  {
    category: "GBN",
    question: "[GBN] 송신자가 윈도우 크기 5로 패킷 0, 1, 2, 3, 4를 연속 전송했고 패킷 1만 손실되었다. 나머지 패킷은 모두 수신 측에 도착했고 ACK는 손실되지 않는다.\n수신자가 패킷 3을 받았을 때 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["0", "0.0", "0.00"],
    displayAnswer: "0",
    explanation: "패킷 1이 빠졌으므로 순서에 맞게 받은 마지막 패킷인 0에 대해 다시 ACK(0)를 보낸다."
  },
  {
    category: "GBN",
    question: "[GBN] 송신자가 윈도우 크기 5로 패킷 0, 1, 2, 3, 4를 연속 전송했고 패킷 1만 손실되었다. 나머지 패킷은 모두 수신 측에 도착했고 ACK는 손실되지 않는다.\n패킷 1의 타이머가 만료되면 송신자가 재전송하는 패킷은 모두 몇 개인가? (숫자만 입력)",
    answers: ["4", "4.0", "4.00", "4개", "4 개", "4.0개", "4.0 개", "4.00개", "4.00 개"],
    displayAnswer: "4개",
    explanation: "패킷 1과 그 이후에 보낸 2, 3, 4를 모두 재전송한다."
  },
  {
    category: "GBN",
    question: "[GBN] 송신자가 윈도우 크기 5로 패킷 0, 1, 2, 3, 4를 연속 전송했고 패킷 1만 손실되었다. 나머지 패킷은 모두 수신 측에 도착했고 ACK는 손실되지 않는다.\n수신자가 버퍼에 저장해 두는 패킷은 몇 개인가? (숫자만 입력)",
    answers: ["0", "0.0", "0.00", "0개", "0 개", "0.0개", "0.0 개", "0.00개", "0.00 개"],
    displayAnswer: "0개",
    explanation: "GBN 수신자는 순서가 어긋난 패킷을 버리며 버퍼가 없다."
  },
  {
    category: "SR",
    question: "[SR] 송신자가 윈도우 크기 5로 패킷 0, 1, 2, 3, 4를 연속 전송했고 패킷 1만 손실되었다. 나머지 패킷은 모두 수신 측에 도착했고 ACK는 손실되지 않는다.\n수신자가 패킷 3을 받았을 때 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["3", "3.0", "3.00"],
    displayAnswer: "3",
    explanation: "SR은 받은 패킷마다 개별 ACK를 보낸다."
  },
  {
    category: "SR",
    question: "[SR] 송신자가 윈도우 크기 5로 패킷 0, 1, 2, 3, 4를 연속 전송했고 패킷 1만 손실되었다. 나머지 패킷은 모두 수신 측에 도착했고 ACK는 손실되지 않는다.\n패킷 1의 타이머가 만료되면 송신자가 재전송하는 패킷은 몇 개인가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1개", "1 개", "1.0개", "1.0 개", "1.00개", "1.00 개"],
    displayAnswer: "1개",
    explanation: "SR은 타임아웃된 패킷 1만 재전송한다."
  },
  {
    category: "SR",
    question: "송신 윈도우 크기가 5, 수신 윈도우 크기가 3인 SR이 문제없이 동작하기 위해 필요한 순서 번호 공간의 최소 크기는? (숫자만 입력)",
    answers: ["8", "8.0", "8.00"],
    displayAnswer: "8",
    explanation: "순서 번호 공간 ≥ SN + RN = 5 + 3 = 8."
  },

  // ===== 5번 역다중화 (3문제) =====
  { category: "다중화/역다중화", question: "서버의 UDP 소켓(포트 53)으로 서로 다른 두 호스트가 질의를 보냈다. 서버에서 두 세그먼트는 몇 개의 소켓으로 전달되는가? (숫자만 입력)",
    answers: ["1", "1개", "하나"],
    displayAnswer: "1개",
    hint: "목적지 포트가 같음",
    explanation: "UDP는 목적지 IP·포트로 소켓을 고르므로 출발지가 달라도 같은 소켓으로 간다." },
  { category: "다중화/역다중화", question: "이번에는 두 클라이언트가 같은 웹 서버의 TCP 포트 80에 각각 연결했다. 서버에서 사용하는 연결 소켓은 몇 개인가? (숫자만 입력)",
    answers: ["2", "2개", "두 개"],
    displayAnswer: "2개",
    hint: "출발지가 다름",
    explanation: "TCP는 4-tuple로 식별하므로 출발지가 다르면 다른 소켓이다." },
  { category: "다중화/역다중화", question: "TCP 소켓을 식별하는 값(출발지·목적지 IP와 포트)은 모두 몇 개인가? (숫자만 입력)",
    answers: ["4", "4개", "네 개"],
    displayAnswer: "4",
    hint: "tuple",
    explanation: "4-tuple: source IP, source port, dest IP, dest port." },

  // ===== 6번 체크섬 개념 (3문제) =====
  { category: "체크섬", question: "UDP/TCP 체크섬 계산에 포함되는 IP 주소 등을 담은 가상 헤더는?",
    answers: ["pseudoheader", "pseudo header", "pseudo-header", "의사 헤더", "의사헤더", "가상 헤더", "가상헤더", "슈도헤더"],
    displayAnswer: "pseudoheader(의사 헤더)",
    hint: "pseudo...",
    explanation: "UDP/TCP 체크섬 = pseudoheader + 헤더 + 데이터." },
  { category: "체크섬", question: "IP 체크섬의 계산 대상은?",
    answers: ["ip 헤더", "헤더", "ip헤더", "header", "ip header"],
    displayAnswer: "IP 헤더",
    hint: "데이터 제외",
    explanation: "IP 체크섬은 IP 헤더만 대상으로 한다." },
  { category: "체크섬", question: "체크섬은 1의 보수 합의 (        )이다. (두 글자)",
    answers: ["보수", "1의 보수", "1의보수", "반전", "complement"],
    displayAnswer: "보수",
    hint: "비트 반전",
    explanation: "체크섬 = 1의 보수 합의 보수." },
];
