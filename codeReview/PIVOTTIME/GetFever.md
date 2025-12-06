# GetFever 
# - 학기별 회전 애니메이션 & 아카이브

## 개요

GetFever는 **3개의 통합된 페이지 시스템**으로, 학생들의 학기별 경험과 답변을 다차원적으로 전시합니다. 스크롤 기반 회전 애니메이션, 이미지 갤러리, 텍스트 아카이브가 하나의 내러티브로 연결되어 있으며, **120명 이상의 학생 데이터를 구조화된 방식으로 관리**합니다.

## 핵심 데이터 구조: SEMESTERS와 QUESTION_GROUPS

### SEMESTERS 상수 - 3D 회전 메타데이터

```javascript
const SEMESTERS = [
  {
    id: 1,
    label: "1-1",
    angle: 0,                    // 초기 회전각도 (SVG container)
    tilt: 0,                     // SVG 기울임
    radiusFactor: 1.05,          // 원형 배치 반지름 계수
    svgComponent: <Semester11 />, // JSX로 직접 임베딩된 SVG
  },
  {
    id: 2,
    label: "1-2",
    angle: 15,
    tilt: 5,
    radiusFactor: 1.0,
    svgComponent: <Semester12 />,
  },
  {
    id: 3,
    label: "2-1",
    angle: 45,
    tilt: 15,
    radiusFactor: 0.95,
    svgComponent: <Semester21 />,
  },
  {
    id: 4,
    label: "2-2",
    angle: 90,
    tilt: 30,
    radiusFactor: 0.9,
    svgComponent: <Semester22 />,
  },
];
```

**핵심 설계:**
- `angle`: CSS 커스텀 프로퍼티 `--archive-rotation`에 의해 동적으로 변경되는 회전값
- `tilt`: 원근감을 위한 3D transform
- `radiusFactor`: 원형 레이아웃에서 각 학기의 거리 조정
- `svgComponent`: 별도 이미지 파일 없이 JSX로 직접 포함되어 **인라인 렌더링**

### QUESTION_GROUPS - 학기별 질문 매핑

```javascript
const SEMESTER_TO_GROUP = {
  1: 0,  // 1-1 → Question Group 0
  2: 1,  // 1-2 → Question Group 1
  3: 2,  // 2-1 → Question Group 2
  4: 3,  // 2-2 → Question Group 3
};

const QUESTION_GROUPS = [
  {
    id: 0,
    questions: [
      {
        title: "당신에게 Get Fever란?",
        subtitle: "첫 학기를 시작하며 느낀 점",
        groupId: 0,
      },
      {
        title: "당신의 가장 인상깊은 프로젝트는?",
        subtitle: "Get Fever 1-1에서 배운 점",
        groupId: 0,
      },
    ],
  },
  // ... 2, 3, 4 그룹
];
```

**매핑의 의도:**
- `SEMESTER_TO_GROUP`은 학기 ID를 질문 그룹 인덱스로 변환
- 동일한 학생이 학기마다 다른 닉네임으로 활동 가능 (`nickName01` vs `nickName02`)

### buildAnswersByGroup() - 데이터 재구조화 함수

```javascript
const buildAnswersByGroup = () => {
  const answersByGroup = {};

  // gfArchive.json에서 모든 학생 데이터 순회
  Object.entries(submissions).forEach(([studentId, studentData]) => {
    QUESTION_GROUPS.forEach((group, groupIdx) => {
      if (!answersByGroup[groupIdx]) {
        answersByGroup[groupIdx] = [];
      }

      group.questions.forEach((question) => {
        // 학기에 따라 다른 닉네임 선택
        const isFirstSemester = groupIdx < 2;
        const nickName = isFirstSemester 
          ? studentData.nickName01 
          : studentData.nickName02;

        if (nickName && studentData.answers?.[groupIdx]) {
          answersByGroup[groupIdx].push({
            studentId,
            nickName,
            answer: studentData.answers[groupIdx],
            role: studentData.role,
            imageUrl: `/images/gfArchive/${groupIdx}/${studentId}.jpg`,
          });
        }
      });
    });
  });

  return answersByGroup;
};
```

