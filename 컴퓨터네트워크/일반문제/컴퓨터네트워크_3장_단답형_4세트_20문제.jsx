// 컴퓨터네트워크_3장_단답형_4세트_20문제.jsx
// 근거: 수업자료 Chapter 3 Transport Layer, Checksum
const META = {
  group: "컴퓨터네트워크",
  unit: "3장",
  title: "3장 전송 계층 단답형 4세트 20문제"
};

const SA_QUESTIONS = [
  {
    category: "체크섬",
    question: "IP 체크섬은 패킷의 어느 부분을 대상으로 계산하는가?",
    answers: ["ip 헤더", "헤더", "ip헤더", "ip header", "header", "ip 헤더만", "헤더만"],
    displayAnswer: "IP 헤더",
    explanation: "UDP/TCP 체크섬은 의사 헤더, 헤더, 응용 데이터를 포함한다."
  },
  {
    category: "체크섬",
    question: "UDP/TCP 체크섬 계산에 포함되는, 전송되지 않고 계산에만 쓰이는 가상의 헤더를 무엇이라 하는가?",
    answers: ["의사 헤더", "의사헤더", "pseudo header", "pseudoheader", "pseudo-header", "가상 헤더", "가상헤더", "수도 헤더"],
    displayAnswer: "의사 헤더(Pseudo header)",
    explanation: "UDP/TCP 체크섬은 의사 헤더, 헤더, 데이터 세 부분을 포함한다."
  },
  { category: "체크섬", question: "1의 보수 합을 구할 때 오른쪽 n비트의 왼쪽으로 넘친 비트를 무엇이라 하는가?",
    answers: ["carry", "캐리", "올림수", "올림", "자리 올림"],
    displayAnswer: "carry(올림수)",
    hint: "올림",
    explanation: "carry = 0이면 일반 합이 그대로 1의 보수 합, ≠ 0이면 carry를 다시 더한다." },
  { category: "체크섬", question: "체크섬은 1의 보수 합의 무엇인가? (두 글자)",
    answers: ["보수", "1의 보수", "1의보수", "반전", "complement"],
    displayAnswer: "보수",
    hint: "비트를 뒤집은 값",
    explanation: "체크섬 = 1의 보수 합의 보수. 1의 보수 합 자체가 체크섬은 아니다." },
  {
    category: "rdt",
    question: "rdt1.0은 어떤 성질의 채널을 가정하는가? (비트 오류도 손실도 없는)",
    answers: ["신뢰할 수 있는 채널", "완전히 신뢰할 수 있는 채널", "신뢰 가능한 채널", "신뢰성 있는 채널", "완전 신뢰 채널", "신뢰적 채널", "reliable channel", "완전히 신뢰 가능한 채널", "신뢰할 수 있는", "신뢰 채널", "신뢰할수있는 채널"],
    displayAnswer: "완전히 신뢰할 수 있는 채널",
    explanation: "no bit errors, no loss of packets."
  },
  {
    category: "rdt",
    question: "rdt2.0에서 오류 검출 외에 새로 추가된, 수신자가 송신자에게 ACK/NAK를 보내는 메커니즘을 무엇이라 하는가?",
    answers: ["피드백", "feedback", "제어 메시지", "피드백 메시지", "제어메시지"],
    displayAnswer: "피드백(Feedback)",
    explanation: "새 메커니즘은 오류 검출과 수신자에서 송신자로의 피드백(ACK, NAK)이다."
  },
  {
    category: "rdt",
    question: "rdt2.0의 치명적 결함은 ACK나 NAK가 어떻게 될 때 발생하는가?",
    answers: ["손상", "손상될 때", "손상된 경우", "깨질 때", "corrupted", "손상되었을 때", "오류", "변조", "깨짐"],
    displayAnswer: "손상(corrupted)될 때",
    explanation: "송신자는 수신자에게 무슨 일이 있었는지 알 수 없어 중복 가능성 때문에 그냥 재전송할 수 없다."
  },
  {
    category: "rdt",
    question: "rdt3.0은 채널이 비트 오류뿐 아니라 무엇도 일으킬 수 있다고 새로 가정하는가? (패킷에 일어나는 일)",
    answers: ["손실", "패킷 손실", "loss", "유실", "패킷 유실", "분실", "패킷 분실"],
    displayAnswer: "손실(패킷 손실)",
    explanation: "데이터와 ACK 모두 손실될 수 있다고 가정한다."
  },
  {
    category: "파이프라이닝",
    question: "파이프라이닝을 하려면 순서 번호의 범위를 어떻게 해야 하는가?",
    answers: ["늘려야", "늘려야 한다", "늘린다", "증가", "증가시켜야", "확대", "늘려야함", "늘려야 함", "증가시켜야 한다", "넓혀야 한다", "확대해야 한다", "더 크게"],
    displayAnswer: "늘려야 한다(증가)",
    explanation: "range of sequence numbers must be increased이며 송신자/수신자 버퍼링도 필요하다."
  },
  {
    category: "GBN",
    question: "GBN 송신자가 다음에 전송할 패킷의 순서 번호를 가리키는 변수는?",
    answers: ["nextseqnum", "next seq num", "next sequence number", "nextseqnum()", "next seq #", "next_seq_num"],
    displayAnswer: "NextSeqNum",
    explanation: "SendBase, NextSeqNum, WindowSize가 GBN 송신자의 변수다."
  },
  {
    category: "GBN",
    question: "GBN 수신자가 pkt0, pkt1을 받고 pkt3을 받아 버린 뒤, pkt2를 받았다. 이때 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["2", "2.0", "2.00"],
    displayAnswer: "2",
    hint: "순서대로 받은 가장 높은 번호",
    explanation: "pkt2는 순서대로 도착했으므로 전달하고 ack2를 보낸다. 앞서 버린 pkt3은 재전송되어야 한다."
  },
  {
    category: "SR",
    question: "SR에서 순서 번호 공간이 윈도우보다 충분히 크지 않을 때 수신자는 재전송된 패킷을 무엇으로 오인하는가?",
    answers: ["새 패킷", "새로운 패킷", "새 데이터", "새로운 데이터", "새 것", "새 패킷으로", "새로운", "new packet", "새 패킷으로 오인", "새로운 패킷으로", "새로운 데이터로", "새 데이터로"],
    displayAnswer: "새 패킷(새 데이터)",
    explanation: "duplicate data accepted as new in (b)."
  },
  { category: "UDP", question: "UDP를 정의한 RFC 번호는? (숫자만 입력)",
    answers: ["768", "rfc768", "rfc 768"],
    displayAnswer: "768",
    hint: "7으로 시작",
    explanation: "UDP: User Datagram Protocol [RFC 768]." },
  { category: "다중화/역다중화", question: "UDP 소켓은 수신 세그먼트의 목적지 IP와 무엇으로 결정되는가?",
    answers: ["목적지 포트", "목적지 포트 번호", "목적지포트", "destination port", "dest port"],
    displayAnswer: "목적지 포트 번호",
    hint: "dest ...",
    explanation: "UDP는 목적지 IP·포트로 소켓을 정하고, TCP는 4-tuple을 쓴다." },
  { category: "다중화/역다중화", question: "TCP 소켓을 식별하는 네 값(출발지·목적지 IP와 포트)의 묶음은?",
    answers: ["4-tuple", "4 tuple", "4tuple", "4튜플", "4-튜플", "4 튜플", "four tuple"],
    displayAnswer: "4-tuple",
    hint: "네 값",
    explanation: "TCP demux는 4-tuple 모두를 사용한다." },
  { category: "rdt", question: "rdt2.2에서 송신자가 NAK를 받은 것과 같게 처리하는 것은?",
    answers: ["중복 ack", "중복ack", "duplicate ack", "중복된 ack", "dup ack"],
    displayAnswer: "중복 ACK",
    hint: "같은 번호의 ACK",
    explanation: "rdt2.2: 중복 ACK = NAK → 현재 패킷 재전송." },
  { category: "rdt", question: "rdt3.0에서 송신자가 ACK를 기다리는 시간을 재는 것은? (영어 두 단어 또는 한글)",
    answers: ["카운트다운 타이머", "카운트다운타이머", "countdown timer", "타이머", "timer", "카운트 다운 타이머"],
    displayAnswer: "카운트다운 타이머",
    hint: "countdown",
    explanation: "rdt3.0은 카운트다운 타이머로 일정 시간 ACK가 없으면 재전송한다." },
  { category: "GBN", question: "GBN의 ACK(n)은 n번까지 순서대로 모두 받았다는 뜻이다. 이런 ACK를 무엇이라 하는가?",
    answers: ["누적", "누적 ack", "누적ack", "누적 확인 응답", "cumulative", "cumulative ack", "cumulative ack"],
    displayAnswer: "누적 ACK",
    hint: "cumulative",
    explanation: "GBN = 누적 ACK, SR = 개별 ACK." },
  { category: "SR", question: "SR 송신자는 타이머를 몇 개 두는가? (미확인 패킷마다 / 하나)",
    answers: ["패킷마다", "미확인 패킷마다", "각 패킷마다", "패킷별", "n개", "여러 개"],
    displayAnswer: "미확인 패킷마다",
    hint: "GBN은 하나",
    explanation: "SR = 미확인 패킷마다 타이머, GBN = 타이머 1개." },
  { category: "SR", question: "SR이 딜레마 없이 동작하려면 순서 번호 공간 크기가 무엇 이상이어야 하는가? (약어로 식을 쓰시오)",
    answers: ["sn+rn", "sn + rn", "rn+sn", "rn + sn", "송신 윈도우 + 수신 윈도우", "송신윈도우+수신윈도우"],
    displayAnswer: "SN + RN",
    hint: "두 윈도우의 합",
    explanation: "seq # 크기 ≥ SN(송신 윈도우) + RN(수신 윈도우)." },
];
