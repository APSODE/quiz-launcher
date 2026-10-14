// 운영체제_2장_하드웨어_단답형_15문제_3.jsx
const META = { group: "운영체제", unit: "2장", title: "컴퓨터 하드웨어 단답형 15문제 (3)", topic: "캐시 · 입출력 · RAM · 기억장치" };

const SA_QUESTIONS = [
  { category: "캐시", question: "캐시 접근 횟수 중 적중이 차지하는 비율을 무엇이라 하는가?", answers: ["적중률", "히트율", "hit ratio", "hit rate"], displayAnswer: "적중률(Hit Ratio)", explanation: "적중 수 / (적중 수 + 실패 수)이다." },
  { category: "입출력", question: "모니터, 프린터, 스피커처럼 처리 결과를 사용자가 확인할 수 있는 형태로 내보내는 장치를 통틀어 무엇이라 하는가?", answers: ["출력장치", "출력 장치", "output device"], displayAnswer: "출력장치", explanation: "입력장치와 대비된다." },
  { category: "RAM", question: "플립플롭을 이용해 0과 1을 저장하며 재충전이 필요 없는 RAM은?", answers: ["SRAM", "sram", "정적 램", "static ram"], displayAnswer: "SRAM", explanation: "캐시에 주로 쓴다." },
  { category: "기억장치", question: "기억장치 계층구조에서 레지스터 다음으로 빠른 계층은?", answers: ["캐시", "캐시 메모리", "cache"], displayAnswer: "캐시", explanation: "그 다음이 주기억장치, 보조기억장치이다." },
  { category: "교체 알고리즘", question: "가장 먼저 들어온 블록을 가장 먼저 교체하는 방식의 영문 약자는?", answers: ["FIFO", "fifo", "first in first out"], displayAnswer: "FIFO", explanation: "선입선출 방식이다." },
  { category: "캐시", question: "캐시 접근 시간 4ns, 주기억장치 접근 시간 40ns, 적중률 0.95일 때 평균 접근 시간은 몇 ns인가? (숫자만)", answers: ["6", "6ns", "6 ns", "6.0"], displayAnswer: "6ns", explanation: "T평균 = 4 + 0.05 × 40 = 6ns" },
  { category: "메모리 분할", question: "프로그램 크기에 맞춰 메모리를 나누는 방식은?", answers: ["가변 분할", "동적 분할", "variable partitioning", "동적 가변 분할", "가변분할"], displayAnswer: "가변 분할", explanation: "외부 단편화가 발생할 수 있다." },
  { category: "RAM", question: "캐패시터에 전하를 저장하여 0과 1을 구분하며 재충전이 필요한 RAM은?", answers: ["DRAM", "dram", "동적 램", "dynamic ram"], displayAnswer: "DRAM", explanation: "주기억장치로 주로 쓰인다." },
  { category: "버스", question: "읽기 신호, 쓰기 신호, 인터럽트 신호를 전달하는 버스는?", answers: ["제어 버스", "제어버스", "control bus"], displayAnswer: "제어 버스", explanation: "양방향 버스이다." },
  { category: "보조기억장치", question: "반도체 소자를 이용한 저장장치로 기계적 구동부가 없는 보조기억장치는?", answers: ["SSD", "ssd", "solid state drive"], displayAnswer: "SSD", explanation: "플래시 메모리를 사용한다." },
  { category: "CPU", question: "명령어를 해독하고 각 장치에 제어 신호를 보내는 CPU 구성요소는?", answers: ["제어장치", "제어 장치", "CU", "control unit"], displayAnswer: "제어장치", explanation: "연산은 ALU가 담당한다." },
  { category: "쓰기 정책", question: "캐시와 주기억장치에 동시에 쓰는 쓰기 정책은?", answers: ["Write Through", "write through", "라이트 스루", "즉시 쓰기", "즉시쓰기"], displayAnswer: "Write Through(즉시 쓰기)", explanation: "일관성이 높지만 쓰기가 느릴 수 있다." },
  { category: "CPU", question: "CPU 내부에서 자료를 임시 보관하는 매우 빠른 기억 장소는?", answers: ["레지스터", "register"], displayAnswer: "레지스터", explanation: "기억장치 계층 중 가장 빠르다." },
  { category: "입출력", question: "입출력 방식 중 장치가 작업을 마치면 인터럽트로 CPU에 알리는 방식은?", answers: ["인터럽트 구동 입출력", "interrupt driven i/o", "interrupt-driven i/o", "인터럽트 입출력", "인터럽트 방식"], displayAnswer: "인터럽트 구동 입출력", explanation: "CPU가 계속 폴링하지 않아도 된다." },
  { category: "메모리 분할", question: "고정된 크기로 메모리를 나누는 방식은?", answers: ["고정 분할", "fixed partitioning", "고정분할"], displayAnswer: "고정 분할", explanation: "내부 단편화가 발생할 수 있다." },
];
