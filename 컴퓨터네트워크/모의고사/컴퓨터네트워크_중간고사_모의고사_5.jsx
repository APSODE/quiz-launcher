// 컴퓨터네트워크_중간고사_모의고사_5.jsx
// 2024, 2025 기출 형식(OX, 빈칸, DNS, 재전송, 윈도우, Reno)을 따른 모의고사 5회
// 정답은 수업자료 기준으로 직접 풀이한 것이다.
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 5회",
  topic: "OX · 빈칸 · DNS 일반 · 정지-대기 · 수신 윈도우 0 · Reno 계산"
};

const QUESTIONS = [

  // ===== 1번 OX (10문제) =====
  {
    category: "상위 계층 식별",
    question: "이더넷 헤더의 EtherType 필드 값 0x0806은 상위 계층이 ARP임을 나타낸다.",
    answer: true,
    explanation: "EtherType은 0x0800이 IPv4, 0x0806이 ARP, 0x86DD가 IPv6다."
  },
  {
    category: "상위 계층 식별",
    question: "웹 서버(HTTP)가 사용하는 기본 포트 번호는 25번이다.",
    answer: false,
    explanation: "HTTP는 80, HTTPS는 443, SMTP는 25번이다."
  },
  {
    category: "회선 교환",
    question: "회선 교환은 FDM이나 TDM으로 링크 대역을 나누어 사용자에게 배정한다.",
    answer: true,
    explanation: "FDM은 주파수로, TDM은 시간으로 자원을 나눈다."
  },
  {
    category: "DNS",
    question: "반복적 질의(iterated query)는 접촉한 서버가 이름 해석을 모두 대신 수행해 결과만 돌려주는 방식이다.",
    answer: false,
    explanation: "그것은 재귀적 질의다. 반복적 질의에서는 접촉한 서버가 '이 서버에 물어보라'고 다음 서버를 알려 준다."
  },
  {
    category: "UDP",
    question: "UDP는 DNS와 SNMP 등에서 사용된다.",
    answer: true,
    explanation: "UDP는 연결 설정 지연이 없고 헤더가 작아 DNS, SNMP, 스트리밍 멀티미디어 등에 쓰인다."
  },
  {
    category: "GBN",
    question: "GBN 송신자는 타임아웃이 발생하면 타이머가 설정된 패킷 하나만 재전송한다.",
    answer: false,
    explanation: "GBN은 타이머가 설정된 패킷과 그 이후에 전송한 윈도우 안의 모든 미확인 패킷을 재전송한다."
  },
  {
    category: "SR",
    question: "SR 수신자는 이미 ACK한 [rcvbase-N, rcvbase-1] 범위의 패킷이 다시 도착하면 그 패킷에 대한 ACK를 다시 보낸다.",
    answer: true,
    explanation: "ACK가 손실되었을 수 있어 송신자가 윈도우를 이동할 수 있게 다시 ACK를 보낸다."
  },
  {
    category: "TCP 타이머",
    question: "TCP는 재전송된 세그먼트의 RTT 측정값도 EstimatedRTT 갱신에 반영한다.",
    answer: false,
    explanation: "재전송된 세그먼트의 ACK는 원본과 재전송 중 무엇에 대한 것인지 모호해 반영하지 않는다(Karn 알고리즘)."
  },
  {
    category: "혼잡 제어",
    question: "Fast Recovery 상태에서 중복 ACK를 받으면 cwnd를 1 MSS씩 증가시킨다.",
    answer: true,
    explanation: "수업자료의 TCP 혼잡 제어 상태도에서 Fast Recovery 중 duplicate ACK는 cwnd = cwnd + MSS이다."
  },
  {
    category: "TCP 연결",
    question: "TCP 연결 종료 후의 TIME_WAIT 상태는 연결을 즉시 해제해 자원을 빨리 반환하기 위한 것이다.",
    answer: false,
    explanation: "TIME_WAIT은 이전 연결의 지연, 중복 패킷이 늦게 도착하는 것을 막기 위해 2×MSL 동안 연결 정보를 유지하는 상태다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "네트워크 장치",
    question: "네트워크 계층(3계층)의 대표적인 장비는 (        )이다.",
    answers: ["라우터", "router"],
    displayAnswer: "라우터(Router)",
    explanation: "계층별 장비는 네트워크: 라우터, 데이터 링크: 스위치, 물리: 리피터와 허브다."
  },
  {
    category: "패킷 스위칭",
    question: "라우터에서 입력 링크로 들어온 패킷을 알맞은 출력 링크로 옮기는 동작을 (        )이라 한다.",
    answers: ["포워딩", "forwarding", "포워드", "forward"],
    displayAnswer: "포워딩(Forwarding)",
    hint: "라우팅과 구분",
    explanation: "경로를 정하는 것은 라우팅이고 입력에서 출력 링크로 옮기는 것은 포워딩이다."
  },
  {
    category: "DNS",
    question: "별칭(alias) 이름을 정규(canonical) 이름에 매핑하는 DNS 레코드 타입은 (        )이다.",
    answers: ["cname", "cname 레코드", "cname record"],
    displayAnswer: "CNAME",
    explanation: "CNAME의 name은 별칭, value는 정규 이름이다."
  },
  {
    category: "파이프라이닝",
    question: "파이프라이닝의 대표적인 두 방식은 GBN과 (        )이다.",
    answers: ["sr", "selective repeat", "선택적 반복", "선택 반복", "선택적반복", "셀렉티브 리피트"],
    displayAnswer: "SR(Selective Repeat)",
    explanation: "GBN은 누적 ACK와 1개의 타이머, SR은 개별 ACK와 N개의 타이머를 쓴다."
  },
  {
    category: "TCP 타이머",
    question: "TCP 타이머 중 수신 윈도우가 0일 때 주기적으로 1바이트를 보내 윈도우 크기를 확인하는 타이머는 (        ) 타이머이다.",
    answers: ["영속", "영속 타이머", "영속타이머", "persistence", "persistence timer", "persist", "persist timer", "퍼시스턴스", "지속", "지속 타이머"],
    displayAnswer: "영속 타이머(Persistence Timer)",
    explanation: "TCP 타이머는 재전송, 영속, 시간대기, 연결유지 타이머 네 가지다."
  },
  {
    category: "혼잡 제어",
    question: "TCP 혼잡 제어에서 cwnd가 ssthresh 이상일 때 RTT마다 1 MSS씩 선형으로 늘리는 단계를 (        )라 한다.",
    answers: ["혼잡 회피", "혼잡회피", "congestion avoidance", "ca"],
    displayAnswer: "혼잡 회피(Congestion Avoidance)",
    explanation: "슬로 스타트는 지수 증가, 혼잡 회피는 선형 증가다."
  },

  // ===== 3번 DNS 일반 (3문제) =====
  {
    category: "DNS",
    question: "전 세계의 루트 DNS 서버는 논리적으로 모두 몇 개인가? (숫자만 입력)",
    answers: ["13", "13.0", "13.00", "13개", "13 개", "13.0개", "13.0 개", "13.00개", "13.00 개"],
    displayAnswer: "13개",
    explanation: "13 logical root name servers이며 각각이 여러 곳에 복제되어 있다."
  },
  {
    category: "DNS",
    question: "DNS 레코드 포맷(Name, Value, Type, TTL)에서 TTL은 무엇을 정하는 값인가? (한 구절로 쓰시오)",
    answers: ["캐시 유효 시간", "캐시유효시간", "캐시 유효시간", "캐시 보관 시간", "캐시 보관시간", "캐시 저장 시간", "캐시에 저장되는 시간", "캐시 유지 시간", "캐시 만료 시간", "캐시 만료시간", "유효 시간", "유효시간"],
    displayAnswer: "캐시 유효 시간",
    hint: "이름 서버가 매핑을 캐시에 보관하는 기간",
    explanation: "이름 서버는 학습한 매핑을 캐시하고 TTL이 지나면 삭제한다."
  },
  {
    category: "DNS",
    question: "조직이 직접 운영하며 자기 호스트의 이름과 IP 매핑을 공식적으로 제공하는 DNS 서버를 무엇이라 하는가?",
    answers: ["권한 있는 dns 서버", "권한있는 dns 서버", "권한 있는 네임 서버", "권한있는 네임서버", "권한 있는 이름 서버", "권한있는 이름 서버", "권한 서버", "권한서버", "authoritative dns server", "authoritative server", "authoritative name server", "authoritative dns", "authoritative"],
    displayAnswer: "권한 있는(Authoritative) DNS 서버",
    explanation: "authoritative DNS server는 조직이나 서비스 제공자가 유지하며 호스트 이름과 IP의 공식 매핑을 제공한다."
  },

  // ===== 4번 정지-대기 전송 횟수 (4문제) =====
  {
    category: "정지-대기",
    question: "정지-대기(rdt3.0) 방식으로 송신자가 pkt0, pkt1, pkt2, pkt3을 차례로 전송한다. pkt0과 pkt3은 문제없이 전달되어 ACK도 정상 도착한다. pkt1은 첫 전송 때 손실되어 타임아웃 후 재전송되어 전달된다. pkt2는 정상 도착했지만 ACK2가 손실되어 타임아웃 후 pkt2가 재전송되고 수신자가 이를 중복으로 판별해 ACK2를 다시 보낸다.\n송신자가 전송한 데이터 패킷(재전송 포함)은 모두 몇 번인가? (숫자만 입력)",
    answers: ["6", "6.0", "6.00", "6번", "6 번", "6.0번", "6.0 번", "6.00번", "6.00 번", "6개", "6 개", "6.0개", "6.0 개", "6.00개", "6.00 개", "6회", "6 회", "6.0회", "6.0 회", "6.00회", "6.00 회"],
    displayAnswer: "6번",
    hint: "재전송도 전송 횟수에 포함",
    explanation: "pkt0: 전송 1번, pkt1: 첫 전송 손실 후 재전송으로 2번, pkt2: ACK 손실로 재전송해 2번, pkt3: 1번이다. 합계 1+2+2+1=6번이다."
  },
  {
    category: "정지-대기",
    question: "정지-대기(rdt3.0) 방식으로 송신자가 pkt0, pkt1, pkt2, pkt3을 차례로 전송한다. pkt0과 pkt3은 문제없이 전달되어 ACK도 정상 도착한다. pkt1은 첫 전송 때 손실되어 타임아웃 후 재전송되어 전달된다. pkt2는 정상 도착했지만 ACK2가 손실되어 타임아웃 후 pkt2가 재전송되고 수신자가 이를 중복으로 판별해 ACK2를 다시 보낸다.\n송신자에서 타임아웃이 발생한 횟수는? (숫자만 입력)",
    answers: ["2", "2.0", "2.00", "2번", "2 번", "2.0번", "2.0 번", "2.00번", "2.00 번", "2회", "2 회", "2.0회", "2.0 회", "2.00회", "2.00 회"],
    displayAnswer: "2번",
    hint: "손실된 것마다 한 번",
    explanation: "pkt0: 전송 1번, pkt1: 첫 전송 손실 후 재전송으로 2번, pkt2: ACK 손실로 재전송해 2번, pkt3: 1번이다. pkt1(데이터 손실)과 pkt2(ACK 손실)에서 각각 한 번씩 타임아웃이 발생해 모두 2번이다."
  },
  {
    category: "정지-대기",
    question: "정지-대기(rdt3.0) 방식으로 송신자가 pkt0, pkt1, pkt2, pkt3을 차례로 전송한다. pkt0과 pkt3은 문제없이 전달되어 ACK도 정상 도착한다. pkt1은 첫 전송 때 손실되어 타임아웃 후 재전송되어 전달된다. pkt2는 정상 도착했지만 ACK2가 손실되어 타임아웃 후 pkt2가 재전송되고 수신자가 이를 중복으로 판별해 ACK2를 다시 보낸다.\n수신자가 중복 패킷임을 판별한 횟수는? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1번", "1 번", "1.0번", "1.0 번", "1.00번", "1.00 번", "1회", "1 회", "1.0회", "1.0 회", "1.00회", "1.00 회"],
    displayAnswer: "1번",
    hint: "수신자가 이미 받은 패킷이 다시 온 경우",
    explanation: "pkt0: 전송 1번, pkt1: 첫 전송 손실 후 재전송으로 2번, pkt2: ACK 손실로 재전송해 2번, pkt3: 1번이다. pkt1은 첫 전송이 손실되어 수신자가 처음 받는 것이므로 중복이 아니다. 중복은 pkt2의 재전송 한 번뿐이다."
  },
  {
    category: "정지-대기",
    question: "정지-대기(rdt3.0) 방식으로 송신자가 pkt0, pkt1, pkt2, pkt3을 차례로 전송한다. pkt0과 pkt3은 문제없이 전달되어 ACK도 정상 도착한다. pkt1은 첫 전송 때 손실되어 타임아웃 후 재전송되어 전달된다. pkt2는 정상 도착했지만 ACK2가 손실되어 타임아웃 후 pkt2가 재전송되고 수신자가 이를 중복으로 판별해 ACK2를 다시 보낸다.\n수신자가 전송한 ACK는 손실된 것을 포함해 모두 몇 개인가? (숫자만 입력)",
    answers: ["5", "5.0", "5.00", "5개", "5 개", "5.0개", "5.0 개", "5.00개", "5.00 개", "5번", "5 번", "5.0번", "5.0 번", "5.00번", "5.00 번"],
    displayAnswer: "5개",
    hint: "ACK2는 두 번 전송된다",
    explanation: "ACK0, ACK1, ACK2(손실됨), ACK2(재전송에 대한 응답), ACK3이므로 모두 5개다. 송신자가 실제로 받는 ACK는 손실된 하나를 뺀 4개다."
  },

  // ===== 5번 TCP 수신 윈도우 0 (4문제) =====
  {
    category: "TCP 흐름 제어",
    question: "TCP 연결에서 송신자가 200바이트 길이의 DATA1~DATA3을 연속 전송했고 손실은 없다. 수신 버퍼 크기(RWND)는 600바이트이고 이전 데이터는 모두 처리되어 버퍼는 비어 있다. 수신자 응용 계층은 데이터를 전혀 읽어 가지 않는다. 각 ACK는 DATA를 받는 즉시 전송된다.\nACK2에 실려 오는 rwnd 값은? (숫자만 입력)",
    answers: ["200", "200.0", "200.00", "200바이트", "200 바이트", "200.0바이트", "200.0 바이트", "200.00바이트", "200.00 바이트"],
    displayAnswer: "200",
    hint: "RWND - 버퍼에 쌓인 양",
    explanation: "ACK2를 보낼 때 버퍼에는 DATA1, DATA2 400바이트가 쌓여 있으므로 rwnd=600-400=200이다. (ACK1은 400, ACK2는 200, ACK3은 0)"
  },
  {
    category: "TCP 흐름 제어",
    question: "TCP 연결에서 송신자가 200바이트 길이의 DATA1~DATA3을 연속 전송했고 손실은 없다. 수신 버퍼 크기(RWND)는 600바이트이고 이전 데이터는 모두 처리되어 버퍼는 비어 있다. 수신자 응용 계층은 데이터를 전혀 읽어 가지 않는다. 각 ACK는 DATA를 받는 즉시 전송된다.\nACK3에 실려 오는 rwnd 값은? (숫자만 입력)",
    answers: ["0", "0.0", "0.00", "0바이트", "0 바이트", "0.0바이트", "0.0 바이트", "0.00바이트", "0.00 바이트"],
    displayAnswer: "0",
    hint: "버퍼가 가득 찬다",
    explanation: "DATA1~DATA3 600바이트가 버퍼를 가득 채우므로 rwnd=0이다. 송신자는 더 이상 데이터를 보낼 수 없다."
  },
  {
    category: "TCP 흐름 제어",
    question: "TCP 연결에서 송신자가 200바이트 길이의 DATA1~DATA3을 연속 전송했고 손실은 없다. 수신 버퍼 크기(RWND)는 600바이트이고 이전 데이터는 모두 처리되어 버퍼는 비어 있다. 수신자 응용 계층은 데이터를 전혀 읽어 가지 않는다. 각 ACK는 DATA를 받는 즉시 전송된다.\nACK3으로 rwnd가 0이 된 뒤, 송신자가 윈도우 크기를 확인하기 위해 주기적으로 1바이트를 보낼 때 쓰는 TCP 타이머는?",
    answers: ["영속 타이머", "영속타이머", "persistence timer", "persist timer", "persistence", "persist", "퍼시스턴스 타이머", "지속 타이머", "지속타이머", "영속"],
    displayAnswer: "영속 타이머(Persistence Timer)",
    hint: "윈도우 크기 결정 타이머",
    explanation: "rwnd=0이면 송신자는 데이터를 보낼 수 없고, 이후 수신자가 버퍼를 비워 알려 주는 윈도우 갱신이 손실되는 교착을 막기 위해 영속 타이머로 1바이트씩 보내 확인한다."
  },
  {
    category: "TCP 흐름 제어",
    question: "TCP 연결에서 송신자가 200바이트 길이의 DATA1~DATA3을 연속 전송했고 손실은 없다. 수신 버퍼 크기(RWND)는 600바이트이고 이전 데이터는 모두 처리되어 버퍼는 비어 있다. 수신자 응용 계층은 데이터를 전혀 읽어 가지 않는다. 각 ACK는 DATA를 받는 즉시 전송된다.\n그 뒤 수신 응용 계층이 300바이트를 읽어 갔다. 이때 수신자가 알려 줄 수 있는 rwnd 값은? (숫자만 입력)",
    answers: ["300", "300.0", "300.00", "300바이트", "300 바이트", "300.0바이트", "300.0 바이트", "300.00바이트", "300.00 바이트"],
    displayAnswer: "300",
    hint: "RWND - 남은 데이터",
    explanation: "버퍼에 남은 데이터는 600-300=300바이트이므로 비어 있는 공간 rwnd=300이다."
  },

  // ===== 6번 TCP Reno 계산 (4문제) =====
  {
    category: "혼잡 제어",
    question: "TCP Reno에서 어떤 시점의 상태가 cwnd=32 MSS, ssthresh=64 MSS(혼잡 회피가 아니라 슬로 스타트 구간)이다. 이후 타임아웃이 발생했다. 수업자료의 혼잡 제어 규칙을 따른다.\n타임아웃 직후 ssthresh는? (숫자만 입력)",
    answers: ["16", "16.0", "16.00", "16MSS", "16 MSS", "16.0MSS", "16.0 MSS", "16.00MSS", "16.00 MSS"],
    displayAnswer: "16 MSS",
    hint: "손실 직전 cwnd의 절반",
    explanation: "타임아웃이면 ssthresh=cwnd/2=32/2=16, cwnd=1 MSS가 되고 슬로 스타트로 들어간다."
  },
  {
    category: "혼잡 제어",
    question: "TCP Reno에서 어떤 시점의 상태가 cwnd=32 MSS, ssthresh=64 MSS(혼잡 회피가 아니라 슬로 스타트 구간)이다. 이후 타임아웃이 발생했다. 수업자료의 혼잡 제어 규칙을 따른다.\n타임아웃 직후 cwnd는? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1MSS", "1 MSS", "1.0MSS", "1.0 MSS", "1.00MSS", "1.00 MSS"],
    displayAnswer: "1 MSS",
    hint: "슬로 스타트부터 다시",
    explanation: "타임아웃은 cwnd를 1 MSS로 만든다. 3개의 중복 ACK일 때만 절반 근처로 줄어든다."
  },
  {
    category: "혼잡 제어",
    question: "TCP Reno에서 어떤 시점의 상태가 cwnd=32 MSS, ssthresh=64 MSS(혼잡 회피가 아니라 슬로 스타트 구간)이다. 이후 타임아웃이 발생했다. 수업자료의 혼잡 제어 규칙을 따른다.\n타임아웃 후 RTT마다 cwnd가 두 배씩 늘 때, cwnd가 ssthresh(16)에 도달하기까지 걸리는 RTT 수는? (숫자만 입력)",
    answers: ["4", "4.0", "4.00", "4RTT", "4 RTT", "4.0RTT", "4.0 RTT", "4.00RTT", "4.00 RTT", "4번", "4 번", "4.0번", "4.0 번", "4.00번", "4.00 번"],
    displayAnswer: "4 RTT",
    hint: "1, 2, 4, 8, 16",
    explanation: "1 → 2 → 4 → 8 → 16으로 4번의 RTT가 걸린다."
  },
  {
    category: "혼잡 제어",
    question: "TCP Reno에서 어떤 시점의 상태가 cwnd=32 MSS, ssthresh=64 MSS(혼잡 회피가 아니라 슬로 스타트 구간)이다. 이후 타임아웃이 발생했다. 수업자료의 혼잡 제어 규칙을 따른다.\nssthresh에 도달한 뒤 혼잡 회피로 6 RTT가 더 지났을 때 cwnd는? (숫자만 입력)",
    answers: ["22", "22.0", "22.00", "22MSS", "22 MSS", "22.0MSS", "22.0 MSS", "22.00MSS", "22.00 MSS"],
    displayAnswer: "22 MSS",
    hint: "RTT당 1 MSS",
    explanation: "혼잡 회피에서는 RTT마다 1 MSS씩 늘어나므로 16+6=22이다."
  },
];
