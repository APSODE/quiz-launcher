// 운영체제_3장_프로세스와스레드_모의고사_2회.jsx
const META = { group: "운영체제", unit: "3장", title: "프로세스와 스레드 모의고사 2회", topic: "객관식 6 · OX 3 · 단답형 3 · 계산형 4" };

const QUESTIONS = [
  { category: "프로세스 통신", question: "프로세스 간 통신 방식에 해당하지 않는 것은?", choices: ["지역 변수 직접 참조", "공유 메모리", "파이프", "메시지 큐"], answer: 0, explanation: "프로세스의 지역 변수는 다른 프로세스가 직접 참조할 수 없다." },
  { category: "문맥 교환", question: "문맥 교환에 대한 설명으로 옳은 것은?", choices: ["항상 같은 프로세스에게 CPU를 돌려준다", "CPU 이용률을 높이는 유익한 작업만 수행한다", "프로세스를 영구히 삭제한다", "PCB의 정보를 저장하고 복원한다"], answer: 3, explanation: "문맥 교환은 PCB에 현재 상태를 저장하고 다음 PCB에서 복원하는 작업이다." },
  { category: "스케줄러", question: "다음 중 스왑 인·스왑 아웃으로 메모리에 올라온 프로세스 수를 조절하는 스케줄러는?", choices: ["중기 스케줄러", "디스패처", "장기 스케줄러", "단기 스케줄러"], answer: 0, explanation: "중기 스케줄러가 스와핑을 담당한다." },
  { category: "PCB", question: "PCB에 저장되지 않는 정보는?", choices: ["프로세스 ID", "레지스터 값", "프로세스가 출력한 화면 이미지 전체", "프로세스 상태"], answer: 2, explanation: "PCB에는 관리용 정보가 저장된다." },
  { category: "메모리 영역", question: "프로세스의 메모리 영역 중 동적 할당 데이터가 저장되는 영역은?", choices: ["데이터 영역", "힙 영역", "스택 영역", "코드 영역"], answer: 1, explanation: "malloc()이나 new로 할당한 메모리는 힙에 놓인다." },
  { category: "스레드", question: "같은 프로세스의 스레드들이 서로 공유하지 않는 것은?", choices: ["코드 영역", "힙 영역", "데이터 영역", "스택과 레지스터"], answer: 3, explanation: "스택과 레지스터(PC 포함)는 스레드마다 독립적이다." },
  { category: "스레드", question: "같은 프로세스의 스레드들은 하나의 스택을 함께 사용한다.", answer: false, explanation: "스레드마다 자신의 스택을 가진다." },
  { category: "문맥 교환", question: "문맥 교환이 일어나는 동안 시스템은 사용자 작업을 수행하지 못하므로 순수한 오버헤드이다.", answer: true, explanation: "따라서 문맥 교환이 지나치게 잦으면 성능이 떨어진다." },
  { category: "문맥 교환", question: "문맥 교환 시에는 이전 프로세스의 PCB를 삭제하고 새 프로세스의 PCB를 새로 만든다.", answer: false, explanation: "PCB를 삭제하지 않고 상태를 저장·복원한다." },
  { category: "스케줄러", question: "프로세스를 메모리에서 디스크로 내보내거나 다시 불러와 메모리 부하를 조절하는 스케줄러는?", answers: ["중기 스케줄러", "중기", "medium-term scheduler", "medium term scheduler"], displayAnswer: "중기 스케줄러", explanation: "스와핑을 담당한다." },
  { category: "프로세스 계층", question: "실행은 끝났지만 부모가 종료 상태를 회수하지 않아 PCB가 남아 있는 프로세스는?", answers: ["좀비 프로세스", "좀비", "zombie", "zombie process"], displayAnswer: "좀비 프로세스", explanation: "부모가 wait()를 호출하면 사라진다." },
  { category: "프로세스 계층", question: "현재 프로세스의 메모리 내용을 새로운 프로그램으로 교체하는 유닉스 함수 계열은?", answers: ["exec", "exec()", "exec 계열", "exec계열", "execl", "execv"], displayAnswer: "exec 계열 함수", explanation: "프로세스는 새로 만들어지지 않고 PID가 유지된다." },
  { category: "상태 전이도", question: "프로세스 상태 전이도(시분할 시스템)\n· 생성 상태 → 준비 상태\n· 준비 상태 --[ ( ② ) ]--> ( ① ) 상태\n· ( ① ) 상태 --[ 타임아웃 ]--> 준비 상태\n· ( ① ) 상태 --[ 입출력 대기 ]--> 대기 상태\n· 대기 상태 --[ ( ③ ) ]--> 준비 상태\n· ( ① ) 상태 → 종료 상태\n\n①에 들어갈 알맞은 말은?", answers: ["실행", "실행 상태", "running"], displayAnswer: "실행", explanation: "① = 실행: CPU를 배정받아 명령어를 수행 중인 상태." },
  { category: "상태 전이도", question: "프로세스 상태 전이도(시분할 시스템)\n· 생성 상태 → 준비 상태\n· 준비 상태 --[ ( ② ) ]--> ( ① ) 상태\n· ( ① ) 상태 --[ 타임아웃 ]--> 준비 상태\n· ( ① ) 상태 --[ 입출력 대기 ]--> 대기 상태\n· 대기 상태 --[ ( ③ ) ]--> 준비 상태\n· ( ① ) 상태 → 종료 상태\n\n②에 들어갈 알맞은 말은?", answers: ["디스패치", "dispatch", "디스패칭"], displayAnswer: "디스패치", explanation: "② = 디스패치: 준비 상태에서 실행 상태로 바꾸는 작업." },
  { category: "상태 전이도", question: "프로세스 상태 전이도(시분할 시스템)\n· 생성 상태 → 준비 상태\n· 준비 상태 --[ ( ② ) ]--> ( ① ) 상태\n· ( ① ) 상태 --[ 타임아웃 ]--> 준비 상태\n· ( ① ) 상태 --[ 입출력 대기 ]--> 대기 상태\n· 대기 상태 --[ ( ③ ) ]--> 준비 상태\n· ( ① ) 상태 → 종료 상태\n\n③에 들어갈 알맞은 말은?", answers: ["입출력 또는 이벤트 완료", "입출력 완료", "이벤트 완료", "입출력/이벤트 완료", "wake up", "wakeup", "깨움", "i/o or event completion"], displayAnswer: "입출력 또는 이벤트 완료", explanation: "③ = 입출력 또는 이벤트 완료: 대기하던 입출력이나 이벤트가 끝나 준비 상태로 돌아가는 전이." },
  { category: "프로세스 생성 계산", question: "한 프로세스가 fork()를 연속으로 5번 호출한다(모든 프로세스가 매번 호출). 최초 프로세스를 포함한 전체 프로세스의 수는?", answers: ["32", "32개"], displayAnswer: "32개", explanation: "fork() 한 번마다 프로세스 수가 2배가 되므로 2^5 = 32개이다." },
];
