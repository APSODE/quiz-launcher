// 컴퓨터네트워크_중간고사_모의고사_5.jsx
// 2024, 2025 기출 형식(OX, 빈칸, DNS, 재전송, 윈도우)을 따른 모의고사 5회 — 2026-10-17 시험범위(지연 · TCP 3.5 이후 · 계산 문제 제외)에 맞게 수정
// 정답은 수업자료 기준으로 직접 풀이한 것이다.
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 5회",
  topic: "OX · 빈칸 · DNS 일반 · 정지-대기 · SR · DNS 재귀 질의"
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
  { category: "다중화/역다중화", question: "UDP에서는 출발지 포트가 달라도 목적지 IP·포트가 같으면 같은 소켓으로 전달된다.",
    answer: true,
    explanation: "UDP 역다중화 = 목적지 IP·포트." },
  { category: "rdt", question: "rdt2.0은 ACK/NAK가 손상되어도 문제없이 동작한다.",
    answer: false,
    explanation: "ACK/NAK가 손상되면 송신자는 수신자 상태를 모른다(rdt2.0의 결함) → rdt2.1에서 순서 번호 추가." },
  { category: "GBN", question: "GBN의 ACK는 패킷마다 따로 확인하는 개별 ACK이다.",
    answer: false,
    explanation: "GBN = 누적 ACK, SR = 개별 ACK." },

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
  { category: "rdt", question: "rdt3.0에서 패킷이나 ACK의 손실에 대비해 송신자가 사용하는 것은 (        )이다.",
    answers: ["타이머", "카운트다운 타이머", "카운트다운타이머", "timer", "countdown timer"],
    displayAnswer: "타이머",
    hint: "시간",
    explanation: "rdt3.0 = 손실 대비 카운트다운 타이머." },
  { category: "SR", question: "SR 수신자는 순서가 어긋나 도착한 패킷을 (        )에 저장한다.",
    answers: ["버퍼", "수신 버퍼", "수신버퍼", "buffer"],
    displayAnswer: "버퍼",
    hint: "GBN에는 없음",
    explanation: "SR은 수신 버퍼가 있다." },

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

  // ===== 5번 SR 손실 (4문제) =====
  { category: "SR", question: "Window Size(N)=4인 SR 송신자가 pkt0~pkt5를 보내야 한다. 처음에 pkt0~pkt3을 보냈고 pkt2의 첫 전송만 손실되었다.\nACK0, ACK1을 받은 뒤 송신자가 새로 보내는 패킷 번호를 모두 쓰면? (예: 6, 7)",
    answers: ["4, 5", "4,5", "4 5", "pkt4, pkt5", "pkt4,pkt5", "pkt4 pkt5"],
    displayAnswer: "pkt4, pkt5",
    hint: "윈도우가 열리는 만큼",
    explanation: "ACK0 → 윈도우 1~4 → pkt4, ACK1 → 2~5 → pkt5." },
  { category: "SR", question: "위 상황(N=4, pkt2 손실)에서 수신자가 버퍼에 저장하는 패킷 번호를 모두 쓰면?",
    answers: ["3, 4, 5", "3,4,5", "3 4 5", "pkt3, pkt4, pkt5", "pkt3,pkt4,pkt5", "pkt3 pkt4 pkt5", "3~5", "3-5"],
    displayAnswer: "pkt3, pkt4, pkt5",
    hint: "pkt2 뒤에 온 것",
    explanation: "RecvBase = 2에서 pkt3~5가 먼저 도착 → 버퍼 저장, ACK3·4·5." },
  { category: "SR", question: "위 상황(N=4, pkt2 손실)에서 타이머 만료로 재전송되는 패킷은 모두 몇 개인가? (숫자만 입력)",
    answers: ["1", "1개", "하나"],
    displayAnswer: "1개 (pkt2)",
    hint: "해당 패킷만",
    explanation: "SR은 pkt2만 재전송한다." },
  { category: "SR", question: "위 상황(N=4, pkt2 손실)에서 재전송된 pkt2가 도착하면 수신자가 상위 계층에 한꺼번에 전달하는 패킷은 모두 몇 개인가? (숫자만 입력)",
    answers: ["4", "4개", "네 개"],
    displayAnswer: "4개",
    hint: "버퍼에 있던 것까지",
    explanation: "pkt2 + 버퍼의 pkt3, pkt4, pkt5 → 4개, RecvBase 6." },

  // ===== 6번 DNS 재귀 질의 (4문제) =====
  { category: "DNS", question: "호스트 cis.poly.edu가 gaia.cs.umass.edu의 IP 주소를 알고 싶다. Local DNS 서버(dns.poly.edu)의 캐시는 비어 있다. 호스트 → Local DNS 질의를 1번으로 하여 메시지마다 번호를 붙인다.\nrecursive query일 때, 호스트가 답을 받을 때까지 오가는 DNS 메시지는 모두 몇 개인가? (숫자만 입력)",
    answers: ["8", "8개"],
    displayAnswer: "8개",
    hint: "질의 + 응답",
    explanation: "1 host→local, 2 local→root, 3 root→TLD, 4 TLD→권한, 5 권한→TLD, 6 TLD→root, 7 root→local, 8 local→host." },
  { category: "DNS", question: "호스트 cis.poly.edu가 gaia.cs.umass.edu의 IP 주소를 알고 싶다. Local DNS 서버(dns.poly.edu)의 캐시는 비어 있다. 호스트 → Local DNS 질의를 1번으로 하여 메시지마다 번호를 붙인다.\nrecursive query에서 3번 메시지를 보내는 서버는?",
    answers: ["root", "root dns", "root dns 서버", "루트", "루트 서버", "루트 dns 서버", "root 서버"],
    displayAnswer: "Root DNS 서버",
    hint: "Local DNS가 아님",
    explanation: "recursive: 2 local→Root, 3 Root→TLD(Root가 대신 질의)." },
  { category: "DNS", question: "호스트 cis.poly.edu가 gaia.cs.umass.edu의 IP 주소를 알고 싶다. Local DNS 서버(dns.poly.edu)의 캐시는 비어 있다. 호스트 → Local DNS 질의를 1번으로 하여 메시지마다 번호를 붙인다.\nrecursive query에서 Local DNS 서버에 최종 답(7번 메시지)을 보내는 서버는?",
    answers: ["root", "root dns", "root dns 서버", "루트", "루트 서버", "루트 dns 서버", "root 서버"],
    displayAnswer: "Root DNS 서버",
    hint: "Local이 질의한 서버",
    explanation: "답은 권한 → TLD → Root → Local 순으로 거꾸로 돌아온다. Local DNS는 자신이 질의한 Root에게서 답을 받는다." },
  { category: "DNS", question: "iterated와 recursive 중 상위 계층(Root, TLD) 서버의 부하가 더 커질 수 있는 질의 방식은? (영어)",
    answers: ["recursive", "recursive query", "재귀", "재귀적", "재귀적 질의"],
    displayAnswer: "recursive",
    hint: "부담을 넘김",
    explanation: "recursive query는 해석 부담을 접촉한 서버에 넘기므로 상위 계층 부하가 크다." },
];
