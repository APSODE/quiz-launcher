// 컴퓨터네트워크_2장_단답형_4세트_15문제.jsx
// 근거: 수업자료 Chapter 2 Application Layer (응용 원리, SMTP/POP3/IMAP, DNS)
const META = {
  group: "컴퓨터네트워크",
  unit: "2장",
  title: "2장 응용 계층 단답형 4세트 15문제"
};

const SA_QUESTIONS = [
  {
    category: "DNS 레코드",
    question: "www.ibm.com처럼 실제(정규) 이름 대신 사용되는 이름을 무엇이라 하는가?",
    answers: ["별칭", "alias", "alias name", "별칭 이름", "별명", "별칭(alias)"],
    displayAnswer: "별칭(Alias)",
    explanation: "CNAME 레코드가 별칭을 정규 이름에 매핑한다."
  },
  {
    category: "DNS 레코드",
    question: "CNAME 레코드의 value에는 무엇이 들어가는가?",
    answers: ["정규 이름", "canonical name", "정규이름", "canonical", "실제 이름", "진짜 이름", "정규(canonical) 이름"],
    displayAnswer: "정규(canonical) 이름",
    explanation: "name은 별칭, value는 정규 이름이다."
  },
  {
    category: "DNS 레코드",
    question: "A 레코드의 value에는 무엇이 들어가는가?",
    answers: ["ip 주소", "ip", "ip주소", "아이피 주소", "호스트의 ip 주소", "호스트 ip 주소", "ip 어드레스"],
    displayAnswer: "IP 주소",
    explanation: "A 레코드의 name은 호스트 이름이다."
  },
  {
    category: "DNS 레코드",
    question: "MX 레코드의 value에는 무엇이 들어가는가?",
    answers: ["메일 서버 이름", "메일서버 이름", "메일 서버의 이름", "메일 서버", "메일서버", "mail server", "메일 서버 호스트 이름", "메일 서버의 호스트 이름", "메일서버의 이름"],
    displayAnswer: "메일 서버의 이름",
    explanation: "이름과 연결된 메일 서버의 이름이다."
  },
  {
    category: "DNS 등록",
    question: "새 도메인을 등록할 때 도메인 이름과 권한 서버 정보를 등록하는 기관을 무엇이라 하는가?",
    answers: ["등록 기관", "등록기관", "dns 등록 기관", "registrar", "dns registrar", "dns 등록기관", "도메인 등록 기관", "도메인 등록기관"],
    displayAnswer: "DNS 등록 기관(Registrar)",
    explanation: "등록 기관이 TLD 서버에 NS 레코드와 A 레코드를 넣어 준다."
  },
  {
    category: "DNS 등록",
    question: "등록 기관이 .com TLD 서버에 넣는 (networkutopia.com, dns1.networkutopia.com, ?)에서 ?에 들어가는 레코드 타입은?",
    answers: ["ns", "ns 레코드", "ns record"],
    displayAnswer: "NS",
    explanation: "NS 레코드는 도메인에 대한 권한 있는 이름 서버를 가리킨다."
  },
  {
    category: "DNS 등록",
    question: "등록 기관이 함께 넣는 (dns1.networkutopia.com, 212.212.212.1, ?)에서 ?에 들어가는 레코드 타입은?",
    answers: ["a", "a 레코드", "a record"],
    displayAnswer: "A",
    explanation: "권한 서버 이름의 IP 주소를 알려 주는 A 레코드다."
  },
  {
    category: "DNS 해석",
    question: "계층적 DNS에서 www.amazon.com의 IP를 구할 때 계층 구조상 가장 먼저 질의하는 서버는?",
    answers: ["루트 dns 서버", "루트 서버", "루트 이름 서버", "루트", "root dns server", "root server", "root", "root name server", "루트dns서버", "루트dns 서버", "루트 네임 서버"],
    displayAnswer: "루트 DNS 서버",
    explanation: "루트 → .com TLD → amazon.com 권한 서버 순이다."
  },
  {
    category: "DNS 해석",
    question: "그 다음 질의하는, com 도메인을 담당하는 서버를 무엇이라 하는가?",
    answers: ["tld dns 서버", "tld 서버", "tld", "tld 이름 서버", "최상위 도메인 서버", "최상위 도메인 dns 서버", "com dns 서버", "com 서버", "tld dns", "top-level domain 서버", "top level domain 서버", "tld 네임 서버"],
    displayAnswer: "TLD(최상위 도메인) DNS 서버",
    explanation: "TLD 서버는 com, org, edu와 국가 도메인을 담당한다."
  },
  {
    category: "DNS 해석",
    question: "마지막으로 질의해 호스트의 IP 주소를 알려 주는, 조직이 운영하는 서버를 무엇이라 하는가?",
    answers: ["권한 있는 dns 서버", "권한 있는 이름 서버", "권한있는 dns 서버", "권한 서버", "권한있는 이름 서버", "권한 있는 네임 서버", "authoritative dns server", "authoritative server", "authoritative name server", "authoritative", "권한 있는 서버"],
    displayAnswer: "권한 있는(Authoritative) DNS 서버",
    explanation: "조직의 호스트 이름과 IP의 공식 매핑을 제공한다."
  },
  {
    category: "로컬 DNS",
    question: "로컬 DNS 서버가 최근 질의한 이름-주소 쌍을 임시로 저장해 두는 곳은?",
    answers: ["캐시", "cache", "로컬 캐시", "dns 캐시"],
    displayAnswer: "캐시(Cache)",
    explanation: "캐시 항목은 TTL이 지나면 사라진다."
  },
  {
    category: "DNS 해석",
    question: "루트 이름 서버가 이름 매핑을 모를 때 접촉하는 서버는?",
    answers: ["권한 있는 dns 서버", "권한 있는 이름 서버", "권한있는 dns 서버", "권한 서버", "권한있는 이름 서버", "권한 있는 네임 서버", "authoritative dns server", "authoritative server", "authoritative name server", "authoritative", "권한 있는 서버"],
    displayAnswer: "권한 있는 이름 서버",
    explanation: "매핑을 얻어 로컬 이름 서버에 돌려준다."
  },
  {
    category: "DNS 질의",
    question: "접촉한 이름 서버가 이름 해석의 부담을 모두 떠맡는 질의 방식은?",
    answers: ["재귀적 질의", "재귀 질의", "재귀적질의", "recursive query", "recursive", "재귀적", "재귀"],
    displayAnswer: "재귀적 질의",
    explanation: "상위 서버에 부하가 몰릴 수 있는 방식이다."
  },
  {
    category: "DNS 캐시",
    question: "캐시된 DNS 항목이 오래되어 실제와 다를 수 있으므로 DNS의 이름-주소 변환은 어떤 방식의 서비스인가? (영문 두 단어)",
    answers: ["best effort", "best-effort", "베스트 에포트", "최선형", "최선 노력", "베스트에포트", "최선 서비스"],
    displayAnswer: "best effort",
    explanation: "name-to-address translation is best effort."
  },
  {
    category: "DNS",
    question: "DNS는 OSI 7계층 중 어느 계층에 속하는 프로토콜로 구현되는가?",
    answers: ["응용", "응용 계층", "응용계층", "application", "application layer", "7계층"],
    displayAnswer: "응용 계층",
    explanation: "DNS는 핵심 인터넷 기능이지만 응용 계층 프로토콜이다."
  },
];
