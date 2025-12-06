const r=`# GetFever \r
# - 학기별 회전 애니메이션 & 아카이브\r
\r
## 개요\r
\r
GetFever는 **3개의 통합된 페이지 시스템**으로, 학생들의 학기별 경험과 답변을 다차원적으로 전시합니다. 스크롤 기반 회전 애니메이션, 이미지 갤러리, 텍스트 아카이브가 하나의 내러티브로 연결되어 있으며, **120명 이상의 학생 데이터를 구조화된 방식으로 관리**합니다.\r
\r
## 핵심 데이터 구조: SEMESTERS와 QUESTION_GROUPS\r
\r
### SEMESTERS 상수 - 3D 회전 메타데이터\r
\r
\`\`\`javascript\r
const SEMESTERS = [\r
  {\r
    id: 1,\r
    label: "1-1",\r
    angle: 0,                    // 초기 회전각도 (SVG container)\r
    tilt: 0,                     // SVG 기울임\r
    radiusFactor: 1.05,          // 원형 배치 반지름 계수\r
    svgComponent: <Semester11 />, // JSX로 직접 임베딩된 SVG\r
  },\r
  {\r
    id: 2,\r
    label: "1-2",\r
    angle: 15,\r
    tilt: 5,\r
    radiusFactor: 1.0,\r
    svgComponent: <Semester12 />,\r
  },\r
  {\r
    id: 3,\r
    label: "2-1",\r
    angle: 45,\r
    tilt: 15,\r
    radiusFactor: 0.95,\r
    svgComponent: <Semester21 />,\r
  },\r
  {\r
    id: 4,\r
    label: "2-2",\r
    angle: 90,\r
    tilt: 30,\r
    radiusFactor: 0.9,\r
    svgComponent: <Semester22 />,\r
  },\r
];\r
\`\`\`\r
\r
**핵심 설계:**\r
- \`angle\`: CSS 커스텀 프로퍼티 \`--archive-rotation\`에 의해 동적으로 변경되는 회전값\r
- \`tilt\`: 원근감을 위한 3D transform\r
- \`radiusFactor\`: 원형 레이아웃에서 각 학기의 거리 조정\r
- \`svgComponent\`: 별도 이미지 파일 없이 JSX로 직접 포함되어 **인라인 렌더링**\r
\r
### QUESTION_GROUPS - 학기별 질문 매핑\r
\r
\`\`\`javascript\r
const SEMESTER_TO_GROUP = {\r
  1: 0,  // 1-1 → Question Group 0\r
  2: 1,  // 1-2 → Question Group 1\r
  3: 2,  // 2-1 → Question Group 2\r
  4: 3,  // 2-2 → Question Group 3\r
};\r
\r
const QUESTION_GROUPS = [\r
  {\r
    id: 0,\r
    questions: [\r
      {\r
        title: "당신에게 Get Fever란?",\r
        subtitle: "첫 학기를 시작하며 느낀 점",\r
        groupId: 0,\r
      },\r
      {\r
        title: "당신의 가장 인상깊은 프로젝트는?",\r
        subtitle: "Get Fever 1-1에서 배운 점",\r
        groupId: 0,\r
      },\r
    ],\r
  },\r
  // ... 2, 3, 4 그룹\r
];\r
\`\`\`\r
\r
**매핑의 의도:**\r
- \`SEMESTER_TO_GROUP\`은 학기 ID를 질문 그룹 인덱스로 변환\r
- 동일한 학생이 학기마다 다른 닉네임으로 활동 가능 (\`nickName01\` vs \`nickName02\`)\r
\r
### buildAnswersByGroup() - 데이터 재구조화 함수\r
\r
\`\`\`javascript\r
const buildAnswersByGroup = () => {\r
  const answersByGroup = {};\r
\r
  // gfArchive.json에서 모든 학생 데이터 순회\r
  Object.entries(submissions).forEach(([studentId, studentData]) => {\r
    QUESTION_GROUPS.forEach((group, groupIdx) => {\r
      if (!answersByGroup[groupIdx]) {\r
        answersByGroup[groupIdx] = [];\r
      }\r
\r
      group.questions.forEach((question) => {\r
        // 학기에 따라 다른 닉네임 선택\r
        const isFirstSemester = groupIdx < 2;\r
        const nickName = isFirstSemester \r
          ? studentData.nickName01 \r
          : studentData.nickName02;\r
\r
        if (nickName && studentData.answers?.[groupIdx]) {\r
          answersByGroup[groupIdx].push({\r
            studentId,\r
            nickName,\r
            answer: studentData.answers[groupIdx],\r
            role: studentData.role,\r
            imageUrl: \`/images/gfArchive/\${groupIdx}/\${studentId}.jpg\`,\r
          });\r
        }\r
      });\r
    });\r
  });\r
\r
  return answersByGroup;\r
};\r
\`\`\`\r
\r
**동작:**\r
1. submissions 객체 순회 (gfArchive.json의 전체 학생 데이터)\r
2. 각 질문 그룹별로 학생 답변 수집\r
3. 학기에 따라 \`nickName01\` 또는 \`nickName02\` 선택\r
4. 질문 그룹 인덱스를 기준으로 재구성된 객체 반환\r
\r
---\r
\r
## GetFever 메인 페이지: 이중 타임라인 & ScrollTrigger\r
\r
### 1단계: Hero → Archive 자동 스크롤 타임라인\r
\r
\`\`\`javascript\r
const heroScrollTweenRef = useRef(null);\r
\r
useEffect(() => {\r
  if (!skipHeroIntro) {\r
    // skipHeroIntro === false: 풀 애니메이션 재생\r
    heroScrollTweenRef.current = gsap.to(window, {\r
      scrollTo: archiveRef.current,\r
      duration: 1.4,\r
      ease: "power2.inOut",\r
      delay: 0.5,  // Hero 섹션 200ms 보기 후 시작\r
    });\r
  } else {\r
    // skipHeroIntro === true: ?section=archive 쿼리 시 즉시 이동\r
    window.scrollTo(0, archiveRef.current?.offsetTop || 0);\r
  }\r
\r
  return () => heroScrollTweenRef.current?.kill();\r
}, [skipHeroIntro]);\r
\`\`\`\r
\r
**논리:**\r
- 직접 방문 시 (\`skipHeroIntro = false\`) → 1.4초 부드러운 스크롤\r
- 쿼리 파라미터로 진입 시 (\`?section=archive\`) → 즉시 이동 (UX 최적화)\r
\r
### 2단계: 마스터 타임라인 - 4 스텝 학기 회전\r
\r
\`\`\`javascript\r
const masterTimelineRef = useRef(null);\r
const [activeSemester, setActiveSemester] = useState(0);\r
\r
useEffect(() => {\r
  const tl = gsap.timeline({\r
    scrollTrigger: {\r
      trigger: archiveRef,\r
      start: "top top",\r
      end: "+=5000",           // 5000px 스크롤 거리\r
      scrub: 0.8,              // 스크롤과 0.8초 부드러운 동기화\r
      pin: true,               // 섹션 고정\r
      onUpdate: (self) => {\r
        // progress (0-1)를 0-3 학기 인덱스로 변환\r
        const progress = self.progress;\r
        const nextSemester = Math.min(\r
          SEMESTERS.length - 1,\r
          Math.floor(progress * SEMESTERS.length)\r
        );\r
        setActiveSemester(nextSemester);\r
      },\r
    },\r
  });\r
\r
  const pauseDuration = 1.5;  // 각 학기별 정지 시간\r
\r
  // 4개 스텝: 각 학기별로 -90도씩 회전\r
  for (let i = 0; i < SEMESTERS.length; i++) {\r
    const rotationAngle = -90 * i;\r
    \r
    // CSS 커스텀 프로퍼티 애니메이션\r
    tl.to(\r
      document.documentElement,\r
      {\r
        "--archive-rotation": \`\${rotationAngle}deg\`,\r
        duration: 2,\r
        ease: "none",  // 선형 회전\r
      },\r
      i * (2 + pauseDuration)  // 각 애니메이션 사이 pauseDuration 시간 정지\r
    );\r
  }\r
\r
  masterTimelineRef.current = tl;\r
\r
  return () => tl.kill();\r
}, []);\r
\`\`\`\r
\r
**CSS 커스텀 프로퍼티 접근:**\r
\`\`\`css\r
:root {\r
  --archive-rotation: 0deg;\r
}\r
\r
.semester-container {\r
  transform: rotateZ(var(--archive-rotation));\r
  transition: transform 0.05s linear;\r
}\r
\`\`\`\r
\r
**타임라인 구조:**\r
\`\`\`\r
시간:     0s ───── 2s ────────────── 3.5s ───── 5.5s ────────────── 7s ...\r
         |         |                 |         |                 |\r
애니:   회전시작  회전완료 + 정지  회전시작  회전완료 + 정지  ...\r
각도:     0°  →   -90°   (정지)   -180°   (정지)     ...\r
\`\`\`\r
\r
### 3단계: 활성 학기 스타일 업데이트\r
\r
\`\`\`javascript\r
// 학기별 스타일 매핑\r
const STEP_STYLES = [\r
  {\r
    angle: 0,\r
    tilt: 0,\r
    radiusFactor: 1.05,\r
    scale: 1,\r
    opacity: 1,\r
  },\r
  {\r
    angle: 15,\r
    tilt: 5,\r
    radiusFactor: 1.0,\r
    scale: 0.95,\r
    opacity: 0.8,\r
  },\r
  {\r
    angle: 45,\r
    tilt: 15,\r
    radiusFactor: 0.95,\r
    scale: 0.9,\r
    opacity: 0.7,\r
  },\r
  {\r
    angle: 90,\r
    tilt: 30,\r
    radiusFactor: 0.9,\r
    scale: 0.85,\r
    opacity: 0.6,\r
  },\r
];\r
\r
useEffect(() => {\r
  // activeSemester 상태 변화 시 트리거\r
  const semesterItems = document.querySelectorAll(".semester-item");\r
\r
  semesterItems.forEach((item, index) => {\r
    const style = STEP_STYLES[activeSemester];\r
    const isActive = index === activeSemester;\r
\r
    gsap.to(item, {\r
      "--semester-angle": \`\${style.angle}deg\`,\r
      "--semester-tilt": \`\${style.tilt}deg\`,\r
      "--semester-radius-factor": style.radiusFactor,\r
      scale: isActive ? style.scale : style.scale * 0.8,\r
      opacity: isActive ? style.opacity : style.opacity * 0.5,\r
      duration: 0.5,\r
      ease: "power2.out",\r
    });\r
  });\r
}, [activeSemester]);\r
\`\`\`\r
\r
**동작:**\r
- \`activeSemester\` 상태 변화 → \`STEP_STYLES[activeSemester]\` 스타일 적용\r
- 활성 학기는 \`scale\` 크고 \`opacity\` 높음\r
- 비활성 학기는 작고 투명하게 표현\r
\r
---\r
\r
## 학기 선택 & 페이지 전환: handleSemesterClick\r
\r
\`\`\`javascript\r
const handleSemesterClick = (semesterId) => {\r
  // 1단계: ScrollTrigger 비활성화 및 애니메이션 일시정지\r
  scrollTriggerRef.current?.disable(false);\r
  masterTimelineRef.current?.pause();\r
\r
  // 2단계: CSS transition 임시 제거 (급격한 변화 방지)\r
  const archiveObject = archiveObjectRef.current;\r
  const archiveTitle = archiveTitleRef.current;\r
  const infoBox = infoBoxRef.current;\r
\r
  gsap.set([archiveObject, archiveTitle, infoBox], {\r
    transition: "none",\r
  });\r
\r
  // 3단계: 페이드아웃 애니메이션 타임라인\r
  const exitTl = gsap.timeline();\r
\r
  exitTl\r
    .to(\r
      archiveObject,\r
      {\r
        xPercent: -60,        // 왼쪽으로 빠져나감\r
        autoAlpha: 0.2,       // opacity: 0.2, visibility: visible 유지\r
        duration: 0.6,\r
        ease: "power2.in",\r
      },\r
      0\r
    )\r
    .to(\r
      archiveTitle,\r
      {\r
        xPercent: -60,\r
        autoAlpha: 0,         // 완전 사라짐\r
        duration: 0.6,\r
        ease: "power2.in",\r
      },\r
      0\r
    )\r
    .to(\r
      infoBox,\r
      {\r
        autoAlpha: 0,\r
        duration: 0.4,\r
        ease: "power2.in",\r
      },\r
      0.1  // 약간 지연되어 시작\r
    )\r
    .call(() => {\r
      // 4단계: 모든 애니메이션 완료 후 라우팅\r
      router.push(\`/gfArchive-txt?id=\${semesterId}\`);\r
    });\r
};\r
\`\`\`\r
\r
**페이드아웃 타이밍:**\r
\`\`\`\r
0ms ────── 300ms ────── 600ms ────── 1000ms\r
│           │           │            │\r
archiveObject: 애니메이션 시작 ─── 종료\r
archiveTitle:  애니메이션 시작 ─── 종료\r
infoBox:       (100ms 지연) ─── 종료 ──── 라우팅 시작\r
\`\`\`\r
\r
---\r
\r
## 메모리 관리 & 정리\r
\r
\`\`\`javascript\r
useEffect(() => {\r
  return () => {\r
    // 모든 GSAP 참조 정리\r
    heroScrollTweenRef.current?.kill();\r
    scrollTriggerRef.current?.kill();\r
    masterTimelineRef.current?.kill();\r
\r
    // ScrollTrigger의 복잡한 DOM 리스너 해제 필수\r
    // (없으면 페이지 전환 시 메모리 누수 발생)\r
  };\r
}, []);\r
\`\`\`\r
\r
**정리 이유:**\r
- \`heroScrollTweenRef\`: 스크롤 애니메이션 객체\r
- \`scrollTriggerRef\`: ScrollTrigger 인스턴스 (복잡한 scroll 리스너 등록)\r
- \`masterTimelineRef\`: 메인 타임라인 (모든 CSS 변경 및 콜백 포함)\r
\r
---\r
\r
## gfArchive-img 페이지: 학기별 이미지 갤러리\r
\r
### 동적 폴더 변환\r
\r
\`\`\`javascript\r
const SEMESTER_TO_FOLDER = {\r
  1: "1-1 imges",    // gfArchive.json의 semesterId를 폴더명으로 변환\r
  2: "1-2 imges",\r
  3: "2-1 imges",\r
  4: "2-2 imges",\r
};\r
\r
export async function getStaticProps({ params }) {\r
  const { id } = params;  // semesterId (1, 2, 3, 또는 4)\r
  const folderName = SEMESTER_TO_FOLDER[id];\r
  \r
  // /public/images/gfArchive/{folderName}/ 디렉토리의 이미지 로드\r
  const imageFiles = fs.readdirSync(\r
    path.join(process.cwd(), "public/images/gfArchive", folderName)\r
  );\r
\r
  return {\r
    props: {\r
      images: imageFiles.map((file) => ({\r
        src: \`/images/gfArchive/\${folderName}/\${file}\`,\r
        alt: file,\r
      })),\r
      semesterId: id,\r
      semesterLabel: \`\${Math.ceil(id / 2)}-\${id % 2 === 1 ? "1" : "2"}\`,\r
    },\r
    revalidate: 86400,  // 24시간 ISR\r
  };\r
}\r
\`\`\`\r
\r
**동작:**\r
1. 쿼리 파라미터로 학기 ID 수신 (\`?id=1\`)\r
2. \`SEMESTER_TO_FOLDER\` 맵에서 폴더명 조회\r
3. Next.js \`fs\` 모듈로 해당 폴더의 모든 이미지 파일 나열\r
4. **ISR (Incremental Static Regeneration)**로 24시간마다 재검증\r
\r
### 이미지 갤러리 렌더링\r
\r
\`\`\`javascript\r
export default function GfArchiveImg({ images, semesterId, semesterLabel }) {\r
  const [selectedImage, setSelectedImage] = useState(0);\r
\r
  return (\r
    <div className="gallery-container">\r
      <header>\r
        <h1>GetFever {semesterLabel} 이미지 아카이브</h1>\r
        <p>{images.length}개의 학생 작업물</p>\r
      </header>\r
\r
      <div className="main-image-section">\r
        <Image\r
          src={images[selectedImage].src}\r
          alt={\`학기별 이미지 \${selectedImage + 1}\`}\r
          width={1000}\r
          height={800}\r
          priority={selectedImage === 0}\r
          objectFit="contain"\r
        />\r
      </div>\r
\r
      <div className="thumbnail-grid">\r
        {images.map((image, idx) => (\r
          <button\r
            key={idx}\r
            onClick={() => setSelectedImage(idx)}\r
            className={selectedImage === idx ? "active" : ""}\r
          >\r
            <Image\r
              src={image.src}\r
              alt={\`썸네일 \${idx + 1}\`}\r
              width={150}\r
              height={150}\r
              objectFit="cover"\r
            />\r
          </button>\r
        ))}\r
      </div>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
---\r
\r
## gfArchive-txt 페이지: 학생 답변 아카이브\r
\r
### 학기별 탭과 답변 그룹화\r
\r
\`\`\`javascript\r
export default function GfArchiveTxt({ semesterId }) {\r
  const [activeTab, setActiveTab] = useState(0);\r
  const answersByGroup = buildAnswersByGroup();\r
\r
  const groupIdx = SEMESTER_TO_GROUP[semesterId];\r
  const answersInGroup = answersByGroup[groupIdx] || [];\r
\r
  const questions = QUESTION_GROUPS[groupIdx]?.questions || [];\r
\r
  return (\r
    <div className="archive-txt-container">\r
      <header>\r
        <h1>GetFever {SEMESTERS[groupIdx].label} 답변 아카이브</h1>\r
      </header>\r
\r
      <div className="questions-section">\r
        {questions.map((question, qIdx) => (\r
          <div key={qIdx} className="question-block">\r
            <h2>{question.title}</h2>\r
            <p className="subtitle">{question.subtitle}</p>\r
\r
            <div className="answers-grid">\r
              {answersInGroup.map((answer, idx) => (\r
                <div key={idx} className="answer-card">\r
                  <div className="answer-image">\r
                    {answer.imageUrl && (\r
                      <Image\r
                        src={answer.imageUrl}\r
                        alt={\`\${answer.nickName} 답변\`}\r
                        width={300}\r
                        height={300}\r
                        objectFit="cover"\r
                      />\r
                    )}\r
                  </div>\r
\r
                  <div className="answer-content">\r
                    <p className="answer-text">{answer.answer}</p>\r
                    <footer>\r
                      <span className="nickname">{answer.nickName}</span>\r
                      <span className="role">{answer.role}</span>\r
                    </footer>\r
                  </div>\r
                </div>\r
              ))}\r
            </div>\r
          </div>\r
        ))}\r
      </div>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
**데이터 흐름:**\r
1. \`semesterId\` → \`SEMESTER_TO_GROUP\` 변환 → \`groupIdx\`\r
2. \`buildAnswersByGroup()\` 결과에서 \`answersByGroup[groupIdx]\` 추출\r
3. 해당 그룹의 \`questions\` 배열 순회\r
4. 각 질문 아래 답변 카드 그리드 표시\r
\r
### 답변 카드 구조\r
\r
\`\`\`javascript\r
// 각 답변 카드는:\r
// 1. 학생 이미지 (선택사항)\r
// 2. 답변 텍스트\r
// 3. 학생 닉네임 + 역할 (footer)\r
\r
const answerCard = {\r
  studentId: "STU001",\r
  nickName: "Alex",           // 학기에 따라 nickName01 또는 nickName02\r
  answer: "Get Fever는...",  // 학생의 실제 답변 텍스트\r
  role: "Student",\r
  imageUrl: "/images/gfArchive/1/STU001.jpg",\r
};\r
\`\`\`\r
\r
---\r
\r
## 성능 최적화\r
\r
**동적 라우팅:**\r
- Next.js \`getStaticProps\` + ISR로 학기별 이미지 페이지 미리 생성\r
- 사용자는 캐시된 정적 페이지 즉시 로드\r
\r
**메모리 효율:**\r
- 타임라인 정리로 메모리 누수 방지\r
- ScrollTrigger 명시적 kill() 처리\r
\r
**애니메이션 동기화:**\r
- \`scrub: 0.8\`으로 부드러운 스크롤-애니메이션 동기화\r
- CSS 커스텀 프로퍼티로 효율적인 회전 제어\r
`;export{r as default};
