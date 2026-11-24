// 업로드: 건보(apsode) · 2026-11-24
const META = {"group":"컴퓨터네트워크","exam":"기말고사","unit":"4장","title":"4장 Chapter 4 Network Layer OX 20문제 (C안)","topic":"Chapter 4 Network Layer","uploader":"apsode"};

const QUESTIONS = [
  {"id":"umwux3ypbj06c","category":"사설 IP","question":"사설 IP 주소는 서로 다른 사설 네트워크 사이에서는 같은 주소를 중복해 사용할 수 있다.","answer":true,"explanation":"사설 주소는 사설망 내부에서만 쓰이므로 다른 사설망끼리는 같은 주소를 써도 된다. [NAT p.6]"},
  {"id":"umwux3ypcavf7","category":"NAT 유형","question":"동적 NAT는 하나의 공인 IP로 여러 내부 호스트가 동시에 인터넷에 접속할 수 있게 한다.","answer":false,"explanation":"동적 NAT는 풀에서 1:1로 할당하므로 풀에 있는 공인 IP 수만큼만 동시에 통신할 수 있다. [NAT p.12, 15~16]"},
  {"id":"umwux3ypdqhl4","category":"DHCP 메시지","question":"DHCP Request는 클라이언트가 선택한 서버에게만 유니캐스트로 전송된다.","answer":false,"explanation":"선택되지 않은 다른 DHCP 서버에게 제안한 IP 할당을 유보하도록 알리기 위해 브로드캐스트로 전송한다. [NAT p.30]"},
  {"id":"umwux3ypedyim","category":"DHCP 포트","question":"DHCP 클라이언트는 UDP 포트 67을 사용한다.","answer":false,"explanation":"DHCP 서버가 UDP 67, 클라이언트가 UDP 68을 사용한다. [NAT p.24]"},
  {"id":"umwux3ypfdg7i","category":"DHCP Relay","question":"DHCP Relay Agent는 IP 임대 연장(Renewal)과 반납(Release) 절차에도 개입한다.","answer":false,"explanation":"Relay Agent는 IP 할당 절차의 브로드캐스트를 유니캐스트로 중계하는 역할만 한다. [NAT p.35~38, 45]"},
  {"id":"umwux3ypgup6b","category":"단편화","question":"단편화된 IP 데이터그램의 재조합은 최종 목적지에서만 수행된다.","answer":true,"explanation":"단편화는 네트워크 내 라우터에서 일어나지만 재조합은 최종 목적지에서만 한다. [Ch4 p.8]"},
  {"id":"umwux3yphnrfo","category":"IPv4 Flags","question":"IPv4 Flags에서 MF=1은 해당 조각이 마지막 조각임을 뜻한다.","answer":false,"explanation":"MF=1은 뒤에 조각이 더 있다는 뜻이고, 마지막 조각은 MF=0이다. [Ch4 p.9]"},
  {"id":"umwux3ypiie3q","category":"IPv6","question":"IPv6 헤더에는 오류 검출용 헤더 체크섬 필드가 없다.","answer":true,"explanation":"IPv6는 홉당 처리 시간을 줄이기 위해 IP 계층 체크섬을 완전히 제거했다. [Ch4 p.14, 16]"},
  {"id":"umwux3ypjqy0c","category":"IPv6","question":"IPv6에서는 중간 라우터가 데이터그램을 단편화할 수 있다.","answer":false,"explanation":"IPv6는 중간 라우터의 단편화를 허용하지 않고 ICMPv6 메시지로 대신 알린다. [Ch4 p.13~14, 16]"},
  {"id":"umwux3ypkrfyy","category":"터널링","question":"IPv4/IPv6 혼재 환경의 터널링은 IPv4 데이터그램을 IPv6 데이터그램의 페이로드로 캡슐화한다.","answer":false,"explanation":"반대로 IPv6 데이터그램 전체를 IPv4 데이터그램의 페이로드로 캡슐화해 IPv4 구간을 통과시킨다. [Ch4 p.18~20]"},
  {"id":"umwux3yplr2ho","category":"NAT 유형","question":"정적 NAT는 외부에서 내부 사설망으로 먼저 접속해야 하는 DNS 서버·이메일 서버 등에 사용한다.","answer":true,"explanation":"정적 NAT는 사설 IP와 공인 IP를 1:1로 고정 매핑하므로 외부에서 먼저 접속하는 서버에 쓴다. [NAT p.13]"},
  {"id":"umwux3ypmkjca","category":"NAT 주소","question":"목적지 컴퓨터가 공인 IP를 사용하는 경우 Outside Global과 Outside Local은 같다.","answer":true,"explanation":"목적지 쪽에 NAT 변환이 없으므로 목적지의 외부 주소와 실제 주소가 같다. [NAT p.10]"},
  {"id":"umwux3ypnw2gh","category":"NAT 장단점","question":"NAT를 사용하면 외부에서 내부 사설망으로 접근하기가 쉬워진다.","answer":false,"explanation":"외부에서 내부 사설망 접근이 어려워지는 것은 NAT의 단점으로 꼽힌다. [NAT p.9]"},
  {"id":"umwux3ypovg5w","category":"DHCP 메시지","question":"DHCP Offer는 클라이언트 메시지의 Broadcast Flag가 0이면 유니캐스트로 전송된다.","answer":true,"explanation":"Offer와 ACK는 Broadcast Flag가 1이면 브로드캐스트, 0이면 유니캐스트로 전송된다. [NAT p.28, 32]"},
  {"id":"umwux3yppkmct","category":"IPv6","question":"IPv6는 IPsec을 의무화했다.","answer":true,"explanation":"IPv6는 IPsec을 의무 기능으로 포함한다. [Ch4 p.14]"},
  {"id":"umwux3ypqda43","category":"IPv6","question":"IPv6 헤더는 옵션에 따라 길이가 달라지는 가변 길이 헤더이다.","answer":false,"explanation":"IPv6 헤더는 고정 길이이며 64비트 정렬되어 있고, 옵션은 기본 헤더 밖으로 분리했다. [Ch4 p.13~14]"},
  {"id":"umwux3ypr44uw","category":"IPv6","question":"IPv6는 브로드캐스트를 제거하고 멀티캐스트로 대체했다.","answer":true,"explanation":"IPv4와 달리 IPv6에는 브로드캐스트가 없고 멀티캐스트를 사용한다. [Ch4 p.14]"},
  {"id":"umwux3ypsc548","category":"IPv4 Flags","question":"DF=1인 데이터그램이 분할되어야 하는 상황이면 그 패킷은 폐기된다.","answer":true,"explanation":"DF=1은 분할 금지를 뜻하므로 분할이 필요하면 패킷을 폐기한다. [Ch4 p.9]"},
  {"id":"umwux3yptef5l","category":"네트워크 계층","question":"ICMP 프로토콜은 경로 선택을 수행해 포워딩 테이블을 생성한다.","answer":false,"explanation":"포워딩 테이블 생성은 라우팅 프로토콜(RIP, OSPF, BGP)의 일이고, ICMP는 오류 보고와 라우터 시그널링을 담당한다. [Ch4 p.3]"},
  {"id":"umwux3ypubv9j","category":"DHCP Relay","question":"라우터는 브로드캐스트 패킷을 폐기한다.","answer":true,"explanation":"그래서 Relay Agent 없이는 다른 서브넷의 DHCP 서버에서 IP를 받을 수 없다. [NAT p.35~36]"},
];
