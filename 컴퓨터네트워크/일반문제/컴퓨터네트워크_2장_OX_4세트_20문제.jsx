// 컴퓨터네트워크_2장_OX_4세트_20문제.jsx
// 근거: 수업자료 Chapter 2 Application Layer (응용 원리, SMTP/POP3/IMAP, DNS)
const META = {
  group: "컴퓨터네트워크",
  unit: "2장",
  title: "2장 응용 계층 OX 4세트 20문제"
};

const OX_QUESTIONS = [
  {
    category: "DNS 서비스",
    question: "DNS는 호스트 이름의 IP 주소 변환 외에 호스트 별칭, 메일 서버 별칭, 부하 분산 서비스도 제공한다.",
    answer: true,
    explanation: "DNS services: hostname to IP translation, host aliasing, mail server aliasing, load distribution."
  },
  {
    category: "DNS 서비스",
    question: "복제된 웹 서버들의 여러 IP 주소를 하나의 이름에 대응시켜 부하를 분산할 수 있다.",
    answer: true,
    explanation: "replicated Web servers: many IP addresses correspond to one name."
  },
  {
    category: "DNS",
    question: "DNS는 핵심 인터넷 기능이지만 응용 계층 프로토콜로 구현되어 복잡성이 네트워크 가장자리에 있다.",
    answer: true,
    explanation: "hosts와 name servers가 응용 계층에서 통신하며 이름을 해석한다."
  },
  {
    category: "DNS 해석",
    question: "클라이언트가 www.amazon.com의 IP를 구할 때 계층 구조상 루트 서버, .com TLD 서버, amazon.com 권한 서버 순으로 질의하게 된다.",
    answer: true,
    explanation: "각 단계에서 다음에 접촉할 서버의 정보를 얻는다."
  },
  {
    category: "DNS 해석",
    question: "루트 이름 서버는 로컬 이름 서버가 이름을 해석하지 못할 때 접촉되는 서버이다.",
    answer: true,
    explanation: "루트 서버는 이름 매핑을 모르면 권한 있는 이름 서버에 접촉해 매핑을 얻고 로컬 이름 서버로 돌려준다."
  },
  {
    category: "로컬 DNS",
    question: "각 ISP(주거용 ISP, 회사, 대학)는 로컬 DNS 서버를 하나씩 가지며 호스트의 DNS 질의는 먼저 로컬 DNS 서버로 전달된다.",
    answer: true,
    explanation: "로컬 DNS 서버는 default name server라고도 한다."
  },
  {
    category: "로컬 DNS",
    question: "로컬 DNS 서버는 최근의 이름-주소 쌍을 캐시하고, 질의를 DNS 계층 구조로 전달하는 프록시 역할을 한다.",
    answer: true,
    explanation: "캐시된 값은 오래되었을 수 있다."
  },
  {
    category: "DNS 질의",
    question: "반복적 질의에서는 접촉한 서버가 '이 이름은 모르니 이 서버에 물어보라'며 다음 서버를 알려 준다.",
    answer: true,
    explanation: "iterated query: contacted server replies with name of server to contact."
  },
  {
    category: "DNS 질의",
    question: "재귀적 질의에서는 상위 계층(루트 등)의 이름 서버에 부하가 몰릴 수 있다.",
    answer: true,
    explanation: "recursive query puts burden of name resolution on contacted name server."
  },
  {
    category: "DNS 레코드",
    question: "NS 레코드의 name은 도메인이고 value는 그 도메인의 권한 있는 이름 서버의 호스트 이름이다.",
    answer: true,
    explanation: "예: (foo.com, dns.foo.com, NS)"
  },
  {
    category: "DNS 레코드",
    question: "CNAME 레코드에서 name은 정규(canonical) 이름이고 value는 별칭이다.",
    answer: false,
    explanation: "name이 별칭(alias)이고 value가 정규 이름이다."
  },
  {
    category: "DNS 등록",
    question: "도메인을 등록할 때 등록 기관은 권한 서버의 IP 주소를 담는 A 레코드는 만들지 않고 NS 레코드만 TLD 서버에 넣는다.",
    answer: false,
    explanation: "등록 기관은 TLD 서버에 NS 레코드와 그 권한 서버 이름에 대한 A 레코드 두 개를 넣는다."
  },
  {
    category: "DNS 캐시",
    question: "호스트의 IP 주소가 바뀌면 인터넷의 모든 DNS 캐시가 즉시 갱신된다.",
    answer: false,
    explanation: "모든 TTL이 만료될 때까지 인터넷 전체에 알려지지 않을 수 있다."
  },
  {
    category: "DNS",
    question: "DNS는 IP 주소와 이름의 매핑을 위해 전송 계층 프로토콜로 구현된다.",
    answer: false,
    explanation: "DNS는 응용 계층 프로토콜이다."
  },
  {
    category: "DNS 질의",
    question: "재귀적 질의에서는 접촉한 서버가 다음에 물어볼 서버의 이름만 알려 주고 질의는 호스트가 계속 진행한다.",
    answer: false,
    explanation: "그것은 반복적 질의다. 재귀적 질의는 접촉한 서버가 해석을 모두 대신 수행한다."
  },
  {
    category: "POP3",
    question: "POP3의 download-and-delete 모드에서는 클라이언트를 바꿔도 이전 메일을 다시 읽을 수 있다.",
    answer: false,
    explanation: "삭제되므로 클라이언트를 바꾸면 다시 읽을 수 없다."
  },
  {
    category: "IMAP",
    question: "IMAP은 모든 메시지를 사용자의 로컬 PC에만 보관한다.",
    answer: false,
    explanation: "IMAP은 모든 메시지를 서버 한 곳에 보관하고 폴더로 정리할 수 있다."
  },
  {
    category: "메일 접근",
    question: "SMTP는 수신자가 자기 메일 서버에서 메일을 내려받는 데 쓰는 프로토콜이다.",
    answer: false,
    explanation: "SMTP는 수신자 서버로의 전달과 저장에 쓰고, 내려받는 것은 POP, IMAP, HTTP 같은 메일 접근 프로토콜이다."
  },
  {
    category: "MIME",
    question: "Content-Transfer-Encoding 헤더는 데이터의 미디어 종류를 선언한다.",
    answer: false,
    explanation: "미디어 종류는 Content-Type이 선언하고 Content-Transfer-Encoding은 데이터를 인코딩한 방식을 알려 준다."
  },
  {
    category: "SMTP",
    question: "SMTP 서버는 연결 종료를 통해 메시지의 끝을 판단한다.",
    answer: false,
    explanation: "SMTP 서버는 CRLF.CRLF(점만 있는 줄)로 메시지의 끝을 판단한다."
  },
];
