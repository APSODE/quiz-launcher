// 근거: 수업자료 Chapter 3 Transport Layer, Checksum (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "3장",
  title: "3장 모의고사 1회",
  topic: "OX + 빈칸 + rdt · GBN/SR · TCP seq/ACK · 체크섬"
};

const QUESTIONS = [

  // ===== 1번 OX (20문제) =====
  {
    category: "체크섬",
    question: "UDP 체크섬은 의사 헤더, UDP 헤더, 응용 계층에서 온 데이터를 모두 계산 대상으로 한다.",
    answer: true,
    explanation: "UDP/TCP 체크섬은 IP 체크섬과 달리 세 부분을 포함한다."
  },
  {
    category: "체크섬",
    question: "IP 체크섬은 IP 헤더와 그 뒤의 데이터 전체를 계산 대상으로 한다.",
    answer: false,
    explanation: "IP 체크섬은 IP 헤더만 16비트 단위로 나누어 더한 뒤 보수를 취한다."
  },
  {
    category: "rdt",
    question: "rdt2.0에서 ACK나 NAK가 손상될 수 있으므로 송신자가 단순히 재전송하면 중복 패킷이 생길 수 있고, 이를 구분하려면 순서 번호가 필요하다.",
    answer: true,
    explanation: "중복 패킷 처리를 위해 순서 번호를 추가한 것이 rdt2.1이다."
  },
  {
    category: "rdt",
    question: "rdt3.0의 타이머는 데이터나 ACK의 손실에 대처하기 위해 필요하다.",
    answer: true,
    explanation: "타임아웃이 나면 재전송한다."
  },
  {
    category: "파이프라이닝",
    question: "파이프라이닝에서는 확인되지 않은 패킷을 여러 개 보낼 수 있으므로 순서 번호의 범위를 줄여도 된다.",
    answer: false,
    explanation: "순서 번호의 범위를 늘려야 하고 송신자나 수신자에 버퍼링이 필요하다."
  },
  {
    category: "GBN",
    question: "GBN 수신자는 순서가 어긋나게 도착한 패킷을 버퍼에 저장해 둔다.",
    answer: false,
    explanation: "GBN은 순서가 어긋난 패킷을 버리며 수신 버퍼가 없다."
  },
  {
    category: "GBN",
    question: "GBN 송신자의 타이머는 ACK를 받지 못한 가장 오래된 패킷에 대한 1개이다.",
    answer: true,
    explanation: "타임아웃되면 윈도우 안의 확인되지 않은 패킷을 모두 재전송한다."
  },
  {
    category: "SR",
    question: "SR 수신자는 정상적으로 받은 각 패킷에 대해 개별 ACK를 보낸다.",
    answer: true,
    explanation: "SR은 개별 ACK를 사용하고 수신 버퍼가 있다."
  },
  {
    category: "SR",
    question: "SR 송신자는 타임아웃이 나면 확인되지 않은 모든 패킷을 다시 보낸다.",
    answer: false,
    explanation: "SR은 패킷마다 타이머가 있고 타임아웃된 해당 패킷만 재전송한다."
  },
  {
    category: "SR",
    question: "SR에서 송신 윈도우 크기가 SN, 수신 윈도우 크기가 RN일 때 순서 번호 공간은 SN + RN 이상이어야 한다.",
    answer: true,
    explanation: "그렇지 않으면 수신자가 중복 패킷을 새 패킷으로 받아들이는 문제가 생긴다."
  },
  {
    category: "TCP",
    question: "TCP의 순서 번호는 전송한 세그먼트의 개수를 센 값이다.",
    answer: false,
    explanation: "TCP 순서 번호는 바이트 스트림 상에서 세그먼트 데이터의 첫 번째 바이트 번호이다."
  },
  {
    category: "TCP",
    question: "TCP의 ACK 번호는 수신자가 다음에 받기를 기대하는 바이트의 번호이다.",
    answer: true,
    explanation: "누적 ACK이며 다음 기대 바이트 번호이다."
  },
  {
    category: "TCP",
    question: "TCP 사양은 순서가 어긋난 세그먼트를 수신 측이 어떻게 처리할지 정해 놓고 있다.",
    answer: false,
    explanation: "사양은 정하지 않으며 구현자에게 맡겨져 있다."
  },
  {
    category: "RTT",
    question: "Karn 알고리즘에 따르면 재전송된 세그먼트에 대한 ACK는 RTT 측정에 사용하지 않는다.",
    answer: true,
    explanation: "ACK가 원본의 것인지 재전송본의 것인지 알 수 없기 때문이다."
  },
  {
    category: "RTT",
    question: "TimeoutInterval은 EstimatedRTT에 4 × DevRTT를 더한 값이다.",
    answer: true,
    explanation: "DevRTT가 크면 안전 마진도 커진다."
  },
  {
    category: "TCP 연결",
    question: "SYN 세그먼트는 데이터를 실을 수 없지만 순서 번호를 1개 소비한다.",
    answer: true,
    explanation: "SYN과 FIN은 데이터가 없어도 순서 번호를 1개 소비한다."
  },
  {
    category: "TCP 연결",
    question: "데이터를 싣지 않은 순수 ACK 세그먼트도 순서 번호를 1개 소비한다.",
    answer: false,
    explanation: "데이터가 없는 ACK는 순서 번호를 소비하지 않는다."
  },
  {
    category: "역다중화",
    question: "UDP 소켓은 출발지 IP, 출발지 포트, 목적지 IP, 목적지 포트의 4-튜플로 식별된다.",
    answer: false,
    explanation: "UDP 소켓은 목적지 IP와 목적지 포트로 식별되고 4-튜플로 식별하는 것은 TCP이다."
  },
  {
    category: "TCP",
    question: "송신자는 중복 ACK 3개를 받으면 타임아웃이 만료될 때까지 기다린 뒤에야 재전송한다.",
    answer: false,
    explanation: "빠른 재전송은 중복 ACK 3개를 받으면 타임아웃을 기다리지 않고 바로 재전송한다."
  },
  {
    category: "rdt",
    question: "rdt3.0은 정확하지만 정지-대기 방식이라 링크 이용률이 높다.",
    answer: false,
    explanation: "정지-대기는 링크 이용률이 매우 낮아 성능이 좋지 않다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "GBN",
    question: "GBN 수신자가 순서에 맞게 받은 마지막 패킷의 번호를 알리는 ACK 방식을 (        ) ACK라 한다.",
    answers: ["누적", "cumulative", "누적 ack", "누적ack"],
    displayAnswer: "누적(cumulative)",
    explanation: "GBN은 누적 ACK, SR은 개별 ACK를 사용한다."
  },
  {
    category: "SR",
    question: "SR에서 수신자가 순서가 어긋난 패킷을 (        )에 저장해 두었다가 순서대로 상위 계층에 전달한다.",
    answers: ["버퍼", "수신 버퍼", "buffer", "버퍼링"],
    displayAnswer: "버퍼",
    explanation: "SR은 수신 버퍼가 있고 GBN과 정지-대기에는 없다."
  },
  {
    category: "TCP",
    question: "TCP는 메시지 경계가 없는 신뢰적이고 순서가 보장되는 바이트 (        )이다.",
    answers: ["스트림", "stream", "바이트 스트림"],
    displayAnswer: "스트림",
    explanation: "reliable, in-order byte stream: no message boundaries."
  },
  {
    category: "TCP",
    question: "TCP 수신자가 순서가 어긋난 높은 번호의 세그먼트를 받아 간격을 탐지하면 즉시 다음에 기대하는 번호를 담은 (        ) ACK를 보낸다.",
    answers: ["중복", "duplicate", "중복 ack", "dup", "duplicate ack"],
    displayAnswer: "중복(duplicate)",
    explanation: "빈 곳을 알리기 위해 중복 ACK를 즉시 보낸다."
  },
  {
    category: "UDP",
    question: "UDP는 헤더에 출발지 포트, 목적지 포트, 길이, (        )를 가진다.",
    answers: ["체크섬", "checksum"],
    displayAnswer: "체크섬",
    explanation: "UDP 헤더는 8바이트로 이 네 필드로 구성된다."
  },
  {
    category: "RTT",
    question: "TCP가 SampleRTT를 측정할 때 한 번에 진행하는 측정은 (        )개이다. (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1개", "1 개", "1.0개", "1.0 개", "1.00개", "1.00 개"],
    displayAnswer: "1",
    explanation: "한 시점에 하나의 측정만 진행하며 측정이 겹치지 않는다."
  },

  // ===== 3번 정지-대기 이용률 (4문제) =====
  {
    category: "rdt3.0",
    question: "정지-대기 방식 rdt3.0을 쓰는 송신자가 길이 10000비트의 패킷을 전송률 1 Mbps 링크로 보낸다. 왕복 전파 시간(RTT)은 30 ms이고 ACK의 전송 시간은 무시한다.\n패킷 하나의 전송 지연 L/R은 몇 ms인가? (숫자만 입력)",
    answers: ["10", "10.0", "10.00", "10ms", "10 ms", "10.0ms", "10.0 ms", "10.00ms", "10.00 ms", "10밀리초", "10 밀리초", "10.0밀리초", "10.0 밀리초", "10.00밀리초", "10.00 밀리초", "10msec", "10 msec", "10.0msec", "10.0 msec", "10.00msec", "10.00 msec"],
    displayAnswer: "10 ms",
    explanation: "10000 / 10^6 = 0.01초 = 10 ms."
  },
  {
    category: "rdt3.0",
    question: "정지-대기 방식 rdt3.0을 쓰는 송신자가 길이 10000비트의 패킷을 전송률 1 Mbps 링크로 보낸다. 왕복 전파 시간(RTT)은 30 ms이고 ACK의 전송 시간은 무시한다.\n첫 비트를 보낸 뒤 ACK가 도착해 다음 패킷을 보낼 수 있을 때까지(RTT + L/R) 몇 ms인가? (숫자만 입력)",
    answers: ["40", "40.0", "40.00", "40ms", "40 ms", "40.0ms", "40.0 ms", "40.00ms", "40.00 ms", "40밀리초", "40 밀리초", "40.0밀리초", "40.0 밀리초", "40.00밀리초", "40.00 밀리초", "40msec", "40 msec", "40.0msec", "40.0 msec", "40.00msec", "40.00 msec"],
    displayAnswer: "40 ms",
    explanation: "30 + 10 = 40 ms."
  },
  {
    category: "rdt3.0",
    question: "정지-대기 방식 rdt3.0을 쓰는 송신자가 길이 10000비트의 패킷을 전송률 1 Mbps 링크로 보낸다. 왕복 전파 시간(RTT)은 30 ms이고 ACK의 전송 시간은 무시한다.\n송신자 이용률은 얼마인가? (소수로 입력)",
    answers: ["0.25", "0.250", "0.2500"],
    displayAnswer: "0.25",
    explanation: "송신자가 전송에 쓰는 시간은 40 ms 중 10 ms이므로 10/40 = 0.25."
  },
  {
    category: "파이프라이닝",
    question: "정지-대기 방식 rdt3.0을 쓰는 송신자가 길이 10000비트의 패킷을 전송률 1 Mbps 링크로 보낸다. 왕복 전파 시간(RTT)은 30 ms이고 ACK의 전송 시간은 무시한다.\n패킷 3개를 연속으로 보내는 파이프라이닝을 쓰면 이용률은 얼마가 되는가? (소수로 입력)",
    answers: ["0.75", "0.750", "0.7500"],
    displayAnswer: "0.75",
    explanation: "3개 파이프라이닝은 이용률을 3배로 늘리므로 0.25 × 3 = 0.75."
  },

  // ===== 4번 GBN과 SR 시나리오 (6문제) =====
  {
    category: "GBN",
    question: "[GBN] 송신자가 윈도우 크기 5로 패킷 0, 1, 2, 3, 4를 연속 전송했고 패킷 1만 손실되었다. 나머지 패킷은 모두 수신 측에 도착했고 ACK는 손실되지 않는다.\n수신자가 패킷 3을 받았을 때 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["0", "0.0", "0.00"],
    displayAnswer: "0",
    explanation: "패킷 1이 빠졌으므로 순서에 맞게 받은 마지막 패킷인 0에 대해 다시 ACK(0)를 보낸다."
  },
  {
    category: "GBN",
    question: "[GBN] 송신자가 윈도우 크기 5로 패킷 0, 1, 2, 3, 4를 연속 전송했고 패킷 1만 손실되었다. 나머지 패킷은 모두 수신 측에 도착했고 ACK는 손실되지 않는다.\n패킷 1의 타이머가 만료되면 송신자가 재전송하는 패킷은 모두 몇 개인가? (숫자만 입력)",
    answers: ["4", "4.0", "4.00", "4개", "4 개", "4.0개", "4.0 개", "4.00개", "4.00 개"],
    displayAnswer: "4개",
    explanation: "패킷 1과 그 이후에 보낸 2, 3, 4를 모두 재전송한다."
  },
  {
    category: "GBN",
    question: "[GBN] 송신자가 윈도우 크기 5로 패킷 0, 1, 2, 3, 4를 연속 전송했고 패킷 1만 손실되었다. 나머지 패킷은 모두 수신 측에 도착했고 ACK는 손실되지 않는다.\n수신자가 버퍼에 저장해 두는 패킷은 몇 개인가? (숫자만 입력)",
    answers: ["0", "0.0", "0.00", "0개", "0 개", "0.0개", "0.0 개", "0.00개", "0.00 개"],
    displayAnswer: "0개",
    explanation: "GBN 수신자는 순서가 어긋난 패킷을 버리며 버퍼가 없다."
  },
  {
    category: "SR",
    question: "[SR] 송신자가 윈도우 크기 5로 패킷 0, 1, 2, 3, 4를 연속 전송했고 패킷 1만 손실되었다. 나머지 패킷은 모두 수신 측에 도착했고 ACK는 손실되지 않는다.\n수신자가 패킷 3을 받았을 때 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["3", "3.0", "3.00"],
    displayAnswer: "3",
    explanation: "SR은 받은 패킷마다 개별 ACK를 보낸다."
  },
  {
    category: "SR",
    question: "[SR] 송신자가 윈도우 크기 5로 패킷 0, 1, 2, 3, 4를 연속 전송했고 패킷 1만 손실되었다. 나머지 패킷은 모두 수신 측에 도착했고 ACK는 손실되지 않는다.\n패킷 1의 타이머가 만료되면 송신자가 재전송하는 패킷은 몇 개인가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1개", "1 개", "1.0개", "1.0 개", "1.00개", "1.00 개"],
    displayAnswer: "1개",
    explanation: "SR은 타임아웃된 패킷 1만 재전송한다."
  },
  {
    category: "SR",
    question: "송신 윈도우 크기가 5, 수신 윈도우 크기가 3인 SR이 문제없이 동작하기 위해 필요한 순서 번호 공간의 최소 크기는? (숫자만 입력)",
    answers: ["8", "8.0", "8.00"],
    displayAnswer: "8",
    explanation: "순서 번호 공간 ≥ SN + RN = 5 + 3 = 8."
  },

  // ===== 5번 TCP 순서 번호와 ACK (3문제) =====
  {
    category: "TCP seq",
    question: "호스트 A가 TCP로 데이터를 보낸다. 첫 세그먼트의 순서 번호는 1000이고 데이터 크기는 200바이트, 이어서 300바이트 세그먼트, 100바이트 세그먼트를 연속으로 보낸다.\n두 번째 세그먼트의 순서 번호는? (숫자만 입력)",
    answers: ["1200", "1200.0", "1200.00"],
    displayAnswer: "1200",
    explanation: "1000 + 200 = 1200."
  },
  {
    category: "TCP ACK",
    question: "호스트 A가 TCP로 데이터를 보낸다. 첫 세그먼트의 순서 번호는 1000이고 데이터 크기는 200바이트, 이어서 300바이트 세그먼트, 100바이트 세그먼트를 연속으로 보낸다.\n세 세그먼트가 모두 정상적으로 도착했을 때 수신자가 보내는 누적 ACK 번호는? (숫자만 입력)",
    answers: ["1600", "1600.0", "1600.00"],
    displayAnswer: "1600",
    explanation: "다음에 기대하는 바이트 번호는 1000 + 200 + 300 + 100 = 1600."
  },
  {
    category: "TCP ACK",
    question: "호스트 A가 TCP로 데이터를 보낸다. 첫 세그먼트의 순서 번호는 1000이고 데이터 크기는 200바이트, 이어서 300바이트 세그먼트, 100바이트 세그먼트를 연속으로 보낸다.\n세 번째 세그먼트가 손실되어 앞의 두 세그먼트만 도착했다면 수신자가 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["1500", "1500.0", "1500.00"],
    displayAnswer: "1500",
    explanation: "다음 기대 바이트는 1000 + 200 + 300 = 1500."
  },

  // ===== 6번 체크섬 (3문제) =====
  {
    category: "체크섬",
    question: "8비트 단위의 세 워드 10110011, 01101110, 11000001에 대해 1의 보수 합으로 체크섬을 구한다. 합에서 8비트를 넘는 올림수는 제거하고 다시 더한다.\n세 워드의 1의 보수 합을 8비트로 쓰시오.",
    answers: ["11100011", "1110 0011", "1110-0011"],
    displayAnswer: "11100011",
    explanation: "올림수가 생기면 떼어 내 합의 맨 오른쪽에 더하는 과정을 거쳐 1의 보수 합을 구한다."
  },
  {
    category: "체크섬",
    question: "8비트 단위의 세 워드 10110011, 01101110, 11000001에 대해 1의 보수 합으로 체크섬을 구한다. 합에서 8비트를 넘는 올림수는 제거하고 다시 더한다.\n체크섬(1의 보수 합의 보수)을 8비트로 쓰시오.",
    answers: ["00011100", "0001 1100", "0001-1100"],
    displayAnswer: "00011100",
    explanation: "합의 각 비트를 반전한 값이다."
  },
  {
    category: "체크섬",
    question: "수신자가 모든 워드와 체크섬을 1의 보수로 모두 더했을 때 오류가 없다면 결과는 8비트로 어떻게 되는가?",
    answers: ["11111111", "1111 1111", "1111-1111"],
    displayAnswer: "11111111",
    explanation: "합과 그 보수를 더하면 모든 비트가 1이 되며, 이 값이 아니면 오류가 있다."
  },
];
