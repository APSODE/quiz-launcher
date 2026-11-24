// 업로드: 건보(apsode) · 2026-11-24
const META = {"group":"컴퓨터네트워크","exam":"기말고사","unit":"4장","title":"4장 Chapter 4 Network Layer 용어 20개 (C안)","topic":"Chapter 4 Network Layer","uploader":"apsode"};

const TERMS = [
  {"terms":["NAT","Network Address Translation"],"group":"4장","desc":"사설 IP 주소를 공인 IP 주소로 또는 그 반대로 변환해 주는 기술"},
  {"terms":["공인 주소","공인주소","Public IP","공인 IP","공인IP"],"group":"4장","desc":"인터넷 등 공중 네트워크에서 사용하며 중복 불가·허가 필요·비용이 발생하는 IP 주소"},
  {"terms":["사설 주소","사설주소","Private IP","사설 IP","사설IP"],"group":"4장","desc":"내부 네트워크에서만 무료로 사용하며 인터넷 직접 접속은 불가하고 다른 내부망 간 중복이 가능한 IP 주소"},
  {"terms":["Inside Local","InsideLocal"],"group":"4장","desc":"출발지 내부 호스트가 실제 사용하는 NAT 변환 전 사설 IP 주소"},
  {"terms":["Inside Global","InsideGlobal"],"group":"4장","desc":"출발지 내부 호스트가 외부로 나갈 때 NAT로 변환된 후의 공인 IP 주소"},
  {"terms":["Outside Global","OutsideGlobal"],"group":"4장","desc":"목적지 호스트가 사용하는 공인 IP 주소(목적지 NAT 외부 주소)"},
  {"terms":["Outside Local","OutsideLocal"],"group":"4장","desc":"목적지 호스트의 실제 사설 IP 주소(목적지 NAT 내부 주소)"},
  {"terms":["정적 NAT","정적NAT","Static NAT","StaticNAT"],"group":"4장","desc":"사설 IP와 공인 IP를 미리 1:1 고정 매핑하는 주소 변환 방식"},
  {"terms":["동적 NAT","동적NAT","Dynamic NAT","DynamicNAT"],"group":"4장","desc":"공인 IP 풀(Pool)에서 통신 시 내부 호스트에게 1:1 동적 할당하는 주소 변환 방식"},
  {"terms":["NAT 오버로딩","NAT오버로딩","PAT","Port Address Translation"],"group":"4장","desc":"IP 주소와 TCP/UDP 포트 번호를 이용해 하나의 공인 IP를 다수 사설 IP가 1:N 공유하는 방식"},
  {"terms":["DHCP","Dynamic Host Configuration Protocol"],"group":"4장","desc":"IP 주소·서브넷 마스크·게이트웨이·DNS 정보를 동적으로 임대(Lease)하는 프로토콜"},
  {"terms":["DHCP Relay Agent","DHCPRelayAgent","Relay Agent"],"group":"4장","desc":"클라이언트의 DHCP 브로드캐스트를 수신해 다른 서브넷의 DHCP 서버로 유니캐스트 중계하는 장치"},
  {"terms":["DHCP Proxy Agent","DHCPProxyAgent","Proxy Agent"],"group":"4장","desc":"IP 할당·임대 연장·반납 전 절차에서 단말에겐 DHCP 서버, 실제 서버에겐 DHCP 클라이언트 역할을 수행하는 장치"},
  {"terms":["라우팅 프로토콜","라우팅프로토콜","Routing Protocol"],"group":"4장","desc":"경로 선택을 수행하여 포워딩 테이블을 생성하는 프로토콜(RIP, OSPF, BGP)"},
  {"terms":["ICMP","ICMP 프로토콜","ICMP프로토콜"],"group":"4장","desc":"네트워크 계층에서 오류 보고 및 라우터 시그널링을 담당하는 프로토콜"},
  {"terms":["TTL","Time To Live","TimeToLive"],"group":"4장","desc":"IPv4 데이터그램이 통과할 수 있는 최대 잔여 홉 수(라우터마다 감소)"},
  {"terms":["MTU","Maximum Transmission Unit"],"group":"4장","desc":"링크 계층 프레임이 실을 수 있는 최대 전송 단위(이더넷 1500B)"},
  {"terms":["IP 단편화","IP단편화","단편화","Fragmentation","IP Fragmentation"],"group":"4장","desc":"링크별 MTU 차이로 큰 IP 데이터그램을 여러 작은 데이터그램으로 분할해 전송하는 것"},
  {"terms":["Fragment Offset","FragmentOffset"],"group":"4장","desc":"분할된 IP 조각의 원본 데이터그램 내 시작 위치를 8바이트 단위로 나타내는 13비트 필드"},
  {"terms":["터널링","Tunneling"],"group":"4장","desc":"IPv4/IPv6 혼재 환경에서 IPv6 데이터그램 전체를 IPv4 데이터그램의 페이로드로 캡슐화해 전송하는 기법"},
];
