// 운영체제_6장_교착상태_단어집_2.jsx
const META = { group: "운영체제", unit: "6장", title: "교착상태 단어집 2", topic: "6장 핵심 용어 9개" };

const TERMS = [
  { terms: ["Need 행렬", "need matrix", "Need"], group: "6장", desc: "은행가 알고리즘에서 프로세스가 앞으로 더 필요로 하는 자원의 양을 모은 표" },
  { terms: ["Available", "가용 자원", "available vector"], group: "6장", desc: "은행가 알고리즘에서 현재 시스템에 남아 즉시 내줄 수 있는 자원의 양" },
  { terms: ["Max 행렬", "max matrix", "최대 요구량 행렬"], group: "6장", desc: "은행가 알고리즘에서 각 프로세스가 선언한 자원 요구의 상한을 모은 표" },
  { terms: ["Allocation 행렬", "allocation matrix", "할당 행렬"], group: "6장", desc: "은행가 알고리즘에서 각 프로세스가 현재 쥐고 있는 자원의 양을 모은 표" },
  { terms: ["희생자", "victim", "희생 프로세스"], group: "6장", desc: "교착 복구 시 종료하거나 자원을 빼앗기도록 선택되는 프로세스" },
  { terms: ["롤백", "rollback", "롤 백"], group: "6장", desc: "자원을 빼앗긴 프로세스를 이전의 안정된 지점으로 되돌려 다시 시작하게 하는 작업" },
  { terms: ["타조 알고리즘", "ostrich algorithm"], group: "6장", desc: "교착이 드물게 일어난다고 보고 별도의 대책 없이 내버려 두는 처리 방식" },
  { terms: ["자원 선점", "resource preemption"], group: "6장", desc: "교착을 풀기 위해 어떤 프로세스가 쥔 자원을 강제로 빼앗아 다른 프로세스에 주는 복구 방법" },
  { terms: ["시스템 타임아웃", "timeout detection", "타임아웃 탐지"], group: "6장", desc: "일정 시간 동안 진행이 없는 프로세스를 교착 상태로 간주하는 단순한 탐지 방식" },
];
