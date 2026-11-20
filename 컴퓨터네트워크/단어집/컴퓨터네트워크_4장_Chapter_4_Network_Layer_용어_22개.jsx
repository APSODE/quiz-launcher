// 업로드: 건보(apsode) · 2026-11-19
const META = {"group":"컴퓨터네트워크","exam":"기말고사","unit":"4장","title":"4장 Chapter 4 Network Layer 용어 22개","topic":"Chapter 4 Network Layer","uploader":"apsode"};

const TERMS = [
  {"terms":["NAT","Network Address Translation"],"group":"4장","desc":"사설 IP 주소를 공인 IP 주소로 상호 변환해 주는 기술"},
  {"terms":["공인주소","공인 주소","Public IP","공인 IP","공인IP"],"group":"4장","desc":"공중 네트워크에서 사용하는 중복 불가·허가 필요·유료 IP 주소"},
  {"terms":["사설주소","사설 주소","Private IP","사설 IP","사설IP"],"group":"4장","desc":"사설망 내부 전용 무료 주소로, 다른 사설망이면 중복 가능하며 인터넷 직접 접속이 불가한 주소"},
  {"terms":["Inside Local","InsideLocal"],"group":"4장","desc":"출발지 내부 장치가 실제 사용하는 NAT 변환 전 사설 IP"},
  {"terms":["Inside Global","InsideGlobal"],"group":"4장","desc":"출발지 내부 장치가 외부로 나갈 때 NAT 변환 후 사용하는 공인 IP"},
  {"terms":["Outside Global","OutsideGlobal"],"group":"4장","desc":"목적지 장치가 사용하는 공인 IP로, 목적지 NAT 외부 주소"},
  {"terms":["Outside Local","OutsideLocal"],"group":"4장","desc":"목적지 장치의 실제 사설 IP (목적지가 공인 IP면 Outside Global과 동일)"},
  {"terms":["정적 NAT","정적NAT","Static NAT","StaticNAT"],"group":"4장","desc":"사설 IP와 공인 IP를 미리 1:1 고정 매핑하는 주소 변환 방식"},
  {"terms":["동적 NAT","동적NAT","Dynamic NAT","DynamicNAT"],"group":"4장","desc":"공인 IP 풀(Pool)에서 통신 시 내부 장치에 1:1로 할당하는 주소 변환 방식"},
  {"terms":["PAT","NAT 오버로딩","NAT오버로딩","NAT Overloading"],"group":"4장","desc":"IP 주소와 TCP/UDP 포트 번호를 이용해 다수의 사설 IP를 1개의 공인 IP로 1:N 변환하는 방식"},
  {"terms":["DHCP","Dynamic Host Configuration Protocol"],"group":"4장","desc":"호스트에 IP·서브넷 마스크·게이트웨이·DNS 정보를 동적 할당 및 임대하는 프로토콜"},
  {"terms":["DHCP Discover","DHCPDiscover","Discover"],"group":"4장","desc":"단말이 동일 서브넷 내 IP 할당 서버를 찾기 위해 보내는 브로드캐스트 메시지"},
  {"terms":["DHCP Offer","DHCPOffer","Offer"],"group":"4장","desc":"IP 할당 서버가 단말에 임대할 IP 및 네트워크 정보를 제안하는 메시지"},
  {"terms":["DHCP Request","DHCPRequest","Request"],"group":"4장","desc":"단말이 하나의 IP 할당 서버를 선택해 네트워크 정보를 요청하는 브로드캐스트 메시지"},
  {"terms":["DHCP ACK","DHCPACK","ACK"],"group":"4장","desc":"IP 할당 서버가 단말에 최종 네트워크 정보를 전달하고 확정하는 메시지"},
  {"terms":["DHCP Relay Agent","DHCPRelayAgent","Relay Agent","RelayAgent"],"group":"4장","desc":"단말의 브로드캐스트 IP 할당 요청 메시지를 다른 서브넷의 서버로 유니캐스트 중계하는 장치"},
  {"terms":["DHCP Proxy Agent","DHCPProxyAgent","Proxy Agent","ProxyAgent"],"group":"4장","desc":"IP 할당·연장·반납 전 절차에서 단말에는 서버, 서버에는 클라이언트 역할을 수행하는 장치"},
  {"terms":["Proxy Server","ProxyServer","프록시 서버","프록시서버"],"group":"4장","desc":"클라이언트와 서버 사이에서 데이터를 중계하고 캐시로 자원 접근을 빠르게 하는 서버"},
  {"terms":["MTU","Maximum Transmission Unit"],"group":"4장","desc":"링크 계층에서 전송 가능한 최대 프레임 크기"},
  {"terms":["IP 단편화","IP단편화","Fragmentation","단편화"],"group":"4장","desc":"큰 IP 데이터그램을 네트워크 내부에서 여러 작은 데이터그램으로 분할하는 과정"},
  {"terms":["Fragment Offset","FragmentOffset"],"group":"4장","desc":"단편화된 데이터그램의 재조합 위치를 8바이트 단위로 지시하는 13비트 필드"},
  {"terms":["터널링","Tunneling"],"group":"4장","desc":"IPv4 라우터 구간 통과를 위해 IPv6 데이터그램을 IPv4 페이로드로 캡슐화하는 전환 기술"},
];
