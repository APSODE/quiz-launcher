// 2_태그_CSS_맞히기.js — quiz_launcher 플러그인: HTML 태그 맞히기 · CSS 맞히기 (1_기능구현퀴즈.js 의 wqEsc · WQ_BOX · WQ_IMG 사용 — 함께 둘 것)
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  7. 웹프로그래밍 태그 맞히기 · CSS 맞히기
//  결과 화면을 보고 어떤 HTML 태그(속성) / CSS 선언(선택자)인지 맞힌다. 객관식 · 주관식.
//  - 문제 하나 = TQ_HTML / TQ_CSS 배열의 객체 하나
//    { cat, src, ask, html, css?, ans: [대표 정답, 허용 표기...], wrong: [오답 보기 3개 이상], explain }
//  - html / css 안의 [[0]] 자리에 답이 들어간다(여러 번 써도 됨).
//    HTML 문제는 정답을 넣은 결과 하나, CSS 문제는 [[0]]을 비운 "기본"과 정답을 넣은 "적용 후"를 나란히 보여 준다.
//  - 객관식 보기 = 대표 정답 + wrong 중 3개(무작위). 답한 뒤에는 보기마다 결과 화면을 보여 준다.
//  - 출제 범위: 수업자료 02~07장(JS 제외). src 에 출처(볼트 노트)를 적는다.
// ════════════════════════════════════════════════════════
const TQ_HCSS = 'table { border-collapse: collapse; } td, th { border: 1px solid #64748b; padding: 4px 10px; }';
const TQ_BOXES = '.box { ' + WQ_BOX + ' }';

