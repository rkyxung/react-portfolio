import './styles/Projects.scss';
// --- 프로젝트 데이터 ---

// 프로젝트 네비게이션 리스트 (이미지 기준)
const projectNavList = [
  { id: 1, title: 'PIVOT TIME!' },
  { id: 2, title: 'Project H.' },
  { id: 3, title: '빛결' },
  { id: 4, title: 'BEYOND THE ABYSS' },
  { id: 5, title: 'Log!n' },
  { id: 6, title: 'MEMO :RE' },
  { id: 7, title: '아트랑' },
  { id: 8, title: 'Qpid' },
  { id: 9, title: 'NOL:EUM' },
  { id: 10, title: 'Pinimo' },
  { id: 11, title: 'Melt0°C' },
  { id: 12, title: 'Evidence: Cliker' },
  { id: 13, title: 'J와P' },
  { id: 14, title: 'Boutine' },
  { id: 15, title: 'O.K' },
  { id: 16, title: '피하몽' },
  { id: 17, title: '돈쭐' },
  { id: 18, title: 'COPS' },
  { id: 19, title: '한올' },
  { id: 20, title: 'Gyeob' },
];

const webProjects = [
  {
    title: 'PIVOT TIME',
    period: '2024.12 - 2025.01',
    role: '팀 프로젝트',
    summary: '계원예술대학교 디지털미디어디자인과 2025 졸업전시 웹',
    details: [
      '전시의 주제인 \'PIVOT\'과 학생들의 열정을 시각적으로 전달하기 위해',
      '정적인 정보 전달을 넘어 사용자가 직접 참여하고 몰입할 수 있는 인터랙티브 웹을 구현했습니다.',
    ],
    stack: ['React', 'Three.js', 'GSAP'],
    iframeUrl: 'https://drive.google.com/file/d/17hhWN7qUuHmA3TpdEq04hyNf1NhNdLyz/preview?usp=sharing&rm=minimal',
  },
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
    iframeUrl: 'https://drive.google.com/file/d/14CQCXaPZc7AHlMCq09ZX18qMufb3rzGy/preview?usp=sharing&rm=minimal',
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
    iframeUrl: 'https://drive.google.com/file/d/1fSotnI12Q4ZGIxZB41UE6N65BmTBqT9n/preview?usp=sharing&rm=minimal',
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
    iframeUrl: 'https://drive.google.com/file/d/1KsrrmxYIgBFaK6VL87ct0W3CKy1JKL6b/preview?usp=sharing&rm=minimal',
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
    iframeUrl: 'https://drive.google.com/file/d/162dNeWC1dOtD2hzoHaGrcVEojubCLB3z/preview?usp=sharing&rm=minimal',
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
    iframeUrl: 'https://drive.google.com/file/d/1wASq-scSw8Kqxtght0Uwyj_8sBCPWvBQ/preview?usp=sharing&rm=minimal',
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
    iframeUrl: 'https://drive.google.com/file/d/1dvHx_ytMvkn5hrjRAgX_BiD5CiH1l4Ik/preview?usp=sharing&rm=minimal',
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
    iframeUrl: 'https://drive.google.com/file/d/1f1TFzUh8cxaA2Mo2yUhlUrlgQg6vXo2q/preview?usp=sharing&rm=minimal',
  },
  {
    title: '이웃집 토토로 3D',
    period: '2024.09 - 2024.12',
    role: '1인 프로젝트',
    summary: '지브리 "이웃집 토토로"를 3D 모델링과 영상으로 재해석',
    details: [
      '3ds Max로 배경과 캐릭터 모델을 제작',
      'Adobe Premiere Pro로 영상 편집 및 음향 작업',
    ],
    stack: ['3ds Max', 'Adobe Premiere Pro'],
    iframeUrl: 'https://drive.google.com/file/d/1V5GJUN1nrO4R9yfJ2odEqHsGN80r-DyE/preview?usp=sharing&rm=minimal',
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
    iframeUrl: 'https://drive.google.com/file/d/1ByYSPZC6ey3gvHJsvZnHiSkr6lu6TO7u/preview?usp=sharing&rm=minimal',
  },
];
import React, { useEffect, useState, useRef } from 'react';

// 모든 프로젝트를 하나의 배열로 합치고, 카테고리와 색상 정보를 추가
const allProjects = [
  ...webProjects.map((p) => ({
    ...p,
    category: 'WEB / INTERACTIVE',
    color: '#FF6B6B',
  })),
  ...unityProjects.map((p) => ({
    ...p,
    category: 'GAME / UNITY',
    color: '#4ECDC4',
  })),
  ...designProjects.map((p) => ({
    ...p,
    category: 'DESIGN / VISUAL',
    color: '#C792EA',
  })),
];

// --- Config ---
// 카드 높이는 CSS의 aspect-ratio로 자동 계산됨 (16:9)
// 넓이 기준으로 높이 계산: 넓이 * 9 / 16

