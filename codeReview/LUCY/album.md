# 앨범 소개 페이지 - album.html / css/style_album.css

## 개요

EP `FROM.`의 커버·레코드 연출, 즐겨찾기 토글, 트랙 리스트와 미니 플레이어를 한 화면에 묶은 단일 페이지입니다. 체크박스와 `:hover`만으로 상호작용을 구현해 JS 의존을 최소화했습니다.

---

## 핵심 연출

### 개념

정지된 커버(정사각)와 회전하는 레코드(원)를 레이어링해 피지컬 앨범을 들여다보는 듯한 비주얼을 제공합니다. 트랙은 리스트 형태지만 각 항목에 오디오 컨트롤을 숨겨 둬 즉시 미리듣기가 가능합니다.

### 구현

```css
.cover { width:500px; height:500px; background-image:url(../image/album01.png); border:10px solid #fff; }
.record { width:450px; height:450px; background-image:url(../image/CD.png); animation: rotateRecord 6s linear infinite; }
@keyframes rotateRecord { 0%{ transform: translateX(50%) rotate(0deg);} 100%{ transform: translateX(50%) rotate(360deg);} }
```
- 커버/레코드를 절대 배치로 겹쳐 깊이감을 연출
- `box-shadow`로 부유감을 추가, `translateX`로 살짝 비껴 놓아 입체감 강화

---

## 트랙 리스트 & 즐겨찾기

### 구현

```html
<input type="checkbox" id="favorite" class="favorite-checkbox">
<label for="favorite" class="favorite"></label>
...
<div class="track" id="track01">
  <a href="album_track.html">TRACK 1. 빌런 (Title)</a>
  <audio class="track_audio" controls loop>...</audio>
  <button class="play-pause"></button>
</div>
```
- 하트는 체크박스+배경 이미지로 토글(`heart01 → heart02`), 상태 저장 없이 즉시 시각 피드백
- 트랙 항목 호버 시 배경·텍스트 색 반전, 링크와 오디오 컨트롤을 분리해 클릭 영역 명확화
- 오디오 컨트롤은 절대 배치로 보이지 않게 두고, 커스텀 재생 버튼(`::before` ▶)으로 미니 플레이어 느낌을 제공

---

## 스타일/레이아웃 포인트

- 80% 컨테이너 폭에 좌측 비주얼, 우측 플레이리스트 2컬럼 배치로 균형 잡힌 뷰.
- 헤더·푸터를 메인과 동일하게 고정 스타일로 재사용해 일관된 브랜드 톤 유지.
- `box-shadow`와 `border` 대비를 사용해 화이트 배경에서도 커버가 선명히 보이도록 처리.
