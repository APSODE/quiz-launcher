// 업로드: 건보(apsode) · 2026-11-24
const META = {"group":"컴퓨터네트워크","exam":"기말고사","unit":"4장","title":"4장 Chapter 4 Network Layer OX 20문제 (B안)","topic":"Chapter 4 Network Layer","uploader":"apsode"};

const QUESTIONS = [
  {"id":"umwux3xxj5k0c","category":"IP 단편화","question":"IP 단편화로 나뉜 조각은 경로상의 중간 라우터에서 재조립된다.","answer":false,"explanation":"조각은 망 안에서 나뉘지만 재조립은 최종 목적지에서만 한다. [p.4-8]"},
  {"id":"umwux3xxkfck7","category":"IP 단편화","question":"IPv4 헤더의 MF 플래그가 0이면 그 조각이 마지막 조각이다.","answer":true,"explanation":"MF는 0이면 마지막 조각, 1이면 뒤에 조각이 더 있음을 뜻한다. [p.4-9]"},
  {"id":"umwux3xxlzrxx","category":"IP 단편화","question":"DF 플래그가 1인 데이터그램은 단편화가 필요하면 라우터가 알아서 쪼개 보낸다.","answer":false,"explanation":"DF=1은 단편화 금지이므로 단편화가 필요하면 패킷이 폐기된다. [p.4-9]"},
  {"id":"umwux3xxmzpaq","category":"IP 단편화","question":"Fragment Offset 필드의 단위는 8바이트이다.","answer":true,"explanation":"Fragment Offset은 13비트이며 8바이트 단위로 재조립 위치를 나타낸다. [p.4-9]"},
  {"id":"umwux3xxn9vfu","category":"IP 데이터그램","question":"IPv4의 TTL 값은 라우터를 하나 지날 때마다 증가한다.","answer":false,"explanation":"TTL은 남은 최대 홉 수로, 라우터마다 감소한다. [p.4-4]"},
  {"id":"umwux3xxo5dsz","category":"NAT","question":"172.16.0.0/12 대역은 Class B 사설주소 대역에 해당한다.","answer":true,"explanation":"사설주소 대역은 Class A 10.0.0.0/8, Class B 172.16.0.0/12, Class C 192.168.0.0/16이다. [p.7]"},
  {"id":"umwux3xxpkyox","category":"IP 데이터그램","question":"MTU 값은 링크 계층 종류와 관계없이 모두 같다.","answer":false,"explanation":"링크 종류마다 MTU가 다르며 이더넷 MTU는 1500바이트이다. [p.4-8]"},
  {"id":"umwux3xxq3v3k","category":"IPv6","question":"IPv6 기본 헤더는 40바이트 고정 길이이다.","answer":true,"explanation":"IPv6 데이터그램 형식은 고정 길이 40바이트 헤더를 사용한다. [p.4-13]"},
  {"id":"umwux3xxri6p5","category":"IPv6","question":"IPv6에서는 홉마다 처리 시간을 줄이기 위해 헤더 checksum을 없앴다.","answer":true,"explanation":"IPv6는 각 홉의 처리 시간을 줄이려고 checksum을 완전히 제거했다. [p.4-16]"},
  {"id":"umwux3xxsfbdx","category":"IPv6","question":"IPv6는 IPv4처럼 broadcast 주소를 사용한다.","answer":false,"explanation":"IPv6에는 broadcast가 없고 대신 multicast를 사용한다. [p.4-14]"},
  {"id":"umwux3xxtzpet","category":"IPv6","question":"터널링은 IPv4 데이터그램을 IPv6 데이터그램의 payload로 실어 보내는 방식이다.","answer":false,"explanation":"터널링은 IPv6 데이터그램을 IPv4 데이터그램의 payload로 실어 IPv4 라우터 사이를 통과시킨다. [p.4-18]"},
  {"id":"umwux3xxuv7xi","category":"IPv6","question":"IPv6에서 options는 헤더 밖에 두고 Next Header 필드로 표시한다.","answer":true,"explanation":"options는 허용되지만 헤더 바깥에 있으며 Next Header 필드가 이를 가리킨다. [p.4-16]"},
  {"id":"umwux3xxv11wl","category":"NAT","question":"사설주소는 사설 네트워크가 다르면 같은 주소를 써도 된다.","answer":true,"explanation":"사설주소는 사설망 안에서만 쓰므로 사설망이 다르면 중복해도 된다. [p.6]"},
  {"id":"umwux3xxwjave","category":"NAT","question":"동적 NAT는 공인 IP 하나를 여러 내부 컴퓨터가 포트로 나눠 쓰는 1:n 방식이다.","answer":false,"explanation":"동적 NAT는 공인 IP 풀에서 1:1로 할당하며, 1:n은 NAT 오버로딩(PAT)이다. [p.12]"},
  {"id":"umwux3xxxnjrm","category":"NAT","question":"정적 NAT는 외부에서 내부 사설망의 서버로 먼저 접속해야 할 때 사용한다.","answer":true,"explanation":"정적 NAT는 사설·공인 IP를 미리 1:1 매핑하므로 DNS·이메일 서버처럼 외부에서 먼저 접속하는 경우에 쓴다. [p.13]"},
  {"id":"umwux3xxyxtrd","category":"NAT","question":"NAT는 내부 IP 주소를 외부에 숨겨 보안성을 높이는 장점이 있다.","answer":true,"explanation":"NAT는 사설망 내부 IP를 외부로부터 숨겨 보안성을 높인다. [p.9]"},
  {"id":"umwux3xxzebok","category":"NAT","question":"Inside Global은 내부 컴퓨터가 실제로 쓰는 사설 IP 주소이다.","answer":false,"explanation":"Inside Global은 외부로 나갈 때 변환되는 공인 주소이고, 실제 사설 주소는 Inside Local이다. [p.10]"},
  {"id":"umwux3xy0vgx3","category":"DHCP","question":"DHCP는 TCP 포트 67과 68을 사용한다.","answer":false,"explanation":"DHCP는 UDP 포트 67(서버)과 68(클라이언트)을 사용한다. [p.24]"},
  {"id":"umwux3xy1fgc8","category":"DHCP","question":"DHCP Request 메시지는 단말이 고른 서버에게만 유니캐스트로 보낸다.","answer":false,"explanation":"Request는 다른 DHCP 서버가 제안한 IP 할당을 유보하도록 브로드캐스트로 보낸다. [p.30]"},
  {"id":"umwux3xy2v0jk","category":"DHCP","question":"DHCP Relay Agent는 IP 임대기간 연장과 반납 절차에서도 서버 역할을 대신한다.","answer":false,"explanation":"Relay Agent는 IP 할당 절차에서만 중계하며, 연장·반납까지 서버·클라이언트 기능을 하는 것은 Proxy Agent이다. [p.45]"},
];
