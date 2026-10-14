// 컴퓨터네트워크_네트워크모델_OX_3세트_20문제.jsx
// 근거: 수업자료 '네트워크 모델', '데이터 흐름'
const META = {
  group: "컴퓨터네트워크",
  unit: "네트워크 모델",
  title: "네트워크 모델 OX 3세트 20문제"
};

const OX_QUESTIONS = [
  {
    category: "통신",
    question: "통신을 수행하려면 수많은 기능이 유기적으로 동작해야 하므로 이를 기능별로 나누어 체계화한 것이 네트워크 모델이다.",
    answer: true,
    explanation: "네트워크 모델은 통신 프로토콜의 체계이며 통신 관련 프로토콜을 기능별로 구분해 설명한다."
  },
  {
    category: "통신",
    question: "통신은 소수의 단순한 기능만으로 이루어지므로 기능을 계층으로 나눌 필요가 없다.",
    answer: false,
    explanation: "통신에는 수많은 기능이 필요해서 계층으로 나누어 체계적으로 설명한다."
  },
  {
    category: "응용 계층",
    question: "응용 계층은 사용자가 이용하는 애플리케이션과 직접 상호작용하며 HTTP, SMTP 등이 여기에 속한다.",
    answer: true,
    explanation: "응용 계층은 사용자 인터페이스 기능을 제공한다."
  },
  {
    category: "응용 계층",
    question: "응용 계층은 최상위 계층이라 헤더에 상위 계층을 식별하는 정보를 포함하지 않는다.",
    answer: true,
    explanation: "상위 계층 식별 정보는 링크(EtherType), 네트워크(Protocol), 전송(포트 번호) 계층 헤더에 있다."
  },
  {
    category: "표현 계층",
    question: "TCP와 UDP는 표현 계층에 속하는 프로토콜이다.",
    answer: false,
    explanation: "TCP와 UDP는 전송 계층 프로토콜이다. 표현 계층은 데이터 형식 변환, 인코딩, 암호화, 압축을 맡는다."
  },
  {
    category: "전송 계층",
    question: "전송 계층은 종단 프로세스 간 데이터 전송을 보장하기 위해 흐름 제어와 오류 제어를 수행한다.",
    answer: true,
    explanation: "전송 계층은 완전한 메시지 전달을 위해 흐름 제어, 오류 제어, 메시지 전달 기능을 수행한다."
  },
  {
    category: "네트워크 계층",
    question: "네트워크 계층은 물리적으로 직접 연결된 이웃 장치 사이의 데이터 전달을 맡는다.",
    answer: false,
    explanation: "이웃 장치 간 전달은 데이터 링크 계층의 역할이다. 네트워크 계층은 목적지까지의 경로 설정을 맡는다."
  },
  {
    category: "데이터 링크 계층",
    question: "데이터 링크 계층은 프레임 전송과 함께 에러 검출 및 복구, 매체 접근 제어를 수행한다.",
    answer: true,
    explanation: "데이터 링크 계층은 이웃 장치 간 프레임 전달, 오류 검출, MAC 기능을 담당한다."
  },
  {
    category: "물리 계층",
    question: "물리 계층은 프레임 단위로 오류를 검출하고 복구하며 매체 접근을 제어한다.",
    answer: false,
    explanation: "그것은 데이터 링크 계층의 기능이다. 물리 계층은 비트를 신호로 바꿔 전송하고 수신한 신호에서 비트를 찾아낸다."
  },
  {
    category: "택배 비유",
    question: "택배 비유에서 네트워크 계층은 도로 표지판처럼 목적지 방향(경로)을 정하는 역할에 해당한다.",
    answer: true,
    explanation: "네트워크 계층은 도로 표지판(경로 설정), 데이터 링크 계층은 신호등(전송 순서 결정), 물리 계층은 차량 이동에 비유된다."
  },
  {
    category: "택배 비유",
    question: "전송 계층은 현재 지점에서 다음 지점까지 소포장이 안전히 전달되는지를 책임진다.",
    answer: false,
    explanation: "그 역할은 데이터 링크 계층이다. 전송 계층은 소포장 화물이 목적지에 잘 도착했는지(종단 간)를 확인한다."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP는 논리적 연결을 설정하는 연결형 서비스를 제공한다.",
    answer: true,
    explanation: "TCP/IP 전송 계층에서 TCP는 연결형 서비스를 제공한다."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 모델의 인터넷 계층은 신뢰도, 흐름 제어, 에러 제어를 위한 재전송을 책임진다.",
    answer: false,
    explanation: "재전송 책임은 전송 계층에 있다. 인터넷 계층은 경로 설정과 패킷 스위칭을 담당한다."
  },
  {
    category: "네트워크 분류",
    question: "LAN은 도시 전체 규모의 지역을 연결하는 네트워크이다.",
    answer: false,
    explanation: "도시 정도의 지역은 MAN이고 LAN은 PC방, 사무실, 학교처럼 한정된 좁은 지역이다."
  },
  {
    category: "네트워크 분류",
    question: "LAN은 일반적으로 사용자의 장치를 포함하지 않고 라우터와 회선만으로 구성된다.",
    answer: false,
    explanation: "LAN은 컴퓨터, 서버, 스마트폰, 노트북 등 사용자의 장치를 포함한다."
  },
  {
    category: "네트워크 분류",
    question: "WAN은 두 개 이상의 LAN을 넓은 지역에 걸쳐 연결하는 광역 네트워크이다.",
    answer: true,
    explanation: "WAN의 예로 통신사 망이 있다."
  },
  {
    category: "네트워크 분류",
    question: "인터넷은 하나의 거대한 LAN이다.",
    answer: false,
    explanation: "인터넷은 전 세계의 수많은 LAN과 WAN이 연결된 거대한 네트워크이다."
  },
  {
    category: "상위 계층 식별",
    question: "수신 호스트는 IP 헤더의 포트 번호를 보고 TCP인지 UDP인지 판단한다.",
    answer: false,
    explanation: "TCP인지 UDP인지는 IP 헤더의 Protocol 필드로 판단한다. 포트 번호는 TCP/UDP 헤더에서 응용 프로토콜을 식별한다."
  },
  {
    category: "상위 계층 식별",
    question: "포트 번호는 운영체제가 받은 데이터를 어떤 응용 프로그램에 전달할지 결정하는 데 쓰인다.",
    answer: true,
    explanation: "전송 계층 헤더의 포트 번호가 응용 계층 프로토콜과 프로그램을 식별한다."
  },
  {
    category: "신뢰성",
    question: "TCP는 데이터와 ACK에 순서 번호를 사용해 종단 간 신뢰성을 제공한다.",
    answer: true,
    explanation: "전송 계층 재전송(TCP)은 종단 간 신뢰성을 제공하며 순서 번호를 사용한다."
  },
];
