// 컴퓨터네트워크_1장_OX_3세트_20문제.jsx
// 근거: 수업자료 Chapter 1 Introduction
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 Introduction OX 3세트 20문제"
};

const OX_QUESTIONS = [
  {
    category: "인터넷 구성",
    question: "인터넷은 종단 시스템(호스트), 통신 링크, 패킷 스위치로 구성된다고 볼 수 있다.",
    answer: true,
    explanation: "호스트는 네트워크 응용을 실행하고 링크는 패킷을 나르며 패킷 스위치(라우터, 스위치)는 패킷을 전달한다."
  },
  {
    category: "인터넷 구성",
    question: "통신 링크는 유선 링크만 있으며 무선 링크나 위성 링크는 포함하지 않는다.",
    answer: false,
    explanation: "통신 링크에는 광섬유, 구리선, 무선, 위성이 있다."
  },
  {
    category: "인터넷 구성",
    question: "패킷 스위치에는 라우터와 스위치가 있으며 패킷을 전달(forward)하는 역할을 한다.",
    answer: true,
    explanation: "packet switches: forward packets."
  },
  {
    category: "프로토콜",
    question: "인터넷에서 일어나는 모든 통신 활동은 프로토콜의 지배를 받는다.",
    answer: true,
    explanation: "프로토콜은 메시지의 형식과 순서, 송수신 시 취하는 행동을 정의한다."
  },
  {
    category: "엣지와 코어",
    question: "네트워크 코어는 상호 연결된 라우터들로 이루어져 데이터를 전달하는 부분이다.",
    answer: true,
    explanation: "코어는 데이터 전달, 엣지는 데이터 생산, 보유, 이용을 맡는다."
  },
  {
    category: "엣지와 코어",
    question: "네트워크 엣지의 종단 시스템은 패킷을 다른 네트워크로 라우팅해 주는 라우터이다.",
    answer: false,
    explanation: "종단 시스템은 PC, 노트북, 서버, 스마트폰 같은 호스트이고 라우팅은 코어의 라우터가 한다."
  },
  {
    category: "접속망",
    question: "접속망을 평가할 때는 대역폭뿐 아니라 공유 방식인지 전용 방식인지도 함께 고려한다.",
    answer: false,
    explanation: "수업자료는 접속망의 대역폭과 공유/전용 여부 모두를 고려하라고 한다. 따라서 대역폭만 보면 된다는 서술은 틀렸다."
  },
  {
    category: "패킷 교환",
    question: "패킷 교환에서는 메시지가 여러 패킷으로 나뉘어 전송된다.",
    answer: true,
    explanation: "호스트는 응용 메시지를 더 작은 덩어리(패킷)로 나눠 전송한다."
  },
  {
    category: "패킷 교환",
    question: "패킷 교환은 통신을 시작하기 전에 연결 설정이 필수이고 끝날 때 연결 해제를 해야 한다.",
    answer: false,
    explanation: "연결 설정과 해제의 3단계를 거치는 것은 회선 교환이다. 패킷 교환은 각 패킷이 독립적으로 라우팅된다."
  },
  {
    category: "패킷 교환",
    question: "패킷 교환은 사용자가 항상 활동하지는 않는다는 점을 이용해 회선 교환보다 더 많은 사용자를 수용할 수 있다.",
    answer: true,
    explanation: "활동 시간이 일부인 사용자들이 링크를 나누어 쓰므로 자원을 효율적으로 쓴다."
  },
  {
    category: "회선 교환",
    question: "회선 교환에서 FDM은 시간 슬롯으로, TDM은 주파수 대역으로 링크를 나눈다.",
    answer: false,
    explanation: "FDM은 주파수, TDM은 시간으로 나눈다. 설명이 뒤바뀌었다."
  },
  {
    category: "라우팅과 포워딩",
    question: "라우터는 도착한 패킷 헤더의 값을 포워딩 테이블에서 찾아 해당하는 출력 링크로 패킷을 내보낸다.",
    answer: true,
    explanation: "라우팅 알고리즘이 포워딩 테이블을 채우고 포워딩은 그 테이블로 수행한다."
  },
  {
    category: "지연과 손실",
    question: "라우터에 도착한 패킷은 항상 큐를 거치지 않고 즉시 출력 링크로 전송된다.",
    answer: false,
    explanation: "도착률이 출력 링크 용량을 일시적으로 넘으면 패킷은 큐에서 기다리며 큐잉 지연이 생긴다."
  },
  { category: "엣지와 코어", question: "서버는 주로 데이터 센터에 위치한다.",
    answer: true,
    explanation: "네트워크 엣지의 호스트는 클라이언트와 서버로 나뉘며, 서버는 흔히 데이터 센터에 있다." },
  {
    category: "지연과 손실",
    question: "패킷 손실은 큐(버퍼)가 가득 찬 상태에서 도착한 패킷이 버려져 발생할 수 있다.",
    answer: true,
    explanation: "큐의 용량은 유한하다."
  },
  { category: "접속망", question: "WiFi 802.11b/g/n의 전송률은 각각 약 11, 54, 450 Mbps이다.",
    answer: true,
    explanation: "무선 LAN(WiFi) 802.11b/g/n: 11, 54, 450 Mbps, 건물 내 약 100ft 범위." },
  { category: "회선 교환", question: "회선 교환에서는 중간 노드가 패킷 전체를 받은 뒤 다음 링크로 보내는 store-and-forward를 한다.",
    answer: false,
    explanation: "store-and-forward는 패킷 교환의 특징이다. 회선 교환은 전용 경로로 바로 전달하며 store-and-forward와 큐가 없다." },
  { category: "프로토콜 계층", question: "인터넷 프로토콜 스택에서 전송 계층은 프로세스와 프로세스 사이의 데이터 전송을 담당한다.",
    answer: true,
    explanation: "transport = 프로세스 간 데이터 전송(TCP, UDP), network = datagram 라우팅(IP), link = 이웃 간 전송." },
  {
    category: "프로토콜 계층",
    question: "계층화의 이점 중 하나는 한 계층의 구현이 바뀌어도 나머지 시스템에 영향이 없다는 것이다.",
    answer: true,
    explanation: "모듈화로 유지보수와 갱신이 쉬워진다."
  },
  {
    category: "프로토콜 계층",
    question: "IP와 라우팅 프로토콜은 인터넷 프로토콜 스택에서 전송 계층에 속한다.",
    answer: false,
    explanation: "IP와 라우팅 프로토콜은 네트워크 계층에 속한다. 전송 계층은 TCP, UDP다."
  },
];
