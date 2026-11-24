// 업로드: 445 나무젓가락 도둑(ronaldo) · 2026-11-24
const META = {"group":"오픈소스소프트웨어","exam":"기말고사","unit":"1장","title":"1장 OSS개요 OX 15문제","topic":"OSS 개념 · 라이선스","uploader":"ronaldo"};

const QUESTIONS = [
  {"id":"umwut46bdunb5","category":"OSS 역사","question":"GNU 프로젝트는 1983년에 시작되었다.","answer":true,"explanation":"GNU 프로젝트는 1983년 리차드 스톨먼 주도로 시작되었다. [p.2]","source":"1장 p.2","difficulty":"기초"},
  {"id":"umwut46benuvk","category":"OSS 역사","question":"LINUX Kernel 1.0은 1984년에 출시되었다.","answer":false,"explanation":"LINUX Kernel 1.0은 1994년에 출시되었으며, 1984년은 FSF가 설립된 해이다. [p.2]","source":"1장 p.2","difficulty":"기초"},
  {"id":"umwut46bfdg1a","category":"Apache License","question":"Apache 라이선스 적용 SW의 소스코드를 수정 배포할 때는 아파치 재단이 제작했다는 사실을 밝혀야 한다.","answer":true,"explanation":"수정 배포 시 아파치 라이선스 정보와 아파치 재단에서 만들었다는 사실을 밝혀야 한다. [p.11]","source":"1장 p.11","difficulty":"기초"},
  {"id":"umwut46bgwpcf","category":"GNU GPL","question":"GPL 코드를 사용한 프로그램을 기관 내부에서만 사용할 때는 소스코드를 공개할 필요가 없다.","answer":true,"explanation":"개인·기관·단체 내부에서만 사용할 때는 공개 의무가 없고, 외부에 공표(배포)할 때 전체 소스코드를 공개해야 한다. [p.7]","source":"1장 p.7","difficulty":"표준"},
  {"id":"umwut46bhdqtq","category":"GNU LGPL","question":"LGPL 코드를 수정해 만든 파생 라이브러리를 배포할 때는 수정한 부분의 코드만 공개하면 된다.","answer":false,"explanation":"LGPL 코드를 수정하거나 파생된 라이브러리를 개발해 배포할 경우 전체 코드를 공개해야 한다. [p.8]","source":"1장 p.8","difficulty":"표준"},
  {"id":"umwut46biitru","category":"OSS 솔루션 맵","question":"OSS 솔루션 맵의 4개 SW 그룹 중 솔루션 종류가 가장 많은 그룹은 미들웨어이다.","answer":false,"explanation":"시스템 SW 7, 미들웨어 4, 응용 SW 6, 기타 6으로 시스템 SW가 가장 많다. [p.15]","source":"1장 p.15","difficulty":"표준"},
  {"id":"umwut46bja9ay","category":"OSS 역사","question":"LINUX Kernel 1.0은 리누스 베네딕트 토르발스가 출시했다.","answer":true,"explanation":"1994년 리누스 베네딕트 토르발스가 LINUX Kernel 1.0을 출시했다. [p.2]","source":"1장 p.2","difficulty":"기초"},
  {"id":"umwut46bkfci3","category":"OSS 도입 효과","question":"OSS 도입 시 유지보수 비용 절약 효과는 연간 약 1천억 원의 경제적 이득을 준다.","answer":true,"explanation":"OSS 도입에 따른 유지보수 비용 절약 효과는 연간 약 1천억 원의 경제적 이득으로 제시된다. [p.13]","source":"1장 p.13","difficulty":"기초"},
  {"id":"umwut46bltyha","category":"SW 역사","question":"컴퓨터 등장 이후 '80년대까지 SW는 하드웨어에 부수적으로 뒤따르는 존재였다.","answer":true,"explanation":"'80년대까지 SW는 하드웨어에 부수적으로 뒤따르는 존재였고, 이후 분리되어 상품화되었다. [p.2]","source":"1장 p.2","difficulty":"기초"},
  {"id":"umwut46bmsxvc","category":"라이선스 위반","question":"OSS는 자유롭게 사용할 수 있으므로 라이선스를 위반해도 법적 책임을 지지 않는다.","answer":false,"explanation":"OSS 라이선스를 위반하면 라이선스 위반에 따른 법적 책임을 져야 한다. [p.6]","source":"1장 p.6","difficulty":"표준"},
  {"id":"umwut46bnptzc","category":"Ubuntu LTS","question":"Ubuntu 26.04 LTS는 Ubuntu Pro 없이도 15년간 무료 보안·유지보수 업데이트를 제공한다.","answer":false,"explanation":"무료 보안·유지보수 업데이트는 5년이며, Ubuntu Pro를 이용해야 최대 15년까지 연장된다. [p.30]","source":"1장 p.30","difficulty":"심화"},
  {"id":"umwut46bo5aj0","category":"SW 보호","question":"프로그래밍 언어 코딩(소스코드) 단계는 영업 비밀로 보호할 수 없다.","answer":false,"explanation":"소스코드 단계는 저작권 보호 및 영업 비밀이 가능하며, 영업 비밀이 불가한 것은 실행코드 단계이다. [p.12]","source":"1장 p.12","difficulty":"표준"},
  {"id":"umwut46bpq3ko","category":"라이선스 비교","question":"라이선스별 비교표에서 LGPL은 '2차적 저작물 재공개 의무'가 있는 라이선스로 분류된다.","answer":true,"explanation":"p.6 비교표에서 GPL·LGPL·MPL은 2차적 저작물 재공개 의무가 'O'이다(LGPL 라이브러리를 사용만 한 프로그램의 공개 의무와는 별개). [p.6]","source":"1장 p.6","difficulty":"표준"},
  {"id":"umwut46bq7rj8","category":"SW 보호","question":"순서도(알고리즘) 단계는 특허출원 시 특허권 보호를 받을 수 있다.","answer":true,"explanation":"순서도(알고리즘) 단계는 특허출원 시 특허권 보호 및 영업 비밀이 가능하다. [p.12]","source":"1장 p.12","difficulty":"기초"},
  {"id":"umwut46br20ra","category":"VirtualBox","question":"VirtualBox 7.2.14의 Extension Pack은 GPL v3 하에 배포된다.","answer":false,"explanation":"GPL v3로 배포되는 것은 Platform packages이고, Extension Pack에는 PUEL(Personal Use and Educational License)이 적용된다. [p.28]","source":"1장 p.28","difficulty":"표준"},
];