const TQ_HTML = [
  // ── 텍스트 (02) ──
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '노란 형광펜 효과가 칠해진 부분을 만든 태그는?',
    html: '<p>오늘은 <[[0]]>중간고사</[[0]]> 공부를 합니다.</p>', ans: ['mark'], wrong: ['strong', 'em', 'span', 'q'],
    explain: 'mark = 형광펜(노랑).' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '줄을 바꾸지 않고 한 줄로 인용하면서 앞뒤에 따옴표가 자동으로 붙은 부분의 태그는?',
    html: '<p>선생님이 <[[0]]>시험 범위는 7장까지</[[0]]> 라고 말했다.</p>', ans: ['q'], wrong: ['blockquote', 'mark', 'em', 'cite'],
    explain: 'q = 한 줄 인용 + 따옴표, blockquote = 블록 인용 + 들여쓰기.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '앞뒤 문단과 떨어져 자동으로 들여쓰기된 인용문 블록의 태그는?',
    html: '<p>앞 문단입니다.</p><[[0]]>자동으로 들여쓰기된 인용문 블록입니다.</[[0]]><p>뒤 문단입니다.</p>', ans: ['blockquote'], wrong: ['q', 'p', 'div', 'pre'],
    explain: 'blockquote = 인용문, 자동 들여쓰기(블록).' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '두 문단 사이에 가로줄을 그어 분위기를 전환한 태그는? (닫는 태그 없음)',
    html: '<p>위 내용</p><[[0]]><p>분위기를 바꾼 아래 내용</p>', ans: ['hr'], wrong: ['br', 'p', 'line', 'div'],
    explain: 'hr = 수평 줄(horizontal rule), br = 줄 바꿈.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '한 문단 안에서 "첫 줄"과 "둘째 줄" 사이 줄을 바꾼 태그는? (닫는 태그 없음)',
    html: '<p>첫 줄<[[0]]>둘째 줄</p>', ans: ['br'], wrong: ['hr', 'p', 'nl', 'span'],
    explain: 'HTML은 Enter로 줄이 바뀌지 않아 br을 쓴다.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '"중요해서 강조한다"는 의미로 굵게 표시한 부분의 태그는? (단순히 굵게가 아님)',
    html: '<p>시험 범위는 <[[0]]>7장까지</[[0]]>입니다.</p>', ans: ['strong'], wrong: ['b', 'em', 'mark', 'h1'],
    explain: 'strong = 중요해서 강조, b = 단순히 굵게(보이는 모양은 같다).' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '글자를 기울여 강조한 부분의 태그는?',
    html: '<p>이 부분은 <[[0]]>기울여서</[[0]]> 강조합니다.</p>', ans: ['em', 'i'], wrong: ['strong', 'mark', 'q', 'b'],
    explain: 'em(강조) · i 모두 기울임으로 표시된다.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '문서에서 가장 큰 제목을 만든 태그는?',
    html: '<[[0]]>가장 큰 제목</[[0]]><p>본문 내용</p>', ans: ['h1'], wrong: ['h6', 'title', 'header', 'strong'],
    explain: 'hn은 n이 작을수록 크다. title은 브라우저 제목 표시줄용.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '앞뒤에 빈 줄이 생기는 "단락" 두 개를 만든 태그는?',
    html: '<[[0]]>첫 번째 단락입니다.</[[0]]><[[0]]>두 번째 단락입니다.</[[0]]>', ans: ['p'], wrong: ['br', 'span', 'hr', 'q'],
    explain: 'p = paragraph, 앞뒤 빈 줄.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '줄을 바꾸지 않고(인라인) "가치"라는 글자만 묶어 파란색 스타일을 준 태그는?',
    html: '<p>가격 이상의 <[[0]] style="color: blue">가치</[[0]]>가 있습니다.</p>', ans: ['span'], wrong: ['div', 'p', 'mark', 'section'],
    explain: 'span = 줄 안(인라인) 묶기, div = 줄 바꿔(블록) 묶기.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '줄을 바꿔 블록으로 묶은 영역(파란 테두리)의 태그는? (의미 없는 묶음)',
    html: '<span>앞 글자</span><[[0]] style="border: 2px solid #3b82f6; padding: 6px">블록으로 묶인 영역</[[0]]><span>뒤 글자</span>', ans: ['div'], wrong: ['span', 'q', 'mark', 'em'],
    explain: 'div = 블록 묶기. 앞뒤 span은 인라인이라 div 때문에 줄이 나뉜다.' },
  // ── 목록 · 표 (02) ──
  { cat: 'list', src: '웹_02 목록', ask: '번호가 자동으로 붙는 목록 전체를 감싼 태그는?',
    html: '<[[0]]><li>준비</li><li>실행</li><li>정리</li></[[0]]>', ans: ['ol'], wrong: ['ul', 'dl', 'li', 'table'],
    explain: 'ol = 순서 있는 목록, ul = 순서 없는 목록.' },
  { cat: 'list', src: '웹_02 목록', ask: '글머리 기호(●)가 붙는 목록 전체를 감싼 태그는?',
    html: '<[[0]]><li>메뉴1</li><li>메뉴2</li><li>메뉴3</li></[[0]]>', ans: ['ul'], wrong: ['ol', 'dl', 'li', 'nav'],
    explain: 'ul = unordered list. 메뉴에 많이 쓴다.' },
  { cat: 'list', src: '웹_02 목록', ask: '목록 안의 각 항목 하나하나를 만든 태그는?',
    html: '<ul><[[0]]>HTML</[[0]]><[[0]]>CSS</[[0]]><[[0]]>JavaScript</[[0]]></ul>', ans: ['li'], wrong: ['dd', 'dt', 'td', 'p'],
    explain: 'li = list item. </li>는 생략 가능.' },
  { cat: 'list', src: '웹_02 목록', ask: '용어와 설명으로 이루어진 "설명 목록" 전체를 감싼 태그는?',
    html: '<[[0]]><dt>HTML</dt><dd>문서의 구조를 정의하는 언어</dd><dt>CSS</dt><dd>스타일을 정의하는 언어</dd></[[0]]>', ans: ['dl'], wrong: ['ul', 'ol', 'table', 'dt'],
    explain: 'dl = 설명 목록, dt = 용어, dd = 설명.' },
  { cat: 'list', src: '웹_02 목록', ask: '설명 목록에서 들여쓰기된 "설명" 부분을 만든 태그는?',
    html: '<dl><dt>HTML</dt><[[0]]>HyperText Markup Language</[[0]]><[[0]]>문서의 구조를 정의한다</[[0]]></dl>', ans: ['dd'], wrong: ['dt', 'li', 'td', 'p'],
    explain: 'dd = description. dt 하나에 dd 여러 개 가능.' },
  { cat: 'list', src: '웹_02 목록', ask: '설명 목록에서 들여쓰기 없이 위에 있는 "용어" 부분을 만든 태그는?',
    html: '<dl><[[0]]>CSS</[[0]]><dd>Cascading Style Sheet</dd><[[0]]>JS</[[0]]><dd>JavaScript</dd></dl>', ans: ['dt'], wrong: ['dd', 'th', 'li', 'h3'],
    explain: 'dt = terms.' },
  { cat: 'table', src: '웹_02 표', ask: '표의 첫 행에 굵게 · 가운데로 표시된 제목 셀의 태그는?',
    html: '<table><tr><[[0]]>과목</[[0]]><[[0]]>학점</[[0]]></tr><tr><td>웹프로그래밍</td><td>3</td></tr></table>', css: TQ_HCSS, ans: ['th'], wrong: ['td', 'tr', 'caption', 'thead'],
    explain: 'th = table header(제목 셀), td = 일반 셀.' },
  { cat: 'table', src: '웹_02 표', ask: '표의 각 행(가로 한 줄)을 만든 태그는?',
    html: '<table><[[0]]><td>A</td><td>B</td></[[0]]><[[0]]><td>C</td><td>D</td></[[0]]></table>', css: TQ_HCSS, ans: ['tr'], wrong: ['td', 'th', 'row', 'tbody'],
    explain: 'tr = table row.' },
  { cat: 'table', src: '웹_02 표', ask: '제목 행 아래의 일반 데이터 셀(굵지 않음)을 만든 태그는?',
    html: '<table><tr><th>요일</th><th>과목</th></tr><tr><[[0]]>월</[[0]]><[[0]]>웹프로그래밍</[[0]]></tr></table>', css: TQ_HCSS, ans: ['td'], wrong: ['th', 'tr', 'tbody', 'li'],
    explain: 'td = table data.' },
  { cat: 'table', src: '웹_02 표', ask: '표 위쪽 가운데에 붙은 표 제목("2학기 시간표")의 태그는?',
    html: '<table><[[0]]>2학기 시간표</[[0]]><tr><td>월</td><td>웹프로그래밍</td></tr><tr><td>화</td><td>운영체제</td></tr></table>', css: TQ_HCSS, ans: ['caption'], wrong: ['th', 'figcaption', 'title', 'thead'],
    explain: 'caption = 표 제목, 위쪽 중앙.' },
  { cat: 'table', src: '웹_02 표', ask: '첫 행의 "1학기" 셀이 열 3칸을 차지하도록 한 속성은?',
    html: '<table><tr><th [[0]]="3">1학기</th></tr><tr><td>과목명</td><td>과목코드</td><td>학점</td></tr></table>', css: TQ_HCSS, ans: ['colspan', 'colspan=3', 'colspan="3"'], wrong: ['rowspan', 'span', 'cols', 'width'],
    explain: 'colspan = 열(가로) 합치기, rowspan = 행(세로) 합치기.' },
  { cat: 'table', src: '웹_02 표', ask: '"학년" 셀이 행 2칸을 세로로 차지하도록 한 속성은?',
    html: '<table><tr><th [[0]]="2">학년</th><th>1학기</th></tr><tr><th>과목명</th></tr></table>', css: TQ_HCSS, ans: ['rowspan', 'rowspan=2', 'rowspan="2"'], wrong: ['colspan', 'rows', 'span', 'height'],
    explain: 'rowspan = 행(세로) 합치기.' },
  // ── 이미지 · 링크 (02) ──
  { cat: 'media', src: '웹_02 이미지', ask: '그림을 넣은 태그는? (닫는 태그 없음)',
    html: '<[[0]] src="img/main.jpg" width="200" alt="풍경 사진">', ans: ['img'], wrong: ['figure', 'picture', 'a', 'src'],
    explain: 'img = 닫는 태그 없음, src·alt 속성.' },
  { cat: 'media', src: '웹_02 이미지', ask: '그림 파일을 찾을 수 없을 때 대신 보이는 글자("풍경 사진")를 지정한 속성은?',
    html: '<img src="없는그림.jpg" [[0]]="풍경 사진" width="200" height="80">', ans: ['alt', 'alt="풍경 사진"'], wrong: ['title', 'src', 'name', 'value'],
    explain: 'alt = 이미지 표시 불가 시 대체 텍스트.' },
  { cat: 'media', src: '웹_02 이미지 · 캡션', ask: '그림 아래에 붙은 캡션("우리 동네 풍경")을 만든 태그는? (figure 안)',
    html: '<figure><img src="img/main.jpg" width="200"><[[0]]>우리 동네 풍경</[[0]]></figure>', ans: ['figcaption'], wrong: ['caption', 'figure', 'label', 'legend'],
    explain: 'figure + figcaption. figcaption이 뒤면 아래, 앞이면 위에 표시된다. 표 제목은 caption.' },
  { cat: 'media', src: '웹_02 링크', ask: '파란 밑줄이 있고 누르면 다른 페이지로 이동하는 글자를 만든 태그는?',
    html: '<p><[[0]] href="https://example.com">한솥 메뉴 보러 가기</[[0]]></p>', ans: ['a'], wrong: ['link', 'href', 'nav', 'url'],
    explain: 'a href="주소". link는 head에서 CSS를 연결하는 태그.' },
  // ── form (03) ──
  { cat: 'form', src: '웹_03 input', ask: '여러 개를 동시에 고를 수 있는 네모 칸 — input의 type 값은?',
    html: '<label><input type="[[0]]" checked> HTML</label> <label><input type="[[0]]" checked> CSS</label> <label><input type="[[0]]"> JS</label>',
    ans: ['checkbox', 'type=checkbox', 'type="checkbox"'], wrong: ['radio', 'check', 'select', 'option'],
    explain: 'checkbox = 다중 선택, radio = 단일 선택.' },
  { cat: 'form', src: '웹_03 input', ask: '여러 개 중 하나만 고를 수 있는 동그라미 — input의 type 값은?',
    html: '성별: <label><input type="[[0]]" name="g" checked> 남</label> <label><input type="[[0]]" name="g"> 여</label>',
    ans: ['radio', 'type=radio', 'type="radio"'], wrong: ['checkbox', 'option', 'select', 'circle'],
    explain: 'radio는 name을 같게 해야 한 그룹이 된다.' },
  { cat: 'form', src: '웹_03 input', ask: '입력한 글자가 ●로 가려져 보이는 입력칸 — input의 type 값은?',
    html: '비밀번호 <input type="[[0]]" value="secret123">', ans: ['password', 'type=password', 'type="password"'], wrong: ['hidden', 'text', 'secret', 'search'],
    explain: 'password = *·• 로 표시. hidden은 화면에 아예 안 보인다.' },
  { cat: 'form', src: '웹_03 input', ask: '달력으로 날짜를 고르는 입력칸 — input의 type 값은?',
    html: '설립일 <input type="[[0]]" value="2026-10-19">', ans: ['date', 'type=date', 'type="date"'], wrong: ['time', 'calendar', 'text', 'tel'],
    explain: 'date = 날짜, time = 시간.' },
  { cat: 'form', src: '웹_03 input', ask: '시각(시:분)을 고르는 입력칸 — input의 type 값은?',
    html: '근무시간 <input type="[[0]]" value="09:00"> ~ <input type="[[0]]" value="18:00">', ans: ['time', 'type=time', 'type="time"'], wrong: ['date', 'clock', 'number', 'text'],
    explain: '실습: 근무시간 type="time" ~ type="time".' },
  { cat: 'form', src: '웹_03 input', ask: '누르면 입력한 내용을 서버로 전송하는 "제출하기" 버튼 — input의 type 값은?',
    html: '<form>이름 <input type="text"> <input type="[[0]]" value="제출하기"></form>', ans: ['submit', 'type=submit', 'type="submit"'], wrong: ['reset', 'send', 'image', 'hidden'],
    explain: 'submit = 전송, reset = 입력 전부 삭제. 버튼 글자는 value.' },
  { cat: 'form', src: '웹_03 input 속성', ask: '입력 전에 회색 힌트 글자(NNN-NN-NNNN)를 보여 주는 속성은?',
    html: '사업자 번호 <input type="text" [[0]]="NNN-NN-NNNN">', ans: ['placeholder', 'placeholder="NNN-NN-NNNN"'], wrong: ['value', 'title', 'alt', 'hint'],
    explain: 'placeholder = 클릭(입력)하면 사라지는 힌트. value는 실제 값.' },
  { cat: 'form', src: '웹_03 textarea', ask: '여러 줄 글을 입력하는 큰 입력칸을 만든 태그는? (input이 아님)',
    html: '<[[0]] rows="4" cols="30">여러 줄로\n입력할 수 있습니다.</[[0]]>', ans: ['textarea'], wrong: ['input', 'text', 'textbox', 'p'],
    explain: 'textarea: cols = 한 줄 최대 문자 수, rows = 표시 줄 수.' },
  { cat: 'form', src: '웹_03 select', ask: '펼쳐서 하나를 고르는 드롭다운 목록 전체를 만든 태그는?',
    html: '학과 <[[0]]><option>컴퓨터공학과</option><option selected>정보통신공학과</option><option>전자공학과</option></[[0]]>', ans: ['select'], wrong: ['option', 'datalist', 'list', 'ul'],
    explain: 'select + option, 최초 선택은 selected.' },
  { cat: 'form', src: '웹_03 select', ask: '목록 안의 항목을 "공과대학", "인문대학" 그룹으로 묶은 태그는?',
    html: '<select size="7"><[[0]] label="공과대학"><option>컴퓨터공학과</option><option>전자공학과</option></[[0]]><[[0]] label="인문대학"><option>국어국문학과</option><option>영어영문학과</option></[[0]]></select>', ans: ['optgroup'], wrong: ['fieldset', 'option', 'group', 'datalist'],
    explain: 'optgroup label="…" 으로 select 항목을 그룹화한다.' },
  { cat: 'form', src: '웹_03 fieldset', ask: '폼의 한 구역을 테두리로 묶은 태그는? (테두리 위 제목은 legend)',
    html: '<[[0]]><legend>기업현황</legend>회사명 <input type="text"></[[0]]>', ans: ['fieldset'], wrong: ['legend', 'form', 'section', 'div'],
    explain: 'fieldset = 구역 나누기, legend = 구역 제목.' },
  { cat: 'form', src: '웹_03 fieldset', ask: '구역 테두리 위에 걸쳐 표시된 제목("가입내용")을 만든 태그는?',
    html: '<fieldset><[[0]]>가입내용</[[0]]>이름 <input type="text"></fieldset>', ans: ['legend'], wrong: ['caption', 'label', 'title', 'figcaption'],
    explain: 'legend = fieldset 구역의 제목.' },
  { cat: 'form', src: '웹_03 기타 폼 요소', ask: '작업 진행률(70%)을 막대로 보여 주는 요소의 태그는?',
    html: '업로드 <[[0]] value="70" max="100"></[[0]]> 70%', ans: ['progress'], wrong: ['range', 'bar', 'datalist', 'input'],
    explain: '기타 폼 요소: datalist, progress, meter.' },

  // ── 추가 문제 (2026-10-20) ──
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '문서에서 가장 작은 제목을 만든 태그는?',
    html: '<h1>큰 제목</h1><[[0]]>가장 작은 제목</[[0]]><p>본문 글자</p>', ans: ['h6'], wrong: ['h1', 'h2', 'small', 'p'],
    explain: 'hn은 n이 클수록 작다. h6이 가장 작다.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: 'h1 대제목 아래에 붙은, 그다음 크기의 부제목 태그는?',
    html: '<h1>웹프로그래밍</h1><[[0]]>02장 HTML 기본태그</[[0]]><p>본문</p>', ans: ['h2'], wrong: ['h1', 'h6', 'p', 'strong'],
    explain: 'h1 다음 크기는 h2.' },
  { cat: 'text', src: '웹_02 특수문자', ask: '화면에 "<div>"가 태그로 해석되지 않고 글자 그대로 보이게, 앞의 "<"를 표시한 특수문자 코드는?',
    html: '<p>[[0]]div&gt; 태그는 블록 요소입니다.</p>', ans: ['&lt;', '&lt'], wrong: ['&gt;', '&amp;', '&quot;', '&nbsp;'],
    explain: '&lt; = <, &gt; = >, &amp; = &, &quot; = ", &nbsp; = 공백.' },
  { cat: 'text', src: '웹_02 특수문자', ask: '"R&D"의 "&"를 표시한 특수문자 코드는?',
    html: '<p>R[[0]]D 센터</p>', ans: ['&amp;', '&amp'], wrong: ['&lt;', '&quot;', '&nbsp;', '&gt;'],
    explain: '&amp; = &.' },
  { cat: 'text', src: '웹_02 특수문자', ask: '큰따옴표를 표시한 특수문자 코드는?',
    html: '<p>그는 [[0]]안녕[[0]]이라고 말했다.</p>', ans: ['&quot;', '&quot'], wrong: ['&lt;', '&amp;', '&nbsp;', '&gt;'],
    explain: '&quot; = ".' },
  { cat: 'text', src: '웹_02 특수문자', ask: '"이름"과 "홍길동" 사이에 공백 세 칸을 넣은 특수문자 코드는? (HTML은 연속 공백을 한 칸으로 줄인다)',
    html: '<p>이름[[0]][[0]][[0]]홍길동</p>', ans: ['&nbsp;', '&nbsp'], wrong: ['&lt;', '&amp;', '&quot;', '&gt;'],
    explain: '&nbsp; = 띄어쓰기. 실습에서 안내 줄을 3칸 띄울 때 사용.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '중요하다는 의미 없이 "단순히 굵게"만 표시한 태그는?',
    html: '<p>상품명: <[[0]]>도시락</[[0]]></p>', ans: ['b'], wrong: ['em', 'mark', 'q', 'span'],
    explain: 'b = 단순 굵게, strong = 중요해서 강조.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '주소를 세 줄로 나눠 표시하기 위해 줄을 바꾼 태그는? (닫는 태그 없음)',
    html: '<p>서울시 노원구<[[0]]>공릉로 232<[[0]]>미래관 301호</p>', ans: ['br'], wrong: ['hr', 'p', 'span', 'mark'],
    explain: 'br = 줄 바꿈. 한 단락 안에서 줄만 바꾼다.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '머리말과 본문 사이에 그어진 가로줄의 태그는?',
    html: '<h3>공지사항</h3><[[0]]><p>다음 주 수업은 휴강입니다.</p>', ans: ['hr'], wrong: ['br', 'p', 'h3', 'span'],
    explain: 'hr = 수평 줄.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '속담을 문장 안에서 따옴표와 함께 인용한 태그는?',
    html: '<p>할머니는 늘 <[[0]]>티끌 모아 태산</[[0]]>이라고 하셨다.</p>', ans: ['q'], wrong: ['blockquote', 'mark', 'em', 'b'],
    explain: 'q = 줄바꿈 없는 인용, 따옴표 자동 추가.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '명언을 따로 떼어 들여쓰기한 인용 블록의 태그는?',
    html: '<p>오늘의 명언</p><[[0]]>배움에는 끝이 없다.</[[0]]>', ans: ['blockquote'], wrong: ['q', 'p', 'div', 'h3'],
    explain: 'blockquote = 블록 인용 + 자동 들여쓰기.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '문장 중 "품절"만 묶어 빨간색 스타일을 준 인라인 태그는?',
    html: '<p>치킨마요 도시락은 <[[0]] style="color: red">품절</[[0]]> 상태입니다.</p>', ans: ['span'], wrong: ['div', 'p', 'blockquote', 'h1'],
    explain: 'span = 줄 안(인라인) 묶기.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '제목과 설명을 하나의 카드(회색 테두리 블록)로 묶은 태그는?',
    html: '<[[0]] style="border: 2px solid #94a3b8; padding: 8px; width: 200px"><h4>도시락</h4><p>5,000원</p></[[0]]>', ans: ['div'], wrong: ['span', 'q', 'mark', 'em'],
    explain: 'div = 블록 묶기. span으로 감싸면 인라인이라 테두리가 깨진다.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '검색 결과에서 검색어 "flex"를 노랗게 표시한 태그는?',
    html: '<p>display: <[[0]]>flex</[[0]]> 를 컨테이너에 지정한다.</p>', ans: ['mark'], wrong: ['strong', 'q', 'span', 'em'],
    explain: 'mark = 형광펜.' },
  { cat: 'list', src: '웹_02 목록 (중첩)', ask: '"메뉴1" 아래에 들어간 하위 메뉴 목록(○ 기호)을 감싼 태그는?',
    html: '<ul><li>메뉴1<[[0]]><li>하위 메뉴 A</li><li>하위 메뉴 B</li></[[0]]></li><li>메뉴2</li></ul>', ans: ['ul'], wrong: ['ol', 'dl', 'div', 'p'],
    explain: 'ul 안에 ul을 중첩하면 하위 메뉴가 된다(메뉴 > 하위 메뉴).' },
  { cat: 'list', src: '웹_02 목록 (중첩)', ask: '"준비물" 항목 아래에 번호가 붙은 하위 목록을 감싼 태그는?',
    html: '<ul><li>준비물<[[0]]><li>노트북</li><li>충전기</li></[[0]]></li><li>장소</li></ul>', ans: ['ol'], wrong: ['ul', 'dl', 'li', 'p'],
    explain: 'ol = 번호가 붙는 순서 있는 목록.' },
  { cat: 'list', src: '웹_02 목록', ask: 'nav 안의 메뉴 항목들(● 기호)을 감싼 목록 태그는?',
    html: '<nav><[[0]]><li><a href="#">홈</a></li><li><a href="#">메뉴</a></li><li><a href="#">매장</a></li></[[0]]></nav>', ans: ['ul'], wrong: ['ol', 'dl', 'div', 'p'],
    explain: 'ul·li는 메뉴에 많이 쓴다.' },
  { cat: 'list', src: '웹_02 목록', ask: '라면 끓이는 순서(1, 2, 3)를 만든 목록 태그는?',
    html: '<[[0]]><li>물을 끓인다</li><li>면과 스프를 넣는다</li><li>3분 기다린다</li></[[0]]>', ans: ['ol'], wrong: ['ul', 'dl', 'p', 'div'],
    explain: 'ol = ordered list.' },
  { cat: 'list', src: '웹_02 목록', ask: '순위 목록 안에서 "1. 운영체제", "2. 웹프로그래밍" 같은 각 항목을 만든 태그는?',
    html: '<ol><[[0]]>운영체제</[[0]]><[[0]]>웹프로그래밍</[[0]]><[[0]]>컴퓨터네트워크</[[0]]></ol>', ans: ['li'], wrong: ['dt', 'dd', 'p', 'td'],
    explain: 'li = list item. ol·ul 모두 항목은 li.' },
  { cat: 'list', src: '웹_02 목록', ask: '용어(굵게 아님, 들여쓰기 없음)와 설명(들여쓰기)이 짝지어진 목록 전체를 감싼 태그는?',
    html: '<[[0]]><dt>GET</dt><dd>URL 쿼리스트링으로 전송</dd><dt>POST</dt><dd>HTTP Body로 전송</dd></[[0]]>', ans: ['dl'], wrong: ['ul', 'ol', 'table', 'div'],
    explain: 'dl = 설명 목록 (dt 용어, dd 설명).' },
  { cat: 'list', src: '웹_02 목록', ask: '용어 "CSS" 아래 들여쓰기된 설명 두 줄을 만든 태그는?',
    html: '<dl><dt>CSS</dt><[[0]]>Cascading Style Sheet</[[0]]><[[0]]>스타일을 정의하는 언어</[[0]]></dl>', ans: ['dd'], wrong: ['dt', 'li', 'p', 'td'],
    explain: 'dt 하나에 dd 여러 개 가능.' },
  { cat: 'list', src: '웹_02 목록', ask: '설명 목록에서 "GET", "POST" 같은 용어 부분을 만든 태그는?',
    html: '<dl><[[0]]>GET</[[0]]><dd>조회 · 검색</dd><[[0]]>POST</[[0]]><dd>생성 · 제출</dd></dl>', ans: ['dt'], wrong: ['dd', 'li', 'th', 'h4'],
    explain: 'dt = terms.' },
  { cat: 'table', src: '웹_02 표', ask: '행과 셀 전체를 감싸 표를 만든 태그는?',
    html: '<[[0]] border="1"><tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></[[0]]>', ans: ['table'], wrong: ['tr', 'div', 'ul', 'caption'],
    explain: 'table > tr > td.' },
  { cat: 'table', src: '웹_02 표', ask: '각 행의 맨 앞 "1학년", "2학년"을 굵은 제목 셀로 만든 태그는?',
    html: '<table><tr><[[0]]>1학년</[[0]]><td>C언어</td></tr><tr><[[0]]>2학년</[[0]]><td>웹프로그래밍</td></tr></table>', css: TQ_HCSS, ans: ['th'], wrong: ['td', 'tr', 'caption', 'dt'],
    explain: 'th = 제목 셀(굵게·가운데). 행 머리에도 쓸 수 있다.' },
  { cat: 'table', src: '웹_02 표 (실습 s.33)', ask: '맨 아래 "계" 셀이 열 3칸을 차지하게 한 속성은?',
    html: '<table><tr><td>과목코드</td><td>과목명</td><td>구분</td><td>학점</td></tr><tr><td [[0]]="3">계</td><td>18</td></tr></table>', css: TQ_HCSS, ans: ['colspan', 'colspan=3', 'colspan="3"'], wrong: ['rowspan', 'span', 'cols', 'width'],
    explain: 'colspan = 열(가로) 합치기.' },
  { cat: 'table', src: '웹_02 표', ask: '"점심시간" 셀이 두 행에 걸쳐 세로로 늘어나게 한 속성은?',
    html: '<table><tr><td [[0]]="2">점심시간</td><td>12:00</td></tr><tr><td>12:30</td></tr></table>', css: TQ_HCSS, ans: ['rowspan', 'rowspan=2', 'rowspan="2"'], wrong: ['colspan', 'rows', 'height', 'span'],
    explain: 'rowspan = 행(세로) 합치기.' },
  { cat: 'table', src: '웹_02 표', ask: '성적표 위쪽 가운데에 붙은 "1학기 성적"이라는 표 제목의 태그는?',
    html: '<table><[[0]]>1학기 성적</[[0]]><tr><th>과목</th><th>성적</th></tr><tr><td>DB</td><td>A+</td></tr></table>', css: TQ_HCSS, ans: ['caption'], wrong: ['th', 'figcaption', 'h3', 'thead'],
    explain: 'caption = 표 제목, 위쪽 중앙.' },
  { cat: 'table', src: '웹_02 표', ask: '"과목", "성적"처럼 첫 행의 굵은 제목 셀을 만든 태그는?',
    html: '<table><tr><[[0]]>과목</[[0]]><[[0]]>성적</[[0]]></tr><tr><td>자료구조</td><td>A0</td></tr></table>', css: TQ_HCSS, ans: ['th'], wrong: ['td', 'caption', 'tr', 'dt'],
    explain: 'th = table header.' },
  { cat: 'table', src: '웹_02 표', ask: '"자료구조", "A0" 같은 일반 데이터 칸을 만든 태그는?',
    html: '<table><tr><th>과목</th><th>성적</th></tr><tr><[[0]]>자료구조</[[0]]><[[0]]>A0</[[0]]></tr></table>', css: TQ_HCSS, ans: ['td'], wrong: ['th', 'tr', 'li', 'dd'],
    explain: 'td = table data.' },
  { cat: 'table', src: '웹_02 표', ask: '표의 가로 한 줄(행)을 만든 태그는?',
    html: '<table><[[0]]><th>요일</th><th>과목</th></[[0]]><[[0]]><td>월</td><td>운영체제</td></[[0]]></table>', css: TQ_HCSS, ans: ['tr'], wrong: ['td', 'th', 'li', 'table'],
    explain: 'tr = table row.' },
  { cat: 'media', src: '웹_02 이미지', ask: '그림의 가로 크기를 100으로 줄인 img 속성은? (세로는 비율 유지)',
    html: '<img src="img/main.jpg" [[0]]="100">', ans: ['width', 'width=100', 'width="100"'], wrong: ['height', 'alt', 'title', 'border'],
    explain: 'width·height 생략 시 원본 크기. 한쪽만 주면 비율 유지.' },
  { cat: 'media', src: '웹_02 이미지', ask: '그림의 세로 크기를 60으로 지정한 img 속성은?',
    html: '<img src="img/main.jpg" [[0]]="60">', ans: ['height', 'height=60', 'height="60"'], wrong: ['width', 'alt', 'title', 'size'],
    explain: 'height = 세로 크기.' },
  { cat: 'media', src: '웹_02 링크 (s.30)', ask: '그림을 감싸 누르면 다른 페이지로 이동하는 "이미지 링크(배너)"를 만든 태그는?',
    html: '<[[0]] href="https://www.hsd.co.kr"><img src="img/main.jpg" width="200"></[[0]]>', ans: ['a'], wrong: ['figure', 'div', 'span', 'p'],
    explain: 'a 태그로 img를 감싸면 이미지 링크. 화면에 링크 테두리·커서로 구분된다.' },
  { cat: 'media', src: '웹_02 이미지 · 캡션', ask: '그림과 캡션을 함께 묶어 양옆으로 들여쓰기된 블록을 만든 태그는?',
    html: '<[[0]]><img src="img/main.jpg" width="160"><figcaption>우리 동네</figcaption></[[0]]>', ans: ['figure'], wrong: ['div', 'span', 'section', 'p'],
    explain: 'figure + figcaption. figure는 기본으로 바깥 여백이 있다.' },
  { cat: 'media', src: '웹_02 이미지 · 캡션', ask: '그림 "위쪽"에 붙은 캡션("메인 메뉴")을 만든 태그는? (figure 안)',
    html: '<figure><[[0]]>메인 메뉴</[[0]]><img src="img/main.jpg" width="160"></figure>', ans: ['figcaption'], wrong: ['caption', 'h3', 'legend', 'label'],
    explain: 'figcaption이 앞에 있으면 위, 뒤에 있으면 아래에 제목이 붙는다.' },
  { cat: 'media', src: '웹_02 이미지', ask: '그림 파일의 경로를 지정한 img 속성은?',
    html: '<img [[0]]="img/main.jpg" width="200">', ans: ['src', 'src="img/main.jpg"'], wrong: ['alt', 'href', 'title', 'width'],
    explain: 'src = 경로(HTML 파일 위치 기준), href는 a 태그의 주소.' },
  { cat: 'media', src: '웹_02 이미지', ask: '그림을 찾지 못했을 때 "로고"라는 대체 글자가 보이게 한 속성은?',
    html: '<img src="logo-없음.png" [[0]]="로고" width="120" height="60">', ans: ['alt', 'alt="로고"'], wrong: ['title', 'src', 'name', 'value'],
    explain: 'alt = 대체 텍스트.' },
  { cat: 'media', src: '웹_02 링크', ask: '문장 속 "여기"를 누르면 이동하는 글자 링크로 만든 태그는?',
    html: '<p>자세한 내용은 <[[0]] href="#">여기</[[0]]>를 누르세요.</p>', ans: ['a'], wrong: ['span', 'mark', 'link', 'b'],
    explain: 'a href = 링크. link 태그는 head에서 CSS 연결용.' },
  { cat: 'form', src: '웹_03 input', ask: '취미를 여러 개 고를 수 있는 네모 칸 — input의 type 값은?',
    html: '취미: <label><input type="[[0]]" checked> 독서</label> <label><input type="[[0]]"> 운동</label> <label><input type="[[0]]" checked> 게임</label>',
    ans: ['checkbox', 'type=checkbox', 'type="checkbox"'], wrong: ['radio', 'text', 'date', 'password'],
    explain: 'checkbox = 다중 선택.' },
  { cat: 'form', src: '웹_03 input', ask: '학년 중 하나만 고르는 동그라미 — input의 type 값은?',
    html: '학년: <label><input type="[[0]]" name="y"> 1</label> <label><input type="[[0]]" name="y" checked> 2</label> <label><input type="[[0]]" name="y"> 3</label>',
    ans: ['radio', 'type=radio', 'type="radio"'], wrong: ['checkbox', 'text', 'date', 'password'],
    explain: 'radio는 name을 같게 해야 하나만 선택된다.' },
  { cat: 'form', src: '웹_03 input', ask: '아이디처럼 한 줄 글자를 그대로 입력하는 칸 — input의 type 값은?',
    html: '아이디 <input type="[[0]]" value="apsode">', ans: ['text', 'type=text', 'type="text"'], wrong: ['password', 'checkbox', 'radio', 'date'],
    explain: 'text = 한 줄 텍스트(아이디·이름·주소).' },
  { cat: 'form', src: '웹_03 input', ask: '"비밀번호 확인" 칸처럼 입력이 ●로 가려지는 칸 — input의 type 값은?',
    html: '비밀번호 확인 <input type="[[0]]" value="abcd1234">', ans: ['password', 'type=password', 'type="password"'], wrong: ['hidden', 'text', 'checkbox', 'date'],
    explain: 'password = *·• 로 표시.' },
  { cat: 'form', src: '웹_03 input type', ask: '메일 주소 형식을 브라우저가 자동으로 검사하는 한 줄 입력칸 — input의 type 값은?',
    html: '이메일 <input type="[[0]]" value="abc@hanmail.net">', ans: ['email', 'type=email', 'type="email"'], wrong: ['checkbox', 'date', 'password', 'radio'],
    explain: 'email = 형식 자동 체크, tel은 체크 안 함.' },
  { cat: 'form', src: '웹_03 input type', ask: '홈페이지 웹 주소(http://…)를 입력받는 칸 — input의 type 값은?',
    html: '홈페이지 <input type="[[0]]" value="http://www.company.com">', ans: ['url', 'type=url', 'type="url"'], wrong: ['checkbox', 'date', 'password', 'radio'],
    explain: 'url = 웹 주소.' },
  { cat: 'form', src: '웹_03 input type', ask: '전화번호를 받지만 형식은 검사하지 않는 칸 — input의 type 값은?',
    html: '전화 <input type="[[0]]" value="010-1234-5678">', ans: ['tel', 'type=tel', 'type="tel"'], wrong: ['checkbox', 'date', 'password', 'radio'],
    explain: 'tel = 전화번호, 입력 체크 안 함.' },
  { cat: 'form', src: '웹_03 input type', ask: '생년월일을 달력에서 고르는 칸 — input의 type 값은?',
    html: '생년월일 <input type="[[0]]" value="2005-03-01">', ans: ['date', 'type=date', 'type="date"'], wrong: ['time', 'text', 'checkbox', 'password'],
    explain: 'date = 날짜.' },
  { cat: 'form', src: '웹_03 input type', ask: '수업 시작 시각(시:분)을 고르는 칸 — input의 type 값은?',
    html: '수업 시작 <input type="[[0]]" value="10:30">', ans: ['time', 'type=time', 'type="time"'], wrong: ['date', 'text', 'checkbox', 'password'],
    explain: 'time = 시간.' },
  { cat: 'form', src: '웹_03 input', ask: '입력을 모두 지우는 "다시입력" 버튼 — input의 type 값은?',
    html: '이름 <input type="text" value="홍길동"> <input type="[[0]]" value="다시입력">', ans: ['reset', 'type=reset', 'type="reset"'], wrong: ['text', 'checkbox', 'radio', 'date'],
    explain: 'reset = 사용자 입력 전부 삭제. 화면만으로는 submit과 같아 보이니 의미로 구분한다.' },
  { cat: 'form', src: '웹_03 input', ask: '서버로 입력 내용을 보내는 "가입하기" 버튼 — input의 type 값은?',
    html: '아이디 <input type="text"> <input type="[[0]]" value="가입하기">', ans: ['submit', 'type=submit', 'type="submit"'], wrong: ['text', 'checkbox', 'radio', 'password'],
    explain: 'submit = 전송. 버튼 글자는 value로.' },
  { cat: 'form', src: '웹_03 input', ask: '회원번호를 화면에는 안 보이게 하면서 서버로는 함께 보내는 칸 — input의 type 값은?',
    html: '이름 <input type="text" value="홍길동"> <input type="[[0]]" name="no" value="1024">', ans: ['hidden', 'type=hidden', 'type="hidden"'], wrong: ['text', 'password', 'checkbox', 'date'],
    explain: 'hidden = 화면에 안 보이지만 서버로 전송.' },
  { cat: 'form', src: '웹_03 input 속성', ask: '빈 검색창에 회색 힌트 "검색어를 입력하세요"를 보여 준 속성은?',
    html: '<input type="text" [[0]]="검색어를 입력하세요" size="24">', ans: ['placeholder', 'placeholder="검색어를 입력하세요"'], wrong: ['value', 'title', 'name', 'alt'],
    explain: 'placeholder = 클릭(입력)하면 사라지는 힌트. value는 실제 값(검은 글자).' },
  { cat: 'form', src: '웹_03 input 속성', ask: '국적 칸에 처음부터 실제 값 "대한민국"이 들어 있게 한 속성은? (회색 힌트가 아님)',
    html: '국적 <input type="text" [[0]]="대한민국">', ans: ['value', 'value="대한민국"'], wrong: ['placeholder', 'title', 'name', 'alt'],
    explain: 'value = 실제 값.' },
  { cat: 'form', src: '웹_03 input', ask: '"이용약관 동의" 체크박스가 처음부터 체크되어 있게 한 속성은? (값 없이)',
    html: '<label><input type="checkbox" [[0]]> 이용약관 동의</label>', ans: ['checked', 'checked="checked"'], wrong: ['selected', 'readonly', 'required', 'autofocus'],
    explain: 'radio·checkbox의 최초 선택은 checked, option은 selected.' },
  { cat: 'form', src: '웹_03 select', ask: '드롭다운에서 "정보통신공학과"가 처음부터 선택되어 보이게 한 option 속성은?',
    html: '<select><option>컴퓨터공학과</option><option [[0]]>정보통신공학과</option><option>전자공학과</option></select>', ans: ['selected', 'selected="selected"'], wrong: ['checked', 'readonly', 'required', 'autofocus'],
    explain: 'option의 selected = 최초 선택 항목.' },
  { cat: 'form', src: '웹_03 label', ask: '입력칸 앞의 "아이디" 글자를 입력칸과 연결된 이름표로 만든 태그는? (for 속성 사용)',
    html: '<[[0]] for="uid">아이디</[[0]]> <input id="uid" type="text">', ans: ['label'], wrong: ['legend', 'caption', 'fieldset', 'h3'],
    explain: 'label for ↔ input id로 연결하면 라벨 클릭 시 입력칸으로 이동한다.' },
  { cat: 'form', src: '웹_03 select', ask: '"지역"을 펼쳐서 하나 고르는 드롭다운 전체를 만든 태그는?',
    html: '지역 <[[0]]><option>서울</option><option selected>경기</option><option>부산</option></[[0]]>', ans: ['select'], wrong: ['ul', 'datalist', 'option', 'dl'],
    explain: 'select + option.' },
  { cat: 'form', src: '웹_03 select', ask: '드롭다운 목록 안의 "서울", "경기" 같은 각 항목을 만든 태그는?',
    html: '<select size="3"><[[0]]>서울</[[0]]><[[0]]>경기</[[0]]><[[0]]>부산</[[0]]></select>', ans: ['option'], wrong: ['li', 'optgroup', 'dd', 'td'],
    explain: 'option = select의 항목, optgroup = 항목 묶음.' },
  { cat: 'form', src: '웹_03 textarea', ask: '자기소개를 여러 줄로 쓰는 큰 입력칸을 만든 태그는?',
    html: '자기소개<br><[[0]] rows="3" cols="30">안녕하세요.\n2학년입니다.</[[0]]>', ans: ['textarea'], wrong: ['input', 'p', 'div', 'select'],
    explain: 'textarea는 input이 아닌 별도 태그.' },
  { cat: 'form', src: '웹_03 fieldset', ask: '주문서에서 "상품 정보" 구역을 테두리로 묶은 태그는?',
    html: '<[[0]]><legend>상품 정보</legend>상품명 <input type="text"> 수량 <input type="text" size="3"></[[0]]>', ans: ['fieldset'], wrong: ['legend', 'div', 'form', 'table'],
    explain: 'fieldset = 구역, legend = 구역 제목.' },
  { cat: 'text', src: '웹_02 텍스트 태그', ask: '문장 속 "반드시"를 기울임 꼴로 강조한 태그는?',
    html: '<p>과제는 <[[0]]>반드시</[[0]]> 금요일까지 제출하세요.</p>', ans: ['em', 'i'], wrong: ['strong', 'mark', 'q', 'span'],
    explain: 'em(강조) · i 모두 기울임으로 표시된다.' },
];

