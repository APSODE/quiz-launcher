// 업로드: 건보(apsode) · 2026-11-24
const META = {"group":"컴퓨터네트워크","exam":"기말고사","unit":"4장","title":"4장 동적 라우팅 프로토콜 OX 20문제","topic":"동적 라우팅 프로토콜","scopeRev":1,"uploader":"apsode"};

const QUESTIONS = [
  {"id":"umwuu6o2u1581","category":"동적 라우팅","question":"동적 라우팅 프로토콜은 경로를 재계산할 때 라우터의 CPU와 메모리 자원을 적게 사용한다.","answer":false,"explanation":"동적 라우팅은 변화 시 새 경로를 계산하는 과정에서 라우터의 CPU와 메모리 자원을 많이 사용한다. [p.3]","difficulty":"표준","source":"4장 [p.3]"},
  {"id":"umwuu6o2vowf1","category":"IGP·EGP","question":"IGP는 AS 내부에서 사용하는 메트릭 기반 라우팅 프로토콜이다.","answer":true,"explanation":"IGP는 AS 내부의 메트릭 기반 프로토콜이고, AS 간 정책 기반 프로토콜은 EGP이다. [p.4, 66]","difficulty":"기초","source":"4장 [p.4, 66]"},
  {"id":"umwuu6o2wqx7t","category":"라우팅 분류","question":"IS-IS는 거리 벡터 방식의 IGP 프로토콜이다.","answer":false,"explanation":"IS-IS는 OSPF와 함께 링크 상태 방식이며, 거리 벡터 방식은 RIPv1·RIPv2·IGRP·EIGRP이다. [p.4]","difficulty":"기초","source":"4장 [p.4]"},
  {"id":"umwuu6o2xlatx","category":"RIP","question":"RIP는 TCP 포트 520번을 사용해 경로 정보를 교환한다.","answer":false,"explanation":"RIP는 송신·수신 모두 UDP 포트 520번을 사용한다. [p.6, 8]","difficulty":"표준","source":"4장 [p.6, 8]"},
  {"id":"umwuu6o2yqbvo","category":"RIP 캡슐화","question":"RIP 메시지를 캡슐화할 때 IP 헤더의 프로토콜 필드 값은 17이다.","answer":true,"explanation":"RIP 메시지는 UDP에 담기므로 IP 헤더 프로토콜 필드는 17(UDP)이다. [p.8]","difficulty":"기초","source":"4장 [p.8]"},
  {"id":"umwuu6o2z8gv3","category":"RIP 메트릭","question":"RIP에서 경로 비용이 16인 경로는 유효하지 않은 경로로 처리된다.","answer":true,"explanation":"RIP의 최대 경로 비용은 15이며 16은 무한대로 간주해 유효하지 않은 경로로 처리한다. [p.9]","difficulty":"기초","source":"4장 [p.9]"},
  {"id":"umwuu6o30s1i2","category":"RIP","question":"RIP는 토폴로지 변화가 있을 때만 변경된 경로 정보를 이웃 라우터와 교환한다.","answer":false,"explanation":"RIP는 매 30초마다 모든 경로 정보를 이웃과 교환하며, 변경된 엔트리만 교환하는 것은 OSPF이다. [p.10, 26]","difficulty":"표준","source":"4장 [p.10, 26]"},
  {"id":"umwuu6o31l928","category":"RIP 테이블 갱신","question":"RIP 테이블 갱신 시 기존과 같은 Next Hop으로부터 받은 경로의 홉 수가 기존보다 커지면 기존 엔트리를 유지한다.","answer":false,"explanation":"Next Hop이 같으면 홉 수 증감과 무관하게 수신된 값으로 교체하며, 기존 엔트리 유지는 Next Hop이 다르고 수신 값이 더 클 때이다. [p.14~16]","difficulty":"심화","source":"4장 [p.14~16]"},
  {"id":"umwuu6o32kbrp","category":"RIP 테이블 갱신","question":"RIP 테이블 갱신 시 이웃으로부터 수신한 각 목적지 네트워크의 홉 수를 먼저 1 증가시킨다.","answer":true,"explanation":"수신한 홉 수에 1을 더한 뒤 신규 추가·교체·유지 여부를 판단한다. [p.14]","difficulty":"기초","source":"4장 [p.14]"},
  {"id":"umwuu6o335jdy","category":"RIPv1·RIPv2","question":"RIPv2는 멀티캐스트 주소 224.0.0.9로 라우팅 정보를 교환한다.","answer":true,"explanation":"RIPv2는 멀티캐스트(224.0.0.9), RIPv1은 브로드캐스트(255.255.255.255)를 사용한다. [p.23]","difficulty":"기초","source":"4장 [p.23]"},
  {"id":"umwuu6o34huxb","category":"RIPv1·RIPv2","question":"RIPv1은 VLSM을 지원한다.","answer":false,"explanation":"RIPv1은 Classful로 VLSM·서브넷 마스크 교환을 지원하지 않으며, 이를 지원하는 것은 RIPv2이다. [p.23]","difficulty":"기초","source":"4장 [p.23]"},
  {"id":"umwuu6o35y7rm","category":"OSPF","question":"OSPF는 SPF 알고리즘으로 루프가 없는 경로를 보장한다.","answer":true,"explanation":"OSPF는 SPF(Dijkstra) 알고리즘을 사용해 루프(Loop)가 없는 경로를 보장한다. [p.25]","difficulty":"기초","source":"4장 [p.25]"},
  {"id":"umwuu6o36qfww","category":"OSPF 링크 비용","question":"OSPF에서 1Gbps 인터페이스의 링크 비용은 1이다.","answer":true,"explanation":"100Mbps/1000Mbps는 1 미만이지만 계산 값이 1 미만이면 1로 처리하므로 Fast Ethernet 이상은 모두 비용 1이다. [p.49]","difficulty":"표준","source":"4장 [p.49]"},
  {"id":"umwuu6o37yhsi","category":"OSPF 영역","question":"OSPF에서 영역(Area)은 라우터 단위로 정의된다.","answer":false,"explanation":"OSPF의 영역은 인터페이스별로 정의된다. [p.58]","difficulty":"표준","source":"4장 [p.58]"},
  {"id":"umwuu6o3856ar","category":"OSPF 영역","question":"OSPF에서 같은 영역 내의 모든 라우터는 동일한 토폴로지 DB를 가진다.","answer":true,"explanation":"같은 영역 내 라우터는 모두 동일한 링크 상태 데이터베이스를 보유한다. [p.58]","difficulty":"기초","source":"4장 [p.58]"},
  {"id":"umwuu6o39ms9x","category":"OSPF 계층 토폴로지","question":"다중 영역 OSPF에서 Local Area는 Area 0에 물리적으로 접해 있지 않아도 된다.","answer":false,"explanation":"다중 영역이면 Area 0(Backbone)이 반드시 있어야 하고 나머지 영역은 모두 물리적으로 Area 0에 접해 있어야 한다. [p.58, 60]","difficulty":"표준","source":"4장 [p.58, 60]"},
  {"id":"umwuu6o3ah7gb","category":"BGP","question":"BGP는 TCP 포트 179번을 사용한다.","answer":true,"explanation":"BGP는 TCP 포트 179번을 사용하며 점진적 갱신과 CIDR을 지원한다. [p.69]","difficulty":"기초","source":"4장 [p.69]"},
  {"id":"umwuu6o3bbcjj","category":"iBGP","question":"BGP에서 iBGP로 수신한 경로 정보는 다른 iBGP 라우터에게 다시 전달된다.","answer":false,"explanation":"iBGP로 받은 정보는 다른 iBGP 라우터로 전달하지 않으며, 이 때문에 AS 내 모든 라우터가 iBGP Full mesh로 연결된다. [p.74]","difficulty":"표준","source":"4장 [p.74]"},
  {"id":"umwuu6o3c1esr","category":"BGP 속성","question":"AS 경계 라우터는 eBGP 세션으로 다음 AS에 경로 정보를 전달할 때 AS-PATH 속성에 자신의 ASN을 첨부한다.","answer":true,"explanation":"경계 라우터는 eBGP로 경로를 넘길 때 AS-PATH에 자신의 ASN을 덧붙여 경유 AS 목록을 만든다. [p.76]","difficulty":"기초","source":"4장 [p.76]"},
  {"id":"umwuu6o3d9y1b","category":"BGP 속성","question":"BGP의 LOCAL_PREF 속성은 eBGP 세션을 통해 인접 AS로 전파된다.","answer":false,"explanation":"LOCAL_PREF는 iBGP 세션으로 같은 AS 내 라우터에게만 전파되고 eBGP 세션으로는 전파되지 않는다. [p.87]","difficulty":"표준","source":"4장 [p.87]"},
];
