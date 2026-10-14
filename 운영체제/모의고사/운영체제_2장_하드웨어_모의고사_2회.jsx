// 운영체제_2장_하드웨어_모의고사_2회.jsx
const META = { group: "운영체제", unit: "2장", title: "컴퓨터 하드웨어 모의고사 2회", topic: "객관식 6 · OX 3 · 단답형 3 · 계산형 3" };

const QUESTIONS = [
  { category: "캐시", question: "캐시 메모리의 효과를 뒷받침하는 원리는?", choices: ["페이징", "에이징", "참조의 지역성", "문맥 교환"], answer: 2, explanation: "짧은 시간 동안 접근하는 영역이 제한되는 성질이다." },
  { category: "입출력", question: "CPU가 장치 상태를 반복해서 확인하는 입출력 방식은?", choices: ["I/O Processor", "인터럽트 구동 입출력", "DMA", "프로그램 입출력"], answer: 3, explanation: "프로그램 입출력은 폴링을 사용한다." },
  { category: "기억장치", question: "속도가 빠른 순서가 올바른 것은?", choices: ["캐시 > 레지스터 > 주기억장치 > 보조기억장치", "보조기억장치 > 주기억장치 > 캐시 > 레지스터", "레지스터 > 캐시 > 주기억장치 > 보조기억장치", "주기억장치 > 캐시 > 레지스터 > 보조기억장치"], answer: 2, explanation: "레지스터가 가장 빠르고 보조기억장치가 가장 느리다." },
  { category: "쓰기 정책", question: "캐시에만 먼저 쓰고 나중에 주기억장치에 반영하는 정책은?", choices: ["Write Around", "Write Back", "Write Through", "Write Once"], answer: 1, explanation: "Write Back은 나중 쓰기이다." },
  { category: "메모리 분할", question: "가변 분할 방식에서 주로 발생하는 단편화는?", choices: ["외부 단편화", "내외부 모두 없음", "없음", "내부 단편화"], answer: 0, explanation: "고정 분할은 내부 단편화이다." },
  { category: "ROM", question: "자외선으로 지운 뒤 다시 프로그램할 수 있는 ROM은?", choices: ["PROM", "EEPROM", "Mask ROM", "EPROM"], answer: 3, explanation: "EEPROM은 전기적으로 지운다." },
  { category: "명령어 사이클", question: "명령어 사이클은 인출, 해독, 실행, 저장 단계 등으로 이루어진다.", answer: true, explanation: "피연산자 인출 단계를 포함하면 5단계가 된다." },
  { category: "입출력", question: "DMA 방식에서는 CPU가 모든 데이터 전송 과정을 직접 처리한다.", answer: false, explanation: "DMA 제어기가 전송을 수행한다." },
  { category: "캐시 매핑", question: "직접 매핑은 임의의 슬롯에 블록을 둘 수 있는 방식이다.", answer: false, explanation: "직접 매핑은 슬롯이 고정이다." },
  { category: "ROM", question: "제조 과정에서 데이터가 기입되어 사용자가 읽기만 할 수 있는 ROM은?", answers: ["마스크 ROM", "마스크롬", "mask rom", "Mask ROM"], displayAnswer: "Mask ROM", explanation: "PROM은 한 번 프로그램할 수 있다." },
  { category: "주기억장치", question: "주기억장치 중 읽기 전용이며 비휘발성인 메모리는?", answers: ["ROM", "rom", "롬"], displayAnswer: "ROM", explanation: "RAM은 읽고 쓸 수 있는 휘발성 메모리이다." },
  { category: "명령어 사이클", question: "인출한 명령어가 어떤 동작인지 해석하는 단계는?", answers: ["해독", "명령어 해독", "decode", "instruction decode", "ID"], displayAnswer: "명령어 해독(ID)", explanation: "해독 뒤에 실행 단계가 온다." },
  { category: "주소 계산", question: "주소 버스가 16비트이면 지정할 수 있는 서로 다른 주소의 최대 개수는? (숫자만)", answers: ["65536", "65,536", "2^16", "2의 16승", "2의16승", "65536개", "65,536개"], displayAnswer: "65,536개 (2^16)", explanation: "n비트로 표현할 수 있는 경우의 수는 2^n이므로 2^16 = 65,536개이다." },
  { category: "캐시 매핑 계산", question: "주소가 32비트이고, 직접 매핑 캐시의 블록 크기가 2^6바이트, 캐시 블록 수가 2^10개일 때 태그 비트 수는? (주소 = 태그 + 인덱스 + 오프셋, 숫자만)", answers: ["16", "16비트", "16 비트", "16bit", "16 bit", "16bits", "16 bits"], displayAnswer: "16비트", explanation: "오프셋 = 6비트(블록 내 위치), 인덱스 = 10비트(캐시 블록 선택), 태그 = 32−10−6 = 16비트." },
  { category: "캐시 계산", question: "캐시 적중률이 95%이고, 캐시 적중 시 접근 시간이 4ns, 캐시 실패 시 주기억장치 접근 시간이 80ns일 때 평균 기억장치 접근 시간은 몇 ns인가? (평균 = 적중률 × 캐시 시간 + 실패율 × 주기억장치 시간, 숫자만)", answers: ["7.8ns", "7.8 ns", "7.8"], displayAnswer: "7.8ns", explanation: "평균 = 0.95×4 + 0.05×80 = 7.8ns. 적중률이 높을수록 평균 접근 시간이 캐시 시간에 가까워진다." },
];
