// 운영체제_6장_교착상태_OX_20문제_3.jsx
const META = { group: "운영체제", unit: "6장", title: "교착상태 OX 20문제 (3)", topic: "교착상태 개념 · 예방 · 은행가 알고리즘 · 자원 할당 그래프" };

const OX_QUESTIONS = [
  { category: "탐지와 복구", question: "교착상태 복구를 위해 프로세스를 종료하거나 자원을 빼앗는 데에는 작업 손실 같은 비용이 들지 않는다.", answer: false, explanation: "작업 손실, 롤백, 재시작 등의 비용이 따르므로 희생자를 신중하게 선택한다." },
  { category: "예방", question: "교착상태 예방 기법은 자원 이용률이 떨어지고 시스템 처리량이 감소할 수 있다는 단점이 있다.", answer: true, explanation: "제약이 매우 엄격하기 때문이다." },
  { category: "예방", question: "점유와 대기를 제거하려면 프로세스가 필요한 자원을 한꺼번에 모두 할당받고 시작하도록 할 수 있다.", answer: true, explanation: "자원 이용률이 낮아지는 단점이 있다." },
  { category: "탐지와 복구", question: "자원 선점으로 복구할 때는 같은 프로세스만 계속 희생자로 선택되어 기아가 생기지 않도록 주의해야 한다.", answer: true, explanation: "희생 횟수를 비용 요소로 반영한다." },
  { category: "예방", question: "순환 대기를 제거하려면 자원에 번호를 매기고 번호 순서대로만 자원을 요청하게 할 수 있다.", answer: true, explanation: "원형 대기 구조가 만들어지지 않는다." },
  { category: "은행가 알고리즘", question: "은행가 알고리즘은 요청이 오면 안전 여부와 무관하게 자원이 있으면 무조건 승인한다.", answer: false, explanation: "요청을 가정해 안전 상태가 유지될 때만 승인한다." },
  { category: "필요조건", question: "비선점 조건은 자원을 운영체제가 언제든지 강제로 회수할 수 있다는 조건이다.", answer: false, explanation: "강제로 빼앗을 수 없다는 조건이다." },
  { category: "은행가 알고리즘", question: "은행가 알고리즘에서 한 프로세스가 끝나도 할당받은 자원은 반납되지 않는다.", answer: false, explanation: "끝난 프로세스의 자원은 반납되어 Available이 늘어난다." },
  { category: "자원 할당 그래프", question: "자원 할당 그래프에서 자원은 원, 프로세스는 사각형으로 그린다.", answer: false, explanation: "프로세스가 원, 자원이 사각형이다." },
  { category: "교착상태 개념", question: "교착상태는 둘 이상의 프로세스가 서로 상대방이 가진 자원을 기다리며 영원히 진행하지 못하는 상태이다.", answer: true, explanation: "외부 개입 없이는 스스로 해결되지 않는다." },
  { category: "예방", question: "교착상태 예방은 자원 이용률을 높이는 장점만 있고 단점은 없다.", answer: false, explanation: "자원 이용률과 처리량이 낮아질 수 있다." },
  { category: "교착상태 개념", question: "교착상태가 발생하면 관련된 프로세스뿐 아니라 시스템 자원의 활용도도 떨어질 수 있다.", answer: true, explanation: "붙잡힌 자원을 다른 프로세스가 쓰지 못하기 때문이다." },
  { category: "필요조건", question: "순환 대기 조건은 프로세스들이 원형으로 연결되어 각자 다음 프로세스가 가진 자원을 기다리는 상황이다.", answer: true, explanation: "P1→P2→…→Pn→P1 형태이다." },
  { category: "회피", question: "불안전 상태라고 해서 반드시 교착상태가 발생하는 것은 아니지만 교착상태가 발생할 가능성이 있는 상태이다.", answer: true, explanation: "교착 상태는 불안전 상태의 부분집합이다." },
  { category: "자원 할당 그래프", question: "자원 할당 그래프에 사이클이 있어야만 교착상태가 아니다.", answer: false, explanation: "인스턴스가 하나인 경우 사이클이 있으면 교착상태이다." },
  { category: "은행가 알고리즘", question: "은행가 알고리즘에서 Available은 모든 프로세스의 Max를 더한 값이다.", answer: false, explanation: "전체 자원에서 현재 할당된 자원의 합을 뺀 값이다." },
  { category: "필요조건", question: "점유와 대기 조건은 프로세스가 가진 자원을 모두 반납한 뒤 새 자원을 기다리는 조건이다.", answer: false, explanation: "자원을 가진 채로 다른 자원을 기다리는 조건이다." },
  { category: "탐지와 복구", question: "교착상태 탐지는 교착상태 발생을 허용한 뒤 주기적으로 발생 여부를 검사하는 방법이다.", answer: true, explanation: "자원 할당 그래프의 사이클 검사 등을 이용한다." },
  { category: "예방", question: "교착상태 예방은 네 가지 필요조건 중 하나 이상이 성립하지 않도록 미리 막는 방법이다.", answer: true, explanation: "구조적으로 교착상태를 불가능하게 만든다." },
  { category: "탐지와 복구", question: "교착상태 탐지 기법은 교착상태 발생을 사전에 완전히 차단한다.", answer: false, explanation: "발생을 허용한 뒤 검사하는 방법이다." },
];
