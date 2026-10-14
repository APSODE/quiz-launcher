// 컴퓨터네트워크_네트워크모델_OX_4세트_20문제.jsx
// 근거: 수업자료 '네트워크 모델', '데이터 흐름'
const META = {
  group: "컴퓨터네트워크",
  unit: "네트워크 모델",
  title: "네트워크 모델 OX 4세트 20문제"
};

const OX_QUESTIONS = [
  {
    category: "OSI 모델",
    question: "OSI 모델은 컴퓨터 통신 구조와 앞으로 개발될 프로토콜의 표준적인 뼈대를 제공하기 위한 참조 모델이다.",
    answer: true,
    explanation: "OSI는 ISO가 개발한 참조 모델이다."
  },
  {
    category: "OSI 모델",
    question: "OSI 모델은 통신 관련 프로토콜을 기능별로 나누어 설명한다.",
    answer: true,
    explanation: "7개 계층으로 기능을 구분해 설명한다."
  },
  {
    category: "캡슐화",
    question: "수신 측에서는 각 계층이 자신의 헤더를 제거하면서 데이터를 상위 계층으로 올려 보낸다.",
    answer: true,
    explanation: "이 과정이 디캡슐화이다."
  },
  {
    category: "주소",
    question: "이더넷 헤더의 목적지 MAC 주소는 다음 수신자(다음 장치)의 MAC 주소이다.",
    answer: true,
    explanation: "MAC 주소는 로컬 네트워크에서만 유효하며 홉마다 바뀐다."
  },
  {
    category: "데이터 흐름",
    question: "송신 측 전송 계층은 TCP 헤더를 추가하고 포트 번호로 응용 계층 프로토콜을 식별하게 한다.",
    answer: true,
    explanation: "예를 들어 80은 HTTP를 뜻한다."
  },
  {
    category: "IP 주소",
    question: "IPv4 주소는 0~255 범위의 숫자 4개로 구성된 32비트 주소이다.",
    answer: true,
    explanation: "예: 192.168.0.1"
  },
  {
    category: "주소",
    question: "IP 주소는 네트워크 계층(3계층)에서, MAC 주소는 데이터 링크 계층(2계층)에서 사용한다.",
    answer: true,
    explanation: "IP는 논리적 주소, MAC은 물리적 주소이다."
  },
  {
    category: "링크 주소",
    question: "WAN 내부 구간에서 전용 회선이나 PPP를 쓰면 MAC 대신 해당 기술의 주소 체계를 사용할 수 있다.",
    answer: true,
    explanation: "Ethernet/Wi-Fi 링크를 쓰는 구간에서만 MAC 주소가 필요하다."
  },
  {
    category: "링크 주소",
    question: "LAN 내부 장치 간 통신은 대부분 Ethernet이나 Wi-Fi를 사용하며 MAC 주소가 필요하다.",
    answer: true,
    explanation: "LAN 구간은 대부분 Ethernet/Wi-Fi이다."
  },
  {
    category: "신뢰성",
    question: "잡음과 간섭은 외부 전자기파나 열잡음 등이 신호에 섞여 데이터를 왜곡시키는 현상으로 오류의 원인이 된다.",
    answer: true,
    explanation: "오류(Error)의 원인에는 신호 감쇠와 잡음, 간섭이 있다."
  },
  {
    category: "데이터 흐름",
    question: "이더넷 헤더의 출발지 MAC 주소는 최초 송신자의 MAC 주소이며 전송 과정에서 변하지 않는다.",
    answer: false,
    explanation: "출발지 MAC은 현재 송신자의 MAC이며 라우터를 거칠 때마다 바뀐다."
  },
  {
    category: "주소",
    question: "MAC 주소는 인터넷을 통해 멀리 떨어진 호스트로 패킷을 라우팅하는 데 사용된다.",
    answer: false,
    explanation: "멀리 떨어진 호스트로의 라우팅은 IP 주소로 한다. MAC은 같은 네트워크 내 통신용이다."
  },
  {
    category: "신뢰성",
    question: "링크 계층 재전송은 종단 간 신뢰성을 제공한다.",
    answer: false,
    explanation: "링크 계층 재전송은 이웃 장치 간 신뢰성을, 전송 계층(TCP) 재전송이 종단 간 신뢰성을 제공한다."
  },
  {
    category: "신뢰성",
    question: "오류 검출은 응용 계층에서만 이루어진다.",
    answer: false,
    explanation: "오류 검출은 전송, 네트워크, 링크 계층에서 실행되며 완벽하지 않아 응용 계층에서도 검출할 수 있다."
  },
  {
    category: "상위 계층 식별",
    question: "전송 계층 헤더는 상위 계층을 식별하기 위해 EtherType 필드를 사용한다.",
    answer: false,
    explanation: "EtherType은 이더넷 헤더에 있다. 전송 계층은 포트 번호를 사용한다."
  },
  {
    category: "TCP/IP 모델",
    question: "TCP/IP 모델의 전송 계층에서 TCP는 비연결형 서비스를 제공한다.",
    answer: false,
    explanation: "TCP는 연결형 서비스를 제공한다."
  },
  {
    category: "데이터 흐름",
    question: "라우터를 거칠 때마다 최초 송신자의 IP 주소가 현재 라우터의 IP 주소로 바뀐다.",
    answer: false,
    explanation: "IP 주소는 종단 간 유지되며 전송 과정에서 변경되지 않는다."
  },
  {
    category: "네트워크 장치",
    question: "허브와 리피터는 데이터 링크 계층에서 프레임의 MAC 주소를 보고 전달한다.",
    answer: false,
    explanation: "허브와 리피터는 물리 계층 장치이다. MAC 주소를 보는 것은 데이터 링크 계층의 스위치이다."
  },
  {
    category: "네트워크 분류",
    question: "MAN은 LAN보다 작은 범위(약 1km 이내)의 네트워크이다.",
    answer: false,
    explanation: "MAN은 LAN과 WAN의 중간 영역(약 1~100km)이다."
  },
  {
    category: "상위 계층 식별",
    question: "IPv4 헤더의 Protocol 필드는 이더넷 프레임의 상위 프로토콜이 IP인지 ARP인지를 알려 준다.",
    answer: false,
    explanation: "IP인지 ARP인지는 이더넷 헤더의 EtherType이 알려 준다. Protocol 필드는 TCP, UDP, ICMP 등 전송 계층 프로토콜을 식별한다."
  },
];
