// 컴퓨터네트워크_중간고사_모의고사_4.jsx
// 2024, 2025 기출 형식(OX, 빈칸, DNS, 재전송, 윈도우, 타임아웃)을 따른 모의고사 4회
// 정답은 수업자료 기준으로 직접 풀이한 것이다.
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 4회",
  topic: "OX · 빈칸 · DNS 레코드 · 빠른 재전송 · SR · Karn 알고리즘"
};

const QUESTIONS = [

  // ===== 1번 OX (10문제) =====
  {
    category: "패킷 스위칭",
    question: "저장 후 전달(store-and-forward) 방식은 회선 교환에서 사용되는 개념이다.",
    answer: false,
    explanation: "저장 후 전달은 패킷 교환의 개념이다. 회선 교환은 store and forward 없이 입력에서 출력 링크로 바로 전달한다."
  },
  {
    category: "패킷 지연",
    question: "트래픽 강도 La/R이 1보다 크면 큐에 계속 쌓여 평균 큐잉 지연이 무한대가 된다.",
    answer: true,
    explanation: "서비스할 수 있는 양보다 도착하는 양이 많으면 평균 지연이 무한대가 된다."
  },
  {
    category: "MIME",
    question: "MIME는 메일 헤더에 콘텐츠 타입을 선언해 이미지 같은 비텍스트 데이터도 메일로 보낼 수 있게 한다.",
    answer: true,
    explanation: "Content-Type: type/subtype 형식이며 이진 데이터는 base64 등으로 인코딩한다."
  },
  {
    category: "메일 접근",
    question: "POP3는 서버에 폴더를 두어 메시지를 정리하게 하며 세션 간 사용자 상태를 유지한다.",
    answer: false,
    explanation: "폴더와 세션 간 상태 유지는 IMAP의 특징이다. POP3는 세션 간 상태를 유지하지 않는다(stateless)."
  },
  {
    category: "DNS",
    question: "로컬 DNS 서버가 TLD 서버 정보를 캐시해 두므로 루트 서버는 자주 방문되지 않는다.",
    answer: true,
    explanation: "이름 서버는 한 번 알게 된 매핑을 캐시하고 TLD 서버 정보도 로컬 이름 서버에 주로 캐시된다."
  },
  {
    category: "DNS",
    question: "DNS 캐시 항목은 한 번 저장되면 호스트의 IP가 바뀌어도 삭제되지 않는다.",
    answer: false,
    explanation: "캐시 항목은 TTL이 지나면 삭제된다. 다만 TTL이 만료되기 전까지는 오래된 정보일 수 있다."
  },
  {
    category: "TCP 연결",
    question: "TCP의 SYN 세그먼트는 데이터를 실을 수 없지만 순서 번호를 1 소비한다.",
    answer: true,
    explanation: "SYN, SYN+ACK, 데이터가 없는 FIN은 순서 번호 1을 소비한다."
  },
  {
    category: "TCP 연결",
    question: "데이터를 싣지 않은 순수 ACK 세그먼트도 순서 번호를 1 소비한다.",
    answer: false,
    explanation: "데이터가 없는 ACK 세그먼트는 순서 번호를 소비하지 않는다."
  },
  {
    category: "TCP 재전송",
    question: "TCP 송신자는 같은 데이터에 대한 ACK를 3번 중복 수신하면 타임아웃을 기다리지 않고 재전송한다.",
    answer: true,
    explanation: "이것이 빠른 재전송(fast retransmit)이며 가장 작은 순서 번호의 미확인 세그먼트를 다시 보낸다."
  },
  {
    category: "혼잡 제어",
    question: "TCP Tahoe는 3개의 중복 ACK을 받으면 cwnd를 절반으로 줄이고 선형 증가를 시작한다.",
    answer: false,
    explanation: "Tahoe는 타임아웃이든 3개의 중복 ACK이든 항상 cwnd를 1로 줄인다. 절반으로 줄이는 것은 Reno의 방식이다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "OSI 모델",
    question: "OSI 7계층 중 데이터 형식 변환, 인코딩, 암호화, 압축을 담당하는 계층은 (        )이다.",
    answers: ["표현 계층", "표현계층", "표현", "6계층", "presentation layer", "presentation"],
    displayAnswer: "표현 계층(Presentation Layer)",
    hint: "6계층",
    explanation: "표현 계층은 데이터를 상대 시스템이 이해할 수 있는 형태로 가공한다."
  },
  {
    category: "MIME",
    question: "메일 헤더에 콘텐츠 타입을 선언해 멀티미디어 데이터를 보낼 수 있게 한 확장 규격은 (        )이다.",
    answers: ["mime", "multipurpose internet mail extension", "multipurpose internet mail extensions"],
    displayAnswer: "MIME",
    explanation: "MIME = Multipurpose Internet Mail Extension이다."
  },
  {
    category: "DNS",
    question: "DNS에서 접촉한 서버가 이름 해석의 부담을 모두 떠안아 대신 해석해 주는 방식을 (        ) 질의라 한다.",
    answers: ["재귀적", "재귀", "재귀 질의", "재귀적 질의", "recursive", "recursive query"],
    displayAnswer: "재귀적(Recursive)",
    explanation: "반복적 질의는 '이 서버에 물어보라'고 답하고, 재귀적 질의는 접촉한 서버가 직접 해석한다."
  },
  {
    category: "TCP 재전송",
    question: "수신자가 순서가 어긋난 세그먼트를 받았을 때 직전과 같은 번호로 다시 보내는 ACK를 (        ) ACK라 한다.",
    answers: ["중복", "중복 ack", "중복ack", "duplicate", "duplicate ack", "dup ack", "dupack"],
    displayAnswer: "중복(Duplicate) ACK",
    explanation: "중복 ACK 3개가 쌓이면 빠른 재전송이 일어난다."
  },
  {
    category: "TCP",
    question: "TCP 순서 번호의 초기값은 (        )를 이용해 정한다.",
    answers: ["난수", "랜덤", "무작위", "random", "random number", "난수 생성 함수", "랜덤 넘버", "임의의 수", "임의의 값", "임의의 번호"],
    displayAnswer: "난수(Random number)",
    explanation: "초기 순서 번호는 난수 생성 함수로 만들어지며 무조건 0 또는 1부터 시작하는 것이 아니다."
  },
  {
    category: "혼잡 제어",
    question: "RTT마다 cwnd를 1 MSS씩 늘리고 손실이 생기면 절반으로 줄이는 TCP 혼잡 제어 방식은 (        )이다.",
    answers: ["aimd", "additive increase multiplicative decrease", "additive increase, multiplicative decrease"],
    displayAnswer: "AIMD",
    explanation: "AIMD는 톱니 모양(sawtooth) 그래프로 대역폭을 탐색한다."
  },

  // ===== 3번 DNS 레코드 (3문제) =====
  {
    category: "DNS",
    question: "kit.ac.kr 대학의 메일 서버 이름은 mx1.kit.ac.kr이고 IP 주소는 211.45.67.89이다. 레코드는 (name, value, type) 형식으로 쓴다.\nkit.ac.kr 앞으로 온 메일을 받을 서버를 알려 주는 레코드는?",
    answers: ["kit.ac.kr, mx1.kit.ac.kr, mx", "(kit.ac.kr, mx1.kit.ac.kr, mx)", "kit.ac.kr,mx1.kit.ac.kr,mx", "(kit.ac.kr,mx1.kit.ac.kr,mx)", "kit.ac.kr mx1.kit.ac.kr mx", "(kit.ac.kr mx1.kit.ac.kr mx)"],
    displayAnswer: "(kit.ac.kr, mx1.kit.ac.kr, MX)",
    hint: "type은 MX",
    explanation: "MX 레코드는 name이 메일을 받을 도메인이고 value가 메일 서버의 이름이다."
  },
  {
    category: "DNS",
    question: "kit.ac.kr 대학의 메일 서버 이름은 mx1.kit.ac.kr이고 IP 주소는 211.45.67.89이다. 레코드는 (name, value, type) 형식으로 쓴다.\n메일 서버 이름 mx1.kit.ac.kr을 IP 주소로 매핑하는 레코드는?",
    answers: ["mx1.kit.ac.kr, 211.45.67.89, a", "(mx1.kit.ac.kr, 211.45.67.89, a)", "mx1.kit.ac.kr,211.45.67.89,a", "(mx1.kit.ac.kr,211.45.67.89,a)", "mx1.kit.ac.kr 211.45.67.89 a", "(mx1.kit.ac.kr 211.45.67.89 a)"],
    displayAnswer: "(mx1.kit.ac.kr, 211.45.67.89, A)",
    hint: "type은 A",
    explanation: "MX 레코드의 value로 쓰인 이름은 A 레코드를 통해 IP 주소가 된다."
  },
  {
    category: "DNS",
    question: "NS 레코드의 name에는 도메인과 호스트 이름 중 무엇이 들어가는가?",
    answers: ["도메인", "도메인 이름", "도메인이름", "도메인명", "domain", "domain name"],
    displayAnswer: "도메인(Domain)",
    explanation: "NS 레코드는 name이 도메인(예: foo.com)이고 value가 그 도메인의 권한 있는 이름 서버의 호스트 이름이다."
  },

  // ===== 4번 빠른 재전송과 GBN 번호 (4문제) =====
  {
    category: "빠른 재전송",
    question: "송신자가 100바이트 길이의 DATA1~DATA5를 연속 전송했고 DATA2가 전송 중 손실되었다(DATA1, DATA3, DATA4, DATA5만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다(ACK1~ACK4 순). 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 1101이다.\nTCP에서 ACK2, ACK3, ACK4의 확인응답 번호는 모두 같다. 그 값은? (숫자만 입력)",
    answers: ["1101", "1101.0", "1101.00", "1101번", "1101 번", "1101.0번", "1101.0 번", "1101.00번", "1101.00 번"],
    displayAnswer: "1101",
    hint: "다음에 받기를 기대하는 바이트 번호",
    explanation: "ACK1=1101이므로 DATA1은 1001~1100, DATA2는 1101~1200(손실), DATA3은 1201~1300, DATA4는 1301~1400, DATA5는 1401~1500이다. DATA2(1101~)가 빠져 있으므로 DATA3, DATA4, DATA5가 도착해도 수신자는 계속 다음 기대 바이트 1101을 ACK한다."
  },
  {
    category: "빠른 재전송",
    question: "송신자가 100바이트 길이의 DATA1~DATA5를 연속 전송했고 DATA2가 전송 중 손실되었다(DATA1, DATA3, DATA4, DATA5만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다(ACK1~ACK4 순). 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 1101이다.\nTCP 송신자가 타임아웃을 기다리지 않고 DATA2를 재전송하는 시점은 몇 번째 ACK(ACK1~ACK4 중)를 수신한 직후인가? (숫자만 입력)",
    answers: ["4", "4.0", "4.00", "4번째", "4 번째", "4.0번째", "4.0 번째", "4.00번째", "4.00 번째", "4번", "4 번", "4.0번", "4.0 번", "4.00번", "4.00 번", "ack4", "ack 4"],
    displayAnswer: "ACK4",
    hint: "중복 ACK가 3개가 되는 순간",
    explanation: "ACK1=1101이므로 DATA1은 1001~1100, DATA2는 1101~1200(손실), DATA3은 1201~1300, DATA4는 1301~1400, DATA5는 1401~1500이다. ACK1은 새로운 ACK이고 ACK2, ACK3, ACK4가 같은 번호의 중복 ACK 3개다. 세 번째 중복 ACK인 ACK4를 받는 순간 빠른 재전송이 시작된다."
  },
  {
    category: "빠른 재전송",
    question: "송신자가 100바이트 길이의 DATA1~DATA5를 연속 전송했고 DATA2가 전송 중 손실되었다(DATA1, DATA3, DATA4, DATA5만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다(ACK1~ACK4 순). 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 1101이다.\nTCP 빠른 재전송 때 송신자가 다시 보내는 세그먼트는 모두 몇 개인가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1개", "1 개", "1.0개", "1.0 개", "1.00개", "1.00 개"],
    displayAnswer: "1개",
    hint: "ACK되지 않은 가장 작은 순서 번호",
    explanation: "ACK1=1101이므로 DATA1은 1001~1100, DATA2는 1101~1200(손실), DATA3은 1201~1300, DATA4는 1301~1400, DATA5는 1401~1500이다. TCP는 확인되지 않은 세그먼트 중 가장 작은 순서 번호인 DATA2 하나만 재전송한다."
  },
  {
    category: "빠른 재전송",
    question: "송신자가 100바이트 길이의 DATA1~DATA5를 연속 전송했고 DATA2가 전송 중 손실되었다(DATA1, DATA3, DATA4, DATA5만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다(ACK1~ACK4 순). 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 1101이다.\n같은 상황을 GBN으로 전송했을 때 ACK4의 순서번호는? (숫자만 입력)",
    answers: ["1001", "1001.0", "1001.00", "1001번", "1001 번", "1001.0번", "1001.0 번", "1001.00번", "1001.00 번"],
    displayAnswer: "1001",
    hint: "순서대로 받은 마지막 데이터의 번호",
    explanation: "ACK1=1101이므로 DATA1은 1001~1100, DATA2는 1101~1200(손실), DATA3은 1201~1300, DATA4는 1301~1400, DATA5는 1401~1500이다. GBN 수신자는 DATA3~DATA5를 순서 어긋남으로 버리고 순서대로 받은 마지막 데이터 DATA1의 번호로 ACK를 다시 보낸다. 따라서 ACK4는 DATA1의 순서번호 1001이다."
  },

  // ===== 5번 SR ACK 도착 순서 (4문제) =====
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 손실은 없다. 수신자가 보낸 ACK0이 지연되어 송신자에게는 ACK1, ACK0 순서로 도착한다. 송신자는 윈도우가 이동하면 즉시 보낼 수 있는 새 패킷을 모두 전송한다.\n송신자가 ACK1을 수신한 직후의 SendBase 값은? (숫자만 입력)",
    answers: ["0", "0.0", "0.00"],
    displayAnswer: "0",
    hint: "pkt0은 아직 확인되지 않았다",
    explanation: "ACK1이 먼저 도착해도 pkt0이 미확인이라 윈도우는 이동하지 않는다. ACK0이 도착하면 미확인 중 가장 작은 번호가 pkt2가 되어 윈도우가 2~5로 이동하고 pkt4, pkt5를 전송한다. "
  },
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 손실은 없다. 수신자가 보낸 ACK0이 지연되어 송신자에게는 ACK1, ACK0 순서로 도착한다. 송신자는 윈도우가 이동하면 즉시 보낼 수 있는 새 패킷을 모두 전송한다.\n송신자가 ACK0까지 수신한 직후의 SendBase 값은? (숫자만 입력)",
    answers: ["2", "2.0", "2.00"],
    displayAnswer: "2",
    hint: "pkt0, pkt1이 모두 확인되었다",
    explanation: "ACK1이 먼저 도착해도 pkt0이 미확인이라 윈도우는 이동하지 않는다. ACK0이 도착하면 미확인 중 가장 작은 번호가 pkt2가 되어 윈도우가 2~5로 이동하고 pkt4, pkt5를 전송한다. "
  },
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 손실은 없다. 수신자가 보낸 ACK0이 지연되어 송신자에게는 ACK1, ACK0 순서로 도착한다. 송신자는 윈도우가 이동하면 즉시 보낼 수 있는 새 패킷을 모두 전송한다.\n송신자가 ACK0까지 수신한 직후의 WindowRange는? (예: 0~3 형식으로 입력)",
    answers: ["2~5", "2 ~ 5", "2-5", "2 - 5", "2–5", "2 – 5", "[2,5]", "[2, 5]", "2부터 5", "2부터 5까지", "2~5까지"],
    displayAnswer: "2~5",
    hint: "SendBase부터 N개",
    explanation: "ACK1이 먼저 도착해도 pkt0이 미확인이라 윈도우는 이동하지 않는다. ACK0이 도착하면 미확인 중 가장 작은 번호가 pkt2가 되어 윈도우가 2~5로 이동하고 pkt4, pkt5를 전송한다. "
  },
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 손실은 없다. 수신자가 보낸 ACK0이 지연되어 송신자에게는 ACK1, ACK0 순서로 도착한다. 송신자는 윈도우가 이동하면 즉시 보낼 수 있는 새 패킷을 모두 전송한다.\n송신자가 ACK0까지 수신하고 새 패킷을 전송한 직후의 NextSeqNum 값은? (숫자만 입력)",
    answers: ["6", "6.0", "6.00"],
    displayAnswer: "6",
    hint: "다음에 보낼 새 패킷의 번호",
    explanation: "ACK1이 먼저 도착해도 pkt0이 미확인이라 윈도우는 이동하지 않는다. ACK0이 도착하면 미확인 중 가장 작은 번호가 pkt2가 되어 윈도우가 2~5로 이동하고 pkt4, pkt5를 전송한다. pkt4, pkt5를 전송했으므로 다음에 보낼 새 패킷은 pkt6이다."
  },

  // ===== 6번 Karn 알고리즘과 타임아웃 (4문제) =====
  {
    category: "TCP 타이머",
    question: "TCP에서 측정한 SampleRTT가 첫 번째는 0.8초, 두 번째는 1.2초였다. 첫 샘플로 EstimatedRTT=SampleRTT, DevRTT=SampleRTT/2로 초기화하고(RFC 2988), 두 번째 샘플부터 α=0.125, β=0.25를 적용한다. 두 번째 샘플에서는 EstimatedRTT를 먼저 갱신한 뒤 갱신된 EstimatedRTT로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4×DevRTT이다. 이후 재전송된 세그먼트에 대한 ACK가 도착했고 그 측정값은 5.0초였다.\n두 번째 샘플 후의 EstimatedRTT는 몇 초인가? (숫자만 입력)",
    answers: ["0.85", "0.850", "0.8500", "0.85초", "0.85 초", "0.850초", "0.850 초", "0.8500초", "0.8500 초"],
    displayAnswer: "0.85초",
    hint: "(1-α)×기존값 + α×SampleRTT",
    explanation: "첫 샘플: EstimatedRTT=0.8, DevRTT=0.4\n둘째 샘플: EstimatedRTT=0.875×0.8+0.125×1.2=0.85, DevRTT=0.75×0.4+0.25×|1.2−0.85|=0.3875, Timeout=0.85+4×0.3875=2.4\n재전송된 세그먼트의 ACK는 원본에 대한 것인지 재전송에 대한 것인지 알 수 없어 RTT 측정에서 제외한다(Karn 알고리즘). 따라서 5.0초는 반영하지 않는다.\n"
  },
  {
    category: "TCP 타이머",
    question: "TCP에서 측정한 SampleRTT가 첫 번째는 0.8초, 두 번째는 1.2초였다. 첫 샘플로 EstimatedRTT=SampleRTT, DevRTT=SampleRTT/2로 초기화하고(RFC 2988), 두 번째 샘플부터 α=0.125, β=0.25를 적용한다. 두 번째 샘플에서는 EstimatedRTT를 먼저 갱신한 뒤 갱신된 EstimatedRTT로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4×DevRTT이다. 이후 재전송된 세그먼트에 대한 ACK가 도착했고 그 측정값은 5.0초였다.\n두 번째 샘플 후의 DevRTT는 몇 초인가? (숫자만 입력)",
    answers: ["0.3875", "0.38750", "0.387500", "0.3875초", "0.3875 초", "0.38750초", "0.38750 초", "0.387500초", "0.387500 초"],
    displayAnswer: "0.3875초",
    hint: "(1-β)×기존 DevRTT + β×|SampleRTT−EstimatedRTT|",
    explanation: "첫 샘플: EstimatedRTT=0.8, DevRTT=0.4\n둘째 샘플: EstimatedRTT=0.875×0.8+0.125×1.2=0.85, DevRTT=0.75×0.4+0.25×|1.2−0.85|=0.3875, Timeout=0.85+4×0.3875=2.4\n재전송된 세그먼트의 ACK는 원본에 대한 것인지 재전송에 대한 것인지 알 수 없어 RTT 측정에서 제외한다(Karn 알고리즘). 따라서 5.0초는 반영하지 않는다.\n"
  },
  {
    category: "TCP 타이머",
    question: "TCP에서 측정한 SampleRTT가 첫 번째는 0.8초, 두 번째는 1.2초였다. 첫 샘플로 EstimatedRTT=SampleRTT, DevRTT=SampleRTT/2로 초기화하고(RFC 2988), 두 번째 샘플부터 α=0.125, β=0.25를 적용한다. 두 번째 샘플에서는 EstimatedRTT를 먼저 갱신한 뒤 갱신된 EstimatedRTT로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4×DevRTT이다. 이후 재전송된 세그먼트에 대한 ACK가 도착했고 그 측정값은 5.0초였다.\n두 번째 샘플 후에 설정되는 TimeoutInterval은 몇 초인가? (숫자만 입력)",
    answers: ["2.4", "2.40", "2.400", "2.4초", "2.4 초", "2.40초", "2.40 초", "2.400초", "2.400 초"],
    displayAnswer: "2.4초",
    hint: "TimeoutInterval = EstimatedRTT + 4×DevRTT",
    explanation: "첫 샘플: EstimatedRTT=0.8, DevRTT=0.4\n둘째 샘플: EstimatedRTT=0.875×0.8+0.125×1.2=0.85, DevRTT=0.75×0.4+0.25×|1.2−0.85|=0.3875, Timeout=0.85+4×0.3875=2.4\n재전송된 세그먼트의 ACK는 원본에 대한 것인지 재전송에 대한 것인지 알 수 없어 RTT 측정에서 제외한다(Karn 알고리즘). 따라서 5.0초는 반영하지 않는다.\n"
  },
  {
    category: "TCP 타이머",
    question: "TCP에서 측정한 SampleRTT가 첫 번째는 0.8초, 두 번째는 1.2초였다. 첫 샘플로 EstimatedRTT=SampleRTT, DevRTT=SampleRTT/2로 초기화하고(RFC 2988), 두 번째 샘플부터 α=0.125, β=0.25를 적용한다. 두 번째 샘플에서는 EstimatedRTT를 먼저 갱신한 뒤 갱신된 EstimatedRTT로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4×DevRTT이다. 이후 재전송된 세그먼트에 대한 ACK가 도착했고 그 측정값은 5.0초였다.\n재전송된 세그먼트의 측정값(5.0초)까지 처리한 뒤의 TimeoutInterval은 몇 초인가? (숫자만 입력)",
    answers: ["2.4", "2.40", "2.400", "2.4초", "2.4 초", "2.40초", "2.40 초", "2.400초", "2.400 초"],
    displayAnswer: "2.4초",
    hint: "재전송된 세그먼트는 갱신에 쓰지 않는다",
    explanation: "첫 샘플: EstimatedRTT=0.8, DevRTT=0.4\n둘째 샘플: EstimatedRTT=0.875×0.8+0.125×1.2=0.85, DevRTT=0.75×0.4+0.25×|1.2−0.85|=0.3875, Timeout=0.85+4×0.3875=2.4\n재전송된 세그먼트의 ACK는 원본에 대한 것인지 재전송에 대한 것인지 알 수 없어 RTT 측정에서 제외한다(Karn 알고리즘). 따라서 5.0초는 반영하지 않는다.\n"
  },
];
