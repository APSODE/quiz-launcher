// 운영체제_2장_하드웨어_단답형_15문제_4.jsx
const META = { group: "운영체제", unit: "2장", title: "컴퓨터 하드웨어 단답형 15문제 (4)", topic: "ROM · 캐시 · 캐시 매핑 · 플래그" };

const SA_QUESTIONS = [
  { category: "ROM", question: "한 번만 프로그램할 수 있는 ROM의 영문 약자는?", answers: ["PROM", "prom", "Programmable ROM"], displayAnswer: "PROM", explanation: "EPROM은 자외선으로 지울 수 있다." },
  { category: "캐시", question: "CPU가 요청한 데이터가 캐시에 없는 경우를 무엇이라 하는가?", answers: ["실패", "캐시 실패", "미스", "miss", "cache miss"], displayAnswer: "실패(Miss)", explanation: "이때 주기억장치에서 블록을 가져온다." },
  { category: "캐시 매핑", question: "주기억장치 블록과 캐시 블록 사이의 대응 관계를 정하는 처리를 무엇이라 하는가?", answers: ["매핑", "사상", "mapping", "캐시 매핑", "캐시 사상"], displayAnswer: "매핑(사상)", explanation: "직접, 연관, 집합 연관 방식이 있다." },
  { category: "플래그", question: "부호 있는 숫자의 연산 결과가 표현 범위를 넘어섰을 때 참이 되는 플래그는?", answers: ["오버플로 플래그", "오버플로우 플래그", "overflow flag", "오버플로"], displayAnswer: "오버플로 플래그", explanation: "부호 없는 숫자의 경우는 캐리 플래그이다." },
  { category: "캐시", question: "연관 매핑과 집합 연관 매핑에서 새 블록을 넣을 슬롯을 정하기 위해 필요한 알고리즘은?", answers: ["교체 알고리즘", "캐시 교체 알고리즘", "replacement algorithm"], displayAnswer: "교체 알고리즘", explanation: "직접 매핑은 필요 없다." },
  { category: "명령어 사이클", question: "명령어 사이클의 첫 단계로 명령어를 메모리에서 가져오는 단계는?", answers: ["인출", "명령어 인출", "fetch", "instruction fetch", "IF"], displayAnswer: "명령어 인출(IF)", explanation: "이후 해독, 실행, 저장 단계가 이어진다." },
  { category: "멀티", question: "여러 개의 CPU로 동시에 작업을 처리하는 방식은?", answers: ["멀티 프로세싱", "멀티프로세싱", "multiprocessing", "다중 처리"], displayAnswer: "멀티 프로세싱", explanation: "1개 CPU를 시분할하는 방식은 멀티 태스킹이다." },
  { category: "입출력", question: "아날로그와 디지털 신호를 상호 변환하며 전화망으로 데이터를 전송하는 통신장치는?", answers: ["모뎀", "modem"], displayAnswer: "모뎀", explanation: "랜카드는 근거리 통신망 연결 장치이다." },
  { category: "입출력", question: "컴퓨터를 근거리 통신망(LAN)에 연결해 주는 장치는?", answers: ["랜카드", "LAN 카드", "NIC", "네트워크 인터페이스 카드", "랜 카드"], displayAnswer: "랜카드(NIC)", explanation: "통신장치의 하나이다." },
  { category: "레지스터", question: "스택의 최상위 위치를 가리키는 레지스터의 영문 약자는?", answers: ["SP", "stack pointer", "스택 포인터"], displayAnswer: "SP(스택 포인터)", explanation: "특수 목적 레지스터이다." },
  { category: "레지스터", question: "연산 결과의 상태를 나타내는 비트들이 모인 레지스터는?", answers: ["상태 레지스터", "프로그램 상태 레지스터", "플래그 레지스터", "status register", "flag register", "프로그램 상태 워드"], displayAnswer: "상태 레지스터", explanation: "제로, 캐리, 오버플로 플래그 등이 있다." },
  { category: "기억장치", question: "CPU가 직접 접근하며 실행 중인 프로그램의 명령어와 데이터를 저장하는 기억장치는?", answers: ["주기억장치", "주기억 장치", "main memory", "메인 메모리"], displayAnswer: "주기억장치", explanation: "RAM과 ROM으로 구성된다." },
  { category: "입출력", question: "입출력장치마다 고유한 주소를 지정하고 별도의 명령어를 사용하는 주소 지정 방식은?", answers: ["분리형 입출력", "isolated i/o", "isolated io", "포트 사상 입출력", "분리형 I/O"], displayAnswer: "분리형 입출력", explanation: "메모리 사상 입출력과 대비된다." },
  { category: "캐시 매핑", question: "캐시 엔트리에서 캐시 블록의 고유한 식별값 역할을 하는 비트는?", answers: ["태그 비트", "태그", "tag", "tag bit"], displayAnswer: "태그 비트", explanation: "유효 비트는 데이터 유효성을 판별한다." },
  { category: "입출력", question: "키보드, 마우스, 스캐너처럼 정보를 컴퓨터에 넣는 장치를 통틀어 무엇이라 하는가?", answers: ["입력장치", "입력 장치", "input device"], displayAnswer: "입력장치", explanation: "출력장치와 대비된다." },
];
