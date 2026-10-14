// 컴퓨터네트워크_중간고사_모의고사_2.jsx
// 2024, 2025 기출 형식(OX, 빈칸, DNS, 재전송, 윈도우, Reno)을 따른 모의고사 2회
// 정답은 수업자료 기준으로 직접 풀이한 것이다.
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 2회",
  topic: "OX · 빈칸 · DNS 별칭 · 타임아웃 재전송 · SR · TCP Reno"
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
  {
    category: "패킷 지연",
    question: "처리 지연은 비트 오류를 검사하고 출력 링크를 결정하는 데 걸리는 시간이다.",
    answer: true,
    explanation: "d_proc는 nodal processing으로 보통 1ms 미만이다."
  },
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
  {
    category: "TCP",
    question: "TCP는 점대점(point-to-point) 통신이며 메시지 경계가 없는 바이트 스트림을 제공한다.",
    answer: true,
    explanation: "TCP는 송신자 1명과 수신자 1명 사이의 연결이고 신뢰성 있고 순서가 보장되는 바이트 스트림이며 메시지 경계가 없다."
  },
  {
    category: "흐름 제어",
    question: "TCP 흐름 제어는 네트워크의 혼잡을 막기 위해 송신 속도를 줄이는 기능이다.",
    answer: false,
    explanation: "흐름 제어는 수신자의 버퍼가 넘치지 않게 하는 기능이고 네트워크 혼잡에 대응하는 것은 혼잡 제어다."
  },
  {
    category: "혼잡 제어",
    question: "TCP 슬로 스타트에서는 RTT마다 cwnd가 약 2배씩 증가한다.",
    answer: true,
    explanation: "초기 cwnd=1 MSS에서 ACK를 받을 때마다 1 MSS씩 늘리므로 RTT마다 두 배가 된다."
  },
  {
    category: "혼잡 제어",
    question: "TCP Reno는 타임아웃이 발생하면 cwnd를 절반으로만 줄이고 선형 증가를 계속한다.",
    answer: false,
    explanation: "타임아웃이면 ssthresh=cwnd/2이고 cwnd는 1 MSS로 떨어져 슬로 스타트부터 다시 시작한다. 절반으로 줄이는 것은 3개의 중복 ACK일 때다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "OSI 모델",
    question: "OSI 7계층 중 비트를 전기, 광, 무선 신호로 바꿔 전송하는 계층은 (        )이다.",
    answers: ["물리 계층", "물리계층", "물리", "1계층", "physical layer", "physical"],
    displayAnswer: "물리 계층(Physical Layer)",
    hint: "1계층",
    explanation: "물리 계층은 장치 간 비트 단위 전송과 신호 변환을 담당하는 1계층이다."
  },
  {
    category: "패킷 지연",
    question: "패킷 길이 L을 링크 대역폭 R로 나눈 지연은 (        ) 지연이다.",
    answers: ["전송", "전송 지연", "전송지연", "transmission", "transmission delay", "d_trans", "dtrans"],
    displayAnswer: "전송 지연(Transmission delay)",
    explanation: "d_trans = L/R이다. 링크 길이를 전파 속도로 나눈 값은 전파 지연이다."
  },
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

  // ===== 4번 타임아웃 후 재전송 (4문제) =====
  {
    category: "재전송",
    question: "송신자가 100바이트 길이의 DATA1~DATA4를 연속 전송했고 DATA2가 전송 중 손실되었다(DATA1, DATA3, DATA4만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다. DATA2의 타이머가 만료될 때까지 새로 전송하는 데이터는 없다. 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 801이다.\nDATA2의 타이머가 만료되었을 때 GBN 송신자가 재전송하는 데이터는 모두 몇 개인가? (숫자만 입력)",
    answers: ["3", "3.0", "3.00", "3개", "3 개", "3.0개", "3.0 개", "3.00개", "3.00 개"],
    displayAnswer: "3개",
    hint: "타이머가 설정된 데이터 및 이후 전송된 모든 데이터",
    explanation: "ACK1=801이므로 DATA1은 701~800, DATA2는 801~900(손실), DATA3은 901~1000, DATA4는 1001~1100이다. GBN은 타이머가 설정된 데이터와 그 이후에 전송한 모든 데이터를 재전송하므로 DATA2, DATA3, DATA4 3개다."
  },
  {
    category: "재전송",
    question: "송신자가 100바이트 길이의 DATA1~DATA4를 연속 전송했고 DATA2가 전송 중 손실되었다(DATA1, DATA3, DATA4만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다. DATA2의 타이머가 만료될 때까지 새로 전송하는 데이터는 없다. 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 801이다.\nDATA2의 타이머가 만료되었을 때 SR 송신자가 재전송하는 데이터는 모두 몇 개인가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1개", "1 개", "1.0개", "1.0 개", "1.00개", "1.00 개"],
    displayAnswer: "1개",
    hint: "ACK를 받지 못한 데이터만",
    explanation: "ACK1=801이므로 DATA1은 701~800, DATA2는 801~900(손실), DATA3은 901~1000, DATA4는 1001~1100이다. SR은 ACK를 받지 못한 데이터만 재전송한다. DATA3, DATA4는 개별 ACK로 이미 확인되었으므로 DATA2 1개다."
  },
  {
    category: "재전송",
    question: "송신자가 100바이트 길이의 DATA1~DATA4를 연속 전송했고 DATA2가 전송 중 손실되었다(DATA1, DATA3, DATA4만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다. DATA2의 타이머가 만료될 때까지 새로 전송하는 데이터는 없다. 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 801이다.\nTCP 송신자가 타임아웃 후 재전송하는 세그먼트의 순서번호는? (숫자만 입력)",
    answers: ["801", "801.0", "801.00", "801번", "801 번", "801.0번", "801.0 번", "801.00번", "801.00 번"],
    displayAnswer: "801",
    hint: "ACK되지 않은 가장 작은 순서번호",
    explanation: "ACK1=801이므로 DATA1은 701~800, DATA2는 801~900(손실), DATA3은 901~1000, DATA4는 1001~1100이다. TCP는 타임아웃 시 아직 확인되지 않은 세그먼트 중 가장 작은 순서번호의 세그먼트 하나만 재전송한다. 즉 DATA2(801)다."
  },
  {
    category: "재전송",
    question: "송신자가 100바이트 길이의 DATA1~DATA4를 연속 전송했고 DATA2가 전송 중 손실되었다(DATA1, DATA3, DATA4만 도착). 수신자는 도착한 데이터마다 ACK를 즉시 보낸다. DATA2의 타이머가 만료될 때까지 새로 전송하는 데이터는 없다. 모든 순서번호는 바이트 번호이고, DATA1에 대한 TCP ACK1의 확인응답 번호는 801이다.\nTCP 송신자가 DATA3, DATA4에 대해 받는 중복 ACK(ACK1과 같은 번호의 ACK)는 모두 몇 개인가? (숫자만 입력)",
    answers: ["2", "2.0", "2.00", "2개", "2 개", "2.0개", "2.0 개", "2.00개", "2.00 개"],
    displayAnswer: "2개",
    hint: "빠른 재전송은 3개가 필요하다",
    explanation: "ACK1=801이므로 DATA1은 701~800, DATA2는 801~900(손실), DATA3은 901~1000, DATA4는 1001~1100이다. DATA3, DATA4 도착 때 각각 확인응답 번호 801인 ACK가 한 번씩 오므로 중복 ACK는 2개다. 3개가 되어야 빠른 재전송이 일어나므로 이 경우는 타임아웃을 기다린다."
  },

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

  // ===== 6번 TCP Reno (5문제) =====
  {
    category: "TCP Reno",
    question: "TCP Reno의 CWND(MSS 단위)가 RTT에 따라 다음과 같이 변했다(초기 임계치는 16).\nRTT 0~4: 1, 2, 4, 8, 16\nRTT 5~8: 17, 18, 19, 20\nRTT 9~11: 13, 14, 15\nRTT 12~18: 10, 11, 12, 13, 14, 15, 16\nRTT 19~24: 1, 2, 4, 8, 9, 10\nRTT 9에서 CWND 변화를 초래한 이벤트는?",
    choices: ["타임아웃(Timeout)", "3개의 중복 ACK(Triple duplicate ACK)", "Fast Recovery 중 중복 ACK 수신", "Fast Recovery 중 새로운 ACK 수신", "cwnd가 ssthresh에 도달해 혼잡 회피 진입"],
    answer: 1,
    explanation: "CWND가 20에서 13으로 줄었다. 20/2+3=13이므로 중복 ACK 3개를 받아 ssthresh=cwnd/2=10, cwnd=ssthresh+3=13이 되고 Fast Recovery로 들어간 것이다."
  },
  {
    category: "TCP Reno",
    question: "TCP Reno의 CWND(MSS 단위)가 RTT에 따라 다음과 같이 변했다(초기 임계치는 16).\nRTT 0~4: 1, 2, 4, 8, 16\nRTT 5~8: 17, 18, 19, 20\nRTT 9~11: 13, 14, 15\nRTT 12~18: 10, 11, 12, 13, 14, 15, 16\nRTT 19~24: 1, 2, 4, 8, 9, 10\nRTT 9의 이벤트 직후 임계치(ssthresh)는? (숫자만 입력)",
    answers: ["10", "10.0", "10.00", "10MSS", "10 MSS", "10.0MSS", "10.0 MSS", "10.00MSS", "10.00 MSS", "10개", "10 개", "10.0개", "10.0 개", "10.00개", "10.00 개"],
    displayAnswer: "10",
    hint: "손실 직전 cwnd의 절반",
    explanation: "손실 직전 cwnd가 20이므로 ssthresh=20/2=10이다."
  },
  {
    category: "TCP Reno",
    question: "TCP Reno의 CWND(MSS 단위)가 RTT에 따라 다음과 같이 변했다(초기 임계치는 16).\nRTT 0~4: 1, 2, 4, 8, 16\nRTT 5~8: 17, 18, 19, 20\nRTT 9~11: 13, 14, 15\nRTT 12~18: 10, 11, 12, 13, 14, 15, 16\nRTT 19~24: 1, 2, 4, 8, 9, 10\nRTT 12에서 CWND 변화를 초래한 이벤트는?",
    choices: ["Fast Recovery 중 중복 ACK 수신", "타임아웃(Timeout)", "3개의 중복 ACK(Triple duplicate ACK)", "cwnd가 ssthresh에 도달해 혼잡 회피 진입", "Fast Recovery 중 새로운 ACK 수신"],
    answer: 4,
    explanation: "CWND가 15에서 10으로 내려가고 이후 1씩 선형 증가한다. Fast Recovery 중 새로운 ACK를 받으면 cwnd=ssthresh(10)가 되어 혼잡 회피로 돌아간다. RTT 10, 11의 14, 15는 Fast Recovery 중 중복 ACK마다 1 MSS씩 늘어난 값이다."
  },
  {
    category: "TCP Reno",
    question: "TCP Reno의 CWND(MSS 단위)가 RTT에 따라 다음과 같이 변했다(초기 임계치는 16).\nRTT 0~4: 1, 2, 4, 8, 16\nRTT 5~8: 17, 18, 19, 20\nRTT 9~11: 13, 14, 15\nRTT 12~18: 10, 11, 12, 13, 14, 15, 16\nRTT 19~24: 1, 2, 4, 8, 9, 10\nRTT 19에서 CWND 변화를 초래한 이벤트는?",
    choices: ["3개의 중복 ACK(Triple duplicate ACK)", "Fast Recovery 중 새로운 ACK 수신", "타임아웃(Timeout)", "Fast Recovery 중 중복 ACK 수신", "cwnd가 ssthresh에 도달해 혼잡 회피 진입"],
    answer: 2,
    explanation: "CWND가 16에서 1 MSS로 떨어지고 다시 슬로 스타트(1, 2, 4, 8)로 시작했으므로 타임아웃이다."
  },
  {
    category: "TCP Reno",
    question: "TCP Reno의 CWND(MSS 단위)가 RTT에 따라 다음과 같이 변했다(초기 임계치는 16).\nRTT 0~4: 1, 2, 4, 8, 16\nRTT 5~8: 17, 18, 19, 20\nRTT 9~11: 13, 14, 15\nRTT 12~18: 10, 11, 12, 13, 14, 15, 16\nRTT 19~24: 1, 2, 4, 8, 9, 10\nRTT 19의 이벤트 직후 임계치(ssthresh)는? (숫자만 입력)",
    answers: ["8", "8.0", "8.00", "8MSS", "8 MSS", "8.0MSS", "8.0 MSS", "8.00MSS", "8.00 MSS", "8개", "8 개", "8.0개", "8.0 개", "8.00개", "8.00 개"],
    displayAnswer: "8",
    hint: "손실 직전 cwnd의 절반",
    explanation: "손실 직전 cwnd가 16이므로 ssthresh=16/2=8이다. 이후 1, 2, 4, 8로 지수 증가하다 8을 넘으면 9, 10으로 선형 증가하는 그래프와도 맞는다."
  },
];
