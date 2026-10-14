// 운영체제_2장_하드웨어_단어집_2.jsx
const META = { group: "운영체제", unit: "2장", title: "컴퓨터 하드웨어 단어집 2", topic: "2장 핵심 용어 11개" };

const TERMS = [
  { terms: ["마스크 롬", "mask rom"], group: "2장", desc: "제조 과정에서 데이터가 기입되어 사용자는 읽기만 할 수 있는 ROM" },
  { terms: ["PROM", "programmable rom"], group: "2장", desc: "사용자가 한 번만 프로그램할 수 있는 ROM" },
  { terms: ["EPROM", "erasable prom"], group: "2장", desc: "자외선을 쬐어 내용을 지운 뒤 다시 프로그램할 수 있는 PROM" },
  { terms: ["EEPROM", "electrically erasable prom"], group: "2장", desc: "전기적인 방법으로 내용을 지우고 다시 쓸 수 있는 ROM" },
  { terms: ["유효 비트", "valid bit"], group: "2장", desc: "캐시 블록에 담긴 데이터가 올바른 것인지 판별하는 비트" },
  { terms: ["태그 비트", "tag bit"], group: "2장", desc: "캐시 블록이 주기억장치의 어느 블록인지 식별하는 비트" },
  { terms: ["FIFO", "first in first out"], group: "2장", desc: "가장 먼저 들어온 블록을 가장 먼저 교체하는 방식" },
  { terms: ["프로그램 입출력", "programmed i/o"], group: "2장", desc: "CPU가 입출력장치의 상태를 반복해서 확인하며 직접 제어하는 입출력 방식" },
  { terms: ["인터럽트 구동 입출력", "interrupt driven i/o"], group: "2장", desc: "장치가 작업을 마치면 인터럽트로 CPU에 알려 주는 입출력 방식" },
  { terms: ["내부 단편화", "internal fragmentation"], group: "2장", desc: "고정 분할에서 할당된 공간 안에 사용하지 않고 남는 공간" },
  { terms: ["외부 단편화", "external fragmentation"], group: "2장", desc: "가변 분할에서 할당과 해제를 반복하며 조각난 빈 공간이 흩어져 쓰기 어려워지는 현상" },
];
