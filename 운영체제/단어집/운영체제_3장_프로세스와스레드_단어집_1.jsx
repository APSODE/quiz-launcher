// 운영체제_3장_프로세스와스레드_단어집_1.jsx
const META = { group: "운영체제", unit: "3장", title: "프로세스와 스레드 단어집 1", topic: "3장 핵심 용어 8개" };

const TERMS = [
  { terms: ["스택 프레임", "stack frame", "호출 프레임"], group: "3장", desc: "함수가 호출될 때 매개변수, 지역 변수, 복귀 주소를 담기 위해 스택에 만들어지는 영역" },
  { terms: ["동적 할당", "dynamic allocation", "동적 메모리 할당"], group: "3장", desc: "프로그램이 실행되는 도중에 필요한 만큼 메모리를 요청해서 받아 쓰는 방식" },
  { terms: ["장기 스케줄러", "long-term scheduler", "작업 스케줄러", "잡 스케줄러"], group: "3장", desc: "디스크의 작업 중 메모리에 올릴 것을 골라 멀티프로그래밍 정도를 조절하는 스케줄러" },
  { terms: ["단기 스케줄러", "short-term scheduler", "CPU 스케줄러"], group: "3장", desc: "준비 큐에서 다음에 CPU를 받을 프로세스를 고르며 가장 자주 호출되는 스케줄러" },
  { terms: ["중기 스케줄러", "medium-term scheduler"], group: "3장", desc: "프로세스를 메모리 밖으로 내보내거나 다시 들여와 메모리 부하를 조절하는 스케줄러" },
  { terms: ["디스패처", "dispatcher"], group: "3장", desc: "단기 스케줄러가 고른 프로세스에 실제로 CPU 제어권을 넘기는 모듈" },
  { terms: ["부모 프로세스", "parent process", "상위 프로세스"], group: "3장", desc: "자신이 호출한 생성 작업으로 다른 프로세스를 만들어 낸 쪽의 프로세스" },
  { terms: ["자식 프로세스", "child process", "하위 프로세스"], group: "3장", desc: "다른 프로세스가 생성 작업을 호출하여 새로 만들어진 쪽의 프로세스" },
];