const TQ_CSS = [
  // ── 선택자 (04) ──
  { cat: 'sel', src: '웹_04 가상 클래스', ask: '목록의 두 번째 항목만 빨갛게 칠한 선택자는?',
    html: '<ul><li>첫째</li><li>둘째</li><li>셋째</li><li>넷째</li></ul>', css: '[[0]] { background: #fca5a5; }',
    ans: ['li:nth-child(2)', 'ul li:nth-child(2)', 'ul>li:nth-child(2)', 'li:nth-of-type(2)', 'ul li:nth-of-type(2)'], wrong: ['li:nth-child(1)', 'li:last-child', 'li:nth-child(even)', 'li + li'],
    explain: ':nth-child(n) = 부모의 n번째 자식.' },
  { cat: 'sel', src: '웹_04 가상 클래스 (s.38, 실습 표 줄무늬)', ask: '짝수 번째 항목만 칠해 줄무늬를 만든 선택자는?',
    html: '<ul><li>1번</li><li>2번</li><li>3번</li><li>4번</li><li>5번</li></ul>', css: '[[0]] { background: #fde68a; }',
    ans: ['li:nth-child(even)', 'li:nth-child(2n)', 'ul li:nth-child(even)', 'ul li:nth-child(2n)', 'li:nth-of-type(even)', 'li:nth-of-type(2n)'], wrong: ['li:nth-child(odd)', 'li:nth-child(2)', 'li ~ li', 'li:first-child'],
    explain: 'nth-child는 an+b 수식이나 even/odd를 쓸 수 있다(게시판 줄무늬).' },
  { cat: 'sel', src: '웹_04 nth-child vs nth-of-type (s.40~43)', ask: 'body의 자식이 div, p, div, div일 때 두 번째 div(box2)만 칠한 선택자는?',
    html: '<div class="box">div box1</div><p>p 요소</p><div class="box">div box2</div><div class="box">div box3</div>', css: TQ_BOXES + '\n[[0]] { background: #fca5a5; }',
    ans: ['div:nth-of-type(2)', 'div:nth-child(3)'], wrong: ['div:nth-child(2)', 'div:first-child', 'p + div + div', 'div:last-child'],
    explain: 'div:nth-of-type(2) = div 중 2번째. div:nth-child(2)는 두 번째 자식이 p라서 아무것도 선택하지 않는다.' },
  { cat: 'sel', src: '웹_04 연결 선택자', ask: 'h2 바로 다음에 오는 p 하나만 칠한 선택자는?',
    html: '<h2>제목</h2><p>바로 다음 p</p><p>그다음 p</p><div>div</div><p>마지막 p</p>', css: '[[0]] { background: #bbf7d0; }',
    ans: ['h2 + p', 'h2+p'], wrong: ['h2 ~ p', 'h2 p', 'h2 > p', 'p:last-child'],
    explain: 'A + B = 바로 다음 형제 하나, A ~ B = 다음 모든 형제.' },
  { cat: 'sel', src: '웹_04 연결 선택자', ask: 'h2 다음에 오는 모든 p를 칠한 선택자는?',
    html: '<h2>제목</h2><p>바로 다음 p</p><p>그다음 p</p><div>div</div><p>마지막 p</p>', css: '[[0]] { background: #bbf7d0; }',
    ans: ['h2 ~ p', 'h2~p'], wrong: ['h2 + p', 'h2 p', 'h2 > p', 'p:first-child'],
    explain: 'A ~ B = A 다음의 모든 형제 B.' },
  { cat: 'sel', src: '웹_04 연결 선택자', ask: 'div 바로 아래 자식 p만 칠하고, section 안의 손자 p는 칠하지 않은 선택자는?',
    html: '<div><p>자식 p</p><section><p>손자 p</p></section><p>자식 p</p></div>', css: 'div, section { border: 1px dashed #94a3b8; padding: 4px; }\n[[0]] { background: #c7d2fe; }',
    ans: ['div > p', 'div>p'], wrong: ['div p', 'div + p', 'div ~ p', 'section p'],
    explain: 'A > B = 바로 아래 자식만, A B(공백) = 모든 후손.' },
  { cat: 'sel', src: '웹_04 연결 선택자', ask: 'div 안의 p를 손자까지 모두 칠한 선택자는?',
    html: '<div><p>자식 p</p><section><p>손자 p</p></section><p>자식 p</p></div>', css: 'div, section { border: 1px dashed #94a3b8; padding: 4px; }\n[[0]] { background: #c7d2fe; }',
    ans: ['div p'], wrong: ['div > p', 'div + p', 'section > p', 'div ~ p'],
    explain: '하위 선택자(공백) = 모든 후손. 가장 많이 쓰인다.' },
  { cat: 'sel', src: '웹_04 속성 선택자', ask: '새 탭으로 열리는 링크(target="_blank")만 칠한 선택자는?',
    html: '<p><a href="#">일반 링크</a></p><p><a href="#" target="_blank">새 탭 링크</a></p><p><a href="#">일반 링크</a></p>', css: '[[0]] { background: #fde68a; }',
    ans: ['a[target="_blank"]', 'a[target=_blank]', '[target="_blank"]', '[target=_blank]'], wrong: ['a[href]', 'a:visited', 'a.target', 'a:link'],
    explain: '[속성="값"] = 속성 값이 일치하는 요소, [속성] = 그 속성이 있는 요소.' },
  { cat: 'sel', src: '웹_04 가상 요소', ask: '각 문단의 첫 글자만 크고 빨갛게 만든 선택자는?',
    html: '<p>Hello CSS</p><p>Web Programming</p>', css: '[[0]] { color: red; font-size: 26px; }',
    ans: ['p::first-letter', 'p:first-letter'], wrong: ['p::before', 'p:first-child', 'p::after', 'p:hover'],
    explain: '::first-letter = 첫 글자. 콜론 1개는 레거시, 2개는 CSS3 표기.' },
  // ── 텍스트 (04) ──
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '글자 가운데에 취소선을 그은 선언은?',
    html: '<p class="box">정가 10,000원</p>', css: '.box { font-size: 18px; [[0]] }',
    ans: ['text-decoration: line-through'], wrong: ['text-decoration: underline', 'text-decoration: overline', 'font-style: italic', 'text-decoration: none'],
    explain: 'text-decoration: none / underline / overline / line-through.' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '링크의 밑줄을 없앤 선언은?',
    html: '<p><a class="box" href="#">밑줄 없는 메뉴 링크</a></p>', css: '.box { font-size: 18px; [[0]] }',
    ans: ['text-decoration: none'], wrong: ['text-decoration: underline', 'display: none', 'border: none', 'font-weight: normal'],
    explain: 'text-decoration: none은 링크 밑줄 제거(CSS reset에 자주 사용).' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '글자를 박스 가로 가운데로 옮긴 선언은?',
    html: '<p class="box">가운데 정렬된 글자</p>', css: '.box { border: 2px solid #94a3b8; padding: 8px; [[0]] }',
    ans: ['text-align: center'], wrong: ['vertical-align: middle', 'margin: 0 auto', 'text-align: right', 'justify-content: center'],
    explain: 'text-align = 수평 정렬(left/center/right/justify).' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '소문자를 작은 대문자로 바꿔 보이게 한 선언은?',
    html: '<p class="box">Hello Web Programming</p>', css: '.box { font-size: 20px; [[0]] }',
    ans: ['font-variant: small-caps'], wrong: ['text-transform: uppercase', 'font-style: italic', 'font-weight: bold', 'font-size: small'],
    explain: 'font-variant: small-caps = 소문자 → 작은 대문자.' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '글자를 굵게 만든 선언은? (숫자 값으로)',
    html: '<p class="box">굵은 글씨</p>', css: '.box { font-size: 20px; [[0]] }',
    ans: ['font-weight: 700', 'font-weight: bold'], wrong: ['font-weight: 400', 'font-style: italic', 'font-size: 700', 'font-weight: 100'],
    explain: 'normal = 400, bold = 700.' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '글자를 기울인 선언은?',
    html: '<p class="box">기울어진 글씨</p>', css: '.box { font-size: 20px; [[0]] }',
    ans: ['font-style: italic', 'font-style: oblique'], wrong: ['font-variant: small-caps', 'font-weight: bold', 'transform: rotate(10deg)', 'text-decoration: underline'],
    explain: 'font-style: normal / italic / oblique.' },
  { cat: 'text', src: '웹_04 수직 가운데 정렬 (s.61)', ask: '높이 60px 박스 안의 한 줄 글자를 세로 가운데로 옮긴 선언은?',
    html: '<div class="box">더 보기</div>', css: '.box { height: 60px; background: salmon; text-align: center; [[0]] }',
    ans: ['line-height: 60px'], wrong: ['vertical-align: middle', 'height: 30px', 'padding-top: 60px', 'text-align: center'],
    explain: '한 줄이면 height와 line-height를 같게 한다.' },
  // ── 박스 · 배경 (05) ──
  { cat: 'box', src: '웹_05 border', ask: '정사각형을 원으로 만든 선언은?',
    html: '<div class="box"></div>', css: '.box { width: 100px; height: 100px; background: salmon; [[0]] }',
    ans: ['border-radius: 50%', 'border-radius: 50px'], wrong: ['border-radius: 10%', 'border: 50%', 'border-radius: 0', 'transform: rotate(45deg)'],
    explain: 'border-radius: 50% → 원.' },
  { cat: 'box', src: '웹_05 box-sizing (s.8)', ask: 'width 300px · padding 20px · border 10px 박스의 전체 너비가 파란 막대(300px)와 같아지게 한 선언은?',
    html: '<div class="box">박스</div><div class="ruler"></div>', css: '.box { width: 300px; padding: 20px; border: 10px solid #333; background: #fde68a; [[0]] }\n.ruler { width: 300px; height: 6px; background: #4f46e5; margin-top: 4px; }',
    ans: ['box-sizing: border-box'], wrong: ['box-sizing: content-box', 'width: 360px', 'padding: 0', 'margin: 0 auto'],
    explain: '기본 content-box면 300 + 40 + 20 = 360px. border-box면 width = 전체 박스.' },
  { cat: 'box', src: '웹_05 margin', ask: '너비 200px 박스를 가로 가운데로 옮긴 선언은?',
    html: '<div class="box">가운데 박스</div>', css: '.box { width: 200px; background: #bbf7d0; text-align: center; [[0]] }',
    ans: ['margin: 0 auto', 'margin: 0px auto', 'margin: auto'], wrong: ['text-align: center', 'padding: 0 auto', 'margin: auto 0', 'float: center'],
    explain: 'margin: 0 auto → 위아래 0, 좌우 auto → 가로 가운데.' },
  { cat: 'box', src: '웹_05 padding', ask: '테두리 안쪽 여백만 넓힌 선언은? (테두리 바깥 위치는 그대로)',
    html: '<div class="box">안쪽 여백</div>', css: '.box { width: 160px; border: 3px solid #475569; background: #e0e7ff; [[0]] }',
    ans: ['padding: 20px'], wrong: ['margin: 20px', 'border: 20px solid #475569', 'line-height: 20px', 'width: 200px'],
    explain: 'padding = 콘텐츠와 테두리 사이(안쪽), margin = 바깥.' },
  { cat: 'box', src: '웹_05 border', ask: '테두리를 점선(---)으로 바꾼 선언은?',
    html: '<div class="box">테두리</div>', css: '.box { width: 160px; padding: 12px; border: 3px solid #475569; [[0]] }',
    ans: ['border-style: dashed', 'border: 3px dashed #475569'], wrong: ['border-style: dotted', 'border-style: double', 'border-style: none', 'border-style: groove'],
    explain: 'dashed = 짧은 선 점선, dotted = 점, double = 이중선. 기본값 none.' },
  { cat: 'box', src: '웹_05 background (s.65)', ask: '배경 그림이 박스를 빈틈없이 다 덮게(잘려도 됨) 만든 선언은?',
    html: '<div class="box"></div>', css: '.box { width: 260px; height: 110px; border: 2px solid #475569; background: #f1f5f9 url(img/main.jpg) no-repeat center; [[0]] }',
    ans: ['background-size: cover'], wrong: ['background-size: contain', 'background-size: auto', 'background-repeat: repeat', 'background-attachment: fixed'],
    explain: 'cover = 요소를 다 덮음, contain = 요소 안에 다 들어오게.' },
  { cat: 'box', src: '웹_05 background (s.65)', ask: '배경 그림 전체가 잘리지 않고 박스 안에 다 들어오게 만든 선언은?',
    html: '<div class="box"></div>', css: '.box { width: 260px; height: 110px; border: 2px solid #475569; background: #f1f5f9 url(img/main.jpg) no-repeat center; [[0]] }',
    ans: ['background-size: contain'], wrong: ['background-size: cover', 'background-size: auto', 'background-clip: content-box', 'background-repeat: no-repeat'],
    explain: 'contain = 요소 안에 맞춤(빈 곳이 생길 수 있음).' },
  // ── display · position · float (05) ──
  { cat: 'layout', src: '웹_05 display', ask: 'B 박스가 사라지고 C가 B 자리로 당겨 온 선언은?',
    html: '<span class="box">A</span><span class="box b">B</span><span class="box">C</span>', css: '.box { display: inline-block; ' + WQ_BOX + ' }\n.b { [[0]] }',
    ans: ['display: none'], wrong: ['visibility: hidden', 'opacity: 0', 'display: block', 'float: left'],
    explain: 'display: none = 공간도 차지하지 않음.' },
  { cat: 'layout', src: '웹_05 display', ask: 'B 박스가 안 보이지만 B 자리(공간)는 비워 둔 채 남은 선언은?',
    html: '<span class="box">A</span><span class="box b">B</span><span class="box">C</span>', css: '.box { display: inline-block; ' + WQ_BOX + ' }\n.b { [[0]] }',
    ans: ['visibility: hidden'], wrong: ['display: none', 'display: block', 'position: absolute', 'width: 0'],
    explain: 'visibility: hidden = 안 보이지만 공간 차지.' },
  { cat: 'layout', src: '웹_05 display', ask: '세로로 쌓이던 항목들이 가로로 나란히 놓이면서 너비 90px · 높이 40px도 적용된 선언은?',
    html: '<ul class="menu"><li>홈</li><li>메뉴</li><li>매장</li></ul>', css: '.menu { list-style: none; padding: 0; }\n.menu li { width: 90px; height: 40px; ' + WQ_BOX + ' [[0]] }',
    ans: ['display: inline-block'], wrong: ['display: inline', 'display: block', 'display: none', 'float: none'],
    explain: 'inline-block = 인라인처럼 나란히 + 블록처럼 너비·높이. inline이면 너비·높이가 무시된다.' },
  { cat: 'layout', src: '웹_05 display', ask: '한 줄에 붙어 있던 span들이 각각 한 줄씩 차지하게 된 선언은?',
    html: '<span class="box">A</span><span class="box">B</span><span class="box">C</span>', css: '.box { ' + WQ_BOX + ' [[0]] }',
    ans: ['display: block'], wrong: ['display: inline', 'display: inline-block', 'float: left', 'display: none'],
    explain: 'block = 혼자 한 줄 차지.' },
  { cat: 'layout', src: '웹_05 float', ask: '사진 박스가 오른쪽으로 떠서 글이 왼쪽으로 감싸 흐르게 된 선언은?',
    html: '<div class="pic">사진</div><p>float을 지정한 요소는 문서의 흐름에서 벗어나 왼쪽이나 오른쪽에 뜨고, 다른 글이 그 옆을 감싸며 흐릅니다. 이미지와 텍스트를 어우러지게 배치할 때 씁니다.</p>', css: '.pic { width: 90px; height: 70px; background: #fde68a; border: 2px solid #475569; [[0]] }',
    ans: ['float: right'], wrong: ['float: left', 'clear: both', 'position: fixed', 'text-align: right'],
    explain: 'float: left | right, 해제는 clear.' },
  { cat: 'layout', src: '웹_05 position (s.49~53)', ask: 'B가 아래로 30px · 오른쪽으로 30px 옮겨졌고, 원래 자리는 비어 있는 채로 C는 그대로인 선언은? (B에 top: 30px; left: 30px;가 이미 있음)',
    html: '<div class="box">A</div><div class="box b">B</div><div class="box">C</div>', css: '.box { width: 120px; ' + WQ_BOX + ' }\n.b { background: #fca5a5; top: 30px; left: 30px; [[0]] }',
    ans: ['position: relative'], wrong: ['position: absolute', 'position: static', 'position: fixed', 'margin-top: 30px'],
    explain: 'relative = 원래 위치 기준 이동 + 원래 공간 유지. static이면 top·left가 무시된다.' },
  { cat: 'layout', src: '웹_05 position (s.49~53)', ask: 'B가 흐름에서 빠져 떠 있고 C가 B 자리로 올라온 선언은? (B에 top: 30px; left: 150px;가 이미 있음)',
    html: '<div class="box">A</div><div class="box b">B</div><div class="box">C</div>', css: '.box { width: 120px; ' + WQ_BOX + ' }\n.b { background: #fca5a5; top: 30px; left: 150px; [[0]] }',
    ans: ['position: absolute'], wrong: ['position: relative', 'position: static', 'display: none', 'float: left'],
    explain: 'absolute = 흐름에서 벗어남, static이 아닌 가장 가까운 조상(없으면 body) 기준.' },
  { cat: 'layout', src: '웹_05 z-index', ask: '겹쳐 있는 두 박스 중 아래 깔려 있던 빨간 박스가 위로 올라온 선언은? (두 박스 모두 position: absolute)',
    html: '<div class="r">빨강</div><div class="y">노랑</div>', css: '.r, .y { position: absolute; width: 110px; height: 70px; border: 2px solid #475569; }\n.r { top: 10px; left: 10px; background: #fca5a5; [[0]] }\n.y { top: 40px; left: 60px; background: #fde68a; }',
    ans: ['z-index: 1', 'z-index: 2', 'z-index: 10', 'z-index: 100', 'z-index: 99', 'z-index: 999'], wrong: ['z-index: -1', 'position: static', 'opacity: 1', 'order: 1'],
    explain: 'z-index는 position이 지정된 요소에서 클수록 위. 기본은 뒤에 나온 요소(노랑)가 위.' },
  // ── Flexbox (06) ──
  { cat: 'flex', src: '웹_06 Flexbox 시작', ask: '세로로 쌓이던 div들이 가로로 나란히 놓인 선언은? (컨테이너에 적용)',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { border: 2px dashed #94a3b8; [[0]] }',
    ans: ['display: flex'], wrong: ['display: inline', 'flex-direction: row', 'float: left', 'display: block'],
    explain: 'display: flex를 컨테이너에 주면 아이템이 가로(row)로 배치된다.' },
  { cat: 'flex', src: '웹_06 justify-content', ask: '아이템들을 한 덩어리로 메인축 가운데에 모은 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['justify-content: center'], wrong: ['align-items: center', 'justify-content: space-between', 'text-align: center', 'justify-content: flex-end'],
    explain: 'justify-content = 메인축 정렬.' },
  { cat: 'flex', src: '웹_06 justify-content', ask: '첫 아이템은 왼쪽 끝, 마지막 아이템은 오른쪽 끝에 붙고 사이 간격이 같아진 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['justify-content: space-between'], wrong: ['justify-content: space-around', 'justify-content: space-evenly', 'justify-content: center', 'align-content: space-between'],
    explain: 'space-between = 양끝 붙이고 사이 균등, space-around = 아이템 둘레 균등, space-evenly = 모든 간격 균등.' },
  { cat: 'flex', src: '웹_06 justify-content', ask: '양끝을 포함한 모든 간격이 똑같아진 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['justify-content: space-evenly'], wrong: ['justify-content: space-between', 'justify-content: space-around', 'justify-content: center', 'align-items: stretch'],
    explain: 'space-evenly = 양끝 여백과 사이 간격 모두 같다. space-around는 양끝 여백이 사이 간격의 절반.' },
  { cat: 'flex', src: '웹_06 justify-content', ask: '아이템들이 메인축 끝(오른쪽)으로 모인 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['justify-content: flex-end', 'justify-content: end'], wrong: ['justify-content: flex-start', 'align-items: flex-end', 'flex-direction: row-reverse', 'text-align: right'],
    explain: 'flex-end = 메인축 끝. row-reverse는 순서까지 3 2 1로 뒤집힌다.' },
  { cat: 'flex', src: '웹_06 align-items', ask: '높이 150px 컨테이너 안에서 아이템들을 교차축(세로) 가운데로 옮긴 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; height: 150px; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['align-items: center'], wrong: ['justify-content: center', 'align-content: center', 'vertical-align: middle', 'align-items: stretch'],
    explain: 'align-items = 교차축 정렬. 기본값 stretch면 컨테이너 높이까지 늘어난다.' },
  { cat: 'flex', src: '웹_06 align-items', ask: '컨테이너 높이까지 늘어나 있던 아이템들이 내용 높이만큼 줄어 아래쪽에 붙은 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; height: 150px; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['align-items: flex-end', 'align-items: end'], wrong: ['justify-content: flex-end', 'align-items: flex-start', 'flex-direction: column', 'align-content: flex-end'],
    explain: 'align-items: flex-end = 교차축 끝(row면 아래).' },
  { cat: 'flex', src: '웹_06 flex-direction', ask: 'flex 아이템들이 세로로 쌓이게 메인축을 바꾼 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['flex-direction: column'], wrong: ['flex-direction: row', 'flex-wrap: wrap', 'display: block', 'flex-direction: column-reverse'],
    explain: 'column이면 justify-content가 세로, align-items가 가로를 담당한다.' },
  { cat: 'flex', src: '웹_06 flex-direction', ask: '아이템 순서가 3 2 1로 뒤집혀 오른쪽부터 놓인 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['flex-direction: row-reverse'], wrong: ['justify-content: flex-end', 'flex-direction: column-reverse', 'flex-wrap: wrap-reverse', 'order: -1'],
    explain: 'row-reverse = 메인축 방향이 오른쪽→왼쪽.' },
  { cat: 'flex', src: '웹_06 flex-wrap', ask: '한 줄에 다 안 들어가 넘치던 아이템들이 다음 줄로 넘어간 선언은?',
    html: '<div class="row"><div class="box i">1</div><div class="box i">2</div><div class="box i">3</div><div class="box i">4</div><div class="box i">5</div></div>', css: TQ_BOXES + '\n.row { display: flex; width: 300px; border: 2px dashed #94a3b8; [[0]] }\n.i { flex-basis: 70px; flex-shrink: 0; }',
    ans: ['flex-wrap: wrap'], wrong: ['flex-wrap: nowrap', 'flex-direction: column', 'overflow: hidden', 'flex-shrink: 1'],
    explain: 'flex-wrap 기본 nowrap, wrap이면 줄바꿈.' },
  { cat: 'flex', src: '웹_06 flex-grow', ask: '2번 아이템 하나가 남는 여백을 모두 차지하도록 늘어난 선언은? (2번에 적용)',
    html: '<div class="row"><div class="box">1</div><div class="box b">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; }\n.b { background: #fca5a5; [[0]] }',
    ans: ['flex-grow: 1', 'flex: 1', 'flex-grow: 2', 'flex-grow: 10'], wrong: ['flex-shrink: 1', 'flex-basis: 0', 'order: 1', 'flex-grow: 0'],
    explain: 'flex-grow 기본 0, 0보다 크면 남는 여백을 나눠 갖는다.' },
  { cat: 'flex', src: '웹_06 order', ask: 'HTML에서는 세 번째인 C 아이템이 화면에서 맨 앞에 보이게 한 선언은? (C에 적용, 나머지 order는 기본값)',
    html: '<div class="row"><div class="box">A</div><div class="box">B</div><div class="box c">C</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; }\n.c { background: #fca5a5; [[0]] }',
    ans: ['order: -1', 'order: -2', 'order: -10'], wrong: ['order: 1', 'order: 3', 'flex-direction: row-reverse', 'z-index: -1'],
    explain: 'order 기본값 0, 작은 숫자가 먼저. HTML 구조는 바뀌지 않는다.' },
  // ── transform (07) ──
  { cat: 'anim', src: '웹_07 transform', ask: '박스를 시계 방향으로 45도 돌린 선언은?',
    html: '<div class="box">회전</div>', css: '.box { width: 90px; height: 50px; margin: 40px; background: salmon; [[0]] }',
    ans: ['transform: rotate(45deg)', 'transform: rotateZ(45deg)'], wrong: ['transform: rotate(-45deg)', 'transform: skew(45deg)', 'transform: translate(45px)', 'transform: scale(45)'],
    explain: 'rotate(양수 deg) = 시계 방향, 음수 = 반대 방향.' },
  { cat: 'anim', src: '웹_07 transform', ask: '박스를 시계 반대 방향으로 30도 돌린 선언은?',
    html: '<div class="box">회전</div>', css: '.box { width: 90px; height: 50px; margin: 40px; background: salmon; [[0]] }',
    ans: ['transform: rotate(-30deg)', 'transform: rotateZ(-30deg)'], wrong: ['transform: rotate(30deg)', 'transform: skew(-30deg)', 'transform: translateX(-30px)', 'transform: scale(0.7)'],
    explain: '음수 deg = 반대 방향 회전.' },
  { cat: 'anim', src: '웹_07 transform', ask: '박스를 가로·세로 모두 1.5배로 키운 선언은? (옆 박스는 밀리지 않음)',
    html: '<div class="box">A</div><div class="box s">B</div><div class="box">C</div>', css: '.box { display: inline-block; width: 50px; height: 40px; margin: 30px 6px; background: #c7d2fe; border: 2px solid #475569; }\n.s { background: salmon; [[0]] }',
    ans: ['transform: scale(1.5)', 'transform: scale(1.5, 1.5)'], wrong: ['transform: scaleX(1.5)', 'width: 75px', 'transform: scale(0.5)', 'transform: translate(1.5px)'],
    explain: 'scale은 보이는 모습만 바꾼다. width를 늘리면 옆 박스가 밀린다.' },
  { cat: 'anim', src: '웹_07 transform', ask: '박스를 가로로만 2배 늘린 선언은?',
    html: '<div class="box">B</div>', css: '.box { width: 60px; height: 40px; margin: 30px 70px; background: salmon; [[0]] }',
    ans: ['transform: scaleX(2)', 'transform: scale(2, 1)'], wrong: ['transform: scaleY(2)', 'transform: scale(2)', 'transform: translateX(2px)', 'transform: skewX(2deg)'],
    explain: 'scaleX = 가로 배율, scaleY = 세로 배율, scale(n) = 둘 다.' },
  { cat: 'anim', src: '웹_07 transform', ask: '박스를 원래 자리에서 오른쪽으로 80px 옮긴 선언은? (아래 박스 위치는 그대로)',
    html: '<div class="box m">이동</div><div class="box">아래</div>', css: '.box { width: 90px; height: 36px; margin: 6px; background: #c7d2fe; border: 2px solid #475569; }\n.m { background: salmon; [[0]] }',
    ans: ['transform: translateX(80px)', 'transform: translate(80px)', 'transform: translate(80px, 0)', 'transform: translate(80px, 0px)'], wrong: ['transform: translateY(80px)', 'margin-left: -80px', 'transform: scaleX(1.5)', 'transform: rotate(80deg)'],
    explain: 'translate = position relative처럼 현재 위치 기준 이동.' },
  { cat: 'anim', src: '웹_07 transform', ask: '박스를 비스듬히 기울인(평행사변형) 선언은?',
    html: '<div class="box">기울임</div>', css: '.box { width: 120px; height: 50px; margin: 30px; background: salmon; [[0]] }',
    ans: ['transform: skewX(20deg)', 'transform: skew(20deg)', 'transform: skew(20deg, 0)'], wrong: ['transform: rotate(20deg)', 'transform: scaleX(1.2)', 'transform: translateX(20px)', 'font-style: italic'],
    explain: '2D 메서드: translate, rotate, scale, skew(기울임), matrix.' },

  // ── 추가 문제 (2026-10-20) ──
  { cat: 'sel', src: '웹_04 가상 클래스', ask: '목록의 마지막 항목만 칠한 선택자는?',
    html: '<ul><li>첫째</li><li>둘째</li><li>셋째</li><li>넷째</li></ul>', css: '[[0]] { background: #fca5a5; }',
    ans: ['li:last-child', 'ul li:last-child', 'li:nth-last-child(1)', 'li:last-of-type', 'li:nth-child(4)'], wrong: ['li:first-child', 'li:nth-child(3)', 'li ~ li', 'li:nth-child(odd)'],
    explain: ':last-child = 마지막 자식, :first-child = 첫 자식.' },
  { cat: 'sel', src: '웹_04 가상 클래스', ask: '목록의 첫 번째 항목만 칠한 선택자는?',
    html: '<ul><li>첫째</li><li>둘째</li><li>셋째</li><li>넷째</li></ul>', css: '[[0]] { background: #bbf7d0; }',
    ans: ['li:first-child', 'ul li:first-child', 'li:nth-child(1)', 'li:first-of-type'], wrong: ['li:last-child', 'li + li', 'li:nth-child(2)', 'li ~ li'],
    explain: ':first-child = 첫 자식.' },
  { cat: 'sel', src: '웹_04 가상 클래스 (s.38)', ask: '홀수 번째 항목(1, 3, 5번)만 칠한 선택자는?',
    html: '<ul><li>1번</li><li>2번</li><li>3번</li><li>4번</li><li>5번</li></ul>', css: '[[0]] { background: #fde68a; }',
    ans: ['li:nth-child(odd)', 'li:nth-child(2n+1)', 'ul li:nth-child(odd)', 'li:nth-of-type(odd)'], wrong: ['li:nth-child(even)', 'li:nth-child(1)', 'li:last-child', 'li + li'],
    explain: 'odd = 홀수(2n+1), even = 짝수(2n).' },
  { cat: 'sel', src: '웹_04 선택자', ask: 'class="item"이 붙은 항목만 칠한 선택자는?',
    html: '<ul><li class="item">사과</li><li>배</li><li class="item">포도</li><li>감</li></ul>', css: '[[0]] { background: #c7d2fe; }',
    ans: ['.item', 'li.item', 'ul .item', 'ul li.item'], wrong: ['#item', 'li', 'li:first-child', 'li:nth-child(even)'],
    explain: '.클래스 = 여러 요소, #아이디 = 한 요소.' },
  { cat: 'sel', src: '웹_04 선택자', ask: 'id="main"인 문단 하나만 칠한 선택자는?',
    html: '<p>머리말</p><p id="main">본문 문단</p><p>꼬리말</p>', css: '[[0]] { background: #c7d2fe; }',
    ans: ['#main', 'p#main'], wrong: ['.main', 'p', 'main', 'p:first-child'],
    explain: '# = id 선택자.' },
  { cat: 'sel', src: '웹_04 선택자 · CSS reset', ask: 'html · body를 포함한 문서의 모든 요소에 테두리를 준 선택자는?',
    html: '<h1>제목</h1><p>문단 <span>인라인</span></p>', css: 'h1 { margin: 4px 0; }\n[[0]] { border: 2px solid #ef4444; }',
    ans: ['*'], wrong: ['body', 'h1, p', 'body *', 'h1 p'],
    explain: '* = 전체 선택자. CSS reset(* { margin: 0; … })에 쓴다.' },
  { cat: 'sel', src: '웹_04 그룹 선택자', ask: 'h1과 p에만 같은 배경을 준 선택자는? (span은 그대로)',
    html: '<h1>제목</h1><p>문단</p><span>인라인</span>', css: 'h1 { margin: 4px 0; }\n[[0]] { background: #fde68a; }',
    ans: ['h1, p', 'p, h1', 'h1,p', 'p,h1'], wrong: ['h1 p', 'h1 + p', 'h1 ~ p', '*'],
    explain: '그룹 선택자는 쉼표(,)로 구분한다. 공백은 하위 선택자.' },
  { cat: 'sel', src: '웹_04 속성 선택자 (s.33)', ask: 'href 속성이 있는 링크만 칠한 선택자는?',
    html: '<p><a href="#">링크 있음</a></p><p><a>href 없음</a></p><p><a href="#">링크 있음</a></p>', css: '[[0]] { background: #bbf7d0; }',
    ans: ['a[href]', '[href]'], wrong: ['a', 'a[target]', 'a:first-child', 'p a'],
    explain: '[속성] = 그 속성을 가진 요소.' },
  { cat: 'sel', src: '웹_04 가상 요소', ask: '각 문단 앞에 빨간 "▶ "를 붙인 선택자는? (content 사용)',
    html: '<p>공지 하나</p><p>공지 둘</p>', css: '[[0]] { content: "▶ "; color: red; }',
    ans: ['p::before', 'p:before'], wrong: ['p::after', 'p::first-letter', 'p:first-child', 'p'],
    explain: '::before = 요소 앞에 content 추가, ::after = 뒤에.' },
  { cat: 'sel', src: '웹_04 가상 클래스 :not()', ask: 'class="note"가 아닌 문단만 칠한 선택자는?',
    html: '<p>일반 문단</p><p class="note">참고 문단</p><p>일반 문단</p>', css: '[[0]] { background: #fde68a; }',
    ans: ['p:not(.note)'], wrong: ['p.note', 'p', '.note', 'p:first-child'],
    explain: ':not() = 특정 요소가 아닐 때.' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '글자색을 빨갛게 바꾼 선언은?',
    html: '<p class="box">빨간 글자</p>', css: '.box { font-size: 18px; [[0]] }',
    ans: ['color: red', 'color: #ff0000', 'color: #f00', 'color: rgb(255, 0, 0)'], wrong: ['background: red', 'border: 2px solid red', 'background-color: pink', 'text-decoration: underline'],
    explain: 'color = 글자색(상속됨), background-color = 배경색(상속 안 됨).' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '글자 크기를 키운 선언은?',
    html: '<p class="box">큰 글자</p>', css: '.box { [[0]] }',
    ans: ['font-size: 28px'], wrong: ['font-size: 10px', 'line-height: 28px', 'font-weight: 700', 'width: 28px'],
    explain: 'font-size 기본값 medium, 상속된다.' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '글자를 박스 오른쪽 끝으로 정렬한 선언은?',
    html: '<p class="box">오른쪽 정렬</p>', css: '.box { border: 2px solid #94a3b8; padding: 8px; [[0]] }',
    ans: ['text-align: right'], wrong: ['text-align: center', 'float: right', 'padding-left: 60px', 'text-align: left'],
    explain: 'text-align = left / center / right / justify.' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '글자 아래에 밑줄을 그은 선언은?',
    html: '<p class="box">밑줄 글자</p>', css: '.box { font-size: 18px; [[0]] }',
    ans: ['text-decoration: underline'], wrong: ['text-decoration: overline', 'text-decoration: line-through', 'border-top: 2px solid', 'font-style: italic'],
    explain: 'underline = 밑줄, overline = 윗줄, line-through = 취소선.' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '글자 위쪽에 줄을 그은 선언은?',
    html: '<p class="box">윗줄 글자</p>', css: '.box { font-size: 18px; margin-top: 12px; [[0]] }',
    ans: ['text-decoration: overline'], wrong: ['text-decoration: underline', 'text-decoration: line-through', 'text-decoration: none', 'font-weight: bold'],
    explain: 'overline = 글자 위쪽 줄.' },
  { cat: 'text', src: '웹_04 텍스트 꾸미기', ask: '모든 글자 폭이 같은 고정폭 글꼴로 바꾼 선언은?',
    html: '<p class="box">iiii WWWW 1234</p>', css: '.box { font-size: 18px; [[0]] }',
    ans: ['font-family: monospace'], wrong: ['font-style: italic', 'font-variant: small-caps', 'font-weight: 700', 'letter-spacing: 4px'],
    explain: 'font-family는 쉼표로 여러 글꼴을 쓰고, 상속된다.' },
  { cat: 'text', src: '웹_04 색상 rgba (s.59)', ask: '글자는 그대로 두고 배경만 연한 반투명 빨강으로 만든 선언은?',
    html: '<div class="box">배경만 반투명</div>', css: '.box { padding: 14px; font-weight: 700; [[0]] }',
    ans: ['background-color: rgba(255, 0, 0, 0.3)', 'background: rgba(255, 0, 0, 0.3)', 'background-color: rgba(255,0,0,0.3)', 'background: rgba(255,0,0,0.3)'], wrong: ['background-color: rgba(255, 0, 0, 1)', 'opacity: 0.3', 'color: rgba(255, 0, 0, 0.3)', 'background-color: rgba(255, 0, 0, 0)'],
    explain: 'rgba 알파 1 = 불투명, 0 = 완전 투명. opacity는 글자까지 함께 흐려진다.' },
  { cat: 'text', src: '웹_04 font 단축 (s.65)', ask: '글자를 기울이고 굵게, 20px 세리프 글꼴로 한 번에 바꾼 선언은?',
    html: '<p class="box">Font Shorthand</p>', css: '.box { [[0]] }',
    ans: ['font: italic bold 20px serif', 'font: italic 700 20px serif'], wrong: ['font: bold 20px serif', 'font: italic 20px serif', 'font: 20px serif', 'font-style: italic'],
    explain: 'font 단축: style variant weight size/line-height family 순서, size·family 필수.' },
  { cat: 'box', src: '웹_05 border', ask: '박스에 빨간 실선 테두리를 준 선언은?',
    html: '<div class="box">테두리</div>', css: '.box { width: 160px; padding: 10px; [[0]] }',
    ans: ['border: 3px solid red', 'border: solid 3px red', 'border: red 3px solid'], wrong: ['border: 3px dashed red', 'border-color: red', 'background: red', 'border: 3px dotted red'],
    explain: 'border 단축은 순서 상관없음. border-color만 주면 style이 none이라 안 보인다.' },
  { cat: 'box', src: '웹_05 border', ask: '박스 아래쪽에만 선을 그은 선언은?',
    html: '<div class="box">아래쪽 선</div>', css: '.box { width: 160px; padding: 10px; [[0]] }',
    ans: ['border-bottom: 3px solid #333'], wrong: ['border-top: 3px solid #333', 'border: 3px solid #333', 'border-left: 3px solid #333', 'text-decoration: underline'],
    explain: 'border-bottom / top / left / right로 방향별 테두리.' },
  { cat: 'box', src: '웹_05 border-radius', ask: '박스 모서리만 살짝 둥글게 만든 선언은? (원이 아님)',
    html: '<div class="box">둥근 모서리</div>', css: '.box { width: 160px; height: 60px; padding: 10px; background: #c7d2fe; [[0]] }',
    ans: ['border-radius: 12px'], wrong: ['border-radius: 50%', 'border: 12px solid #c7d2fe', 'border-radius: 0', 'padding: 12px'],
    explain: 'border-radius = 모서리 반경, 50%면 원(정사각형일 때).' },
  { cat: 'box', src: '웹_05 margin', ask: '테두리 박스가 바깥 여백만큼 안쪽(오른쪽·아래)으로 밀려난 선언은? (박스 크기는 그대로)',
    html: '<div class="box">바깥 여백</div>', css: 'body { background: #f1f5f9; }\n.box { width: 160px; padding: 6px; border: 3px solid #475569; background: white; [[0]] }',
    ans: ['margin: 30px'], wrong: ['padding: 30px', 'border-width: 30px', 'width: 220px', 'margin: 0'],
    explain: 'margin = 바깥 여백(박스 위치가 이동), padding = 안쪽 여백(박스가 커짐).' },
  { cat: 'box', src: '웹_05 margin', ask: '박스를 왼쪽에서만 50px 띄운 선언은?',
    html: '<div class="box">왼쪽 여백</div>', css: '.box { width: 160px; border: 3px solid #475569; [[0]] }',
    ans: ['margin-left: 50px', 'margin: 0 0 0 50px'], wrong: ['padding-left: 50px', 'margin-right: 50px', 'left: 50px', 'margin-top: 50px'],
    explain: 'margin-left = 왼쪽 바깥 여백. static 요소에 left는 무시된다.' },
  { cat: 'box', src: '웹_05 width', ask: '박스 너비를 부모 너비의 절반으로 만든 선언은?',
    html: '<div class="box">부모의 절반</div>', css: '.box { background: #bbf7d0; border: 2px solid #475569; [[0]] }',
    ans: ['width: 50%'], wrong: ['width: 50px', 'height: 50%', 'min-width: 50%', 'margin: 50%'],
    explain: 'width 백분율은 부모 기준.' },
  { cat: 'box', src: '웹_05 box-sizing (s.8)', ask: 'width 300px인 박스가 padding·border만큼 파란 막대(300px)보다 넓어진 선언은?',
    html: '<div class="box">박스</div><div class="ruler"></div>', css: '* { box-sizing: border-box; }\n.box { width: 300px; padding: 20px; border: 10px solid #333; background: #fde68a; [[0]] }\n.ruler { width: 300px; height: 6px; background: #4f46e5; margin-top: 4px; }',
    ans: ['box-sizing: content-box'], wrong: ['box-sizing: border-box', 'padding: 0', 'width: 240px', 'border: 0'],
    explain: 'content-box면 width = content라 실제 너비 = 300 + 40 + 20 = 360px.' },
  { cat: 'box', src: '웹_05 background', ask: '박스에 그림을 배경으로 깐 선언은?',
    html: '<div class="box">배경 그림</div>', css: '.box { width: 260px; height: 110px; border: 2px solid #475569; background-size: cover; [[0]] }',
    ans: ['background-image: url(img/main.jpg)', 'background-image: url("img/main.jpg")', "background-image: url('img/main.jpg')"], wrong: ['background-color: green', 'background-size: contain', 'background: none', 'border-image: none'],
    explain: 'background-image: url(경로).' },
  { cat: 'box', src: '웹_05 background', ask: '작은 배경 그림이 반복되지 않고 한 번만 보이게 한 선언은?',
    html: '<div class="box"></div>', css: '.box { width: 260px; height: 110px; border: 2px solid #475569; background-image: url(img/main.jpg); background-size: 70px; [[0]] }',
    ans: ['background-repeat: no-repeat'], wrong: ['background-repeat: repeat', 'background-size: cover', 'background-attachment: fixed', 'background-repeat: repeat-x'],
    explain: 'background-repeat로 반복 여부·방향(repeat-x, repeat-y)을 정한다.' },
  { cat: 'layout', src: '웹_05 display', ask: '각자 한 줄씩 차지하던 div들이 한 줄에 이어 붙고 너비 지정이 무시된 선언은?',
    html: '<div class="box">A</div><div class="box">B</div><div class="box">C</div>', css: '.box { width: 120px; ' + WQ_BOX + ' [[0]] }',
    ans: ['display: inline'], wrong: ['display: inline-block', 'display: block', 'float: left', 'display: none'],
    explain: 'inline에는 width·height, 상하 margin이 적용되지 않는다. inline-block이면 너비가 유지된다.' },
  { cat: 'layout', src: '웹_05 display', ask: 'span 박스들이 한 줄에 나란히 있으면서 너비 100px · 높이 50px도 적용된 선언은?',
    html: '<span class="box">A</span><span class="box">B</span><span class="box">C</span>', css: '.box { width: 100px; height: 50px; ' + WQ_BOX + ' [[0]] }',
    ans: ['display: inline-block'], wrong: ['display: inline', 'display: block', 'display: none', 'visibility: hidden'],
    explain: 'inline-block = 인라인 배치 + 블록의 너비·높이.' },
  { cat: 'layout', src: '웹_05 float', ask: '사진 박스가 왼쪽에 떠서 글이 오른쪽으로 감싸 흐르게 된 선언은?',
    html: '<div class="pic">사진</div><p>float을 지정한 요소는 문서 흐름에서 벗어나 한쪽에 뜨고, 다른 글이 그 옆을 감싸며 흐릅니다. 이미지와 텍스트를 함께 배치할 때 씁니다.</p>', css: '.pic { width: 90px; height: 70px; background: #fde68a; border: 2px solid #475569; margin-right: 8px; [[0]] }',
    ans: ['float: left'], wrong: ['float: right', 'clear: both', 'display: inline', 'position: absolute'],
    explain: 'float: left | right.' },
  { cat: 'layout', src: '웹_05 clear (s.37)', ask: 'float 박스 옆을 감싸던 "다음 문단"이 float 아래로 내려간 선언은? (다음 문단에 적용)',
    html: '<div class="pic">사진</div><p>사진 옆 글</p><p class="next">다음 문단</p>', css: '.pic { float: left; width: 90px; height: 80px; background: #fde68a; border: 2px solid #475569; margin-right: 8px; }\n.next { background: #c7d2fe; [[0]] }',
    ans: ['clear: both', 'clear: left'], wrong: ['clear: right', 'float: none', 'display: block', 'float: left'],
    explain: 'clear = float 무효화. clearfix는 ::after { content:""; display:block; clear:both; }' },
  { cat: 'layout', src: '웹_05 position (s.50, 54)', ask: '오른쪽 아래(right: 0; bottom: 0) absolute 배지가 화면이 아닌 카드 모서리에 붙게 한 선언은? (카드에 적용)',
    html: '<div class="card">카드<span class="badge">NEW</span></div>', css: '.card { width: 200px; height: 80px; margin: 10px; border: 2px solid #475569; [[0]] }\n.badge { position: absolute; right: 0; bottom: 0; background: crimson; color: white; padding: 2px 6px; }',
    ans: ['position: relative'], wrong: ['position: static', 'float: right', 'display: flex', 'z-index: 1'],
    explain: '부모 relative + 자식 absolute → 자식이 부모 기준으로 위치.' },
  { cat: 'layout', src: '웹_05 overflow', ask: '박스 밖으로 넘친 글자를 잘라 숨긴 선언은?',
    html: '<div class="box">이 박스는 높이가 40px밖에 안 되는데 들어갈 글이 너무 많아서 아래로 넘칩니다. 넘친 부분은 어떻게 될까요?</div>', css: '.box { width: 200px; height: 40px; border: 2px solid #475569; [[0]] }',
    ans: ['overflow: hidden'], wrong: ['display: none', 'visibility: hidden', 'height: auto', 'white-space: nowrap'],
    explain: 'overflow: hidden = 넘치는 부분 숨김(사진 확대 실습에도 사용).' },
  { cat: 'layout', src: '웹_06 긴 텍스트 (s.14)', ask: '한 줄로 넘치던 긴 제목 끝이 "…"로 바뀐 선언은? (overflow: hidden · white-space: nowrap은 이미 있음)',
    html: '<div class="box">아주 아주 긴 게시판 제목이 한 줄에 다 들어가지 않습니다</div>', css: '.box { width: 200px; border: 2px solid #475569; overflow: hidden; white-space: nowrap; [[0]] }',
    ans: ['text-overflow: ellipsis'], wrong: ['overflow: hidden', 'word-break: break-all', 'display: none', 'text-align: center'],
    explain: 'text-overflow: ellipsis는 overflow: hidden과 함께 써야 한다.' },
  { cat: 'layout', src: '웹_06 긴 텍스트 (s.14)', ask: '박스를 뚫고 나가던 긴 영문 주소가 박스 너비에 맞춰 줄바꿈된 선언은?',
    html: '<div class="box">https://www.example.com/very/long/path/without/any/spaces/index.html</div>', css: '.box { width: 180px; border: 2px solid #475569; [[0]] }',
    ans: ['word-break: break-all'], wrong: ['white-space: nowrap', 'overflow: hidden', 'text-overflow: ellipsis', 'text-align: justify'],
    explain: 'word-break: break-all = 블록 가로 크기에 맞춰 줄바꿈.' },
  { cat: 'flex', src: '웹_06 align-items', ask: '컨테이너 높이까지 늘어나 있던 아이템들이 내용 높이만큼만 위쪽에 붙은 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; height: 140px; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['align-items: flex-start', 'align-items: start'], wrong: ['align-items: stretch', 'align-items: flex-end', 'justify-content: flex-start', 'flex-direction: column'],
    explain: 'align-items 기본값 stretch → flex-start면 교차축 시작에 붙고 내용 높이만큼.' },
  { cat: 'flex', src: '웹_06 align-items', ask: '세로 가운데 있던 아이템들이 컨테이너 높이 끝까지 늘어난 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; height: 140px; border: 2px dashed #94a3b8; align-items: center; [[0]] }',
    ans: ['align-items: stretch'], wrong: ['align-items: center', 'justify-content: stretch', 'flex-grow: 1', 'align-items: flex-end'],
    explain: 'stretch(기본값)면 교차축 끝까지 늘어난다.' },
  { cat: 'flex', src: '웹_06 justify-content', ask: '각 아이템 양옆에 같은 여백이 생겨 양끝 여백이 사이 간격의 절반이 된 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['justify-content: space-around'], wrong: ['justify-content: space-between', 'justify-content: space-evenly', 'justify-content: center', 'align-items: center'],
    explain: 'space-around = 아이템 둘레 균등(양끝은 절반).' },
  { cat: 'flex', src: '웹_06 flex-direction', ask: '아이템이 아래에서 위로 3 2 1 순서로 쌓인 선언은?',
    html: '<div class="row"><div class="box">1</div><div class="box">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; [[0]] }',
    ans: ['flex-direction: column-reverse'], wrong: ['flex-direction: column', 'flex-direction: row-reverse', 'flex-wrap: wrap-reverse', 'order: -1'],
    explain: 'column-reverse = 세로 방향 + 순서 반대.' },
  { cat: 'flex', src: '웹_06 flex-wrap', ask: '넘친 아이템이 아래가 아니라 위쪽 줄로 올라가며 줄바꿈된 선언은?',
    html: '<div class="row"><div class="box i">1</div><div class="box i">2</div><div class="box i">3</div><div class="box i">4</div><div class="box i">5</div></div>', css: TQ_BOXES + '\n.row { display: flex; width: 300px; border: 2px dashed #94a3b8; [[0]] }\n.i { flex-basis: 70px; flex-shrink: 0; }',
    ans: ['flex-wrap: wrap-reverse'], wrong: ['flex-wrap: wrap', 'flex-wrap: nowrap', 'flex-direction: column-reverse', 'flex-direction: row-reverse'],
    explain: 'nowrap(기본) / wrap / wrap-reverse.' },
  { cat: 'flex', src: '웹_06 flex-basis', ask: '2번 아이템의 기본 너비를 컨테이너의 절반으로 만든 선언은? (2번에 적용)',
    html: '<div class="row"><div class="box">1</div><div class="box b">2</div><div class="box">3</div></div>', css: TQ_BOXES + '\n.row { display: flex; border: 2px dashed #94a3b8; }\n.b { background: #fca5a5; [[0]] }',
    ans: ['flex-basis: 50%'], wrong: ['flex-basis: 50px', 'order: 2', 'flex-shrink: 0', 'height: 50%'],
    explain: 'flex-basis = 아이템 기본 크기(row면 너비), 반응형엔 % 권장.' },
  { cat: 'flex', src: '웹_06 inline-flex', ask: '가로로 꽉 차던 flex 컨테이너(점선)가 내용 크기만큼 줄어 글자 옆에 붙은 선언은?',
    html: '앞 글자 <div class="row"><div class="box">1</div><div class="box">2</div></div> 뒤 글자', css: TQ_BOXES + '\n.row { border: 2px dashed #94a3b8; [[0]] }',
    ans: ['display: inline-flex'], wrong: ['display: flex', 'display: inline', 'display: block', 'display: inline-block'],
    explain: 'flex는 아이템을 inline처럼, inline-flex는 컨테이너 자체를 inline으로.' },
  { cat: 'flex', src: '웹_06 align-content (s.20)', ask: 'wrap으로 2줄이 된 아이템 줄들이 컨테이너 세로 가운데로 모인 선언은?',
    html: '<div class="row"><div class="box i">1</div><div class="box i">2</div><div class="box i">3</div><div class="box i">4</div><div class="box i">5</div></div>', css: TQ_BOXES + '\n.row { display: flex; flex-wrap: wrap; width: 260px; height: 170px; border: 2px dashed #94a3b8; [[0]] }\n.i { flex-basis: 70px; }',
    ans: ['align-content: center'], wrong: ['align-items: center', 'justify-content: center', 'align-content: stretch', 'align-content: flex-end'],
    explain: 'align-content = 여러 줄일 때 줄 배치. align-items는 각 줄 안에서의 정렬.' },
  { cat: 'anim', src: '웹_07 transform', ask: '박스를 가로·세로 모두 절반 크기로 줄인 선언은? (옆 박스는 그대로)',
    html: '<div class="box">A</div><div class="box s">B</div><div class="box">C</div>', css: '.box { display: inline-block; width: 60px; height: 50px; margin: 20px 6px; background: #c7d2fe; border: 2px solid #475569; }\n.s { background: salmon; [[0]] }',
    ans: ['transform: scale(0.5)', 'transform: scale(.5)', 'transform: scale(0.5, 0.5)'], wrong: ['transform: scale(2)', 'transform: scaleX(0.5)', 'width: 30px', 'transform: rotate(50deg)'],
    explain: 'scale(n) = 가로·세로 모두 n배.' },
  { cat: 'anim', src: '웹_07 transform', ask: '글자가 거꾸로 뒤집혀 보이게 박스를 반 바퀴 돌린 선언은?',
    html: '<div class="box">거꾸로</div>', css: '.box { width: 100px; padding: 10px; margin: 30px; background: salmon; [[0]] }',
    ans: ['transform: rotate(180deg)', 'transform: rotate(-180deg)'], wrong: ['transform: rotate(90deg)', 'transform: scaleX(-1)', 'transform: skewY(180deg)', 'transform: rotate(45deg)'],
    explain: 'rotate(180deg) = 반 바퀴.' },
  { cat: 'anim', src: '웹_07 transform', ask: '박스를 오른쪽으로 50px, 아래로 30px 동시에 옮긴 선언은? (아래 박스 위치는 그대로)',
    html: '<div class="box m">이동</div><div class="box">아래</div>', css: '.box { width: 90px; height: 36px; margin: 6px; background: #c7d2fe; border: 2px solid #475569; }\n.m { background: salmon; [[0]] }',
    ans: ['transform: translate(50px, 30px)', 'transform: translate(50px,30px)', 'transform: translateX(50px) translateY(30px)'], wrong: ['transform: translate(30px, 50px)', 'transform: translateX(50px)', 'margin-left: 50px', 'transform: scale(1.5)'],
    explain: 'translate(x, y). 여러 메서드를 공백으로 나열할 수도 있다.' },
  { cat: 'anim', src: '웹_07 transform', ask: '박스를 세로로만 2배 늘린 선언은?',
    html: '<div class="box">B</div>', css: '.box { width: 80px; height: 30px; margin: 40px; background: salmon; [[0]] }',
    ans: ['transform: scaleY(2)', 'transform: scale(1, 2)'], wrong: ['transform: scaleX(2)', 'transform: scale(2)', 'height: 60px', 'transform: translateY(2px)'],
    explain: 'scaleY = 세로 배율.' },
  { cat: 'anim', src: '웹_07 transform', ask: '가로로 긴 막대를 세로로 세운(90도 회전) 선언은?',
    html: '<div class="box">막대</div>', css: '.box { width: 120px; height: 30px; margin: 60px 20px; background: salmon; text-align: center; [[0]] }',
    ans: ['transform: rotate(90deg)', 'transform: rotate(-90deg)', 'transform: rotate(270deg)'], wrong: ['transform: rotate(45deg)', 'transform: rotate(180deg)', 'transform: skewX(90deg)', 'transform: scaleY(4)'],
    explain: 'rotate(90deg) = 직각 회전.' },
  { cat: 'anim', src: '웹_07 transform', ask: '가운데 박스만 위로 20px 떠 보이게 한 선언은? (옆 박스는 그대로)',
    html: '<div class="box">A</div><div class="box m">B</div><div class="box">C</div>', css: '.box { display: inline-block; width: 60px; height: 40px; margin: 30px 6px; background: #c7d2fe; border: 2px solid #475569; }\n.m { background: salmon; [[0]] }',
    ans: ['transform: translateY(-20px)', 'transform: translate(0, -20px)', 'transform: translate(0px, -20px)'], wrong: ['transform: translateY(20px)', 'margin-top: -20px', 'transform: scale(1.2)', 'transform: translateX(-20px)'],
    explain: 'translateY 음수 = 위로. Y축은 아래가 +.' },
  { cat: 'anim', src: '웹_07 transform', ask: '박스를 세로 방향으로 비스듬히 기울인 선언은?',
    html: '<div class="box">기울임</div>', css: '.box { width: 120px; height: 50px; margin: 40px 30px; background: salmon; [[0]] }',
    ans: ['transform: skewY(15deg)', 'transform: skew(0, 15deg)', 'transform: skew(0deg, 15deg)'], wrong: ['transform: skewX(15deg)', 'transform: rotate(15deg)', 'transform: scaleY(1.5)', 'font-style: italic'],
    explain: 'skewX = 가로 방향 기울임, skewY = 세로 방향 기울임.' },
  { cat: 'box', src: '웹_05 max-width (s.21)', ask: '부모 너비만큼 꽉 차던 박스가 200px까지만 커지게 된 선언은?',
    html: '<div class="box">최대 너비</div>', css: '.box { width: 100%; background: #bbf7d0; border: 2px solid #475569; [[0]] }',
    ans: ['max-width: 200px'], wrong: ['min-width: 200px', 'max-height: 200px', 'padding-right: 200px', 'width: 100%'],
    explain: 'max-width = 최대 보장 너비(부모가 작으면 줄고, 크면 그 값까지만).' },
];

