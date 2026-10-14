// 운영체제_6장_교착상태_단답형_15문제_4.jsx
const META = { group: "운영체제", unit: "6장", title: "교착상태 단답형 15문제 (4)", topic: "필요조건 · 회피 · 은행가 알고리즘 · 예방" };

const SA_QUESTIONS = [
  { category: "필요조건", question: "교착상태의 필요조건 중 프로세스가 가진 자원을 강제로 빼앗을 수 없다는 조건은?", answers: ["비선점", "비선점 조건", "no preemption", "non-preemption"], displayAnswer: "비선점", explanation: "자원은 스스로 반납해야 한다." },
  { category: "회피", question: "교착상태 회피 방식에서 프로세스가 사전에 선언해야 하는 정보는?", answers: ["최대 자원 요구량", "최대 요구량", "최대 자원 요구", "최대 자원 사용량", "Max", "max"], displayAnswer: "최대 자원 요구량", explanation: "은행가 알고리즘의 Max에 해당한다." },
  { category: "은행가 알고리즘", question: "은행가 알고리즘에서 요청을 승인하려면 가정 할당 후의 상태가 어떤 상태여야 하는가?", answers: ["안전 상태", "안전상태", "safe state", "safe"], displayAnswer: "안전 상태", explanation: "불안전 상태이면 거절한다." },
  { category: "회피", question: "안전 상태에서 모든 프로세스가 끝까지 실행될 수 있는 프로세스 실행 순서를 무엇이라 하는가?", answers: ["안전 순서", "안전순서", "safe sequence"], displayAnswer: "안전 순서", explanation: "하나라도 있으면 안전 상태이다." },
  { category: "은행가 알고리즘", question: "은행가 알고리즘에서 현재 시스템에 남아 있어 바로 할당할 수 있는 자원을 무엇이라 하는가?", answers: ["Available", "available", "가용 자원", "가용자원", "가용"], displayAnswer: "Available(가용 자원)", explanation: "전체 자원 − 할당 합계." },
  { category: "예방", question: "네 가지 필요조건 중 하나 이상이 성립하지 않도록 미리 막아 교착상태를 원천 차단하는 방법은?", answers: ["예방", "교착상태 예방", "prevention", "deadlock prevention"], displayAnswer: "교착상태 예방", explanation: "자원 이용률이 낮아지는 단점이 있다." },
  { category: "자원 할당 그래프", question: "자원 인스턴스가 하나뿐인 자원 할당 그래프에서 교착상태의 판단 기준이 되는 것은?", answers: ["사이클", "순환", "cycle", "닫힌 경로", "순환 구조"], displayAnswer: "사이클", explanation: "사이클이 있으면 교착상태이다." },
  { category: "해결 방법", question: "발생 빈도가 낮을 때 예방·회피 비용을 아끼기 위해 교착상태를 신경 쓰지 않는 방식의 이름은?", answers: ["타조 알고리즘", "ostrich algorithm", "ostrich", "무시", "교착상태 무시"], displayAnswer: "타조 알고리즘", explanation: "현실적으로 범용 OS에서 쓰인다." },
  { category: "필요조건", question: "교착상태의 네 가지 필요조건 중 하나라도 성립하지 않으면 교착상태는 발생하는가, 발생하지 않는가?", answers: ["발생하지 않는다", "발생하지 않음", "발생 안 함", "발생 안한다", "발생하지 않는다."], displayAnswer: "발생하지 않는다", explanation: "네 조건이 모두 성립해야 교착이 가능하다." },
  { category: "자원 할당 그래프", question: "자원 할당 그래프에서 자원 인스턴스가 여러 개인 경우 사이클이 있으면 교착상태는 어떠한가? (필요조건/충분조건 중)", answers: ["필요조건", "필요 조건", "필요"], displayAnswer: "필요조건", explanation: "사이클이 있어도 교착이 아닐 수 있다." },
  { category: "탐지와 복구", question: "교착상태가 발생하도록 허용한 뒤 주기적으로 발생 여부를 검사하는 방법은?", answers: ["교착상태 탐지", "탐지", "detection", "deadlock detection"], displayAnswer: "교착상태 탐지", explanation: "발견되면 복구 절차를 수행한다." },
  { category: "은행가 알고리즘", question: "교착상태를 회피하는 대표적인 알고리즘으로 다익스트라가 제안한 것은?", answers: ["은행가 알고리즘", "은행원 알고리즘", "banker's algorithm", "bankers algorithm", "banker algorithm", "뱅커스 알고리즘"], displayAnswer: "은행가 알고리즘", explanation: "안전 상태일 때만 요청을 승인한다." },
  { category: "회피", question: "자원을 할당하기 전에 시스템이 안전 상태를 유지하는지 검사해 교착상태를 피하는 방법은?", answers: ["교착상태 회피", "회피", "avoidance", "deadlock avoidance"], displayAnswer: "교착상태 회피", explanation: "대표 알고리즘은 은행가 알고리즘이다." },
  { category: "탐지와 복구", question: "교착상태 복구 시 종료하거나 자원을 빼앗을 프로세스를 무엇이라 하는가?", answers: ["희생자", "희생 프로세스", "victim", "victim process"], displayAnswer: "희생자(Victim)", explanation: "비용이 낮은 프로세스를 선택한다." },
  { category: "해결 방법", question: "은행가 알고리즘은 교착상태 해결 방법 중 어디에 속하는가? (예방/회피/탐지/복구 중)", answers: ["회피", "교착상태 회피", "avoidance"], displayAnswer: "회피", explanation: "예방과 달리 필요조건을 깨뜨리지 않고 안전 상태를 유지한다." },
];
