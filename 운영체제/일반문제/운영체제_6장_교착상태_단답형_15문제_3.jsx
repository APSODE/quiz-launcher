// 운영체제_6장_교착상태_단답형_15문제_3.jsx
const META = { group: "운영체제", unit: "6장", title: "교착상태 단답형 15문제 (3)", topic: "탐지와 복구 · 은행가 알고리즘 · 자원 할당 그래프 · 예방" };

const SA_QUESTIONS = [
  { category: "탐지와 복구", question: "교착상태 복구 방법 중 교착 관련 프로세스를 종료시키는 방법은?", answers: ["프로세스 종료", "프로세스를 종료", "프로세스 강제 종료", "process termination", "종료"], displayAnswer: "프로세스 종료", explanation: "모두 종료하거나 하나씩 종료한다." },
  { category: "탐지와 복구", question: "교착상태 탐지 방법 중 일정 시간 동안 진행이 없으면 교착상태로 간주하는 방법은?", answers: ["타임아웃", "타임 아웃", "timeout", "time out"], displayAnswer: "타임아웃", explanation: "오탐 가능성이 있다." },
  { category: "은행가 알고리즘", question: "은행가 알고리즘에서 프로세스 Pi가 끝까지 실행된 뒤 Available에 더해지는 값은?", answers: ["Allocation", "allocation", "Pi의 Allocation", "할당량", "할당된 자원", "Pi가 가진 자원"], displayAnswer: "Pi의 Allocation", explanation: "Pi가 가졌던 자원이 모두 반납된다." },
  { category: "자원 할당 그래프", question: "자원 할당 그래프에서 자원이 프로세스에 할당되어 있음을 나타내는 간선은?", answers: ["할당 간선", "할당", "assignment edge", "allocation edge", "할당간선"], displayAnswer: "할당 간선", explanation: "자원 → 프로세스 방향이다." },
  { category: "예방", question: "자원을 얻지 못한 프로세스가 이미 가진 자원을 반납하도록 해 제거하는 필요조건은?", answers: ["비선점", "비선점 조건", "no preemption", "non-preemption"], displayAnswer: "비선점", explanation: "작업 손실이 생길 수 있다." },
  { category: "자원 할당 그래프", question: "자원 인스턴스가 하나뿐인 경우 자원 할당 그래프의 사이클은 교착상태의 필요조건인가, 필요충분조건인가?", answers: ["필요충분조건", "필요충분", "필요 충분 조건", "필요충분 조건"], displayAnswer: "필요충분조건", explanation: "사이클이 있으면 교착이고, 교착이면 사이클이 있다." },
  { category: "탐지와 복구", question: "자원 선점 복구에서 같은 프로세스가 계속 희생자로 선택되어 진행하지 못하는 문제는?", answers: ["기아", "기아 현상", "starvation", "아사"], displayAnswer: "기아 현상", explanation: "희생 횟수를 비용에 반영한다." },
  { category: "필요조건", question: "교착상태가 발생하기 위한 필요조건은 모두 몇 가지인가? (숫자만)", answers: ["4", "네", "4개", "네 가지", "네가지"], displayAnswer: "4가지", explanation: "상호 배제, 점유와 대기, 비선점, 순환 대기." },
  { category: "필요조건", question: "교착상태의 필요조건 중 프로세스들이 원형으로 서로가 가진 자원을 기다리는 조건은?", answers: ["순환 대기", "순환대기", "환형 대기", "원형 대기", "circular wait"], displayAnswer: "순환 대기", explanation: "P1→P2→…→Pn→P1 구조이다." },
  { category: "탐지와 복구", question: "자원을 선점당한 프로세스를 이전의 안전한 상태로 되돌리는 작업은?", answers: ["롤백", "rollback", "roll back", "롤 백"], displayAnswer: "롤백(Rollback)", explanation: "일관성을 유지하기 위해 필요하다." },
  { category: "탐지와 복구", question: "교착 관련 프로세스를 전부 한꺼번에 종료하는 복구 방법의 가장 큰 단점은?", answers: ["작업 손실", "작업 손실이 크다", "지금까지의 작업 손실", "계산 낭비", "작업 결과 손실", "비용이 크다"], displayAnswer: "작업 손실", explanation: "이미 진행한 작업이 모두 사라진다." },
  { category: "해결 방법", question: "교착상태 해결 방법 4가지는 예방, 회피, 탐지 및 복구, 그리고 무엇인가? (교착상태를 신경 쓰지 않는 방법)", answers: ["무시", "무시하기", "타조 알고리즘", "ostrich algorithm", "ostrich", "교착상태 무시"], displayAnswer: "무시(타조 알고리즘)", explanation: "범용 OS에서 발생이 드물 때 쓴다." },
  { category: "은행가 알고리즘", question: "은행가 알고리즘에서 한 프로세스가 끝나면 그 프로세스가 가지고 있던 자원은 Available에 어떻게 되는가? (○○된다)", answers: ["반납", "반환", "추가", "더해진다", "회수", "증가"], displayAnswer: "반납(Available에 더해진다)", explanation: "그래서 다음 프로세스가 실행될 수 있다." },
  { category: "필요조건", question: "교착상태의 필요조건 중 자원을 가진 채 다른 자원을 추가로 요청하며 기다리는 조건은?", answers: ["점유와 대기", "점유 대기", "점유와대기", "hold and wait", "hold-and-wait"], displayAnswer: "점유와 대기", explanation: "가진 자원을 놓지 않는다." },
  { category: "예방", question: "순환 대기를 막기 위해 자원마다 부여해야 하는 것은?", answers: ["번호", "순서", "순서 번호", "자원 번호", "우선순서", "순서 번호 부여"], displayAnswer: "순서(번호)", explanation: "번호가 커지는 방향으로만 요청하게 한다." },
];
