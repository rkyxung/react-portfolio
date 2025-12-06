import './styles/Projects.scss';
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';



const webProjects = [
  {
    title: 'PIVOT TIME',
    period: '2024.12 - 2025.01',
    role: '6인 팀 · 프로그래밍 담당',
    summary: '계원예술대학교 디지털미디어디자인과 2025 졸업전시를 위한 인터랙티브 웹사이트',
    details: [
      'main, getFever, curriculum, nav/footer, countDown 페이지 개발 전반 담당',
      'Main: GSAP ScrollTrigger로 스크롤 진행률에 연동된 3D/2D Pivot 모션을 구현, 3D 전시 아이덴티티를 첫 화면에서 직관적이고 다양한 인터랙션으로 경험하게 전달',
      'GetFever: 스크롤·마우스 입력을 결합해 반응하는 GSAP 기반 인터랙션 제작, “Fever(열기)”를 체험형 콘텐츠로 구현',
      'Curriculum: 학과 2년 로드맵을 인포그래픽 애니메이션으로 구성하고 Intersection Observer로 단계별 노출 처리',
    ],
    stack: ['React', 'Three.js', 'GSAP', 'Next.js'],
    siteLink: 'http://www.digital-media.kr/degreeshow/2025',
    githubLink: 'https://github.com/PivotTime/Pivot-web',
    codeReviewFolder: 'PIVOTTIME',
    iframeUrl: 'https://drive.google.com/file/d/17hhWN7qUuHmA3TpdEq04hyNf1NhNdLyz/preview?usp=sharing&rm=minimal',
  },
  {
    title: 'Spikle',
    period: '2025.03 - 2025.06',
    role: '3인 팀 · 프로그래밍 담당',
    summary: "혈당 스파이크 관리와 건강 습관 형성을 돕는 모바일 앱 'Spikle'을 소개하는 웹",
    details: [
      'Intersection Observer 기반으로 섹션 전환 트리거를 재정비해 스크롤 흐름 안정화',
      '호버/클릭 이벤트로 섹션 간 시각적 이동을 자연스럽게 연결',
      '앱의 핵심 기능, 사용자 여정, 디자인 시스템을 스크롤 중심 동선으로 풀어낸 정보 구조 구성',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
    siteLink: 'https://rkyxung.github.io/SPIKLE/',
    githubLink: 'https://github.com/rkyxung/SPIKLE',
    codeReviewFolder: 'SPIKLE',
    iframeUrl: 'https://drive.google.com/file/d/14CQCXaPZc7AHlMCq09ZX18qMufb3rzGy/preview?usp=sharing&rm=minimal',
  },
  {
    title: 'CODE404:\nSystem.themepark',
    period: '2025.03 - 2025.06',
    role: '1인 프로젝트',
    summary: '디지털 중독을 주제로, 가상 테마파크 시스템의 오류를 제한 시간 내 복구하며 탈출하는 1인칭 웹 방탈출 게임',
    details: [
      '10분 제한 시간, 오답 패널티가 포함된 시간 구조 구현',
      '드래그 앤 드롭 퍼즐, 오류 메시지, 난이도 상승 구조 등 단계별 퍼즐 메커니즘 설계',
      '글리치/색상 왜곡/배경음 등 시청각 연출을 통해 몰입감 강화',
      '선택 결과에 따라 탈출/실패로 나뉘는 멀티 엔딩 구성',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'Adobe Photoshop', 'Adobe Illustrator'],
    siteLink: 'https://rkyxung.github.io/CODE404-System.themapark/',
    githubLink: 'https://github.com/rkyxung/CODE404-System.themapark',
    codeReviewFolder: 'CODE404',
    iframeUrl: 'https://drive.google.com/file/d/1fSotnI12Q4ZGIxZB41UE6N65BmTBqT9n/preview?usp=sharing&rm=minimal',
  },
  {
    title: 'CLIMB ON',
    period: '2025.03 - 2025.06',
    role: '1인 프로젝트',
    summary: '클라이밍 입문자와 애호가를 위한 정보 플랫폼',
    details: [
      '랜덤 추천 기능: 배열 기반 루트 데이터 중 무작위 추천 구현',
      '찜하기(LocalStorage) 기능으로 사용자가 관심 루트를 저장 및 관리',
      '사용자 영상 업로드 후 로컬 저장 기능 제공',
      '카드 클릭, 탭 전환 등 UI 인터랙션 및 React Router 기반 페이지 전환 구성',
    ],
    stack: ['HTML', 'CSS', 'React', 'Adobe Photoshop'],
    siteLink: 'https://rkyxung.github.io/CLIMB-ON/',
    githubLink: 'https://github.com/rkyxung/CLIMB-ON',
    codeReviewFolder: 'CLIMBON',
    iframeUrl: 'https://drive.google.com/file/d/1KsrrmxYIgBFaK6VL87ct0W3CKy1JKL6b/preview?usp=sharing&rm=minimal',
  },
  {
    title: 'LUCY',
    period: '2024.09 - 2024.12',
    role: '1인 프로젝트',
    summary: "인디 밴드 ‘LUCY’를 소개하는 HTML/CSS 기반 팬 웹사이트",
    details: [
      '순수 CSS 기반 아코디언으로 상세 정보 확장 기능 구현',
      '클릭 이벤트 기반 앨범/멤버 모달 팝업 제작',
      '갤러리 슬라이더·캐러셀로 콘텐츠 이동 구성',
      '호버, 마퀴 등 CSS 시각 효과 적용',
    ],
    stack: ['HTML', 'CSS'],
    siteLink: 'https://rkyxung.github.io/LUCY/',
    githubLink: 'https://github.com/rkyxung/LUCY',
    codeReviewFolder: 'LUCY',
    iframeUrl: 'https://drive.google.com/file/d/162dNeWC1dOtD2hzoHaGrcVEojubCLB3z/preview?usp=sharing&rm=minimal',
  },
];

const unityProjects = [
  {
    title: '도시를 지켜라! \n드론의 습격',
    period: '2025.05 - 2025.06',
    role: '1인 프로젝트',
    summary: '도시를 침공한 드론을 물리치는 Unity 기반 슈팅 게임',
    details: [
      '멀티 시점 전환 카메라 기능 구현',
      'NavMesh 기반 적 AI 추적 시스템 구축',
      '보스 약점 패턴과 단계별 구조를 포함한 보스전 로직 설계',
      '조건 달성 여부에 따라 스테이지 흐름 제어',
    ],
    stack: ['Unity', 'C#'],
    iframeUrl: 'https://drive.google.com/file/d/1wASq-scSw8Kqxtght0Uwyj_8sBCPWvBQ/preview?usp=sharing&rm=minimal',
  },
  {
    title: "gayoung's space",
    period: '2024.05 - 2024.06',
    role: '1인 프로젝트',
    summary: '우주·행성 테마로 구성된 Unity 기반 3D 포트폴리오 공간',
    details: [
      '조건부 장면 전환 Flow 설계',
      '미디어 플레이어 기반 영상/이미지 재생 기능 구현',
      '3D 공간 내 콘텐츠 갤러리 배치',
      '오브젝트 애니메이션을 통한 시각 효과 구성',
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
    summary: '올림포스 12신들의 이야기를 소개하는 전시관 컨셉의 웹사이트',
    details: [
      '탐색 과정에서 스탬프 수집이 이뤄지는 게이미피케이션 구조 설계',
      '운명 카드 게임 요소로 사용자 선택 경험 제공',
      '12신 기반 전시관 콘셉트 디자인 및 시각화 구성',
    ],
    stack: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator'],
    iframeUrl: 'https://drive.google.com/file/d/1f1TFzUh8cxaA2Mo2yUhlUrlgQg6vXo2q/preview?usp=sharing&rm=minimal',
  },
  {
    title: '이웃집 토토로 3D',
    period: '2024.09 - 2024.12',
    role: '1인 프로젝트',
    summary: '지브리 ‘이웃집 토토로’를 3D 모델링과 영상으로 구현한 프로젝트',
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
      '산책 테마 기반 시각 디자인 콘셉트 구성',
      'Figma에서 UI/UX 구조 및 디자인 시스템 설계',
      'Adobe Photoshop으로 촬영 컷 편집 및 그래픽 제작',
    ],
    stack: ['Figma', 'Adobe Photoshop'],
    iframeUrl: 'https://drive.google.com/file/d/1ByYSPZC6ey3gvHJsvZnHiSkr6lu6TO7u/preview?usp=sharing&rm=minimal',
  },
];

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

// 섹션 구분을 위한 개수
const webCount = webProjects.length;
const unityCount = unityProjects.length;
const designStart = webCount + unityCount;

// 코드리뷰 마크다운 일괄 불러오기
const CODE_REVIEW_MAP = import.meta.glob('../codeReview/**/*.md', { as: 'raw' });

// 코드와 설명을 분리해 가독성을 높이는 파서
const parseCodeReviewContent = (raw) => {
  const CODE_BLOCK_RE = /```([\s\S]*?)```/g;
  const codeBlocks = [];
  const descriptionParts = [];
  let lastIndex = 0;
  let match;

  const stripSeparators = (chunk) =>
    chunk
      .split('\n')
      .filter((line) => !/^[-*_]{3,}$/.test(line.trim()))
      .join('\n')
      .trim();

  while ((match = CODE_BLOCK_RE.exec(raw)) !== null) {
    const before = raw.slice(lastIndex, match.index);
    const cleanBefore = stripSeparators(before);
    if (cleanBefore) descriptionParts.push(cleanBefore);

    const blockBody = match[1] || '';
    const [langLine = '', ...restLines] = blockBody.split('\n');
    const language = langLine.trim() || 'jsx';
    const codeText = restLines.join('\n');

    codeBlocks.push({ language, code: codeText });
    lastIndex = match.index + match[0].length;
  }

  const tail = raw.slice(lastIndex);
  const cleanTail = stripSeparators(tail);
  if (cleanTail) descriptionParts.push(cleanTail);

  const description = descriptionParts.join('\n\n').trim();
  const mergedCode = codeBlocks
    .map((block) => block.code)
    .filter(Boolean)
    .join('\n\n')
    .trim();

  return {
    description,
    language: codeBlocks[0]?.language || 'jsx',
    lines: mergedCode ? mergedCode.split('\n') : ['// 코드 블록이 없습니다'],
  };
};

function Projects() {
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [targetScroll, setTargetScroll] = useState(0);
  const [viewMode, setViewMode] = useState('video'); // 'video' or 'code'
  const [codeTabs, setCodeTabs] = useState([]);
  const [activeCodeTab, setActiveCodeTab] = useState(null);
  const requestRef = useRef();
  const isSnappingRef = useRef(false); // 프로젝트 간 스냅 중인지 여부
  const cardHeightRef = useRef(52.083); // 기본값 (1000px * 9 / 16 = 562.5px → 52.083vh, 1920x1080 기준)
  const stageContainerRef = useRef(null);
  const [codeTabDescription, setCodeTabDescription] = useState('');
  const initialProjectSetRef = useRef(false);

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
    setActiveCodeTab(null);
      setCodeTabs([]);
      setCodeTabDescription('');
      prevIndexRef.current = currentIndex;
    }
  }, [scrollProgress]);

  const handleWheel = (e) => {
    // 코드리뷰 모드에서는 프로젝트 간 스냅을 막고 기본 스크롤만 허용
    if (viewMode === 'code') return;

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

  // 코드리뷰 탭 로딩
  useEffect(() => {
    if (viewMode !== 'code') return;

    const loadTabs = async () => {
      try {
        const current = allProjects[Math.round(scrollProgress)];
        const folder = current.codeReviewFolder;
        if (!folder) {
          setCodeTabs([]);
          setActiveCodeTab(null);
          setCodeTabDescription('');
          return;
        }

        const entries = Object.entries(CODE_REVIEW_MAP).filter(([path]) =>
          path.includes(`/${folder}/`)
        );

        if (!entries.length) {
          setCodeTabs([]);
          setActiveCodeTab(null);
          setCodeTabDescription('');
          return;
        }

        const tabs = await Promise.all(
          entries.map(async ([path, loader]) => {
            const raw = await loader();
            const fileName = path.split('/').pop();
            const parsed = parseCodeReviewContent(raw);
            const baseName = fileName.replace(/\.[^/.]+$/, '');
            const normalized = baseName.toLowerCase();
            return {
              id: normalized,
              display: baseName,
              lines: parsed.lines,
              language: parsed.language,
              description: parsed.description,
            };
          })
        );

        const ORDER = ['main', 'getfever', 'curriculum', 'countdown', 'nav'];
        const sorted = tabs.sort((a, b) => {
          const ia = ORDER.indexOf(a.id);
          const ib = ORDER.indexOf(b.id);
          if (ia !== -1 && ib !== -1) return ia - ib;
          if (ia !== -1) return -1;
          if (ib !== -1) return 1;
          return a.display.localeCompare(b.display, 'en');
        });
        setCodeTabs(sorted);
        setActiveCodeTab(sorted[0]?.id || null);
        setCodeTabDescription(sorted[0]?.description || '');
      } catch (err) {
        console.error('code review load error', err);
        setCodeTabs([]);
        setActiveCodeTab(null);
        setCodeTabDescription('// 코드리뷰 파일을 불러오는 중 오류가 발생했습니다.');
      }
    };

    loadTabs();
  }, [viewMode, scrollProgress]);

  // 활성 탭 변경 시 설명 갱신
  useEffect(() => {
    const active = codeTabs.find((t) => t.id === activeCodeTab);
    if (active) {
      setCodeTabDescription(active.description || '');
    }
  }, [activeCodeTab, codeTabs]);

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
  const activeCode = codeTabs.find((t) => t.id === activeCodeTab);

  // 홈에서 넘어올 때 특정 프로젝트로 진입
  useEffect(() => {
    if (initialProjectSetRef.current) return;
    const targetName = location.state?.project;
    if (!targetName) return;

    const normalize = (str) =>
      str
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[:]/g, '')
        .replace(/\n/g, '');

    const target = normalize(targetName);
    const foundIndex = allProjects.findIndex((p) => normalize(p.title) === target);
    if (foundIndex >= 0) {
      setScrollProgress(foundIndex);
      setTargetScroll(foundIndex);
      prevIndexRef.current = foundIndex;
      initialProjectSetRef.current = true;
    }
  }, [location.state]);

  const isCodeView = viewMode === 'code';
  const isWebProject = currentIndex < webCount;

  const renderInlineTokens = (text) => {
    const parts = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: text.slice(lastIndex, match.index), bold: false });
      }
      parts.push({ text: match[1], bold: true });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), bold: false });
    }

    // 빈 배열이면 원문을 그대로 반환
    if (!parts.length) return [{ text, bold: false }];
    return parts;
  };

  const renderDescriptionLines = (text) => {
    if (!text) {
      return [
        <div key="empty" className="desc-line muted">
          코드리뷰 설명이 없습니다.
        </div>,
      ];
    }

    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      const isHeading1 = /^#\s+/.test(trimmed);
      const isHeading2 = /^##\s+/.test(trimmed);
      const isHeading3 = /^###\s+/.test(trimmed);
      const isHeading = isHeading1 || isHeading2 || isHeading3;
      const isSubHeading = isHeading2 || isHeading3;
      const isBullet = /^[-*]\s+/.test(trimmed);
      const isSpacer = trimmed === '';

      let content = trimmed;
      if (isHeading) content = content.replace(/^#{1,3}\s+/, '').trim();
      if (isBullet) content = content.replace(/^[-*]\s+/, '').trim();

      const classes = [
        'desc-line',
        isHeading ? 'heading' : '',
        isHeading1 ? 'heading-1' : '',
        isHeading2 ? 'heading-2' : '',
        isHeading3 ? 'heading-3' : '',
        isSubHeading ? 'subheading' : '',
        isBullet ? 'bullet' : '',
        isSpacer ? 'spacer' : '',
      ]
        .filter(Boolean)
        .join(' ');

      const inlineParts = renderInlineTokens(content || '');

      return (
        <div key={`${idx}-${content.slice(0, 8)}-${classes}`} className={classes}>
          {isSpacer
            ? '\u00A0'
            : inlineParts.map((part, i) =>
                part.bold ? (
                  <span key={`${idx}-b-${i}`} className="desc-strong">
                    {part.text}
                  </span>
                ) : (
                  <span key={`${idx}-t-${i}`}>{part.text}</span>
                )
              )}
        </div>
      );
    });
  };

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
                  <React.Fragment key={`nav-${index}`}>
                    {index === 0 && (
                      <li
                        className={`nav-section-title ${
                          currentIndex >= 0 && currentIndex < webCount ? 'active' : ''
                        }`}
                      >
                        Web Development
                      </li>
                    )}
                    {index === webCount && (
                      <li
                        className={`nav-section-title ${
                          currentIndex >= webCount && currentIndex < designStart ? 'active' : ''
                        }`}
                      >
                        Unity
                      </li>
                    )}
                    {index === designStart && (
                      <li
                        className={`nav-section-title ${
                          currentIndex >= designStart ? 'active' : ''
                        }`}
                      >
                        Design & Visual
                      </li>
                    )}
                    <li
                      className={`nav-item ${currentIndex === index ? 'active' : ''}`}
                      onClick={() => {
                        if (isSnappingRef.current) return;
                        isSnappingRef.current = true;
                        setTargetScroll(index);
                      }}
                    >
                      <span className="nav-title">{project.title}</span>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </aside>

            {/* 오른쪽: 프로젝트 설명 / 코드리뷰 설명 */}
            {allProjects[currentIndex] && (
              <aside className={`projects-info ${viewMode === 'code' ? 'code' : 'video'}`}>
                <div className="info-content">
                  {viewMode === 'code' ? (
                    <div className="code-description">
                      {renderDescriptionLines(codeTabDescription)}
                    </div>
                  ) : (
                    <>
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

                      {(allProjects[currentIndex].siteLink || allProjects[currentIndex].githubLink) && (
                        <div className="link-buttons">
                          {allProjects[currentIndex].siteLink && (
                            <a
                              href={allProjects[currentIndex].siteLink}
                              target="_blank"
                              rel="noreferrer"
                              className="link-button"
                            >
                              WEBSITE ↗
                            </a>
                          )}
                          {allProjects[currentIndex].githubLink && (
                            <a
                              href={allProjects[currentIndex].githubLink}
                              target="_blank"
                              rel="noreferrer"
                              className="link-button secondary"
                            >
                              GITHUB ↗
                            </a>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </aside>
            )}

            <div className="mask-overlay"></div>
            <div className="stage-container" ref={stageContainerRef}>
              {/* 토글 버튼 */}
              {isWebProject && (
                <div className="view-toggle" onClick={() => setViewMode(viewMode === 'video' ? 'code' : 'video')}>
                <div className="toggle-track">
                  <div className={`toggle-slider ${viewMode === 'code' ? 'active' : ''}`}>
                    {viewMode === 'video' ? (
                      <svg viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.1223 5.66696C11.2527 5.584 11.2527 5.3937 11.1223 5.31075L7.08226 2.73979C6.94172 2.65036 6.75781 2.75131 6.75781 2.9179V8.05981C6.75781 8.22639 6.94172 8.32735 7.08226 8.23791L11.1223 5.66696Z"
                          stroke="#FF5912"
                          strokeWidth="0.844437"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="0.421875"
                          y="0.422241"
                          width="16.0443"
                          height="10.1332"
                          rx="0.844437"
                          stroke="#FF5912"
                          strokeWidth="0.844437"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4.94911 4.94691L0.640625 9.25539L4.94911 13.5639M15.7203 4.94691L20.0288 9.25539L15.7203 13.5639M12.489 0.638428L8.18047 17.8724"
                          stroke="#EFF0F1"
                          strokeWidth="1.27659"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                </div>
              )}
              <div className={`card-stack ${isCodeView ? 'code-mode' : ''}`}>
                {allProjects.map((project, index) => (
                  <div
                    key={index}
                    className="card"
                    style={
                      isCodeView
                        ? index === currentIndex
                          ? { position: 'relative', transform: 'none', height: '100%', display: 'flex' }
                          : { display: 'none' }
                        : getCardStyle(index)
                    }
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
                        viewMode === 'code' ? (
                          <div className="info-part code-only">
                            <div className="code-editor-chrome">
                              <div className="code-tabs">
                                {codeTabs.length > 0 ? (
                                  codeTabs.map((tab) => (
                                    <span
                                      key={tab.id}
                                      className={`code-tab ${activeCodeTab === tab.id ? 'active' : ''}`}
                                      onClick={() => setActiveCodeTab(tab.id)}
                                    >
                                      {tab.display}
                                    </span>
                                  ))
                                ) : (
                                  <span className="code-tab active">code review</span>
                                )}
                              </div>
                            </div>
                            <div className="code-window">
                              {(() => {
                                if (!codeTabs.length || !activeCodeTab) {
                                  return (
                                    <div className="code-line comment">
                                      // codeReview 폴더에 매칭되는 마크다운이 없습니다
                                    </div>
                                  );
                                }
                                const active = codeTabs.find((t) => t.id === activeCodeTab) || codeTabs[0];
                                const codeText = active.lines.join('\n');
                                return (
                                  <SyntaxHighlighter
                                    language={active.language || 'jsx'}
                                    style={vscDarkPlus}
                                    showLineNumbers
                                    wrapLongLines
                                    className="code-block"
                                    customStyle={{
                                      background: 'transparent',
                                      margin: 0,
                                      padding: '1.2vw',
                                      fontSize: '1.04vw', // 1.2x
                                      lineHeight: 1.6,
                                    }}
                                    codeTagProps={{
                                      style: {
                                        fontSize: '0.95vw',
                                        lineHeight: 1.65,
                                      },
                                    }}
                                  >
                                    {codeText}
                                  </SyntaxHighlighter>
                                );
                              })()}
                            </div>
                          </div>
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

                              {(project.siteLink || project.githubLink) && (
                                <div className="link-icons">
                                  {project.siteLink && (
                                    <a
                                      href={project.siteLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="link-icon"
                                    >
                                      ↗
                                    </a>
                                  )}
                                  {project.githubLink && (
                                    <a
                                      href={project.githubLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="link-icon"
                                    >
                                      GH
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </>
                        )
                      )}
                    </div>
                  </div>
                )).filter(Boolean)}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Projects;
