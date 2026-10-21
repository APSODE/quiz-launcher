// 실전 시험지 모드 — 02 HTML 기본태그
// 연습 메뉴 문항 데이터. 형식: quiz_format_spec.md 12장 · 엔진: 플러그인/웹프로그래밍/4_실전시험.js 머리 주석
const META = { practice: 'webexam' };
const CATS = [{ id: 'html', name: '02 HTML 기본' }];

const ITEMS = [
  // ── 객관식: 2개 고르시오 ──
  { cat: 'html', type: 'pick2', q: '닫는 태그가 없는 태그를 2개 고르시오.',
    choices: ['<br>', '<p>', '<img>', '<li>', '<span>'], ans: [0, 2],
    explain: 'br · hr · img는 닫는 태그가 없다. </li>는 생략할 수 있지만 닫는 태그가 있는 태그다.' },
  { cat: 'html', type: 'pick2', q: '<head> 안에 들어가는 요소를 2개 고르시오.',
    choices: ['<title>', '<h1>', '<meta charset="utf-8">', '<table>', '<img>'], ans: [0, 2],
    explain: 'head = 문서 정보(title, meta)와 CSS · JS 링크, body = 화면에 보이는 내용.' },
  { cat: 'html', type: 'pick2', q: '표에서 셀을 합칠 때 쓰는 속성을 2개 고르시오.',
    choices: ['colspan', 'cellspan', 'rowspan', 'merge', 'span'], ans: [0, 2],
    explain: 'colspan = 열(가로) 합치기, rowspan = 행(세로) 합치기.' },
  // ── 객관식: 모두 고르시오 ──
  { cat: 'html', type: 'pickall', q: 'HTML 태그와 의미의 짝으로 옳은 것을 모두 고르시오.',
    choices: ['<strong> - 중요해서 강조', '<b> - 중요해서 강조', '<q> - 줄바꿈 없는 인용, 따옴표 추가', '<blockquote> - 인용문, 자동 들여쓰기', '<mark> - 취소선'], ans: [0, 2, 3],
    explain: 'b = 단순 굵게, mark = 형광펜(노랑).' },
  { cat: 'html', type: 'pickall', q: '표(table)에 대한 설명으로 옳은 것을 모두 고르시오.',
    choices: ['<th>는 제목 셀이다', '<caption>은 표 아래쪽 중앙에 표시된다', 'thead · tbody · tfoot을 쓰면 화면 판독기가 표 구조를 이해하기 쉽다', '<tr>은 표의 열(세로)을 만든다', '예전에는 레이아웃에, 지금은 게시판에 많이 쓴다'], ans: [0, 2, 4],
    explain: 'caption은 위쪽 중앙, tr은 행(가로 한 줄).' },
  { cat: 'html', type: 'pickall', q: '이미지 · 링크에 대한 설명으로 옳은 것을 모두 고르시오.',
    choices: ['alt는 이미지를 표시할 수 없을 때 보이는 대체 텍스트다', 'src 경로는 HTML 파일 위치를 기준으로 한다', 'target을 생략하면 새 탭에서 열린다', 'rel="noopener"는 새 창이 원래 페이지에 접근하지 못하게 하는 보안 속성이다', 'PNG는 손실 압축이라 투명 배경을 쓸 수 없다'], ans: [0, 1, 3],
    explain: 'target 생략 = 현재 화면. PNG = 무손실 + 투명 배경.' },
  // ── 단답형: 빈칸 ──
  { cat: 'html', type: 'blank', q: '<hn> 제목 태그는 n이 [[0]]수록 글자가 크다. (작을 / 클 중 하나)',
    blanks: [['작을']], explain: 'h1이 가장 크고 h6이 가장 작다.' },
  { cat: 'html', type: 'blank', q: 'HTML에서 "<" 문자를 표시하려면 특수문자 [[0]]를, 공백은 [[1]]를 쓴다.',
    blanks: [['&lt;', '&lt'], ['&nbsp;', '&nbsp']], explain: '&lt; <, &amp; &, &quot; ", &nbsp; 공백.' },
  { cat: 'html', type: 'blank', q: '<figure> 안에서 이미지 설명을 붙이는 태그는 [[0]]이며, 이 태그가 이미지보다 앞에 있으면 [[1]]쪽에 표시된다. (위 / 아래)',
    blanks: [['figcaption', '<figcaption>'], ['위']], explain: 'figcaption이 앞이면 위, 뒤면 아래.' },
  // ── 단답형: 개념 ──
  { cat: 'html', type: 'concept', q: '설명 목록에서 용어(terms) 부분을 나타내는 태그 이름은?',
    blanks: [['dt', '<dt>']], explain: 'dl(설명 목록) / dt(용어) / dd(설명). dt 하나에 dd 여러 개 가능.' },
  { cat: 'html', type: 'concept', q: 'HTML은 HyperText Markup Language의 약자다. 이 중 "링크로 연결된 텍스트"를 뜻하는 단어는? (영문)',
    blanks: [['HyperText', 'Hyper Text', '하이퍼텍스트']], explain: 'HyperText = 링크로 연결된 텍스트, Markup = 문서 구조 정의.' },
  { cat: 'html', type: 'concept', q: '"중요해서 강조"가 아니라 "단순히 굵게"만 표시하는 태그 이름은?',
    blanks: [['b', '<b>']], explain: 'strong = 중요 강조, b = 단순 굵게.' },
  // ── 단답형: 코드 완성 ──
  { cat: 'html', type: 'code', q: '링크를 새 탭에서 열고, 새 탭이 원래 페이지에 접근하지 못하게 완성하시오.',
    code: '<a href="https://www.hsd.co.kr" target="[[0]]" rel="[[1]]">메뉴 보기</a>',
    blanks: [['_blank'], ['noopener']], preview: true, explain: 'target="_blank" = 새 탭, rel="noopener" = 보안.' },
  { cat: 'html', type: 'code', q: '"1학기" 제목 셀이 열 4칸을 차지하고, "학년" 셀이 행 2칸을 차지하도록 완성하시오.',
    code: '<table border="1">\n  <tr><th [[0]]="2">학년</th><th [[1]]="4">1학기</th></tr>\n  <tr><th>구분</th><th>과목코드</th><th>과목명</th><th>학점</th></tr>\n</table>',
    blanks: [['rowspan'], ['colspan']], preview: true, explain: 'rowspan = 행 합치기, colspan = 열 합치기.' },
  { cat: 'html', type: 'code', q: '순서 있는 목록(1, 2, 3)을 완성하시오.',
    code: '<[[0]]>\n  <[[1]]>HTML</[[1]]>\n  <[[1]]>CSS</[[1]]>\n  <[[1]]>JavaScript</[[1]]>\n</[[0]]>',
    blanks: [['ol'], ['li']], preview: true, explain: 'ol = 순서 있는 목록, ul = 순서 없는 목록, 항목은 li.' },
  { cat: 'html', type: 'code', q: '이미지를 표시할 수 없을 때 "메인 이미지"가 보이도록 완성하시오.',
    code: '<img [[0]]="img/main.jpg" [[1]]="메인 이미지" width="200">',
    blanks: [['src'], ['alt']], preview: true, explain: 'src = 경로, alt = 대체 텍스트.' },
];
