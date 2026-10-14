// 운영체제_4장_스케줄링_단답형_15문제_3.jsx
const META = { group: "운영체제", unit: "4장", title: "프로세스 스케줄링 단답형 15문제 (3)", topic: "SJF · 성능 지표 · FCFS · 유닉스 명령" };

const SA_QUESTIONS = [
  { category: "SJF", question: "SJF의 가장 큰 현실적 문제는 프로세스의 무엇을 미리 알아야 한다는 점인가?", answers: ["실행 시간", "실행시간", "서비스 시간", "서비스시간", "burst time", "CPU 버스트 시간", "작업 시간", "작업시간"], displayAnswer: "실행 시간(서비스 시간)", explanation: "실제로는 예측값을 사용한다." },
  { category: "성능 지표", question: "요청을 보낸 시점부터 첫 번째 응답이 나올 때까지 걸린 시간은?", answers: ["응답시간", "응답 시간", "response time"], displayAnswer: "응답시간", explanation: "대화형 시스템에서 중요하다." },
  { category: "FCFS", question: "도착한 순서대로 CPU를 할당하는 비선점형 스케줄링 알고리즘은?", answers: ["FCFS", "fcfs", "First Come First Served", "선입선출", "FIFO", "선착순"], displayAnswer: "FCFS", explanation: "구현이 단순하다." },
  { category: "유닉스 명령", question: "유닉스에서 프로세스의 CPU·메모리 사용 현황을 실시간으로 보여 주는 명령은?", answers: ["top", "top 명령", "top 명령어"], displayAnswer: "top", explanation: "주기적으로 갱신된다." },
  { category: "HRN", question: "HRN이 SJF의 어떤 문제를 완화하기 위해 만들어졌는가?", answers: ["기아", "기아 현상", "starvation", "아사"], displayAnswer: "기아 현상", explanation: "대기시간이 늘수록 우선순위가 올라간다." },
  { category: "스케줄링 개념", question: "시스템에 들어온 모든 작업이 메모리에 올라오기 전에 디스크에서 기다리는 대기열은?", answers: ["작업 큐", "잡 큐", "job queue", "작업큐"], displayAnswer: "작업 큐", explanation: "장기 스케줄러가 여기서 작업을 골라 준비 큐로 보낸다." },
  { category: "SJF", question: "SJF에서 긴 프로세스가 계속 밀려 CPU를 얻지 못하는 현상은?", answers: ["기아", "기아 현상", "starvation", "아사"], displayAnswer: "기아 현상(Starvation)", explanation: "에이징으로 완화한다." },
  { category: "유닉스 명령", question: "유닉스에서 프로세스를 실행할 때 우선순위 조정 값을 지정하는 명령은?", answers: ["nice", "nice 명령", "nice 명령어"], displayAnswer: "nice", explanation: "값이 클수록 우선순위가 낮다." },
  { category: "성능 지표", question: "프로세스가 도착한 시점부터 작업을 마친 시점까지 걸린 시간은?", answers: ["반환시간", "반환 시간", "turnaround time", "turnaround"], displayAnswer: "반환시간", explanation: "종료시간 − 도착시간." },
  { category: "SRTF", question: "SRTF에서 새 프로세스가 도착했을 때 선점 여부를 판단하기 위해 현재 실행 중인 프로세스와 비교하는 값은?", answers: ["남은 실행 시간", "남은 시간", "잔여 실행 시간", "남은 서비스 시간", "남은 작업 시간", "remaining time"], displayAnswer: "남은 실행 시간", explanation: "새 프로세스의 실행 시간이 현재 프로세스의 남은 시간보다 짧으면 선점한다." },
  { category: "유닉스 명령", question: "유닉스에서 프로세스에 시그널을 보내 종료시키는 데 쓰는 명령은?", answers: ["kill", "kill 명령", "kill 명령어"], displayAnswer: "kill", explanation: "PID를 지정해 사용한다." },
  { category: "스케줄링 개념", question: "CPU 사용 시간이 입출력 시간보다 훨씬 긴 프로세스를 무엇이라 하는가? (○○ 중심 프로세스)", answers: ["CPU 중심", "CPU 바운드", "CPU bound", "cpu-bound", "CPU 중심 프로세스", "CPU 바운드 프로세스"], displayAnswer: "CPU 바운드 프로세스", explanation: "반대로 입출력이 많은 프로세스는 I/O 바운드 프로세스이다." },
  { category: "성능 지표", question: "여러 프로세스의 반환시간 합을 프로세스 수로 나눈 값을 무엇이라 하는가?", answers: ["평균 반환시간", "평균 반환 시간", "average turnaround time", "평균반환시간"], displayAnswer: "평균 반환시간", explanation: "대기시간도 같은 방식으로 평균을 낸다." },
  { category: "스케줄링 개념", question: "입출력 시간이 CPU 사용 시간보다 훨씬 긴 프로세스를 무엇이라 하는가? (○○ 중심 프로세스)", answers: ["입출력 중심", "I/O 바운드", "I/O bound", "io bound", "입출력 바운드", "입출력 중심 프로세스", "I/O 중심", "I/O 중심 프로세스"], displayAnswer: "I/O 바운드 프로세스", explanation: "대화형 프로세스가 대표적이다." },
  { category: "성능 지표", question: "프로세스가 준비 큐에서 CPU를 받지 못하고 기다린 시간의 합은?", answers: ["대기시간", "대기 시간", "waiting time"], displayAnswer: "대기시간", explanation: "반환시간 − 실행시간." },
];
