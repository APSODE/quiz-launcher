// 운영체제_1장_개요_모의고사_1회.jsx
const META = { group: "운영체제", unit: "1장", title: "개요 모의고사 1회", topic: "객관식 6 · OX 3 · 단답형 3" };

const QUESTIONS = [
  { category: "OS 역사", question: "한 CPU에서 여러 프로그램을 메모리에 올려 번갈아 실행하는 방식은?", choices: ["멀티 프로그래밍", "가상화", "엑소커널", "일괄 처리"], answer: 0, explanation: "입출력 대기 시간 동안 다른 프로그램이 CPU를 쓴다." },
  { category: "커널", question: "다음 중 커널의 역할이 아닌 것은?", choices: ["장치 관리", "워드 문서 편집", "메모리 관리", "프로세스 관리"], answer: 1, explanation: "문서 편집은 응용 소프트웨어의 일이다." },
  { category: "커널", question: "모든 커널 기능을 하나의 커널 안에 두는 구조는?", choices: ["하이브리드 커널", "엑소커널", "모놀리식 커널", "마이크로커널"], answer: 2, explanation: "모놀리식은 단일형 구조이다." },
  { category: "리눅스", question: "리눅스에 대한 설명으로 옳은 것은?", choices: ["단일 사용자 전용이다", "GUI 이전에만 쓰였다", "오픈 소스이다", "소스가 비공개이다"], answer: 2, explanation: "오픈 소스이며 다양한 배포판이 있다." },
  { category: "유닉스", question: "유닉스의 특징으로 알맞지 않은 것은?", choices: ["다중 작업", "모듈식 설계", "다중 사용자", "단일 사용자 전용"], answer: 3, explanation: "유닉스는 다중 사용자 운영체제이다." },
  { category: "운영 방식", question: "하나의 물리 서버에서 여러 독립된 운영체제를 실행하게 해 주는 기술은?", choices: ["가상화", "실시간 처리", "시분할", "일괄 처리"], answer: 0, explanation: "가상 머신이 대표적이다." },
  { category: "시스템 소프트웨어", question: "오피스 프로그램과 게임은 운영체제와 함께 시스템 소프트웨어로 분류된다.", answer: false, explanation: "오피스와 게임은 응용 소프트웨어이다." },
  { category: "OS 역할", question: "운영체제의 주요 역할은 자원 관리, 사용자 인터페이스 제공, 보안 및 보호이다.", answer: true, explanation: "프로세스, 메모리, 파일 시스템, 디스크, 입출력 장치가 관리 대상 자원이다." },
  { category: "운영 방식", question: "분산 처리 시스템은 여러 컴퓨터가 네트워크로 연결되어 작업을 나누어 처리한다.", answer: true, explanation: "분산 데이터베이스가 한 예이다." },
  { category: "OS 역사", question: "한 번에 하나의 프로그램만 메모리에서 실행하고 끝나야 다음을 실행하는 초기 구조는?", answers: ["일괄 처리 시스템", "일괄처리", "배치 처리 시스템", "배치 처리", "단일 프로그램", "batch"], displayAnswer: "일괄 처리 시스템", explanation: "멀티 프로그래밍으로 발전했다." },
  { category: "커널", question: "모놀리식 커널과 마이크로커널의 장점을 절충한 커널 유형은?", answers: ["하이브리드 커널", "하이브리드커널", "hybrid kernel", "하이브리드"], displayAnswer: "하이브리드 커널", explanation: "현대 운영체제에서 흔히 쓴다." },
  { category: "OS 역할", question: "운영체제의 세 가지 주요 역할은 자원 관리, 보안 및 보호, 그리고 무엇인가?", answers: ["사용자 인터페이스 제공", "사용자 인터페이스", "인터페이스 제공", "인터페이스", "user interface", "UI"], displayAnswer: "사용자 인터페이스 제공", explanation: "CLI와 GUI 형태로 제공한다." },
];
