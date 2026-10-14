// 운영체제_4장_스케줄링_단답형_15문제_4.jsx
const META = { group: "운영체제", unit: "4장", title: "프로세스 스케줄링 단답형 15문제 (4)", topic: "선점과 비선점 · 우선순위 · 성능 지표 · 유닉스 명령" };

const SA_QUESTIONS = [
  { category: "선점과 비선점", question: "선점형 알고리즘에서 CPU를 빼앗을 때 발생하는 비용은 무엇의 증가로 나타나는가?", answers: ["문맥 교환", "문맥교환", "문맥 교환 횟수", "context switch", "컨텍스트 스위치", "컨텍스트 스위칭"], displayAnswer: "문맥 교환", explanation: "선점이 잦을수록 오버헤드가 커진다." },
  { category: "우선순위", question: "오래 기다린 프로세스의 우선순위를 점점 높여 기아 현상을 막는 기법은?", answers: ["에이징", "aging", "에이징 기법"], displayAnswer: "에이징(Aging)", explanation: "HRN의 기본 아이디어이기도 하다." },
  { category: "성능 지표", question: "스케줄링 지표 중 반환시간에서 실행시간(서비스 시간)을 뺀 값은?", answers: ["대기시간", "대기 시간", "waiting time"], displayAnswer: "대기시간", explanation: "반환시간 = 대기시간 + 실행시간." },
  { category: "유닉스 명령", question: "이미 실행 중인 프로세스의 nice 값을 바꾸는 유닉스 명령은?", answers: ["renice", "renice 명령", "renice 명령어"], displayAnswer: "renice", explanation: "nice는 실행 시점에, renice는 실행 중에 조정한다." },
  { category: "라운드 로빈", question: "프로세스마다 일정한 시간 동안만 CPU를 쓰게 하고 시간이 끝나면 준비 큐 뒤로 보내는 알고리즘은?", answers: ["라운드 로빈", "라운드로빈", "RR", "rr", "round robin"], displayAnswer: "라운드 로빈(RR)", explanation: "시분할 시스템에 적합하다." },
  { category: "SJF", question: "실행 시간이 가장 짧은 프로세스를 먼저 실행하는 비선점형 알고리즘은?", answers: ["SJF", "sjf", "Shortest Job First", "최단 작업 우선", "최단 작업 우선 스케줄링"], displayAnswer: "SJF", explanation: "평균 대기시간이 최소가 되는 알고리즘이다." },
  { category: "성능 지표", question: "스케줄링 결과를 시간축 위에 프로세스별 CPU 사용 구간으로 나타낸 도표는?", answers: ["간트 차트", "갠트 차트", "gantt chart", "Gantt chart", "간트차트"], displayAnswer: "간트 차트", explanation: "종료시간·대기시간을 구하는 데 쓴다." },
  { category: "스케줄링 목적", question: "CPU가 유휴 상태 없이 실제로 일한 시간의 비율을 나타내는 지표는?", answers: ["CPU 이용률", "cpu 이용률", "CPU 사용률", "CPU utilization", "cpu utilization", "이용률"], displayAnswer: "CPU 이용률", explanation: "높을수록 좋다." },
  { category: "HRN", question: "HRN의 우선순위를 구하는 식에서 분모에 들어가는 값은?", answers: ["서비스 시간", "서비스시간", "실행 시간", "실행시간", "작업 시간", "작업시간", "burst time"], displayAnswer: "서비스 시간", explanation: "우선순위 = (대기시간 + 서비스 시간) / 서비스 시간." },
  { category: "다단계 큐", question: "프로세스를 성격에 따라 여러 큐로 나누고 큐마다 다른 알고리즘을 적용하는 스케줄링은?", answers: ["다단계 큐", "다단계 큐 스케줄링", "멀티레벨 큐", "multilevel queue", "MLQ", "mlq"], displayAnswer: "다단계 큐(MLQ)", explanation: "프로세스는 한 큐에 고정된다." },
  { category: "우선순위", question: "우선순위 스케줄링의 대표적인 문제로 낮은 우선순위 프로세스가 계속 실행되지 못하는 것은?", answers: ["기아", "기아 현상", "starvation", "아사"], displayAnswer: "기아 현상", explanation: "에이징으로 해결한다." },
  { category: "스케줄링 개념", question: "CPU 스케줄링에서 준비 큐에 있는 프로세스가 CPU를 받기 위해 기다리는 줄을 무엇이라 하는가?", answers: ["준비 큐", "레디 큐", "ready queue", "준비큐"], displayAnswer: "준비 큐", explanation: "준비 상태 프로세스들이 모여 있다." },
  { category: "스케줄링 개념", question: "프로세스가 CPU를 할당받은 뒤 스스로 반납하기 전에는 빼앗을 수 없는 스케줄링 방식은?", answers: ["비선점", "비선점형", "비선점형 스케줄링", "non-preemptive", "nonpreemptive"], displayAnswer: "비선점형", explanation: "FCFS, SJF, HRN이 해당한다." },
  { category: "SRTF", question: "남은 실행 시간이 가장 짧은 프로세스에게 CPU를 주는 선점형 알고리즘은?", answers: ["SRTF", "srtf", "SRT", "srt", "Shortest Remaining Time First", "Shortest Remaining Time"], displayAnswer: "SRTF(SRT)", explanation: "SJF의 선점형 버전이다." },
  { category: "스케줄링 개념", question: "준비 큐에 있는 프로세스 중 CPU를 사용할 프로세스를 결정하는 작업을 무엇이라 하는가?", answers: ["프로세스 스케줄링", "스케줄링", "CPU 스케줄링", "scheduling", "process scheduling"], displayAnswer: "프로세스(CPU) 스케줄링", explanation: "단기 스케줄러가 수행한다." },
];