const TQ_KINDS = {
  htmltag: { items: TQ_HTML, unit: '태그', ph: '예: mark, colspan, checkbox',
    cats: [{ id: 'text', name: '텍스트 태그' }, { id: 'list', name: '목록' }, { id: 'table', name: '표' }, { id: 'media', name: '이미지 · 링크' }, { id: 'form', name: 'form (03)' }],
    norm: v => String(v).trim().toLowerCase().replace(/[\s<>\/'"]/g, '') },
  csspick: { items: TQ_CSS, unit: 'CSS', ph: '예: justify-content: center',
    cats: [{ id: 'sel', name: '선택자 (04)' }, { id: 'text', name: '텍스트 (04)' }, { id: 'box', name: '박스 · 배경 (05)' }, { id: 'layout', name: 'display · position (05)' }, { id: 'flex', name: 'Flexbox (06)' }, { id: 'anim', name: 'transform (07)' }],
    norm: v => String(v).trim().toLowerCase().replace(/\s+/g, '').replace(/;+$/, '').replace(/'/g, '"') },
};

let TQ = null;

function tqDoc(it, v) {
  const fill = s => (s || '').split('[[0]]').join(v).split('img/main.jpg').join(WQ_IMG);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Malgun Gothic',sans-serif;font-size:14px;margin:10px;color:#1e293b}</style><style>${fill(it.css)}</style></head><body>${fill(it.html)}</body></html>`;
}
function tqIsRight(it, v) {
  const K = TQ_KINDS[TQ.kind], n = K.norm(v);
  return n !== '' && it.ans.some(a => K.norm(a) === n);
}

function tqMount(kind) {
  return root => {
    TQ = { kind, cats: new Set(TQ_KINDS[kind].cats.map(c => c.id)), mode: 'choice', shuffle: true, list: [], idx: 0,
      opts: [], pick: -1, input: '', done: false, ok: false, n: 0, right: 0, wrongs: new Set() };
    root.innerHTML = `
      <div class="pr-card">
        <h3 class="pr-h">⚙️ 출제 범위</h3>
        <div class="pr-seg" id="tq-cats"></div>
        <div class="pr-row" style="margin-top:10px;margin-bottom:0">
          <div class="pr-seg" id="tq-mode"></div>
          <label class="pr-chk"><input type="checkbox" checked onchange="TQ.shuffle = this.checked; tqBuild()"> 무작위 순서</label>
          <span class="pr-sub" id="tq-stat"></span>
        </div>
        <div class="pr-sub" style="margin-top:6px">${kind === 'htmltag'
          ? '결과 화면을 보고 그 부분을 만든 <b>태그</b>(또는 속성 · type 값)를 맞히세요. 주관식은 꺾쇠 없이 태그 이름만 써도 됩니다.'
          : '<b>기본</b>과 <b>적용 후</b> 화면을 비교해 어떤 <b>CSS 선언</b>(속성: 값) 또는 <b>선택자</b>를 썼는지 맞히세요. 대소문자 · 공백 · 끝의 세미콜론은 채점에서 무시합니다.'}
          답한 뒤에는 보기마다 결과 화면을 보여 줍니다. 객관식은 숫자 키(단축키 설정), 다음 문제는 Enter.</div>
      </div>
      <div id="tq-main"></div>`;
    tqRenderTop();
    tqBuild();
  };
}
function tqRenderTop() {
  const K = TQ_KINDS[TQ.kind];
  document.getElementById('tq-cats').innerHTML = K.cats.map(c => `<button class="${TQ.cats.has(c.id) ? 'active' : ''}" onclick="tqToggleCat('${c.id}')">${c.name} <small style="font-weight:500">${K.items.filter(t => t.cat === c.id).length}</small></button>`).join('');
  document.getElementById('tq-mode').innerHTML = [['choice', '객관식'], ['type', '주관식']].map(([m, l]) => `<button class="${TQ.mode === m ? 'active' : ''}" onclick="TQ.mode = '${m}'; tqRenderTop(); tqLoad()">${l}</button>`).join('');
}
function tqToggleCat(id) {
  if (TQ.cats.has(id)) { if (TQ.cats.size > 1) TQ.cats.delete(id); } else TQ.cats.add(id);
  tqRenderTop(); tqBuild();
}
function tqBuild(only) {
  const items = TQ_KINDS[TQ.kind].items;
  const list = only ? [...only] : items.map((t, i) => i).filter(i => TQ.cats.has(items[i].cat));
  if (TQ.shuffle) for (let i = list.length - 1; i > 0; i--) { const j = prRand(0, i); [list[i], list[j]] = [list[j], list[i]]; }
  TQ.list = list; TQ.idx = 0; TQ.n = 0; TQ.right = 0; TQ.wrongs = new Set();
  tqLoad();
}
function tqItem() { return TQ_KINDS[TQ.kind].items[TQ.list[TQ.idx]]; }
function tqLoad() {
  const it = tqItem();
  const wrong = it.wrong.slice();
  for (let i = wrong.length - 1; i > 0; i--) { const j = prRand(0, i); [wrong[i], wrong[j]] = [wrong[j], wrong[i]]; }
  TQ.opts = [it.ans[0], ...wrong.slice(0, 3)];
  for (let i = TQ.opts.length - 1; i > 0; i--) { const j = prRand(0, i); [TQ.opts[i], TQ.opts[j]] = [TQ.opts[j], TQ.opts[i]]; }
  TQ.pick = -1; TQ.input = ''; TQ.done = false; TQ.ok = false;
  tqRender();
  const inp = document.getElementById('tq-input'); if (inp) inp.focus();
}

// 태그 문제(<[[0]]> 자리)면 보기를 <태그>로, 속성 · type 값 문제면 그대로 보여 준다
function tqLabel(it, o) { return TQ.kind === 'htmltag' && /<\/?\[\[0\]\]/.test(it.html) ? '<' + o + '>' : o; }
function tqCode(src, v) {
  return src.split('[[0]]').map(wqEsc).join(`<span class="tq-hl">${wqEsc(v)}</span>`);
}
function tqRender() {
  const it = tqItem(), K = TQ_KINDS[TQ.kind], css = TQ.kind === 'csspick', ans = it.ans[0];
  const cat = K.cats.find(c => c.id === it.cat);
  document.getElementById('tq-stat').textContent = `${TQ.idx + 1} / ${TQ.list.length} · 맞힘 ${TQ.right} / 푼 문제 ${TQ.n}`;
  const optBtn = (o, k) => {
    const cls = TQ.done ? (o === ans ? ' ok' : k === TQ.pick ? ' ng' : '') : '';
    return `<button class="wq-choice${cls}" onclick="tqPick(${k})" ${TQ.done ? 'disabled' : ''}><pre><span class="tq-key">${k + 1}</span>${wqEsc(tqLabel(it, o))}</pre></button>`;
  };
  const end = TQ.idx === TQ.list.length - 1;
  document.getElementById('tq-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">${TQ.done ? (TQ.ok ? '✅' : '❌') : '❓'} ${TQ.idx + 1} / ${TQ.list.length}
        <span class="pr-chip">${cat.name}</span><span class="pr-chip" style="background:#f1f5f9;color:#475569">출처 ${wqEsc(it.src)}</span></h3>
      <div style="font-size:15px;font-weight:700;line-height:1.6;margin-bottom:10px">${wqEsc(it.ask)}</div>
      <div class="wq-previews">
        ${css ? `<div><b class="wq-lbl">기본</b><iframe class="wq-frame" id="tq-base" sandbox=""></iframe></div>` : ''}
        <div><b class="wq-lbl">${css ? '🎯 적용 후' : '🎯 결과 화면'}</b><iframe class="wq-frame" id="tq-target" sandbox=""></iframe></div>
      </div>
      ${TQ.done ? '' : TQ.mode === 'choice'
        ? `<div class="tq-opts">${TQ.opts.map(optBtn).join('')}</div>`
        : `<div class="pr-row"><input class="tq-input" id="tq-input" placeholder="${wqEsc(K.ph)}" value="${wqEsc(TQ.input)}" autocomplete="off" spellcheck="false"
              oninput="TQ.input = this.value" onkeydown="if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); tqSubmit(); }">
            <button class="pr-btn indigo" onclick="tqSubmit()">채점</button>
            <button class="pr-btn ghost" onclick="tqSubmit(true)">모르겠음</button></div>`}
      <div id="tq-feedback"></div>
      <div class="pr-actions">
        <button class="pr-btn ghost" onclick="tqGo(-1)" ${TQ.idx ? '' : 'disabled'}>← 이전</button>
        <button class="pr-btn" onclick="tqGo(1)">${end ? '처음부터 다시' : '다음 문제 →'}</button>
        ${TQ.wrongs.size ? `<button class="pr-btn ghost" onclick="tqBuild(TQ.wrongs)">틀린 ${TQ.wrongs.size}문제 다시 풀기</button>` : ''}
      </div>
    </div>`;
  if (css) document.getElementById('tq-base').srcdoc = tqDoc(it, '');
  document.getElementById('tq-target').srcdoc = tqDoc(it, ans);
  if (TQ.done) tqShowResult();
}
function tqShowResult() {
  const it = tqItem(), css = TQ.kind === 'csspick', ans = it.ans[0];
  const mine = TQ.mode === 'choice' ? (TQ.pick >= 0 ? TQ.opts[TQ.pick] : '') : TQ.input;
  const opts = TQ.mode === 'choice' ? TQ.opts : [ans, ...it.wrong.slice(0, 3)];
  const code = [it.html ? `<b class="wq-lbl">HTML</b><pre class="wq-code">${tqCode(it.html, ans)}</pre>` : '',
    it.css && css ? `<b class="wq-lbl">CSS</b><pre class="wq-code">${tqCode(it.css, ans)}</pre>` : ''].join('');
  const fb = document.getElementById('tq-feedback');
  fb.innerHTML = `<div class="pr-result ${TQ.ok ? 'good' : 'bad'}"><b>${TQ.ok ? '🎉 정답!' : '❌ 오답'}</b>${!TQ.ok && mine.trim() ? ` — 내 답: <code>${wqEsc(mine)}</code>` : ''}
      <br>정답: <code>${wqEsc(ans)}</code>${it.ans.length > 1 ? ` <small>(${it.ans.slice(1).map(wqEsc).join(', ')} 도 정답)</small>` : ''}<br>${wqEsc(it.explain)}</div>
    ${code}
    <b class="wq-lbl">보기별 결과 화면</b>
    <div class="tq-mini">${opts.map((o, k) => `<div><div class="lbl">${o === ans ? '✅' : '❌'} ${wqEsc(tqLabel(it, o))}</div><iframe class="wq-frame" id="tq-opt${k}" sandbox=""></iframe></div>`).join('')}</div>`;
  opts.forEach((o, k) => { document.getElementById('tq-opt' + k).srcdoc = tqDoc(it, o); });
}
function tqFinish(ok) {
  TQ.done = true; TQ.ok = ok; TQ.n++;
  if (ok) { TQ.right++; TQ.wrongs.delete(TQ.list[TQ.idx]); } else TQ.wrongs.add(TQ.list[TQ.idx]);
  tqRender();
}
function tqPick(k) {
  if (TQ.done || k >= TQ.opts.length) return;
  TQ.pick = k;
  tqFinish(TQ.opts[k] === tqItem().ans[0]);
}
function tqSubmit(giveUp) {
  if (TQ.done) return;
  const inp = document.getElementById('tq-input'); if (inp) TQ.input = inp.value;
  if (!giveUp && !TQ.input.trim()) { document.getElementById('tq-feedback').innerHTML = '<div class="pr-result bad">답을 입력하세요.</div>'; return; }
  tqFinish(!giveUp && tqIsRight(tqItem(), TQ.input));
}
function tqGo(d) {
  if (d > 0 && TQ.idx === TQ.list.length - 1) { tqBuild(); window.scrollTo(0, 0); return; }
  TQ.idx = Math.max(0, Math.min(TQ.list.length - 1, TQ.idx + d)); tqLoad(); window.scrollTo(0, 0);
}

// 단축키 훅 (실행기가 연습 화면에서 호출): 객관식 보기 번호 키 · Enter(답한 뒤 다음 문제)
const TQ_KEYS = {
  onKey(act, e) {
    if (!TQ || currentPractice.id !== TQ.kind || TQ.mode !== 'choice' || TQ.done || act[0] !== 'c') return;
    const i = +act.slice(1) - 1;
    if (i < TQ.opts.length) { e.preventDefault(); tqPick(i); }
  },
  onEnter(e) {
    if (!TQ || currentPractice.id !== TQ.kind || !TQ.done) return;
    e.preventDefault(); tqGo(1);
  },
};
registerPractice({
  id: 'htmltag', subject: '웹프로그래밍', icon: '🏷️', title: 'HTML 태그 맞히기',
  desc: '결과 화면을 보고 어떤 태그 · 속성 · input type으로 만들었는지 맞혀 보세요. 객관식 · 주관식, 답한 뒤 보기별 결과 화면 비교 (02~03장)',
  mount: tqMount('htmltag'), ...TQ_KEYS,
});
registerPractice({
  id: 'csspick', subject: '웹프로그래밍', icon: '🎨', title: 'CSS 맞히기',
  desc: '기본 화면과 적용 후 화면을 비교해 어떤 CSS 선언(속성: 값)이나 선택자를 썼는지 맞혀 보세요. 객관식 · 주관식 (04~07장)',
  mount: tqMount('csspick'), ...TQ_KEYS,
});
