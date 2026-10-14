// 근거: 수업자료 Chapter 2 Application Layer (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "2장",
  title: "2장 모의고사 2회",
  topic: "OX + 빈칸 + DNS 해석 · POP3 · 포트"
};

const QUESTIONS = [

  // ===== 1번 OX (20문제) =====
  {
    category: "응용 구조",
    question: "클라이언트는 항상 켜져 있어야 하며 고정 IP 주소를 가져야 한다.",
    answer: false,
    explanation: "그것은 서버의 특징이다. 클라이언트는 간헐적 연결과 동적 IP가 가능하다."
  },
  {
    category: "응용 구조",
    question: "P2P 구조에는 항상 켜져 있는 서버가 반드시 필요하다.",
    answer: false,
    explanation: "P2P는 always-on 서버가 없고 임의의 종단 시스템이 직접 통신한다."
  },
  {
    category: "프로세스 주소",
    question: "프로세스는 포트 번호 없이 호스트의 IP 주소만으로 식별된다.",
    answer: false,
    explanation: "프로세스 식별자에는 IP 주소와 포트 번호가 함께 포함된다. 예: 웹 서버 80, 메일 서버 25."
  },
  {
    category: "전송 서비스",
    question: "전송 계층이 제공할 수 있는 서비스에는 데이터 무결성, 타이밍, 처리율, 보안이 있다.",
    answer: true,
    explanation: "응용이 필요로 하는 전송 서비스의 분류이다."
  },
  {
    category: "전송 서비스",
    question: "파일 전송은 실시간 오디오/비디오처럼 시간에 민감한 응용이다.",
    answer: false,
    explanation: "실시간 응용은 수백 ms 수준 지연이 중요하지만 파일 전송, 이메일, 웹 문서는 시간에 민감하지 않다."
  },
  {
    category: "전송 서비스",
    question: "이메일은 데이터 손실을 허용하는 응용이다.",
    answer: false,
    explanation: "이메일은 손실이 없어야 하는(no loss) 응용이다."
  },
  {
    category: "TCP와 UDP",
    question: "TCP는 흐름 제어를 제공하지 않으며 UDP가 제공한다.",
    answer: false,
    explanation: "흐름 제어(송신자가 수신자를 압도하지 않게 함)는 TCP가 제공하고 UDP는 제공하지 않는다."
  },
  {
    category: "TCP와 UDP",
    question: "UDP는 혼잡 제어를 제공해 네트워크가 과부하일 때 송신자를 늦춘다.",
    answer: false,
    explanation: "혼잡 제어는 TCP가 제공하며 UDP는 제공하지 않는다."
  },
  {
    category: "응용 프로토콜",
    question: "이메일(SMTP)은 TCP 위에서 동작한다.",
    answer: true,
    explanation: "이메일, 원격 터미널, 웹, 파일 전송은 TCP를 사용한다."
  },
  {
    category: "이메일 구성",
    question: "이메일 시스템은 사용자 에이전트, 메일 서버, SMTP의 세 가지 주요 요소로 구성된다.",
    answer: true,
    explanation: "user agents, mail servers, SMTP."
  },
  {
    category: "이메일 구성",
    question: "메일 서버에는 수신 메시지가 쌓이는 사서함과 보낼 메시지의 큐가 있다.",
    answer: true,
    explanation: "mailbox와 outgoing message queue를 가진다."
  },
  {
    category: "SMTP",
    question: "SMTP 명령 MAIL FROM과 RCPT TO는 메일 헤더의 From:, To: 줄과 같은 것이다.",
    answer: false,
    explanation: "SMTP 명령과 RFC 822 헤더 줄은 서로 다르다."
  },
  {
    category: "SMTP",
    question: "SMTP에서 응답은 상태 코드와 구문으로 이루어진다.",
    answer: true,
    explanation: "명령은 ASCII 텍스트이고 응답은 상태 코드와 구문이다."
  },
  {
    category: "SMTP",
    question: "SMTP는 여러 객체를 멀티파트 메시지로 한 번에 보낸다.",
    answer: true,
    explanation: "HTTP는 객체마다 별도 응답 메시지로 보낸다."
  },
  {
    category: "MIME",
    question: "MIME의 Content-Transfer-Encoding 헤더는 데이터를 인코딩하는 방법을 알려 준다.",
    answer: true,
    explanation: "예: base64, quoted-printable."
  },
  {
    category: "MIME",
    question: "Content-Type: image/jpeg에서 image는 subtype이고 jpeg는 type이다.",
    answer: false,
    explanation: "형식은 type/subtype이므로 image가 type, jpeg가 subtype이다."
  },
  {
    category: "POP3",
    question: "POP3의 인증 단계에서 클라이언트는 user와 pass 명령을 사용하고 서버는 +OK 또는 -ERR로 응답한다.",
    answer: true,
    explanation: "트랜잭션 단계에서 list, retr, dele, quit을 사용한다."
  },
  {
    category: "POP3",
    question: "POP3의 '다운로드 후 삭제' 모드에서는 다른 클라이언트로 바꿔도 이미 받은 메일을 다시 읽을 수 있다.",
    answer: false,
    explanation: "다운로드 후 삭제 모드에서는 클라이언트를 바꾸면 메일을 다시 읽을 수 없다."
  },
  {
    category: "DNS",
    question: "DNS를 중앙 집중으로 구성하면 단일 장애점, 트래픽 폭주, 먼 거리, 유지보수 문제가 생긴다.",
    answer: true,
    explanation: "그래서 분산 계층 구조이며 중앙 집중은 확장되지 않는다."
  },
  {
    category: "DNS",
    question: "TLD 서버는 com, org, edu 같은 최상위 도메인과 국가 도메인을 담당한다.",
    answer: true,
    explanation: "권한 DNS 서버는 기관 자체의 호스트 이름-IP 매핑을 제공한다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "응용 구조",
    question: "클라이언트-서버 구조에서 서버가 규모를 확장하기 위해 두는 시설은 데이터 (        )이다.",
    answers: ["센터", "데이터센터", "데이터 센터", "center"],
    displayAnswer: "센터",
    explanation: "서버는 데이터 센터로 확장한다."
  },
  {
    category: "SMTP",
    question: "SMTP 전송의 세 단계는 핸드셰이킹, 메시지 전송, (        )이다.",
    answers: ["종료", "closure", "연결 종료", "닫기"],
    displayAnswer: "종료(closure)",
    explanation: "handshaking, transfer of messages, closure."
  },
  {
    category: "SMTP와 HTTP",
    question: "HTTP는 풀(pull) 방식이고 SMTP는 (        ) 방식이다.",
    answers: ["푸시", "push"],
    displayAnswer: "푸시(push)",
    explanation: "송신 서버가 수신 서버로 밀어 보내는 방식이 SMTP이다."
  },
  {
    category: "메일 접근",
    question: "서버에 저장된 메시지를 폴더로 정리하는 등 더 많은 기능을 제공하는 메일 접근 프로토콜은 (        )이다.",
    answers: ["imap"],
    displayAnswer: "IMAP",
    explanation: "POP는 인증과 다운로드, IMAP은 서버 상의 메시지 조작까지 제공한다."
  },
  {
    category: "DNS",
    question: "DNS에서 한 이름에 여러 IP 주소가 대응하여 복제된 웹 서버 사이에 부하를 나누는 서비스를 (        ) 분산이라 한다.",
    answers: ["부하", "load", "load distribution", "로드"],
    displayAnswer: "부하(load)",
    explanation: "replicated Web servers: many IP addresses correspond to one name."
  },
  {
    category: "DNS",
    question: "DNS에서 이름 해석 중 \"나는 이 이름을 모르니 이 서버에게 물어보라\"고 답하는 질의 방식은 (        ) 질의이다.",
    answers: ["반복", "반복적", "반복적 질의", "iterated", "iterative"],
    displayAnswer: "반복적(iterated)",
    explanation: "접촉받은 서버가 다음에 접촉할 서버 이름을 알려 준다."
  },

  // ===== 3번 DNS 이름 해석 (4문제) =====
  {
    category: "DNS 해석",
    question: "호스트가 www.amazon.com의 IP 주소를 알고 싶어 로컬 DNS 서버에 질의한다. 로컬 DNS 서버의 캐시에는 아무 정보도 없고 반복적 질의로 해석한다.\n로컬 DNS 서버는 루트, TLD, 권한 DNS 서버 중 몇 개의 서버에 질의하는가? (숫자만 입력)",
    answers: ["3", "3.0", "3.00", "3개", "3 개", "3.0개", "3.0 개", "3.00개", "3.00 개"],
    displayAnswer: "3개",
    explanation: "루트 → TLD → 권한 서버 순서로 3개에 질의한다."
  },
  {
    category: "DNS 해석",
    question: "호스트가 www.amazon.com의 IP 주소를 알고 싶어 로컬 DNS 서버에 질의한다. 로컬 DNS 서버의 캐시에는 아무 정보도 없고 반복적 질의로 해석한다.\n호스트-로컬 DNS 사이의 질의·응답까지 포함하면 전체 메시지는 몇 개인가? (숫자만 입력)",
    answers: ["8", "8.0", "8.00", "8개", "8 개", "8.0개", "8.0 개", "8.00개", "8.00 개"],
    displayAnswer: "8개",
    explanation: "호스트→로컬 1, 로컬↔루트 2, 로컬↔TLD 2, 로컬↔권한 2, 로컬→호스트 1로 모두 8개이다."
  },
  {
    category: "DNS 해석",
    question: "호스트가 www.amazon.com의 IP 주소를 알고 싶어 로컬 DNS 서버에 질의한다. 로컬 DNS 서버의 캐시에는 아무 정보도 없고 반복적 질의로 해석한다.\n로컬 DNS 서버에 com TLD 서버의 정보가 이미 캐시되어 있다면 질의하는 서버는 몇 개인가? (숫자만 입력)",
    answers: ["2", "2.0", "2.00", "2개", "2 개", "2.0개", "2.0 개", "2.00개", "2.00 개"],
    displayAnswer: "2개",
    explanation: "루트를 건너뛰고 TLD와 권한 서버 2개에 질의한다."
  },
  {
    category: "DNS 해석",
    question: "호스트가 www.amazon.com의 IP 주소를 알고 싶어 로컬 DNS 서버에 질의한다. 로컬 DNS 서버의 캐시에는 아무 정보도 없고 반복적 질의로 해석한다.\n로컬 DNS 서버가 com TLD 서버의 주소를 알아내기 위해 가장 먼저 접촉하는 서버는?",
    answers: ["루트", "루트 서버", "루트 dns 서버", "루트 이름 서버", "루트dns서버", "root", "root server"],
    displayAnswer: "루트 서버",
    explanation: "루트 서버가 TLD 서버의 이름을 알려 준다."
  },

  // ===== 4번 POP3 (3문제) =====
  {
    category: "POP3",
    question: "Bob이 POP3 서버에 접속해 user와 pass로 인증을 마쳤다. 서버에는 메시지 2개(1번 498바이트, 2번 912바이트)가 있다.\n메시지 번호와 크기 목록을 요청하는 명령은?",
    answers: ["list"],
    displayAnswer: "list",
    explanation: "list 명령에 서버가 번호와 크기를 나열한다."
  },
  {
    category: "POP3",
    question: "Bob이 POP3 서버에 접속해 user와 pass로 인증을 마쳤다. 서버에는 메시지 2개(1번 498바이트, 2번 912바이트)가 있다.\n2번 메시지를 내려받는 명령은? (명령과 번호를 함께 입력)",
    answers: ["retr 2", "retr2"],
    displayAnswer: "retr 2",
    explanation: "retr는 번호로 메시지를 가져온다."
  },
  {
    category: "POP3",
    question: "Bob이 POP3 서버에 접속해 user와 pass로 인증을 마쳤다. 서버에는 메시지 2개(1번 498바이트, 2번 912바이트)가 있다.\n1번 메시지를 서버에서 삭제하는 명령은? (명령과 번호를 함께 입력)",
    answers: ["dele 1", "dele1"],
    displayAnswer: "dele 1",
    explanation: "dele는 번호로 메시지를 삭제한다."
  },

  // ===== 5번 포트 번호 (2문제) =====
  {
    category: "포트",
    question: "웹 서버(HTTP)가 사용하는 포트 번호는? (숫자만 입력)",
    answers: ["80", "80.0", "80.00"],
    displayAnswer: "80",
    explanation: "HTTP 서버 포트는 80이다."
  },
  {
    category: "포트",
    question: "메일 서버 사이의 SMTP가 사용하는 포트 번호는? (숫자만 입력)",
    answers: ["25", "25.0", "25.00"],
    displayAnswer: "25",
    explanation: "SMTP는 TCP 25번 포트를 사용한다."
  },
];
