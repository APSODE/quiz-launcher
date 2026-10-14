// 운영체제_2장_하드웨어_기출스타일_2회.jsx
const META = { group: "운영체제", unit: "2장", title: "컴퓨터 하드웨어 기출 스타일 2회", topic: "작년 기출 형식(단답·OX·계산형)을 본뜬 생성 문제" };

const QUESTIONS = [
  { category: "CPU", question: "CPU가 명령어를 하나씩 인출하여 실행할 때, 다음 명령어의 위치를 알려 주는 레지스터는?", answers: ["프로그램 카운터", "PC", "program counter"], displayAnswer: "프로그램 카운터(PC)", explanation: "특수 목적 레지스터이다." },
  { category: "캐시", question: "캐시 접근 시간이 5ns, 주기억장치 접근 시간이 50ns, 적중률이 0.8일 때 평균 기억장치 접근 시간은 몇 ns인가? (숫자만)", answers: ["15", "15ns", "15 ns", "15.0"], displayAnswer: "15ns", explanation: "T평균 = 5 + (1 − 0.8) × 50 = 15ns" },
  { category: "교체 알고리즘", question: "가장 오랫동안 사용되지 않은 블록을 교체하는 방식의 영문 약자는?", answers: ["LRU", "lru", "Least Recently Used"], displayAnswer: "LRU", explanation: "최소 최근 사용 방식이다." },
  { category: "입출력", question: "입출력 방식 중 CPU가 장치 상태를 반복해서 확인하는 방식은?", answers: ["프로그램 입출력", "programmed i/o", "programmed io", "프로그램 I/O"], displayAnswer: "프로그램 입출력", explanation: "폴링을 사용한다." },
  { category: "레지스터", question: "명령어 레지스터는 현재 해독·실행 중인 명령어를 저장한다.", answer: true, explanation: "제어장치가 이를 해독한다." },
  { category: "버스", question: "제어 버스는 주소 정보를 실어 나르는 버스이다.", answer: false, explanation: "그것은 주소 버스이다." },
  { category: "입출력", question: "인터럽트 구동 입출력에서는 장치가 작업을 마치면 인터럽트로 CPU에 알린다.", answer: true, explanation: "CPU는 그동안 다른 일을 할 수 있다." },
  { category: "ROM", question: "ROM에 저장된 내용은 전원이 꺼지면 모두 사라진다.", answer: false, explanation: "ROM은 비휘발성이다." },
  { category: "캐시 계산", question: "캐시 접근 시간이 2ns, 주기억장치 접근 시간이 40ns이고 평균 기억장치 접근 시간이 3.9ns라면 캐시 적중률은? (평균 = 적중률 × 캐시 시간 + 실패율 × 주기억장치 시간, 소수 또는 %)", answers: ["0.95", "95%", "95 %", "95", "95퍼센트"], displayAnswer: "95%", explanation: "h×2 + (1−h)×40 = 3.9 에서 h = (40−3.9)/(40−2) = 0.95 (95%)." },
  { category: "주소 계산", question: "주소 버스가 20비트이면 지정할 수 있는 서로 다른 주소의 최대 개수는? (숫자만)", answers: ["1048576", "1,048,576", "2^20", "2의 20승", "2의20승", "1048576개", "1,048,576개"], displayAnswer: "1,048,576개 (2^20)", explanation: "n비트로 표현할 수 있는 경우의 수는 2^n이므로 2^20 = 1,048,576개이다." },
  { category: "캐시 계산", question: "캐시 적중률이 90%이고, 캐시 적중 시 접근 시간이 5ns, 캐시 실패 시 주기억장치 접근 시간이 100ns일 때 평균 기억장치 접근 시간은 몇 ns인가? (평균 = 적중률 × 캐시 시간 + 실패율 × 주기억장치 시간, 숫자만)", answers: ["14.5ns", "14.5 ns", "14.5"], displayAnswer: "14.5ns", explanation: "평균 = 0.9×5 + 0.1×100 = 14.5ns. 적중률이 높을수록 평균 접근 시간이 캐시 시간에 가까워진다." },
];
