// 운영체제_4장_스케줄링_OX_20문제_3.jsx
const META = { group: "운영체제", unit: "4장", title: "프로세스 스케줄링 OX 20문제 (3)", topic: "FCFS · HRN · SJF · SRTF" };

const OX_QUESTIONS = [
  { category: "우선순위", question: "우선순위 스케줄링에서는 기아 현상이 절대 발생하지 않는다.", answer: false, explanation: "낮은 우선순위 프로세스가 계속 밀리는 기아가 생길 수 있다." },
  { category: "SRTF", question: "SRTF는 새로 도착한 프로세스가 있어도 현재 실행 중인 프로세스가 끝날 때까지 기다린다.", answer: false, explanation: "새 프로세스의 남은 시간이 더 짧으면 선점한다." },
  { category: "우선순위", question: "우선순위 스케줄링은 각 프로세스에 부여된 우선순위가 높은 프로세스에게 먼저 CPU를 준다.", answer: true, explanation: "선점형과 비선점형으로 모두 구현할 수 있다." },
  { category: "SJF", question: "SJF에서는 실행 시간이 긴 프로세스가 계속 밀려나는 기아 현상이 생길 수 있다.", answer: true, explanation: "에이징으로 완화할 수 있다." },
  { category: "성능 지표", question: "응답시간은 작업이 완전히 끝날 때까지 걸리는 시간을 의미한다.", answer: false, explanation: "그것은 반환시간이다. 응답시간은 첫 응답까지의 시간이다." },
  { category: "스케줄링 목적", question: "처리량은 단위 시간당 완료되는 프로세스의 수이며 클수록 좋다.", answer: true, explanation: "대기시간·응답시간·반환시간은 짧을수록 좋다." },
  { category: "FCFS", question: "FCFS는 실행 시간이 짧은 프로세스를 먼저 처리하는 알고리즘이다.", answer: false, explanation: "FCFS는 도착 순서대로 처리한다." },
  { category: "성능 지표", question: "대기시간은 프로세스가 준비 큐에서 CPU를 기다린 시간의 합이다.", answer: true, explanation: "대기시간 = 반환시간 − 실행시간." },
  { category: "HRN", question: "HRN은 서비스 시간이 긴 프로세스에게 항상 더 높은 우선순위를 준다.", answer: false, explanation: "(대기+서비스)/서비스이므로 서비스 시간이 짧을수록 유리하다." },
  { category: "라운드 로빈", question: "라운드 로빈에서 타임 퀀텀이 작을수록 문맥 교환 오버헤드가 줄어든다.", answer: false, explanation: "퀀텀이 작으면 문맥 교환이 더 잦아진다." },
  { category: "라운드 로빈", question: "라운드 로빈에서 타임 퀀텀이 지나치게 작으면 문맥 교환이 잦아 오버헤드가 커진다.", answer: true, explanation: "퀀텀은 문맥 교환 시간보다 충분히 커야 한다." },
  { category: "성능 지표", question: "응답시간은 요청한 뒤 첫 번째 응답이 나올 때까지 걸리는 시간으로 대화형 시스템에서 특히 중요하다.", answer: true, explanation: "작업 전체의 완료 시간이 아니라 첫 응답 시점이다." },
  { category: "성능 지표", question: "반환시간은 프로세스가 준비 큐에서 기다린 시간만을 뜻한다.", answer: false, explanation: "그것은 대기시간이다. 반환시간은 도착부터 종료까지 전체 시간이다." },
  { category: "라운드 로빈", question: "라운드 로빈에서 타임 퀀텀이 무한히 크면 SJF처럼 동작한다.", answer: false, explanation: "FCFS처럼 동작한다." },
  { category: "라운드 로빈", question: "라운드 로빈에서 타임 퀀텀이 지나치게 크면 FCFS와 비슷하게 동작한다.", answer: true, explanation: "퀀텀 안에 대부분의 프로세스가 끝나기 때문이다." },
  { category: "다단계 큐", question: "다단계 큐 스케줄링은 모든 큐에 반드시 동일한 스케줄링 알고리즘을 적용해야 한다.", answer: false, explanation: "큐마다 다른 알고리즘을 적용할 수 있다." },
  { category: "선점과 비선점", question: "선점형 스케줄링은 비선점형보다 문맥 교환이 많아 오버헤드가 커질 수 있다.", answer: true, explanation: "대신 응답성은 좋아진다." },
  { category: "SJF", question: "SJF에서는 실행 시간이 긴 프로세스도 기아 현상 없이 항상 공평하게 처리된다.", answer: false, explanation: "긴 프로세스가 계속 밀려나는 기아가 생길 수 있다." },
  { category: "HRN", question: "HRN에서는 같은 서비스 시간이라면 오래 기다린 프로세스일수록 우선순위가 높아진다.", answer: true, explanation: "대기시간이 분자에 들어 있기 때문이다." },
  { category: "다단계 큐", question: "다단계 피드백 큐에서 CPU를 오래 쓴 프로세스는 낮은 우선순위 큐로 내려가는 방식이 흔히 쓰인다.", answer: true, explanation: "짧은 대화형 작업에 유리해진다." },
];
