// 컴퓨터네트워크_중간고사_모의고사_2.jsx
// 2024, 2025 기출 형식(OX, 빈칸, DNS, 재전송, 윈도우)을 따른 모의고사 2회 — 2026-10-17 시험범위(지연 · TCP 3.5 이후 · 계산 문제 제외)에 맞게 수정
// 정답은 수업자료 기준으로 직접 풀이한 것이다.
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 2회",
  topic: "OX · 빈칸 · DNS 별칭 · 재전송 · GBN · DNS 캐시"
};

const QUESTIONS = [

  // ===== 1번 OX (10문제) =====
  {
    category: "응용 구조",
    question: "P2P 구조의 피어는 연결이 간헐적이고 IP 주소가 바뀔 수 있어 관리가 복잡하다.",
    answer: true,
    explanation: "P2P는 항상 켜진 서버가 없고 피어가 간헐적으로 연결되며 IP 주소가 바뀌므로 complex management가 단점이다."
  },
  {
    category: "전송 서비스",
    question: "TCP는 지연 시간 보장과 최소 처리량 보장을 제공한다.",
    answer: false,
    explanation: "TCP는 신뢰성, 흐름 제어, 혼잡 제어를 제공하지만 타이밍, 최소 처리량 보장, 보안은 제공하지 않는다."
  },
  { category: "회선 교환", question: "회선 교환은 FDM 또는 TDM으로 링크를 나누어 사용자에게 전용으로 배정한다.",
    answer: true,
    explanation: "FDM = 주파수 분할, TDM = 시간 분할. 회선 교환은 자원을 공유하지 않는다." },
  {
    category: "SMTP",
    question: "SMTP는 8비트 이진 데이터를 변환 없이 본문에 그대로 실어 보낼 수 있다.",
    answer: false,
    explanation: "SMTP는 헤더와 본문이 7비트 ASCII여야 한다. 이미지 같은 이진 데이터는 MIME와 base64 인코딩으로 변환해 보낸다."
  },
  {
    category: "메일 접근",
    question: "IMAP은 서버에 폴더를 두어 메시지를 정리할 수 있게 하며 세션 간 상태를 유지한다.",
    answer: true,
    explanation: "IMAP은 모든 메시지를 서버 한 곳에 보관하고 폴더 이름과 메시지 ID의 매핑 같은 사용자 상태를 유지한다."
  },
  {
    category: "SR",
    question: "SR 송신자는 ACK를 받지 못한 모든 패킷에 대해 하나의 타이머만 사용한다.",
    answer: false,
    explanation: "SR은 ACK를 받지 못한 패킷마다 타이머를 둔다(N개). 타이머 1개를 쓰는 것은 정지-대기와 GBN이다."
  },
  { category: "UDP", question: "UDP 세그먼트는 손실되거나 순서가 바뀐 채 응용 계층에 전달될 수 있다.",
    answer: true,
    explanation: "UDP는 best effort 서비스다." },
  { category: "GBN", question: "GBN 송신자는 중복 ACK를 받으면 타이머를 기다리지 않고 즉시 재전송한다.",
    answer: false,
    explanation: "GBN 송신자는 중복 ACK를 무시하고, 타이머가 만료되면 재전송한다." },
  { category: "rdt", question: "rdt3.0은 패킷 손실에 대비해 송신자가 카운트다운 타이머를 사용한다.",
    answer: true,
    explanation: "rdt3.0 = 손실 대비 타이머." },
  { category: "SR", question: "SR 수신자는 순서가 어긋나 도착한 패킷을 폐기한다.",
    answer: false,
    explanation: "SR 수신자는 수신 윈도우 안의 패킷을 버퍼에 저장한다. 폐기하는 것은 GBN 수신자다." },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "OSI 모델",
    question: "OSI 7계층 중 비트를 전기, 광, 무선 신호로 바꿔 전송하는 계층은 (        )이다.",
    answers: ["물리 계층", "물리계층", "물리", "1계층", "physical layer", "physical"],
    displayAnswer: "물리 계층(Physical Layer)",
    hint: "1계층",
    explanation: "물리 계층은 장치 간 비트 단위 전송과 신호 변환을 담당하는 1계층이다."
  },
  { category: "프로토콜 계층", question: "인터넷 프로토콜 스택에서 프로세스 간 데이터 전송을 맡는 계층은 (        ) 계층이다.",
    answers: ["전송", "전송 계층", "전송계층", "transport", "transport layer"],
    displayAnswer: "전송",
    hint: "TCP, UDP",
    explanation: "transport = 프로세스 간(TCP, UDP)." },
  {
    category: "메일 접근",
    question: "수신 측 클라이언트가 서버에서 메일을 가져올 때 쓰는 프로토콜로는 POP3와 (        )가 있다.",
    answers: ["imap", "internet mail access protocol"],
    displayAnswer: "IMAP",
    explanation: "SMTP는 전송용이고 메일 접근 프로토콜로는 POP3, IMAP, HTTP(웹메일)가 있다."
  },
  {
    category: "DNS",
    question: "DNS 이름 서버가 매핑을 캐시했다가 일정 시간이 지나면 삭제할 때 기준이 되는 값은 (        )이다.",
    answers: ["ttl", "time to live", "time-to-live"],
    displayAnswer: "TTL(Time To Live)",
    explanation: "캐시 항목은 TTL이 지나면 사라지므로 호스트의 IP가 바뀌어도 TTL이 만료되어야 인터넷 전체에 반영된다."
  },
  {
    category: "다중화/역다중화",
    question: "TCP 소켓은 출발지 IP, 출발지 포트, 목적지 IP, 목적지 포트의 (        )으로 식별된다.",
    answers: ["4-튜플", "4튜플", "4 튜플", "4-tuple", "4 tuple", "4tuple", "네 개의 값", "4개의 값"],
    displayAnswer: "4-튜플(4-tuple)",
    explanation: "수신자는 4개 값을 모두 사용해 세그먼트를 알맞은 소켓으로 보낸다. UDP는 목적지 포트만 사용한다."
  },
  {
    category: "SR",
    question: "SR 수신자는 순서가 어긋나 도착한 패킷을 (        )에 저장해 두었다가 순서가 맞으면 상위 계층에 전달한다.",
    answers: ["버퍼", "수신 버퍼", "buffer", "버퍼링", "receive buffer"],
    displayAnswer: "버퍼(Buffer)",
    explanation: "SR은 수신 버퍼가 있고 GBN은 없다."
  },

  // ===== 3번 DNS 레코드 (3문제) =====
  {
    category: "DNS",
    question: "shop.com 회사의 웹 서버의 실제(정규) 이름은 web1.shop.com이고 IP 주소는 198.51.100.7이다. 사용자는 별칭 www.shop.com으로 접속한다. 레코드는 (name, value, type) 형식으로 쓴다.\n별칭 www.shop.com을 정규 이름에 연결하는 레코드는?",
    answers: ["www.shop.com, web1.shop.com, cname", "(www.shop.com, web1.shop.com, cname)", "www.shop.com,web1.shop.com,cname", "(www.shop.com,web1.shop.com,cname)", "www.shop.com web1.shop.com cname", "(www.shop.com web1.shop.com cname)"],
    displayAnswer: "(www.shop.com, web1.shop.com, CNAME)",
    hint: "type은 CNAME",
    explanation: "CNAME 레코드는 name이 별칭이고 value가 정규 이름이다. 수업자료의 www.ibm.com과 servereast.backup2.ibm.com 예시와 같다."
  },
  {
    category: "DNS",
    question: "shop.com 회사의 웹 서버의 실제(정규) 이름은 web1.shop.com이고 IP 주소는 198.51.100.7이다. 사용자는 별칭 www.shop.com으로 접속한다. 레코드는 (name, value, type) 형식으로 쓴다.\n정규 이름 web1.shop.com의 IP 주소를 알려 주는 레코드는?",
    answers: ["web1.shop.com, 198.51.100.7, a", "(web1.shop.com, 198.51.100.7, a)", "web1.shop.com,198.51.100.7,a", "(web1.shop.com,198.51.100.7,a)", "web1.shop.com 198.51.100.7 a", "(web1.shop.com 198.51.100.7 a)"],
    displayAnswer: "(web1.shop.com, 198.51.100.7, A)",
    hint: "type은 A",
    explanation: "A 레코드는 name이 호스트 이름이고 value가 IP 주소다. CNAME으로 얻은 정규 이름은 이 A 레코드로 IP가 된다."
  },
  {
    category: "DNS",
    question: "CNAME 레코드에서 name에 들어가는 이름은 별칭(alias)과 정규(canonical) 이름 중 무엇인가?",
    answers: ["별칭", "별칭 이름", "별칭이름", "별명", "alias", "alias name"],
    displayAnswer: "별칭(Alias)",
    explanation: "CNAME의 name은 별칭, value는 정규 이름이다."
  },

  // ===== 4번 GBN 타임아웃 재전송 (4문제) =====
  { category: "GBN", question: "Window Size(N)=4인 GBN 송신자가 pkt0~pkt5를 보내야 한다. 처음에 pkt0~pkt3을 보냈고 pkt3의 첫 전송만 손실되었다. ACK가 올 때마다 윈도우가 열리는 만큼 새 패킷을 보낸다.\nACK0, ACK1, ACK2를 받는 동안 새로 보내는 패킷 번호를 모두 쓰면? (예: 6, 7)",
    answers: ["4, 5", "4,5", "4 5", "pkt4, pkt5", "pkt4,pkt5", "pkt4 pkt5"],
    displayAnswer: "pkt4, pkt5",
    hint: "보낼 패킷은 pkt5까지",
    explanation: "ACK0 → 윈도우 1~4 → pkt4, ACK1 → 2~5 → pkt5, ACK2 → 3~6(보낼 패킷 없음)." },
  { category: "GBN", question: "위 상황(N=4, pkt3 손실)에서 수신자가 pkt4, pkt5를 받았을 때 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["2", "ack2", "ack 2"],
    displayAnswer: "2 (ACK2)",
    hint: "순서대로 받은 마지막",
    explanation: "기다리는 번호는 3이므로 pkt4, pkt5는 폐기하고 ACK2를 다시 보낸다." },
  { category: "GBN", question: "위 상황(N=4, pkt3 손실)에서 pkt3의 타이머가 만료되었을 때 재전송되는 패킷 번호를 모두 쓰면?",
    answers: ["3, 4, 5", "3,4,5", "3 4 5", "pkt3, pkt4, pkt5", "pkt3,pkt4,pkt5", "pkt3 pkt4 pkt5", "3~5", "3-5"],
    displayAnswer: "pkt3, pkt4, pkt5",
    hint: "이후 보낸 것 전부",
    explanation: "타임아웃 직전 SendBase 3, NextSeqNum 6 → pkt3~pkt5 전부 재전송." },
  { category: "GBN", question: "위 상황(N=4, pkt3 손실)에서 타임아웃 직전의 SendBase 값은? (숫자만 입력)",
    answers: ["3"],
    displayAnswer: "3",
    hint: "가장 오래된 미확인",
    explanation: "ACK2까지 확인 → SendBase 3. 이후 ACK2는 중복이라 무시." },

  // ===== 5번 SR 상태값 (4문제) =====
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 pkt1이 손실되었다(pkt0, pkt2, pkt3은 도착). 수신자는 도착한 패킷마다 개별 ACK를 보내고 송신자는 ACK0, ACK2, ACK3을 차례로 수신한다. 송신자는 ACK0을 받자마자 pkt4를 전송했다(pkt4는 아직 수신자에 도착하지 않았다). 수신 윈도우 크기도 4다.\n송신자가 ACK3을 수신한 직후의 SendBase 값은? (숫자만 입력)",
    answers: ["1", "1.0", "1.00"],
    displayAnswer: "1",
    hint: "ACK를 받지 못한 가장 작은 번호",
    explanation: "ACK0으로 pkt0이 확인되어 윈도우가 이동하고 pkt4가 전송된다. pkt1은 여전히 미확인이라 윈도우는 더 이동하지 못하고, ACK2, ACK3은 해당 패킷만 수신 표시한다. 가장 오래된 미확인 패킷이 pkt1이므로 SendBase=1이다."
  },
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 pkt1이 손실되었다(pkt0, pkt2, pkt3은 도착). 수신자는 도착한 패킷마다 개별 ACK를 보내고 송신자는 ACK0, ACK2, ACK3을 차례로 수신한다. 송신자는 ACK0을 받자마자 pkt4를 전송했다(pkt4는 아직 수신자에 도착하지 않았다). 수신 윈도우 크기도 4다.\n송신자가 ACK3을 수신한 직후의 NextSeqNum 값은? (숫자만 입력)",
    answers: ["5", "5.0", "5.00"],
    displayAnswer: "5",
    hint: "다음에 보낼 새 패킷의 번호",
    explanation: "ACK0으로 pkt0이 확인되어 윈도우가 이동하고 pkt4가 전송된다. pkt1은 여전히 미확인이라 윈도우는 더 이동하지 못하고, ACK2, ACK3은 해당 패킷만 수신 표시한다. pkt0~pkt4까지 전송했으므로 다음에 보낼 새 패킷은 pkt5다. 윈도우(1~4) 안의 pkt4까지 이미 보냈기 때문에 더 보내지 못한다."
  },
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 pkt1이 손실되었다(pkt0, pkt2, pkt3은 도착). 수신자는 도착한 패킷마다 개별 ACK를 보내고 송신자는 ACK0, ACK2, ACK3을 차례로 수신한다. 송신자는 ACK0을 받자마자 pkt4를 전송했다(pkt4는 아직 수신자에 도착하지 않았다). 수신 윈도우 크기도 4다.\n송신자가 ACK3을 수신한 직후의 WindowRange는? (예: 0~3 형식으로 입력)",
    answers: ["1~4", "1 ~ 4", "1-4", "1 - 4", "1–4", "1 – 4", "[1,4]", "[1, 4]", "1부터 4", "1부터 4까지", "1~4까지"],
    displayAnswer: "1~4",
    hint: "SendBase부터 N개",
    explanation: "ACK0으로 pkt0이 확인되어 윈도우가 이동하고 pkt4가 전송된다. pkt1은 여전히 미확인이라 윈도우는 더 이동하지 못하고, ACK2, ACK3은 해당 패킷만 수신 표시한다. SendBase=1, N=4이므로 WindowRange는 1~4다. 이 중 2, 3은 이미 ACK를 받은 상태다."
  },
  {
    category: "SR",
    question: "Window Size(N)=4인 SR에서 송신자가 pkt0~pkt3을 연속 전송했고 pkt1이 손실되었다(pkt0, pkt2, pkt3은 도착). 수신자는 도착한 패킷마다 개별 ACK를 보내고 송신자는 ACK0, ACK2, ACK3을 차례로 수신한다. 송신자는 ACK0을 받자마자 pkt4를 전송했다(pkt4는 아직 수신자에 도착하지 않았다). 수신 윈도우 크기도 4다.\n수신자가 pkt3을 수신한 직후의 RcvBase 값은? (숫자만 입력)",
    answers: ["1", "1.0", "1.00"],
    displayAnswer: "1",
    hint: "아직 받지 못한 가장 작은 번호",
    explanation: "수신자는 pkt0을 상위 계층에 전달하고 윈도우를 이동했지만, pkt1이 아직 오지 않았으므로 아직 받지 못한 가장 작은 번호인 RcvBase=1에서 멈춘다. pkt2, pkt3은 버퍼에 저장된다."
  },

  // ===== 6번 DNS 캐시와 질의 (5문제) =====
  { category: "DNS", question: "Local DNS 캐시에 .com TLD 서버 정보만 있다(TTL 남음). iterated query로 www.amazon.com을 조회할 때 Local DNS가 처음 질의하는 서버는?",
    choices: ["Root DNS 서버", "TLD(.com) DNS 서버", "amazon.com의 권한 있는 DNS 서버", "요청 호스트"],
    answer: 1,
    explanation: "TLD 서버 정보가 캐시되어 있으면 Root를 건너뛰고 TLD에 바로 묻는다. 그래서 Root는 자주 방문되지 않는다." },
  { category: "DNS", question: "위 상황(.com TLD 정보만 캐시, iterated)에서 호스트 → Local DNS 질의부터 Local DNS → 호스트 응답까지 DNS 메시지는 모두 몇 개인가? (숫자만 입력)",
    answers: ["6", "6개"],
    displayAnswer: "6개",
    hint: "Root 2개가 빠짐",
    explanation: "1 host→local, 2 local→TLD, 3 TLD→local, 4 local→권한, 5 권한→local, 6 local→host. Root 질의·응답 2개가 빠진다." },
  { category: "DNS", question: "Local DNS 캐시에 www.amazon.com의 IP 주소가 남아 있을 때(TTL 남음) 일어나는 일은?",
    choices: ["Root부터 다시 차례로 묻는다", "TLD 서버에만 묻는다", "Local DNS가 캐시에서 바로 응답한다", "권한 있는 서버에만 묻는다"],
    answer: 2,
    explanation: "캐시에 답(A)이 있으면 Local DNS가 바로 응답한다. 다만 캐시 정보는 오래된 것일 수 있다(best effort)." },
  { category: "DNS", question: "recursive query의 단점으로 슬라이드에서 지적한 것은?",
    choices: ["호스트가 직접 모든 서버에 물어야 한다", "상위 계층(Root, TLD) 서버의 부하가 커질 수 있다", "캐시를 사용할 수 없다", "TLD 서버가 필요 없다"],
    answer: 1,
    explanation: "recursive query는 이름 해석 부담을 접촉한 서버에 넘기므로 상위 계층 부하가 클 수 있다." },
  { category: "DNS", question: "DNS 캐시 엔트리가 만료되기까지의 시간을 나타내는 RR 필드의 약어는?",
    answers: ["ttl", "time to live"],
    displayAnswer: "TTL",
    hint: "Time To ...",
    explanation: "RR = (name, value, type, ttl). TTL이 지나면 캐시 엔트리가 사라진다." },
];
