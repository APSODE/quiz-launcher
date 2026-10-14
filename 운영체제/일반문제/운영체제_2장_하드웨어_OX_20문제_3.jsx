// 운영체제_2장_하드웨어_OX_20문제_3.jsx
const META = { group: "운영체제", unit: "2장", title: "컴퓨터 하드웨어 OX 20문제 (3)", topic: "RAM · ROM · 레지스터 · 메모리 분할" };

const OX_QUESTIONS = [
  { category: "캐시", question: "참조의 지역성은 캐시 효과와 무관한 개념이다.", answer: false, explanation: "캐시가 효과적인 이유가 지역성이다." },
  { category: "쓰기 정책", question: "Write Back은 쓰기 때마다 캐시와 주기억장치에 동시에 쓴다.", answer: false, explanation: "그것은 Write Through이다." },
  { category: "버스", question: "주소 버스와 데이터 버스는 모두 양방향이다.", answer: false, explanation: "주소 버스는 단방향이다." },
  { category: "입출력", question: "DMA는 CPU 개입 없이 입출력장치와 주기억장치 사이에 데이터를 직접 전송하는 방식이다.", answer: true, explanation: "시작과 종료 때만 CPU가 관여한다." },
  { category: "버스", question: "제어 버스는 읽기·쓰기 신호와 인터럽트 신호 등을 전달한다.", answer: true, explanation: "CPU가 장치 동작을 제어하는 데 쓴다." },
  { category: "RAM", question: "DRAM은 시간이 지나면 전하가 방전되므로 주기적인 재충전이 필요하다.", answer: true, explanation: "SRAM은 재충전이 필요 없다." },
  { category: "ROM", question: "ROM은 전원이 꺼져도 내용이 유지되는 비휘발성 메모리이다.", answer: true, explanation: "펌웨어 저장에 쓰인다." },
  { category: "레지스터", question: "프로그램 카운터는 현재 실행 중인 명령어 자체를 저장한다.", answer: false, explanation: "현재 명령어는 명령어 레지스터가 저장하고 PC는 다음 주소를 가리킨다." },
  { category: "보조기억장치", question: "보조기억장치는 주기억장치보다 빠르지만 용량이 작다.", answer: false, explanation: "느리지만 용량이 크다." },
  { category: "버스", question: "주소 버스는 단방향이고 데이터 버스는 양방향이다.", answer: true, explanation: "주소는 CPU가 지정하는 방향으로만 전달된다." },
  { category: "RAM", question: "SRAM은 DRAM보다 빠르지만 집적도와 용량당 가격 면에서는 불리하다.", answer: true, explanation: "그래서 캐시처럼 작고 빠른 곳에 쓴다." },
  { category: "메모리 분할", question: "가변 분할은 내부 단편화가, 고정 분할은 외부 단편화가 발생한다.", answer: false, explanation: "반대로 고정=내부, 가변=외부이다." },
  { category: "레지스터", question: "레지스터는 CPU 내부에 있어 기억장치 중 가장 빠르고 용량이 가장 작다.", answer: true, explanation: "캐시, 주기억장치, 보조기억장치 순으로 느리고 커진다." },
  { category: "캐시", question: "캐시 적중률이 낮아질수록 평균 기억장치 접근 시간은 짧아진다.", answer: false, explanation: "적중률이 낮으면 주기억장치 접근이 늘어 시간이 길어진다." },
  { category: "플래그", question: "제로 플래그는 연산 결과가 음수일 때 참이 된다.", answer: false, explanation: "음수는 네거티브 플래그, 0은 제로 플래그이다." },
  { category: "플래그", question: "네거티브(사인) 플래그는 연산 결과가 음수일 때 참이 된다.", answer: true, explanation: "부호를 판별하는 데 쓰인다." },
  { category: "레지스터", question: "범용 레지스터는 데이터와 주소를 모두 저장할 수 있다.", answer: true, explanation: "데이터 레지스터는 정수 값, 주소 레지스터는 메모리 주소를 저장한다." },
  { category: "주기억장치", question: "보조기억장치는 CPU가 직접 접근하여 명령어를 실행하는 장치이다.", answer: false, explanation: "CPU는 주기억장치에 직접 접근한다." },
  { category: "입출력", question: "메모리 사상 입출력은 입출력 전용 명령어가 많아 CPU 설계가 복잡해진다.", answer: false, explanation: "복잡해지는 쪽은 분리형이다." },
  { category: "캐시 매핑", question: "연관 매핑은 어느 슬롯에든 블록을 둘 수 있어 충돌은 적지만 탐색 비용이 크다.", answer: true, explanation: "교체 알고리즘이 필요하다." },
];
