// 근거: 수업자료 Chapter 3 Transport Layer, Checksum (기출 형식: OX + 빈칸 + 복합 문제)
const META = {
  group: "컴퓨터네트워크",
  unit: "3장",
  title: "3장 모의고사 2회",
  topic: "OX + 빈칸 + 혼잡 제어 · RTT · 핸드셰이크 · 흐름 제어"
};

const QUESTIONS = [

  // ===== 1번 OX (20문제) =====
  {
    category: "혼잡",
    question: "혼잡 제어와 흐름 제어는 같은 개념이다.",
    answer: false,
    explanation: "흐름 제어는 수신자의 버퍼를 보호하고 혼잡 제어는 네트워크 과부하를 다룬다."
  },
  {
    category: "혼잡",
    question: "혼잡의 징후로는 패킷 손실(라우터 버퍼 오버플로)과 긴 지연(큐잉)이 있다.",
    answer: true,
    explanation: "too many sources sending too much data too fast."
  },
  {
    category: "혼잡",
    question: "라우터 버퍼가 무한하고 재전송이 없어도 도착률이 링크 용량에 가까워지면 지연이 매우 커진다.",
    answer: true,
    explanation: "도착률이 용량에 접근하면 큐잉 지연이 커진다."
  },
  {
    category: "혼잡",
    question: "불필요한 재전송은 같은 패킷의 복사본이 링크를 여러 번 지나가게 만들어 굿풋을 떨어뜨린다.",
    answer: true,
    explanation: "혼잡의 비용 중 하나이다."
  },
  {
    category: "혼잡",
    question: "다중 홉 경로에서 패킷이 버려지면 그 패킷이 앞서 사용한 상류 링크의 전송 용량이 낭비된다.",
    answer: true,
    explanation: "scenario 3의 비용이다."
  },
  {
    category: "TCP 혼잡 제어",
    question: "TCP 송신자는 타임아웃이나 3개의 중복 ACK를 손실 이벤트로 인식한다.",
    answer: true,
    explanation: "손실 이벤트 후 송신 속도(cwnd)를 줄인다."
  },
  {
    category: "TCP 혼잡 제어",
    question: "AIMD는 손실이 없으면 cwnd를 RTT마다 1 MSS씩 늘리고 손실이 나면 절반으로 줄인다.",
    answer: true,
    explanation: "가산 증가, 곱셈 감소의 톱니 모양이다."
  },
  {
    category: "슬로 스타트",
    question: "슬로 스타트에서는 cwnd가 1 MSS에서 시작해 매 RTT마다 두 배가 된다.",
    answer: true,
    explanation: "ACK를 받을 때마다 cwnd를 1 MSS씩 증가시켜 지수적으로 커진다."
  },
  {
    category: "슬로 스타트",
    question: "슬로 스타트에서 cwnd는 RTT마다 1 MSS씩 선형으로 증가한다.",
    answer: false,
    explanation: "슬로 스타트는 지수 증가이고 선형 증가는 혼잡 회피이다."
  },
  {
    category: "혼잡 회피",
    question: "cwnd가 ssthresh보다 작을 때 혼잡 회피가 시작된다.",
    answer: false,
    explanation: "cwnd가 ssthresh 이상이 되면 혼잡 회피가 시작되며 그 전은 슬로 스타트이다."
  },
  {
    category: "TCP 혼잡 제어",
    question: "타임아웃이 발생하면 ssthresh를 cwnd/2로 하고 cwnd를 1 MSS로 줄여 슬로 스타트로 들어간다.",
    answer: true,
    explanation: "Tahoe는 3 중복 ACK에서도 cwnd를 1로 한다."
  },
  {
    category: "TCP 연결",
    question: "TCP 연결 종료에서 마지막 ACK를 보낸 클라이언트는 TIME_WAIT 상태에 머물며 재전송된 FIN에 ACK로 응답할 수 있다.",
    answer: true,
    explanation: "timed wait는 최대 세그먼트 수명의 2배 동안이다."
  },
  {
    category: "TCP 연결",
    question: "3-way handshake의 세 번째 세그먼트(ACK)에는 클라이언트의 데이터가 실릴 수 있다.",
    answer: true,
    explanation: "this segment may contain client-to-server data."
  },
  {
    category: "흐름 제어",
    question: "TCP 송신자는 수신자의 rwnd와 상관없이 확인되지 않은 데이터를 보낼 수 있다.",
    answer: false,
    explanation: "송신자는 in-flight 데이터를 rwnd 이하로 제한해 수신 버퍼 오버플로를 막는다."
  },
  {
    category: "연결 설정",
    question: "2-way handshake는 지연, 재전송, 순서 뒤바뀜이 있어도 항상 올바르게 연결을 설정한다.",
    answer: false,
    explanation: "반쯤 열린 연결이 생기는 등 실패 시나리오가 있어 3-way handshake를 쓴다."
  },
  {
    category: "연결 설정",
    question: "SYNACK 세그먼트의 ACK 번호는 서버의 초기 순서 번호 y이다.",
    answer: false,
    explanation: "SYNACK의 ACK 번호는 클라이언트 초기 순서 번호 x에 1을 더한 x+1이다."
  },
  {
    category: "공정성",
    question: "TCP 공정성의 목표는 먼저 연결을 맺은 세션이 병목 링크 대역폭을 더 많이 갖는 것이다.",
    answer: false,
    explanation: "K개 세션이 같은 병목 링크를 공유하면 각 세션이 평균 R/K를 갖는 것이 목표이다."
  },
  {
    category: "공정성",
    question: "한 응용이 병렬 TCP 연결을 여러 개 열면 병목 링크에서 더 적은 대역폭을 받는다.",
    answer: false,
    explanation: "병렬 연결을 많이 열수록 더 큰 몫을 가져간다(예: 11개 연결이면 R/2)."
  },
  {
    category: "처리율",
    question: "손실이 나는 윈도우 크기가 W일 때 평균 윈도우 크기는 W/4이다.",
    answer: false,
    explanation: "평균 윈도우는 3W/4이고 평균 처리율은 3W/(4 RTT)이다."
  },
  {
    category: "Reno",
    question: "TCP Reno는 3개의 중복 ACK를 받으면 타임아웃과 똑같이 cwnd를 1 MSS로 줄인다.",
    answer: false,
    explanation: "Reno는 3 중복 ACK에서 cwnd를 절반 수준으로 줄이며 1로 줄이는 것은 Tahoe이다."
  },

  // ===== 2번 빈칸 (6문제) =====
  {
    category: "AIMD",
    question: "AIMD에서 손실이 없으면 cwnd를 RTT마다 1 MSS씩 늘리는 것을 (        ) 증가라 한다.",
    answers: ["가산", "additive", "덧셈", "가산적"],
    displayAnswer: "가산(additive)",
    explanation: "손실 시에는 곱셈 감소(multiplicative decrease)를 한다."
  },
  {
    category: "빠른 재전송",
    question: "송신자가 같은 데이터에 대한 중복 ACK를 (        )개 받으면 타임아웃 전에 재전송한다. (숫자만 입력)",
    answers: ["3", "3.0", "3.00", "3개", "3 개", "3.0개", "3.0 개", "3.00개", "3.00 개"],
    displayAnswer: "3",
    explanation: "triple duplicate ACKs로 손실을 추정한다."
  },
  {
    category: "흐름 제어",
    question: "수신자는 남은 수신 버퍼 공간을 TCP 헤더의 (        ) 값에 담아 송신자에게 알린다.",
    answers: ["rwnd", "receive window", "수신 윈도우", "rcvwnd", "수신윈도우"],
    displayAnswer: "rwnd(수신 윈도우)",
    explanation: "송신자는 확인되지 않은 데이터를 rwnd 이하로 제한한다."
  },
  {
    category: "송신 윈도우",
    question: "TCP 송신자가 실제로 쓸 수 있는 송신 윈도우는 rwnd와 cwnd 중 (        ) 값이다.",
    answers: ["작은", "작은 값", "min", "최소", "더 작은", "최솟값", "작은쪽"],
    displayAnswer: "작은 (min)",
    explanation: "Sender Window = min(RWND, CWND)."
  },
  {
    category: "연결 종료",
    question: "TCP 연결 종료에서 FIN 세그먼트는 데이터가 없어도 순서 번호를 (        )개 소비한다. (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1개", "1 개", "1.0개", "1.0 개", "1.00개", "1.00 개"],
    displayAnswer: "1",
    explanation: "SYN과 FIN은 순서 번호를 1개 소비한다."
  },
  {
    category: "처리율",
    question: "다른 연결과 같은 병목 링크를 공유하는 K개의 TCP 세션이 각각 가져야 할 평균 전송률은 링크 대역폭 R의 (        )이다. 분수로 쓰시오.",
    answers: ["r/k", "1/k", "r / k", "1 / k"],
    displayAnswer: "R/K",
    explanation: "공정성 목표는 각 세션이 평균 R/K를 갖는 것이다."
  },

  // ===== 3번 혼잡 제어 계산 (7문제) =====
  {
    category: "슬로 스타트",
    question: "TCP 송신자의 cwnd는 1 MSS에서 시작한다. ssthresh는 16 MSS이고 RTT마다 cwnd가 바뀌는 단순한 모델을 쓴다. 슬로 스타트는 RTT마다 두 배, 혼잡 회피는 RTT마다 1 MSS 증가이다.\n4 RTT 후 cwnd는 몇 MSS인가? (숫자만 입력)",
    answers: ["16", "16.0", "16.00", "16MSS", "16 MSS", "16.0MSS", "16.0 MSS", "16.00MSS", "16.00 MSS"],
    displayAnswer: "16 MSS",
    explanation: "1 → 2 → 4 → 8 → 16."
  },
  {
    category: "혼잡 회피",
    question: "TCP 송신자의 cwnd는 1 MSS에서 시작한다. ssthresh는 16 MSS이고 RTT마다 cwnd가 바뀌는 단순한 모델을 쓴다. 슬로 스타트는 RTT마다 두 배, 혼잡 회피는 RTT마다 1 MSS 증가이다.\ncwnd가 16 MSS에 도달한 뒤 혼잡 회피로 2 RTT가 더 지나면 cwnd는 몇 MSS인가? (숫자만 입력)",
    answers: ["18", "18.0", "18.00", "18MSS", "18 MSS", "18.0MSS", "18.0 MSS", "18.00MSS", "18.00 MSS"],
    displayAnswer: "18 MSS",
    explanation: "16 → 17 → 18."
  },
  {
    category: "3 중복 ACK",
    question: "cwnd가 24 MSS일 때 3개의 중복 ACK로 손실이 감지되면 ssthresh는 몇 MSS가 되는가? (숫자만 입력)",
    answers: ["12", "12.0", "12.00", "12MSS", "12 MSS", "12.0MSS", "12.0 MSS", "12.00MSS", "12.00 MSS"],
    displayAnswer: "12 MSS",
    explanation: "ssthresh = cwnd/2 = 12 MSS."
  },
  {
    category: "타임아웃",
    question: "cwnd가 24 MSS일 때 타임아웃이 발생하면 ssthresh는 몇 MSS가 되는가? (숫자만 입력)",
    answers: ["12", "12.0", "12.00", "12MSS", "12 MSS", "12.0MSS", "12.0 MSS", "12.00MSS", "12.00 MSS"],
    displayAnswer: "12 MSS",
    explanation: "타임아웃에서도 ssthresh = cwnd/2 = 12 MSS."
  },
  {
    category: "타임아웃",
    question: "cwnd가 24 MSS일 때 타임아웃이 발생한 직후 cwnd는 몇 MSS인가? (숫자만 입력)",
    answers: ["1", "1.0", "1.00", "1MSS", "1 MSS", "1.0MSS", "1.0 MSS", "1.00MSS", "1.00 MSS"],
    displayAnswer: "1 MSS",
    explanation: "타임아웃이면 cwnd는 1 MSS가 되고 슬로 스타트 상태로 들어간다."
  },
  {
    category: "타임아웃",
    question: "위 타임아웃 이후(ssthresh = 12 MSS) 슬로 스타트로 3 RTT가 지나면 cwnd는 몇 MSS인가? (숫자만 입력)",
    answers: ["8", "8.0", "8.00", "8MSS", "8 MSS", "8.0MSS", "8.0 MSS", "8.00MSS", "8.00 MSS"],
    displayAnswer: "8 MSS",
    explanation: "1 → 2 → 4 → 8이고 ssthresh(12)보다 작으므로 계속 슬로 스타트이다."
  },
  {
    category: "처리율",
    question: "손실이 발생할 때의 윈도우 크기 W가 60 KB이고 RTT가 100 ms일 때 평균 TCP 처리율은 몇 KB/s인가? (3W/4 / RTT, 숫자만 입력)",
    answers: ["450", "450.0", "450.00", "450KB/s", "450 KB/s", "450.0KB/s", "450.0 KB/s", "450.00KB/s", "450.00 KB/s", "450KBps", "450 KBps", "450.0KBps", "450.0 KBps", "450.00KBps", "450.00 KBps"],
    displayAnswer: "450 KB/s",
    explanation: "평균 윈도우는 3/4 × 60 = 45 KB이고 45 / 0.1 = 450 KB/s."
  },

  // ===== 4번 RTT와 타임아웃 (4문제) =====
  {
    category: "TimeoutInterval",
    question: "TCP가 RFC 2988 방식으로 RTT를 추정한다. SampleRTT는 첫 번째 200 ms, 두 번째 240 ms이다. 초기에는 EstimatedRTT = SampleRTT, DevRTT = SampleRTT/2로 두고, 이후에는 α = 0.125, β = 0.25를 사용하며 EstimatedRTT를 먼저 갱신한 뒤 그 값으로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4 × DevRTT이다.\n첫 번째 샘플 직후의 TimeoutInterval은 몇 ms인가? (숫자만 입력)",
    answers: ["600", "600.0", "600.00", "600ms", "600 ms", "600.0ms", "600.0 ms", "600.00ms", "600.00 ms", "600밀리초", "600 밀리초", "600.0밀리초", "600.0 밀리초", "600.00밀리초", "600.00 밀리초", "600msec", "600 msec", "600.0msec", "600.0 msec", "600.00msec", "600.00 msec"],
    displayAnswer: "600 ms",
    explanation: "EstimatedRTT = 200, DevRTT = 100이므로 200 + 4×100 = 600 ms."
  },
  {
    category: "EstimatedRTT",
    question: "TCP가 RFC 2988 방식으로 RTT를 추정한다. SampleRTT는 첫 번째 200 ms, 두 번째 240 ms이다. 초기에는 EstimatedRTT = SampleRTT, DevRTT = SampleRTT/2로 두고, 이후에는 α = 0.125, β = 0.25를 사용하며 EstimatedRTT를 먼저 갱신한 뒤 그 값으로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4 × DevRTT이다.\n두 번째 샘플 직후의 EstimatedRTT는 몇 ms인가? (숫자만 입력)",
    answers: ["205", "205.0", "205.00", "205ms", "205 ms", "205.0ms", "205.0 ms", "205.00ms", "205.00 ms", "205밀리초", "205 밀리초", "205.0밀리초", "205.0 밀리초", "205.00밀리초", "205.00 밀리초", "205msec", "205 msec", "205.0msec", "205.0 msec", "205.00msec", "205.00 msec"],
    displayAnswer: "205 ms",
    explanation: "0.875×200 + 0.125×240 = 205 ms."
  },
  {
    category: "DevRTT",
    question: "TCP가 RFC 2988 방식으로 RTT를 추정한다. SampleRTT는 첫 번째 200 ms, 두 번째 240 ms이다. 초기에는 EstimatedRTT = SampleRTT, DevRTT = SampleRTT/2로 두고, 이후에는 α = 0.125, β = 0.25를 사용하며 EstimatedRTT를 먼저 갱신한 뒤 그 값으로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4 × DevRTT이다.\n두 번째 샘플 직후의 DevRTT는 몇 ms인가? (숫자만 입력)",
    answers: ["83.75", "83.750", "83.7500", "83.75ms", "83.75 ms", "83.750ms", "83.750 ms", "83.7500ms", "83.7500 ms", "83.75밀리초", "83.75 밀리초", "83.750밀리초", "83.750 밀리초", "83.7500밀리초", "83.7500 밀리초", "83.75msec", "83.75 msec", "83.750msec", "83.750 msec", "83.7500msec", "83.7500 msec"],
    displayAnswer: "83.75 ms",
    explanation: "0.75×100 + 0.25×|240 − 205| = 75 + 8.75 = 83.75 ms."
  },
  {
    category: "TimeoutInterval",
    question: "TCP가 RFC 2988 방식으로 RTT를 추정한다. SampleRTT는 첫 번째 200 ms, 두 번째 240 ms이다. 초기에는 EstimatedRTT = SampleRTT, DevRTT = SampleRTT/2로 두고, 이후에는 α = 0.125, β = 0.25를 사용하며 EstimatedRTT를 먼저 갱신한 뒤 그 값으로 DevRTT를 계산한다. TimeoutInterval = EstimatedRTT + 4 × DevRTT이다.\n두 번째 샘플 직후의 TimeoutInterval은 몇 ms인가? (숫자만 입력)",
    answers: ["540", "540.0", "540.00", "540ms", "540 ms", "540.0ms", "540.0 ms", "540.00ms", "540.00 ms", "540밀리초", "540 밀리초", "540.0밀리초", "540.0 밀리초", "540.00밀리초", "540.00 밀리초", "540msec", "540 msec", "540.0msec", "540.0 msec", "540.00msec", "540.00 msec"],
    displayAnswer: "540 ms",
    explanation: "205 + 4×83.75 = 540 ms."
  },

  // ===== 5번 3-way handshake (4문제) =====
  {
    category: "3-way handshake",
    question: "클라이언트가 초기 순서 번호 500으로 SYN을 보내고 서버는 초기 순서 번호 2000으로 SYNACK을 보낸다. 클라이언트는 세 번째 세그먼트 ACK를 데이터 없이 보낸 뒤 100바이트 데이터를 전송한다.\n서버가 보내는 SYNACK의 ACK 번호는? (숫자만 입력)",
    answers: ["501", "501.0", "501.00"],
    displayAnswer: "501",
    explanation: "ACK 번호는 x+1 = 501이다."
  },
  {
    category: "3-way handshake",
    question: "클라이언트가 초기 순서 번호 500으로 SYN을 보내고 서버는 초기 순서 번호 2000으로 SYNACK을 보낸다. 클라이언트는 세 번째 세그먼트 ACK를 데이터 없이 보낸 뒤 100바이트 데이터를 전송한다.\n클라이언트가 보내는 세 번째 세그먼트(ACK)의 ACK 번호는? (숫자만 입력)",
    answers: ["2001", "2001.0", "2001.00"],
    displayAnswer: "2001",
    explanation: "ACK 번호는 y+1 = 2001이다."
  },
  {
    category: "3-way handshake",
    question: "클라이언트가 초기 순서 번호 500으로 SYN을 보내고 서버는 초기 순서 번호 2000으로 SYNACK을 보낸다. 클라이언트는 세 번째 세그먼트 ACK를 데이터 없이 보낸 뒤 100바이트 데이터를 전송한다.\n클라이언트가 보내는 첫 데이터 세그먼트의 순서 번호는? (숫자만 입력)",
    answers: ["501", "501.0", "501.00"],
    displayAnswer: "501",
    explanation: "SYN이 순서 번호 500을 소비했고 데이터 없는 ACK는 소비하지 않으므로 다음 번호는 501이다."
  },
  {
    category: "3-way handshake",
    question: "클라이언트가 초기 순서 번호 500으로 SYN을 보내고 서버는 초기 순서 번호 2000으로 SYNACK을 보낸다. 클라이언트는 세 번째 세그먼트 ACK를 데이터 없이 보낸 뒤 100바이트 데이터를 전송한다.\n서버가 그 100바이트 데이터를 받고 보내는 ACK 번호는? (숫자만 입력)",
    answers: ["601", "601.0", "601.00"],
    displayAnswer: "601",
    explanation: "다음에 기대하는 바이트 번호는 501 + 100 = 601이다."
  },

  // ===== 6번 흐름 제어 (2문제) =====
  {
    category: "흐름 제어",
    question: "수신자의 RcvBuffer는 4096바이트이고 현재 버퍼에 1000바이트의 데이터가 있어 아직 응용이 가져가지 않았다.\n수신자가 알리는 rwnd는 몇 바이트인가? (숫자만 입력)",
    answers: ["3096", "3096.0", "3096.00", "3096바이트", "3096 바이트", "3096.0바이트", "3096.0 바이트", "3096.00바이트", "3096.00 바이트", "3096byte", "3096 byte", "3096.0byte", "3096.0 byte", "3096.00byte", "3096.00 byte", "3096bytes", "3096 bytes", "3096.0bytes", "3096.0 bytes", "3096.00bytes", "3096.00 bytes", "3096b", "3096 b", "3096.0b", "3096.0 b", "3096.00b", "3096.00 b"],
    displayAnswer: "3096바이트",
    explanation: "rwnd = RcvBuffer − 버퍼에 있는 데이터 = 4096 − 1000 = 3096."
  },
  {
    category: "흐름 제어",
    question: "수신자의 RcvBuffer는 4096바이트이고 현재 버퍼에 1000바이트의 데이터가 있어 아직 응용이 가져가지 않았다.\n송신자의 cwnd가 5000바이트라면 송신 윈도우는 몇 바이트인가? (숫자만 입력)",
    answers: ["3096", "3096.0", "3096.00", "3096바이트", "3096 바이트", "3096.0바이트", "3096.0 바이트", "3096.00바이트", "3096.00 바이트", "3096byte", "3096 byte", "3096.0byte", "3096.0 byte", "3096.00byte", "3096.00 byte", "3096bytes", "3096 bytes", "3096.0bytes", "3096.0 bytes", "3096.00bytes", "3096.00 bytes", "3096b", "3096 b", "3096.0b", "3096.0 b", "3096.00b", "3096.00 b"],
    displayAnswer: "3096바이트",
    explanation: "송신 윈도우 = min(rwnd, cwnd) = min(3096, 5000) = 3096."
  },
];
