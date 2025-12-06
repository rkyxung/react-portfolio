# Curriculum Page

## 개요
IntersectionObserver를 활용한 교육과정 페이지입니다. 섹션이 뷰포트에 진입할 때 애니메이션이 트리거되며, 재사용 가능한 Observer 커스텀 훅으로 구성했습니다.

## 주요 기능

### 1. IntersectionObserver 커스텀 훅

```jsx
const useIntersectionObserver = (options) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        setHasBeenVisible(true);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options, hasBeenVisible]);

  return [ref, isVisible || hasBeenVisible];
};

export default function Curriculum() {
  const heroOptions = { threshold: 0.5 };
  const convergenceOptions = { threshold: 0.4 };
  const curriculumOptions = { threshold: 0.25 };
  const careerOptions = { threshold: 0.4 };

  const [introRef, isIntroVisible] = useIntersectionObserver(heroOptions);
  const [convergenceRef, isConvergenceVisible] = useIntersectionObserver(convergenceOptions);
  const [curriculumRef, isCurriculumVisible] = useIntersectionObserver(curriculumOptions);
  const [careerRef, isCareerVisible] = useIntersectionObserver(careerOptions);
```

`hasBeenVisible` 상태로 애니메이션을 한 번만 실행하도록 보장했습니다. `threshold` 값을 매개변수로 받아 유연하게 설정할 수 있고, 컴포넌트가 언마운트될 때 observer를 정리해 메모리 누수를 방지합니다.

### 2. 섹션별 다양한 Threshold 설정

각 섹션마다 다른 threshold 값(0.5, 0.4, 0.25, 0.4)을 적용해 애니메이션 타이밍을 최적화했습니다.