**동작:**
1. submissions 객체 순회 (gfArchive.json의 전체 학생 데이터)
2. 각 질문 그룹별로 학생 답변 수집
3. 학기에 따라 `nickName01` 또는 `nickName02` 선택
4. 질문 그룹 인덱스를 기준으로 재구성된 객체 반환

---

## GetFever 메인 페이지: 이중 타임라인 & ScrollTrigger

### 1단계: Hero → Archive 자동 스크롤 타임라인

```javascript
const heroScrollTweenRef = useRef(null);

useEffect(() => {
  if (!skipHeroIntro) {
    // skipHeroIntro === false: 풀 애니메이션 재생
    heroScrollTweenRef.current = gsap.to(window, {
      scrollTo: archiveRef.current,
      duration: 1.4,
      ease: "power2.inOut",
      delay: 0.5,  // Hero 섹션 200ms 보기 후 시작
    });
  } else {
    // skipHeroIntro === true: ?section=archive 쿼리 시 즉시 이동
    window.scrollTo(0, archiveRef.current?.offsetTop || 0);
  }

  return () => heroScrollTweenRef.current?.kill();
}, [skipHeroIntro]);
```

**논리:**
- 직접 방문 시 (`skipHeroIntro = false`) → 1.4초 부드러운 스크롤
- 쿼리 파라미터로 진입 시 (`?section=archive`) → 즉시 이동 (UX 최적화)

### 2단계: 마스터 타임라인 - 4 스텝 학기 회전

```javascript
const masterTimelineRef = useRef(null);
const [activeSemester, setActiveSemester] = useState(0);

useEffect(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: archiveRef,
      start: "top top",
      end: "+=5000",           // 5000px 스크롤 거리
      scrub: 0.8,              // 스크롤과 0.8초 부드러운 동기화
      pin: true,               // 섹션 고정
      onUpdate: (self) => {
        // progress (0-1)를 0-3 학기 인덱스로 변환
        const progress = self.progress;
        const nextSemester = Math.min(
          SEMESTERS.length - 1,
          Math.floor(progress * SEMESTERS.length)
        );
        setActiveSemester(nextSemester);
      },
    },
  });

  const pauseDuration = 1.5;  // 각 학기별 정지 시간

  // 4개 스텝: 각 학기별로 -90도씩 회전
  for (let i = 0; i < SEMESTERS.length; i++) {
    const rotationAngle = -90 * i;
    
    // CSS 커스텀 프로퍼티 애니메이션
    tl.to(
      document.documentElement,
      {
        "--archive-rotation": `${rotationAngle}deg`,
        duration: 2,
        ease: "none",  // 선형 회전
      },
      i * (2 + pauseDuration)  // 각 애니메이션 사이 pauseDuration 시간 정지
    );
  }

  masterTimelineRef.current = tl;

  return () => tl.kill();
}, []);
```

**CSS 커스텀 프로퍼티 접근:**
```css
:root {
  --archive-rotation: 0deg;
}

.semester-container {
  transform: rotateZ(var(--archive-rotation));
  transition: transform 0.05s linear;
}
```

**타임라인 구조:**
```
시간:     0s ───── 2s ────────────── 3.5s ───── 5.5s ────────────── 7s ...
         |         |                 |         |                 |
애니:   회전시작  회전완료 + 정지  회전시작  회전완료 + 정지  ...
각도:     0°  →   -90°   (정지)   -180°   (정지)     ...
```

### 3단계: 활성 학기 스타일 업데이트

```javascript
// 학기별 스타일 매핑
const STEP_STYLES = [
  {
    angle: 0,
    tilt: 0,
    radiusFactor: 1.05,
    scale: 1,
    opacity: 1,
  },
  {
    angle: 15,
    tilt: 5,
    radiusFactor: 1.0,
    scale: 0.95,
    opacity: 0.8,
  },
  {
    angle: 45,
    tilt: 15,
    radiusFactor: 0.95,
    scale: 0.9,
    opacity: 0.7,
  },
  {
    angle: 90,
    tilt: 30,
    radiusFactor: 0.9,
    scale: 0.85,
    opacity: 0.6,
  },
];

useEffect(() => {
  // activeSemester 상태 변화 시 트리거
  const semesterItems = document.querySelectorAll(".semester-item");

  semesterItems.forEach((item, index) => {
    const style = STEP_STYLES[activeSemester];
    const isActive = index === activeSemester;

    gsap.to(item, {
      "--semester-angle": `${style.angle}deg`,
      "--semester-tilt": `${style.tilt}deg`,
      "--semester-radius-factor": style.radiusFactor,
      scale: isActive ? style.scale : style.scale * 0.8,
      opacity: isActive ? style.opacity : style.opacity * 0.5,
      duration: 0.5,
      ease: "power2.out",
    });
  });
}, [activeSemester]);
```

