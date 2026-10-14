// 운영체제_4장_스케줄링_단어집_2.jsx
const META = { group: "운영체제", unit: "4장", title: "프로세스 스케줄링 단어집 2", topic: "4장 핵심 용어 11개" };

const TERMS = [
  { terms: ["nice", "nice 값", "nice 명령"], group: "4장", desc: "유닉스에서 값이 클수록 다른 프로세스에 양보하여 우선순위가 낮아지는 조정값" },
  { terms: ["renice", "renice 명령"], group: "4장", desc: "이미 실행 중인 유닉스 프로세스의 우선순위 조정값을 나중에 바꾸는 명령" },
  { terms: ["정적 우선순위", "static priority"], group: "4장", desc: "프로세스가 생성될 때 정해지고 실행 중에는 바뀌지 않는 우선순위" },
  { terms: ["동적 우선순위", "dynamic priority"], group: "4장", desc: "프로세스의 대기 시간이나 실행 상황에 따라 실행 중에 계속 조정되는 우선순위" },
  { terms: ["전면 큐", "foreground queue", "포그라운드 큐"], group: "4장", desc: "다단계 큐에서 사용자와 직접 상호작용하는 대화형 작업을 담는 대기열" },
  { terms: ["후면 큐", "background queue", "백그라운드 큐"], group: "4장", desc: "다단계 큐에서 사용자 입력 없이 처리되는 일괄 작업을 담는 대기열" },
  { terms: ["평균 반환시간", "average turnaround time", "평균 반환 시간"], group: "4장", desc: "여러 프로세스의 반환시간을 모두 더해 프로세스 수로 나눈 값" },
  { terms: ["평균 대기시간", "average waiting time", "평균 대기 시간"], group: "4장", desc: "여러 프로세스의 대기시간을 모두 더해 프로세스 수로 나눈 값" },
  { terms: ["큐 간 스케줄링", "interqueue scheduling", "큐 사이 스케줄링"], group: "4장", desc: "다단계 큐에서 여러 대기열 중 어느 쪽에 CPU를 줄지 정하는 방식" },
  { terms: ["입출력 중심 프로세스", "I/O 바운드 프로세스", "io bound process"], group: "4장", desc: "계산보다 입출력 기다리는 시간이 훨씬 긴 유형의 프로세스" },
  { terms: ["계산 중심 프로세스", "CPU 바운드 프로세스", "cpu bound process"], group: "4장", desc: "입출력보다 CPU 계산에 쓰는 시간이 훨씬 긴 유형의 프로세스" },
];
