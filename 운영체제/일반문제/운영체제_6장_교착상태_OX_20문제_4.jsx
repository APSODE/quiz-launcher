// 운영체제_6장_교착상태_OX_20문제_4.jsx
const META = { group: "운영체제", unit: "6장", title: "교착상태 OX 20문제 (4)", topic: "교착상태 개념 · 무시 · 예방 · 은행가 알고리즘" };

const OX_QUESTIONS = [
  { category: "교착상태 개념", question: "교착상태는 프로세스가 CPU를 오래 사용해서 다른 프로세스가 실행되지 못하는 상황이다.", answer: false, explanation: "그것은 기아 또는 독점 문제이다. 교착은 서로의 자원을 기다리는 상황이다." },
  { category: "자원 할당 그래프", question: "자원 할당 그래프에서 프로세스는 원, 자원은 사각형으로 나타내며 간선으로 할당과 요청을 표시한다.", answer: true, explanation: "자원 안의 점은 자원 인스턴스를 나타낸다." },
  { category: "탐지와 복구", question: "교착상태가 탐지되면 관련 프로세스를 종료하거나 자원을 선점하는 방식으로 복구한다.", answer: true, explanation: "복구 비용을 고려해 희생자를 선택한다." },
  { category: "필요조건", question: "상호 배제 조건은 한 번에 하나의 프로세스만 자원을 사용할 수 있다는 조건이다.", answer: true, explanation: "프린터처럼 공유할 수 없는 자원에서 나타난다." },
  { category: "필요조건", question: "점유와 대기 조건은 이미 자원을 가진 프로세스가 다른 자원을 추가로 요청하며 기다리는 상황을 뜻한다.", answer: true, explanation: "가진 자원을 놓지 않은 채 기다린다." },
  { category: "예방", question: "교착상태 예방은 교착상태가 발생한 뒤에 프로세스를 종료하여 해결하는 방법이다.", answer: false, explanation: "그것은 탐지 및 복구이다." },
  { category: "회피", question: "안전 순서가 하나라도 존재하지 않으면 안전 상태이다.", answer: false, explanation: "안전 순서가 하나라도 존재해야 안전 상태이다." },
  { category: "필요조건", question: "상호 배제 조건은 자원을 여러 프로세스가 동시에 사용할 수 있다는 조건이다.", answer: false, explanation: "한 번에 하나의 프로세스만 사용할 수 있다는 조건이다." },
  { category: "무시", question: "일부 범용 운영체제는 교착상태가 드물게 발생한다고 보고 별도의 처리를 하지 않는 방법(타조 알고리즘)을 사용한다.", answer: true, explanation: "예방·회피 비용이 더 크다고 판단하는 경우이다." },
  { category: "자원 할당 그래프", question: "각 자원이 인스턴스 하나뿐인 경우 자원 할당 그래프에 사이클이 있으면 교착상태가 발생한 것이다.", answer: true, explanation: "인스턴스가 여러 개일 때는 사이클이 있어도 교착이 아닐 수 있다." },
  { category: "교착상태 개념", question: "교착상태에 빠진 프로세스들은 모두 대기 상태에 있으며 스스로 자원을 내놓지 않는다.", answer: true, explanation: "서로가 서로를 기다리는 순환 구조가 만들어져 있다." },
  { category: "회피", question: "안전 상태에서는 교착상태가 발생할 가능성이 있다.", answer: false, explanation: "안전 상태에서는 교착상태가 발생하지 않는다." },
  { category: "필요조건", question: "순환 대기는 프로세스들이 서로 다른 자원을 기다리지 않고 같은 자원을 동시에 사용하는 상황이다.", answer: false, explanation: "원형으로 서로의 자원을 기다리는 상황이다." },
  { category: "탐지와 복구", question: "프로세스를 하나씩 종료하며 교착상태가 풀리는지 확인하는 복구 방법은 모두 한꺼번에 종료하는 방법보다 비용이 적을 수 있다.", answer: true, explanation: "대신 매번 탐지를 다시 수행해야 하는 오버헤드가 있다." },
  { category: "필요조건", question: "비선점 조건은 프로세스가 가진 자원을 운영체제나 다른 프로세스가 강제로 빼앗을 수 없다는 조건이다.", answer: true, explanation: "자원은 사용 후 스스로 반납해야 한다." },
  { category: "탐지와 복구", question: "자원 선점으로 복구할 때는 희생된 프로세스를 롤백할 필요가 없다.", answer: false, explanation: "일관된 상태로 되돌리기 위해 롤백이 필요하다." },
  { category: "회피", question: "불안전 상태이면 반드시 교착상태가 이미 발생한 것이다.", answer: false, explanation: "불안전 상태는 교착 가능성이 있는 상태이지 이미 발생한 것은 아니다." },
  { category: "자원 할당 그래프", question: "자원 할당 그래프에 사이클이 없으면 교착상태가 발생하지 않은 것이다.", answer: true, explanation: "사이클은 교착의 필요조건이다." },
  { category: "은행가 알고리즘", question: "은행가 알고리즘에서 Need는 Allocation에서 Max를 뺀 값이다.", answer: false, explanation: "Need = Max − Allocation이다." },
  { category: "예방", question: "점유와 대기를 제거하기 위해 프로세스가 자원을 필요할 때마다 하나씩 요청하도록 하면 된다.", answer: false, explanation: "오히려 점유와 대기가 생긴다. 필요한 자원을 한꺼번에 요청하게 해야 한다." },
];
