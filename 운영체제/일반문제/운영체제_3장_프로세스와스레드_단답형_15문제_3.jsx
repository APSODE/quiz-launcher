// 운영체제_3장_프로세스와스레드_단답형_15문제_3.jsx
const META = { group: "운영체제", unit: "3장", title: "프로세스와 스레드 단답형 15문제 (3)", topic: "프로그램과 프로세스 · 프로세스 계층 · 프로세스 통신 · 스레드" };

const SA_QUESTIONS = [
  { category: "프로그램과 프로세스", question: "디스크에 저장되어 있는 정적인 명령어와 데이터의 집합을 무엇이라 하는가?", answers: ["프로그램", "program"], displayAnswer: "프로그램", explanation: "실행되면 프로세스가 된다." },
  { category: "프로세스 계층", question: "유닉스에서 부모 프로세스를 복제하여 자식 프로세스를 만드는 시스템 호출은?", answers: ["fork", "fork()", "포크"], displayAnswer: "fork()", explanation: "호출 후 부모와 자식이 각각 다음 명령부터 실행한다." },
  { category: "프로세스 통신", question: "프로세스 간 통신 방식 중 운영체제가 관리하는 큐를 통해 메시지를 주고받는 방식은?", answers: ["메시지 큐", "메시지큐", "message queue"], displayAnswer: "메시지 큐", explanation: "송신과 수신 시점이 달라도 전달할 수 있다." },
  { category: "스레드", question: "스레드가 독립적으로 소유하는 자원은 레지스터와 무엇인가?", answers: ["스택", "stack", "스택 영역"], displayAnswer: "스택", explanation: "코드·데이터·힙은 공유한다." },
  { category: "스레드", question: "커널이 스레드의 존재를 알고 직접 스케줄링하는 스레드 방식은?", answers: ["커널 스레드", "커널 수준 스레드", "kernel thread", "kernel-level thread", "커널 레벨 스레드"], displayAnswer: "커널 수준 스레드", explanation: "멀티프로세서에서 병렬 실행이 가능하다." },
  { category: "프로세스 계층", question: "부모가 먼저 종료되어 부모를 잃은 자식 프로세스는?", answers: ["고아 프로세스", "고아", "orphan", "orphan process"], displayAnswer: "고아 프로세스", explanation: "보통 init 프로세스가 새 부모가 된다." },
  { category: "상태 전이", question: "준비 상태의 프로세스에 CPU를 배정하여 실행 상태로 바꾸는 작업은?", answers: ["디스패치", "dispatch", "디스패칭"], displayAnswer: "디스패치", explanation: "준비 → 실행 전이이다." },
  { category: "메모리 영역", question: "프로세스의 메모리 영역 4가지 중 실행할 명령어가 저장되는 영역은?", answers: ["코드 영역", "코드", "code", "텍스트 영역", "text", "코드 세그먼트"], displayAnswer: "코드 영역", explanation: "일반적으로 읽기 전용이다." },
  { category: "상태 전이", question: "CPU를 배정받아 명령어를 실행 중인 프로세스의 상태는?", answers: ["실행 상태", "실행", "running"], displayAnswer: "실행 상태", explanation: "한 CPU(코어)당 하나만 존재한다." },
  { category: "프로세스 계층", question: "fork()를 연속으로 4번 호출했을 때(분기 없이 모든 프로세스가 계속 호출) 존재하는 전체 프로세스의 수(최초 프로세스 포함)는?", answers: ["16", "16개", "열여섯"], displayAnswer: "16개", explanation: "2⁴ = 16이다." },
  { category: "프로세스 계층", question: "자식 프로세스가 종료될 때까지 부모 프로세스를 대기시키는 유닉스 함수는?", answers: ["wait", "wait()", "웨이트"], displayAnswer: "wait()", explanation: "자식의 종료 상태를 회수한다." },
  { category: "스레드", question: "하나의 프로세스 안에서 여러 스레드를 동시에 실행하는 프로그래밍 방식을 무엇이라 하는가?", answers: ["멀티스레딩", "멀티 스레딩", "multithreading", "multi-threading", "멀티스레드"], displayAnswer: "멀티스레딩", explanation: "응답성과 자원 공유 효율이 좋아진다." },
  { category: "프로세스 계층", question: "유닉스에서 부팅 시 가장 먼저 만들어져 모든 프로세스의 조상이 되는 프로세스는?", answers: ["init", "init 프로세스", "systemd", "initd"], displayAnswer: "init 프로세스", explanation: "고아 프로세스의 새 부모도 된다." },
  { category: "상태 전이", question: "프로세스가 입출력을 마치고 대기 상태에서 준비 상태로 전이되는 것을 무엇이라 하는가? (두 단어: 입출력 ○○)", answers: ["입출력 완료", "입출력 또는 이벤트 완료", "이벤트 완료", "wake up", "wakeup", "깨움"], displayAnswer: "입출력 완료(Wake up)", explanation: "실행 상태로 바로 가지 않는다." },
  { category: "스케줄러", question: "준비 큐에서 다음에 CPU를 할당할 프로세스를 선택하며 가장 자주 실행되는 스케줄러는?", answers: ["단기 스케줄러", "단기", "short-term scheduler", "short term scheduler", "CPU 스케줄러"], displayAnswer: "단기 스케줄러", explanation: "CPU 스케줄러라고도 한다." },
];
