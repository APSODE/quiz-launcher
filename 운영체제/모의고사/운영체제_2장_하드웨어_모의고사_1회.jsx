// 운영체제_2장_하드웨어_모의고사_1회.jsx
const META = { group: "운영체제", unit: "2장", title: "컴퓨터 하드웨어 모의고사 1회", topic: "객관식 6 · OX 3 · 단답형 3 · 계산형 3" };

const QUESTIONS = [
  { category: "캐시 매핑", question: "주기억장치 블록이 캐시의 고정된 슬롯에만 들어가는 방식은?", choices: ["연관 매핑", "동적 매핑", "집합 연관 매핑", "직접 매핑"], answer: 3, explanation: "직접 매핑은 슬롯이 고정이라 교체 알고리즘이 필요 없다." },
  { category: "버스", question: "다음 중 단방향으로 전송하는 버스는?", choices: ["제어 버스", "데이터 버스", "주소 버스", "내부 버스 전체"], answer: 2, explanation: "주소 버스는 단방향, 데이터·제어 버스는 양방향이다." },
  { category: "RAM", question: "주기적인 재충전이 필요한 메모리는?", choices: ["캐시 메모리", "DRAM", "ROM", "SRAM"], answer: 1, explanation: "DRAM은 캐패시터 방전 때문에 재충전이 필요하다." },
  { category: "교체 알고리즘", question: "교체 알고리즘이 반드시 필요한 캐시 매핑 방식은?", choices: ["직접 매핑", "없음", "연관 매핑", "모두 불필요"], answer: 2, explanation: "슬롯이 유동적인 연관·집합 연관 매핑에서 필요하다." },
  { category: "입출력", question: "데이터 전송을 CPU 대신 전용 제어기가 수행하는 방식은?", choices: ["인터럽트 폴링", "프로그램 입출력", "폴링", "DMA"], answer: 3, explanation: "DMA는 CPU 개입 없이 직접 전송한다." },
  { category: "레지스터", question: "다음 중 다음 명령어의 주소를 저장하는 레지스터는?", choices: ["프로그램 카운터", "메모리 버퍼 레지스터", "명령어 레지스터", "스택 포인터"], answer: 0, explanation: "프로그램 카운터는 다음 실행할 명령어의 주소를 가리킨다." },
  { category: "주기억장치", question: "주기억장치는 CPU가 직접 접근하며 실행 중인 프로그램의 명령어와 데이터를 저장한다.", answer: true, explanation: "보조기억장치는 필요한 것을 주기억장치로 전달한다." },
  { category: "레지스터", question: "프로그램 카운터는 다음에 실행할 명령어의 주소를 가리킨다.", answer: true, explanation: "명령어 인출 후 값이 갱신된다." },
  { category: "RAM", question: "DRAM은 플립플롭으로 구성되며 캐시에 주로 쓰인다.", answer: false, explanation: "플립플롭은 SRAM이다." },
  { category: "CPU 레지스터", question: "연산 결과가 0인지 여부를 나타내는 상태 레지스터의 플래그는 무엇인가?", answers: ["제로 플래그", "zero flag", "Z 플래그", "zero", "영 플래그", "0 플래그"], displayAnswer: "제로 플래그(Zero Flag)", explanation: "상태 레지스터에는 제로, 캐리, 오버플로, 부호 플래그 등이 있다." },
  { category: "플래그", question: "연산 결과가 음수일 때 참이 되는 플래그는?", answers: ["네거티브 플래그", "사인 플래그", "부호 플래그", "negative flag", "sign flag"], displayAnswer: "네거티브(사인) 플래그", explanation: "제로 플래그는 결과가 0일 때 참이다." },
  { category: "레지스터", question: "실행 중 피연산자 주소를 계산할 때 쓰는 레지스터는?", answers: ["색인 레지스터", "인덱스 레지스터", "index register", "색인레지스터"], displayAnswer: "색인 레지스터", explanation: "특수 목적 레지스터의 하나이다." },
  { category: "캐시 계산", question: "캐시 적중률이 90%이고, 캐시 적중 시 접근 시간이 2ns, 캐시 실패 시 주기억장치 접근 시간이 50ns일 때 평균 기억장치 접근 시간은 몇 ns인가? (평균 = 적중률 × 캐시 시간 + 실패율 × 주기억장치 시간, 숫자만)", answers: ["6.8ns", "6.8 ns", "6.8"], displayAnswer: "6.8ns", explanation: "평균 = 0.9×2 + 0.1×50 = 6.8ns. 적중률이 높을수록 평균 접근 시간이 캐시 시간에 가까워진다." },
  { category: "캐시 계산", question: "CPU가 기억장치를 200번 접근했고 그중 170번은 캐시에서 데이터를 찾았다. 캐시 적중률은? (소수 또는 %)", answers: ["0.85", "85%", "85 %", "85", "85퍼센트"], displayAnswer: "85%", explanation: "적중률 = 적중 횟수 / 전체 접근 횟수 = 170/200 = 0.85 (85%)." },
  { category: "캐시 계산", question: "캐시 접근 시간이 5ns, 주기억장치 접근 시간이 100ns이고 평균 기억장치 접근 시간이 24ns라면 캐시 적중률은? (평균 = 적중률 × 캐시 시간 + 실패율 × 주기억장치 시간, 소수 또는 %)", answers: ["0.8", "0.80", "80%", "80 %", "80", "80퍼센트"], displayAnswer: "80%", explanation: "h×5 + (1−h)×100 = 24 에서 h = (100−24)/(100−5) = 0.8 (80%)." },
];
