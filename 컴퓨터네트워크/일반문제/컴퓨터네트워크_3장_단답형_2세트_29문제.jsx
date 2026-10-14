// 컴퓨터네트워크_3장_단답형_2세트_29문제.jsx
// 근거: 수업자료 Chapter 3 Transport Layer, Checksum
const META = {
  group: "컴퓨터네트워크",
  unit: "3장",
  title: "3장 전송 계층 단답형 2세트 29문제"
};

const SA_QUESTIONS = [
  {
    category: "전송 계층",
    question: "네트워크 계층은 호스트 간 논리적 통신을 제공한다. 전송 계층이 논리적 통신을 제공하는 대상은 무엇 사이인가?",
    answers: ["프로세스", "프로세스 간", "process", "processes", "응용 프로세스", "앱 프로세스"],
    displayAnswer: "프로세스",
    explanation: "household analogy에서 호스트는 집, 프로세스는 아이들에 비유한다."
  },
  {
    category: "UDP",
    question: "UDP 헤더는 출발지 포트, 목적지 포트, length, checksum 필드로 이루어진다. 각 필드가 16비트일 때 UDP 헤더의 크기는 몇 바이트인가? (숫자만 입력)",
    answers: ["8", "8.0", "8.00", "8바이트", "8 바이트", "8.0바이트", "8.0 바이트", "8.00바이트", "8.00 바이트", "8byte", "8 byte", "8.0byte", "8.0 byte", "8.00byte", "8.00 byte", "8bytes", "8 bytes", "8.0bytes", "8.0 bytes", "8.00bytes", "8.00 bytes"],
    displayAnswer: "8바이트",
    hint: "16비트 × 4",
    explanation: "16비트 × 4필드 = 64비트 = 8바이트다."
  },
  {
    category: "rdt",
    question: "rdt2.0에서 수신자가 송신자에게 보내는 두 종류의 제어 메시지를 쓰시오.",
    answers: ["ack, nak", "ack,nak", "ack nak", "ack와 nak", "ack/nak", "nak, ack", "nak,ack", "nak ack", "nak와 ack", "nak/ack", "ack 와 nak", "ack, nak 메시지"],
    displayAnswer: "ACK, NAK",
    explanation: "ACK는 정상 수신, NAK는 오류가 있음을 알린다."
  },
  {
    category: "rdt",
    question: "rdt2.2에서 NAK 대신 ACK만 쓸 때, 수신자가 ACK에 명시적으로 포함해야 하는 것은?",
    answers: ["순서 번호", "순서번호", "시퀀스 번호", "sequence number", "seq #", "seq", "seq number", "시퀀스번호"],
    displayAnswer: "순서 번호",
    explanation: "마지막으로 정상 수신한 패킷의 순서 번호를 담아 보내고 중복 ACK는 NAK와 같은 행동을 유발한다."
  },
  {
    category: "정지-대기",
    question: "패킷 길이 L=12000비트, 링크 R=100 Mbps, RTT=29.88 ms인 정지-대기 송신자의 활용률 U=(L/R)/(RTT+L/R)을 소수로 구하시오. (예: 0.5)",
    answers: ["0.004", "0.0040", "0.00400", ".004", "0.4%", "0.4 %", "0.4퍼센트"],
    displayAnswer: "0.004",
    hint: "L/R 먼저 계산",
    explanation: "L/R=12000/10^8=0.12ms이고 RTT+L/R=30ms이므로 U=0.12/30=0.004다."
  },
  {
    category: "파이프라이닝",
    question: "위 문제와 같은 조건에서 3개의 패킷을 파이프라이닝하면 활용률은 얼마인가? (소수로 입력)",
    answers: ["0.012", "0.0120", "0.01200", ".012", "1.2%", "1.2 %", "1.2퍼센트"],
    displayAnswer: "0.012",
    explanation: "3개 파이프라이닝은 활용률을 3배로 올리므로 0.004×3=0.012다."
  },
  {
    category: "GBN",
    question: "윈도우 N=4인 GBN에서 pkt0~pkt3을 전송했는데 pkt2가 손실되었다. 수신자가 pkt3을 받았을 때 (재)전송하는 ACK 번호는? (숫자만 입력)",
    answers: ["1", "ack1", "ack 1", "ack(1)"],
    displayAnswer: "1",
    hint: "순서대로 받은 마지막 번호",
    explanation: "pkt3은 순서가 어긋나 버리고, 순서대로 받은 가장 높은 번호인 pkt1에 대한 ack1을 다시 보낸다."
  },
  {
    category: "GBN",
    question: "GBN에서 pkt0~pkt3 전송 후 ack0, ack1을 받아 pkt4, pkt5를 추가 전송했다. 이때 pkt2가 타임아웃되면 재전송되는 패킷은 모두 몇 개인가? (pkt2 포함, 숫자만 입력)",
    answers: ["4", "4.0", "4.00", "4개", "4 개", "4.0개", "4.0 개", "4.00개", "4.00 개"],
    displayAnswer: "4개",
    hint: "타이머가 설정된 패킷과 그 이후 전송 패킷",
    explanation: "타임아웃된 pkt2와 이후 전송한 pkt3, pkt4, pkt5를 모두 재전송한다."
  },
  {
    category: "SR",
    question: "위와 같은 상황에서 SR이라면 재전송되는 패킷은 몇 개인가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1개", "1 개", "1.0개", "1.0 개", "1.00개", "1.00 개"],
    displayAnswer: "1개",
    hint: "타이머가 만료된 패킷만",
    explanation: "SR은 타임아웃된 패킷 하나(pkt2)만 재전송한다."
  },
  {
    category: "SR",
    question: "순서 번호 공간 크기가 4(0~3)이고 송신 윈도우와 수신 윈도우 크기가 같은 SR에서, 충돌 없이 쓸 수 있는 최대 윈도우 크기는? (숫자만 입력)",
    answers: ["2", "2.0", "2.00"],
    displayAnswer: "2",
    hint: "공간 ≥ SN+RN",
    explanation: "순서 번호 공간 ≥ SN+RN이고 SN=RN이므로 4 ≥ 2×윈도우, 즉 윈도우는 2 이하다. 윈도우 3이면 새 패킷과 재전송 패킷을 구분하지 못한다."
  },
  {
    category: "SR",
    question: "순서 번호 공간 크기가 7이고 SR 송신 윈도우 SN=4일 때, 수신 윈도우 RN의 최대값은? (숫자만 입력)",
    answers: ["3", "3.0", "3.00"],
    displayAnswer: "3",
    hint: "공간 ≥ SN+RN",
    explanation: "7 ≥ SN+RN이므로 RN ≤ 3이다."
  },
  {
    category: "TCP 순서/ACK",
    question: "송신자가 [seq=1000, 100바이트], [seq=1100, 200바이트], [seq=1300, 100바이트] 세그먼트를 보냈고 수신자가 모두 순서대로 받았을 때 ACK 번호는? (숫자만 입력)",
    answers: ["1400", "1400.0", "1400.00"],
    displayAnswer: "1400",
    explanation: "수신자가 다음에 기대하는 바이트 번호 1300+100=1400이다."
  },
  {
    category: "TCP 순서/ACK",
    question: "호스트 A가 Seq=42, ACK=79로 1바이트 데이터 'C'를 보냈다. 호스트 B가 이를 받고 'C'를 되돌려 보내는 세그먼트의 ACK 번호는? (숫자만 입력)",
    answers: ["43", "43.0", "43.00"],
    displayAnswer: "43",
    explanation: "B는 A의 42번 바이트를 받았으므로 다음 기대 바이트인 43을 ACK한다. (Seq=79, ACK=43)"
  },
  {
    category: "RTT 추정",
    question: "RFC 2988 초기화에서 첫 SampleRTT가 100ms일 때 DevRTT의 초기값은 몇 ms인가? (숫자만 입력)",
    answers: ["50", "50.0", "50.00", "50ms", "50 ms", "50.0ms", "50.0 ms", "50.00ms", "50.00 ms", "50밀리초", "50 밀리초", "50.0밀리초", "50.0 밀리초", "50.00밀리초", "50.00 밀리초", "50msec", "50 msec", "50.0msec", "50.0 msec", "50.00msec", "50.00 msec"],
    displayAnswer: "50ms",
    explanation: "초기에 EstimatedRTT=SampleRTT, DevRTT=SampleRTT/2다."
  },
  {
    category: "RTT 추정",
    question: "첫 SampleRTT가 100ms일 때 초기 TimeoutInterval은 몇 ms인가? (숫자만 입력)",
    answers: ["300", "300.0", "300.00", "300ms", "300 ms", "300.0ms", "300.0 ms", "300.00ms", "300.00 ms", "300밀리초", "300 밀리초", "300.0밀리초", "300.0 밀리초", "300.00밀리초", "300.00 밀리초", "300msec", "300 msec", "300.0msec", "300.0 msec", "300.00msec", "300.00 msec"],
    displayAnswer: "300ms",
    explanation: "EstimatedRTT=100, DevRTT=50이므로 100+4×50=300ms다."
  },
  {
    category: "RTT 추정",
    question: "EstimatedRTT=100ms에서 새 SampleRTT=180ms를 측정했다. α=0.125일 때 갱신된 EstimatedRTT는 몇 ms인가? (숫자만 입력)",
    answers: ["110", "110.0", "110.00", "110ms", "110 ms", "110.0ms", "110.0 ms", "110.00ms", "110.00 ms", "110밀리초", "110 밀리초", "110.0밀리초", "110.0 밀리초", "110.00밀리초", "110.00 밀리초", "110msec", "110 msec", "110.0msec", "110.0 msec", "110.00msec", "110.00 msec"],
    displayAnswer: "110ms",
    explanation: "0.875×100+0.125×180=87.5+22.5=110ms다."
  },
  {
    category: "RTT 추정",
    question: "DevRTT=50ms, SampleRTT=180ms일 때 β=0.25로 DevRTT를 갱신하시오. 이때 EstimatedRTT는 위 문제처럼 먼저 110ms로 갱신된 값을 사용한다. (숫자만 입력)",
    answers: ["55", "55.0", "55.00", "55ms", "55 ms", "55.0ms", "55.0 ms", "55.00ms", "55.00 ms", "55밀리초", "55 밀리초", "55.0밀리초", "55.0 밀리초", "55.00밀리초", "55.00 밀리초", "55msec", "55 msec", "55.0msec", "55.0 msec", "55.00msec", "55.00 msec"],
    displayAnswer: "55ms",
    hint: "|SampleRTT-EstimatedRTT| 사용",
    explanation: "0.75×50+0.25×|180-110|=37.5+17.5=55ms다."
  },
  {
    category: "지연 ACK",
    question: "순서대로 도착한 세그먼트에 대해 이전 데이터가 모두 ACK된 상태라면, TCP 수신자는 다음 세그먼트를 최대 몇 ms까지 기다린 뒤 ACK를 보내는가? (표준값, 숫자만 입력)",
    answers: ["500", "500.0", "500.00", "500ms", "500 ms", "500.0ms", "500.0 ms", "500.00ms", "500.00 ms", "500밀리초", "500 밀리초", "500.0밀리초", "500.0 밀리초", "500.00밀리초", "500.00 밀리초", "500msec", "500 msec", "500.0msec", "500.0 msec", "500.00msec", "500.00 msec"],
    displayAnswer: "500ms",
    explanation: "delayed ACK: wait up to 500ms for next segment. (Windows는 200ms)"
  },
  {
    category: "빠른 재전송",
    question: "송신자가 Seq=92(8바이트)를 보낸 뒤 ACK=100을 처음 한 번 받고, 같은 ACK=100을 3번 더 받았다. 빠른 재전송으로 재전송하는 세그먼트의 순서 번호는? (숫자만 입력)",
    answers: ["100", "100.0", "100.00"],
    displayAnswer: "100",
    explanation: "ACK=100은 100번 바이트를 기대한다는 뜻이므로 seq=100 세그먼트를 재전송한다."
  },
  {
    category: "흐름 제어",
    question: "RcvBuffer가 4096바이트이고 버퍼에 쌓인 데이터가 1000바이트일 때 수신자가 광고하는 rwnd는 몇 바이트인가? (숫자만 입력)",
    answers: ["3096", "3096.0", "3096.00", "3096바이트", "3096 바이트", "3096.0바이트", "3096.0 바이트", "3096.00바이트", "3096.00 바이트", "3096byte", "3096 byte", "3096.0byte", "3096.0 byte", "3096.00byte", "3096.00 byte", "3096bytes", "3096 bytes", "3096.0bytes", "3096.0 bytes", "3096.00bytes", "3096.00 bytes"],
    displayAnswer: "3096",
    hint: "RcvBuffer - 버퍼링된 데이터",
    explanation: "rwnd는 남은 버퍼 공간이므로 4096-1000=3096이다."
  },
  {
    category: "TCP 연결",
    question: "FIN 세그먼트(데이터 없음)의 순서 번호가 1500일 때 상대방이 응답하는 ACK 번호는? (숫자만 입력)",
    answers: ["1501", "1501.0", "1501.00"],
    displayAnswer: "1501",
    explanation: "FIN은 순서 번호를 1 소비하므로 1500+1=1501이다."
  },
  {
    category: "TCP 연결",
    question: "클라이언트가 SYN을 보낸 뒤 SYNACK을 받기 전까지의 클라이언트 상태는?",
    answers: ["syn sent", "syn_sent", "synsent", "syn-sent", "syn sent 상태"],
    displayAnswer: "SYN SENT",
    explanation: "클라이언트: CLOSED → SYN SENT → ESTAB, 서버: LISTEN → SYN RCVD → ESTAB 순서다."
  },
  {
    category: "혼잡 제어",
    question: "TCP 슬로 스타트에서 cwnd의 초기값이 1 MSS일 때, 손실 없이 3 RTT가 지난 뒤 cwnd는 몇 MSS인가? (숫자만 입력)",
    answers: ["8", "8.0", "8.00", "8mss", "8 mss", "8.0mss", "8.0 mss", "8.00mss", "8.00 mss"],
    displayAnswer: "8 MSS",
    explanation: "RTT마다 두 배가 되므로 1→2→4→8이다."
  },
  {
    category: "혼잡 제어",
    question: "cwnd=20 MSS일 때 타임아웃이 발생하면 ssthresh는 몇 MSS가 되는가? (숫자만 입력)",
    answers: ["10", "10.0", "10.00", "10mss", "10 mss", "10.0mss", "10.0 mss", "10.00mss", "10.00 mss"],
    displayAnswer: "10 MSS",
    explanation: "타임아웃: ssthresh=cwnd/2=10, cwnd=1 MSS로 슬로 스타트를 시작한다."
  },
  {
    category: "혼잡 제어",
    question: "TCP Reno 상태도(Fast Recovery 진입)에서 cwnd=20 MSS일 때 3중복 ACK를 받으면 ssthresh=cwnd/2, cwnd=ssthresh+3으로 설정한다. 이때의 cwnd는 몇 MSS인가? (숫자만 입력)",
    answers: ["13", "13.0", "13.00", "13mss", "13 mss", "13.0mss", "13.0 mss", "13.00mss", "13.00 mss"],
    displayAnswer: "13 MSS",
    explanation: "ssthresh=10이고 cwnd=10+3=13이다."
  },
  {
    category: "TCP 처리율",
    question: "손실이 발생하는 윈도우 크기 W=40000바이트, RTT=100ms일 때 평균 TCP 처리율(3/4 W/RTT)은 초당 몇 바이트인가? (숫자만 입력)",
    answers: ["300000", "300,000", "300000바이트/초", "300000 bytes/sec", "300000bytes/sec", "300000B/s", "300000 B/s"],
    displayAnswer: "300000바이트/초",
    hint: "평균 윈도우는 W의 3/4",
    explanation: "0.75×40000/0.1=300000 bytes/sec다."
  },
  {
    category: "공정성",
    question: "링크 용량 R에 이미 TCP 연결 9개가 있을 때 새 응용이 TCP 연결 1개를 열면 얻는 속도는 R의 몇 분의 1인가? (예: R/2 → 2)",
    answers: ["10", "r/10", "1/10", "10분의 1", "십분의 일", "10분의1"],
    displayAnswer: "R/10 (10분의 1)",
    explanation: "연결 10개가 균등하게 나누므로 R/10이다. 같은 조건에서 연결 11개를 열면 R/2를 얻는다."
  },
  {
    category: "ECN",
    question: "ECN에서 수신자가 IP 헤더의 혼잡 표시를 보고 ACK 세그먼트에 설정해 송신자에게 알리는 비트는?",
    answers: ["ece", "ece 비트", "ece=1"],
    displayAnswer: "ECE",
    explanation: "수신자는 receiver-to-sender ACK의 ECE bit를 설정한다."
  },
  {
    category: "연결 유지",
    question: "TCP 타이머 중 일정 시간 통신이 없을 때 연결 상태를 확인하는 타이머는? (7200초 후 probe 전송)",
    answers: ["연결유지 타이머", "연결 유지 타이머", "연결유지타이머", "keep-alive", "keepalive", "keep-alive timer", "keep alive", "keep alive timer", "keepalive timer", "킵얼라이브"],
    displayAnswer: "연결유지(Keep-alive) 타이머",
    explanation: "7200초(2시간) 통신이 없으면 75초 간격으로 probe packet을 9번 보내 응답이 없으면 연결을 종료한다."
  },
];
