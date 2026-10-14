// 컴퓨터네트워크_네트워크모델_OX_2세트_20문제.jsx
// 근거: 수업자료 '네트워크 모델', '데이터 흐름'
const META = {
  group: "컴퓨터네트워크",
  unit: "네트워크 모델",
  title: "네트워크 모델 OX 2세트 20문제"
};

const OX_QUESTIONS = [
  {
    category: "프로토콜",
    question: "프로토콜은 통신을 수행하는 두 장치를 연결하는 물리적인 도로를 뜻한다.",
    answer: false,
    explanation: "프로토콜은 데이터 교환 규칙(도로 교통법)이다. 도로에 해당하는 것은 네트워크다."
  },
  {
    category: "네트워크 모델",
    question: "OSI 7계층 모델은 실질적으로 현재 인터넷에서 사용되는 모델이다.",
    answer: false,
    explanation: "현재 인터넷에서 실질적으로 쓰이는 것은 TCP/IP 모델이다. OSI는 표준적인 뼈대를 제공하는 참조 모델이다."
  },
  {
    category: "표현 계층",
    question: "이메일 첨부파일에 쓰는 MIME 인코딩이나 Base64 인코딩은 표현 계층의 기능에 해당한다.",
    answer: true,
    explanation: "표현 계층은 다양한 데이터를 전송 가능한 형식으로 인코딩하고 디코딩한다."
  },
  {
    category: "세션 계층",
    question: "세션 계층은 중간 상태를 체크포인트로 저장해 오류 후에 통신을 복구하고 재개할 수 있게 한다.",
    answer: true,
    explanation: "동기화(Checkpoint)는 세션 계층의 기능이다."
  },
  {
    category: "전송 계층",
    question: "IP 주소 할당과 목적지까지의 최적 경로 설정은 전송 계층의 역할이다.",
    answer: false,
    explanation: "IP 주소 할당과 경로 설정은 네트워크 계층의 역할이다. 전송 계층은 종단 프로세스 간 전송을 맡는다."
  },
  {
    category: "네트워크 계층",
    question: "RIP와 OSPF는 네트워크 계층에서 최적 경로를 설정하는 데 쓰이는 프로토콜이다.",
    answer: true,
    explanation: "RIP, OSPF는 네트워크 계층의 경로 설정 프로토콜 예다."
  },
  {
    category: "물리 계층",
    question: "여러 장치가 동시에 매체로 데이터를 보낼 때 이를 제어하는 매체 접근 제어(MAC)는 물리 계층의 기능이다.",
    answer: false,
    explanation: "매체 접근 제어는 데이터 링크 계층의 기능이다. 물리 계층은 비트를 신호로 바꿔 전송한다."
  },
  {
    category: "네트워크 장치",
    question: "리피터와 허브는 물리 계층에 속하는 장치이다.",
    answer: true,
    explanation: "계층별 장치는 물리: 리피터, 허브, 데이터 링크: 스위치, 네트워크: 라우터다."
  },
  {
    category: "네트워크 장치",
    question: "스위치는 네트워크 계층(3계층)에 속하는 장치이다.",
    answer: false,
    explanation: "스위치는 데이터 링크 계층(2계층) 장치이고 3계층 장치는 라우터다."
  },
  {
    category: "TCP/IP 모델",
    question: "일반적 명칭의 5계층 모델은 응용, 전송, 네트워크, 데이터 링크, 물리 계층으로 구성된다.",
    answer: true,
    explanation: "TCP/IP의 네트워크 접속 계층을 데이터 링크와 물리로 나누어 5계층으로 부르기도 한다."
  },
  {
    category: "네트워크 분류",
    question: "WAN의 영역은 대략 1~100km이다.",
    answer: false,
    explanation: "1~100km는 MAN의 영역이다. LAN은 약 1km 이내, WAN은 약 100km 이상이다."
  },
  {
    category: "네트워크 분류",
    question: "요즘은 MAN과 WAN의 경계가 애매해져 MAN은 거의 사용하지 않고 WAN이 사용된다.",
    answer: true,
    explanation: "수업자료에서 MAN은 거의 사용하지 않고 WAN으로 부른다고 설명한다."
  },
  {
    category: "주소",
    question: "IPv6 주소는 32비트로 구성된다.",
    answer: false,
    explanation: "IPv6는 128비트, IPv4가 32비트다."
  },
  {
    category: "상위 계층 식별",
    question: "IPv4 헤더의 Protocol 필드 값 17은 TCP를 의미한다.",
    answer: false,
    explanation: "6이 TCP, 17이 UDP, 1이 ICMP다."
  },
  {
    category: "상위 계층 식별",
    question: "포트 번호 53은 DNS에 사용된다.",
    answer: true,
    explanation: "DNS는 TCP와 UDP 모두에서 53번 포트를 쓴다."
  },
  {
    category: "주소",
    question: "MAC 주소는 로컬 네트워크에서만 유효하다.",
    answer: true,
    explanation: "MAC 주소는 같은 네트워크 내 통신에 쓰이므로 라우터를 거칠 때마다 바뀐다."
  },
  {
    category: "신뢰성",
    question: "데이터 손실의 원인 중 큐(버퍼) 오버플로우는 오류(Error)로, 신호 감쇠는 손실(Loss)로 분류한다.",
    answer: false,
    explanation: "큐 오버플로우로 인한 삭제는 손실(Loss)이고 신호 감쇠, 잡음으로 인한 왜곡은 오류(Error)다. 분류가 반대로 되어 있다."
  },
  {
    category: "신뢰성",
    question: "큐를 갖는 모든 계층에서 패킷 손실이 발생할 수 있다.",
    answer: true,
    explanation: "손실은 큐(버퍼)에서 삭제되는 것이므로 큐를 갖는 모든 계층에서 가능하다."
  },
  {
    category: "신뢰성",
    question: "ACK는 데이터가 아니므로 데이터 전송 과정과는 다른 방식으로 처리된다.",
    answer: false,
    explanation: "ACK도 일종의 데이터라서 데이터 전송 과정과 동일하게 진행된다."
  },
  {
    category: "신뢰성",
    question: "오류를 완벽히 검출하는 방법이 없으므로 신뢰성을 제공하는 계층이 있어도 응용 계층에서 오류를 검출할 수 있다.",
    answer: true,
    explanation: "오류 검출은 전송, 네트워크, 링크 계층에서 하지만 완벽하지 않아 응용 계층에서도 검출할 수 있다."
  },
];
