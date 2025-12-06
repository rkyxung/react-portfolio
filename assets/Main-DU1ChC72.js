const r=`# Main Page\r
\r
## 개요\r
\r
Pivot 프로젝트의 메인 페이지는 단순한 컴포넌트 하나가 아니라 **8개의 전문화된 섹션을 정교하게 조합한 복합 애니메이션 시스템**입니다. 스크롤이라는 선형 동작을 음악처럼 조율된 상호작용 경험으로 변환합니다. HeroSection, VideoSection, KeywordsSection, ConceptSection, VisualSection, TypographySection, SloganSection, MainFooterSection이 각각 다른 애니메이션 트리거와 인터랙션 패턴을 구현합니다.\r
\r
## 핵심 기술 기초\r
\r
### 다중 Ref 참조 시스템\r
\r
\`\`\`javascript\r
const mainRef = useRef(null);           // 페이지 전체 컨테이너 제어\r
const heroRef = useRef(null);           // 히어로 섹션 위치 추적 (부드러운 스크롤용)\r
const videoRef = useRef(null);          // ScrollTrigger 기준점\r
const topBtnRef = useRef(null);         // Top 버튼 DOM 접근\r
\`\`\`\r
\r
메인 페이지는 4개의 Ref로 서로 다른 DOM 세그먼트를 추적합니다. Props 드릴링을 피하면서도 스크롤 계산, ScrollTrigger 바인딩, 부드러운 스크롤 애니메이션이 필요할 때 **직접적인 DOM 조작**을 가능하게 합니다. Props 드릴링을 방지하면서 React의 선언형 패턴을 유지합니다.\r
\r
### Passive 이벤트 리스너 전략\r
\r
\`\`\`javascript\r
useEffect(() => {\r
  const handleScroll = () => {\r
    if (!videoRef.current) return;\r
    const triggerTop = videoRef.current.getBoundingClientRect().top;\r
    const shouldShow = triggerTop <= window.innerHeight * 0.8;\r
    setShowTopBtn(shouldShow);\r
  };\r
\r
  window.addEventListener("scroll", handleScroll, { passive: true });\r
  handleScroll();\r
\r
  return () => {\r
    window.removeEventListener("scroll", handleScroll);\r
    ScrollTrigger.getAll().forEach((st) => st.kill());\r
  };\r
}, []);\r
\`\`\`\r
\r
\`{ passive: true }\` 플래그는 브라우저에게 이 리스너가 \`preventDefault()\`를 호출하지 않는다고 알립니다. 이는 **스크롤 성능을 극적으로 향상**시킵니다. Top 버튼은 \`videoRef\`가 뷰포트 높이의 80% 위에 있을 때만 표시되어, 사용자가 히어로 섹션 아래로 충분히 스크롤했을 때만 나타나도록 합니다.\r
\r
### GSAP ScrollToPlugin을 활용한 부드러운 네비게이션\r
\r
\`\`\`javascript\r
const scrollToHero = () => {\r
  if (!heroRef.current) return;\r
  const top = heroRef.current.getBoundingClientRect().top + window.scrollY;\r
  gsap.to(window, {\r
    scrollTo: { y: top, autoKill: true },\r
    duration: 1,\r
    ease: "power2.out",\r
  });\r
};\r
\`\`\`\r
\r
Top 버튼 클릭 시 즉시 스크롤되지 않고 **1초의 부드러운 애니메이션**으로 이동합니다. \`autoKill: true\`는 이미 진행 중인 스크롤 애니메이션이 있으면 이를 취소하고 새 애니메이션을 시작하도록 합니다. 서로 다른 애니메이션이 스크롤 위치를 놓고 싸우는 현상을 방지합니다.\r
\r
### 메모리 정리 패턴\r
\r
정리 함수에서 \`ScrollTrigger.getAll().forEach((st) => st.kill())\`로 모든 ScrollTrigger 인스턴스를 명시적으로 파괴합니다. **이 단계가 없으면 매번 페이지를 방문할 때마다 기존 트리거 위에 새로운 트리거가 누적되어 기하급수적인 성능 저하**를 야기합니다.\r
\r
## 컴포넌트별 애니메이션 조율\r
\r
### HeroSection (547줄) - 3D 객체 순환 & 줌 관리\r
\r
HeroSection은 **3가지 독립적인 관심사**를 동시에 관리합니다: 3D 객체 상태, 줌 상태, 가시성 상태.\r
\r
**상태 구조:**\r
\`\`\`javascript\r
const [currentObject, setCurrentObject] = useState("line");    // 객체 순환 상태\r
const [isZoomed, setIsZoomed] = useState(false);              // 줌 상태\r
const [isHeroActive, setIsHeroActive] = useState(false);      // 가시성 상태\r
const [mounted, setMounted] = useState(false);                // SSR 수화 상태\r
const objectOrder = ["line", "circle", "square"];             // 불변 객체 순서\r
\`\`\`\r
\r
**인덱스 산술을 이용한 객체 순환:**\r
\`\`\`javascript\r
const handleClick = useCallback(() => {\r
  const currentIndex = objectOrder.indexOf(currentObject);\r
  const nextIndex = (currentIndex + 1) % objectOrder.length;\r
  setCurrentObject(objectOrder[nextIndex]);\r
}, [currentObject]);\r
\r
// 상태에 따른 조건부 렌더링\r
{currentObject === "line" && <Line3D isZoomed={isZoomed} interactive={isZoomed} />}\r
{currentObject === "circle" && <Circle3D isZoomed={isZoomed} interactive={isZoomed} />}\r
{currentObject === "square" && <Square3D isZoomed={isZoomed} interactive={isZoomed} />}\r
\`\`\`\r
\r
모듈로 산술(\`nextIndex % objectOrder.length\`)을 사용해 마지막 요소 다음에 처음으로 돌아가는 **깔끔한 순환 진행**을 구현합니다. 각 3D 컴포넌트는 \`isZoomed\` Props를 받아 상호작용 수준을 조정합니다.\r
\r
**다중 타겟 줌 제어:**\r
\`\`\`javascript\r
const observer = new IntersectionObserver(\r
  ([entry]) => {\r
    const active = entry.isIntersecting && entry.intersectionRatio >= 0.6;\r
    setIsHeroActive(active);\r
    \r
    if (!active && isZoomedRef.current) {\r
      setIsZoomed(false);\r
      if (navZoomAppliedRef.current) {\r
        document.querySelector("nav")?.classList.remove("zoom_out");\r
        navZoomAppliedRef.current = false;\r
      }\r
    }\r
  },\r
  { threshold: [0.6], root: scrollContainer instanceof HTMLElement ? scrollContainer : null }\r
);\r
\`\`\`\r
\r
히어로 가시성이 60% 이하로 떨어지면 현재 줌 상태를 자동으로 해제합니다. 줌 상태는 **3가지 시각적 타겟**에 전파됩니다:\r
1. 히어로 요소 - "zoom_out" 클래스 추가/제거\r
2. 스크롤 컨테이너 - CSS transform scale 적용\r
3. 네비게이션 - "zoom_out" 클래스 적용\r
\r
이렇게 분산된 클래스 적용으로 줌 로직이 한곳에 집중되는 것을 피합니다.\r
\r
**줌 해제 타이밍:**\r
\`\`\`javascript\r
useEffect(() => {\r
  if (isZoomed) {\r
    document.body.classList.add("overflow-hidden");\r
  } else {\r
    setTimeout(() => {\r
      document.body.classList.remove("overflow-hidden");\r
    }, 600);  // CSS 애니메이션 완료 대기\r
  }\r
}, [isZoomed]);\r
\`\`\`\r
\r
줌 해제 시 600ms 지연으로 **CSS 애니메이션이 완료될 때까지 기다린 후** body 스크롤을 복원합니다. 이는 애니메이션 중간에 스크롤이 갑자기 활성화되는 것을 방지합니다.\r
\r
### VideoSection - 임계값 기반 비디오 재생\r
\r
VideoSection은 페이지 전체에서 반복되는 **핵심 가시성-대-동작 패턴**을 보여줍니다.\r
\r
**IntersectionObserver 설정:**\r
\`\`\`javascript\r
const observer = new IntersectionObserver(\r
  ([entry]) => {\r
    if (entry.isIntersecting) {\r
      videoRef.current?.play().catch(() => {});\r
    }\r
  },\r
  { threshold: 1.0 }  // 100% 가시일 때만 재생\r
);\r
\`\`\`\r
\r
임계값 1.0은 **비디오 전체가 화면에 보일 때만** 재생하도록 합니다. \`.catch()\` 처리는 브라우저의 자동 재생 정책 거부에 대한 것입니다 (사용자 에러가 아닌 브라우저 보안 결정).\r
\r
### KeywordsSection (273줄) - SVG 애니메이션 트리거\r
\r
KeywordsSection은 **IntersectionObserver + CSS 애니메이션**을 결합해 시각적 효율을 달성합니다.\r
\r
**1회성 애니메이션 패턴:**\r
\`\`\`javascript\r
const observer = new IntersectionObserver(\r
  ([entry]) => {\r
    if (entry.isIntersecting) {\r
      sectionRef.current?.classList.add("in-view");\r
      observer.unobserve(sectionRef.current);  // 중요: 첫 트리거 후 즉시 해제\r
    }\r
  },\r
  { threshold: 0.7 }  // 70% 가시일 때 트리거\r
);\r
\`\`\`\r
\r
"in-view" 클래스 추가 후 **즉시 옵저버를 해제**합니다. CSS가 애니메이션을 처리하고, IntersectionObserver는 트리거 지점만 담당하므로 메모리 효율이 좋습니다.\r
\r
**SVG 구현:**\r
3개의 원(c1, c2, c3)이 선형 그래디언트를 가지고 있고 \`pathLength="1000"\` 속성으로 **strokeDasharray 계산을 정규화**합니다. CSS 애니메이션이 \`stroke-dashoffset\`을 1000에서 0으로 변경하면서 **선 그리기 효과**를 만듭니다.\r
\r
### ConceptSection (1400줄) - 고급 다단계 ScrollTrigger 애니메이션\r
\r
ConceptSection은 가장 복잡한 애니메이션 패턴을 보여줍니다: **8단계의 기하학적 수열이 스크롤 위치에 잠금**.\r
\r
**SVG 기하학 사양:**\r
\`\`\`javascript\r
const center = { x: 961, y: 371.5 };\r
const horizontalLength = 1922;\r
const mainCircleRadius = 399;\r
const outerCirclesRadius = 271;\r
const numRadialLines = 12;\r
const gridAlignment = { width: 867.2, height: 433.6, scale: 0.8 };\r
\`\`\`\r
\r
SVG는 중심점과 정확히 계산된 반지름, 선 위치로 **뷰포트 크기와 무관한 확장 가능한 기하학 시스템**을 정의합니다.\r
\r
**Ref 기반 SVG 요소 접근:**\r
\`\`\`javascript\r
const sectionRef = useRef(null);\r
const graphicTxtRef = useRef(null);\r
const radialGroupRef = useRef(null);\r
const mainCircleRef = useRef(null);\r
const otherCirclesGroupRef = useRef(null);\r
const horizontalLineRef = useRef(null);\r
const frameRef = useRef(null);\r
\`\`\`\r
\r
8개의 Ref가 서로 다른 SVG 그룹을 추적하므로 **DOM 쿼리 없이 정확한 애니메이션 타겟팅**이 가능합니다.\r
\r
**ScrollTrigger 타임라인 구조:**\r
\`\`\`javascript\r
const tl = gsap.timeline({\r
  scrollTrigger: {\r
    trigger: sectionRef,\r
    start: "top top",\r
    end: "+=2000",        // 2000px 스크롤 거리\r
    pin: true,            // 애니메이션 중 섹션 고정\r
    scrub: 1,             // 애니메이션을 스크롤과 1:1 동기화\r
  },\r
});\r
\r
// 2000px 스크롤에 걸쳐 8단계 애니메이션\r
tl.to(horizontalLineRef, { /* 1단계: 0-250px */ }, 0);\r
tl.to(mainCircleRef, { /* 2단계: 250-500px */ }, 0.25);\r
tl.to(radialGroupRef, { /* 3단계: 500-750px */ }, 0.5);\r
// ... 4-8단계\r
\`\`\`\r
\r
\`scrub: 1\` 파라미터는 애니메이션 재생을 **스크롤 위치와 정확히 1:1로 동기화**합니다. 마치 스크롤이 시간을 제어하는 느낌을 만듭니다.\r
\r
**SVG 경로 길이 계산:**\r
\`\`\`javascript\r
const getTotalLength = (pathElement) => {\r
  if (pathElement?.getTotalLength) return pathElement.getTotalLength();\r
  return 1000;\r
};\r
\r
const pathLength = getTotalLength(mainCircleRef.current);\r
gsap.to(mainCircleRef.current, {\r
  strokeDashoffset: 0,\r
  duration: 0.25,\r
  ease: "none",\r
});\r
\`\`\`\r
\r
SVG 스트로크 애니메이션은 \`getTotalLength()\`로 실제 경로 길이를 얻은 후, \`strokeDashoffset\`을 그 길이에서 0으로 변경하면서 **경로를 따라가는 선 그리기 효과**를 만듭니다.\r
\r
**GSAP Context 정리:**\r
\`\`\`javascript\r
const ctx = gsap.context(() => {\r
  tl.to(mainCircleRef.current, { /* 애니메이션 */ });\r
  tl.to(radialGroupRef.current, { /* 애니메이션 */ });\r
}, sectionRef);\r
\r
return () => ctx.revert();\r
\`\`\`\r
\r
Context 래퍼가 모든 애니메이션을 묶습니다. 언마운트 시 \`.revert()\`가 **활성 트윈, ScrollTrigger 인스턴스, 이벤트 리스너를 모두 정리**합니다.\r
\r
### VisualSection (374줄) - 라벨 전환과 함께하는 객체 순환\r
\r
VisualSection은 **렌더링 간 상태 유지**를 보여주면서 3D 객체를 순환합니다.\r
\r
**지속적 상태 참조:**\r
\`\`\`javascript\r
const labelStateRef = useRef({ current: "line" });  // 렌더링 간 유지\r
const labelKorRef = useRef(null);\r
const labelEngRef = useRef(null);\r
\`\`\`\r
\r
useState와 달리 \`useRef\`는 **리렌더링 간 값 동일성을 유지**하면서 재계산하지 않습니다. 라벨 상태가 부모 컴포넌트 리렌더링에도 일관성 있게 유지됩니다.\r
\r
**ScrollTrigger 기반 객체 진행:**\r
\`\`\`javascript\r
const tl = gsap.timeline({\r
  scrollTrigger: {\r
    trigger: sectionRef,\r
    start: "top center",\r
    end: "+=4000",     // 4000px 스크롤 거리\r
    pin: true,\r
    scrub: 1,\r
  },\r
});\r
\r
// 1단계 (0-1333px): Line 객체\r
tl.to(objectsRef[0], { opacity: 1, duration: 0.8 }, 0)\r
  .to(objectsRef[0], { opacity: 0, duration: 0.8 }, 5.8);\r
\r
// 2단계 (1333-2666px): Circle 객체\r
tl.to(objectsRef[1], { opacity: 1, duration: 0.8 }, 6.6);\r
\`\`\`\r
\r
각 객체가 1333px(페이드인 0.8초 + 유지 5초 + 페이드아웃 0.8초)를 차지합니다.\r
\r
**라벨 크로스페이드 패턴:**\r
\`\`\`javascript\r
gsap.to(labelKorRef.current, { opacity: 1, duration: 0.8 });\r
gsap.to(labelEngRef.current, { opacity: 0, duration: 0.8 });\r
\`\`\`\r
\r
한글과 영문 라벨이 동시에 크로스페이드되어 **자연스러운 언어 전환 효과**를 만듭니다.\r
\r
### TypographySection & SloganSection - 통일된 비디오 제어 패턴\r
\r
두 섹션 모두 **동일한 가시성 기반 비디오 재생 로직**을 구현합니다.\r
\r
**임계값 로직:**\r
\`\`\`javascript\r
const observer = new IntersectionObserver(\r
  ([entry]) => {\r
    if (entry.intersectionRatio >= 0.3) {\r
      videoRef.current?.play().catch(() => {});\r
    } else {\r
      videoRef.current?.pause();\r
      videoRef.current.currentTime = 0;  // 0프레임으로 리셋\r
    }\r
  },\r
  { threshold: 0.3 }  // 30% 가시\r
);\r
\`\`\`\r
\r
스크롤을 벗어나면 비디오가 일시정지되고 **프레임 0으로 리셋**되어, 사용자가 돌아왔을 때 부자연스러운 중간 재생을 방지합니다.\r
\r
### MainFooterSection & teamObjects.jsx - Canvas 렌더링 시스템\r
\r
푸터는 PIVOTTIME 로고와 동심원 SVG 기호들을 렌더링합니다. teamObjects는 3D 객체용 Canvas 기반 형상 렌더링을 제공합니다.\r
\r
**useHiDPICanvas Hook:**\r
\`\`\`javascript\r
function useHiDPICanvas(canvasRef, onDraw, dprMax = DPR_MAX) {\r
  useEffect(() => {\r
    const DPR = Math.min(window.devicePixelRatio || 1, 2);\r
    canvas.width = Math.round(width * DPR);\r
    canvas.height = Math.round(height * DPR);\r
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);  // Context 스케일링\r
  }, []);\r
}\r
\`\`\`\r
\r
이 Hook은 **기기 픽셀 비율 간 Canvas 렌더링을 정규화**합니다. 2x 디스플레이에서는 내부 해상도를 2x로 렌더링한 후 축소해 **깔끔한 그래픽**을 생성합니다.\r
\r
**ResizeObserver 패턴:**\r
\`\`\`javascript\r
const observer = new ResizeObserver(resize);\r
observer.observe(canvas);\r
return () => observer.disconnect();\r
\`\`\`\r
\r
Canvas는 컨테이너 크기 변경 시 **다시 그려집니다**. 반응형 레이아웃에서 Canvas가 컨테이너 너비/높이에 맞춰 조정될 때 필수입니다.\r
\r
## 성능 아키텍처 요약\r
\r
**계산 효율성:**\r
- IntersectionObserver로 연속 스크롤 폴링 대체 (초당 200+ 이벤트 감소)\r
- GSAP Context 정리로 타임라인 오염 방지\r
- 데이터용 useMemo로 불필요한 JSON 재계산 방지\r
- SVG 대비 Canvas 렌더링으로 DOM 노드 감소\r
\r
**메모리 관리:**\r
- 1회성 옵저버는 첫 애니메이션 후 해제\r
- Ref 기반 상태로 불필요한 리렌더링 방지\r
- Context.revert()로 고아 애니메이션 객체 제거\r
- useEffect 반환 함수에서 ResizeObserver 정리\r
\r
**상호작용 반응성:**\r
- useCallback으로 함수 동일성 보존\r
- ScrollTrigger scrub 파라미터로 프레임율 의존성 제거\r
- 세분화된 IntersectionObserver 임계값로 최소 애니메이션 딜레이\r
`;export{r as default};
