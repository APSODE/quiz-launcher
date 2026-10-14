// 운영체제_4장_스케줄링_OX_20문제_4.jsx
const META = { group: "운영체제", unit: "4장", title: "프로세스 스케줄링 OX 20문제 (4)", topic: "FCFS · HRN · SJF · SRTF" };

const OX_QUESTIONS = [
  { category: "스케줄링 개념", question: "멀티프로그래밍 환경에서는 CPU 이용률을 높이기 위해 스케줄링이 필요하다.", answer: true, explanation: "한 프로세스가 입출력을 기다릴 때 다른 프로세스에게 CPU를 줄 수 있다." },
  { category: "스케줄링 개념", question: "프로세스 스케줄링은 준비 큐에 있는 프로세스 중 CPU를 사용할 프로세스를 정하는 일이다.", answer: true, explanation: "CPU 스케줄러가 담당한다." },
  { category: "우선순위", question: "에이징은 오래 기다린 프로세스의 우선순위를 낮추는 기법이다.", answer: false, explanation: "에이징은 우선순위를 높이는 기법이다." },
  { category: "다단계 큐", question: "다단계 피드백 큐에서는 프로세스가 실행 특성에 따라 큐 사이를 이동할 수 있다.", answer: true, explanation: "다단계 큐와 달리 큐 이동이 가능하다." },
  { category: "선점과 비선점", question: "선점형 스케줄링은 실행 중인 프로세스에서 CPU를 빼앗아 다른 프로세스에 줄 수 있다.", answer: true, explanation: "RR, SRTF, 선점형 우선순위가 대표적이다." },
  { category: "HRN", question: "HRN의 우선순위 값은 대기시간과 무관하게 서비스 시간만으로 결정된다.", answer: false, explanation: "대기시간이 길수록 우선순위가 올라간다." },
  { category: "다단계 큐", question: "다단계 큐 스케줄링에서는 프로세스가 실행 도중 큐 사이를 자유롭게 이동한다.", answer: false, explanation: "큐 사이를 이동하는 것은 다단계 피드백 큐이다." },
  { category: "성능 지표", question: "반환시간은 프로세스가 도착한 시점부터 작업을 모두 마친 시점까지 걸린 시간이다.", answer: true, explanation: "반환시간 = 종료시간 − 도착시간." },
  { category: "유닉스 명령", question: "top 명령은 한 번 실행하면 스냅샷만 출력하고 갱신되지 않는다.", answer: false, explanation: "top은 주기적으로 갱신되며 실시간 현황을 보여 준다." },
  { category: "SJF", question: "SJF는 실행 시간이 가장 짧은 프로세스를 먼저 실행하는 알고리즘이며 평균 대기시간이 최소가 되는 것으로 알려져 있다.", answer: true, explanation: "단, 실행 시간을 미리 알아야 한다는 문제가 있다." },
  { category: "선점과 비선점", question: "라운드 로빈은 비선점형 스케줄링이다.", answer: false, explanation: "타임 퀀텀이 끝나면 CPU를 빼앗으므로 선점형이다." },
  { category: "유닉스 명령", question: "ps 명령은 현재 실행 중인 프로세스의 정보를 보여 주고, top 명령은 프로세스의 CPU·메모리 사용 현황을 실시간으로 보여 준다.", answer: true, explanation: "둘 다 프로세스 모니터링 도구이다." },
  { category: "선점과 비선점", question: "비선점형 스케줄링에서는 더 높은 우선순위 프로세스가 도착하면 즉시 실행 중인 프로세스에게서 CPU를 빼앗는다.", answer: false, explanation: "그것은 선점형의 동작이다." },
  { category: "FCFS", question: "콘보이 효과는 짧은 작업이 먼저 실행되어 긴 작업이 영원히 실행되지 못하는 현상이다.", answer: false, explanation: "콘보이 효과는 긴 작업 하나 뒤에서 짧은 작업들이 오래 기다리는 현상이다." },
  { category: "스케줄링 목적", question: "스케줄링의 목적에는 공정성, 처리량 증가, 응답시간 단축, CPU 이용률 향상 등이 있다.", answer: true, explanation: "목적들이 서로 상충하기도 한다." },
  { category: "스케줄링 목적", question: "처리량은 작을수록 좋은 성능 지표이다.", answer: false, explanation: "처리량은 클수록 좋다." },
  { category: "SRTF", question: "SRTF는 비선점형 알고리즘이다.", answer: false, explanation: "SRTF는 SJF의 선점형 버전이다." },
  { category: "라운드 로빈", question: "라운드 로빈에서 타임 퀀텀 안에 끝나지 못한 프로세스는 준비 큐의 맨 뒤로 들어간다.", answer: true, explanation: "다시 차례가 올 때까지 기다린다." },
  { category: "FCFS", question: "FCFS는 준비 큐에 먼저 도착한 프로세스부터 처리하는 비선점형 알고리즘이다.", answer: true, explanation: "구현이 단순하고 공정해 보이지만 평균 대기시간이 길어질 수 있다." },
  { category: "선점과 비선점", question: "선점형 스케줄링은 문맥 교환이 전혀 일어나지 않는다.", answer: false, explanation: "오히려 문맥 교환이 더 자주 일어난다." },
];
