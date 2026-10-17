// 컴퓨터네트워크_2장_OX_2세트_20문제.jsx
// 근거: 수업자료 Chapter 2 Application Layer (응용 원리, SMTP/POP3/IMAP, DNS)
const META = {
  group: "컴퓨터네트워크",
  unit: "2장",
  title: "2장 응용 계층 OX 2세트 20문제"
};

const OX_QUESTIONS = [
  {
    category: "응용 구조",
    question: "클라이언트-서버 구조에서 클라이언트들은 서로 직접 통신하지 않는다.",
    answer: true,
    explanation: "클라이언트는 서버와 통신하며 서로 직접 통신하지 않는다."
  },
  {
    category: "응용 구조",
    question: "클라이언트-서버 구조의 서버는 일반적으로 동적으로 변하는 IP 주소를 가진다.",
    answer: false,
    explanation: "서버는 항상 켜져 있고 영구적인 IP 주소를 가진다. 동적 IP 주소를 가질 수 있는 쪽은 클라이언트다."
  },
  {
    category: "응용 구조",
    question: "P2P 구조는 피어들이 간헐적으로 연결되고 IP 주소가 바뀌므로 관리가 단순하다.",
    answer: false,
    explanation: "피어가 간헐적으로 연결되고 IP 주소가 바뀌어 관리가 복잡하다."
  },
  {
    category: "전송 서비스 요구",
    question: "오디오 같은 일부 응용은 어느 정도의 데이터 손실을 허용할 수 있다.",
    answer: true,
    explanation: "파일 전송, 웹 문서, 이메일은 손실이 없어야 하지만 실시간 오디오와 비디오는 손실 허용(loss-tolerant)이다."
  },
  {
    category: "전송 서비스 요구",
    question: "탄력적(elastic) 응용은 최소 처리율이 보장되어야만 동작한다.",
    answer: false,
    explanation: "탄력적 응용은 얻을 수 있는 처리율을 그대로 활용한다. 최소 처리율이 필요한 것은 멀티미디어 등이다."
  },
  {
    category: "전송 프로토콜",
    question: "TCP는 타이밍, 최소 처리율, 보안을 보장하지 않는다.",
    answer: true,
    explanation: "TCP가 제공하지 않는 것은 timing, minimum throughput guarantee, security다."
  },
  {
    category: "전송 프로토콜",
    question: "원격 단말 접속(Telnet)은 UDP를 사용한다.",
    answer: false,
    explanation: "SMTP, Telnet, HTTP, FTP는 모두 TCP를 사용한다."
  },
  {
    category: "전송 프로토콜",
    question: "스트리밍 멀티미디어는 TCP와 UDP 중 어느 쪽도 사용할 수 있다.",
    answer: true,
    explanation: "스트리밍 멀티미디어는 HTTP(TCP)나 RTP 등을 통해 TCP 또는 UDP를 사용한다."
  },
  {
    category: "이메일",
    question: "이메일 시스템의 세 가지 주요 구성 요소는 사용자 에이전트, 메일 서버, SMTP이다.",
    answer: true,
    explanation: "user agents, mail servers, simple mail transfer protocol이다."
  },
  {
    category: "SMTP",
    question: "SMTP 서버는 CRLF.CRLF(점만 있는 줄)로 메시지의 끝을 판단한다.",
    answer: true,
    explanation: "DATA 이후 마침표만 있는 줄이 메시지 끝을 나타낸다."
  },
  {
    category: "SMTP",
    question: "SMTP는 영속 연결(persistent connection)을 사용한다.",
    answer: true,
    explanation: "SMTP final words: SMTP uses persistent connections."
  },
  {
    category: "메일 형식",
    question: "RFC 822 메시지 형식에서 헤더와 본문 사이에는 빈 줄이 있다.",
    answer: true,
    explanation: "헤더 줄(To, From, Subject)과 본문 사이에 blank line이 들어간다."
  },
  {
    category: "메일 형식",
    question: "MIME의 Content-Type 헤더는 type/subtype 형식으로 쓴다.",
    answer: true,
    explanation: "예: image/jpeg, text/plain처럼 type/subtype; parameters 형식이다."
  },
  { category: "POP3", question: "POP3는 사용자가 메일 서버에서 메시지를 가져올 때 쓰는 메일 접근 프로토콜이며, 메일 서버 사이의 전송에는 쓰이지 않는다.",
    answer: true,
    explanation: "메일 서버 사이 전송 = SMTP, 서버에서 메일을 가져오기 = POP3·IMAP·HTTP(웹메일)." },
  {
    category: "POP3",
    question: "POP3의 download-and-keep 모드에서는 서로 다른 클라이언트에 메시지 사본이 남지 않는다.",
    answer: false,
    explanation: "download-and-keep에서는 서로 다른 클라이언트에 메시지의 사본이 남는다. download-and-delete에서는 클라이언트를 바꾸면 다시 읽을 수 없다."
  },
  {
    category: "DNS",
    question: "DNS는 호스트 이름을 IP 주소로 바꾸는 서비스만 제공한다.",
    answer: false,
    explanation: "호스트 별칭, 메일 서버 별칭, 부하 분산도 DNS 서비스다."
  },
  {
    category: "DNS",
    question: "DNS 캐시 항목은 TTL이 지나도 계속 유지된다.",
    answer: false,
    explanation: "캐시 항목은 TTL이 지나면 사라진다."
  },
  {
    category: "DNS",
    question: "TLD 서버는 각 조직의 호스트 이름과 IP 주소의 공식 매핑을 직접 제공한다.",
    answer: false,
    explanation: "공식 매핑을 제공하는 것은 조직의 권한 있는 DNS 서버다. TLD 서버는 com, org, 국가 도메인 등을 담당한다."
  },
  {
    category: "DNS",
    question: "루트 이름 서버는 이름 매핑을 모르면 권한 있는 이름 서버에 접촉해 매핑을 얻은 뒤 로컬 이름 서버에 돌려준다.",
    answer: true,
    explanation: "root name server는 contacts authoritative name server if name mapping not known하고 mapping을 로컬 이름 서버로 반환한다."
  },
  {
    category: "DNS 레코드",
    question: "MX 레코드의 value는 메일 서버의 IP 주소이다.",
    answer: false,
    explanation: "MX 레코드의 value는 해당 이름과 연결된 메일 서버의 이름이다."
  },
];
