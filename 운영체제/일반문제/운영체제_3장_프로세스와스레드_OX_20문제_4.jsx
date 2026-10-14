// 운영체제_3장_프로세스와스레드_OX_20문제_4.jsx
const META = { group: "운영체제", unit: "3장", title: "프로세스와 스레드 OX 20문제 (4)", topic: "PCB · 멀티 · 메모리 영역 · 문맥 교환" };

const OX_QUESTIONS = [
  { category: "프로그램과 프로세스", question: "같은 프로그램을 여러 번 실행해도 프로세스는 하나만 만들어진다.", answer: false, explanation: "실행할 때마다 독립된 프로세스가 만들어진다." },
  { category: "문맥 교환", question: "문맥 교환은 시스템에 이득만 주는 작업이므로 빈번할수록 좋다.", answer: false, explanation: "문맥 교환은 순수한 오버헤드이므로 잦으면 성능이 떨어진다." },
  { category: "프로그램과 프로세스", question: "프로그램은 디스크에 저장된 정적인 명령어 집합이고, 프로세스는 메모리에 올라와 실행 중인 동적인 개체이다.", answer: true, explanation: "같은 프로그램이라도 실행될 때마다 별도의 프로세스가 만들어진다." },
  { category: "상태 전이", question: "디스패치는 실행 상태의 프로세스를 준비 상태로 되돌리는 작업이다.", answer: false, explanation: "디스패치는 준비 → 실행 전이이다." },
  { category: "멀티", question: "멀티프로세싱은 둘 이상의 CPU(코어)를 사용하여 여러 작업을 실제로 동시에 병렬 실행하는 방식이다.", answer: true, explanation: "단일 코어에서는 시분할로 동시에 실행되는 것처럼 보이게 한다." },
  { category: "PCB", question: "PCB는 모든 프로세스가 하나를 공유하며 시스템 전체의 프로세스 정보를 담는다.", answer: false, explanation: "프로세스마다 하나씩 따로 존재한다." },
  { category: "프로세스 통신", question: "공유 메모리 방식은 동기화 없이도 항상 안전하게 데이터를 교환할 수 있다.", answer: false, explanation: "접근 순서를 제어하는 동기화가 필요하다." },
  { category: "스케줄러", question: "장기 스케줄러는 어떤 작업을 메모리에 올려 준비 큐에 넣을지 결정하여 멀티프로그래밍 정도를 조절한다.", answer: true, explanation: "작업 스케줄러라고도 한다." },
  { category: "메모리 영역", question: "함수의 지역 변수와 복귀 주소는 힙 영역에 저장된다.", answer: false, explanation: "스택 영역에 저장된다." },
  { category: "프로세스 계층", question: "exec 계열 함수를 호출하면 현재 프로세스의 코드·데이터·스택·힙이 새 프로그램으로 교체된다.", answer: true, explanation: "PID는 그대로 유지된다." },
  { category: "PCB", question: "PCB에는 프로세스의 상태와 레지스터 값이 저장되므로 문맥 교환 시 실행 재개에 필요한 정보로 쓰인다.", answer: true, explanation: "PCB가 없으면 중단된 프로세스를 이어서 실행할 수 없다." },
  { category: "메모리 영역", question: "프로세스의 메모리 영역은 코드, 데이터, 힙, 스택 영역으로 구성된다.", answer: true, explanation: "각 영역은 저장하는 내용과 크기 변화 방식이 다르다." },
  { category: "프로세스 통신", question: "프로세스 간 통신 방식 중 공유 메모리는 여러 프로세스가 같은 메모리 영역을 함께 사용하므로 데이터 교환이 빠르다.", answer: true, explanation: "대신 접근 순서를 제어할 동기화가 필요하다." },
  { category: "문맥 교환", question: "문맥 교환은 실행 중이던 프로세스의 상태를 PCB에 저장하고 다음 프로세스의 상태를 PCB에서 복원하는 작업이다.", answer: true, explanation: "저장과 복원이 모두 이루어져야 한다." },
  { category: "메모리 영역", question: "힙 영역은 실행 중에 동적으로 할당되는 데이터를 저장하며 크기가 실행 중에 변할 수 있다.", answer: true, explanation: "malloc()이나 new로 할당하는 메모리가 힙에 놓인다." },
  { category: "프로그램과 프로세스", question: "하나의 프로그램을 두 번 실행하면 서로 독립된 두 개의 프로세스가 생성된다.", answer: true, explanation: "프로세스는 프로그램의 실행 인스턴스이므로 각각 자신의 PCB와 메모리 영역을 가진다." },
  { category: "상태 전이", question: "실행 상태에서 타임 퀀텀이 끝나면 프로세스는 대기 상태로 전이된다.", answer: false, explanation: "타임아웃은 실행 → 준비 전이이다." },
  { category: "PCB", question: "PCB에는 프로세스의 힙에 동적 할당된 데이터 전체가 그대로 저장된다.", answer: false, explanation: "PCB에는 상태, PID, 레지스터 정보 같은 관리 정보가 저장되며 힙 데이터 자체는 메모리 영역에 있다." },
  { category: "스레드", question: "스레드 간 문맥 교환은 프로세스 간 문맥 교환보다 항상 비용이 크다.", answer: false, explanation: "공유 영역이 많아 일반적으로 비용이 더 적다." },
  { category: "스레드", question: "멀티스레딩에서는 한 스레드가 블록되면 같은 프로세스의 모든 스레드가 반드시 함께 멈춘다.", answer: false, explanation: "스레드가 블록되어도 다른 스레드는 계속 실행될 수 있다(커널이 스레드를 관리하는 경우)." },
];
