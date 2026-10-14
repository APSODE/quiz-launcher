// 운영체제_3장_프로세스와스레드_기출스타일_1회.jsx
const META = { group: "운영체제", unit: "3장", title: "프로세스와 스레드 기출 스타일 1회", topic: "작년 기출 형식(단답·OX·계산형)을 본뜬 생성 문제" };

const QUESTIONS = [
  { category: "상태 전이", question: "입출력 완료나 이벤트 발생을 기다리느라 CPU를 쓸 수 없는 프로세스의 상태는?", answers: ["대기 상태", "대기", "블록 상태", "블록", "blocked", "waiting"], displayAnswer: "대기(블록) 상태", explanation: "완료되면 준비 상태로 전이된다." },
  { category: "프로그램과 프로세스", question: "한 프로그램을 실행했을 때 만들어지는 프로세스를 프로그램의 무엇이라 부르는가? (프로그램의 ○○)", answers: ["인스턴스", "instance", "실행 인스턴스"], displayAnswer: "인스턴스", explanation: "프로세스는 프로그램의 인스턴스이다." },
  { category: "메모리 영역", question: "프로세스의 메모리 영역 중 함수 호출 시 지역 변수와 복귀 주소가 저장되는 영역은?", answers: ["스택", "스택 영역", "stack"], displayAnswer: "스택 영역", explanation: "함수가 끝나면 해당 프레임이 제거된다." },
  { category: "스케줄러", question: "프로세스를 메모리에서 디스크로 내보내는 작업을 무엇이라 하는가?", answers: ["스왑 아웃", "스왑아웃", "swap out", "swap-out"], displayAnswer: "스왑 아웃", explanation: "다시 불러오는 것은 스왑 인이다." },
  { category: "프로세스 계층", question: "wait()는 부모 프로세스가 자식 프로세스를 강제로 종료시키는 함수이다.", answer: false, explanation: "wait()는 자식의 종료를 기다리고 종료 상태를 회수하는 함수이다." },
  { category: "프로세스 계층", question: "고아 프로세스는 부모가 사라졌으므로 운영체제가 즉시 강제 종료한다.", answer: false, explanation: "init 프로세스가 새 부모가 되어 계속 실행될 수 있다." },
  { category: "스레드", question: "멀티스레드 프로세스에서는 한 스레드가 입출력으로 대기하는 동안 다른 스레드가 계속 실행될 수 있다.", answer: true, explanation: "응답성이 향상된다." },
  { category: "상태 전이", question: "실행 상태의 프로세스가 입출력을 요청하면 대기 상태로 전이된다.", answer: true, explanation: "입출력은 CPU보다 훨씬 느려 CPU를 반납하고 기다린다." },
  { category: "상태 전이도", question: "프로세스 상태 전이도(시분할 시스템)\n· ( ① ) 상태 → 준비 상태\n· 준비 상태 --[ 디스패치 ]--> 실행 상태\n· 실행 상태 --[ 타임아웃 ]--> 준비 상태\n· 실행 상태 --[ 입출력 대기 ]--> ( ② ) 상태\n· ( ② ) 상태 --[ 입출력 완료 ]--> 준비 상태\n· 실행 상태 → ( ③ ) 상태\n\n①에 들어갈 알맞은 말은?", answers: ["생성", "생성 상태", "new", "created"], displayAnswer: "생성", explanation: "① = 생성: PCB가 만들어지고 메모리가 할당되는 처음 상태." },
  { category: "상태 전이도", question: "프로세스 상태 전이도(시분할 시스템)\n· ( ① ) 상태 → 준비 상태\n· 준비 상태 --[ 디스패치 ]--> 실행 상태\n· 실행 상태 --[ 타임아웃 ]--> 준비 상태\n· 실행 상태 --[ 입출력 대기 ]--> ( ② ) 상태\n· ( ② ) 상태 --[ 입출력 완료 ]--> 준비 상태\n· 실행 상태 → ( ③ ) 상태\n\n②에 들어갈 알맞은 말은?", answers: ["대기", "대기 상태", "blocked", "waiting", "블록", "블록 상태"], displayAnswer: "대기", explanation: "② = 대기: 입출력이나 이벤트를 기다리는 상태." },
  { category: "상태 전이도", question: "프로세스 상태 전이도(시분할 시스템)\n· ( ① ) 상태 → 준비 상태\n· 준비 상태 --[ 디스패치 ]--> 실행 상태\n· 실행 상태 --[ 타임아웃 ]--> 준비 상태\n· 실행 상태 --[ 입출력 대기 ]--> ( ② ) 상태\n· ( ② ) 상태 --[ 입출력 완료 ]--> 준비 상태\n· 실행 상태 → ( ③ ) 상태\n\n③에 들어갈 알맞은 말은?", answers: ["종료", "종료 상태", "terminated"], displayAnswer: "종료", explanation: "③ = 종료: PCB가 제거되고 메모리가 반납되는 마지막 상태." },
  { category: "프로세스 생성 계산", question: "한 프로세스가 fork()를 연속으로 2번 호출한다(모든 프로세스가 매번 호출). 최초 프로세스를 포함한 전체 프로세스의 수는?", answers: ["4", "4개"], displayAnswer: "4개", explanation: "fork() 한 번마다 프로세스 수가 2배가 되므로 2^2 = 4개이다." },
];