**동작:**
- `activeSemester` 상태 변화 → `STEP_STYLES[activeSemester]` 스타일 적용
- 활성 학기는 `scale` 크고 `opacity` 높음
- 비활성 학기는 작고 투명하게 표현

---

## 학기 선택 & 페이지 전환: handleSemesterClick

```javascript
const handleSemesterClick = (semesterId) => {
  // 1단계: ScrollTrigger 비활성화 및 애니메이션 일시정지
  scrollTriggerRef.current?.disable(false);
  masterTimelineRef.current?.pause();

  // 2단계: CSS transition 임시 제거 (급격한 변화 방지)
  const archiveObject = archiveObjectRef.current;
  const archiveTitle = archiveTitleRef.current;
  const infoBox = infoBoxRef.current;

  gsap.set([archiveObject, archiveTitle, infoBox], {
    transition: "none",
  });

  // 3단계: 페이드아웃 애니메이션 타임라인
  const exitTl = gsap.timeline();

  exitTl
    .to(
      archiveObject,
      {
        xPercent: -60,        // 왼쪽으로 빠져나감
        autoAlpha: 0.2,       // opacity: 0.2, visibility: visible 유지
        duration: 0.6,
        ease: "power2.in",
      },
      0
    )
    .to(
      archiveTitle,
      {
        xPercent: -60,
        autoAlpha: 0,         // 완전 사라짐
        duration: 0.6,
        ease: "power2.in",
      },
      0
    )
    .to(
      infoBox,
      {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power2.in",
      },
      0.1  // 약간 지연되어 시작
    )
    .call(() => {
      // 4단계: 모든 애니메이션 완료 후 라우팅
      router.push(`/gfArchive-txt?id=${semesterId}`);
    });
};
```

**페이드아웃 타이밍:**
```
0ms ────── 300ms ────── 600ms ────── 1000ms
│           │           │            │
archiveObject: 애니메이션 시작 ─── 종료
archiveTitle:  애니메이션 시작 ─── 종료
infoBox:       (100ms 지연) ─── 종료 ──── 라우팅 시작
```

---

## 메모리 관리 & 정리

```javascript
useEffect(() => {
  return () => {
    // 모든 GSAP 참조 정리
    heroScrollTweenRef.current?.kill();
    scrollTriggerRef.current?.kill();
    masterTimelineRef.current?.kill();

    // ScrollTrigger의 복잡한 DOM 리스너 해제 필수
    // (없으면 페이지 전환 시 메모리 누수 발생)
  };
}, []);
```

**정리 이유:**
- `heroScrollTweenRef`: 스크롤 애니메이션 객체
- `scrollTriggerRef`: ScrollTrigger 인스턴스 (복잡한 scroll 리스너 등록)
- `masterTimelineRef`: 메인 타임라인 (모든 CSS 변경 및 콜백 포함)

---

## gfArchive-img 페이지: 학기별 이미지 갤러리

### 동적 폴더 변환

```javascript
const SEMESTER_TO_FOLDER = {
  1: "1-1 imges",    // gfArchive.json의 semesterId를 폴더명으로 변환
  2: "1-2 imges",
  3: "2-1 imges",
  4: "2-2 imges",
};

export async function getStaticProps({ params }) {
  const { id } = params;  // semesterId (1, 2, 3, 또는 4)
  const folderName = SEMESTER_TO_FOLDER[id];
  
  // /public/images/gfArchive/{folderName}/ 디렉토리의 이미지 로드
  const imageFiles = fs.readdirSync(
    path.join(process.cwd(), "public/images/gfArchive", folderName)
  );

  return {
    props: {
      images: imageFiles.map((file) => ({
        src: `/images/gfArchive/${folderName}/${file}`,
        alt: file,
      })),
      semesterId: id,
      semesterLabel: `${Math.ceil(id / 2)}-${id % 2 === 1 ? "1" : "2"}`,
    },
    revalidate: 86400,  // 24시간 ISR
  };
}
```

