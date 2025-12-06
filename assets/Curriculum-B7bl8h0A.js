const r=`# Curriculum Page\r
\r
## 개요\r
IntersectionObserver를 활용한 교육과정 페이지입니다. 섹션이 뷰포트에 진입할 때 애니메이션이 트리거되며, 재사용 가능한 Observer 커스텀 훅으로 구성했습니다.\r
\r
## 주요 기능\r
\r
### 1. IntersectionObserver 커스텀 훅\r
\r
\`\`\`jsx\r
const useIntersectionObserver = (options) => {\r
  const [isVisible, setIsVisible] = useState(false);\r
  const [hasBeenVisible, setHasBeenVisible] = useState(false);\r
  const ref = useRef(null);\r
\r
  useEffect(() => {\r
    const observer = new IntersectionObserver(([entry]) => {\r
      if (entry.isIntersecting) {\r
        setIsVisible(true);\r
        setHasBeenVisible(true);\r
      }\r
    }, options);\r
\r
    if (ref.current) {\r
      observer.observe(ref.current);\r
    }\r
\r
    return () => {\r
      if (ref.current) {\r
        observer.unobserve(ref.current);\r
      }\r
    };\r
  }, [ref, options, hasBeenVisible]);\r
\r
  return [ref, isVisible || hasBeenVisible];\r
};\r
\r
export default function Curriculum() {\r
  const heroOptions = { threshold: 0.5 };\r
  const convergenceOptions = { threshold: 0.4 };\r
  const curriculumOptions = { threshold: 0.25 };\r
  const careerOptions = { threshold: 0.4 };\r
\r
  const [introRef, isIntroVisible] = useIntersectionObserver(heroOptions);\r
  const [convergenceRef, isConvergenceVisible] = useIntersectionObserver(convergenceOptions);\r
  const [curriculumRef, isCurriculumVisible] = useIntersectionObserver(curriculumOptions);\r
  const [careerRef, isCareerVisible] = useIntersectionObserver(careerOptions);\r
\`\`\`\r
\r
\`hasBeenVisible\` 상태로 애니메이션을 한 번만 실행하도록 보장했습니다. \`threshold\` 값을 매개변수로 받아 유연하게 설정할 수 있고, 컴포넌트가 언마운트될 때 observer를 정리해 메모리 누수를 방지합니다.\r
\r
### 2. 섹션별 다양한 Threshold 설정\r
\r
각 섹션마다 다른 threshold 값(0.5, 0.4, 0.25, 0.4)을 적용해 애니메이션 타이밍을 최적화했습니다.\r
`;export{r as default};
