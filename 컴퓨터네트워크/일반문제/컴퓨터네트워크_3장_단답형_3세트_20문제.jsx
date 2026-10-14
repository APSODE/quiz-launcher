// 컴퓨터네트워크_3장_단답형_3세트_20문제.jsx
// 근거: 수업자료 Chapter 3 Transport Layer, Checksum
const META = {
  group: "컴퓨터네트워크",
  unit: "3장",
  title: "3장 전송 계층 단답형 3세트 20문제"
};

const SA_QUESTIONS = [
  {
    category: "전송 계층",
    question: "전송 계층 프로토콜은 어디에서 실행되는가?",
    answers: ["종단 시스템", "종단시스템", "종단 호스트", "end system", "end systems", "호스트", "종단", "종단 장치", "end host", "단말", "단말 장치", "단말 시스템"],
    displayAnswer: "종단 시스템(호스트)",
    explanation: "transport protocols run in end systems이며 라우터에서는 실행되지 않는다."
  },
  {
    category: "역다중화",
    question: "UDP 소켓은 수신한 세그먼트의 어떤 값을 확인해 올바른 소켓으로 전달하는가?",
    answers: ["목적지 포트 번호", "목적지 포트", "dest 포트", "도착지 포트 번호", "도착지 포트", "목적지포트번호", "목적지포트", "수신 포트 번호", "수신 포트", "목적지 port"],
    displayAnswer: "목적지 포트 번호",
    explanation: "TCP는 4-튜플 전체를 사용한다."
  },
  {
    category: "UDP",
    question: "UDP가 연결 설정을 하지 않으므로 줄일 수 있는 지연은 무엇과 관련된 지연인가?",
    answers: ["연결 설정", "연결설정", "연결 설정 지연", "연결설정 지연", "핸드셰이킹", "핸드쉐이킹", "connection establishment", "연결 수립", "handshaking"],
    displayAnswer: "연결 설정 지연",
    explanation: "no connection establishment (which can add delay)."
  },
  {
    category: "체크섬",
    question: "8비트 워드 01100110과 10110101를 1의 보수 합으로 더한 결과를 8비트로 쓰시오. (올림수는 하위 비트에 더함)",
    answers: ["00011100", "0001 1100", "0001-1100"],
    displayAnswer: "00011100",
    hint: "올림수를 다시 더함",
    explanation: "일반 합은 100011011이며 올림수 1을 더하면 00011100이다."
  },
  {
    category: "체크섬",
    question: "8비트 워드 10101010, 01010101, 00001111의 체크섬(1의 보수 합의 보수)을 8비트로 쓰시오.",
    answers: ["11110000", "1111 0000", "1111-0000"],
    displayAnswer: "11110000",
    hint: "합을 구한 뒤 비트를 뒤집는다",
    explanation: "1의 보수 합은 00001111이고 이를 보수로 만든 11110000이 체크섬이다."
  },
  {
    category: "GBN",
    question: "GBN 수신자가 기억해야 하는 변수로 다음에 순서대로 받기를 기대하는 번호를 가리키는 것은?",
    answers: ["expectedseqnum", "expected seq num", "expected sequence number", "expected seq #", "expectedseqnum()", "expected seqnum", "expected_seq_num", "expectedsequencenumber"],
    displayAnswer: "ExpectedSeqNum",
    explanation: "GBN 수신자는 ExpectedSeqNum만 기억하면 된다."
  },
  {
    category: "SR",
    question: "SR 수신자가 윈도우의 시작 위치(아직 받지 못한 가장 앞 번호)를 가리키는 변수는?",
    answers: ["recvbase", "rcvbase", "recv base", "rcv base", "receive base", "recvbase()"],
    displayAnswer: "RecvBase",
    explanation: "SR 수신자는 RecvBase와 WindowSize를 가진다."
  },
  {
    category: "재전송 방식",
    question: "정지-대기, GBN, SR 중 타임아웃 시 타이머가 설정된 데이터와 그 이후에 전송한 모든 데이터를 재전송하는 방식은?",
    answers: ["gbn", "go-back-n", "go back n", "goback n", "gobackn"],
    displayAnswer: "GBN(Go-Back-N)",
    explanation: "SR은 타이머가 설정된 데이터만 재전송한다."
  },
  {
    category: "재전송 방식",
    question: "GBN과 SR 중 수신 버퍼가 없는 방식은?",
    answers: ["gbn", "go-back-n", "go back n", "goback n", "gobackn"],
    displayAnswer: "GBN",
    explanation: "SR은 수신 버퍼가 있어 순서가 어긋난 패킷을 보관한다."
  },
  {
    category: "TCP 헤더",
    question: "TCP 연결 설정 시 초기 순서 번호를 알리는 세그먼트에서 켜는 제어 비트는?",
    answers: ["syn", "syn 비트", "syn bit", "syn 플래그", "syn flag"],
    displayAnswer: "SYN",
    explanation: "SYN, FIN, RST는 연결 설정과 해제 명령에 쓰인다."
  },
  {
    category: "TCP 헤더",
    question: "TCP 연결 종료를 알릴 때 켜는 제어 비트는?",
    answers: ["fin", "fin 비트", "fin bit", "fin 플래그", "fin flag"],
    displayAnswer: "FIN",
    explanation: "FIN을 보낸 쪽은 더 이상 데이터를 보낼 수 없다."
  },
  {
    category: "TCP 순서/ACK",
    question: "순서 번호 1000부터 200바이트, 300바이트, 100바이트 세그먼트를 순서대로 받은 수신자가 보내는 누적 ACK 번호는? (숫자만 입력)",
    answers: ["1600", "1600.0", "1600.00"],
    displayAnswer: "1600",
    hint: "다음에 기대하는 바이트 번호",
    explanation: "1000+200+300+100=1600이다."
  },
  {
    category: "TCP ACK",
    question: "수신자가 순서가 어긋난(갭이 생긴) 세그먼트를 받았을 때 즉시 보내는 ACK를 무엇이라 하는가?",
    answers: ["중복 ack", "중복ack", "duplicate ack", "dup ack", "중복 ack(duplicate ack)", "중복 확인 응답", "duplicate acknowledgement", "중복 응답", "dupack", "dup-ack", "duplicate ack(중복 ack)"],
    displayAnswer: "중복 ACK(Duplicate ACK)",
    explanation: "기대하는 다음 바이트 번호를 담은 ACK를 즉시 보낸다."
  },
  {
    category: "RTT 추정",
    question: "첫 SampleRTT가 4.0초이고 RFC 2988 초기화를 따를 때, 두 번째 SampleRTT가 6.0초이면 갱신된 EstimatedRTT는 몇 초인가? (α=0.125, 숫자만 입력)",
    answers: ["4.25", "4.250", "4.2500", "4.25초", "4.25 초", "4.250초", "4.250 초", "4.2500초", "4.2500 초"],
    displayAnswer: "4.25초",
    hint: "0.875, 0.125",
    explanation: "0.875×4.0+0.125×6.0=3.5+0.75=4.25초다."
  },
  {
    category: "RTT 추정",
    question: "위와 같은 조건(첫 샘플 4.0초, 둘째 샘플 6.0초)에서 두 번째 샘플 직후의 TimeoutInterval은 몇 초인가? (β=0.25, EstimatedRTT를 먼저 갱신한 값으로 DevRTT 계산, 숫자만 입력)",
    answers: ["12", "12.0", "12.00", "12초", "12 초", "12.0초", "12.0 초", "12.00초", "12.00 초"],
    displayAnswer: "12초",
    hint: "DevRTT 먼저 구하기",
    explanation: "초기 DevRTT=2.0, 갱신 EstimatedRTT=4.25이다. DevRTT=0.75×2.0+0.25×|6.0-4.25|=1.9375이고 TimeoutInterval=4.25+4×1.9375=12초다."
  },
  {
    category: "혼잡 제어",
    question: "슬로 스타트에서 cwnd가 1 MSS로 시작해 손실 없이 4 RTT가 지나면 cwnd는 몇 MSS인가? (숫자만 입력)",
    answers: ["16", "16.0", "16.00", "16mss", "16 mss", "16.0mss", "16.0 mss", "16.00mss", "16.00 mss"],
    displayAnswer: "16 MSS",
    explanation: "RTT마다 두 배: 1→2→4→8→16이다."
  },
  {
    category: "혼잡 제어",
    question: "TCP가 혼잡(손실 이벤트)을 감지하는 두 가지 경우는 타임아웃과 무엇인가?",
    answers: ["3중복 ack", "triple duplicate ack", "중복 ack 3개", "3 duplicate acks", "3개의 중복 ack", "중복 ack 3번", "3 dup ack", "3중복ack", "triple duplicate acks", "triple dup ack", "중복 ack 3회", "3번 중복 ack", "3 중복 ack"],
    displayAnswer: "3중복 ACK(Triple duplicate ACK)",
    explanation: "loss event = timeout or 3 duplicate acks."
  },
  {
    category: "혼잡 제어",
    question: "슬로 스타트에서 cwnd가 ssthresh에 도달하면 전환되는 단계는?",
    answers: ["혼잡 회피", "혼잡회피", "congestion avoidance", "ca"],
    displayAnswer: "혼잡 회피(Congestion Avoidance)",
    explanation: "혼잡 회피에서는 RTT마다 1 MSS씩 선형 증가한다."
  },
  {
    category: "공정성",
    question: "K개의 TCP 세션이 대역폭 R인 병목 링크를 공유할 때 공정하다면 각 세션의 평균 속도는? (R, K로 쓰시오)",
    answers: ["r/k", "r÷k", "r / k", "k분의 r", "r을 k로 나눈 값", "r/k입니다"],
    displayAnswer: "R/K",
    explanation: "fairness goal: each should have average rate of R/K."
  },
  {
    category: "공정성",
    question: "멀티미디어 응용이 TCP 대신 UDP를 쓰는 이유는 혼잡 제어로 인해 무엇이 억제되는 것을 원하지 않기 때문인가?",
    answers: ["전송 속도", "전송률", "속도", "전송속도", "rate", "송신 속도", "전송 비율", "전송 레이트", "전송 속도가 억제"],
    displayAnswer: "전송 속도(rate)",
    explanation: "multimedia apps do not want rate throttled by congestion control."
  },
];
