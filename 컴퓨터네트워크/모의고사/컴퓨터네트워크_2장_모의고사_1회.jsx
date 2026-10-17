// 근거: 수업자료 Chapter 2 Application Layer (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "2장",
  title: "2장 모의고사 1회",
  topic: "OX + 빈칸 + Base64 개념 · DNS 레코드 · 메일"
};

const QUESTIONS = [

  // ===== 1번 OX (20문제) =====
  {
    category: "응용 구조",
    question: "클라이언트-서버 구조에서 서버는 항상 켜져 있으며 고정된 IP 주소를 갖는다.",
    answer: true,
    explanation: "서버는 always-on 호스트이고 영구적인 IP 주소를 가진다."
  },
  {
    category: "응용 구조",
    question: "클라이언트-서버 구조에서 클라이언트끼리 서로 직접 통신한다.",
    answer: false,
    explanation: "클라이언트는 서버와 통신하며 서로 직접 통신하지 않는다."
  },
  {
    category: "응용 구조",
    question: "P2P 구조는 새로운 피어가 서비스 수요와 함께 서비스 용량도 가져오므로 자기 확장성이 있다.",
    answer: true,
    explanation: "self scalability: 새 피어가 새 수요와 새 서비스 용량을 함께 가져온다."
  },
  {
    category: "프로세스 주소",
    question: "호스트의 IP 주소만으로 그 호스트에서 실행 중인 특정 프로세스를 식별할 수 있다.",
    answer: false,
    explanation: "한 호스트에서 여러 프로세스가 실행될 수 있으므로 IP 주소와 포트 번호가 함께 필요하다."
  },
  {
    category: "전송 서비스",
    question: "파일 전송이나 웹 문서 같은 응용은 100% 신뢰적인 데이터 전송을 요구한다.",
    answer: true,
    explanation: "데이터 무결성이 필요한 응용의 예이다."
  },
  {
    category: "전송 서비스",
    question: "오디오와 같은 응용은 약간의 데이터 손실을 허용할 수 있다.",
    answer: true,
    explanation: "손실 허용(loss-tolerant) 응용이다."
  },
  {
    category: "TCP와 UDP",
    question: "TCP는 흐름 제어와 혼잡 제어를 제공한다.",
    answer: true,
    explanation: "TCP는 신뢰적 전송, 흐름 제어, 혼잡 제어를 제공하고 연결 설정이 필요하다."
  },
  {
    category: "TCP와 UDP",
    question: "TCP는 최소 처리율과 지연 시간 보장을 제공한다.",
    answer: false,
    explanation: "TCP는 타이밍, 최소 처리율 보장, 보안을 제공하지 않는다."
  },
  {
    category: "TCP와 UDP",
    question: "UDP는 연결 설정 없이 비신뢰적으로 데이터를 전송한다.",
    answer: true,
    explanation: "UDP는 신뢰성, 흐름 제어, 혼잡 제어, 연결 설정 모두 제공하지 않는다."
  },
  {
    category: "SMTP",
    question: "SMTP는 UDP의 25번 포트를 사용한다.",
    answer: false,
    explanation: "SMTP는 신뢰적 전송을 위해 TCP를 사용하며 포트는 25이다."
  },
  {
    category: "SMTP",
    question: "SMTP는 메일 서버가 중간 서버를 거치지 않고 수신 서버로 직접 전송하는 방식이다.",
    answer: true,
    explanation: "direct transfer: 송신 서버에서 수신 서버로 바로 전송한다."
  },
  {
    category: "SMTP",
    question: "SMTP 메시지는 헤더와 본문 모두 7비트 ASCII여야 한다.",
    answer: true,
    explanation: "그래서 이진 데이터는 MIME의 인코딩이 필요하다."
  },
  {
    category: "SMTP",
    question: "SMTP는 연결을 매번 새로 열고 닫는 비지속 연결만 사용한다.",
    answer: false,
    explanation: "SMTP는 지속 연결을 사용한다."
  },
  {
    category: "SMTP와 HTTP",
    question: "HTTP는 푸시(push) 방식이고 SMTP는 풀(pull) 방식이다.",
    answer: false,
    explanation: "HTTP가 pull이고 SMTP가 push이다."
  },
  {
    category: "MIME",
    question: "MIME은 SMTP를 대체하는 새로운 메일 전송 프로토콜이다.",
    answer: false,
    explanation: "MIME은 메일 메시지 형식의 멀티미디어 확장이며 헤더로 콘텐츠 형식과 인코딩 방식을 알려 준다."
  },
  {
    category: "Base64",
    question: "Base64는 3바이트(24비트)를 6비트씩 4개 그룹으로 나눠 문자 4개로 바꾼다.",
    answer: true,
    explanation: "24비트를 6비트 그룹 4개로 나누고 각 그룹을 Base64 문자로 변환한다."
  },
  {
    category: "메일 접근",
    question: "POP3는 서버에 저장된 메시지를 폴더로 정리하는 기능을 제공한다.",
    answer: false,
    explanation: "그것은 IMAP의 기능이다. POP3는 인증과 다운로드 중심이다."
  },
  {
    category: "메일 접근",
    question: "IMAP은 메시지를 내려받은 뒤 서버에서 항상 삭제하며 세션 사이에 사용자 상태를 유지하지 않는다.",
    answer: false,
    explanation: "IMAP은 모든 메시지를 서버에 보관하고 폴더 구조 같은 사용자 상태를 세션 사이에도 유지한다."
  },
  {
    category: "DNS",
    question: "DNS는 호스트 이름을 IP 주소로 변환하는 분산 데이터베이스이다.",
    answer: true,
    explanation: "계층적인 많은 이름 서버로 구현된 분산 데이터베이스이다."
  },
  {
    category: "DNS",
    question: "로컬 DNS 서버는 DNS 계층 구조에 엄밀히 속하며 하나의 ISP에 하나씩 반드시 있다.",
    answer: false,
    explanation: "로컬 DNS 서버는 엄밀하게는 계층에 속하지 않는다. 다만 각 ISP마다 하나씩 있다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "응용 구조",
    question: "P2P 구조의 피어는 간헐적으로 연결되고 IP 주소가 바뀌기 때문에 (        )가 복잡하다.",
    answers: ["관리", "management", "관리가"],
    displayAnswer: "관리",
    explanation: "피어는 IP가 바뀌고 연결이 간헐적이라 관리가 복잡하다."
  },
  {
    category: "전송 서비스",
    question: "음성 통화나 대화형 게임은 효과적이려면 (        ) 지연이 필요하다.",
    answers: ["낮은", "낮은 지연", "짧은", "작은"],
    displayAnswer: "낮은",
    explanation: "타이밍 요구 응용이다."
  },
  {
    category: "전송 서비스",
    question: "얻을 수 있는 처리율을 그대로 활용하는 응용을 (        ) 응용이라 한다.",
    answers: ["탄력적", "elastic", "엘라스틱", "탄력", "탄력적 응용"],
    displayAnswer: "탄력적(elastic)",
    explanation: "파일 전송, 이메일, 웹 문서 등이 탄력적 응용이다."
  },
  {
    category: "SMTP",
    question: "SMTP 서버는 메시지의 끝을 CRLF.CRLF로 판단하며, 이 표시는 DATA 명령 다음에 보내는 메일 데이터의 (        )를 알려 준다.",
    answers: ["끝", "종료", "마지막", "끝을"],
    displayAnswer: "끝",
    explanation: "점(.)만 있는 줄이 메일 데이터의 끝이다."
  },
  {
    category: "메일 접근",
    question: "웹 기반 메일(gmail 등)은 메일 접근 프로토콜로 (        )를 사용한다.",
    answers: ["http", "https"],
    displayAnswer: "HTTP",
    explanation: "메일 접근: POP, IMAP, HTTP."
  },
  {
    category: "DNS",
    question: "DNS 캐시 항목은 일정 시간이 지나면 사라지는데 이 시간 제한을 (        )이라 한다.",
    answers: ["ttl", "time to live", "time-to-live"],
    displayAnswer: "TTL",
    explanation: "TTL이 지나면 캐시 항목이 없어진다."
  },

  // ===== 3번 Base64 개념 (4문제) =====
  {
    category: "Base64",
    question: "3바이트(24비트) 입력 그룹은 6비트 그룹 몇 개로 나뉘는가? (숫자만 입력)",
    answers: ["4", "4.0", "4.00", "4개", "4 개", "4.0개", "4.0 개", "4.00개", "4.00 개"],
    displayAnswer: "4개",
    explanation: "24비트를 6비트씩 나누면 4개이다."
  },
  { category: "Base64", question: "Base64 표는 6비트 값을 몇 가지 문자 중 하나로 바꾸는가? (숫자만 입력)",
    answers: ["64", "64개", "64가지"],
    displayAnswer: "64",
    hint: "2의 6제곱",
    explanation: "6비트 값은 0~63, 즉 64가지 문자(A~Z, a~z, 0~9, +, /)로 바뀐다." },
  { category: "Base64", question: "Base64 인코딩에서 입력이 3바이트 단위로 나누어떨어지지 않을 때 끝을 채우는 패딩 문자는?",
    answers: ["=", "등호", "이퀄", "equal"],
    displayAnswer: "=",
    hint: "등호",
    explanation: "부족한 비트는 오른쪽에 0을 채우고, 남는 출력 자리는 '='로 패딩한다." },
  { category: "Base64", question: "Base64 인코딩에서 6비트를 만들기에 비트가 부족하면 오른쪽에 어떤 비트를 채우는가? (숫자만 입력)",
    answers: ["0", "0비트", "영"],
    displayAnswer: "0",
    hint: "1이 아님",
    explanation: "부족하면 오른쪽에 0비트를 추가하고, 끝은 '='로 패딩한다." },

  // ===== 4번 DNS 레코드 (4문제) =====
  {
    category: "DNS 레코드",
    question: "새 회사가 도메인 studyhub.com을 등록했다. 권한 DNS 서버의 이름은 dns1.studyhub.com이고 IP 주소는 10.1.1.1이다. 웹 서버 이름 web1.studyhub.com에는 별칭 www.studyhub.com을 두며, 메일 서버 이름은 mail.studyhub.com이다. 레코드는 (name, value, type) 형식으로 쓴다.\n등록 기관이 .com TLD 서버에 넣는 권한 서버 지정 레코드는?",
    answers: ["studyhub.com, dns1.studyhub.com, ns", "(studyhub.com, dns1.studyhub.com, ns)", "studyhub.com,dns1.studyhub.com,ns", "(studyhub.com,dns1.studyhub.com,ns)", "studyhub.com dns1.studyhub.com ns", "(studyhub.com dns1.studyhub.com ns)"],
    displayAnswer: "(studyhub.com, dns1.studyhub.com, NS)",
    explanation: "NS 레코드의 name은 도메인, value는 권한 이름 서버의 호스트 이름이다."
  },
  {
    category: "DNS 레코드",
    question: "새 회사가 도메인 studyhub.com을 등록했다. 권한 DNS 서버의 이름은 dns1.studyhub.com이고 IP 주소는 10.1.1.1이다. 웹 서버 이름 web1.studyhub.com에는 별칭 www.studyhub.com을 두며, 메일 서버 이름은 mail.studyhub.com이다. 레코드는 (name, value, type) 형식으로 쓴다.\n권한 서버의 호스트 이름에 IP 주소를 대응시키는 레코드는?",
    answers: ["dns1.studyhub.com, 10.1.1.1, a", "(dns1.studyhub.com, 10.1.1.1, a)", "dns1.studyhub.com,10.1.1.1,a", "(dns1.studyhub.com,10.1.1.1,a)", "dns1.studyhub.com 10.1.1.1 a", "(dns1.studyhub.com 10.1.1.1 a)"],
    displayAnswer: "(dns1.studyhub.com, 10.1.1.1, A)",
    explanation: "A 레코드의 name은 호스트 이름, value는 IP 주소이다."
  },
  {
    category: "DNS 레코드",
    question: "새 회사가 도메인 studyhub.com을 등록했다. 권한 DNS 서버의 이름은 dns1.studyhub.com이고 IP 주소는 10.1.1.1이다. 웹 서버 이름 web1.studyhub.com에는 별칭 www.studyhub.com을 두며, 메일 서버 이름은 mail.studyhub.com이다. 레코드는 (name, value, type) 형식으로 쓴다.\n별칭 www.studyhub.com을 실제 이름 web1.studyhub.com에 연결하는 레코드는?",
    answers: ["www.studyhub.com, web1.studyhub.com, cname", "(www.studyhub.com, web1.studyhub.com, cname)", "www.studyhub.com,web1.studyhub.com,cname", "(www.studyhub.com,web1.studyhub.com,cname)", "www.studyhub.com web1.studyhub.com cname", "(www.studyhub.com web1.studyhub.com cname)"],
    displayAnswer: "(www.studyhub.com, web1.studyhub.com, CNAME)",
    explanation: "CNAME 레코드는 별칭을 정규 이름에 대응시킨다."
  },
  {
    category: "DNS 레코드",
    question: "새 회사가 도메인 studyhub.com을 등록했다. 권한 DNS 서버의 이름은 dns1.studyhub.com이고 IP 주소는 10.1.1.1이다. 웹 서버 이름 web1.studyhub.com에는 별칭 www.studyhub.com을 두며, 메일 서버 이름은 mail.studyhub.com이다. 레코드는 (name, value, type) 형식으로 쓴다.\n도메인 studyhub.com의 메일 서버를 지정하는 레코드는?",
    answers: ["studyhub.com, mail.studyhub.com, mx", "(studyhub.com, mail.studyhub.com, mx)", "studyhub.com,mail.studyhub.com,mx", "(studyhub.com,mail.studyhub.com,mx)", "studyhub.com mail.studyhub.com mx", "(studyhub.com mail.studyhub.com mx)"],
    displayAnswer: "(studyhub.com, mail.studyhub.com, MX)",
    explanation: "MX 레코드의 value는 해당 이름과 연관된 메일 서버의 이름이다."
  },

  // ===== 5번 메일 전송 · 접근 (3문제) =====
  { category: "SMTP", question: "Alice가 Bob에게 메일을 보낼 때, Alice의 user agent는 메시지를 가장 먼저 어디로 보내는가?",
    answers: ["alice의 메일 서버", "자신의 메일 서버", "송신자의 메일 서버", "송신 메일 서버", "메일 서버", "alice 메일 서버", "자기 메일 서버"],
    displayAnswer: "Alice의 메일 서버",
    hint: "Bob의 서버가 아님",
    explanation: "user agent → 송신자 메일 서버(message queue) → SMTP → 수신자 메일 서버(mailbox) → 수신자는 POP3/IMAP/HTTP로 가져온다." },
  { category: "SMTP와 HTTP", question: "HTTP는 pull 방식이고, 메일 서버 사이에서 메일을 보내는 SMTP는 (        ) 방식이다. (영어)",
    answers: ["push", "푸시", "푸쉬"],
    displayAnswer: "push",
    hint: "pull의 반대",
    explanation: "HTTP = pull, SMTP = push." },
  { category: "메일 접근", question: "메일 접근 프로토콜 중 메시지를 서버에 보관하고 세션 간 상태(폴더 등)를 유지하는 것은?",
    answers: ["imap", "imap4", "internet mail access protocol"],
    displayAnswer: "IMAP",
    hint: "POP3가 아님",
    explanation: "IMAP: 서버 보관·조작, 세션 간 상태 유지. POP3: 다운로드, stateless." },
];
