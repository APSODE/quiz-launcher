// 1_기능구현퀴즈.js — quiz_launcher 플러그인: HTML · CSS 기능 구현 퀴즈
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  6. 웹프로그래밍 기능 구현 퀴즈 (HTML · CSS)
//  "이 기능을 만들려면 어떤 태그 · 속성 · 값을 써야 하나?" — 빈칸을 채우면 내 결과 화면이 바로 바뀐다.
//  ※ 출제 범위: 수업자료 02~07장(JS 제외)에 나온 태그 · 속성 · 값만 사용한다. 문제를 추가할 때도 src에 출처를 적을 것.
//
//  문제 하나 = WQ_TASKS 배열의 객체 하나
//   { cat, src, title, goal, html, css, blanks, hint, explain, hover?, widths?, choices? }
//   - html / css 안의 [[n]] 이 n번째 빈칸. 같은 번호를 여러 번 쓰면 첫 위치에만 입력칸이 생기고 나머지는 따라 바뀐다.
//   - blanks[n] = 정답 문자열 배열 (첫 번째가 대표 정답) 또는 { ans: [...], check: v => bool }
//     비교할 때 대소문자 · 공백 · 끝의 세미콜론 · 바깥 따옴표는 무시한다.
//   - choices: 빈칸 대신 고르기. [[0]] 자리에 들어갈 코드 후보 배열, ok 가 정답 (blanks 불필요)
//   - widths: 미리보기를 여러 너비로 보여 줌 (미디어 쿼리) · hover: 마우스를 올려 보라는 안내 표시
//   - 코드 속 'img/main.jpg' 는 미리보기에서 내장 그림으로 바뀐다.
// ════════════════════════════════════════════════════════
const WQ_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="400" height="260" fill="#bae6fd"/>' +
  '<circle cx="320" cy="60" r="34" fill="#fde047"/><path d="M0 260 L120 110 L210 220 L280 140 L400 260 Z" fill="#16a34a"/>' +
  '<path d="M0 260 L90 170 L170 260 Z" fill="#15803d"/><text x="16" y="34" font-size="22" font-family="sans-serif" fill="#0f172a">main.jpg</text></svg>');

const WQ_CATS = [
  { id: 'html', name: 'HTML 기본 (02)' },
  { id: 'form', name: 'form (03)' },
  { id: 'css', name: 'CSS 기초 (04)' },
  { id: 'layout', name: '레이아웃 (05)' },
  { id: 'flex', name: 'Flexbox · 반응형 (06)' },
  { id: 'anim', name: '애니메이션 (07)' },
];

const WQ_BOX = 'border: 2px solid #475569; padding: 8px; margin: 4px; background: #e0e7ff;';

