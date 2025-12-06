const n=`# 섹션 인터랙션 & 애니메이션 시퀀스

### 개요
\`IntersectionObserver\` 하나로 전 섹션의 등장 타이밍과 애니메이션 체인을 관리합니다. 각 섹션별로 \`animationend\` 콜백을 연결해 텍스트 → 이미지 → GIF 순서로 자연스럽게 전환되며, GIF(비디오) 전환 시점을 뷰포트 진입 후로 늦춰 퍼포먼스를 챙깁니다.

### 주요 코드
- **관찰 설정**: \`.section\`을 대상으로 \`threshold: 0.5\`로 등록. 50% 이상 보이면 섹션별 진입 로직 실행.
- **지연 로딩형 시퀀스**: 섹션마다 \`classList.add()\`로 등장 클래스를 적용한 뒤, \`animationend\` 이벤트를 다음 단계 트리거로 사용. 예) 온보딩 → 라인 드로잉 → 텍스트 → 목업 → GIF 재생.
- **GIF/비디오 지연 전환**: AI 카메라, 미션, 커뮤니티 등에서 이미지 프리뷰를 먼저 보여주고, 섹션 노출 후 \`src = "video/..."\`로 교체해 초기 로딩 부담을 최소화.
- **순차 스토리텔링**: 설문 → 인사이트 → 타겟 → UX 플로우 → 디자인 시스템 → 기능(홈/AI/미션/커뮤니티/마이페이지) 순으로 애니메이션을 이어붙여 브랜드 스토리를 스크롤과 연동.

\`\`\`js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    if (entry.target.classList.contains("onlineServey")) {
      servey.classList.add("show");
      serveyInsight.style.opacity = "0";
      setTimeout(() => serveyInsight.classList.add("opacity"), 500);
    }

    if (entry.target.id === "onboardingLine") {
      onboardingLineScreen.classList.add("onboardingLine");
      onboarding.addEventListener("animationend", () => {
        onboardingTxt.classList.add("symbolSloganShow");
      });
    }

    if (entry.target.id === "missionCenter") {
      missionImg02.classList.add("show");
      missionImg02.addEventListener("animationend", () => {
        missionImg02.src = "video/mission02.gif";
      });
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".section").forEach(el => observer.observe(el));
\`\`\`

### 기술적 특징
- **단일 옵저버, 분기 처리**: 퍼포먼스에 유리한 단일 옵저버로 관리하면서, \`id\`/\`classList\`로 각 섹션 로직을 분기해 유지보수성을 확보.
- **콜백 체인으로 리듬감 제어**: \`animationend\`에 의존해 다음 요소를 노출함으로써 섹션 내에서도 단계별 타이밍을 일관되게 맞춤.
- **미디어 부담 최소화**: GIF/비디오 교체 시점을 실제 뷰포트 진입 후로 늦춰 초기 로딩 시간을 줄이고, 사용자 행동과 맞춘 시각적 피드백을 제공.
`;export{n as default};
