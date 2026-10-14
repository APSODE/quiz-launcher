// 운영체제_3장_프로세스와스레드_단어집_2.jsx
const META = { group: "운영체제", unit: "3장", title: "프로세스와 스레드 단어집 2", topic: "3장 핵심 용어 11개" };

const TERMS = [
  { terms: ["멀티스레딩", "multithreading", "멀티 스레딩"], group: "3장", desc: "하나의 프로세스 안에서 둘 이상의 실행 흐름을 동시에 운영하는 프로그래밍 방식" },
  { terms: ["커널 수준 스레드", "kernel-level thread", "커널 스레드"], group: "3장", desc: "운영체제 커널이 직접 생성·스케줄링하며 멀티프로세서에서 병렬 실행이 가능한 스레드" },
  { terms: ["사용자 수준 스레드", "user-level thread", "사용자 스레드"], group: "3장", desc: "스레드 라이브러리가 관리하여 전환이 빠르지만 커널은 그 존재를 모르는 스레드" },
  { terms: ["파이프", "pipe", "파이프 통신"], group: "3장", desc: "한 프로세스의 출력을 다른 프로세스의 입력으로 이어 주는 단방향 통신 통로" },
  { terms: ["메시지 큐", "message queue", "메시지큐"], group: "3장", desc: "운영체제가 관리하는 대기열을 통해 프로세스끼리 메시지를 주고받는 통신 방식" },
  { terms: ["소켓", "socket", "소켓 통신"], group: "3장", desc: "IP 주소와 포트를 이용해 서로 다른 컴퓨터의 프로세스끼리도 통신하게 하는 통로" },
  { terms: ["공유 메모리", "shared memory", "공유메모리"], group: "3장", desc: "여러 프로세스가 같은 메모리 영역을 함께 사용하여 가장 빠르게 데이터를 교환하는 통신 방식" },
  { terms: ["프로세스 간 통신", "inter-process communication", "IPC"], group: "3장", desc: "서로 독립된 프로세스들이 데이터를 주고받기 위해 운영체제가 제공하는 수단을 통틀어 부르는 말" },
  { terms: ["스레드 풀", "thread pool"], group: "3장", desc: "스레드를 미리 일정 개수 만들어 두고 작업이 올 때마다 재사용하여 생성 비용을 줄이는 기법" },
  { terms: ["동시성", "concurrency"], group: "3장", desc: "여러 작업이 번갈아 진행되어 겹쳐서 실행되는 것처럼 보이는 성질" },
  { terms: ["병렬성", "parallelism"], group: "3장", desc: "둘 이상의 CPU 코어에서 여러 작업이 실제로 같은 순간에 실행되는 성질" },
];
