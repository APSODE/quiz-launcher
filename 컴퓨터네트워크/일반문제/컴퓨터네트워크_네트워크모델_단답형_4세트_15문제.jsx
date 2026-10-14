// 컴퓨터네트워크_네트워크모델_단답형_4세트_15문제.jsx
// 근거: 수업자료 '네트워크 모델', '데이터 흐름'
const META = {
  group: "컴퓨터네트워크",
  unit: "네트워크 모델",
  title: "네트워크 모델 단답형 4세트 15문제"
};

const SA_QUESTIONS = [
  {
    category: "응용 계층",
    question: "웹 브라우저나 이메일 클라이언트처럼 사용자가 쓰는 애플리케이션과 직접 상호작용하는 OSI 계층은?",
    answers: ["응용", "응용 계층", "응용계층", "application", "application layer", "7계층"],
    displayAnswer: "응용 계층",
    explanation: "응용 계층은 사용자 인터페이스 기능을 제공한다."
  },
  {
    category: "OSI 계층",
    question: "OSI 7계층 중 5번째 계층은?",
    answers: ["세션", "세션 계층", "세션계층", "session", "session layer"],
    displayAnswer: "세션 계층",
    explanation: "5 세션, 6 표현, 7 응용 순서다."
  },
  {
    category: "OSI 계층",
    question: "OSI 7계층 중 6번째 계층은?",
    answers: ["표현", "표현 계층", "표현계층", "presentation", "presentation layer"],
    displayAnswer: "표현 계층",
    explanation: "표현 계층은 데이터를 상대가 이해할 수 있는 형태로 가공한다."
  },
  {
    category: "네트워크 계층",
    question: "네트워크 계층에서 경로를 설정하는 데 쓰이는 프로토콜 한 가지를 쓰시오.",
    answers: ["rip", "ospf"],
    displayAnswer: "RIP 또는 OSPF",
    explanation: "RIP와 OSPF가 수업자료의 예다."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 모델에서 OSI의 물리 계층과 데이터 링크 계층을 합친 가장 아래 계층은?",
    answers: ["네트워크 접속", "네트워크접속", "네트워크 접속 계층", "네트워크접속계층", "네트워크 인터페이스", "네트워크 액세스", "network access", "network access layer"],
    displayAnswer: "네트워크 접속 계층",
    explanation: "수업자료에서는 네트워크 접속(Network Access) 계층이라 부른다."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 전송 계층의 프로토콜 중 연결형 서비스를 제공하는 것은?",
    answers: ["tcp", "티씨피"],
    displayAnswer: "TCP",
    explanation: "TCP는 논리적 연결을 설정하고 신뢰도, 흐름 제어, 에러 제어를 책임진다."
  },
  {
    category: "네트워크 분류",
    question: "MAN은 어떤 두 네트워크의 중간 영역에 해당하는가?",
    answers: ["lan과 wan", "lan wan", "lan, wan", "lan 과 wan", "lan과wan", "lan/wan", "wan과 lan", "lan,wan"],
    displayAnswer: "LAN과 WAN",
    explanation: "도시 정도의 지역에 구성된 네트워크이며 요즘은 거의 쓰지 않는다."
  },
  {
    category: "데이터 흐름",
    question: "송신 측에서 이더넷 헤더를 붙이는 계층은 OSI 7계층 기준으로 어느 계층인가?",
    answers: ["데이터 링크", "데이터 링크 계층", "데이터링크", "데이터링크 계층", "링크 계층", "링크", "data link", "data link layer", "2계층", "네트워크 접속", "네트워크 접속 계층"],
    displayAnswer: "데이터 링크 계층(네트워크 접속 계층)",
    explanation: "TCP/IP 모델의 네트워크 접속 계층, OSI의 데이터 링크 계층에서 이더넷 헤더를 추가한다."
  },
  {
    category: "데이터 흐름",
    question: "IP 헤더의 출발지 IP 주소는 최초 송신자와 현재 송신자 중 누구의 주소인가?",
    answers: ["최초 송신자", "최초", "최초송신자", "처음 송신자", "원래 송신자"],
    displayAnswer: "최초 송신자",
    explanation: "IP 주소는 종단 간 유지된다."
  },
  {
    category: "데이터 흐름",
    question: "이더넷 헤더의 출발지 MAC 주소는 최초 송신자와 현재 송신자 중 누구의 주소인가?",
    answers: ["현재 송신자", "현재", "현재송신자", "현재 장치"],
    displayAnswer: "현재 송신자",
    explanation: "MAC 주소는 로컬 네트워크에서만 유효하므로 라우터를 거칠 때마다 현재 장치의 주소로 바뀐다."
  },
  {
    category: "데이터 흐름",
    question: "이더넷 헤더의 목적지 MAC 주소는 최종 수신자와 다음 수신자 중 누구의 주소인가?",
    answers: ["다음 수신자", "다음", "다음수신자", "다음 장치"],
    displayAnswer: "다음 수신자",
    explanation: "다음 홉 장치의 MAC 주소가 들어간다."
  },
  {
    category: "신뢰성",
    question: "데이터 손실의 원인 중 큐(버퍼)가 가득 차 패킷이 삭제되는 것을 무엇이라 하는가? (손실/오류 중에서)",
    answers: ["손실", "loss", "손실(loss)"],
    displayAnswer: "손실(Loss)",
    explanation: "오류(Error)는 오류를 검색한 뒤 폐기하는 경우다."
  },
  {
    category: "신뢰성",
    question: "데이터 손실의 원인 중 신호 감쇠나 잡음으로 데이터가 왜곡되어 오류 검색 후 폐기되는 것을 무엇이라 하는가? (손실/오류 중에서)",
    answers: ["오류", "error", "오류(error)"],
    displayAnswer: "오류(Error)",
    explanation: "오류는 검출된 뒤 폐기된다."
  },
  {
    category: "신뢰성",
    question: "ACK는 일종의 무엇이므로 데이터 전송 과정과 동일하게 진행되는가?",
    answers: ["데이터", "data", "데이터 전송"],
    displayAnswer: "데이터",
    explanation: "ACK도 데이터이므로 손실되거나 오류가 생길 수 있다."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP가 제공하는 연결형 서비스에서 설정되는 연결은 물리적 연결과 논리적 연결 중 어느 것인가?",
    answers: ["논리적 연결", "논리적", "논리 연결", "논리적연결", "논리"],
    displayAnswer: "논리적 연결",
    explanation: "TCP는 종단 간 논리적 연결을 설정한다."
  },
];
