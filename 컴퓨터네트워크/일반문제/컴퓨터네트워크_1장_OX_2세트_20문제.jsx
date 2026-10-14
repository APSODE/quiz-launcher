// 컴퓨터네트워크_1장_OX_2세트_20문제.jsx
// 근거: 수업자료 Chapter 1 Introduction
const META = {
  group: "컴퓨터네트워크",
  unit: "1장",
  title: "1장 Introduction OX 2세트 20문제"
};

const OX_QUESTIONS = [
  {
    category: "네트워크 엣지",
    question: "네트워크 엣지의 호스트는 클라이언트와 서버로 나뉘며, 서버는 흔히 데이터 센터에 위치한다.",
    answer: true,
    explanation: "엣지에는 호스트(클라이언트, 서버)가 있고 서버는 종종 데이터 센터에 있다."
  },
  {
    category: "액세스 네트워크",
    question: "무선 LAN(802.11)은 기지국인 액세스 포인트를 통해 종단 시스템을 라우터에 연결한다.",
    answer: true,
    explanation: "무선 LAN은 건물 내(약 100피트)에서 쓰이며 base station, 즉 access point를 거친다."
  },
  {
    category: "액세스 네트워크",
    question: "셀룰러 방식의 광역 무선 접속은 건물 안 약 100피트 이내에서만 사용된다.",
    answer: false,
    explanation: "건물 내 100피트는 무선 LAN이다. 광역 무선 접속은 통신사가 제공하며 수십 km 범위다."
  },
  {
    category: "액세스 네트워크",
    question: "기업과 대학의 이더넷 액세스 네트워크에서 종단 시스템은 보통 라우터가 아니라 허브 하나에 모두 연결되며 전송률은 10 Mbps로 고정된다.",
    answer: false,
    explanation: "이더넷 액세스 네트워크의 전송률은 10 Mbps, 100 Mbps, 1 Gbps, 10 Gbps 등이며 종단 시스템은 보통 이더넷 스위치에 연결된다."
  },
  {
    category: "라우팅과 포워딩",
    question: "라우팅 알고리즘은 포워딩 테이블을 채우는 데 쓰인다.",
    answer: true,
    explanation: "라우팅 알고리즘이 출발지-목적지 경로를 정하고 그 결과가 로컬 포워딩 테이블에 반영된다."
  },
  {
    category: "패킷 교환",
    question: "패킷 교환에서 각 패킷의 헤더에는 출발지 주소, 목적지 주소, 제어 정보가 들어 있다.",
    answer: true,
    explanation: "각 패킷은 헤더를 갖고 독립적으로 라우팅된다."
  },
  {
    category: "패킷 교환",
    question: "패킷 교환에서는 모든 패킷이 같은 경로를 쓰도록 라우터가 경로를 미리 예약한다.",
    answer: false,
    explanation: "각 패킷은 독립적으로 라우팅된다. 경로와 자원을 미리 확보하는 것은 회선 교환이다."
  },
  {
    category: "회선 교환",
    question: "회선 교환에서는 사용자가 활동하지 않는 동안 할당된 자원을 다른 사용자가 자동으로 나누어 쓴다.",
    answer: false,
    explanation: "회선 교환은 자원을 전용으로 할당하므로 공유하지 않는다. 자원 공유로 더 많은 사용자를 수용하는 것은 패킷 교환이다."
  },
  {
    category: "회선 교환",
    question: "회선 교환은 연결 설정, 데이터 전송, 연결 해제의 3단계로 이루어진다.",
    answer: true,
    explanation: "3 phases: Connection Establishment, Data Transfer, Connection Released."
  },
  {
    category: "인터넷 구조",
    question: "고객 ISP와 제공자 ISP 사이에는 경제적 합의가 있으며, 경쟁하는 ISP끼리는 IXP나 피어링 링크로 연결된다.",
    answer: true,
    explanation: "글로벌 ISP 하나로는 경쟁자가 생기므로 이들을 IXP와 peering link로 연결한다."
  },
  {
    category: "인터넷 구조",
    question: "하나의 글로벌 ISP가 사업성이 있어도 경쟁자는 생기지 않으므로 ISP 간 상호 연결은 필요 없다.",
    answer: false,
    explanation: "사업성이 있으면 경쟁자가 생기고 이들은 서로 연결되어야 한다."
  },
  {
    category: "인터넷 구조",
    question: "N개의 액세스 ISP를 서로 직접 모두 연결하는 데 필요한 연결 수는 O(N) 규모로 확장성이 좋다.",
    answer: false,
    explanation: "모든 쌍을 직접 연결하면 O(N²)개가 되어 확장되지 않는다."
  },
  {
    category: "지연",
    question: "처리 지연(dproc)은 라우터의 혼잡 수준에 따라 달라진다.",
    answer: false,
    explanation: "혼잡 수준에 좌우되는 것은 큐잉 지연이다. 처리 지연은 비트 오류 검사와 출력 링크 결정에 걸리는 시간으로 보통 1ms 미만이다."
  },
  {
    category: "지연",
    question: "전송 지연은 패킷 길이 L을 링크 대역폭 R로 나눈 L/R로 구한다.",
    answer: true,
    explanation: "dtrans = L/R이다."
  },
  {
    category: "지연",
    question: "전파 속도는 약 2×10^5 m/sec 정도이다.",
    answer: false,
    explanation: "수업자료에서 전파 속도 s는 약 2×10^8 m/sec이다."
  },
  {
    category: "지연",
    question: "트래픽 강도 La/R이 0에 가까우면 평균 큐잉 지연은 작다.",
    answer: true,
    explanation: "La/R~0이면 평균 큐잉 지연이 작고 1에 가까워질수록 커진다."
  },
  {
    category: "패킷 손실",
    question: "손실된 패킷은 이전 노드나 출발지 종단 시스템이 재전송할 수도 있고, 전혀 재전송되지 않을 수도 있다.",
    answer: true,
    explanation: "Lost packet may be retransmitted by previous node, by source end system, or not at all."
  },
  {
    category: "프로토콜 계층",
    question: "인터넷 프로토콜 스택은 표현 계층과 세션 계층을 별도 계층으로 포함한다.",
    answer: false,
    explanation: "인터넷 스택은 응용, 전송, 네트워크, 링크, 물리의 5계층이다. 표현, 세션 기능이 필요하면 응용에서 구현한다."
  },
  {
    category: "캡슐화",
    question: "네트워크 계층의 데이터 단위는 세그먼트이다.",
    answer: false,
    explanation: "네트워크 계층은 데이터그램, 전송 계층이 세그먼트, 링크 계층이 프레임이다."
  },
  {
    category: "캡슐화",
    question: "링크 계층의 데이터 단위는 프레임이다.",
    answer: true,
    explanation: "응용: 메시지, 전송: 세그먼트, 네트워크: 데이터그램, 링크: 프레임이다."
  },
];