**동작:**
1. 쿼리 파라미터로 학기 ID 수신 (`?id=1`)
2. `SEMESTER_TO_FOLDER` 맵에서 폴더명 조회
3. Next.js `fs` 모듈로 해당 폴더의 모든 이미지 파일 나열
4. **ISR (Incremental Static Regeneration)**로 24시간마다 재검증

### 이미지 갤러리 렌더링

```javascript
export default function GfArchiveImg({ images, semesterId, semesterLabel }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="gallery-container">
      <header>
        <h1>GetFever {semesterLabel} 이미지 아카이브</h1>
        <p>{images.length}개의 학생 작업물</p>
      </header>

      <div className="main-image-section">
        <Image
          src={images[selectedImage].src}
          alt={`학기별 이미지 ${selectedImage + 1}`}
          width={1000}
          height={800}
          priority={selectedImage === 0}
          objectFit="contain"
        />
      </div>

      <div className="thumbnail-grid">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={selectedImage === idx ? "active" : ""}
          >
            <Image
              src={image.src}
              alt={`썸네일 ${idx + 1}`}
              width={150}
              height={150}
              objectFit="cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## gfArchive-txt 페이지: 학생 답변 아카이브

### 학기별 탭과 답변 그룹화

```javascript
export default function GfArchiveTxt({ semesterId }) {
  const [activeTab, setActiveTab] = useState(0);
  const answersByGroup = buildAnswersByGroup();

  const groupIdx = SEMESTER_TO_GROUP[semesterId];
  const answersInGroup = answersByGroup[groupIdx] || [];

  const questions = QUESTION_GROUPS[groupIdx]?.questions || [];

  return (
    <div className="archive-txt-container">
      <header>
        <h1>GetFever {SEMESTERS[groupIdx].label} 답변 아카이브</h1>
      </header>

      <div className="questions-section">
        {questions.map((question, qIdx) => (
          <div key={qIdx} className="question-block">
            <h2>{question.title}</h2>
            <p className="subtitle">{question.subtitle}</p>

            <div className="answers-grid">
              {answersInGroup.map((answer, idx) => (
                <div key={idx} className="answer-card">
                  <div className="answer-image">
                    {answer.imageUrl && (
                      <Image
                        src={answer.imageUrl}
                        alt={`${answer.nickName} 답변`}
                        width={300}
                        height={300}
                        objectFit="cover"
                      />
                    )}
                  </div>

                  <div className="answer-content">
                    <p className="answer-text">{answer.answer}</p>
                    <footer>
                      <span className="nickname">{answer.nickName}</span>
                      <span className="role">{answer.role}</span>
                    </footer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**데이터 흐름:**
1. `semesterId` → `SEMESTER_TO_GROUP` 변환 → `groupIdx`
2. `buildAnswersByGroup()` 결과에서 `answersByGroup[groupIdx]` 추출
3. 해당 그룹의 `questions` 배열 순회
4. 각 질문 아래 답변 카드 그리드 표시

### 답변 카드 구조

```javascript
// 각 답변 카드는:
// 1. 학생 이미지 (선택사항)
// 2. 답변 텍스트
// 3. 학생 닉네임 + 역할 (footer)

const answerCard = {
  studentId: "STU001",
  nickName: "Alex",           // 학기에 따라 nickName01 또는 nickName02
  answer: "Get Fever는...",  // 학생의 실제 답변 텍스트
  role: "Student",
  imageUrl: "/images/gfArchive/1/STU001.jpg",
};
```

---

## 성능 최적화

**동적 라우팅:**
- Next.js `getStaticProps` + ISR로 학기별 이미지 페이지 미리 생성
- 사용자는 캐시된 정적 페이지 즉시 로드

**메모리 효율:**
- 타임라인 정리로 메모리 누수 방지
- ScrollTrigger 명시적 kill() 처리

**애니메이션 동기화:**
- `scrub: 0.8`으로 부드러운 스크롤-애니메이션 동기화
- CSS 커스텀 프로퍼티로 효율적인 회전 제어
