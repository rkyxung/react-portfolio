const n=`# Navigation\r
\r
## 개요\r
\r
Pivot 프로젝트의 **네비게이션 컴포넌트**로 상단에 고정되어 있습니다. GSAP 애니메이션과 복잡한 상태 관리를 결합해 프로페셔널한 인터랙션을 구현했습니다. 두 개의 독립적인 탭 바(Tab Switcher와 Nav)를 동시에 관리하고, 동적 마커 애니메이션으로 현재 선택 상태를 시각화합니다.\r
\r
## 주요 구현 내용\r
\r
### 1. 이중 상태 관리: Tab Switcher와 Nav 메뉴\r
\r
\`\`\`jsx\r
// Tab_Switcher 상태\r
const [activeTab, setActiveTab] = useState("none");\r
const [hoveredTab, setHoveredTab] = useState(null);\r
const containerRef = useRef(null);\r
const markerRef = useRef(null);\r
const tabRefs = useRef({});\r
\r
// .nav 상태\r
const [activeNavTab, setActiveNavTab] = useState(null);\r
const [hoveredNavTab, setHoveredNavTab] = useState(null);\r
const navContainerRef = useRef(null);\r
const navMarkerRef = useRef(null);\r
const navTabRefs = useRef({});\r
\r
const [isToggled, setIsToggled] = useState(false);\r
\r
const highlightTarget = activeTab !== "none" ? activeTab : hoveredTab;\r
const highlightNavTarget = activeNavTab !== null ? activeNavTab : hoveredNavTab;\r
\`\`\`\r
\r
네비게이션은 **두 개의 독립적인 탭 바**를 관리합니다:\r
- **Tab Switcher**: "GET FEVER"와 "GO PIVOT" 선택용\r
- **Nav 메뉴**: "Project", "Student", 햄버거 아이콘용\r
\r
각 탭마다 \`activeTab\`, \`hoveredTab\`, \`containerRef\`, \`markerRef\`, \`tabRefs\`를 따로 관리해 복잡한 UI 상태를 체계적으로 제어합니다.\r
\r
### 2. 동적 NAV_ITEMS 구조 및 구분선 렌더링\r
\r
\`\`\`jsx\r
const NAV_ITEMS = [\r
  { id: "project", content: "Project" },\r
  {\r
    id: "line1",\r
    type: "separator",\r
    content: (\r
      <svg\r
        width="0.1vw"\r
        height="1.24vw"\r
        viewBox="0 0 2 24"\r
        fill="none"\r
        xmlns="http://www.w3.org/2000/svg"\r
      >\r
        <path opacity="0.2" d="M1.45801 0.84375V23.4277" stroke="white" />\r
      </svg>\r
    ),\r
  },\r
  { id: "student", content: "Student" },\r
  {\r
    id: "hamburger",\r
    content: (\r
      <div className={\`hamburgerBtn \${hamburger ? \`active\` : \`\`}\`}>\r
        <div className="line A"></div>\r
        <div className="line B"></div>\r
        <div className="line C"></div>\r
        <div className={\`blackBg \${hamburgerExit ? \`close\` : \`\`}\`}></div>\r
      </div>\r
    ),\r
  },\r
];\r
\`\`\`\r
\r
\`NAV_ITEMS\` 배열에 \`type: "separator"\`를 추가해 **구분선을 동적으로 렌더링**합니다. 햄버거 버튼은 \`hamburger\` 상태에 따라 스타일을 동적으로 변경하고, 클로징 애니메이션 상태(\`hamburgerExit\`)도 함께 관리합니다.\r
\r
### 3. useCallback을 통한 GSAP 마커 애니메이션 최적화\r
\r
\`\`\`jsx\r
const animateMarker = useCallback(() => {\r
  const marker = markerRef.current;\r
  const container = containerRef.current;\r
  if (!marker || !container) return;\r
\r
  const targetId = highlightTarget;\r
  if (!targetId) {\r
    gsap.to(marker, { opacity: 0, duration: 0.25, ease: "power2.out" });\r
    return;\r
  }\r
\r
  const targetEl = tabRefs.current[targetId];\r
  if (!targetEl) return;\r
\r
  const containerRect = container.getBoundingClientRect();\r
  const targetRect = targetEl.getBoundingClientRect();\r
  const x = targetRect.left - containerRect.left;\r
  const width = targetRect.width;\r
\r
  const isActive = highlightTarget === activeTab;\r
  const activeColor = "rgba(240, 240, 240, 0.9)";\r
  const hoverColor = "rgba(208, 208, 208, 0.1)";\r
\r
  gsap.killTweensOf(marker);\r
  gsap.to(marker, {\r
    x,\r
    width,\r
    opacity: 1,\r
    backgroundColor: isActive ? activeColor : hoverColor,\r
    duration: 0.3,\r
    ease: "back.out(1.2)",\r
  });\r
}, [highlightTarget, activeTab]);\r
\r
const animateNavMarker = useCallback(() => {\r
  const marker = navMarkerRef.current;\r
  const container = navContainerRef.current;\r
  if (!marker || !container) return;\r
\r
  const targetId = highlightNavTarget;\r
  if (!targetId) {\r
    gsap.to(marker, { opacity: 0, duration: 0.25, ease: "power2.out" });\r
    return;\r
  }\r
\r
  const targetEl = navTabRefs.current[targetId];\r
  if (!targetEl) return;\r
\r
  const containerRect = container.getBoundingClientRect();\r
  const targetRect = targetEl.getBoundingClientRect();\r
  const x = targetRect.left - containerRect.left;\r
  const width = targetRect.width;\r
\r
  const isActive = highlightNavTarget === activeNavTab;\r
  const activeColor = "rgba(240, 240, 240, 0.9)";\r
  const hoverColor = "rgba(208, 208, 208, 0.1)";\r
\r
  gsap.killTweensOf(marker);\r
  gsap.to(marker, {\r
    x,\r
    width,\r
    opacity: 1,\r
    backgroundColor: isActive ? activeColor : hoverColor,\r
    duration: 0.3,\r
    ease: "back.out(1.2)",\r
  });\r
}, [highlightNavTarget, activeNavTab]);\r
\`\`\`\r
\r
**두 개의 독립적인 애니메이션 함수**(\`animateMarker\`, \`animateNavMarker\`)를 \`useCallback\`으로 메모이제이션합니다. 각 함수는:\r
\r
1. **Ref 기반 위치 계산**: 탭 버튼의 정확한 좌표와 너비 측정\r
2. **gsap.killTweensOf()**: 진행 중인 애니메이션 강제 종료 후 새 애니메이션 시작\r
3. **상태별 색상 변경**: 활성 탭은 밝게, 호버 상태는 약하게 표현\r
4. **back.out(1.2) 이징**: 탄성 있는 애니메이션 효과\r
\r
### 4. 3개의 useLayoutEffect 훅으로 동기적 DOM 제어\r
\r
\`\`\`jsx\r
useLayoutEffect(() => {\r
  animateMarker();\r
}, [animateMarker]);\r
\r
useLayoutEffect(() => {\r
  animateNavMarker();\r
}, [animateNavMarker]);\r
\r
useLayoutEffect(() => {\r
  const handleResize = () => {\r
    animateMarker();\r
    animateNavMarker();\r
  };\r
  window.addEventListener("resize", handleResize);\r
  return () => {\r
    window.removeEventListener("resize", handleResize);\r
  };\r
}, [animateMarker, animateNavMarker]);\r
\`\`\`\r
\r
**3개의 \`useLayoutEffect\` 훅**을 사용해:\r
- 첫 번째: Tab Switcher 마커 애니메이션 실행\r
- 두 번째: Nav 마커 애니메이션 실행  \r
- 세 번째: 창 크기 변경 시 마커 위치 재계산\r
\r
\`useLayoutEffect\`는 화면이 그려지기 **전에 동기적으로 실행**되므로 flicker 없이 부드러운 애니메이션을 제공합니다.\r
\r
### 5. 탭 전환 로직 및 상태 관리\r
\r
\`\`\`jsx\r
const handleLogoClick = () => {\r
  setActiveTab("none");\r
  setActiveNavTab(null);\r
};\r
\r
const handleTabToggle = (tabId) => {\r
  if (activeTab === tabId) return;\r
  setActiveTab(tabId);\r
  setActiveNavTab(null);\r
};\r
\r
const handleNavTabToggle = (tabId) => {\r
  if (activeNavTab === tabId) return;\r
  setActiveNavTab(tabId);\r
  setActiveTab("none");\r
};\r
\r
const handleToggle = () => {\r
  const newToggledState = !isToggled;\r
  setIsToggled(newToggledState);\r
  setMouseParticlesEnabled(newToggledState);\r
};\r
\`\`\`\r
\r
탭 클릭 시 상태를 동적으로 전환하고, 한 탭바의 선택은 다른 탭바의 선택을 자동으로 해제합니다. 토글 버튼은 마우스 파티클 효과를 동시에 제어합니다.\r
\r
### 6. 복잡한 조건부 렌더링 및 Link 통합\r
\r
\`\`\`jsx\r
{TAB_ITEMS.map((tab, index) => {\r
  const isActive = activeTab === tab.id;\r
  const isHovered = hoveredTab === tab.id;\r
  const isDimmed = activeTab !== "none" && activeTab !== tab.id && !isHovered;\r
  const classNames = [\r
    "tab_btn",\r
    isActive ? "is-active" : "",\r
    isHovered && !isActive ? "is-hovered" : "",\r
    isDimmed ? "is-dimmed" : "",\r
  ]\r
    .filter(Boolean)\r
    .join(" ");\r
  return (\r
    <Fragment key={tab.id}>\r
      <Link key={index} href={tab.label === "GO PIVOT" ? "/goPivot" : "/getFever"}>\r
        <button\r
          type="button"\r
          role="tab"\r
          aria-selected={isActive}\r
          className={classNames}\r
          ref={(node) => {\r
            if (node) tabRefs.current[tab.id] = node;\r
            else delete tabRefs.current[tab.id];\r
          }}\r
          onClick={() => handleTabToggle(tab.id)}\r
          onMouseEnter={() => setHoveredTab(tab.id)}\r
          onMouseLeave={() => setHoveredTab(null)}\r
          onFocus={() => setHoveredTab(tab.id)}\r
          onBlur={() => setHoveredTab(null)}\r
        >\r
          {tab.label}\r
        </button>\r
      </Link>\r
      {index < TAB_ITEMS.length - 1 && (\r
        <span className="line" aria-hidden="true">\r
          <svg>...</svg>\r
        </span>\r
      )}\r
    </Fragment>\r
  );\r
})}\r
\`\`\`\r
\r
각 탭의 상태(활성, 호버, 흐릿함)를 동적으로 계산하고 클래스를 조건부로 추가합니다. \`Fragment\`로 구분선을 동적 렌더링하고, \`Link\`로 네비게이션을 통합합니다.\r
\r
## 기술 스택 및 특징\r
\r
- **GSAP 애니메이션**: \`killTweensOf()\`, \`back.out()\` 이징\r
- **useCallback & useLayoutEffect**: 성능 최적화 및 DOM 동기화\r
- **복잡한 상태 관리**: 두 탭바의 독립적 상태 제어\r
- **Ref 객체**: 여러 탭 요소의 좌표/크기 실시간 추적\r
- **접근성**: \`role="tab"\`, \`aria-selected\`, \`aria-hidden\` 속성\r
- **동적 클래싱**: 상태에 따른 조건부 CSS 클래스 적용\r
\r
이 컴포넌트는 **프로젝트 전체 네비게이션의 핵심**으로, 사용자의 모든 상호작용을 부드럽고 직관적으로 처리합니다.\r
`;export{n as default};
