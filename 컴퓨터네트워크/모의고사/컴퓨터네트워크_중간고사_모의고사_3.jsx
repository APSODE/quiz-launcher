// 컴퓨터네트워크_중간고사_모의고사_3.jsx
// 2024, 2025 기출 형식(OX, 빈칸, DNS, 재전송, 윈도우)을 따른 모의고사 3회 — 2026-10-17 시험범위(지연 · TCP 3.5 이후 · 계산 문제 제외)에 맞게 수정
// 정답은 수업자료 기준으로 직접 풀이한 것이다.
const META = {
  group: "컴퓨터네트워크",
  title: "중간고사 모의고사 3회",
  topic: "OX · 빈칸 · DNS 해석 · rdt 기능 · SR · 체크섬 개념"
};

const QUESTIONS = [

  // ===== 1번 OX (10문제) =====
  {
    category: "네트워크 계층",
    question: "라우터는 전송 계층 헤더를 열어 보지 않고 네트워크 계층 헤더의 주소만으로 패킷을 전달한다.",
    answer: true,
    explanation: "라우터는 네트워크, 링크, 물리 계층까지만 처리한다. 캡슐화 그림에서도 라우터에는 전송 계층이 없다."
  },
  {
    category: "주소",
    question: "MAC 주소는 라우터를 거쳐도 변하지 않고 종단 간 그대로 유지된다.",
    answer: false,
    explanation: "MAC 주소는 로컬 네트워크에서만 유효해 라우터를 거칠 때마다 출발지는 현재 장치, 목적지는 다음 장치의 MAC 주소로 바뀐다. 종단 간 유지되는 것은 IP 주소다."
  },
  {
    category: "다중화/역다중화",
    question: "TCP 소켓은 4-튜플로 식별되므로 서버는 같은 포트로 여러 클라이언트와 동시에 연결할 수 있다.",
    answer: true,
    explanation: "웹 서버는 연결하는 클라이언트마다 4-튜플이 다른 별도 소켓을 가진다."
  },
  {
    category: "체크섬",
    question: "UDP 체크섬은 IP 헤더만을 대상으로 계산한다.",
    answer: false,
    explanation: "UDP/TCP 체크섬은 의사 헤더, UDP 또는 TCP 헤더, 응용 계층 데이터를 포함해 계산한다. IP 체크섬은 IP 헤더만 대상으로 한다."
  },
  {
    category: "체크섬",
    question: "1의 보수 합에서 최상위 비트에서 올림수가 생기면 그 올림수를 결과의 최하위 비트에 다시 더한다.",
    answer: true,
    explanation: "슬라이드의 예시처럼 올림수를 제거하고 다시 더해 주는 wraparound 방식이다."
  },
  {
    category: "rdt",
    question: "rdt2.0은 ACK/NAK 자체가 손상될 수 있어도 문제없이 동작한다.",
    answer: false,
    explanation: "ACK/NAK가 손상되면 송신자는 수신자의 상태를 알 수 없고 재전송하면 중복이 생길 수 있어 rdt2.0은 치명적 결함이 있다. 순서 번호로 이를 해결한다."
  },
  {
    category: "rdt",
    question: "rdt3.0은 패킷이나 ACK의 손실에 대비해 송신자가 카운트다운 타이머를 사용한다.",
    answer: true,
    explanation: "일정 시간 동안 ACK가 오지 않으면 재전송하며, 지연으로 중복이 생겨도 순서 번호로 처리한다."
  },
  {
    category: "파이프라이닝",
    question: "파이프라이닝에서는 연속 전송하는 패킷을 구별해야 하므로 순서 번호의 범위를 늘릴 필요가 없다.",
    answer: false,
    explanation: "파이프라이닝은 미확인 패킷이 여러 개 떠 있으므로 순서 번호의 범위를 늘려야 하고 송신자나 수신자에 버퍼링이 필요하다."
  },
  { category: "파이프라이닝", question: "파이프라이닝에서는 송신자나 수신자 쪽에서 버퍼링이 필요할 수 있다.",
    answer: true,
    explanation: "파이프라이닝: 순서 번호 범위 증가, 송·수신 버퍼링." },
  {
    category: "신뢰성",
    question: "네트워크 계층은 TCP처럼 재전송으로 신뢰성을 제공한다.",
    answer: false,
    explanation: "네트워크 계층은 신뢰성을 제공하지 않는다. 신뢰성은 전송 계층(TCP)과 링크 계층의 재전송으로 제공된다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 모델에서 OSI의 응용, 표현, 세션 계층을 합친 계층은 (        ) 계층이다.",
    answers: ["응용", "응용 계층", "응용계층", "application", "application layer"],
    displayAnswer: "응용 계층(Application Layer)",
    explanation: "효율성을 고려해 OSI의 7, 6, 5계층을 TCP/IP에서는 응용 계층 하나로 묶었다."
  },
  { category: "메일 접근", question: "SMTP는 메일 서버 사이의 전송에, POP3·IMAP은 사용자가 서버의 메일을 가져오는 메일 (        )에 쓰인다.",
    answers: ["접근", "access", "엑세스", "액세스", "열람"],
    displayAnswer: "접근",
    hint: "access",
    explanation: "mail access protocol: POP3, IMAP, HTTP(웹메일)." },
  {
    category: "체크섬",
    question: "UDP 체크섬은 세그먼트 내용을 16비트 정수로 보고 1의 (        ) 합을 구해 만든다.",
    answers: ["보수", "1의 보수", "보수합", "complement", "one's complement", "ones complement"],
    displayAnswer: "보수(Complement)",
    explanation: "1의 보수 합의 결과를 다시 보수 취한 값이 체크섬이다."
  },
  {
    category: "rdt",
    question: "rdt3.0에서 패킷이나 ACK의 손실에 대비해 송신자가 사용하는 것은 (        )이다.",
    answers: ["타이머", "timer", "카운트다운 타이머", "타임아웃", "재전송 타이머"],
    displayAnswer: "타이머(Timer)",
    explanation: "ACK가 일정 시간 오지 않으면 재전송하기 위해 카운트다운 타이머가 필요하다."
  },
  { category: "GBN", question: "GBN 송신자가 사용하는 타이머는 몇 개인가? (숫자만 입력)",
    answers: ["1", "1개", "하나"],
    displayAnswer: "1",
    hint: "SR은 패킷마다",
    explanation: "GBN = 가장 오래된 미확인 패킷에 대한 타이머 1개." },
  { category: "SR", question: "SR 송신자는 타임아웃이 나면 (        ) 패킷만 재전송한다.",
    answers: ["해당", "그", "만료된", "타임아웃된", "그 패킷", "해당 패킷"],
    displayAnswer: "해당",
    hint: "GBN과 다름",
    explanation: "SR은 타이머가 만료된 그 패킷만 재전송한다." },

  // ===== 3번 DNS 이름 해석 (3문제) =====
  {
    category: "DNS",
    question: "호스트 cis.poly.edu가 gaia.cs.umass.edu의 IP 주소를 알고 싶다. 로컬 DNS 서버는 dns.poly.edu이고 캐시에는 아무 정보도 없다. 로컬 DNS 서버가 루트 서버, TLD 서버, 권한 있는 DNS 서버 순서로 반복적 질의(iterated query)를 한다.\n로컬 DNS 서버가 질의를 보내는 DNS 서버(루트, TLD, 권한 있는 서버)는 모두 몇 개인가? (숫자만 입력)",
    answers: ["3", "3.0", "3.00", "3개", "3 개", "3.0개", "3.0 개", "3.00개", "3.00 개"],
    displayAnswer: "3개",
    hint: "루트, TLD, 권한 서버",
    explanation: "로컬 DNS 서버가 루트 서버, edu TLD 서버, dns.cs.umass.edu 권한 서버에 차례로 질의하므로 3개다."
  },
  {
    category: "DNS",
    question: "호스트 cis.poly.edu가 gaia.cs.umass.edu의 IP 주소를 알고 싶다. 로컬 DNS 서버는 dns.poly.edu이고 캐시에는 아무 정보도 없다. 로컬 DNS 서버가 루트 서버, TLD 서버, 권한 있는 DNS 서버 순서로 반복적 질의(iterated query)를 한다.\n호스트의 질의부터 호스트가 받는 최종 응답까지 오가는 DNS 메시지는 모두 몇 개인가? (숫자만 입력)",
    answers: ["8", "8.0", "8.00", "8개", "8 개", "8.0개", "8.0 개", "8.00개", "8.00 개"],
    displayAnswer: "8개",
    hint: "서버마다 질의와 응답이 한 쌍씩",
    explanation: "호스트→로컬(1), 로컬→루트(2), 루트→로컬(3), 로컬→TLD(4), TLD→로컬(5), 로컬→권한(6), 권한→로컬(7), 로컬→호스트(8)로 모두 8개다. 수업자료 슬라이드 43의 번호와 같다."
  },
  {
    category: "DNS",
    question: "호스트 cis.poly.edu가 gaia.cs.umass.edu의 IP 주소를 알고 싶다. 로컬 DNS 서버는 dns.poly.edu이고 캐시에는 아무 정보도 없다. 로컬 DNS 서버가 루트 서버, TLD 서버, 권한 있는 DNS 서버 순서로 반복적 질의(iterated query)를 한다.\n로컬 DNS 서버가 두 번째로 질의를 보내는 서버의 종류는?",
    answers: ["tld", "tld 서버", "tld dns 서버", "tld dns server", "tld 네임 서버", "tld 이름 서버", "top-level domain", "최상위 도메인 서버"],
    displayAnswer: "TLD 서버",
    hint: "루트 다음 단계",
    explanation: "첫 번째는 루트 서버(TLD 서버의 위치를 알려 줌), 두 번째는 edu를 담당하는 TLD 서버(umass.edu의 권한 서버를 알려 줌), 세 번째가 권한 서버다."
  },

  // ===== 4번 신뢰적 데이터 전송 기능 (4문제) =====
  {
    category: "rdt",
    question: "신뢰성 있는 데이터 전송(rdt) 프로토콜을 단계적으로 설계한다. 오류도 손실도 없는 채널(rdt1.0)에서, 비트 오류가 생기지만 ACK/NAK는 손상되지 않는 채널(rdt2.0)로 바뀔 때 추가로 필요한 기능은?",
    choices: ["오류 검출(체크섬)과 ACK/NAK 피드백", "순서 번호", "타이머", "추가로 필요한 기능이 없다"],
    answer: 0,
    explanation: "rdt2.0은 rdt1.0에 오류 검출과 수신자의 피드백 제어 메시지(ACK, NAK)를 추가하고, NAK를 받으면 송신자가 재전송한다."
  },
  {
    category: "rdt",
    question: "신뢰성 있는 데이터 전송(rdt) 프로토콜을 단계적으로 설계한다. ACK/NAK 자체가 손상될 수 있어 송신자가 현재 패킷을 재전송할 때 생기는 중복 패킷을 수신자가 구별하려면 추가로 필요한 기능은?",
    choices: ["타이머", "순서 번호", "NAK의 제거", "파이프라이닝"],
    answer: 1,
    explanation: "송신자는 각 패킷에 순서 번호를 붙이고, 수신자는 중복 패킷을 폐기한다. 정지-대기는 이때 필요한 방식이다."
  },
  {
    category: "rdt",
    question: "신뢰성 있는 데이터 전송(rdt) 프로토콜을 단계적으로 설계한다. 패킷과 ACK가 손실될 수도 있는 채널(rdt3.0)에서, 체크섬, 순서 번호, ACK, 재전송에 더해 추가로 필요한 기능은?",
    choices: ["체크섬", "NAK", "타이머", "수신 버퍼"],
    answer: 2,
    explanation: "송신자가 합리적인 시간 동안 기다려도 ACK가 없으면 재전송하려면 카운트다운 타이머가 필요하다."
  },
  {
    category: "rdt",
    question: "신뢰성 있는 데이터 전송(rdt) 프로토콜을 단계적으로 설계한다. NAK를 없애고 ACK만 쓰는 rdt2.2에서 NAK의 역할을 대신하기 위해 하는 일은?",
    choices: ["송신자 윈도우를 늘린다", "체크섬을 제거한다", "타이머를 두 개 사용한다", "ACK에 마지막으로 정상 수신한 패킷의 순서 번호를 포함한다"],
    answer: 3,
    explanation: "NAK 대신 마지막으로 정상 수신한 패킷의 ACK를 보내고 그 순서 번호를 명시한다. 송신자가 중복 ACK를 받으면 NAK를 받은 것과 같이 현재 패킷을 재전송한다."
  },

  // ===== 5번 SR 손실 (4문제) =====
  { category: "SR", question: "Window Size(N)=3인 SR 송신자가 pkt0~pkt4를 보내야 한다. 처음에 pkt0~pkt2를 보냈고 pkt1의 첫 전송만 손실되었다.\nACK0을 받은 뒤 송신자가 새로 보내는 패킷 번호는? (숫자만 입력)",
    answers: ["3", "pkt3"],
    displayAnswer: "pkt3",
    hint: "윈도우 1~3",
    explanation: "ACK0 → SendBase 1, 윈도우 1~3 → pkt3 전송. pkt1이 미확인이라 윈도우는 더 열리지 않는다." },
  { category: "SR", question: "위 상황(N=3, pkt1 손실)에서 pkt1이 재전송되기 전에 수신자가 버퍼에 저장하는 패킷 번호를 모두 쓰면?",
    answers: ["2, 3", "2,3", "2 3", "pkt2, pkt3", "pkt2,pkt3", "pkt2 pkt3"],
    displayAnswer: "pkt2, pkt3",
    hint: "pkt1 뒤에 온 것",
    explanation: "RecvBase = 1에서 pkt2, pkt3이 먼저 도착 → 버퍼 저장, ACK2·ACK3." },
  { category: "SR", question: "위 상황(N=3, pkt1 손실)에서 재전송된 pkt1이 도착하면 수신자가 한꺼번에 전달하는 패킷은 모두 몇 개인가? (숫자만 입력)",
    answers: ["3", "3개", "세 개"],
    displayAnswer: "3개 (pkt1, pkt2, pkt3)",
    hint: "버퍼에 있던 것까지",
    explanation: "pkt1과 버퍼의 pkt2, pkt3을 함께 전달 → RecvBase 4." },
  { category: "SR", question: "위 상황(N=3, pkt1 손실)에서 송신자가 ACK2, ACK3을 이미 받은 상태로 ACK1을 받으면 SendBase는 얼마가 되는가? (숫자만 입력)",
    answers: ["4"],
    displayAnswer: "4",
    hint: "확인된 것을 건너뜀",
    explanation: "ACK1로 pkt1이 확인되면 이미 확인된 pkt2·3을 건너뛰어 SendBase = 4(윈도우 4~6)가 되고 pkt4를 보낼 수 있다." },

  // ===== 6번 체크섬 개념 (4문제) =====
  { category: "체크섬", question: "체크섬을 만들 때 n비트 구간들을 더하는 덧셈 방식은?",
    answers: ["1의 보수 합", "1의보수합", "1의 보수합", "1의 보수 덧셈", "ones complement sum", "one's complement sum"],
    displayAnswer: "1의 보수 합",
    hint: "carry를 다시 더함",
    explanation: "구간들을 1의 보수 합으로 더한 뒤 보수를 취하면 체크섬." },
  { category: "체크섬", question: "1의 보수 합에서 최상위 비트를 넘친 carry는 어떻게 처리하는가? (세 글자)",
    answers: ["더한다", "더함", "다시 더한다", "더하기", "add"],
    displayAnswer: "더한다",
    hint: "버리지 않음",
    explanation: "carry는 버리지 않고 결과의 최하위 비트에 다시 더한다." },
  { category: "체크섬", question: "수신자가 모든 구간과 체크섬을 1의 보수로 더한 결과에 0인 비트가 있으면 무엇을 검출한 것인가?",
    answers: ["오류", "에러", "error", "비트 오류", "오류 검출"],
    displayAnswer: "오류",
    hint: "모두 1이어야 정상",
    explanation: "오류가 없으면 결과는 모든 비트가 1이다. 0이 있으면 오류를 검출한 것이다(단, 검출이 완벽하지는 않다)." },
  { category: "체크섬", question: "IP 체크섬의 계산 대상은 IP 패킷의 어느 부분인가?",
    answers: ["헤더", "ip 헤더", "ip헤더", "header", "ip header"],
    displayAnswer: "IP 헤더",
    hint: "데이터 제외",
    explanation: "IP = 헤더만, UDP/TCP = pseudoheader + 헤더 + 데이터." },
];
