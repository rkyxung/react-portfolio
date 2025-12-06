# Navigation

## 개요

Pivot 프로젝트의 **네비게이션 컴포넌트**로 상단에 고정되어 있습니다. GSAP 애니메이션과 복잡한 상태 관리를 결합해 프로페셔널한 인터랙션을 구현했습니다. 두 개의 독립적인 탭 바(Tab Switcher와 Nav)를 동시에 관리하고, 동적 마커 애니메이션으로 현재 선택 상태를 시각화합니다.

## 주요 구현 내용

### 1. 이중 상태 관리: Tab Switcher와 Nav 메뉴

```jsx
// Tab_Switcher 상태
const [activeTab, setActiveTab] = useState("none");
const [hoveredTab, setHoveredTab] = useState(null);
const containerRef = useRef(null);
const markerRef = useRef(null);
const tabRefs = useRef({});

// .nav 상태
const [activeNavTab, setActiveNavTab] = useState(null);
const [hoveredNavTab, setHoveredNavTab] = useState(null);
const navContainerRef = useRef(null);
const navMarkerRef = useRef(null);
const navTabRefs = useRef({});

const [isToggled, setIsToggled] = useState(false);

const highlightTarget = activeTab !== "none" ? activeTab : hoveredTab;
const highlightNavTarget = activeNavTab !== null ? activeNavTab : hoveredNavTab;
```

네비게이션은 **두 개의 독립적인 탭 바**를 관리합니다:
- **Tab Switcher**: "GET FEVER"와 "GO PIVOT" 선택용
- **Nav 메뉴**: "Project", "Student", 햄버거 아이콘용

각 탭마다 `activeTab`, `hoveredTab`, `containerRef`, `markerRef`, `tabRefs`를 따로 관리해 복잡한 UI 상태를 체계적으로 제어합니다.

### 2. 동적 NAV_ITEMS 구조 및 구분선 렌더링

```jsx
const NAV_ITEMS = [
  { id: "project", content: "Project" },
  {
    id: "line1",
    type: "separator",
    content: (
      <svg
        width="0.1vw"
        height="1.24vw"
        viewBox="0 0 2 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path opacity="0.2" d="M1.45801 0.84375V23.4277" stroke="white" />
      </svg>
    ),
  },
  { id: "student", content: "Student" },
  {
    id: "hamburger",
    content: (
      <div className={`hamburgerBtn ${hamburger ? `active` : ``}`}>
        <div className="line A"></div>
        <div className="line B"></div>
        <div className="line C"></div>
        <div className={`blackBg ${hamburgerExit ? `close` : ``}`}></div>
      </div>
    ),
  },
];
```

`NAV_ITEMS` 배열에 `type: "separator"`를 추가해 **구분선을 동적으로 렌더링**합니다. 햄버거 버튼은 `hamburger` 상태에 따라 스타일을 동적으로 변경하고, 클로징 애니메이션 상태(`hamburgerExit`)도 함께 관리합니다.

### 3. useCallback을 통한 GSAP 마커 애니메이션 최적화

```jsx
const animateMarker = useCallback(() => {
  const marker = markerRef.current;
  const container = containerRef.current;
  if (!marker || !container) return;

  const targetId = highlightTarget;
  if (!targetId) {
    gsap.to(marker, { opacity: 0, duration: 0.25, ease: "power2.out" });
    return;
  }

  const targetEl = tabRefs.current[targetId];
  if (!targetEl) return;

  const containerRect = container.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();
  const x = targetRect.left - containerRect.left;
  const width = targetRect.width;

  const isActive = highlightTarget === activeTab;
  const activeColor = "rgba(240, 240, 240, 0.9)";
  const hoverColor = "rgba(208, 208, 208, 0.1)";

  gsap.killTweensOf(marker);
  gsap.to(marker, {
    x,
    width,
    opacity: 1,
    backgroundColor: isActive ? activeColor : hoverColor,
    duration: 0.3,
    ease: "back.out(1.2)",
  });
}, [highlightTarget, activeTab]);

const animateNavMarker = useCallback(() => {
  const marker = navMarkerRef.current;
  const container = navContainerRef.current;
  if (!marker || !container) return;

  const targetId = highlightNavTarget;
  if (!targetId) {
    gsap.to(marker, { opacity: 0, duration: 0.25, ease: "power2.out" });
    return;
  }

  const targetEl = navTabRefs.current[targetId];
  if (!targetEl) return;

  const containerRect = container.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();
  const x = targetRect.left - containerRect.left;
  const width = targetRect.width;

  const isActive = highlightNavTarget === activeNavTab;
  const activeColor = "rgba(240, 240, 240, 0.9)";
  const hoverColor = "rgba(208, 208, 208, 0.1)";

  gsap.killTweensOf(marker);
  gsap.to(marker, {
    x,
    width,
    opacity: 1,
    backgroundColor: isActive ? activeColor : hoverColor,
    duration: 0.3,
    ease: "back.out(1.2)",
  });
}, [highlightNavTarget, activeNavTab]);
```