const WQ_TASKS = [
  // ── 02 HTML 기본태그 ──
  { cat: 'html', src: '웹_02 링크 (s.29~31)', title: '새 탭으로 여는 안전한 링크',
    goal: '링크를 누르면 새 탭(창)에서 열리고, 새로 열린 페이지가 원래 페이지에 접근하지 못하게 하세요.',
    html: '<a href="https://www.hsd.co.kr/menu/menu_list" target="[[0]]" rel="[[1]]">한솥 메뉴 보기</a>',
    blanks: [['_blank'], ['noopener']],
    hint: 'target 은 "어디에 열지", rel 은 보안 속성입니다.',
    explain: 'target="_blank" = 새 탭/창, 생략하면 현재 화면. rel="noopener" = 새 창 페이지가 원래 페이지에 접근하지 못하게 하는 보안 속성.' },
  { cat: 'html', src: '웹_02 표 (s.17~22)', title: '셀 합치기',
    goal: '"학년" 칸은 세로로 두 줄을, "1학기" 칸은 가로로 두 칸을 차지하게 하세요.',
    html: '<table border="1">\n  <tr><th [[0]]="2">학년</th><th [[1]]="2">1학기</th></tr>\n  <tr><th>과목명</th><th>학점</th></tr>\n  <tr><td>2</td><td>웹프로그래밍</td><td>3</td></tr>\n</table>',
    blanks: [['rowspan'], ['colspan']],
    hint: '행(row)을 합치는지, 열(column)을 합치는지 생각해 보세요.',
    explain: 'rowspan = 행 합치기(세로), colspan = 열 합치기(가로). 실습 1 교육과정 편성표와 같은 구조입니다.' },
  { cat: 'html', src: '웹_02 이미지 (s.24~27)', title: '이미지 대체 텍스트',
    goal: '이미지 파일이 없어서 표시할 수 없을 때 "메인 이미지"라는 글자가 대신 보이게 하세요.',
    html: '<img src="no-image.jpg" [[0]]="메인 이미지" width="200">',
    blanks: [['alt']],
    hint: '이미지 표시가 불가능할 때의 대체(alternative) 텍스트입니다.',
    explain: 'alt = 이미지를 표시할 수 없을 때의 대체 텍스트. img 는 닫는 태그가 없습니다.' },
  { cat: 'html', src: '웹_02 텍스트 (s.6~11)', title: '줄바꿈 없는 짧은 인용',
    goal: '문장 안에서 줄을 바꾸지 않고 인용하며, 앞뒤에 따옴표가 자동으로 붙게 하세요.',
    html: '<p>교수님이 <[[0]]>다음 주에 퀴즈 봅니다</[[0]]>라고 하셨다.</p>',
    blanks: [['q']],
    hint: 'blockquote 는 블록(줄바꿈 + 들여쓰기)입니다. 한 줄 인용 태그는?',
    explain: '<q> = 줄바꿈 없이 한 줄 인용, 따옴표 자동 추가. <blockquote> = 블록 인용, 자동 들여쓰기.' },
  { cat: 'html', src: '웹_02 텍스트 (s.6~11)', title: '특수문자 출력',
    goal: '화면에 "a < b" 가 그대로 보이게 하세요. (< 를 그냥 쓰면 태그 시작으로 오해될 수 있습니다)',
    html: '<p>조건식: a [[0]] b</p>',
    blanks: [['&lt;']],
    hint: 'less than 의 약자입니다. & 로 시작해 ; 로 끝납니다.',
    explain: '&lt; = <, &amp; = &, &quot; = ", &nbsp; = 띄어쓰기.' },
  { cat: 'html', src: '웹_02 목록 (s.13~16)', title: '순서 있는 목록',
    goal: '항목 앞에 1. 2. 3. 번호가 자동으로 붙는 목록을 만드세요.',
    html: '<[[0]]>\n  <li>HTML 기본태그</li>\n  <li>form 태그</li>\n  <li>CSS 기초</li>\n</[[0]]>',
    blanks: [['ol']],
    hint: 'ordered list',
    explain: '<ol> = 순서 있는(ordered) 목록, <ul> = 순서 없는(unordered) 목록. 항목은 <li>.' },
  { cat: 'html', src: '웹_02 목록 (s.13~16)', title: '설명 목록 (사전 형식)',
    goal: '영어사전처럼 용어와 그 설명을 짝지어 보여 주세요.',
    html: '<dl>\n  <[[0]]>HTML</[[0]]>\n  <[[1]]>문서의 구조를 정의하는 마크업 언어</[[1]]>\n  <[[0]]>CSS</[[0]]>\n  <[[1]]>문서를 꾸미는 스타일 시트</[[1]]>\n</dl>',
    blanks: [['dt'], ['dd']],
    hint: 'terms 와 description 의 약자입니다.',
    explain: '<dl> 목록 + <dt> 용어(terms) + <dd> 설명(description). dt 하나에 dd 여러 개도 가능합니다.' },
  { cat: 'html', src: '웹_02 표 · 이미지 (s.21, 27)', title: '이미지 아래 설명 붙이기',
    goal: '이미지 아래쪽에 "가격 이상의 가치" 라는 설명이 붙도록 올바른 코드를 고르세요.',
    html: '<figure>\n[[0]]\n</figure>',
    choices: [
      { code: '  <img src="img/main.jpg" width="200">\n  <figcaption>가격 이상의 가치</figcaption>', ok: true },
      { code: '  <figcaption>가격 이상의 가치</figcaption>\n  <img src="img/main.jpg" width="200">' },
      { code: '  <img src="img/main.jpg" width="200">\n  <caption>가격 이상의 가치</caption>' },
    ],
    hint: 'figcaption 의 위치가 위 / 아래를 결정합니다.',
    explain: 'figure 안에서 figcaption 이 앞에 있으면 위, 뒤에 있으면 아래에 제목이 붙습니다. <caption> 은 표(table)의 제목입니다.' },

  // ── 03 form 태그 ──
  { cat: 'form', src: '웹_03 영역 구분 (s.8~9)', title: '라벨 클릭으로 입력칸 선택',
    goal: '"아이디" 글자를 클릭하면 옆 입력칸에 커서가 들어가게 하세요.',
    html: '<label [[0]]="user-id">아이디</label>\n<input type="text" id="user-id" name="user_id">',
    blanks: [['for']],
    hint: 'label 의 이 속성 값이 input 의 id 와 같아야 합니다.',
    explain: '<label for="user-id"> ↔ <input id="user-id">. label 로 input 을 감싸는 방법도 클릭 이동이 됩니다.' },
  { cat: 'form', src: '웹_03 input (s.10~17)', title: '하나만 고르는 라디오 버튼',
    goal: '세 성별 중 하나만 선택되게 하세요. (미리보기에서 직접 눌러 보세요)',
    html: '[[0]]',
    choices: [
      { code: '<input type="radio" name="gender" value="m"> 남\n<input type="radio" name="gender" value="f"> 여\n<input type="radio" name="gender" value="x"> 선택 안 함', ok: true },
      { code: '<input type="radio" name="g1" value="m"> 남\n<input type="radio" name="g2" value="f"> 여\n<input type="radio" name="g3" value="x"> 선택 안 함' },
      { code: '<input type="checkbox" name="gender" value="m"> 남\n<input type="checkbox" name="gender" value="f"> 여\n<input type="checkbox" name="gender" value="x"> 선택 안 함' },
    ],
    hint: 'radio 는 무엇이 같아야 한 그룹이 될까요?',
    explain: 'radio 는 name 을 같게 해야 한 그룹(단일 선택)이 됩니다. checkbox 는 다중 선택입니다.' },
  { cat: 'form', src: '웹_03 input (s.10~17)', title: '비밀번호 입력칸',
    goal: '입력한 글자가 •(또는 *)로 가려지는 입력칸을 만드세요.',
    html: '<label>비밀번호 <input type="[[0]]" name="pw"></label>',
    blanks: [['password']],
    hint: 'type 이름 그대로입니다.',
    explain: 'type="password" → 입력 내용이 * 나 • 로 표시됩니다.' },
  { cat: 'form', src: '웹_03 input (s.10~17)', title: '보이지 않게 함께 보내기',
    goal: '회원 번호 1234 를 화면에는 보이지 않지만 폼을 보낼 때 서버로 함께 전송되게 하세요.',
    html: '<form>\n  이름 <input type="text" name="name">\n  <input type="[[0]]" name="member_no" value="1234">\n</form>',
    blanks: [['hidden']],
    hint: '숨겨진(hidden) 입력입니다.',
    explain: 'type="hidden" = 화면에 안 보이지만 서버로 전송됩니다. 서버는 name(member_no)으로 값을 구분합니다.' },
  { cat: 'form', src: '웹_03 추가 속성 (s.18~19)', title: '힌트 문구와 필수 입력',
    goal: '입력칸에 "NNN-NN-NNNN" 힌트가 흐리게 보이고(클릭하면 사라짐), 비워 두면 제출되지 않게 하세요.',
    html: '<form>\n  사업자 번호 <input type="text" name="biz_no" [[0]]="NNN-NN-NNNN" [[1]]>\n  <input type="submit" value="제출">\n</form>',
    blanks: [['placeholder'], ['required', 'required="required"', 'required=""']],
    hint: '두 번째 빈칸은 값 없이 이름만 써도 되는 불리언 속성입니다.',
    explain: 'placeholder = 힌트, required = submit 시 필수 체크(값 없이 써도 됨). 오류 메시지는 브라우저마다 다릅니다.' },
  { cat: 'form', src: '웹_03 input (s.10~17)', title: '여러 줄 입력',
    goal: '여러 줄을 입력할 수 있는 칸(한 줄 30자, 4줄 표시)을 만드세요.',
    html: '<[[0]] name="memo" cols="30" rows="4"></[[0]]>',
    blanks: [['textarea']],
    hint: 'input 태그가 아닙니다!',
    explain: '<textarea> 는 input 이 아닙니다. cols = 한 줄 최대 문자 수, rows = 보이는 줄 수(넘치면 스크롤).' },
  { cat: 'form', src: '웹_03 기타 폼 요소 (s.20~22)', title: '처음부터 선택된 항목',
    goal: '페이지를 열었을 때 드롭다운에 "전자공학"이 처음부터 선택되어 있게 하세요.',
    html: '<select name="dept">\n  <option value="cs">컴퓨터공학</option>\n  <option value="ee" [[0]]>전자공학</option>\n  <option value="me">기계공학</option>\n</select>',
    blanks: [['selected', 'selected="selected"']],
    hint: '"선택된" 상태를 뜻하는 속성입니다.',
    explain: '<option selected> = 최초 선택 항목. 항목 그룹은 <optgroup label="..."> 로 묶습니다.' },
  { cat: 'form', src: '웹_03 영역 구분 (s.8~9)', title: '폼 구역과 구역 제목',
    goal: '폼의 "기업현황" 부분을 테두리로 묶고, 테두리 위에 "기업현황" 제목을 붙이세요.',
    html: '<form>\n  <[[0]]>\n    <[[1]]>기업현황</[[1]]>\n    기업명 <input type="text" name="company">\n  </[[0]]>\n</form>',
    blanks: [['fieldset'], ['legend']],
    hint: '구역(field set)과 그 범례(legend)입니다.',
    explain: '<fieldset> = 폼 안 구역 나누기, <legend> = 그 구역의 제목.' },
  { cat: 'form', src: '웹_03 form 태그 (s.3~7)', title: '검색어가 주소창에 보이게',
    goal: '검색 버튼을 누르면 입력한 검색어가 URL 의 쿼리 스트링(?keyword=...)으로 전송되게 하세요.',
    html: '<form action="search.jsp" method="[[0]]">\n  <input type="text" name="keyword">\n  <input type="submit" value="검색">\n</form>',
    blanks: [['get']],
    hint: '조회(검색) 용도 · URL 에 입력 내용이 나타나는 메서드입니다.',
    explain: 'GET = URL 에 쿼리 스트링으로 나타남, 데이터 요청(검색). POST = HTTP Body 에 담겨 URL 에 안 보임, 생성 · 제출.' },
  { cat: 'form', src: '웹_03 input (s.10~17)', title: '제출 · 다시입력 버튼',
    goal: '"제출하기" 버튼은 서버로 전송하고, "다시입력" 버튼은 입력 내용을 전부 지우게 하세요.',
    html: '<form>\n  이름 <input type="text" name="name">\n  <input type="[[0]]" value="제출하기">\n  <input type="[[1]]" value="다시입력">\n</form>',
    blanks: [['submit'], ['reset']],
    hint: '버튼에 보이는 글자는 value 로 정합니다.',
    explain: 'type="submit" = 서버로 전송, type="reset" = 입력 전부 삭제.' },

  // ── 04 CSS 기초 ──
  { cat: 'css', src: '웹_04 텍스트 꾸미기 (s.52~65)', title: '링크 밑줄 없애기',
    goal: '메뉴 링크의 밑줄을 없애세요.',
    html: '<a href="#">홈</a> | <a href="#">메뉴</a> | <a href="#">매장 찾기</a>',
    css: 'a {\n  text-decoration: [[0]];\n  color: #333;\n}',
    blanks: [['none']],
    hint: '링크 밑줄 제거는 CSS reset 에서도 자주 씁니다.',
    explain: 'text-decoration: none / underline / overline / line-through.' },
  { cat: 'css', src: '웹_04 가상 클래스 · 실습 (s.36~43, 66)', title: '게시판 줄무늬',
    goal: '표 본문의 짝수 번째 줄에만 회색 배경을 넣어 줄무늬를 만드세요.',
    html: '<table>\n  <tr><td>1</td><td>공지사항</td></tr>\n  <tr><td>2</td><td>중간고사 안내</td></tr>\n  <tr><td>3</td><td>과제 제출</td></tr>\n  <tr><td>4</td><td>휴강 안내</td></tr>\n</table>',
    css: 'table { border-collapse: collapse; }\ntd { border: 1px solid #ccc; padding: 4px 10px; }\ntr[[0]] {\n  background: #e5e7eb;\n}',
    blanks: [{ ans: [':nth-child(even)', ':nth-child(2n)'] }],
    hint: '":n번째 자식" 가상 클래스에 even 또는 2n 을 넣습니다.',
    explain: 'tr:nth-child(even) (= 2n) → 짝수 번째 줄. odd(= 2n+1)는 홀수 번째 줄입니다.' },
  { cat: 'css', src: '웹_04 가상 요소 (s.44~46)', title: '필수 항목 * 표시',
    goal: '모든 label 앞에 빨간 * 를 CSS 만으로 붙이세요. (HTML 은 고치지 않습니다)',
    html: '<label>아이디</label> <input type="text"><br>\n<label>비밀번호</label> <input type="password">',
    css: 'label[[0]] {\n  [[1]]: "*";\n  color: red;\n}',
    blanks: [['::before', ':before'], ['content']],
    hint: '요소 "앞"에 내용을 추가하는 가상 요소 + 넣을 내용을 정하는 속성',
    explain: 'label::before { content: "*"; } → 요소 앞에 내용 추가. 콜론 1개(:before)는 레거시, 2개는 CSS3 표기로 의미가 같습니다.' },
  { cat: 'css', src: '웹_04 가상 클래스 · 실습 (s.36~43, 66)', title: '입력 중인 칸 강조',
    goal: '텍스트 입력칸을 클릭해 입력 중일 때만 배경이 노랗게 보이게 하세요.',
    html: '이름 <input type="text"><br>주소 <input type="text">',
    css: '[type=text][[0]] {\n  background: lightyellow;\n}',
    blanks: [[':focus']],
    hint: '초점(입력창 클릭) 상태를 뜻하는 가상 클래스입니다.',
    explain: ':focus = 초점이 있는(입력 중인) 요소. 속성 선택자 [type=text] 와 함께 씁니다.' },
  { cat: 'css', src: '웹_04 실습 메뉴 (s.47~50)', title: '마우스를 올린 메뉴 강조',
    goal: '목록의 기호(•)를 없애고, 마우스를 올린 항목만 주황 배경 · 흰 글자 · 손가락 커서가 되게 하세요.', hover: true,
    html: '<ul>\n  <li>메뉴소개</li>\n  <li>브랜드</li>\n  <li>가맹점</li>\n</ul>',
    css: 'ul { list-style-type: [[0]]; padding: 0; }\nli { padding: 6px 12px; }\nli[[1]] {\n  background: #FF8D3F;\n  color: #FFFFFF;\n  cursor: pointer;\n}',
    blanks: [['none'], [':hover']],
    hint: '두 번째는 "마우스를 올림" 가상 클래스입니다.',
    explain: 'list-style-type: none = 목록 기호 제거, li:hover = 마우스를 올린 li.' },
  { cat: 'css', src: '웹_04 다양한 선택자 (s.24~35)', title: '바로 아래 자식만',
    goal: 'nav 바로 아래에 있는 ul 에만 빨간 테두리를 주고, 그 안에 중첩된 하위 ul 에는 주지 마세요.',
    html: '<nav>\n  <ul>\n    <li>메뉴\n      <ul><li>하위 메뉴</li></ul>\n    </li>\n  </ul>\n</nav>',
    css: 'nav [[0]] ul {\n  border: 2px solid red;\n}',
    blanks: [['>']],
    hint: '공백(하위 선택자)은 모든 후손을 고릅니다.',
    explain: 'A > B = 바로 아래 자식만, A B(공백) = 모든 후손.' },
  { cat: 'css', src: '웹_04 다양한 선택자 (s.24~35)', title: '바로 다음 형제 하나',
    goal: 'h2 바로 다음에 오는 p 하나만 파란 글자로 만드세요. (그다음 p 들은 그대로)',
    html: '<h2>공지</h2>\n<p>첫 번째 문단</p>\n<p>두 번째 문단</p>\n<p>세 번째 문단</p>',
    css: 'h2 [[0]] p {\n  color: blue;\n}',
    blanks: [['+']],
    hint: '~ 는 다음 "모든" 형제입니다.',
    explain: 'A + B = 바로 다음 형제 하나(인접 형제), A ~ B = 다음 모든 형제.' },
  { cat: 'css', src: '웹_04 가상 클래스 (s.40~43)', title: '같은 타입 중 n번째',
    goal: 'body 의 자식 중 "div 들 가운데 두 번째" 인 box2 에만 테두리를 주세요. (중간에 p 가 끼어 있습니다)',
    html: '<div>box1</div>\n<p>문단</p>\n<div>box2</div>\n<div>box3</div>',
    css: 'div:[[0]](2) {\n  border: 3px solid red;\n}',
    blanks: [['nth-of-type']],
    hint: 'nth-child(2) 는 "두 번째 자식이 div 이면" 입니다. 여기서 두 번째 자식은 p 입니다.',
    explain: 'div:nth-of-type(2) = 같은 타입(div) 중 2번째 → box2. div:nth-child(2) 는 두 번째 자식이 p 라서 적용되지 않습니다.' },
  { cat: 'css', src: '웹_04 수직 가운데 정렬 (s.61~62)', title: '한 줄 글자 세로 가운데',
    goal: '높이 50px 버튼 안의 한 줄 글자를 세로 가운데에 오게 하세요. (flex 사용 X)',
    html: '<div class="btn">더 보기</div>',
    css: '.btn {\n  width: 160px;\n  height: 50px;\n  [[0]]: 50px;\n  text-align: center;\n  background: salmon;\n}',
    blanks: [['line-height']],
    hint: 'height 와 같은 값을 주는 "줄 높이" 속성입니다.',
    explain: '한 줄 텍스트는 height 와 line-height 를 같게 하면 세로 가운데에 옵니다.' },

  // ── 05 레이아웃 ──
  { cat: 'layout', src: '웹_05 box-sizing (s.7~8, 16)', title: '테두리까지 포함한 너비',
    goal: 'padding 20px · border 10px 이 있어도 박스 전체 너비가 정확히 300px(아래 파란 막대 길이)이 되게 하세요.',
    html: '<div class="box">박스</div>\n<div class="ruler"></div>',
    css: '.box {\n  width: 300px;\n  padding: 20px;\n  border: 10px solid #333;\n  box-sizing: [[0]];\n  background: #fde68a;\n}\n.ruler { width: 300px; height: 6px; background: #4f46e5; margin-top: 4px; }',
    blanks: [['border-box']],
    hint: '기본값 content-box 는 width 가 content 만의 너비입니다.',
    explain: 'border-box → width = border + padding + content (= 300px). content-box 면 300 + 40 + 20 = 360px 가 됩니다.' },
  { cat: 'layout', src: '웹_05 margin (s.18~23)', title: '가로 가운데 배치',
    goal: '너비 200px 박스를 화면(부모) 가로 가운데에 놓으세요. 창 크기가 변해도 가운데여야 합니다.',
    html: '<div class="container">가운데 박스</div>',
    css: '.container {\n  width: 200px;\n  margin: [[0]];\n  background: #bbf7d0;\n  text-align: center;\n}',
    blanks: [['0 auto', '0px auto', 'auto']],
    hint: '위아래 0, 좌우 자동',
    explain: 'margin: 0 auto → 위아래 0, 좌우 auto 로 가로 가운데. 값 2개 = 위아래 / 좌우.' },
  { cat: 'layout', src: '웹_05 border (s.9~15)', title: '원 모양 만들기',
    goal: '100×100 정사각형을 원으로 만드세요.',
    html: '<div class="circle"></div>',
    css: '.circle {\n  width: 100px;\n  height: 100px;\n  background: salmon;\n  border-radius: [[0]];\n}',
    blanks: [['50%', '50px']],
    hint: '모서리 반경을 너비의 절반으로',
    explain: 'border-radius: 50% → 원. 직사각형에서 높이 절반 이상 px 를 주면 알약 모양이 됩니다.' },
  { cat: 'layout', src: '웹_05 display (s.27~34)', title: '안 보이지만 자리는 그대로',
    goal: '가운데 B 박스를 안 보이게 하되, B 가 있던 자리(공간)는 비워 둔 채 유지하세요.',
    html: '<span class="b1">A</span><span class="b2">B</span><span class="b3">C</span>',
    css: 'span { display: inline-block; ' + WQ_BOX + ' }\n.b2 {\n  [[0]]: [[1]];\n}',
    blanks: [['visibility'], ['hidden']],
    hint: 'display: none 은 공간도 차지하지 않습니다.',
    explain: 'visibility: hidden = 공간 차지 + 안 보임. display: none = 공간도 차지하지 않음.' },
  { cat: 'layout', src: '웹_05 display (s.27~34)', title: '가로로 나란히 + 크기 지정',
    goal: '메뉴 항목(li)들을 가로로 나란히 놓으면서 각 항목에 너비 90px · 높이 40px 이 적용되게 하세요.',
    html: '<ul>\n  <li>메뉴소개</li><li>브랜드</li><li>가맹점</li>\n</ul>',
    css: 'ul { padding: 0; list-style-type: none; }\nli {\n  display: [[0]];\n  width: 90px;\n  height: 40px;\n  background: #fed7aa;\n}',
    blanks: [['inline-block']],
    hint: 'inline 은 width/height 가 적용되지 않습니다.',
    explain: 'inline-block = 인라인처럼 나란히 배치 + 블록처럼 너비 · 높이 지정 가능.' },
  { cat: 'layout', src: '웹_05 float · clear (s.35~37)', title: 'float 해제 (clearfix)',
    goal: '안의 박스들이 float 되어 회색 테두리 상자(.wrap)의 높이가 0으로 무너졌습니다. .wrap 이 박스들을 감싸게 하세요.',
    html: '<div class="wrap">\n  <div class="item">1</div>\n  <div class="item">2</div>\n</div>\n<p>아래 문단</p>',
    css: '.wrap { border: 3px solid #94a3b8; }\n.item { float: left; width: 80px; height: 60px; ' + WQ_BOX + ' }\n.wrap[[0]] {\n  content: "";\n  display: block;\n  clear: [[1]];\n}',
    blanks: [['::after', ':after'], ['both']],
    hint: '요소 "뒤"에 빈 블록을 만들고 양쪽 float 을 모두 해제합니다.',
    explain: 'clearfix: 선택자::after { content: ""; display: block; clear: both; }' },
  { cat: 'layout', src: '웹_05 position · 드롭다운 실습 (s.48~60)', title: '드롭다운 메뉴', hover: true,
    goal: '"메뉴" 에 마우스를 올리면 바로 아래에 하위 메뉴가 떠서 보이게(다른 요소를 밀어내지 않게) 하세요.',
    html: '<div class="dp1">메뉴\n  <ul class="dp2"><li>도시락</li><li>덮밥</li></ul>\n</div>\n<p>아래 내용 (밀려나면 안 됨)</p>',
    css: '.dp1 { display: inline-block; position: [[0]]; padding: 6px 14px; background: #fed7aa; }\n.dp2 {\n  display: none;\n  position: [[1]];\n  top: 100%; left: 0; width: 100%;\n  margin: 0; padding: 0; list-style-type: none; background: white; border: 1px solid #ccc;\n}\n.dp1:hover .dp2 { display: [[2]]; }',
    blanks: [['relative'], ['absolute'], ['block']],
    hint: '부모 ○○○ + 자식 ○○○ 관용구, 그리고 hover 때 다시 보이게',
    explain: '부모 relative + 자식 absolute → 자식이 부모 기준으로 떠 있고 공간을 차지하지 않습니다. top: 100% = 부모 바로 아래.' },
  { cat: 'layout', src: '웹_05 position (s.48~56)', title: '스크롤해도 고정된 헤더',
    goal: '미리보기를 스크롤해도 헤더가 항상 화면 맨 위에 붙어 있게 하세요.',
    html: '<header>고정 헤더</header>\n<div class="content">' + '본문 줄<br>'.repeat(20) + '</div>',
    css: 'body { margin: 0; }\nheader {\n  position: [[0]];\n  top: 0;\n  width: 100%;\n  background: #4f46e5;\n  color: white;\n  padding: 8px;\n}\n.content { padding-top: 40px; }',
    blanks: [['fixed']],
    hint: '브라우저 (0, 0) 기준, 스크롤과 무관',
    explain: 'position: fixed = 브라우저 기준 고정, 스크롤 · 창 크기와 무관. 고정 메뉴 · 사이드바 · 푸터에 사용.' },
  { cat: 'layout', src: '웹_05 배경 (s.62~69)', title: '배경 이미지로 꽉 채우기',
    goal: '배경 이미지가 비율을 유지하면서 박스를 빈틈 없이 다 덮게 하세요. (넘치는 부분은 잘려도 됨)',
    html: '<div class="hero"></div>',
    css: '.hero {\n  width: 320px;\n  height: 120px;\n  border: 2px solid #333;\n  background-image: url(img/main.jpg);\n  background-repeat: no-repeat;\n  background-size: [[0]];\n}',
    blanks: [['cover']],
    hint: 'contain 은 이미지 전체가 "들어오게" 해서 빈틈이 생길 수 있습니다.',
    explain: 'background-size: cover = 요소를 다 덮게, contain = 요소 안에 다 들어오게.' },

  // ── 06 Flexbox · 반응형 ──
  { cat: 'flex', src: '웹_06 컨테이너 속성 (s.12~21)', title: '정가운데 배치',
    goal: '박스 안의 아이템을 가로 · 세로 모두 정가운데에 놓으세요.',
    html: '<div class="box"><div class="item">가운데</div></div>',
    css: '.box {\n  display: [[0]];\n  justify-content: [[1]];\n  align-items: [[2]];\n  height: 150px;\n  border: 2px dashed #94a3b8;\n}\n.item { ' + WQ_BOX + ' }',
    blanks: [['flex'], ['center'], ['center']],
    hint: '메인축 정렬 + 교차축 정렬',
    explain: 'display: flex + justify-content: center(메인축) + align-items: center(교차축) = 정가운데.' },
  { cat: 'flex', src: '웹_06 컨테이너 속성 (s.12~21)', title: '양 끝에 붙이고 사이를 균등하게',
    goal: '첫 아이템은 왼쪽 끝, 마지막은 오른쪽 끝에 붙고, 나머지 사이 간격이 같게 하세요.',
    html: '<div class="row"><div class="i">로고</div><div class="i">메뉴</div><div class="i">로그인</div></div>',
    css: '.row {\n  display: flex;\n  justify-content: [[0]];\n  border: 2px dashed #94a3b8;\n}\n.i { ' + WQ_BOX + ' }',
    blanks: [['space-between']],
    hint: 'space-around 는 양 끝에도 여백이 있습니다.',
    explain: 'space-between = 양 끝 붙이고 사이 균등, space-around = 각 아이템 양옆 같은 여백, space-evenly = 모든 간격 동일.' },
  { cat: 'flex', src: '웹_06 컨테이너 속성 (s.12~21)', title: '넘치면 다음 줄로',
    goal: '아이템이 한 줄에 다 들어가지 않으면 줄어들지 말고 다음 줄로 넘어가게 하세요.',
    html: '<div class="row">' + [1, 2, 3, 4, 5, 6].map(n => '<div class="i">item' + n + '</div>').join('') + '</div>',
    css: '.row {\n  display: flex;\n  flex-wrap: [[0]];\n  width: 330px;\n  border: 2px dashed #94a3b8;\n}\n.i { flex-basis: 90px; flex-shrink: 0; ' + WQ_BOX + ' }',
    blanks: [['wrap']],
    hint: '기본값은 nowrap',
    explain: 'flex-wrap: wrap → 한 줄에 못 담으면 줄바꿈. 단축 표기 flex-flow: row wrap (direction + wrap 순서).' },
  { cat: 'flex', src: '웹_06 아이템 속성 · 실습 2 (s.23~38)', title: '고정 사이드바 + 늘어나는 본문',
    goal: '창이 좁아져도 aside 는 120px 에서 줄어들지 않고, article 이 남는 공간을 모두 차지하게 하세요.',
    html: '<div class="row"><aside>aside 120px</aside><article>article (남는 공간)</article></div>',
    css: '.row { display: flex; height: 80px; border: 2px dashed #94a3b8; }\naside {\n  flex-basis: 120px;\n  flex-shrink: [[0]];\n  background: #fde68a;\n}\narticle {\n  flex-grow: [[1]];\n  background: #bbf7d0;\n}',
    blanks: [['0'], { ans: ['1'], check: v => /^[1-9]\d*$/.test(v) }],
    hint: 'shrink 기본값은 1(줄어듦), grow 기본값은 0(안 늘어남)',
    explain: 'flex-shrink: 0 → basis 보다 작아지지 않는 고정폭. flex-grow: 1 이상 → 남는 여백을 차지.' },
  { cat: 'flex', src: '웹_06 order (s.32)', title: 'HTML 순서는 그대로, 보이는 순서만 바꾸기',
    goal: 'HTML 순서는 A, B, C 이지만 화면에서는 B 가 맨 앞에 보이게 하세요. (A · C 의 order 는 기본값 0)',
    html: '<div class="row"><div class="a">A</div><div class="b">B</div><div class="c">C</div></div>',
    css: '.row { display: flex; }\n.row div { ' + WQ_BOX + ' }\n.b {\n  order: [[0]];\n}',
    blanks: [{ ans: ['-1'], check: v => /^-\d+$/.test(v) && +v < 0 }],
    hint: '작은 숫자가 먼저 나옵니다. 다른 아이템은 0 입니다.',
    explain: 'order 는 작은 숫자가 먼저, 기본값 0. 0 보다 작은 값(예: -1)을 주면 맨 앞. HTML 구조 자체는 바뀌지 않습니다.' },
  { cat: 'flex', src: '웹_06 컨테이너 속성 (s.12~21)', title: '세로로 쌓기',
    goal: '아이템을 위에서 아래로 세로로 쌓으세요. (메인축을 세로로)',
    html: '<div class="col"><div class="i">1</div><div class="i">2</div><div class="i">3</div></div>',
    css: '.col {\n  display: flex;\n  flex-direction: [[0]];\n  border: 2px dashed #94a3b8;\n}\n.i { ' + WQ_BOX + ' }',
    blanks: [['column']],
    hint: '기본값 row 는 가로',
    explain: 'flex-direction: column → 메인축이 세로. 이때 justify-content 는 세로, align-items 는 가로 정렬이 됩니다.' },
  { cat: 'flex', src: '웹_06 긴 텍스트 처리 (s.14)', title: '긴 제목을 … 로 자르기',
    goal: '폭 150px 안에 다 안 들어가는 긴 제목을 한 줄로 두고, 넘치는 부분은 숨기면서 끝에 … 를 붙이세요.',
    html: '<div class="title">웹프로그래밍 기말고사 범위와 제출 과제 안내</div>',
    css: '.title {\n  width: 150px;\n  white-space: nowrap;\n  overflow: [[0]];\n  text-overflow: [[1]];\n  border: 1px solid #ccc;\n}',
    blanks: [['hidden'], ['ellipsis']],
    hint: '넘치는 부분 숨기기 + 말줄임표',
    explain: 'overflow: hidden; text-overflow: ellipsis; → 긴 문자열을 … 로 자릅니다.' },
  { cat: 'flex', src: '웹_06 미디어 쿼리 (s.44~59)', title: 'Mobile First 미디어 쿼리',
    goal: '기본(모바일)은 세로 1열, 화면 너비가 600px 이상일 때부터 가로로 배치되게 하세요. 아래 두 너비의 미리보기를 비교해 보세요.',
    widths: [360, 700],
    html: '<div class="row"><div class="i">A</div><div class="i">B</div><div class="i">C</div></div>',
    css: '.row { display: flex; flex-direction: column; }\n.i { flex: 1; ' + WQ_BOX + ' }\n@media ([[0]]: 600px) {\n  .row { flex-direction: row; }\n}',
    blanks: [['min-width']],
    hint: 'Mobile First = 작은 화면부터 → "최소 너비" 조건',
    explain: 'Mobile First 는 min-width 중심(작은 화면 → 큰 화면 순), Desktop First 는 max-width 중심입니다.' },

  // ── 07 애니메이션 ──
  { cat: 'anim', src: '웹_07 Transition (s.9~14)', title: 'transition 을 어디에 둘까',
    goal: '마우스를 올릴 때와 뗄 때 모두 2초 동안 부드럽게 width 가 바뀌게 하는 코드를 고르세요.', hover: true,
    html: '<div class="box">box</div>',
    css: '.box { width: 120px; height: 50px; background: salmon; }\n.box:hover { width: 300px; }\n[[0]]',
    choices: [
      { code: '.box { transition-duration: 2s; }', ok: true },
      { code: '.box:hover { transition-duration: 2s; }' },
      { code: '.box { transition-delay: 2s; }' },
    ],
    hint: ':hover 에 넣으면 "올릴 때만" 적용됩니다.',
    explain: 'transition 은 대상 요소(.box)에 넣어야 올릴 때 · 뗄 때 모두 자연스럽습니다. :hover 에 넣으면 뗄 때는 즉시 복귀합니다. delay 는 시작 전 지연 시간입니다.' },
  { cat: 'anim', src: '웹_07 실습 더 보기 버튼 (s.18~21)', title: '왼쪽부터 차오르는 게이지 버튼', hover: true,
    goal: '버튼에 마우스를 올리면 1초 동안 왼쪽부터 색이 끝까지 차오르게 하세요.',
    html: '<div class="btn_wrap">\n  <div class="gage"></div>\n  <h3>더 보기</h3>\n</div>',
    css: '.btn_wrap { width: 300px; height: 60px; border: 3px solid salmon; position: relative; }\n.gage {\n  position: absolute;\n  width: 0;\n  height: 100%;\n  background-color: salmon;\n  transition-duration: [[0]];\n}\n.btn_wrap h3 { position: absolute; width: 100%; margin: 0; line-height: 60px; text-align: center; }\n.btn_wrap:hover .gage { width: [[1]]; }',
    blanks: [['1s'], ['100%', '300px']],
    hint: '지속 시간 단위는 s, 끝까지 = 부모 너비 전체',
    explain: '.gage 의 width 를 0 → 100% 로 바꾸고 transition-duration: 1s 로 시간을 줍니다. 뒤에 정의된 absolute h3 가 위에 보입니다.' },
  { cat: 'anim', src: '웹_07 실습 사진 강조 (s.28~31)', title: '사진 확대 (넘치는 부분 숨김)', hover: true,
    goal: '사진에 마우스를 올리면 1.1배로 커지되, 틀 밖으로 넘치는 부분은 보이지 않게 하세요.',
    html: '<div class="item-img"><img src="img/main.jpg"></div>',
    css: '.item-img {\n  width: 240px;\n  overflow: [[0]];\n}\n.item-img > img { width: 100%; display: block; transition-duration: 1s; }\n.item-img:hover img { transform: [[1]]; }',
    blanks: [['hidden'], { ans: ['scale(1.1)'], check: v => /^scale\((1\.\d+|[2-9](\.\d+)?)\)$/.test(v) }],
    hint: '넘침 숨기기 + transform 의 크기 변경 메서드',
    explain: 'overflow: hidden 으로 넘치는 부분을 숨기고 transform: scale(1.1) 로 확대합니다. transform 은 주변 레이아웃(공간)을 바꾸지 않습니다.' },
  { cat: 'anim', src: '웹_07 animation · @keyframes (s.15~16)', title: '계속 튀는 공',
    goal: '공이 위아래로 튀는 2초짜리 애니메이션이 끝없이 반복되게 하세요.',
    html: '<div class="box"></div>',
    css: '@keyframes bounce {\n  0%   { transform: translateY(0); }\n  50%  { transform: translateY(80px); }\n  100% { transform: translateY(0); }\n}\n.box {\n  width: 40px; height: 40px; background: salmon;\n  border-radius: 50%;\n  animation: bounce 2s [[0]];\n}',
    blanks: [['infinite']],
    hint: '반복 횟수(iteration-count)를 "무한" 으로',
    explain: 'animation 단축 속성에 iteration-count 로 infinite 를 주면 무한 반복합니다. @keyframes 의 from = 0%, to = 100%.' },
  { cat: 'anim', src: '웹_07 Transform (s.3~7)', title: '공간은 그대로, 보이는 위치만 이동',
    goal: '빨간 A 박스가 원래 자리(공간)는 그대로 둔 채 아래로 40px 이동해 보이게 하세요. (transform 사용, 옆의 B 는 움직이면 안 됩니다)',
    html: '<div class="a">A</div><div class="b">B</div>',
    css: 'div { display: inline-block; width: 60px; height: 40px; ' + WQ_BOX + ' }\n.a {\n  background: salmon;\n  transform: [[0]];\n}',
    blanks: [{ ans: ['translateY(40px)', 'translate(0,40px)', 'translate(0px,40px)'] }],
    hint: 'position relative 처럼 현재 위치에서 y 만큼 이동하는 메서드',
    explain: 'transform: translateY(40px) → 현재 위치에서 아래로 이동(translateX 는 가로). A 가 있던 자리는 비워진 채 유지되고 B 도 그대로입니다. transform 은 보이는 모습만 바꿉니다.' },
  { cat: 'anim', src: '웹_07 실습 밑줄 애니메이션 (s.22~27)', title: '가운데서 펼쳐지는 밑줄', hover: true,
    goal: '글자에 마우스를 올리면 밑줄이 가운데서 양옆으로 펼쳐지게 하세요. (::after 는 left: 50%, width: 0 에서 시작)',
    html: '<h3 class="area_sc">가운데서 펼치기</h3>',
    css: '.area_sc { position: relative; display: inline-block; }\n.area_sc::after {\n  content: ""; display: block; height: 6px; background: salmon;\n  position: absolute; top: 100%;\n  left: 50%; width: 0;\n  transition-duration: 1s;\n}\n.area_sc:hover::after {\n  width: [[0]];\n  left: [[1]];\n}',
    blanks: [['100%'], ['0', '0px', '0%']],
    hint: '끝까지 펼쳐질 때 시작 위치(left)를 왼쪽 끝으로 옮겨야 합니다.',
    explain: 'hover 시 width: 100%; left: 0; → 가운데에서 양쪽으로 펼쳐집니다. left 를 그대로 두면 오른쪽으로만 늘어납니다.' },

  // ── 추가 문제 (2026-10-20) ──
  // 02 HTML
  { cat: 'html', src: '웹_02 텍스트 태그', title: '가장 큰 제목',
    goal: '"웹프로그래밍" 을 문서에서 가장 큰 제목으로 만드세요.',
    html: '<[[0]]>웹프로그래밍</[[0]]>\n<p>중간고사 정리</p>',
    blanks: [['h1']],
    hint: 'h 다음 숫자가 작을수록 큽니다.',
    explain: '<h1>~<h6>: 숫자가 작을수록 큰 제목. <title> 은 브라우저 제목 표시줄용입니다.' },
  { cat: 'html', src: '웹_02 텍스트 태그', title: '중요해서 굵게',
    goal: '"7장까지" 를 중요한 내용이라는 의미로 굵게 강조하세요. (단순히 굵게가 아님)',
    html: '<p>시험 범위는 <[[0]]>7장까지</[[0]]>입니다.</p>',
    blanks: [['strong']],
    hint: '중요 강조 = s…, 단순히 굵게 = b',
    explain: 'strong = 중요해서 강조, b = 단순히 굵게. 화면 모양은 같지만 의미가 다릅니다.' },
  { cat: 'html', src: '웹_02 텍스트 태그', title: '형광펜 칠하기',
    goal: '"중간고사" 에 노란 형광펜 효과를 주세요.',
    html: '<p>다음 주는 <[[0]]>중간고사</[[0]]> 기간입니다.</p>',
    blanks: [['mark']],
    hint: '표시(마크)하다',
    explain: 'mark = 형광펜(노랑).' },
  { cat: 'html', src: '웹_02 텍스트 태그', title: '분위기 바꾸는 가로줄',
    goal: '두 문단 사이에 가로줄을 넣어 분위기를 전환하세요. (닫는 태그 없음)',
    html: '<p>1부: HTML</p>\n<[[0]]>\n<p>2부: CSS</p>',
    blanks: [['hr', 'hr/', 'hr /']],
    hint: 'horizontal rule',
    explain: 'hr = 수평 줄. br(줄 바꿈)과 함께 닫는 태그가 없는 태그입니다.' },
  { cat: 'html', src: '웹_02 표 (s.18)', title: '세로로 셀 합치기',
    goal: '"월요일" 셀이 아래 행까지 2칸을 세로로 차지하게 하세요.',
    html: '<table border="1">\n  <tr><td [[0]]="2">월요일</td><td>1교시 웹프</td></tr>\n  <tr><td>2교시 운영체제</td></tr>\n</table>',
    blanks: [['rowspan']],
    hint: '행(row)을 합친다',
    explain: 'rowspan = 행(세로) 합치기, colspan = 열(가로) 합치기.' },
  { cat: 'html', src: '웹_02 표 (s.21)', title: '표 위쪽 제목',
    goal: '표 위쪽 가운데에 "2학기 시간표" 라는 표 제목을 붙이세요.',
    html: '<table border="1">\n  <[[0]]>2학기 시간표</[[0]]>\n  <tr><th>월</th><th>화</th></tr>\n  <tr><td>웹프</td><td>운영체제</td></tr>\n</table>',
    blanks: [['caption']],
    hint: '표 전용 제목 태그 (figure 용은 figcaption)',
    explain: 'caption = 표 제목, 위쪽 중앙에 표시됩니다.' },
  { cat: 'html', src: '웹_02 링크 (s.29~31)', title: '이미지 배너 링크',
    goal: '그림을 누르면 https://www.hsd.co.kr 로 이동하는 이미지 링크(배너)를 만드세요.',
    html: '<[[0]] [[1]]="https://www.hsd.co.kr">\n  <img src="img/main.jpg" width="200">\n</[[0]]>',
    blanks: [['a'], ['href']],
    hint: '링크 태그와 주소 속성',
    explain: '<a href="주소"> 로 이미지를 감싸면 이미지 링크가 됩니다.' },
  { cat: 'html', src: '웹_02 텍스트 태그', title: '들여쓰기된 인용문',
    goal: '명언을 앞뒤 문단과 떨어진 블록 인용문으로 만들어 자동으로 들여쓰기되게 하세요.',
    html: '<p>오늘의 명언</p>\n<[[0]]>배움에는 끝이 없다.</[[0]]>\n<p>- 끝 -</p>',
    blanks: [['blockquote']],
    hint: '한 줄 인용은 q, 블록 인용은?',
    explain: 'blockquote = 블록 인용 + 자동 들여쓰기, q = 한 줄 인용 + 따옴표.' },
  // 03 form
  { cat: 'form', src: '웹_03 input (s.16)', title: '여러 개 고르는 체크박스',
    goal: '관심 분야를 여러 개 동시에 고를 수 있게 하세요.',
    html: '관심 분야:\n<label><input type="[[0]]" name="it" checked> HTML</label>\n<label><input type="[[0]]" name="it" checked> CSS</label>\n<label><input type="[[0]]" name="it"> JS</label>',
    blanks: [['checkbox']],
    hint: 'radio 는 하나만 고릅니다.',
    explain: 'checkbox = 다중 선택(name 은 같거나 달라도 됨), radio = 단일 선택(name 을 같게).' },
  { cat: 'form', src: '웹_03 input type (s.13)', title: '메일 주소 형식 검사',
    goal: '입력한 값이 메일 주소 형식인지 브라우저가 자동으로 검사하는 입력칸을 만드세요.',
    html: '<form>\n  이메일 <input type="[[0]]" name="mail" value="abc">\n  <input type="submit">\n</form>',
    blanks: [['email']],
    hint: 'tel 은 형식을 검사하지 않습니다.',
    explain: 'type="email" 은 형식을 자동 체크합니다. tel 은 체크하지 않습니다.' },
  { cat: 'form', src: '웹_03 input type (s.13)', title: '날짜 고르기',
    goal: '설립일을 달력에서 고를 수 있는 입력칸을 만드세요.',
    html: '설립일 <input type="[[0]]" value="2026-10-20">',
    blanks: [['date']],
    hint: '시간은 time, 날짜는?',
    explain: 'type="date" = 날짜, type="time" = 시간.' },
  { cat: 'form', src: '웹_03 기타 폼 요소 (s.21)', title: '드롭다운 항목 묶기',
    goal: '학과 목록을 "공과대학", "인문대학" 그룹으로 묶으세요.',
    html: '<select size="6">\n  <[[0]] label="공과대학">\n    <option>컴퓨터공학과</option><option>전자공학과</option>\n  </[[0]]>\n  <[[0]] label="인문대학">\n    <option>국어국문학과</option>\n  </[[0]]>\n</select>',
    blanks: [['optgroup']],
    hint: 'option + group',
    explain: '<optgroup label="…"> 으로 select 항목을 그룹화합니다.' },
  { cat: 'form', src: '웹_03 form 태그 (s.5~6)', title: 'URL에 안 보이게 전송',
    goal: '회원가입 정보가 주소창(URL)에 나타나지 않고 HTTP Body 에 담겨 전송되게 하세요.',
    html: '<form action="join.jsp" method="[[0]]">\n  아이디 <input type="text" name="id">\n  <input type="submit" value="가입">\n</form>',
    blanks: [['post']],
    hint: 'GET 은 쿼리스트링으로 URL 에 보입니다.',
    explain: 'POST = Body 에 담김(생성·제출), GET = URL 쿼리스트링(조회·검색).' },
  { cat: 'form', src: '웹_03 textarea (s.14)', title: '자기소개 입력칸 크기',
    goal: '자기소개 입력칸을 5줄 높이, 한 줄 30글자 너비로 만드세요.',
    html: '<textarea [[0]]="5" [[1]]="30">자기소개를 쓰세요.</textarea>',
    blanks: [['rows'], ['cols']],
    hint: '줄 수 = 행(row), 한 줄 글자 수 = 열(column)',
    explain: 'rows = 표시 줄 수, cols = 한 줄 최대 문자 수.' },
  { cat: 'form', src: '웹_03 기타 폼 요소 (s.22)', title: '타이핑 가능한 select',
    goal: '학과를 직접 타이핑하거나 목록에서 고를 수 있는 입력칸을 만드세요. (input 의 list 와 id 를 연결)',
    html: '학과 <input list="dept">\n<[[0]] id="dept">\n  <option value="컴퓨터공학과">\n  <option value="정보통신공학과">\n</[[0]]>',
    blanks: [['datalist']],
    hint: 'data + list',
    explain: 'datalist = 타이핑 가능한 select.' },
  { cat: 'form', src: '웹_03 input 속성 (s.18)', title: '기본값 넣어 두기',
    goal: '국적 입력칸에 처음부터 실제 값 "대한민국" 이 들어가 있게 하세요. (회색 힌트가 아님)',
    html: '국적 <input type="text" [[0]]="대한민국">',
    blanks: [['value']],
    hint: 'placeholder 는 회색 힌트입니다.',
    explain: 'value = 실제 값, placeholder = 클릭하면 사라지는 힌트.' },
  // 04 CSS
  { cat: 'css', src: '웹_04 캐스캐이딩 (s.18~20)', title: '무조건 파란 제목',
    goal: '아래 CSS 규칙들과 상관없이 이 h1 만 파란색이 되게 하세요. (우선순위가 가장 높은 방법)',
    html: '<h1 class="heading" id="title_text" [[0]]="color: blue">제목</h1>',
    css: 'h1 { color: gray; }\n#title_text { color: green; }\n.heading { color: red; }',
    blanks: [['style']],
    hint: '인라인 > id > 클래스 > 태그',
    explain: '인라인 스타일(style 속성)이 가장 우선합니다. 규칙상 그다음은 id(green).' },
  { cat: 'css', src: '웹_04 텍스트 꾸미기 (s.58)', title: '숫자로 굵게',
    goal: '제목을 bold 와 같은 굵기로 만드세요. 숫자 값으로 쓰세요.',
    html: '<p class="title">굵은 제목</p>',
    css: '.title {\n  font-size: 20px;\n  font-weight: [[0]];\n}',
    blanks: [['700']],
    hint: 'normal = 400',
    explain: 'normal = 400, bold = 700.' },
  { cat: 'css', src: '웹_04 텍스트 꾸미기 (s.59)', title: '반투명 배경',
    goal: '빨간 배경을 절반쯤 투명하게(알파 0.5) 만드세요.',
    html: '<div class="box">반투명 배경</div>',
    css: '.box {\n  padding: 20px;\n  background-color: rgba(255, 0, 0, [[0]]);\n}',
    blanks: [['0.5', '.5', '0.50']],
    hint: '알파 1 = 불투명, 0 = 완전 투명',
    explain: 'rgba 의 마지막 값(알파): 1 불투명, 0 완전 투명.' },
  { cat: 'css', src: '웹_04 단위 (s.56~57)', title: '부모와 상관없이 32px',
    goal: '부모 div 글자 크기(10px)와 상관없이 p 의 글자가 html(16px)의 2배인 32px 이 되게 하세요.',
    html: '<div class="wrap"><p>2배 글자</p></div>',
    css: 'html { font-size: 16px; }\n.wrap { font-size: 10px; }\np {\n  font-size: 2[[0]];\n}',
    blanks: [['rem']],
    hint: 'em = 부모 기준, 루트 기준은?',
    explain: 'rem = 루트(html) 기준 → 32px. em 이면 부모 기준 2 × 10 = 20px.' },
  { cat: 'css', src: '웹_04 텍스트 꾸미기', title: '글자 가운데 정렬',
    goal: '박스 안 글자를 가로 가운데로 정렬하세요.',
    html: '<p class="box">가운데 글자</p>',
    css: '.box {\n  border: 2px solid #94a3b8;\n  padding: 8px;\n  text-align: [[0]];\n}',
    blanks: [['center']],
    hint: 'left / center / right / justify',
    explain: 'text-align = 수평 정렬.' },
  { cat: 'css', src: '웹_04 속성 선택자 (s.33~34)', title: '새 탭 링크만 강조',
    goal: 'target="_blank" 인 링크만 노란 배경이 되게 선택자를 쓰세요.',
    html: '<p><a href="#">일반 링크</a></p>\n<p><a href="#" target="_blank">새 탭 링크</a></p>',
    css: '[[0]] {\n  background: yellow;\n}',
    blanks: [['a[target="_blank"]', 'a[target=_blank]', '[target="_blank"]', '[target=_blank]']],
    hint: '태그[속성="값"]',
    explain: '[속성="값"] = 속성 값이 일치하는 요소만 선택.' },
  { cat: 'css', src: '웹_04 가상 요소 (s.44)', title: '가격 뒤에 "원" 붙이기',
    goal: 'CSS 만으로 가격 숫자 뒤에 "원" 을 붙이세요.',
    html: '<p class="price">12,000</p>',
    css: '.price[[0]] {\n  content: "원";\n  color: #64748b;\n}',
    blanks: [['::after', ':after']],
    hint: '요소 앞은 ::before, 뒤는?',
    explain: '::after = 요소 뒤에 content 추가. 콜론 1개는 레거시 표기입니다.' },
  { cat: 'css', src: '웹_04 가상 클래스 (s.35~43)', title: '첫 항목만 빨갛게',
    goal: '목록의 첫 번째 항목만 빨간 글자가 되게 하세요.',
    html: '<ul>\n  <li>1등</li>\n  <li>2등</li>\n  <li>3등</li>\n</ul>',
    css: 'li:[[0]] {\n  color: red;\n}',
    blanks: [['first-child', 'nth-child(1)', 'first-of-type', 'nth-of-type(1)']],
    hint: '첫 번째 자식',
    explain: ':first-child = 첫 자식. :nth-child(1) 도 같습니다.' },
  { cat: 'css', src: '웹_04 상속 (s.23)', title: '부모 테두리 강제 상속',
    goal: '원래 상속되지 않는 border 를 자식 p 가 부모와 똑같이 갖게 하세요.',
    html: '<div class="parent">부모<p class="child">자식</p></div>',
    css: '.parent {\n  border: 3px dashed #4f46e5;\n  padding: 8px;\n}\n.child {\n  border: [[0]];\n}',
    blanks: [['inherit']],
    hint: '부모의 계산된 값을 그대로',
    explain: 'inherit = 부모의 계산된 값으로 강제 상속. border·margin·배경은 기본적으로 상속되지 않습니다.' },
  // 05 레이아웃
  { cat: 'layout', src: '웹_05 값 개수 규칙 (s.19)', title: '위아래 · 좌우 여백',
    goal: 'padding 을 위아래 10px, 좌우 30px 로 한 번에 지정하세요. (값 2개)',
    html: '<span class="tag">태그</span>',
    css: '.tag {\n  display: inline-block;\n  background: #c7d2fe;\n  padding: [[0]];\n}',
    blanks: [['10px 30px']],
    hint: '값 2개 = 위아래 / 좌우',
    explain: '값 1개 = 전체, 2개 = 위아래/좌우, 3개 = 위/좌우/아래, 4개 = 시계방향.' },
  { cat: 'layout', src: '웹_05 display (s.34)', title: '자리까지 완전히 없애기',
    goal: 'B 를 안 보이게 하고, B 자리도 없애서 C 가 당겨 오게 하세요.',
    html: '<span class="b1">A</span><span class="b2">B</span><span class="b3">C</span>',
    css: 'span { display: inline-block; ' + WQ_BOX + ' }\n.b2 {\n  display: [[0]];\n}',
    blanks: [['none']],
    hint: 'visibility: hidden 은 자리를 남깁니다.',
    explain: 'display: none = 공간도 차지하지 않음.' },
  { cat: 'layout', src: '웹_05 inline-block (s.31, 45)', title: '높이 다른 박스 위쪽 맞추기',
    goal: '높이가 다른 inline-block 박스들의 위쪽 선을 맞추세요.',
    html: '<div class="a">짧은 박스</div><div class="b">긴 박스<br>둘째 줄<br>셋째 줄</div>',
    css: 'div { display: inline-block; width: 110px; ' + WQ_BOX + ' vertical-align: [[0]]; }',
    blanks: [['top']],
    hint: '기본값은 baseline',
    explain: 'inline-block 의 vertical-align 기본값 baseline 때문에 생기는 위쪽 공백을 top 으로 없앱니다.' },
  { cat: 'layout', src: '웹_05 position (s.48~49)', title: '원래 자리는 남기고 이동',
    goal: 'B 를 원래 위치에서 아래로 20px, 오른쪽으로 40px 옮기되 B 가 있던 공간은 그대로 남게 하세요.',
    html: '<div class="box">A</div><div class="box b">B</div><div class="box">C</div>',
    css: '.box { width: 120px; ' + WQ_BOX + ' }\n.b {\n  background: #fca5a5;\n  position: [[0]];\n  top: 20px;\n  left: 40px;\n}',
    blanks: [['relative']],
    hint: 'absolute 는 흐름에서 빠집니다.',
    explain: 'relative = 원래 자리 기준 이동 + 공간 유지.' },
  { cat: 'layout', src: '웹_05 position (s.50, 54)', title: '카드 모서리 배지',
    goal: '"NEW" 배지가 화면이 아니라 카드의 오른쪽 위 모서리에 붙게 하세요. (배지는 이미 absolute)',
    html: '<div class="card">카드 내용<span class="badge">NEW</span></div>',
    css: '.card {\n  width: 200px;\n  height: 90px;\n  margin: 20px;\n  border: 2px solid #475569;\n  position: [[0]];\n}\n.badge { position: absolute; top: 0; right: 0; background: crimson; color: white; padding: 2px 6px; }',
    blanks: [['relative']],
    hint: '부모 ○○○○○○○ + 자식 absolute',
    explain: 'absolute 는 static 이 아닌 가장 가까운 조상을 기준으로 합니다. 부모 relative + 자식 absolute 가 관용구입니다.' },
  { cat: 'layout', src: '웹_05 z-index (s.56)', title: '겹친 박스 순서 바꾸기',
    goal: '나중에 나와 위에 덮인 노란 박스 아래 깔린 빨간 박스를 위로 올리세요. (양의 정수)',
    html: '<div class="r">빨강</div><div class="y">노랑</div>',
    css: '.r, .y { position: absolute; width: 110px; height: 70px; border: 2px solid #475569; }\n.r { top: 10px; left: 10px; background: #fca5a5; z-index: [[0]]; }\n.y { top: 40px; left: 60px; background: #fde68a; }',
    blanks: [{ ans: ['1'], check: v => /^[1-9]\d*$/.test(v) }],
    hint: '클수록 위',
    explain: 'z-index 는 position 이 있는 요소에서 클수록 위에 놓입니다(형제끼리 비교).' },
  { cat: 'layout', src: '웹_05 float (s.35~37)', title: '오른쪽에 띄운 사진',
    goal: '사진 박스를 오른쪽에 띄우고 글이 왼쪽으로 감싸 흐르게 하세요.',
    html: '<div class="pic">사진</div>\n<p>float 을 지정한 요소는 문서 흐름에서 벗어나 한쪽에 뜨고, 다른 글이 그 옆을 감싸며 흐릅니다. 이미지와 텍스트를 어우러지게 배치할 때 씁니다.</p>',
    css: '.pic {\n  width: 90px;\n  height: 70px;\n  background: #fde68a;\n  border: 2px solid #475569;\n  float: [[0]];\n}',
    blanks: [['right']],
    hint: 'left 또는 ?',
    explain: 'float: left | right, 해제는 clear.' },
  { cat: 'layout', src: '웹_05 border (s.9~11)', title: '점선 테두리',
    goal: '테두리를 짧은 선 점선(- - -)으로 바꾸세요.',
    html: '<div class="box">점선 테두리</div>',
    css: '.box {\n  width: 160px;\n  padding: 12px;\n  border: 3px [[0]] #475569;\n}',
    blanks: [['dashed']],
    hint: 'dotted 는 점(·)입니다.',
    explain: 'solid 실선, dashed 짧은 선, dotted 점, double 이중선. 기본값 none.' },
  { cat: 'layout', src: '웹_05 margin (s.21)', title: '커져도 300px 까지만',
    goal: '박스가 부모가 좁으면 줄어들고, 넓어도 300px 까지만 커지게 하세요.',
    html: '<div class="box">최대 300px</div>',
    css: '.box {\n  width: 100%;\n  [[0]]: 300px;\n  background: #bbf7d0;\n}',
    blanks: [['max-width']],
    hint: '최대 보장 너비',
    explain: 'max-width = 최대 너비, min-width = 최소 너비.' },
  // 06 Flexbox
  { cat: 'flex', src: '웹_06 align-items (s.18)', title: '세로 가운데 정렬',
    goal: '높이 150px 컨테이너에서 아이템들을 세로(교차축) 가운데에 놓으세요.',
    html: '<div class="row"><div class="i">1</div><div class="i">2</div><div class="i">3</div></div>',
    css: '.row {\n  display: flex;\n  height: 150px;\n  border: 2px dashed #94a3b8;\n  align-items: [[0]];\n}\n.i { ' + WQ_BOX + ' }',
    blanks: [['center']],
    hint: '교차축 정렬 속성의 가운데 값',
    explain: 'align-items = 교차축 정렬, 기본값 stretch.' },
  { cat: 'flex', src: '웹_06 justify-content (s.17)', title: '오른쪽 끝으로 모으기',
    goal: '아이템들을 메인축 끝(오른쪽)으로 모으세요. 순서는 1 2 3 그대로.',
    html: '<div class="row"><div class="i">1</div><div class="i">2</div><div class="i">3</div></div>',
    css: '.row {\n  display: flex;\n  border: 2px dashed #94a3b8;\n  justify-content: [[0]];\n}\n.i { ' + WQ_BOX + ' }',
    blanks: [['flex-end', 'end']],
    hint: 'flex-start 의 반대',
    explain: 'flex-end = 메인축 끝. row-reverse 는 순서까지 뒤집힙니다.' },
  { cat: 'flex', src: '웹_06 flex-grow (s.25)', title: '본문이 남는 공간 차지',
    goal: '가운데 본문(main)이 남는 가로 공간을 모두 차지하게 하세요. (양의 정수)',
    html: '<div class="row"><div class="i">메뉴</div><div class="i main">본문</div><div class="i">광고</div></div>',
    css: '.row { display: flex; border: 2px dashed #94a3b8; }\n.i { ' + WQ_BOX + ' }\n.main {\n  flex-grow: [[0]];\n}',
    blanks: [{ ans: ['1'], check: v => /^[1-9]\d*$/.test(v) }],
    hint: '기본값 0 이면 늘어나지 않습니다.',
    explain: 'flex-grow 가 0 보다 크면 남는 여백을 비율대로 나눠 갖습니다.' },
  { cat: 'flex', src: '웹_06 flex-shrink (s.27)', title: '사이드바는 줄어들지 않게',
    goal: '컨테이너가 좁아도 사이드바(.side)는 200px 그대로 유지되게 하세요.',
    html: '<div class="row"><div class="i side">사이드바 200px</div><div class="i">본문</div></div>',
    css: '.row { display: flex; width: 320px; border: 2px dashed #94a3b8; }\n.i { flex-basis: 200px; ' + WQ_BOX + ' }\n.side {\n  background: #fde68a;\n  flex-shrink: [[0]];\n}',
    blanks: [['0']],
    hint: '기본값 1 이면 줄어듭니다.',
    explain: 'flex-shrink: 0 → flex-basis 보다 작아지지 않음(고정폭 컬럼).' },
  { cat: 'flex', src: '웹_06 flex-direction (s.12)', title: '오른쪽부터 거꾸로',
    goal: '아이템이 오른쪽부터 3 2 1 순서로 놓이게 메인축 방향을 뒤집으세요.',
    html: '<div class="row"><div class="i">1</div><div class="i">2</div><div class="i">3</div></div>',
    css: '.row {\n  display: flex;\n  border: 2px dashed #94a3b8;\n  flex-direction: [[0]];\n}\n.i { ' + WQ_BOX + ' }',
    blanks: [['row-reverse']],
    hint: 'row 의 반대 방향',
    explain: 'row(기본) / column / row-reverse / column-reverse.' },
  { cat: 'flex', src: '웹_06 justify-content (s.17)', title: '모든 간격을 똑같이',
    goal: '양끝 여백과 아이템 사이 간격이 모두 같아지게 하세요.',
    html: '<div class="row"><div class="i">1</div><div class="i">2</div><div class="i">3</div></div>',
    css: '.row {\n  display: flex;\n  border: 2px dashed #94a3b8;\n  justify-content: [[0]];\n}\n.i { ' + WQ_BOX + ' }',
    blanks: [['space-evenly']],
    hint: 'between 은 양끝에 붙고, around 는 양끝이 절반',
    explain: 'space-evenly = 모든 간격 같음, space-around = 아이템 둘레 같음, space-between = 양끝 붙임.' },
  { cat: 'flex', src: '웹_06 align-content (s.20)', title: '여러 줄을 위쪽에 붙이기',
    goal: 'wrap 으로 2줄이 된 아이템 줄들이 컨테이너 높이에 퍼지지 않고 위쪽에 붙게 하세요.',
    html: '<div class="row"><div class="i">1</div><div class="i">2</div><div class="i">3</div><div class="i">4</div><div class="i">5</div></div>',
    css: '.row {\n  display: flex;\n  flex-wrap: wrap;\n  width: 260px;\n  height: 170px;\n  border: 2px dashed #94a3b8;\n  align-content: [[0]];\n}\n.i { flex-basis: 70px; ' + WQ_BOX + ' }',
    blanks: [['flex-start', 'start']],
    hint: '여러 줄일 때의 정렬 속성, 시작 쪽',
    explain: 'align-content = wrap 으로 여러 줄일 때 줄 배치. 한 줄이면 효과 없음.' },
  { cat: 'flex', src: '웹_06 미디어 쿼리 (s.54, 59)', title: 'Desktop First 미디어 쿼리',
    goal: '기본(PC)은 가로 배치, 화면 너비가 599px 이하일 때만 세로 1열이 되게 하세요. 두 너비의 미리보기를 비교해 보세요.',
    widths: [360, 700],
    html: '<div class="row"><div class="i">A</div><div class="i">B</div><div class="i">C</div></div>',
    css: '.row { display: flex; }\n.i { flex: 1; ' + WQ_BOX + ' }\n@media ([[0]]: 599px) {\n  .row { flex-direction: column; }\n}',
    blanks: [['max-width']],
    hint: 'Desktop First = 큰 화면이 기본 → "최대 너비" 조건',
    explain: 'Desktop First 는 max-width, Mobile First 는 min-width 중심입니다.' },
  // 07 애니메이션
  { cat: 'anim', src: '웹_07 transform (s.7)', title: '45도 회전',
    goal: '박스를 시계 방향으로 45도 돌리세요.',
    html: '<div class="box">회전</div>',
    css: '.box {\n  width: 90px;\n  height: 50px;\n  margin: 40px;\n  background: salmon;\n  transform: rotate([[0]]);\n}',
    blanks: [['45deg']],
    hint: '각도 단위 deg',
    explain: 'rotate(양수deg) = 시계 방향, 음수 = 반대 방향.' },
  { cat: 'anim', src: '웹_07 transform · transition', title: '마우스 올리면 1.2배', hover: true,
    goal: '마우스를 올리면 박스가 가로·세로 1.2배로 커지게 하세요. (옆 박스는 밀리지 않게)',
    html: '<div class="box">A</div><div class="box s">B</div><div class="box">C</div>',
    css: '.box { display: inline-block; width: 60px; height: 40px; margin: 30px 8px; background: #c7d2fe; border: 2px solid #475569; transition: transform 0.5s; }\n.s:hover {\n  transform: [[0]];\n}',
    blanks: [['scale(1.2)', 'scale(1.2, 1.2)']],
    hint: '크기 배율 메서드',
    explain: 'scale 은 보이는 모습만 바꿔 주변 배치가 그대로입니다.' },
  { cat: 'anim', src: '웹_07 transform (s.6)', title: '위로 20px 띄우기',
    goal: '가운데 박스만 원래 자리에서 위로 20px 올라가 보이게 하세요.',
    html: '<div class="box">A</div><div class="box m">B</div><div class="box">C</div>',
    css: '.box { display: inline-block; width: 60px; height: 40px; margin: 30px 6px; background: #c7d2fe; border: 2px solid #475569; }\n.m {\n  background: salmon;\n  transform: translateY([[0]]);\n}',
    blanks: [['-20px']],
    hint: 'Y 축은 아래가 +',
    explain: 'translateY(음수) = 위로 이동. 공간은 그대로 두고 보이는 위치만 바뀝니다.' },
  { cat: 'anim', src: '웹_07 transition-property (s.13)', title: '너비만 천천히', hover: true,
    goal: '마우스를 올리면 너비만 2초 동안 천천히 늘고, 배경색은 즉시 바뀌게 하세요.',
    html: '<div class="box">마우스를 올려 보세요</div>',
    css: '.box {\n  width: 150px;\n  padding: 10px;\n  background: salmon;\n  transition-property: [[0]];\n  transition-duration: 2s;\n}\n.box:hover { width: 300px; background: gold; }',
    blanks: [['width']],
    hint: '반응할 속성 이름',
    explain: 'transition-property 에 지정한 속성만 애니메이션됩니다.' },
  { cat: 'anim', src: '웹_07 timing-function (s.12)', title: '일정한 속도로', hover: true,
    goal: '마우스를 올리면 너비가 처음부터 끝까지 일정한 속도로 늘어나게 하세요.',
    html: '<div class="box">마우스를 올려 보세요</div>',
    css: '.box {\n  width: 150px;\n  padding: 10px;\n  background: salmon;\n  transition: width 2s [[0]];\n}\n.box:hover { width: 300px; }',
    blanks: [['linear']],
    hint: '기본값 ease 는 천천히-빠르게-천천히',
    explain: 'linear = 일정, ease(기본) / ease-in(천천히 시작) / ease-out(천천히 끝).' },
  { cat: 'anim', src: '웹_07 transition-delay (s.12)', title: '1초 기다렸다가', hover: true,
    goal: '마우스를 올리고 1초 기다린 뒤에 너비가 늘어나기 시작하게 하세요.',
    html: '<div class="box">마우스를 올려 보세요</div>',
    css: '.box {\n  width: 150px;\n  padding: 10px;\n  background: salmon;\n  transition-duration: 1s;\n  transition-delay: [[0]];\n}\n.box:hover { width: 300px; }',
    blanks: [['1s', '1000ms']],
    hint: '단위 s',
    explain: 'transition-delay = 시작 전 지연 시간, duration = 지속 시간.' },
  { cat: 'anim', src: '웹_07 @keyframes (s.15)', title: '처음과 끝 시점',
    goal: '@keyframes 에서 0% 와 100% 를 키워드로 쓰세요. 박스가 왼쪽에서 오른쪽으로 계속 움직입니다.',
    html: '<div class="box"></div>',
    css: '.box { position: relative; width: 40px; height: 40px; background: salmon; animation: move 2s infinite; }\n@keyframes move {\n  [[0]] { left: 0; }\n  [[1]] { left: 200px; }\n}',
    blanks: [['from', '0%'], ['to', '100%']],
    hint: '~부터 ~까지 (영어)',
    explain: 'from = 0%, to = 100%. 사이 값은 브라우저가 자동 계산합니다.' },
  { cat: 'anim', src: '웹_07 animation (s.15~16)', title: '끝없이 반복',
    goal: '박스가 커졌다 작아지는 애니메이션을 한 번이 아니라 끝없이 반복하게 하세요.',
    html: '<div class="box"></div>',
    css: '.box { width: 50px; height: 50px; margin: 30px; background: salmon; animation: pulse 1s [[0]]; }\n@keyframes pulse {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.5); }\n  100% { transform: scale(1); }\n}',
    blanks: [['infinite']],
    hint: '무한',
    explain: 'animation 반복 횟수 infinite = 무한 반복.' },
];

