// 업로드: 건보(apsode) · 2026-11-24
const META = {"group":"컴퓨터네트워크","exam":"기말고사","unit":"4장","title":"4장 IP 주소 용어 23개","topic":"IP 주소","scopeRev":1,"uploader":"apsode"};

const TERMS = [
  {"terms":["IP 주소","IP주소","IP Address"],"group":"4장","desc":"인터넷 상의 장치를 구분하기 위해 각 장치의 인터페이스(랜카드 등)에 할당하는 고유 식별 번호"},
  {"terms":["IPv4"],"group":"4장","desc":"현재 사용하는 4바이트(32비트) 길이의 IP 주소 체계로, 각 바이트를 10진수(0~255)로 표기함"},
  {"terms":["Network ID","NetworkID","네트워크 ID","네트워크ID"],"group":"4장","desc":"IP 주소에서 각 호스트가 속한 네트워크를 구분하는 부분"},
  {"terms":["Host ID","HostID","호스트 ID","호스트ID"],"group":"4장","desc":"IP 주소에서 네트워크 내 각 호스트를 구분하는 부분"},
  {"terms":["서브넷","Subnet","Subnetwork","서브네트워크"],"group":"4장","desc":"같은 Network ID를 갖는 인터페이스들의 집합(하나의 Broadcast Domain)"},
  {"terms":["서브넷 마스크","서브넷마스크","Subnet Mask","SubnetMask"],"group":"4장","desc":"네트워크 주소를 판별하기 위해 Network ID 비트는 1, Host ID 비트는 0으로 설정한 값"},
  {"terms":["프리픽스","Prefix"],"group":"4장","desc":"서브넷 마스크에 포함된 비트 1의 개수로 표기하는 방법 (예: /24)"},
  {"terms":["클래스","Class"],"group":"4장","desc":"IP 주소를 효율적으로 배정하기 위해 도입한 A, B, C, D, E 다섯 종류의 주소 구분 체계"},
  {"terms":["루프백 주소","루프백주소","Loopback Address","루프백","Loopback"],"group":"4장","desc":"디버깅 목적으로 자기 자신을 나타내는 주소 (범위 127.0.0.0~127.255.255.255, 주로 127.0.0.1)"},
  {"terms":["네트워크 주소","네트워크주소","Network Address"],"group":"4장","desc":"Host ID의 모든 비트가 0인 주소로 해당 네트워크를 대표함"},
  {"terms":["Directed Broadcast 주소","Directed Broadcast","Directed Broadcast Address","다이렉티드 브로드캐스트 주소","다이렉티드 브로드캐스트"],"group":"4장","desc":"특정 네트워크 주소에 Host ID 비트가 모두 1인 주소로, 해당 네트워크 내 모든 호스트에 패킷을 전달함"},
  {"terms":["Limited Broadcast 주소","Limited Broadcast","Limited Broadcast Address","리미티드 브로드캐스트 주소","리미티드 브로드캐스트"],"group":"4장","desc":"255.255.255.255 주소로, DHCP 클라이언트가 DHCP 서버를 찾을 때 등에 사용함"},
  {"terms":["사설 주소","사설주소","Private Address","사설 IP","사설IP","사설 IP 주소"],"group":"4장","desc":"사용자가 임의로 사용할 수 있으나 인터넷 접속은 불가한 주소"},
  {"terms":["공인 주소","공인주소","Public Address","공인 IP","공인IP","공인 IP 주소"],"group":"4장","desc":"중앙 기관이 할당하며 인터넷 접속이 가능한 주소"},
  {"terms":["IANA","Internet Assigned Number Authority"],"group":"4장","desc":"인터넷의 모든 번호를 관리하고 Regional IRs에 할당하는 기관"},
  {"terms":["Regional IRs","Regional IR","RIR","RIRs"],"group":"4장","desc":"대륙별 인터넷 번호 관리 기관 (AfriNIC, APNIC, ARIN, RIPE NCC, LACNIC)"},
  {"terms":["Local IRs","Local IR","LIR","LIRs"],"group":"4장","desc":"국가별 인터넷 번호 관리 기관 (한국 KRNIC, 일본 JPNIC 등)"},
  {"terms":["서브넷팅","Subnetting"],"group":"4장","desc":"주어진 네트워크 주소를 여러 개의 작은 서브넷으로 나누는 Classless 할당 방식"},
  {"terms":["Subnet Zero","SubnetZero","서브넷 제로","서브넷제로"],"group":"4장","desc":"서브넷팅 시 첫 번째 서브넷(모두 0 서브넷)으로, 원본 네트워크와 네트워크 주소가 동일함"},
  {"terms":["Broadcast Subnet","BroadcastSubnet","브로드캐스트 서브넷","브로드캐스트서브넷"],"group":"4장","desc":"서브넷팅 시 마지막 서브넷(모두 1 서브넷)으로, 원본 네트워크와 브로드캐스트 주소가 동일함"},
  {"terms":["VLSM","Variable Length Subnet Mask","가변 길이 서브넷 마스크","가변길이서브넷마스크"],"group":"4장","desc":"서브넷마다 서로 다른 서브넷 마스크를 적용하는 기법"},
  {"terms":["수퍼넷팅","Supernetting","슈퍼넷팅","CIDR","경로 요약","경로요약","경로 집약","경로집약"],"group":"4장","desc":"여러 개의 작은 네트워크를 하나의 큰 네트워크로 통합하는 기법"},
  {"terms":["수퍼넷 마스크","수퍼넷마스크","Supernet Mask","슈퍼넷 마스크","슈퍼넷마스크"],"group":"4장","desc":"수퍼넷팅으로 통합된 네트워크의 마스크"},
];
