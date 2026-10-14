// 운영체제_6장_교착상태_단어집_1.jsx
const META = { group: "운영체제", unit: "6장", title: "교착상태 단어집 1", topic: "6장 핵심 용어 8개" };

const TERMS = [
  { terms: ["자원 인스턴스", "resource instance", "자원 개수"], group: "6장", desc: "같은 종류의 자원 가운데 개별로 할당할 수 있는 하나하나의 단위" },
  { terms: ["요청 간선", "request edge"], group: "6장", desc: "자원 할당 그래프에서 프로세스가 어떤 자원을 얻으려고 기다림을 나타내는 방향선" },
  { terms: ["할당 간선", "assignment edge", "allocation edge"], group: "6장", desc: "자원 할당 그래프에서 어떤 자원이 프로세스에게 주어져 있음을 나타내는 방향선" },
  { terms: ["대기 그래프", "wait-for graph"], group: "6장", desc: "자원 노드를 생략하고 프로세스가 어느 프로세스를 기다리는지만 나타내어 사이클로 교착을 찾는 그래프" },
  { terms: ["사이클", "cycle", "순환 경로"], group: "6장", desc: "그래프에서 한 노드에서 출발해 간선을 따라가면 다시 그 노드로 돌아오는 경로" },
  { terms: ["공유 불가능 자원", "non-sharable resource", "비공유 자원"], group: "6장", desc: "프린터처럼 동시에 여러 프로세스가 사용할 수 없어 상호 배제가 필요한 자원" },
  { terms: ["자원 순서화", "resource ordering", "자원 번호 부여"], group: "6장", desc: "자원마다 번호를 정해 두고 번호가 커지는 방향으로만 요청하도록 하는 예방 기법" },
  { terms: ["일괄 할당", "all-at-once allocation", "한꺼번에 할당"], group: "6장", desc: "프로세스가 시작할 때 필요한 자원을 모두 한 번에 받도록 하는 예방 기법" },
];
