const n=`# 트랙 상세 페이지 - album_track.html / css/style_album_track.css

## 개요

타이틀 트랙 \`빌런\`에 집중한 상세 뷰입니다. 메인 앨범 페이지의 비주얼(커버+회전 레코드)과 네비게이션을 그대로 가져오되, 설명과 뮤직비디오 임베드에 화면을 할애해 “한 곡 집중” 레이아웃을 구성했습니다.

---

## 핵심 구성

### 개념

앨범 정보는 최소화하고 트랙 스토리텔링과 영상 감상에 집중합니다. 상단 고정 헤더로 글로벌 네비게이션을 유지하고, 좌측 비주얼/우측 텍스트의 2단 레이아웃 뒤에 전체폭 MV 임베드를 배치합니다.

### 구현

\`\`\`html
<div class="album-art">
  <div class="cover"></div>
  <div class="record"></div>
</div>
<div class="playlist">
  <div class="header">
    <div class="title">FROM. - TRACK 1. 빌런</div>
    <input type="checkbox" id="favorite" class="favorite-checkbox">
    <label for="favorite" class="favorite"></label>
  </div>
  <div class="description">...</div>
</div>
...
<iframe id="MV" src="https://www.youtube.com/embed/K25eYCAXknQ..."></iframe>
\`\`\`
- 즐겨찾기 하트는 앨범 페이지와 동일한 체크박스 토글 패턴으로 일관성 유지.
- 커버/레코드 애니메이션을 재사용해 트랙 상세에서도 브랜드 룩을 이어감.
- MV는 별도 섹션으로 분리해 뷰포트 폭을 가득 쓰도록 배치.

---

## 스타일 포인트

- 상단 \`back_btn\`으로 앨범 리스트로 복귀 동선을 제공.
- 설명 영역은 여백과 라인 길이를 넉넉히 잡아 긴 카피도 읽기 부담을 줄임.
- 헤더·푸터는 공통 UI를 공유해 페이지 전환 시 톤앤매너 변동을 최소화.`;export{n as default};