**두 개의 독립적인 애니메이션 함수**(`animateMarker`, `animateNavMarker`)를 `useCallback`으로 메모이제이션합니다. 각 함수는:

1. **Ref 기반 위치 계산**: 탭 버튼의 정확한 좌표와 너비 측정
2. **gsap.killTweensOf()**: 진행 중인 애니메이션 강제 종료 후 새 애니메이션 시작
3. **상태별 색상 변경**: 활성 탭은 밝게, 호버 상태는 약하게 표현
4. **back.out(1.2) 이징**: 탄성 있는 애니메이션 효과

### 4. 3개의 useLayoutEffect 훅으로 동기적 DOM 제어

```jsx
useLayoutEffect(() => {
  animateMarker();
}, [animateMarker]);

useLayoutEffect(() => {
  animateNavMarker();
}, [animateNavMarker]);

useLayoutEffect(() => {
  const handleResize = () => {
    animateMarker();
    animateNavMarker();
  };
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, [animateMarker, animateNavMarker]);
```

**3개의 `useLayoutEffect` 훅**을 사용해:
- 첫 번째: Tab Switcher 마커 애니메이션 실행
- 두 번째: Nav 마커 애니메이션 실행  
- 세 번째: 창 크기 변경 시 마커 위치 재계산

`useLayoutEffect`는 화면이 그려지기 **전에 동기적으로 실행**되므로 flicker 없이 부드러운 애니메이션을 제공합니다.

### 5. 탭 전환 로직 및 상태 관리

```jsx
const handleLogoClick = () => {
  setActiveTab("none");
  setActiveNavTab(null);
};

const handleTabToggle = (tabId) => {
  if (activeTab === tabId) return;
  setActiveTab(tabId);
  setActiveNavTab(null);
};

const handleNavTabToggle = (tabId) => {
  if (activeNavTab === tabId) return;
  setActiveNavTab(tabId);
  setActiveTab("none");
};

const handleToggle = () => {
  const newToggledState = !isToggled;
  setIsToggled(newToggledState);
  setMouseParticlesEnabled(newToggledState);
};
```

탭 클릭 시 상태를 동적으로 전환하고, 한 탭바의 선택은 다른 탭바의 선택을 자동으로 해제합니다. 토글 버튼은 마우스 파티클 효과를 동시에 제어합니다.

### 6. 복잡한 조건부 렌더링 및 Link 통합

```jsx
{TAB_ITEMS.map((tab, index) => {
  const isActive = activeTab === tab.id;
  const isHovered = hoveredTab === tab.id;
  const isDimmed = activeTab !== "none" && activeTab !== tab.id && !isHovered;
  const classNames = [
    "tab_btn",
    isActive ? "is-active" : "",
    isHovered && !isActive ? "is-hovered" : "",
    isDimmed ? "is-dimmed" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Fragment key={tab.id}>
      <Link key={index} href={tab.label === "GO PIVOT" ? "/goPivot" : "/getFever"}>
        <button
          type="button"
          role="tab"
          aria-selected={isActive}
          className={classNames}
          ref={(node) => {
            if (node) tabRefs.current[tab.id] = node;
            else delete tabRefs.current[tab.id];
          }}
          onClick={() => handleTabToggle(tab.id)}
          onMouseEnter={() => setHoveredTab(tab.id)}
          onMouseLeave={() => setHoveredTab(null)}
          onFocus={() => setHoveredTab(tab.id)}
          onBlur={() => setHoveredTab(null)}
        >
          {tab.label}
        </button>
      </Link>
      {index < TAB_ITEMS.length - 1 && (
        <span className="line" aria-hidden="true">
          <svg>...</svg>
        </span>
      )}
    </Fragment>
  );
})}
```

각 탭의 상태(활성, 호버, 흐릿함)를 동적으로 계산하고 클래스를 조건부로 추가합니다. `Fragment`로 구분선을 동적 렌더링하고, `Link`로 네비게이션을 통합합니다.

## 기술 스택 및 특징

- **GSAP 애니메이션**: `killTweensOf()`, `back.out()` 이징
- **useCallback & useLayoutEffect**: 성능 최적화 및 DOM 동기화
- **복잡한 상태 관리**: 두 탭바의 독립적 상태 제어
- **Ref 객체**: 여러 탭 요소의 좌표/크기 실시간 추적
- **접근성**: `role="tab"`, `aria-selected`, `aria-hidden` 속성
- **동적 클래싱**: 상태에 따른 조건부 CSS 클래스 적용

이 컴포넌트는 **프로젝트 전체 네비게이션의 핵심**으로, 사용자의 모든 상호작용을 부드럽고 직관적으로 처리합니다.
