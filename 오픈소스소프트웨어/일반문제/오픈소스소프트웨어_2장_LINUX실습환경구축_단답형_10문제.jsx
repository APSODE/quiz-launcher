// 업로드: 445 나무젓가락 도둑(ronaldo) · 2026-11-24
const META = {"group":"오픈소스소프트웨어","exam":"기말고사","unit":"2장","title":"2장 LINUX실습환경구축 단답형 10문제","topic":"VirtualBox · Ubuntu 설치","uploader":"ronaldo"};

const QUESTIONS = [
  {"id":"umwut519z887m","category":"사전 설정","question":"VirtualBox 사용 전 'Windows 기능 켜기/끄기'에서 체크 해제해야 하는, MS-Windows에 내장된 가상머신 기능의 이름은?","answers":["Hyper-V","HyperV","Hyper V","하이퍼-V","하이퍼V"],"displayAnswer":"Hyper-V","explanation":"Hyper-V는 MS-Windows에 내장된 가상머신 기능으로, 체크 해제 후 [확인]을 클릭한다(Win10 Pro/Enterprise/Education 64bit only). [p.3]","source":"2장 p.3","difficulty":"기초"},
  {"id":"umwut51a085n9","category":"BIOS 설정","question":"VM에서 멀티코어 CPU 기능을 쓰기 위해 BIOS에서 활성화하는 가상화 지원 기능 중 Intel CPU에 해당하는 것은? (영문)","answers":["VTx","VT-x","VT x","Intel VTx","Intel VT-x"],"displayAnswer":"VTx","explanation":"BIOS에서 가상화 지원(Intel VTx 또는 AMD-V)을 활성화해야 한다. [p.4]","source":"2장 p.4","difficulty":"기초"},
  {"id":"umwut51a17kig","category":"가상 머신 생성","question":"가상 머신 생성 안내의 메모리 크기 6GB를 MB 단위로 입력하면 얼마인가? (숫자만)","answers":["6144","6144MB","6144 MB"],"displayAnswer":"6144","explanation":"가상 머신 생성 안내의 메모리 크기는 6144 MB(6GB)이다. [p.9]","source":"2장 p.9","difficulty":"표준"},
  {"id":"umwut51a25x9b","category":"가상 머신 생성","question":"가상 머신 생성 시 하드 디스크의 파일 종류로 선택하도록 안내된 형식은? (영문 약어)","answers":["VDI","VirtualBox 디스크 이미지","VirtualBox Disk Image"],"displayAnswer":"VDI","explanation":"파일 종류는 VDI(VirtualBox 디스크 이미지)로 선택한다. [p.9]","source":"2장 p.9","difficulty":"기초"},
  {"id":"umwut51a3tiae","category":"공유 폴더","question":"공유 폴더를 추가했지만 게스트 OS에서 접근이 되지 않는다. 터미널에서 adduser 명령으로 사용자 oss를 추가해야 하는 그룹의 이름은?","answers":["vboxsf"],"displayAnswer":"vboxsf","explanation":"공유 폴더 설정 후 터미널에서 `sudo adduser oss vboxsf`를 입력하고 게스트 OS를 재부팅해야 접근할 수 있다. [p.23~24]","source":"2장 p.23~24","difficulty":"기초"},
  {"id":"umwut51a4a0us","category":"게스트 확장","question":"게스트 확장 CD 이미지를 삽입한 뒤 터미널에서 가장 먼저 입력하는 명령은? (명령 전체)","answers":["sudo apt-get update","apt-get update","sudo apt update","apt update"],"displayAnswer":"sudo apt-get update","explanation":"터미널에서 `sudo apt-get update` → `sudo apt-get install build-essential gcc make perl dkms` → cd 이동 → 스크립트 실행 순으로 입력한다. [p.18~19]","source":"2장 p.18~19","difficulty":"기초"},
];
