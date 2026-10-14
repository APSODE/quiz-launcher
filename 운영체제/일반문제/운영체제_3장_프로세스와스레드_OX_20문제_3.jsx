// 운영체제_3장_프로세스와스레드_OX_20문제_3.jsx
const META = { group: "운영체제", unit: "3장", title: "프로세스와 스레드 OX 20문제 (3)", topic: "PCB · 멀티 · 메모리 영역 · 상태 전이" };

const OX_QUESTIONS = [
  { category: "상태 전이", question: "준비 상태의 프로세스가 입출력을 요청하면 대기 상태로 전이된다.", answer: false, explanation: "입출력 요청은 CPU를 갖고 실행 중인 프로세스가 한다." },
  { category: "스케줄러", question: "단기 스케줄러는 준비 큐의 프로세스 중 다음에 CPU를 줄 프로세스를 선택한다.", answer: true, explanation: "실행 빈도가 가장 높은 스케줄러이다." },
  { category: "스케줄러", question: "장기 스케줄러는 매우 짧은 시간 간격으로 자주 실행되어 CPU를 직접 할당한다.", answer: false, explanation: "CPU 할당은 단기 스케줄러가 하며 가장 자주 실행된다." },
  { category: "프로세스 계층", question: "고아 프로세스는 부모가 먼저 종료된 자식 프로세스이며 init 프로세스가 새 부모가 되어 관리한다.", answer: true, explanation: "부모를 잃어도 곧바로 강제 종료되지는 않는다." },
  { category: "상태 전이", question: "시분할 시스템에서 타임 퀀텀이 끝난 프로세스는 실행 상태에서 준비 상태로 전이된다.", answer: true, explanation: "선점형 스케줄링의 대표적인 전이이다." },
  { category: "메모리 영역", question: "코드 영역은 실행 중에 크기가 계속 늘어나고 줄어드는 영역이다.", answer: false, explanation: "실행 중 크기가 변하는 영역은 힙과 스택이다." },
  { category: "스레드", question: "스레드는 프로세스마다 코드, 데이터, 힙, 스택을 모두 독립적으로 소유한다.", answer: false, explanation: "스레드끼리는 코드·데이터·힙을 공유하고 스택과 레지스터만 독립적이다." },
  { category: "스레드", question: "스레드는 자신만의 스택과 레지스터(프로그램 카운터 포함)를 가진다.", answer: true, explanation: "독립된 실행 흐름을 유지하기 위해 필요하다." },
  { category: "프로세스 계층", question: "exec 계열 함수를 호출하면 새로운 PID를 가진 자식 프로세스가 하나 더 생성된다.", answer: false, explanation: "프로세스를 새로 만들지 않고 현재 프로세스의 내용을 교체한다." },
  { category: "멀티", question: "멀티프로세싱은 단일 CPU에서 시간을 나누어 여러 프로세스를 번갈아 실행하는 것만을 뜻한다.", answer: false, explanation: "멀티프로세싱은 여러 CPU(코어)를 사용한 병렬 처리이다." },
  { category: "스레드", question: "멀티스레드 프로세스에서 한 스레드의 심각한 오류는 같은 프로세스의 다른 스레드에도 영향을 줄 수 있다.", answer: true, explanation: "메모리를 공유하기 때문에 격리되지 않는다." },
  { category: "스케줄러", question: "단기 스케줄러는 프로세스를 디스크로 내보내 메모리 부하를 줄이는 역할을 한다.", answer: false, explanation: "그것은 중기 스케줄러의 역할이다." },
  { category: "상태 전이", question: "대기 상태의 프로세스는 입출력이 완료되면 곧바로 실행되지 않고 준비 상태로 전이된다.", answer: true, explanation: "실행 상태로 가려면 다시 디스패치되어야 한다." },
  { category: "스레드", question: "스레드는 같은 프로세스의 코드, 데이터, 힙 영역을 다른 스레드와 공유한다.", answer: true, explanation: "공유 덕분에 스레드 간 통신이 쉽다." },
  { category: "프로세스 통신", question: "서로 독립된 프로세스끼리 데이터를 주고받으려면 파이프, 메시지 큐, 공유 메모리, 소켓 같은 프로세스 간 통신 수단이 필요하다.", answer: true, explanation: "프로세스는 기본적으로 메모리 영역이 분리되어 있다." },
  { category: "프로세스 계층", question: "fork()가 반환하는 값은 부모에게는 자식의 PID, 자식에게는 0이다.", answer: true, explanation: "이 반환값으로 부모와 자식의 실행 경로를 구분한다." },
  { category: "프로그램과 프로세스", question: "프로세스는 디스크에 저장되어 있으며 아직 실행되지 않은 정적인 명령어 집합이다.", answer: false, explanation: "그것은 프로그램의 정의이다. 프로세스는 실행 중인 프로그램이다." },
  { category: "프로세스 계층", question: "fork()는 현재 프로세스를 완전히 새로운 프로그램으로 교체하는 함수이다.", answer: false, explanation: "프로그램을 교체하는 것은 exec 계열 함수이다." },
  { category: "상태 전이", question: "대기 상태의 프로세스는 입출력이 끝나면 곧바로 실행 상태로 전이된다.", answer: false, explanation: "준비 상태로 전이된 뒤 디스패치되어야 실행된다." },
  { category: "PCB", question: "운영체제는 각 프로세스마다 하나의 PCB를 만들어 프로세스 관리에 필요한 정보를 저장한다.", answer: true, explanation: "PID, 상태, 프로그램 카운터, 레지스터 정보 등이 담긴다." },
];
