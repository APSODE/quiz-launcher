// 운영체제_4장_스케줄링_단어집_1.jsx
const META = { group: "운영체제", unit: "4장", title: "프로세스 스케줄링 단어집 1", topic: "4장 핵심 용어 9개" };

const TERMS = [
  { terms: ["준비 큐", "ready queue", "레디 큐"], group: "4장", desc: "CPU를 할당받기를 기다리는 프로세스들이 줄을 서 있는 대기열" },
  { terms: ["처리량", "throughput", "스루풋"], group: "4장", desc: "단위 시간당 작업을 끝마치는 프로세스의 개수로 클수록 좋은 성능 지표" },
  { terms: ["CPU 이용률", "cpu utilization", "CPU 사용률"], group: "4장", desc: "전체 시간 중 CPU가 놀지 않고 실제 일을 한 시간의 비율" },
  { terms: ["공정성", "fairness", "공평성"], group: "4장", desc: "스케줄링에서 모든 프로세스가 합리적인 기회로 CPU를 사용하게 하려는 목적" },
  { terms: ["종료 시간", "finish time", "종료시간", "완료 시간"], group: "4장", desc: "프로세스가 작업을 모두 마친 시점" },
  { terms: ["간트 차트", "gantt chart", "갠트 차트"], group: "4장", desc: "시간축 위에 프로세스의 CPU 사용 구간을 막대로 나열하여 스케줄링 결과를 한눈에 보이는 도표" },
  { terms: ["작업 큐", "job queue", "잡 큐"], group: "4장", desc: "시스템에 들어온 모든 작업이 메모리에 올라오기 전까지 디스크에서 기다리는 대기열" },
  { terms: ["장치 큐", "device queue", "디바이스 큐"], group: "4장", desc: "입출력 장치를 쓰려고 기다리는 프로세스들이 줄을 서 있는 대기열" },
  { terms: ["디스패치 지연", "dispatch latency", "디스패치 지연 시간"], group: "4장", desc: "한 프로세스를 멈추고 다른 프로세스를 실행하기 시작하기까지 걸리는 시간" },
];
