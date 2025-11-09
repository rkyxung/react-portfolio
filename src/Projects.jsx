const webProjects = [
  {
    title: 'Spike',
    period: '2025.03 - 2025.06',
    role: '3인 팀 · 프론트엔드',
    summary: "혈당 스파이크 관리와 건강 습관 형성을 돕는 모바일 앱 'Spike'을 소개하는 웹",
    details: [
      '앱의 기획 맵, 핵심 기능, 디자인 시스템을 스크롤 동선으로 풀어내 사용자 몰입도를 높임',
      'Intersection Observer 기반 구간 전환으로 스크롤 애니메이션 안정화',
      '스와이프 인터랙션과 카드형 레이아웃으로 자연스럽게 이어지는 정보 흐름 설계',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://rkyxung.github.io/SPIKLE/',
  },
  {
    title: 'CODE404:System.themepark',
    period: '2025.03 - 2025.06',
    role: '1인 프로젝트',
    summary: '디지털 동물들을 구출하며 시스템 오류를 복구하는 1인칭 웹 방탈출 게임',
    details: [
      '테마파크 맵을 순환하며 오류를 추적하고 복구하는 스토리 구조 설계',
      '10분 단위 이벤트와 실시간 전달 메시지를 분리해 오류 재현 및 해결 프로세스 구현',
      '드론 AI 조력자와 보스 전투 플로우를 JS 로직으로 직접 구성',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'Adobe Photoshop', 'Adobe Illustrator'],
    link: 'https://rkyxung.github.io/CODE404-System.themepark/',
  },
  {
    title: 'CLIMB ON',
    period: '2025.03 - 2025.06',
    role: '1인 프로젝트',
    summary: '클라이밍 입문자와 애호가를 위한 정보 플랫폼',
    details: [
      '난이도·장비·스트레칭 등 정보를 카드형 UI로 구성해 한 페이지에서 비교 가능',
      '추천 루트 데이터와 장비 선택 팁을 섹션 별로 노출하고 LocalStorage로 즐겨찾기 저장',
      'React Router 없이 순수 HTML/CSS/JS 조합으로 멀티 섹션 전환 구현',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    link: 'https://rkyxung.github.io/CLIMB-ON/',
  },
  {
    title: 'LUCY',
    period: '2024.09 - 2024.12',
    role: '1인 프로젝트',
    summary: "인디 밴드 'LUCY'를 위한 HTML/CSS 기반 팬 웹사이트",
    details: [
      '앨범, 멤버, 공연 콘텐츠를 섹션 별로 정리해 팬들이 쉽게 탐색하도록 구성',
      '순수 CSS 기반의 슬라이드형 갤러리와 정보 정렬 기능 구현',
      '음악/영상 콘텐츠를 카드 UI로 배치해 정보성과 감성을 동시에 전달',
    ],
    stack: ['HTML', 'CSS'],
    link: 'https://rkyxung.github.io/LUCY/',
  },
];

const unityProjects = [
  {
    title: '도시를 지켜라! 드론의 습격',
    period: '2025.05 - 2025.06',
    role: '1인 프로젝트',
    summary: '도시를 침공한 드론을 물리치는 Unity 기반 슈팅 게임',
    details: [
      'NavMesh 기반 적 이동과 멀티 시점 카메라 전환으로 몰입감 강화',
      '충격 역전 패턴을 활용한 보스전 설계와 스테이지 플로우 제어',
      '조건 분기와 이벤트 트리거를 분리해 오류 발생 구간의 원인을 추적',
    ],
    stack: ['Unity', 'C#'],
  },
  {
    title: "gayoung's space",
    period: '2024.05 - 2024.06',
    role: '1인 프로젝트',
    summary: 'Unity 기반 우주 테마 3D 공간 포트폴리오',
    details: [
      '콘솔 상호작용과 오브젝트 애니메이션으로 브랜드 스토리를 전달',
      '3D 천장 UI와 이미지 갤러리로 프로젝트를 배치',
      'VR 시야감을 고려한 카메라 트랜지션 구성',
    ],
    stack: ['Unity', 'C#'],
  },
];

const designProjects = [
  {
    title: 'TWELVE OLYMPIANS',
    period: '2024.09 - 2024.12',
    role: '1인 프로젝트',
    summary: '올림포스 12신들의 이야기를 소개하는 컨셉 웹사이트',
    details: [
      '신화 정보 탐색과 수집형 카드 요소를 결합해 케이퍼페이션 경험 제공',
      '운영 요소: 중복 카드 획득에 따른 기여도 집계',
      '컨셉 디자인: 12신 기반 전시관 콘셉트 브랜딩',
    ],
    stack: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator'],
  },
  {
    title: '이웃집 토토로 3D',
    period: '2024.09 - 2024.12',
    role: '1인 프로젝트',
    summary: '지브리 “이웃집 토토로”를 3D 모델링과 영상으로 재해석',
    details: [
      '3ds Max로 배경과 캐릭터 모델을 제작',
      'Adobe Premiere Pro로 영상 편집 및 음향 작업',
    ],
    stack: ['3ds Max', 'Adobe Premiere Pro'],
  },
  {
    title: 'WALK & STROLL',
    period: '2024.05 - 2024.06',
    role: '1인 프로젝트',
    summary: '산책 아이콘을 테마로 한 개인 프로필 프로젝트',
    details: [
      '일러스트 기반의 UI/UX 섹션 설계',
      'Figma에서 디자인 시스템을 정리하고 포트폴리오로 확장',
      'Adobe Photoshop으로 촬영 컷 편집 및 그래픽 제작',
    ],
    stack: ['Figma', 'Adobe Photoshop'],
  },
];

function Projects() {
  const renderGroup = (title, list) => (
    <div className="project-group" key={title}>
      <h2>{title}</h2>
      {list.map((project) => (
        <article key={project.title} className="project-row">
          <header>
            <div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </div>
            <div className="project-meta">
              <span>{project.role}</span>
              <span>{project.period}</span>
            </div>
          </header>
          <ul>
            {project.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <div className="tag-row">
            {project.stack.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {project.link && (
            <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
              결과 보기
            </a>
          )}
        </article>
      ))}
    </div>
  );

  return (
    <section className="section projects-section">
      <header className="section-header">
        <p className="eyebrow">Projects</p>
        <h1>웹 · 게임 · 디자인 작업</h1>
      </header>
      {renderGroup('Web Development', webProjects)}
      {renderGroup('Unity / Interactive', unityProjects)}
      {renderGroup('Design & Visual', designProjects)}
    </section>
  );
}

export default Projects;
