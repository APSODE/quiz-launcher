// 컴퓨터네트워크_1장_단답형_4세트_15문제.jsx
// 근거: 수업자료 Chapter 1 Introduction
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 Introduction 단답형 4세트 15문제"
};

const SA_QUESTIONS = [
  {
    category: "네트워크 엣지",
    question: "네트워크 엣지의 호스트는 두 종류로 나뉜다. 무엇과 무엇인가?",
    answers: ["클라이언트와 서버", "클라이언트, 서버", "클라이언트 서버", "클라이언트/서버", "client and server", "client, server", "client server", "서버와 클라이언트", "서버, 클라이언트", "클라이언트와서버"],
    displayAnswer: "클라이언트와 서버",
    explanation: "hosts: clients and servers."
  },
  {
    category: "네트워크 엣지",
    question: "서버가 규모 확장을 위해 흔히 위치하는 시설은?",
    answers: ["데이터 센터", "데이터센터", "data center", "datacenter", "idc"],
    displayAnswer: "데이터 센터",
    explanation: "servers often in data centers."
  },
  {
    category: "패킷 스위치",
    question: "패킷을 전달하는 패킷 스위치의 두 종류는?",
    answers: ["라우터와 스위치", "라우터, 스위치", "라우터 스위치", "라우터/스위치", "router and switch", "router, switch", "스위치와 라우터", "스위치, 라우터"],
    displayAnswer: "라우터와 스위치",
    explanation: "packet switches: routers and switches."
  },
  {
    category: "회선 교환",
    question: "회선 교환의 3단계 중 마지막 단계는?",
    answers: ["연결 해제", "연결해제", "connection released", "connection release", "연결 종료", "연결종료", "호 해제"],
    displayAnswer: "연결 해제",
    explanation: "연결 설정, 데이터 전송, 연결 해제 순서다."
  },
  {
    category: "인터넷 구조",
    question: "고객 ISP와 제공자 ISP 사이에는 어떤 합의가 있는가?",
    answers: ["경제적 합의", "경제적합의", "경제 합의", "economic agreement", "경제적 계약", "경제적인 합의"],
    displayAnswer: "경제적 합의",
    explanation: "Customer and provider ISPs have economic agreement."
  },
  {
    category: "인터넷 구조",
    question: "N개의 접속 ISP를 모두 서로 직접 연결할 때 필요한 연결 수의 규모를 O( )로 쓰시오. (예: O(N) → N)",
    answers: ["n²", "n^2", "n제곱", "n2", "n의 제곱", "n*n", "o(n²)", "o(n^2)", "o(n2)", "n x n", "nxn"],
    displayAnswer: "N²",
    explanation: "모든 쌍을 연결하면 O(N²)으로 확장되지 않는다."
  },
  { category: "회선 교환", question: "회선 교환의 3단계 중 첫 번째 단계는?",
    answers: ["연결 설정", "연결설정", "회선 설정", "회선설정", "connection setup", "setup"],
    displayAnswer: "연결 설정",
    hint: "통신 전에 먼저 하는 것",
    explanation: "회선 교환: 연결 설정 → 데이터 전송 → 연결 해제." },
  { category: "회선 교환", question: "회선 교환에서 링크를 주파수 대역으로 나누어 사용하는 다중화 방식의 약어는?",
    answers: ["fdm", "frequency division multiplexing", "주파수 분할 다중화", "주파수분할다중화"],
    displayAnswer: "FDM",
    hint: "Frequency ...",
    explanation: "FDM = 주파수 분할, TDM = 시간 분할." },
  { category: "캡슐화", question: "인터넷 스택에서 응용 계층의 데이터 단위 이름은?",
    answers: ["메시지", "메세지", "message"],
    displayAnswer: "메시지(Message)",
    hint: "message",
    explanation: "응용 = Message, 전송 = Segment, 네트워크 = Datagram, 링크 = Frame." },
  { category: "캡슐화", question: "인터넷 스택에서 전송 계층의 데이터 단위 이름은?",
    answers: ["세그먼트", "segment", "세그멘트"],
    displayAnswer: "세그먼트(Segment)",
    hint: "seg...",
    explanation: "전송 계층 헤더 + 응용 메시지 = Segment." },
  { category: "캡슐화", question: "인터넷 스택에서 링크 계층의 데이터 단위 이름은?",
    answers: ["프레임", "frame"],
    displayAnswer: "프레임(Frame)",
    hint: "frame",
    explanation: "링크 계층 헤더 + datagram = Frame." },
  { category: "프로토콜 계층", question: "계층화의 이점 중, 한 계층의 구현이 바뀌어도 나머지 시스템에 영향을 주지 않게 하는 성질은?",
    answers: ["모듈화", "모듈성", "modularization", "modularity"],
    displayAnswer: "모듈화",
    hint: "module",
    explanation: "계층화 이유: 구조 식별, 모듈화로 유지보수·갱신 용이." },
  { category: "프로토콜 계층", question: "라우터는 인터넷 프로토콜 스택의 어느 계층까지 처리하는가?",
    answers: ["네트워크", "네트워크 계층", "네트워크계층", "network", "network layer", "3계층"],
    displayAnswer: "네트워크(network) 계층",
    hint: "스위치는 link까지",
    explanation: "라우터는 network 계층까지, 스위치는 link 계층까지 처리한다." },
  {
    category: "패킷 손실",
    question: "이미 가득 찬 큐에 새 패킷이 도착하면 그 패킷은 어떻게 되는가?",
    answers: ["버려진다", "폐기", "폐기된다", "손실", "손실된다", "drop", "dropped", "삭제", "삭제된다", "버려짐", "손실(drop)", "유실", "유실된다"],
    displayAnswer: "버려진다(손실된다)",
    explanation: "큐 용량이 유한해 가득 차면 도착 패킷이 drop된다."
  },
  {
    category: "저장 후 전달",
    question: "저장 후 전달(store-and-forward) 방식에서 라우터가 다음 링크로 전송을 시작하려면 패킷의 어느 부분이 도착해야 하는가?",
    answers: ["패킷 전체", "전체", "패킷 전체가 도착", "패킷 전부", "전부", "모든 비트", "패킷전체"],
    displayAnswer: "패킷 전체",
    explanation: "entire packet must arrive at router before it can be transmitted on next link."
  },
];