// ── 채점 · 미리보기 (순수 함수) ──
function wqNorm(v) {
  return String(v).trim().toLowerCase().replace(/\s+/g, '').replace(/;+$/, '').replace(/'/g, '"').replace(/^"(.*)"$/, '$1');
}
function wqBlank(b) { return Array.isArray(b) ? { ans: b } : b; }
function wqIsRight(b, v) {
  b = wqBlank(b);
  const n = wqNorm(v);
  return n !== '' && (b.ans.some(a => wqNorm(a) === n) || (b.check ? b.check(n) : false));
}
function wqFill(src, vals) { return (src || '').replace(/\[\[(\d+)\]\]/g, (_, i) => (vals[+i] === undefined ? '' : vals[+i])); }
function wqDoc(task, vals) {
  const css = wqFill(task.css, vals).split('img/main.jpg').join(WQ_IMG);
  const html = wqFill(task.html, vals).split('img/main.jpg').join(WQ_IMG);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Malgun Gothic',sans-serif;font-size:14px;margin:10px;color:#1e293b}</style><style>${css}</style></head><body>${html}</body></html>`;
}
function wqAnswerVals(task) {
  if (task.choices) return [task.choices.find(c => c.ok).code];
  return task.blanks.map(b => wqBlank(b).ans[0]);
}

// ── 화면 ──
let WQ = null;

function wqMount(root) {
  WQ = { cats: new Set(WQ_CATS.map(c => c.id)), shuffle: false, list: [], idx: 0, vals: [], pick: -1, checked: false, revealed: false, hint: false, solved: new Set(), tried: new Set() };
  root.innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 출제 범위</h3>
      <div class="pr-seg" id="wq-cats"></div>
      <div class="pr-row" style="margin-top:10px;margin-bottom:0">
        <label class="pr-chk"><input type="checkbox" id="wq-shuffle" onchange="WQ.shuffle = this.checked; wqBuild()"> 무작위 순서</label>
        <span class="pr-sub" id="wq-stat"></span>
      </div>
      <div class="pr-sub" style="margin-top:6px">요구사항을 읽고 빈칸에 태그 · 속성 · 값을 채우세요. 입력하는 대로 <b>내 결과</b>가 바로 바뀝니다. 대소문자 · 공백 · 끝의 세미콜론은 채점에서 무시합니다.<br>
        모든 문제는 수업자료(02~07장, JS 제외)에 나온 태그 · 속성 · 값만 사용합니다. 문제마다 출처 슬라이드가 표시됩니다.</div>
    </div>
    <div id="wq-main"></div>`;
  wqRenderCats();
  wqBuild();
}

function wqRenderCats() {
  document.getElementById('wq-cats').innerHTML = WQ_CATS.map(c => {
    const n = WQ_TASKS.filter(t => t.cat === c.id).length;
    return `<button class="${WQ.cats.has(c.id) ? 'active' : ''}" onclick="wqToggleCat('${c.id}')">${c.name} <small style="font-weight:500">${n}</small></button>`;
  }).join('');
}
function wqToggleCat(id) {
  if (WQ.cats.has(id)) { if (WQ.cats.size > 1) WQ.cats.delete(id); } else WQ.cats.add(id);
  wqRenderCats(); wqBuild();
}

function wqBuild() {
  const list = WQ_TASKS.map((t, i) => i).filter(i => WQ.cats.has(WQ_TASKS[i].cat));
  if (WQ.shuffle) for (let i = list.length - 1; i > 0; i--) { const j = prRand(0, i); [list[i], list[j]] = [list[j], list[i]]; }
  WQ.list = list; WQ.idx = 0;
  wqLoad();
}

function wqLoad() {
  const t = wqTask();
  WQ.vals = t.choices ? [''] : t.blanks.map(() => '');
  WQ.pick = -1; WQ.checked = false; WQ.revealed = false; WQ.hint = false;
  wqRender();
}
function wqTask() { return WQ_TASKS[WQ.list[WQ.idx]]; }
function wqGo(d) { WQ.idx = (WQ.idx + d + WQ.list.length) % WQ.list.length; wqLoad(); window.scrollTo(0, 0); }

function wqEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

// 코드 표시: [[n]] 첫 등장 = 입력칸, 이후 등장 = 따라 바뀌는 글자
function wqCodeHtml(src, task, seen) {
  return src.split(/(\[\[\d+\]\])/).map(part => {
    const m = part.match(/^\[\[(\d+)\]\]$/);
    if (!m) return wqEsc(part);
    const i = +m[1];
    if (task.choices) return `<span class="wq-slot">${WQ.pick >= 0 ? wqEsc(task.choices[WQ.pick].code) : '❓ 아래에서 고르세요'}</span>`;
    const width = Math.max(4, ...wqBlank(task.blanks[i]).ans.map(a => a.length)) + 1;
    if (seen.has(i)) return `<span class="wq-mirror" data-i="${i}">${wqEsc(WQ.vals[i]) || '＿'}</span>`;
    seen.add(i);
    return `<input class="wq-blank" id="wq-b${i}" data-i="${i}" size="${width}" value="${wqEsc(WQ.vals[i])}" oninput="wqInput(${i}, this.value)" autocomplete="off" spellcheck="false">`;
  }).join('');
}

function wqFrame(id, w) {
  return `<iframe class="wq-frame" id="${id}" sandbox="" style="${w ? `width:${w}px;` : ''}"></iframe>`;
}

function wqRender() {
  const t = wqTask(), cat = WQ_CATS.find(c => c.id === t.cat), seen = new Set();
  const ws = t.widths || [null];
  const frames = pre => ws.map((w, k) => `<div>${w ? `<div class="pr-sub">너비 ${w}px</div>` : ''}${wqFrame(pre + k, w)}</div>`).join('');
  const done = WQ.solved.size;
  document.getElementById('wq-stat').textContent = `맞힌 문제 ${done} · 시도한 문제 ${WQ.tried.size} / 전체 ${WQ_TASKS.length}`;
  document.getElementById('wq-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">${WQ.solved.has(WQ.list[WQ.idx]) ? '✅' : '📌'} ${WQ.idx + 1} / ${WQ.list.length} · ${wqEsc(t.title)}
        <span class="pr-chip">${cat.name}</span><span class="pr-chip" style="background:#f1f5f9;color:#475569">출처 ${wqEsc(t.src)}</span></h3>
      <div style="font-size:14px;line-height:1.7;margin-bottom:10px">${wqEsc(t.goal)}${t.hover ? '<br><small style="color:#4f46e5">🖱️ 미리보기에 마우스를 올려 확인하세요.</small>' : ''}</div>
      <div class="wq-previews">
        <div><b class="wq-lbl">🎯 목표 결과</b><div class="wq-frames">${frames('wq-target')}</div></div>
        <div><b class="wq-lbl">🧪 내 결과</b><div class="wq-frames">${frames('wq-mine')}</div></div>
      </div>
      ${t.html ? `<b class="wq-lbl">HTML</b><pre class="wq-code">${wqCodeHtml(t.html, t, seen)}</pre>` : ''}
      ${t.css ? `<b class="wq-lbl">CSS</b><pre class="wq-code">${wqCodeHtml(t.css, t, seen)}</pre>` : ''}
      ${t.choices ? `<b class="wq-lbl">❓ 자리에 들어갈 코드</b><div class="wq-choices">${t.choices.map((c, k) =>
        `<button class="wq-choice${WQ.pick === k ? ' sel' : ''}${WQ.checked || WQ.revealed ? (c.ok ? ' ok' : WQ.pick === k ? ' ng' : '') : ''}" onclick="wqPick(${k})"><pre>${wqEsc(c.code)}</pre></button>`).join('')}</div>` : ''}
      ${WQ.hint ? `<div class="st-msg info">💡 ${wqEsc(t.hint)}</div>` : ''}
      <div id="wq-feedback"></div>
      <div class="pr-actions">
        <button class="pr-btn indigo" onclick="wqCheck()">✅ 채점하기</button>
        <button class="pr-btn ghost" onclick="WQ.hint = true; wqRender()">💡 힌트</button>
        <button class="pr-btn ghost" onclick="wqReveal()">👀 정답 보기</button>
        <button class="pr-btn ghost" onclick="wqGo(-1)">← 이전</button>
        <button class="pr-btn" onclick="wqGo(1)">다음 문제 →</button>
      </div>
      <div id="wq-answer"></div>
    </div>`;
  const tv = wqAnswerVals(t);
  ws.forEach((_, k) => { document.getElementById('wq-target' + k).srcdoc = wqDoc(t, tv); });
  wqUpdateMine();
  if (WQ.checked) wqCheck(true);
  if (WQ.revealed) wqShowAnswer();
}

function wqMineVals() {
  const t = wqTask();
  return t.choices ? [WQ.pick >= 0 ? t.choices[WQ.pick].code : ''] : WQ.vals;
}
function wqUpdateMine() {
  const t = wqTask(), doc = wqDoc(t, wqMineVals());
  (t.widths || [null]).forEach((_, k) => { document.getElementById('wq-mine' + k).srcdoc = doc; });
}

function wqInput(i, v) {
  WQ.vals[i] = v;
  document.querySelectorAll(`.wq-mirror[data-i="${i}"]`).forEach(el => { el.textContent = v || '＿'; });
  const el = document.getElementById('wq-b' + i);
  if (el) el.classList.remove('ok', 'ng');
  wqUpdateMine();
}

function wqPick(k) { if (WQ.revealed) return; WQ.pick = k; WQ.checked = false; wqRender(); }

function wqCheck(silent) {
  const t = wqTask(), key = WQ.list[WQ.idx];
  let ok, detail;
  if (t.choices) {
    if (WQ.pick < 0) { document.getElementById('wq-feedback').innerHTML = '<div class="pr-result bad">먼저 코드를 하나 고르세요.</div>'; return; }
    ok = !!t.choices[WQ.pick].ok; detail = '';
  } else {
    const res = t.blanks.map((b, i) => wqIsRight(b, WQ.vals[i]));
    res.forEach((r, i) => { const el = document.getElementById('wq-b' + i); if (el) { el.classList.remove('ok', 'ng'); el.classList.add(r ? 'ok' : 'ng'); } });
    ok = res.every(Boolean); detail = ` 빈칸 ${res.filter(Boolean).length} / ${res.length}`;
  }
  if (!silent) { WQ.tried.add(key); if (ok && !WQ.revealed) WQ.solved.add(key); }
  WQ.checked = true;
  if (!silent && t.choices) return wqRender();
  document.getElementById('wq-feedback').innerHTML = `<div class="pr-result ${ok ? 'good' : 'bad'}"><b>${ok ? '🎉 정답입니다!' : '아직 아니에요'}</b>${detail}
    ${ok ? `<br>${wqEsc(t.explain)}` : '<br>목표 결과와 내 결과를 비교해 보세요. 막히면 💡 힌트를 보세요.'}</div>`;
  document.getElementById('wq-stat').textContent = `맞힌 문제 ${WQ.solved.size} · 시도한 문제 ${WQ.tried.size} / 전체 ${WQ_TASKS.length}`;
}

function wqReveal() {
  const t = wqTask();
  WQ.revealed = true; WQ.tried.add(WQ.list[WQ.idx]);
  if (t.choices) WQ.pick = t.choices.findIndex(c => c.ok);
  else WQ.vals = wqAnswerVals(t).slice();
  WQ.checked = false;
  wqRender();
}

function wqShowAnswer() {
  const t = wqTask();
  const alts = t.choices ? '' : t.blanks.map((b, i) => {
    const B = wqBlank(b);
    return `빈칸 ${i + 1}: <code>${wqEsc(B.ans[0])}</code>${B.ans.length > 1 ? ` <small>(${B.ans.slice(1).map(wqEsc).join(', ')} 도 정답)</small>` : ''}`;
  }).join('<br>');
  document.getElementById('wq-answer').innerHTML = `<div class="pr-answer"><b>정답</b><br>${alts || '초록색 테두리 코드'}<br><br><b>해설</b><br>${wqEsc(t.explain)}
    <div class="pr-sub" style="margin-top:6px">출처: ${wqEsc(t.src)}</div></div>`;
}

registerPractice({
  id: 'webquiz', subject: '웹프로그래밍', icon: '🛠️', title: 'HTML · CSS 기능 구현 퀴즈',
  desc: '"이 기능을 만들려면?" 빈칸에 태그 · 속성 · 값을 채우면 결과 화면이 실시간으로 바뀝니다. 목표 화면과 비교하며 풀어 보세요 (수업자료 02~07장 범위)',
  mount: wqMount,
});
