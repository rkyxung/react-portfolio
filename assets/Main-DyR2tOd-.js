const n=`# 루시 메인 페이지 - index.html, css/style_main.css

## 순수 HTML/CSS로 만든 싱글페이지 인터랙션

자바스크립트 없이 해시(\`:target\`)와 체크박스를 조합해 배너 슬라이더, FAQ 아코디언, 프로필 전환, 모달, 앨범 “더보기”까지 모든 상호작용을 스타일시트만으로 처리했습니다. 하나의 페이지에서 루시 소개·멤버·앨범 정보를 단계적으로 드러내며, 모바일 대응을 위해 주요 레이아웃과 타이포가 미디어쿼리로 조정됩니다.

---

## 배너: 해시 기반 슬라이드 전환

### 개념

\`#banner1~3\` 앵커로 이동하면 대응하는 \`<li>\`만 \`opacity:1\`이 되도록 \`:target\`을 적용해 풀스크린 배너를 넘깁니다. 이미지와 비디오를 섞어 첫 화면에 동적인 인상을 줍니다.

### 구현

\`\`\`css
.banner .list li { position:absolute; opacity:0; }
.banner .list li:first-child { opacity:1; }
.banner .list li:target { opacity:1; }
\`\`\`
- 스크립트 없이 해시 이동만으로 활성 슬라이드를 결정
- \`object-fit:cover\`로 해상도·비율이 달라도 풀프레임 유지

---

## About & FAQ: 체크박스 아코디언

### 개념

숨긴 체크박스와 \`label + .answer\` 구조로 질문별 토글을 구현해, 루시 소개 섹션에서 자주 묻는 질문을 단계적으로 펼칩니다.

### 구현

\`\`\`css
input[id*="FAQ"] { display:none; }
input[id*="FAQ"]+label { background:#0066FF; color:#fff; }
.about_FAQ input+label+.answer { height:0; overflow:hidden; transition:all .3s; }
.about_FAQ input:checked+label+.answer { height:auto; padding:20px; }
\`\`\`
- JS 없이 순수 CSS로 열림/닫힘 처리
- 색상 변화와 패딩으로 상태 전환을 명확히 피드백

---

## 프로필: 앵커로 카드 전환

### 개념

멤버 이름 목록을 클릭하면 해당 카드(\`#yechan\`, \`#sangyeop\` 등)가 \`:target\`되어 보여지고, 기본 플레이스홀더는 감춰집니다.

### 구현

\`\`\`css
.profile_list #yechan, #sangyeop, #wonsang, #kwangil { display:none; }
#yechan:target { display:block; }
#yechan:target ~ #profile_defult { display:none; }
/* 다른 멤버도 동일 패턴 */
\`\`\`
- 링크만으로 상태 전환을 만들어 JS 의존 없이 작동
- 이름/역할 텍스트를 분리해 가독성을 높이고, 프로필 이미지는 앵커로 모달 진입을 연결

---

## 모달: :target으로 띄우는 상세 뷰

### 개념

프로필 이미지 앵커가 \`#modal_*\` 해시로 이동하면 \`:target\`된 \`.modal\`을 \`display:flex\`로 노출, 멤버 상세 정보·슬라이드 이미지·영상 페이지 버튼을 제공합니다. 닫기는 \`&times;\` 앵커로 해시를 초기 상태로 되돌립니다.

### 구현

\`\`\`css
.modal { display:none; position:fixed; inset:0; background:rgba(0,0,0,.9); }
.modal:target { display:flex; }
@keyframes slide { 0%{opacity:0;} 10%{opacity:1;} 40%{opacity:1;} 50%{opacity:0;} }
.modal_content img { animation: slide 12s infinite; }
\`\`\`
- 키프레임 애니메이션으로 모달 안 이미지가 순차적으로 페이드 인/아웃
- 헤더/본문/CTA 버튼을 절대 배치로 분리해 정보와 액션을 한 화면에 배치

---

## 앨범: 그리드 + 더보기 토글

### 개념

앨범 커버는 \`::before\` 배경으로 채우고, 호버 시 블러·보더 강화로 포커스를 줍니다. 체크박스로 \`.hidden_section\`을 접고 펼치며, 레이블 텍스트를 \`Load more/Hide\`로 교체합니다.

### 구현

\`\`\`css
.album_item { width:300px; aspect-ratio:1/1; border:4px solid #fff; }
.album_item::before { background-image:url(...); transition:filter .3s; }
.album_item:hover::before { filter:blur(7px); }
input[type="checkbox"]:checked ~ .hidden_section { display:grid; }
input[type="checkbox"]:checked ~ #album_label::before { content:'Hide'; }
\`\`\`
- 그리드 반복으로 3열 정렬, 추가 앨범은 동일 스타일을 재사용
- 발매 정보는 \`:hover::after\`에 날짜/타이틀을 넣어 텍스트 자산 없이 CSS만으로 노출

---

## 성능·호환성 포인트

- 모든 인터랙션이 해시/체크박스 기반이라 JS 없이 동작, 레거시 브라우저에서도 기본 경험 유지.
- 비디오 배너는 \`muted autoplay loop playsinline\`으로 모바일 자동 재생을 지원, \`object-fit\`으로 비율 유지.`;export{n as default};
