# 미디어 컨트롤 & 마이크로 인터랙션

### 개요
비디오/이미지/GIF 자원을 사용자 행동과 섹션 노출 타이밍에 맞춰 전환해 초기 로딩 부담을 줄이고, 터치·마우스 인터랙션에 일관된 피드백을 줍니다. 작은 버튼/로고에도 호버 상태를 별도 에셋으로 제공해 브랜드 무드를 유지합니다.

### 주요 코드
- **비디오 플레이 토글**: 오버레이 버튼(`playBtn`) 클릭 시 재생, 비디오 클릭 시 일시정지/재생을 토글하며 버튼 이미지를 `play/pause`로 교체. `animationend`에서 버튼 페이드를 제어해 반복 깜빡임을 차단.
- **GIF 지연 로딩**: AI 카메라, 미션, 커뮤니티 섹션에서 정지 프리뷰를 먼저 보여주고, `IntersectionObserver` 진입 후 `src = "video/..."`로 교체해 뷰포트 밖에서 불필요한 디코딩을 막음.
- **호버 피드백**: 네비 로고, 탑 버튼은 `mouseover/mouseleave`로 별도 이미지 스와핑(`navLogoHover.png`, `TopHover.png`)을 적용해 조작 가능 상태를 명확히 전달.

```js
playBtn.addEventListener("click", () => {
  video.play();
  playBtn.style.display = "none";
});

video.addEventListener("click", () => {
  const paused = video.paused;
  playBtn.src = paused ? "img/playBtn.png" : "img/pauseBtn.png";
  playBtn.style.display = "block";
  playBtn.classList.add("playBtnAni");
  paused ? video.play() : video.pause();
});

playBtn.addEventListener("animationend", () => {
  playBtn.style.display = "none";
  playBtn.style.opacity = "0.5";
  playBtn.classList.remove("playBtnAni");
});
```

### 기술적 특징
- **미디어 상태 동기화**: 버튼 이미지와 비디오 상태를 동일 토글 함수에서 처리해 UI/재생 상태가 어긋나지 않음.
- **오프스크린 최적화**: 섹션 노출 시점에만 GIF/비디오를 로드해 첫 화면 진입 속도를 확보.
- **브랜드 일관성**: 로고/버튼 호버 에셋을 별도로 제공해 상호작용 전반에서 동일한 톤앤매너를 유지. 
