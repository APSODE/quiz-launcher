// 업로드: 건보(apsode) · 2026-11-24
const META = {"group":"컴퓨터네트워크","exam":"기말고사","unit":"4장","title":"4장 라우팅 프로토콜 기본 개념 용어 14개","topic":"라우팅 프로토콜 기본 개념","scopeRev":1,"uploader":"apsode"};

const TERMS = [
  {"terms":["라우팅 테이블","라우팅테이블","Routing Table","RoutingTable"],"group":"4장","desc":"목적지 네트워크까지의 최적 경로 정보를 저장하는 표(Network, Mask, Cost, Next Hop, Interface로 구성)"},
  {"terms":["다음 홉","다음홉","Next Hop","NextHop"],"group":"4장","desc":"패킷을 전송할 다음 라우터의 주소"},
  {"terms":["라우팅 프로토콜","라우팅프로토콜","Routing Protocol","RoutingProtocol"],"group":"4장","desc":"목적지 네트워크에 대한 경로를 찾아 직접 연결되지 않은 네트워크 정보를 라우팅 테이블에 추가하는 규약"},
  {"terms":["정적 라우팅","정적라우팅","Static Routing","StaticRouting"],"group":"4장","desc":"관리자가 직접 목적지 네트워크의 최적 경로를 입력하며 항상 입력된 경로로 전송하는 방식"},
  {"terms":["디폴트 라우팅","디폴트라우팅","Default Routing","DefaultRouting"],"group":"4장","desc":"라우팅 테이블에 목적지 경로 정보가 없을 때 패킷을 전달할 기본 경로를 관리자가 직접 입력하는 방식"},
  {"terms":["동적 라우팅","동적라우팅","Dynamic Routing","DynamicRouting"],"group":"4장","desc":"라우터들이 네트워크 정보를 서로 교환하여 최적 경로를 자동으로 설정·갱신하는 방식"},
  {"terms":["Classful 라우팅 프로토콜","Classful라우팅프로토콜","Classful","클래스풀 라우팅 프로토콜","클래스풀라우팅프로토콜","클래스풀"],"group":"4장","desc":"네트워크 정보 교환 시 서브넷 마스크를 포함하지 않고 클래스 기반 마스크(/8, /16, /24)를 사용하는 프로토콜"},
  {"terms":["Classless 라우팅 프로토콜","Classless라우팅프로토콜","Classless","클래스리스 라우팅 프로토콜","클래스리스라우팅프로토콜","클래스리스"],"group":"4장","desc":"네트워크 정보 교환 시 서브넷 마스크를 포함하며 VLSM을 지원하는 프로토콜"},
  {"terms":["자율시스템","자율 시스템","AS","Autonomous System","AutonomousSystem"],"group":"4장","desc":"단일 기관에 소속되어 관리·제어되는 하나의 네트워크(전 세계 유일 번호 ASN 부여)"},
  {"terms":["IGP","Interior Gateway Protocol","InteriorGatewayProtocol"],"group":"4장","desc":"한 AS 내부에 포함된 라우터들 간에 정보를 교환하여 경로를 설정하는 프로토콜"},
  {"terms":["EGP","Exterior Gateway Protocol","ExteriorGatewayProtocol"],"group":"4장","desc":"서로 다른 AS 간에 정보를 교환하여 경로를 설정하는 프로토콜"},
  {"terms":["관리 거리","관리거리","AD","Administrative Distance","AdministrativeDistance"],"group":"4장","desc":"여러 라우팅 프로토콜이 같은 목적지 경로를 제시할 때 우선순위를 결정하는 0~255 정수(작을수록 우선)"},
  {"terms":["스텁 네트워크","스텁네트워크","Stub Network","StubNetwork"],"group":"4장","desc":"단일 경로에 의해 접근되는 네트워크"},
  {"terms":["메트릭","Metric"],"group":"4장","desc":"동적 라우팅 프로토콜이 최적 경로를 계산할 때 사용하는 기준 값"},
];