function Projects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [targetScroll, setTargetScroll] = useState(0);
  const [viewMode, setViewMode] = useState('video'); // 'video' or 'code'
  const requestRef = useRef();
  const isSnappingRef = useRef(false); // 프로젝트 간 스냅 중인지 여부
  const cardHeightRef = useRef(52.083); // 기본값 (1000px * 9 / 16 = 562.5px → 52.083vh, 1920x1080 기준)
  const stageContainerRef = useRef(null);

  // 카드 높이 계산 (16:9 비율)
  useEffect(() => {
    const updateCardHeight = () => {
      if (stageContainerRef.current) {
        const width = stageContainerRef.current.offsetWidth;
        // 16:9 비율로 높이 계산 (vh 단위)
        // 넓이를 vw로 변환한 후 9/16을 곱하면 vh가 됨
        // 1920px 기준: width(px) / 1920 * 100 = width(vw)
        // height(vh) = width(vw) * 9 / 16
        const widthVw = (width / 1920) * 100;
        cardHeightRef.current = widthVw * 9 / 16; // vh 단위
      }
    };

    updateCardHeight();
    window.addEventListener('resize', updateCardHeight);
    return () => window.removeEventListener('resize', updateCardHeight);
  }, []);

  // --- Animation Loop for Smooth Scrolling ---
  const animate = () => {
    setScrollProgress(prev => {
      const diff = targetScroll - prev;
      if (Math.abs(diff) < 0.001) {
        // 목표 위치에 정확히 도달하면 정수로 스냅 (밀림 방지)
        if (isSnappingRef.current) {
          isSnappingRef.current = false;
        }
        // 정수 인덱스로 정확히 스냅
        return Math.round(targetScroll);
      }
      return prev + diff * 0.07; // 애니메이션 속도 조정 (낮을수록 느림)
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [targetScroll]);

  // 프로젝트 카드가 변경될 때 viewMode를 'video'로 리셋
  const prevIndexRef = useRef(Math.round(scrollProgress));

  useEffect(() => {
    const currentIndex = Math.round(scrollProgress);
    if (prevIndexRef.current !== currentIndex) {
      // 프로젝트가 변경되었을 때
      setViewMode('video');
      prevIndexRef.current = currentIndex;
    }
  }, [scrollProgress]);

  const handleWheel = (e) => {
    e.preventDefault();

    const delta = e.deltaY;

    // 스냅 애니메이션 중이면 추가 입력 무시
    if (isSnappingRef.current) return;

    // 너무 작은 입력(트랙패드 미세 흔들림)은 무시
    if (Math.abs(delta) < 5) return;

    const direction = delta > 0 ? 1 : -1; // 아래로 스크롤: 다음 프로젝트, 위로 스크롤: 이전 프로젝트

    // 현재 정확한 인덱스 계산 (scrollProgress 기준으로 정확히 계산)
    const currentIndex = Math.round(scrollProgress);
    const nextIndex = Math.max(
      0,
      Math.min(allProjects.length - 1, currentIndex + direction)
    );

    if (nextIndex === currentIndex) return;

    // 다음 프로젝트 인덱스로 정확히 스냅 (정수로 설정)
    isSnappingRef.current = true;
    setTargetScroll(nextIndex); // 정수 인덱스로 정확히 설정
  };

  // --- Calculate Transform based on diagram ---
  const getCardStyle = (index) => {
    // offset: 0 = Center, -1 = Top, +1 = Bottom
    const offset = index - scrollProgress;
    const absOffset = Math.abs(offset);
    
    // Only render visible range
    if (absOffset > 2) return { display: 'none' };

    // --- Key Logic for Concave Fold Layout (< shape) ---
    
    // 1. Rotation:
    // Top card (offset < 0) should tilt towards user (Top edge Front, Bottom edge Back) -> rotateX(-angle)
    // Bottom card (offset > 0) should tilt towards user (Top edge Back, Bottom edge Front) -> rotateX(+angle)
    // Formula: rotateX( offset * 45deg )
    // -1 -> -45deg (/)
    // 0 -> 0deg (|)
    // 1 -> 45deg (\)
    const rotateX = offset * 45;

    // 2. Y Position:
    // Linear stacking (vh 단위 사용)
    const translateY = offset * cardHeightRef.current;

    // 3. Z Position (Convex effect):
    // Center is closest to user. Edges go further back.
    // As offset increases, push it backward.
    // translateZ( -abs(offset) * Depth ) - vw 단위로 변환 (80px → 4.167vw, 1920px 기준)
    const translateZ = -absOffset * 4.167; 

    // 4. Opacity/Brightness
    const opacity = 1 - Math.min(absOffset, 1) * 0.5; // Fade out non-center
    const scale = 1 - Math.min(absOffset, 1) * 0.05; // Slight scale down for depth

    return {
      transform: `translateY(${translateY}vh) translateZ(${translateZ}vw) rotateX(${rotateX}deg) scale(${scale})`,
      opacity: Math.max(0, 1 - absOffset * 0.8), // Fade out distant cards
      zIndex: 100 - Math.round(absOffset * 10),
      filter: `brightness(${1 - absOffset * 0.6})` // Darken distant cards
    };
  };

  const currentIndex = Math.round(scrollProgress);

  return (
    <div className="projects-viewport">
      <div className="viewport" onWheel={handleWheel}>
        <div className="planes">
          {/* 중앙면: 기존 카드 스택 */}
          <section className="plane plane-middle">
            {/* 왼쪽: 프로젝트 네비게이션 */}
            <aside className="projects-nav">
              <ul className="nav-list">
                {allProjects.map((project, index) => (
                  <li
                    key={index}
                    className={`nav-item ${currentIndex === index ? 'active' : ''}`}
                    onClick={() => {
                      if (isSnappingRef.current) return;
                      isSnappingRef.current = true;
                      setTargetScroll(index);
                    }}
                  >
                    <span className="nav-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="nav-title">{project.title}</span>
                  </li>
                ))}
              </ul>
            </aside>

            {/* 오른쪽: 프로젝트 설명 */}
            {allProjects[currentIndex] && (
              <aside className="projects-info">
                <div className="info-content">
                  <div className="info-header">
                    <h2 className="project-title">{allProjects[currentIndex].title}</h2>
                  </div>
                  
                  <div className="info-meta">
                    <span className="role">{allProjects[currentIndex].role}</span>
                    <span className="period">{allProjects[currentIndex].period}</span>
                  </div>

                  <p className="summary">{allProjects[currentIndex].summary}</p>

                  {allProjects[currentIndex].details && allProjects[currentIndex].details.length > 0 && (
                    <ul className="details-list">
                      {allProjects[currentIndex].details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  )}

                  <div className="tags">
                    {allProjects[currentIndex].stack.map((s) => (
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </div>

                  {allProjects[currentIndex].link && (
                    <a
                      href={allProjects[currentIndex].link}
                      target="_blank"
                      rel="noreferrer"
                      className="link-button"
                    >
                      VIEW PROJECT ↗
                    </a>
                  )}
                </div>
              </aside>
            )}

            <div className="mask-overlay"></div>
            <div className="stage-container" ref={stageContainerRef}>
              {/* 토글 버튼 */}
              <div className="view-toggle" onClick={() => setViewMode(viewMode === 'video' ? 'code' : 'video')}>
                <div className="toggle-track">
                  <div className={`toggle-slider ${viewMode === 'code' ? 'active' : ''}`}>
                    {viewMode === 'video' ? (
                      <svg width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.4218 8.87814C17.626 8.74818 17.626 8.45004 17.4218 8.32008L11.0923 4.29222C10.8721 4.1521 10.584 4.31027 10.584 4.57125V12.627C10.584 12.8879 10.8721 13.0461 11.0923 12.906L17.4218 8.87814Z" stroke="#fff" strokeWidth="1.32296" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="0.661621" y="0.662109" width="25.1362" height="15.8755" rx="1.32296" stroke="#fff" strokeWidth="1.32296" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="33" height="29" viewBox="0 0 33 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.75 7.75L1 14.5L7.75 21.25M24.625 7.75L31.375 14.5L24.625 21.25M19.5625 1L12.8125 28" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-stack">
                {allProjects.map((project, index) => (
                  <div
                    key={index}
                    className="card"
                    style={getCardStyle(index)}
                  >
                    <div className="card-content">
                      {/* 모든 iframe을 미리 렌더링하여 로딩 속도 향상 */}
                      {project.iframeUrl && (
                        <iframe
                          key={`${index}-${currentIndex}-${viewMode}`} // 프로젝트 변경 또는 viewMode 변경 시 리마운트하여 비디오 정지
                          src={viewMode === 'video' && index === currentIndex ? project.iframeUrl : ''} // 보이지 않을 때는 src를 빈 문자열로 설정하여 정지
                          className={`project-iframe ${viewMode === 'video' && index === currentIndex ? 'visible' : 'hidden'}`}
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          frameBorder="0"
                          loading="lazy"
                        />
                      )}
                      {/* viewMode에 따라 비디오 또는 코드 리뷰 표시 */}
                      {viewMode === 'video' ? (
                        !project.iframeUrl ? (
                          <div className="no-video-message">
                            <p>비디오가 없습니다</p>
                          </div>
                        ) : null
                      ) : (
                        <>
                          <div
                            className="visual-part"
                            style={{
                              background: `linear-gradient(135deg, #111, ${project.color} 400%)`,
                            }}
                          >
                            <span className="visual-bg-text">
                              {project.title.substring(0, 3)}
                            </span>
                            <h2>{project.title}</h2>
                          </div>

                          <div className="info-part">
                            <div className="info-header">
                              <span className="role">{project.role}</span>
                              <span className="period">{project.period}</span>
                            </div>

                            <p className="summary">{project.summary}</p>

                            <div className="tags">
                              {project.stack.map((s) => (
                                <span key={s} className="tag">
                                  {s}
                                </span>
                              ))}
                            </div>

                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="link-icon"
                              >
                                ↗
                              </a>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Projects;