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
  {
    category: "체크섬",
    question: "8비트 워드 11110000과 00111100의 체크섬(1의 보수 합의 보수)을 8비트로 쓰시오.",
    answers: ["11010010", "1101 0010", "1101-0010"],
    displayAnswer: "11010010",
    hint: "올림수를 더한 뒤 보수",
    explanation: "11110000+00111100의 1의 보수 합은 00101101이고 보수는 11010010이다."
  },
  {
    category: "체크섬",
    question: "8비트 워드 10000001, 01111110, 00000011의 체크섬을 8비트로 쓰시오.",
    answers: ["11111100", "1111 1100", "1111-1100"],
    displayAnswer: "11111100",
    hint: "합을 구한 뒤 비트를 뒤집는다",
    explanation: "1의 보수 합은 00000011이고 보수는 11111100이다."
  },
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
  {
    category: "TCP 순서/ACK",
    question: "순서 번호 7000에서 300바이트, 7300에서 500바이트 세그먼트를 순서대로 모두 받은 수신자의 ACK 번호는? (숫자만 입력)",
    answers: ["7800", "7800.0", "7800.00"],
    displayAnswer: "7800",
    hint: "마지막 세그먼트의 끝 다음 번호",
    explanation: "7300+500=7800이다."
  },
  {
    category: "TCP 타이머",
    question: "시간대기(TIME_WAIT) 타이머의 값은 2 × (    )이다. 빈칸의 약어는?",
    answers: ["msl", "엠에스엘"],
    displayAnswer: "MSL",
    explanation: "MSL은 최대 세그먼트 수명이며 이전 연결의 지연, 중복 패킷을 폐기하기 위해 기다린다."
  },
  {
    category: "TCP 타이머",
    question: "MSL이 가리키는 것을 한글로 쓰시오.",
    answers: ["최대 세그먼트 수명", "최대세그먼트수명", "최대 세그먼트 생존 시간", "최대 세그먼트 수명 시간", "세그먼트 최대 수명", "최대 세그먼트 생존시간"],
    displayAnswer: "최대 세그먼트 수명",
    explanation: "Maximum Segment Lifetime이다."
  },
  {
    category: "혼잡 제어",
    question: "TCP Tahoe는 타임아웃이든 3중복 ACK든 손실이 발생하면 cwnd를 몇 MSS로 설정하는가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1mss", "1 mss", "1.0mss", "1.0 mss", "1.00mss", "1.00 mss"],
    displayAnswer: "1 MSS",
    hint: "항상 같은 값",
    explanation: "Tahoe always sets cwnd to 1이다."
  },
  {
    category: "혼잡 제어",
    question: "슬로 스타트에서 ACK를 하나 받을 때마다 cwnd는 몇 MSS씩 증가하는가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1mss", "1 mss", "1.0mss", "1.0 mss", "1.00mss", "1.00 mss"],
    displayAnswer: "1 MSS",
    explanation: "ACK마다 1 MSS씩 늘리면 RTT마다 cwnd가 두 배가 된다."
  },
  {
    category: "혼잡 제어",
    question: "혼잡 회피에서 ACK마다 MSS×(MSS/cwnd)를 더하면 RTT당 총 증가량은 몇 MSS인가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1mss", "1 mss", "1.0mss", "1.0 mss", "1.00mss", "1.00 mss"],
    displayAnswer: "1 MSS",
    explanation: "한 RTT에 cwnd/MSS개의 ACK가 오므로 총 1 MSS씩 선형 증가한다."
  },
  {
    category: "TCP 처리율",
    question: "손실이 발생하는 윈도우 크기를 W라 할 때 평균 윈도우 크기는 W의 몇 배인가? (분수로 입력, 예: 1/2)",
    answers: ["3/4", "0.75", "4분의 3", "3분의4", "3/4배", "사분의 삼", "0.75배"],
    displayAnswer: "3/4",
    explanation: "윈도우는 W/2에서 W까지 선형 증가하므로 평균은 3/4 W이고 평균 처리율은 (3/4)W/RTT다."
  },
  {
    category: "공정성",
    question: "링크에 이미 TCP 연결 9개가 있을 때 한 응용이 병렬 TCP 연결 11개를 열면 링크 용량 R의 얼마를 얻는가? (예: R/3)",
    answers: ["r/2", "1/2", "2분의 1", "절반", "r의 절반", "r/2입니다", "r의 1/2", "이분의 일"],
    displayAnswer: "R/2",
    explanation: "병렬 연결을 많이 열면 더 큰 몫을 가져가므로 TCP의 공정성이 깨진다."
  },
];
