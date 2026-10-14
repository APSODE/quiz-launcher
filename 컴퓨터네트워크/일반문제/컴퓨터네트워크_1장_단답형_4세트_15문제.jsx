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
  {
    category: "노달 지연",
    question: "처리 지연은 비트 오류를 검사하는 것과 무엇을 결정하는 데 걸리는 시간인가?",
    answers: ["출력 링크", "출력링크", "output link", "출력 링크 결정", "내보낼 링크", "다음 링크"],
    displayAnswer: "출력 링크",
    explanation: "dproc: check bit errors, determine output link."
  },
  {
    category: "전송 지연",
    question: "전송 지연 dtrans = L / (    ) 에서 빈칸은?",
    answers: ["r", "링크 대역폭", "대역폭", "링크 전송률", "전송률", "링크 대역폭 r", "bandwidth", "링크 용량"],
    displayAnswer: "R(링크 대역폭)",
    explanation: "L은 패킷 길이, R은 링크 대역폭이다."
  },
  {
    category: "전파 지연",
    question: "전파 지연 dprop = (    ) / s 에서 빈칸은?",
    answers: ["d", "링크 길이", "물리 링크 길이", "링크의 길이", "물리적 링크 길이", "거리", "링크 길이 d"],
    displayAnswer: "d(물리 링크 길이)",
    explanation: "s는 전파 속도다."
  },
  {
    category: "트래픽 강도",
    question: "트래픽 강도 La/R에서 a는 무엇을 나타내는가?",
    answers: ["평균 패킷 도착률", "패킷 도착률", "평균 도착률", "도착률", "평균 패킷 도착 속도", "average packet arrival rate", "packet arrival rate"],
    displayAnswer: "평균 패킷 도착률",
    explanation: "L은 패킷 길이, R은 링크 대역폭이다."
  },
  {
    category: "전송 지연",
    question: "패킷 길이 4000비트를 1 Mbps 링크로 전송할 때 전송 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["4", "4.0", "4.00", "4ms", "4 ms", "4.0ms", "4.0 ms", "4.00ms", "4.00 ms", "4밀리초", "4 밀리초", "4.0밀리초", "4.0 밀리초", "4.00밀리초", "4.00 밀리초", "4msec", "4 msec", "4.0msec", "4.0 msec", "4.00msec", "4.00 msec"],
    displayAnswer: "4ms",
    hint: "L/R",
    explanation: "4000/10^6 = 0.004초 = 4ms."
  },
  {
    category: "저장 후 전달",
    question: "링크 3개(라우터 2개)를 지나는 경로에서 각 링크의 전송 지연이 2ms일 때, 패킷 1개가 저장 후 전달 방식으로 목적지까지 가는 데 걸리는 시간은 몇 ms인가? (전송 지연만 고려, 숫자만 입력)",
    answers: ["6", "6.0", "6.00", "6ms", "6 ms", "6.0ms", "6.0 ms", "6.00ms", "6.00 ms", "6밀리초", "6 밀리초", "6.0밀리초", "6.0 밀리초", "6.00밀리초", "6.00 밀리초", "6msec", "6 msec", "6.0msec", "6.0 msec", "6.00msec", "6.00 msec"],
    displayAnswer: "6ms",
    hint: "링크마다 L/R",
    explanation: "링크마다 패킷 전체를 전송하는 2ms가 걸리므로 3×2=6ms다."
  },
  {
    category: "노달 지연",
    question: "처리 지연 0.5ms, 큐잉 지연 3ms, 전송 지연 2ms, 전파 지연 4.5ms일 때 노달 지연은 몇 ms인가? (숫자만 입력)",
    answers: ["10", "10.0", "10.00", "10ms", "10 ms", "10.0ms", "10.0 ms", "10.00ms", "10.00 ms", "10밀리초", "10 밀리초", "10.0밀리초", "10.0 밀리초", "10.00밀리초", "10.00 밀리초", "10msec", "10 msec", "10.0msec", "10.0 msec", "10.00msec", "10.00 msec"],
    displayAnswer: "10ms",
    hint: "네 가지 지연의 합",
    explanation: "dnodal = dproc+dqueue+dtrans+dprop = 0.5+3+2+4.5 = 10ms."
  },
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
