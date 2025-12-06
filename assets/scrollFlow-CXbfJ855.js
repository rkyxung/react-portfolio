const n=`# 스피클 랜딩 흐름

### 개요
랜딩 페이지를 \`scroll-wrapper\` 기반으로 설계해, 헤더/네비게이션, 탑 버튼, 메인 배너 인터랙션을 하나의 흐름으로 묶었습니다. 네비 클릭, 스크롤 위치, 배너 애니메이션 상태에 따라 UI가 자연스럽게 전환되도록 제어합니다.

### 핵심 구조
- **네비게이션 앵커**: \`nav01~04\` 클릭 시 \`scrollIntoView\` 또는 스크롤 좌표 계산으로 섹션별 부드러운 이동을 보장. 헤더가 가려지지 않도록 \`getBoundingClientRect().top + window.scrollY - 50\` 오프셋을 적용.
- **헤더 시야 제어**: \`scroll-wrapper\` 스크롤량을 메인 배너 높이의 1/2 지점과 비교해 헤더 \`opacity\`/\`pointerEvents\`를 토글. 배너 감상 구간에서는 헤더를 숨겨 몰입도를 높이고, 상단에선 즉시 복귀.
- **탑 버튼 이중 스크롤 처리**: 현재 뷰가 \`scroll-wrapper\` 밖이면 먼저 윈도우 스크롤로 래퍼 시작점으로 이동 후, 약간의 지연을 두고 래퍼 내부 스크롤을 0으로 이동. 래퍼 안에 있을 땐 내부 스크롤만 처리해 중복 점프를 방지.
- **메인 배너 엔트리 애니메이션**: \`animationend\` 콜백에서 목업/배지 투명도를 1로 올리고, 각기 다른 \`UpDown\`/\`MockUp\` 키프레임을 적용해 상시 부유감을 부여.

### 대표 코드
\`\`\`js
scrollWrapper.addEventListener("scroll", () => {
  const scrollY = scrollWrapper.scrollTop;
  const hidePoint = mainBanner.offsetHeight / 2;
  header.style.opacity = scrollY >= hidePoint ? "0" : "1";
  header.style.pointerEvents = scrollY >= hidePoint ? "none" : "auto";
});

topBtn.addEventListener("click", () => {
  const wrapperTop = scrollWrapper.getBoundingClientRect().top;
  if (wrapperTop < 0) {
    window.scrollTo({ top: scrollWrapper.offsetTop, behavior: "smooth" });
    setTimeout(() => scrollWrapper.scrollTo({ top: 0, behavior: "smooth" }), 500);
  } else {
    scrollWrapper.scrollTo({ top: 0, behavior: "smooth" });
  }
});
\`\`\`

### 흐름 요약
1. \`DOMContentLoaded\` → \`main()\` 실행 후 네비/버튼 리스너 등록
2. 래퍼 스크롤 시 헤더 투명도 토글, 탑 버튼은 래퍼/윈도우 위치에 맞춰 안전하게 이동
3. 메인 배너 애니메이션 완료 신호 후 목업/배지를 부유 애니메이션으로 전환해 시각적 완성도 확보
`;export{n as default};
