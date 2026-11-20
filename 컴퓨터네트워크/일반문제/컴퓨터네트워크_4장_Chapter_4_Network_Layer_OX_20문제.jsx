// 업로드: 건보(apsode) · 2026-11-19
const META = {"group":"컴퓨터네트워크","exam":"기말고사","unit":"4장","title":"4장 Chapter 4 Network Layer OX 20문제","topic":"Chapter 4 Network Layer","uploader":"apsode"};

const QUESTIONS = [
  {"id":"umwnautn3zpo4","category":"NAT","question":"서로 다른 사설망에서는 같은 사설 IP 주소를 중복해서 사용할 수 있다.","answer":true,"explanation":"사설 주소는 사설망 내부 전용이라 다른 사설망끼리 중복해서 쓸 수 있다. [NAT p.6]"},
  {"id":"umwnautn4y4zf","category":"NAT","question":"사설 IP 172.32.0.1은 Class B 사설주소 대역에 속한다.","answer":false,"explanation":"Class B 사설주소 대역은 172.16.0.0/12(172.16.0.0~172.31.255.255)이므로 172.32.0.1은 해당 대역에 속하지 않는다. [NAT p.7]"},
  {"id":"umwnautn5kkgg","category":"NAT","question":"동적 주소 변환 방식은 공인 IP 풀의 주소 수만큼만 동시 할당할 수 있으며, 이를 초과하면 할당 불가 오류가 발생한다.","answer":true,"explanation":"동적 방식은 공인 IP 풀에서 1:1로 동적 할당하므로 보유한 공인 IP 수를 초과하면 no IP available 오류가 발생한다. [NAT p.12, 15~16]"},
  {"id":"umwnautn6h2rh","category":"NAT","question":"동적 주소 변환 방식은 하나의 공인 IP를 여러 내부 호스트가 동시에 공유하는 1:N 방식이다.","answer":false,"explanation":"동적 방식은 공인 IP 풀에서 내부 장치에 1:1로 할당하는 방식이며, 하나의 공인 IP를 다수가 공유하는 1:N 방식이 아니다. [NAT p.12, 15]"},
  {"id":"umwnautn7c9pn","category":"NAT","question":"하나의 공인 IP로 들어온 외부 요청을 여러 내부 사설 IP 서버로 분산하여 전달하는 데 주소 변환 기술을 활용할 수 있다.","answer":true,"explanation":"주소 변환 기능을 이용해 하나의 공인 IP로 들어온 외부 요청을 여러 내부 사설 IP 서버로 랜덤 또는 순차 분산할 수 있다. [NAT p.21~22]"},
  {"id":"umwnautn8qhz7","category":"DHCP","question":"호스트에 동적으로 할당되는 IP 주소는 임대 서비스이므로 사용 기간을 설정할 수 있다.","answer":true,"explanation":"동적 IP 할당은 임대(Lease) 서비스 방식으로 동작하므로 IP 사용 기간을 설정할 수 있다. [NAT p.24]"},
  {"id":"umwnautn9fuhs","category":"DHCP","question":"동적 호스트 설정 프로토콜은 신뢰성 있는 전송을 위해 TCP 포트 67번과 68번을 사용한다.","answer":false,"explanation":"동적 호스트 설정 프로토콜은 TCP가 아니라 UDP 포트 67번(서버)과 68번(클라이언트)을 사용한다. [NAT p.24]"},
  {"id":"umwnautnatfei","category":"DHCP","question":"Offer 메시지는 Broadcast Flag가 1이면 브로드캐스트로, 0이면 유니캐스트로 전송된다.","answer":true,"explanation":"서버가 단말에 IP를 제안하는 Offer 메시지는 Broadcast Flag 값에 따라 1이면 브로드캐스트, 0이면 유니캐스트로 전송된다. [NAT p.28]"},
  {"id":"umwnautnb1x0w","category":"DHCP","question":"Request 메시지는 단말이 선택한 하나의 서버로 유니캐스트 전송된다.","answer":false,"explanation":"Request 메시지는 선택되지 않은 다른 서버들이 제안했던 IP 할당을 유보하도록 브로드캐스트로 전송된다. [NAT p.30]"},
  {"id":"umwnautnc5n6q","category":"DHCP","question":"라우터는 브로드캐스트 패킷을 폐기하므로, 중계 장치 없이는 다른 서브넷에 있는 서버가 단말의 최초 요청을 받을 수 없다.","answer":true,"explanation":"라우터는 브로드캐스트 패킷을 차단하기 때문에 다른 서브넷의 서버로 메시지를 전달하려면 별도의 중계 장치가 필요하다. [NAT p.35~36]"},
  {"id":"umwnautndnvdd","category":"DHCP","question":"Relay Agent는 IP 할당 절차뿐만 아니라 임대 연장 및 반납 전 절차에 개입하여 서버와 클라이언트 역할을 수행한다.","answer":false,"explanation":"Relay Agent는 IP 할당 절차만 단순 중계하며, 할당·연장·반납 전 절차에 개입하는 것은 Proxy Agent이다. [NAT p.35~38, 45]"},
  {"id":"umwnautnecgxb","category":"IPv4","question":"IPv4 기본 헤더의 크기는 20바이트이다.","answer":true,"explanation":"옵션이 없는 IPv4 기본 헤더는 20바이트이다. [Ch.4 p.4-4]"},
  {"id":"umwnautnf7d5e","category":"IPv4","question":"IPv4 헤더의 Protocol 필드 값 17은 UDP를 나타낸다.","answer":true,"explanation":"Protocol 필드는 상위 프로토콜을 식별하며 17은 UDP, 6은 TCP이다. [Ch.4 p.4-5]"},
  {"id":"umwnautnglf79","category":"IP 단편화","question":"이더넷 환경에서 UDP 데이터그램의 단편화를 방지하기 위해 페이로드 크기는 1472바이트 이하로 유지하는 것이 권장된다.","answer":true,"explanation":"이더넷에서 IP 헤더(20B)와 UDP 헤더(8B)를 제외한 1472바이트 이하로 페이로드를 유지해야 IP 단편화를 방지할 수 있다. [Ch.4 p.4-7]"},
  {"id":"umwnautnhgv9i","category":"IP 단편화","question":"단편화된 IP 데이터그램의 재조합은 패킷을 수신한 바로 다음 라우터에서 수행한다.","answer":false,"explanation":"단편화된 IP 데이터그램의 재조합은 중간 라우터가 아닌 오직 최종 목적지(Final Destination)에서만 수행한다. [Ch.4 p.4-8]"},
  {"id":"umwnautnicx5s","category":"IP 단편화","question":"IPv4 Flags에서 DF 비트가 1이면 필요시 단편화를 허용한다는 뜻이다.","answer":false,"explanation":"DF 비트는 1일 때 단편화 금지(필요 시 폐기)를 뜻하며, 0일 때 필요시 단편화를 허용한다. [Ch.4 p.4-9]"},
  {"id":"umwnautnj3mab","category":"IP 단편화","question":"IPv4 Flags에서 MF 비트가 0이면 뒤에 추가 조각이 더 존재함을 뜻한다.","answer":false,"explanation":"MF 비트는 0일 때 마지막 조각을 의미하며, 1일 때 뒤에 추가 조각이 존재함을 뜻한다. [Ch.4 p.4-9]"},
  {"id":"umwnautnkayke","category":"IPv6","question":"IPv6 기본 헤더는 40바이트 고정 길이이다.","answer":true,"explanation":"IPv6는 64비트로 정렬된 40바이트 고정 길이 기본 헤더를 쓴다. [Ch.4 p.4-13~14]"},
  {"id":"umwnautnlzuby","category":"IPv6","question":"IPv6 기본 헤더에는 헤더 체크섬 필드가 있다.","answer":false,"explanation":"IPv6는 각 홉의 처리 시간을 줄이기 위해 헤더 체크섬을 없앴다. [Ch.4 p.4-13~14, 16]"},
  {"id":"umwnautnm6d3h","category":"IPv6","question":"IPv6는 IPv4와 동일하게 브로드캐스트 통신 방식을 지원한다.","answer":false,"explanation":"IPv6는 브로드캐스트를 제거하고 멀티캐스트 방식으로 대체했다. [Ch.4 p.4-14]"},
];
