// 운영체제_3장_프로세스와스레드_단답형_15문제_4.jsx
const META = { group: "운영체제", unit: "3장", title: "프로세스와 스레드 단답형 15문제 (4)", topic: "스레드 · PCB · 상태 전이 · 프로세스 통신" };

const SA_QUESTIONS = [
  { category: "스레드", question: "프로세스 내부에서 실행되는 작은 실행 흐름으로 CPU 이용의 기본 단위가 되는 것은?", answers: ["스레드", "쓰레드", "thread"], displayAnswer: "스레드", explanation: "프로세스는 하나 이상의 스레드를 가진다." },
  { category: "PCB", question: "PCB에 저장되는 정보 중 다음에 실행할 명령어의 주소를 가리키는 레지스터 값은?", answers: ["프로그램 카운터", "PC", "program counter", "프로그램카운터"], displayAnswer: "프로그램 카운터(PC)", explanation: "문맥 교환 후 이어서 실행하기 위해 필요하다." },
  { category: "상태 전이", question: "프로세스가 새로 만들어져 아직 준비 큐에 들어가기 전의 상태는?", answers: ["생성 상태", "생성", "new", "created"], displayAnswer: "생성 상태", explanation: "PCB가 만들어지고 메모리가 할당된다." },
  { category: "프로세스 통신", question: "프로세스 간 통신 방식 중 여러 프로세스가 같은 메모리 영역을 함께 사용하는 방식은?", answers: ["공유 메모리", "shared memory", "공유메모리"], displayAnswer: "공유 메모리", explanation: "가장 빠르지만 동기화가 필요하다." },
  { category: "스레드", question: "사용자 라이브러리가 관리하며 커널은 그 존재를 모르는 스레드 방식은?", answers: ["사용자 스레드", "사용자 수준 스레드", "user thread", "user-level thread", "사용자 레벨 스레드"], displayAnswer: "사용자 수준 스레드", explanation: "생성·전환이 빠르지만 하나가 블록되면 전체가 블록될 수 있다." },
  { category: "스레드", question: "C언어 pthread에서 생성한 스레드의 종료를 기다리는 함수는?", answers: ["pthread_join", "pthread_join()"], displayAnswer: "pthread_join()", explanation: "프로세스의 wait()와 비슷한 역할이다." },
  { category: "프로그램과 프로세스", question: "디스크의 프로그램이 메모리에 적재되어 CPU를 배정받으며 실행되는 개체를 무엇이라 하는가?", answers: ["프로세스", "process"], displayAnswer: "프로세스", explanation: "프로그램은 디스크에 저장된 정적인 상태이다." },
  { category: "메모리 영역", question: "프로세스의 메모리 영역 중 전역 변수와 정적 변수가 저장되는 영역은?", answers: ["데이터 영역", "데이터", "data", "데이터 세그먼트"], displayAnswer: "데이터 영역", explanation: "프로그램 시작부터 종료까지 유지된다." },
  { category: "PCB", question: "PCB에 저장되는 정보 중 프로세스를 구별하는 고유 번호는?", answers: ["PID", "pid", "프로세스 식별자", "프로세스 ID", "process id"], displayAnswer: "PID(프로세스 식별자)", explanation: "부모는 PPID, 자식은 CPID로 기록한다." },
  { category: "프로세스 계층", question: "프로세스를 정상적으로 종료시키고 종료 상태를 부모에게 전달하는 유닉스 함수는?", answers: ["exit", "exit()", "엑시트"], displayAnswer: "exit()", explanation: "종료 상태는 부모의 wait()로 회수한다." },
  { category: "문맥 교환", question: "문맥 교환 중에는 사용자의 실제 작업이 진행되지 않기 때문에 이 작업은 시스템의 무엇에 해당하는가?", answers: ["오버헤드", "overhead"], displayAnswer: "오버헤드", explanation: "문맥 교환이 잦으면 시스템 성능이 떨어진다." },
  { category: "PCB", question: "운영체제가 프로세스를 관리하기 위해 프로세스마다 유지하는 정보 블록의 약자는?", answers: ["PCB", "pcb", "process control block", "프로세스 제어 블록"], displayAnswer: "PCB", explanation: "PID, 상태, 레지스터 정보 등이 저장된다." },
  { category: "프로세스 계층", question: "fork() 호출 후 자식 프로세스에서 fork()가 반환하는 값은?", answers: ["0", "영"], displayAnswer: "0", explanation: "부모에게는 자식의 PID가 반환된다." },
  { category: "상태 전이", question: "실행 중인 프로세스가 배정된 시간을 모두 사용해 준비 상태로 돌아가는 전이를 무엇이라 하는가?", answers: ["타임아웃", "타임 아웃", "time out", "timeout", "인터럽트", "타임아웃 인터럽트"], displayAnswer: "타임아웃", explanation: "시분할 시스템에서 일어나는 전이이다." },
  { category: "스레드", question: "C언어 pthread에서 새로운 스레드를 생성하는 함수는?", answers: ["pthread_create", "pthread_create()"], displayAnswer: "pthread_create()", explanation: "스레드가 실행할 함수를 인자로 넘긴다." },
];
