# 멤버별 직캠 갤러리 - yechan.html 외 / css/style_video.css

## 개요

네 멤버(예찬·상엽·원상·광일)의 직캠 영상을 페이지별로 제공하는 템플릿입니다. 썸네일을 누르면 동일 페이지 내 앵커 이동으로 대상 `<iframe>`만 노출시키고, 기본 배경엔 멤버별 키 비주얼과 안내 텍스트를 배치했습니다. 모든 상호작용은 해시(`:target`)만으로 동작해 JS가 필요 없습니다.

---

## 썸네일 → 영상 전환

### 개념

썸네일은 단순 앵커 링크이며, 클릭 시 URL 해시가 `#video01~04`로 변하면서 매칭되는 `<iframe>`만 `display:block`으로 전환됩니다. 선택하지 않은 상태에서는 배경 이미지와 메시지가 자리합니다.

### 구현

```html
<div class="image">
  <a href="#video01"><img src="image/yechanvideo01.png" alt="직캠01"></a>
  ...
</div>
<div class="video" id="yechan">
  <iframe id="video01" src="..."></iframe>
  ...
  <div class="defult"><p id="text01">Enjoy Shin Yechan's</p><p id="text02">stage performance!</p></div>
</div>
```
```css
.video iframe { display:none; width:100%; height:100%; }
.video iframe:target { display:block; }
#video01:target ~ .defult { display:none; }
```
- `:target`만으로 프레임 전환을 제어, 스크립트 불필요
- 배경(`.video`의 `background-image`)을 멤버별로 변경해 페이지 정체성을 부여

---

## UI/연출 포인트

- 썸네일 호버 시 보더 확장과 스케일 업으로 선택 가능성을 강조.
- 기본 문구는 배경 위에 위치한 두 줄 텍스트로, 영상 선택 시만 사라져 명확한 상태 변화를 제공.
- 헤더/푸터는 메인과 동일한 네비게이션/브랜드 요소를 재사용해 사이트 일관성을 유지.