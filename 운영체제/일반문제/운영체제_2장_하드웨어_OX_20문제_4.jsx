// 운영체제_2장_하드웨어_OX_20문제_4.jsx
const META = { group: "운영체제", unit: "2장", title: "컴퓨터 하드웨어 OX 20문제 (4)", topic: "CPU · RAM · 교체 알고리즘 · 레지스터" };

const OX_QUESTIONS = [
  { category: "입출력", question: "메모리 사상 입출력은 입출력장치에 주기억장치 주소 일부를 할당하여 일반 메모리 명령으로 제어한다.", answer: true, explanation: "별도 입출력 명령이 필요 없다." },
  { category: "메모리 분할", question: "고정 분할은 내부 단편화를, 가변 분할은 외부 단편화를 일으킬 수 있다.", answer: true, explanation: "단편화는 낭비되는 공간 문제이다." },
  { category: "버스", question: "시스템 버스는 CPU, 주기억장치, 입출력장치 사이에서 주소, 데이터, 제어 신호를 주고받는 통로이다.", answer: true, explanation: "세 종류의 버스로 구성된다." },
  { category: "캐시 매핑", question: "직접 매핑은 구조가 단순하지만 같은 슬롯에 매핑되는 블록끼리 충돌이 잦을 수 있다.", answer: true, explanation: "교체 알고리즘이 필요 없다." },
  { category: "입출력", question: "분리형 입출력은 주기억장치 명령어로 입출력장치를 제어한다.", answer: false, explanation: "별도의 입출력 주소와 명령어를 쓴다." },
  { category: "캐시 매핑", question: "집합 연관 매핑은 직접 매핑과 연관 매핑의 절충 방식이다.", answer: true, explanation: "집합은 고정하고 집합 안에서는 자유롭게 배치한다." },
  { category: "캐시", question: "캐시 적중률이 높을수록 평균 기억장치 접근 시간은 짧아진다.", answer: true, explanation: "실패 때는 주기억장치 접근이 필요하다." },
  { category: "교체 알고리즘", question: "직접 매핑은 캐시 슬롯이 유동적이라 교체 알고리즘이 반드시 필요하다.", answer: false, explanation: "슬롯이 고정이라 필요 없다." },
  { category: "레지스터", question: "메모리 버퍼 레지스터는 접근할 메모리의 주소를 저장한다.", answer: false, explanation: "주소는 MAR, 데이터는 MBR이 저장한다." },
  { category: "플래그", question: "상태 레지스터의 제로 플래그는 연산 결과가 0일 때 참이 된다.", answer: true, explanation: "캐리, 오버플로, 부호 플래그 등이 있다." },
  { category: "입출력", question: "프로그램 입출력에서는 장치가 끝나면 인터럽트로 CPU에 알리므로 CPU가 상태를 확인할 필요가 없다.", answer: false, explanation: "프로그램 입출력은 CPU가 상태를 확인(폴링)한다." },
  { category: "CPU", question: "CPU의 구성요소에는 주기억장치와 보조기억장치가 포함된다.", answer: false, explanation: "기억장치는 CPU 외부에 있다." },
  { category: "RAM", question: "SRAM은 축전기에 전하를 저장하므로 주기적 재충전이 필요하다.", answer: false, explanation: "재충전이 필요한 것은 DRAM이다." },
  { category: "멀티", question: "멀티 태스킹은 N개의 프로세서가 동시에 작업을 처리하는 방식이다.", answer: false, explanation: "그것은 멀티 프로세싱이다." },
  { category: "CPU", question: "연산 처리는 제어장치가, 명령어 해독은 ALU가 담당한다.", answer: false, explanation: "연산은 ALU, 해독과 제어는 제어장치이다." },
  { category: "교체 알고리즘", question: "LFU는 가장 최근에 사용된 블록을 교체한다.", answer: false, explanation: "LFU는 사용 빈도가 가장 낮은 블록이다." },
  { category: "캐시", question: "참조의 지역성 덕분에 작은 캐시로도 높은 적중률을 얻을 수 있다.", answer: true, explanation: "최근 접근한 영역을 다시 접근하는 경향이다." },
  { category: "명령어 사이클", question: "명령어 사이클은 실행, 해독, 인출 순서로 진행된다.", answer: false, explanation: "인출 → 해독 → 실행 순서이다." },
  { category: "CPU", question: "CPU는 명령어를 해석하고 연산을 수행하며 제어장치, 연산장치, 레지스터로 구성된다.", answer: true, explanation: "컴퓨터의 두뇌에 해당한다." },
  { category: "교체 알고리즘", question: "LRU는 가장 오랫동안 사용되지 않은 블록을 교체한다.", answer: true, explanation: "FIFO는 가장 먼저 들어온 블록을 교체한다." },
];
