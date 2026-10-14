// 운영체제_2장_하드웨어_기출스타일_1회.jsx
const META = { group: "운영체제", unit: "2장", title: "컴퓨터 하드웨어 기출 스타일 1회", topic: "작년 기출 형식(단답·OX·계산형)을 본뜬 생성 문제" };

const QUESTIONS = [
  { category: "입출력", question: "DMA 방식을 확장한, 입출력 전용 처리기가 제어하는 방식은?", answers: ["I/O Processor", "IO Processor", "입출력 프로세서", "I/O 프로세서"], displayAnswer: "I/O Processor 입출력", explanation: "CPU 부담을 더 줄인다." },
  { category: "버스", question: "데이터를 실어 나르는 버스의 폭(데이터선 수)은 CPU가 한 번에 전송할 수 있는 무엇과 연관되는가?", answers: ["비트 수", "데이터 비트 수", "전송 비트 수", "bit 수"], displayAnswer: "데이터 비트 수", explanation: "데이터 버스는 양방향이다." },
  { category: "캐시", question: "컴퓨터 처리 속도 향상을 위해 CPU와 주기억장치 사이에 두는 소형 고속 버퍼 메모리는?", answers: ["캐시 메모리", "캐시", "cache memory", "cache"], displayAnswer: "캐시 메모리", explanation: "보통 SRAM으로 설계된다." },
  { category: "보조기억장치", question: "자기 방식의 저장장치로 회전하는 원판에 데이터를 저장하는 보조기억장치는?", answers: ["하드디스크", "HDD", "hard disk", "hard disk drive", "하드 디스크"], displayAnswer: "하드디스크(HDD)", explanation: "SSD는 반도체 방식이다." },
  { category: "ALU", question: "ALU는 장치들에 제어 신호를 내보내는 장치이다.", answer: false, explanation: "그것은 제어장치의 역할이다." },
  { category: "ALU", question: "ALU는 덧셈, 뺄셈 같은 산술 연산과 AND, OR, NOT 같은 논리 연산을 수행한다.", answer: true, explanation: "병렬 가감산기, 보수기 등으로 구성된다." },
  { category: "보조기억장치", question: "보조기억장치는 주기억장치보다 용량이 크고 가격이 낮으며 비휘발성이지만 속도는 느리다.", answer: true, explanation: "HDD, SSD 등이 있다." },
  { category: "캐시 매핑", question: "연관 매핑은 직접 매핑보다 탐색이 항상 빠르다.", answer: false, explanation: "탐색 비용이 더 크다." },
  { category: "캐시 계산", question: "캐시 적중률이 85%이고, 캐시 적중 시 접근 시간이 10ns, 캐시 실패 시 주기억장치 접근 시간이 200ns일 때 평균 기억장치 접근 시간은 몇 ns인가? (평균 = 적중률 × 캐시 시간 + 실패율 × 주기억장치 시간, 숫자만)", answers: ["38.5ns", "38.5 ns", "38.5"], displayAnswer: "38.5ns", explanation: "평균 = 0.85×10 + 0.15×200 = 38.5ns. 적중률이 높을수록 평균 접근 시간이 캐시 시간에 가까워진다." },
  { category: "캐시 매핑 계산", question: "주소가 24비트이고, 직접 매핑 캐시의 블록 크기가 2^4바이트, 캐시 블록 수가 2^8개일 때 태그 비트 수는? (주소 = 태그 + 인덱스 + 오프셋, 숫자만)", answers: ["12", "12비트", "12 비트", "12bit", "12 bit", "12bits", "12 bits"], displayAnswer: "12비트", explanation: "오프셋 = 4비트(블록 내 위치), 인덱스 = 8비트(캐시 블록 선택), 태그 = 24−8−4 = 12비트." },
  { category: "캐시 계산", question: "CPU가 기억장치를 50번 접근했고 그중 45번은 캐시에서 데이터를 찾았다. 캐시 적중률은? (소수 또는 %)", answers: ["0.9", "0.90", "90%", "90 %", "90", "90퍼센트"], displayAnswer: "90%", explanation: "적중률 = 적중 횟수 / 전체 접근 횟수 = 45/50 = 0.9 (90%)." },
];
