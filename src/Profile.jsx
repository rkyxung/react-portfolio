import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles/Profile.scss';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

function Profile() {
  // 스크롤 스냅 관련
  const profileContainerRef = useRef(null);
  const frontSectionRef = useRef(null);
  const backSectionRef = useRef(null);
  const toolSectionRef = useRef(null);
  const isScrollingRef = useRef(false);
  const [currentSection, setCurrentSection] = useState(0); // 0: profile, 1: front, 2: back, 3: tool
  const currentSectionRef = useRef(0);
  
  // 스킬 관련
  const [selectedSkill, setSelectedSkill] = useState(null);
  const skillsLeftRef = useRef(null);
  const skillsRightRef = useRef(null);
  const skillNameRef = useRef(null);
  const skillDescriptionRef = useRef(null);
  const [scrambledText, setScrambledText] = useState('');
  const [descriptionOpacity, setDescriptionOpacity] = useState(1);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const skillsContainerRef = useRef(null); // 스킬 섹션 전체 컨테이너

  // 1. 타이핑 효과를 위한 상태값 관리
  const [text, setText] = useState('');
  const [count, setCount] = useState(0); // 현재 문장의 인덱스
  const [isDeleting, setIsDeleting] = useState(false); // 지우는 중인지 여부

  // 2. 롤링할 문구 배열 정의
  const txtArr = [
    "끝까지 밀어붙이는 끈기를 가진",
    "웹에 생동감을 불어넣는",
    "상상을 실제 인터랙션으로 구현하는",
    "사용자의 시선을 사로잡는 순간을 만드는"
  ];

  // 정적 자산 base 경로 (base가 /zero 인 경우를 포함)
  const assetBase = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');

  // 스킬 이름을 이미지 파일명으로 매핑하는 함수
  const getSkillImage = (skillName) => {
    const imageMap = {
      'HTML5': 'html.svg',
      'CSS3 / SCSS': 'scss.svg',
      'JavaScript': 'JS.svg',
      'React': 'react.svg',
      'Next.js': 'next.svg',
      'GSAP': 'gsap.svg',
      'Three.js': 'threeJS.svg',
      'Node.js': 'nodeJS.svg',
      'MongoDB': 'mongoDB.svg',
      'Unity': 'unity.svg',
      'C#': 'c-script.svg',
      'Git': 'git.svg',
      'GitHub': 'github.svg',
      'Figma': 'figma.svg',
      'Illustrator': 'illustrator.svg',
      'Photoshop': 'photoshop.svg'
    };
    return imageMap[skillName] || null;
  };

  // 스킬 데이터
  const skillsData = {
    front: [
      { 
        name: 'HTML5', 
        description: '시맨틱 마크업과 ARIA로 접근성을 갖춘 구조 작성, 반응형 레이아웃과 CSS 애니메이션으로 인터랙티브 UI 설계' 
      },
      { 
        name: 'CSS3 / SCSS', 
        description: 'SCSS 변수·믹스인으로 모듈화, 플렉스/그리드 기반 반응형, 트랜지션·키프레임을 활용한 UI 동작 구현'
      },
      { 
        name: 'JavaScript', 
        description: '이벤트 제어, 비동기(Fetch/Promise) 처리, 상태 기반 렌더링으로 동적 인터랙션 구현' 
      },
      { 
        name: 'React', 
        description: '함수형 컴포넌트/Hooks, 상태 관리(useState/useEffect/context), 라우팅과 재사용 컴포넌트 설계' 
      },
      // 이미지는 Next.js, GSAP, Three.js 없음 → 변경 금지
      { name: 'Next.js', description: '동적 라우팅과 API Routes로 React 프로젝트 구성' },
      { name: 'GSAP', description: 'ScrollTrigger·Timeline으로 스크롤 연동 인터랙션과 정교한 애니메이션 시퀀스 제작' },
      { name: 'Three.js', description: '씬/카메라/라이트 구성, 모델 로딩·애니메이션으로 인터랙티브 3D 경험 구현' }
    ],
    
    back: [
      { name: 'Node.js', description: '간단한 Express 라우팅과 라이브러리 연동, 미들웨어·인증·에러 처리 등 기본 서버 사이드 로직 구성 경험' },
      { name: 'MongoDB', description: '스키마 정의 후 CRUD(POST/GET/PUT/DELETE) 처리, Mongoose로 기본 ODM 사용' },
    
      {
        name: 'Unity',
        description: 'Physics/Timeline 활용, 충돌 감지·트리거 이벤트, 카메라/오브젝트 제어로 프로토타입 구현'
      },
      {
        name: 'C#',
        description: '게임플레이 로직 스크립팅, 상태·이벤트 기반 흐름 제어, 간단한 VR/인터랙션 기능 구현'
      }
    ],
    
    tool: [
      { name: 'Git', description: 'add/commit/push로 버전 관리, 기본 브랜치·PR 사용 경험' },
      { name: 'GitHub', description: '원격 저장소 관리, 간단한 CI 빌드/배포 트리거 경험' },
    
      {
        name: 'Figma',
        description: 'UI 설계·프로토타이핑, 오토레이아웃·컴포넌트 라이브러리로 디자인 시스템 정리'
      },
      {
        name: 'Illustrator',
        description: '벡터 로고·아이콘 등 그래픽 제작 가능'
      },
      {
        name: 'Photoshop',
        description: '이미지 보정·합성 등 그래픽 제작 가능'
      }
    ],
    
  };

  // 3. 타이핑 로직 구현
  useEffect(() => {
    const currentText = txtArr[count];
    
    // 타이핑 속도 조절 (글자 쓸 때: 100ms, 지울 때: 50ms)
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting && text === currentText) {
        // 문장이 완성되면 잠시 대기 후 지우기 모드로 변경 (2초 대기)
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        // 다 지워지면 다음 문장으로 넘어감
        setIsDeleting(false);
        setCount((prev) => (prev + 1) % txtArr.length);
      } else {
        // 글자를 하나씩 추가하거나 삭제
        setText(prev => 
          isDeleting 
            ? currentText.substring(0, prev.length - 1) 
            : currentText.substring(0, prev.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, count]);

  // 스크롤 감도 및 속도 설정
  const SCROLL_CONFIG = {
    minScrollDelta: 1,        // 스크롤 감지 최소값 (낮을수록 민감) - 트랙패드 지원
    scrollDuration: 1.2,        // 스크롤 애니메이션 속도 (초) - 낮을수록 빠름
    scrollEase: 'power2.inOut', // 이징 함수: 'power1', 'power2', 'power3', 'power4', 'expo', 'sine' 등
    profileThreshold: 0.3,      // Profile 섹션 감지 임계값 (0~1)
    skillsThreshold: 0.7,        // Skills 섹션 감지 임계값 (0~1)
  };

  // 홈 진입 시 항상 첫 섹션으로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // currentSection 동기화 (ref)
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  // 섹션 변경 시 선택 스킬 초기화 + 기본 값으로 표시
  useEffect(() => {
    const fallback = getFallbackSkill();
    setSelectedSkill(null);
    setScrambledText(fallback.name || '');
    // 페이드인 초기 상태로 리셋
    setIsFadingIn(false);
    setDescriptionOpacity(0);
    // 다음 프레임에서 페이드인 (느리게 보이도록 약간 지연)
    setTimeout(() => {
      setIsFadingIn(true);
      setDescriptionOpacity(1);
    }, 80);
  }, [currentSection]);

  // ... 기존 import 및 설정 유지

  // 스크롤 스냅 구현
  useEffect(() => {
    if (!profileContainerRef.current || !frontSectionRef.current || !backSectionRef.current || !toolSectionRef.current) return;

    const handleWheel = (e) => {
      // [수정 포인트 1] 무조건 브라우저의 기본 스크롤 동작부터 막습니다.
      // 이렇게 해야 아주 작은 휠 움직임에도 브라우저가 멋대로 화면을 움직이지 않습니다.
      if (e.cancelable) {
        e.preventDefault();
      }

      // [수정 포인트 2] 애니메이션 중이면 함수 종료 (이미 preventDefault는 위에서 했음)
      if (isScrollingRef.current) return;

      const scrollDelta = e.deltaY;
      
      // [수정 포인트 3] 감도 체크: 감도 미만이면 '동작'만 안 할 뿐, 스크롤은 이미 위에서 막혀있음 -> 화면 고정됨
      if (Math.abs(scrollDelta) < SCROLL_CONFIG.minScrollDelta) {
        return;
      }

      // 모든 섹션 위치 배열
      const positions = [
        profileContainerRef.current.offsetTop,
        frontSectionRef.current.offsetTop,
        backSectionRef.current.offsetTop,
        toolSectionRef.current.offsetTop
      ];

      // 현재 섹션 인덱스는 상태 ref 기준으로만 계산 (가장 가까운 섹션 탐색 없음)
      const currentIdx = currentSectionRef.current;
      const direction = scrollDelta > 0 ? 1 : -1;
      const nextIdx = Math.min(Math.max(currentIdx + direction, 0), positions.length - 1);

      // 이미 해당 섹션이면 아무것도 안 함
      if (nextIdx === currentIdx) return;

      // 진행 중 애니메이션 중단 후 한 번만 스냅
      gsap.killTweensOf(window);
      isScrollingRef.current = true;

      // 스냅 동안 패럴랙스 ScrollTrigger 비활성화
      const triggers = ScrollTrigger.getAll();
      triggers.forEach((t) => t.disable());

      gsap.to(window, {
        scrollTo: { y: positions[nextIdx], autoKill: false },
        duration: SCROLL_CONFIG.scrollDuration,
        ease: SCROLL_CONFIG.scrollEase,
        onComplete: () => {
          isScrollingRef.current = false;
          setCurrentSection(nextIdx);
          triggers.forEach((t) => t.enable());
        }
      });
    };

    // 이벤트 리스너 등록 (passive: false 필수)
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  
  // 섹션별 기본 표시(선택 전)
  const getFallbackSkill = () => {
    if (currentSection === 1) {
      return { name: 'FRONT', description: 'HTML, CSS, JavaScript, React, Next.js, GSAP, Three.js \n프론트 스택을 다룹니다.' };
    }
    if (currentSection === 2) {
      return { name: 'BACK & SUB', description: 'Node.js, MongoDB, Unity, C# 등 \n백엔드/서브 스택을 다룹니다.' };
    }
    if (currentSection === 3) {
      return { name: 'TOOL', description: 'Git, GitHub, Figma, Illustrator, Photoshop \n협업/디자인 도구를 다룹니다.' };
    }
    return { name: '', description: '' };
  };

  const fallbackSkill = getFallbackSkill();
  const displaySkill = selectedSkill || fallbackSkill;

  // Text Scramble 효과 구현
  useEffect(() => {
    if (!selectedSkill) {
      setScrambledText('');
      setDescriptionOpacity(1);
      return;
    }

    // 스킬 변경 시 description 즉시 페이드아웃 (transition 없이)
    setIsFadingIn(false);
    setDescriptionOpacity(0);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const targetText = selectedSkill.name;
    let animationFrame;
    let timeoutId;
    let currentIndex = 0;
    let iteration = 0;
    const maxIterations = 3; // 각 문자당 반복 횟수 (더 줄임)

    const scramble = () => {
      let result = '';
      
      for (let i = 0; i < targetText.length; i++) {
        if (i < currentIndex) {
          // 이미 완성된 문자는 그대로 유지
          result += targetText[i];
        } else if (i === currentIndex && iteration >= maxIterations * 0.5) {
          // 현재 인덱스의 문자는 일정 비율 이상 진행되면 실제 문자로 표시
          result += targetText[i];
        } else {
          // 랜덤 문자 표시
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setScrambledText(result);

      iteration++;
      
      if (iteration >= maxIterations) {
        // 현재 문자 완성, 다음 문자로 이동
        currentIndex++;
        iteration = 0;
        
        if (currentIndex >= targetText.length) {
          // 모든 문자 완성 - 이 시점에 description 페이드인
          setScrambledText(targetText);
          
          // 스크럼블이 끝나면 description 페이드인 (transition 적용)
          setIsFadingIn(true);
          requestAnimationFrame(() => {
            setDescriptionOpacity(1);
          });
          return;
        }
      }

      timeoutId = setTimeout(() => {
        animationFrame = requestAnimationFrame(scramble);
      }, 50); // 속도 느리게 (20ms -> 50ms)
    };

    // 초기화: 랜덤 문자로 시작
    currentIndex = 0;
    iteration = 0;
    let initialText = '';
    for (let i = 0; i < targetText.length; i++) {
      initialText += chars[Math.floor(Math.random() * chars.length)];
    }
    setScrambledText(initialText);

    timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(scramble);
    }, 50);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedSkill]);

  // 패럴랙스 스크롤 구현 (각 스킬 섹션에서 작동)
  useEffect(() => {
    if (!frontSectionRef.current || !backSectionRef.current || !toolSectionRef.current) return;

    const sections = [
      { ref: frontSectionRef },
      { ref: backSectionRef },
      { ref: toolSectionRef }
    ];

    const scrollTriggers = sections.map(section => {
      return ScrollTrigger.create({
        trigger: section.ref.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const windowHeight = window.innerHeight;
          
          // 각 섹션의 좌측을 스크롤에 따라 위로 이동 (패럴랙스 효과)
          const leftElement = section.ref.current?.querySelector('.skill-section-left');
          if (leftElement) {
            gsap.set(leftElement, {
              y: -progress * windowHeight * 0.3,
            });
          }
        }
      });
    });

    return () => {
      scrollTriggers.forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="profile">
      <div className="profile-container" ref={profileContainerRef}>
      <div className="name">
      <svg viewBox="0 0 976 142" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.00448 114V28.2377H31.5605V95.1323L25.2713 90.2153L73.8699 28.2377H98.9125L29.3879 114H8.00448ZM48.9417 73.0628L66.3228 58.6547L100.056 114H73.1838L48.9417 73.0628ZM101.785 28.2377H125.455V114H101.785V28.2377ZM261.037 28.2377V114H238.51V36.6996L243.542 37.2714L210.38 114H186.367L153.091 37.5001L158.237 36.9283V114H135.71V28.2377H172.302L203.062 101.879H193.914L224.445 28.2377H261.037ZM381.833 76.8363C381.605 82.0202 380.537 86.9754 378.631 91.7018C376.802 96.352 374.096 100.507 370.513 104.166C367.006 107.825 362.584 110.684 357.248 112.742C351.988 114.8 345.851 115.83 338.838 115.83C332.129 115.83 325.84 114.877 319.97 112.971C314.1 110.989 308.916 108.092 304.419 104.28C299.997 100.469 296.528 95.7803 294.013 90.2153C291.573 84.6502 290.354 78.2848 290.354 71.1189C290.354 63.9529 291.611 57.5875 294.127 52.0225C296.643 46.4574 300.149 41.7691 304.647 37.9575C309.221 34.1458 314.481 31.2871 320.428 29.3812C326.45 27.3992 333.006 26.4081 340.096 26.4081C349.549 26.4081 357.705 27.8566 364.566 30.7534C371.427 33.6503 376.954 37.6144 381.147 42.6458C385.34 47.6772 388.046 53.509 389.266 60.1413H365.367C364.605 57.2444 363.042 54.7669 360.679 52.7086C358.392 50.574 355.495 48.9731 351.988 47.9059C348.558 46.7624 344.632 46.1906 340.21 46.1906C334.874 46.1906 330.262 47.1435 326.374 49.0494C322.486 50.879 319.475 53.6615 317.34 57.3969C315.206 61.0561 314.138 65.6301 314.138 71.1189C314.138 76.6839 315.282 81.3722 317.569 85.1839C319.856 88.9955 323.096 91.8543 327.288 93.7601C331.558 95.6659 336.551 96.6188 342.268 96.6188C347.833 96.6188 352.75 95.8565 357.019 94.3319C361.288 92.731 364.681 90.4058 367.197 87.3565C369.788 84.3072 371.275 80.648 371.656 76.3789L381.833 76.8363ZM344.555 86.3274V69.6323H390.066V114H373.257L369.941 80.0381L374.401 86.3274H344.555ZM413.533 97.5336V78.4372H472.652V97.5336H413.533ZM459.159 28.2377L498.152 114H472.881L440.177 38.3005H447.038L414.219 114H388.948L427.941 28.2377H459.159ZM515.176 114V72.2624H538.96V114H515.176ZM474.925 28.2377H501.225L532.328 67.8027H521.694L552.682 28.2377H578.983L534.615 84.6121L519.407 84.8408L474.925 28.2377ZM695.68 75.6929C695.68 79.5807 696.405 82.9731 697.853 85.87C699.378 88.6906 701.588 90.8632 704.485 92.3879C707.458 93.9126 711.079 94.6749 715.348 94.6749C719.694 94.6749 723.315 93.9126 726.212 92.3879C729.109 90.8632 731.281 88.6906 732.73 85.87C734.178 82.9731 734.902 79.5807 734.902 75.6929V28.2377H758.687V76.8363C758.687 84.6884 756.857 91.5493 753.198 97.4193C749.615 103.213 744.584 107.749 738.104 111.027C731.624 114.229 724.039 115.83 715.348 115.83C706.734 115.83 699.149 114.229 692.593 111.027C686.113 107.749 681.044 103.213 677.384 97.4193C673.801 91.5493 672.01 84.6884 672.01 76.8363V28.2377H695.68V75.6929ZM847.3 97.4193L839.982 98.9058V28.2377H862.966V114H833.121L783.607 43.4462L790.811 41.9597V114H767.827V28.2377H798.473L847.3 97.4193ZM961.041 76.8363C960.813 82.0202 959.745 86.9754 957.84 91.7018C956.01 96.352 953.304 100.507 949.721 104.166C946.214 107.825 941.792 110.684 936.456 112.742C931.196 114.8 925.059 115.83 918.046 115.83C911.337 115.83 905.048 114.877 899.178 112.971C893.308 110.989 888.124 108.092 883.627 104.28C879.205 100.469 875.736 95.7803 873.221 90.2153C870.781 84.6502 869.562 78.2848 869.562 71.1189C869.562 63.9529 870.819 57.5875 873.335 52.0225C875.851 46.4574 879.357 41.7691 883.855 37.9575C888.429 34.1458 893.689 31.2871 899.636 29.3812C905.658 27.3992 912.214 26.4081 919.304 26.4081C928.757 26.4081 936.914 27.8566 943.774 30.7534C950.635 33.6503 956.162 37.6144 960.355 42.6458C964.548 47.6772 967.254 53.509 968.474 60.1413H944.575C943.813 57.2444 942.25 54.7669 939.887 52.7086C937.6 50.574 934.703 48.9731 931.196 47.9059C927.766 46.7624 923.84 46.1906 919.418 46.1906C914.082 46.1906 909.47 47.1435 905.582 49.0494C901.694 50.879 898.683 53.6615 896.548 57.3969C894.414 61.0561 893.346 65.6301 893.346 71.1189C893.346 76.6839 894.49 81.3722 896.777 85.1839C899.064 88.9955 902.304 91.8543 906.496 93.7601C910.766 95.6659 915.759 96.6188 921.476 96.6188C927.041 96.6188 931.958 95.8565 936.227 94.3319C940.496 92.731 943.889 90.4058 946.405 87.3565C948.996 84.3072 950.483 80.648 950.864 76.3789L961.041 76.8363ZM923.763 86.3274V69.6323H969.274V114H952.465L949.149 80.0381L953.609 86.3274H923.763Z" fill="#EFF0F1"/>
<path d="M618.059 115.83C608.301 115.83 599.801 114 592.559 110.341C585.317 106.605 579.714 101.383 575.75 94.6749C571.862 87.9664 569.918 80.1144 569.918 71.1189C569.918 62.1234 571.862 54.2713 575.75 47.5628C579.714 40.8543 585.317 35.6705 592.559 32.0113C599.801 28.2758 608.301 26.4081 618.059 26.4081C627.741 26.4081 636.165 28.2758 643.33 32.0113C650.573 35.6705 656.176 40.8543 660.14 47.5628C664.104 54.2713 666.086 62.1234 666.086 71.1189C666.086 80.1144 664.104 87.9664 660.14 94.6749C656.176 101.383 650.573 106.605 643.33 110.341C636.165 114 627.741 115.83 618.059 115.83ZM618.059 96.6188C625.759 96.6188 631.743 94.4081 636.012 89.9866C640.281 85.4888 642.416 79.1996 642.416 71.1189C642.416 62.9619 640.281 56.6727 636.012 52.2512C631.743 47.8296 625.759 45.6189 618.059 45.6189C610.36 45.6189 604.337 47.8296 599.992 52.2512C595.647 56.6727 593.474 62.9619 593.474 71.1189C593.474 79.1996 595.647 85.4888 599.992 89.9866C604.337 94.4081 610.36 96.6188 618.059 96.6188Z" fill="#FF5912"/>
<path d="M617.866 115.83C608.108 115.83 599.608 114 592.366 110.341C585.124 106.605 579.521 101.383 575.556 94.6749C571.669 87.9664 569.725 80.1144 569.725 71.1189C569.725 62.1234 571.669 54.2713 575.556 47.5628C579.521 40.8543 585.124 35.6705 592.366 32.0113C599.608 28.2758 608.108 26.4081 617.866 26.4081C627.547 26.4081 635.971 28.2758 643.137 32.0113C650.379 35.6705 655.982 40.8543 659.946 47.5628C663.911 54.2713 665.893 62.1234 665.893 71.1189C665.893 80.1144 663.911 87.9664 659.946 94.6749C655.982 101.383 650.379 106.605 643.137 110.341C635.971 114 627.547 115.83 617.866 115.83ZM617.866 96.6188C625.565 96.6188 631.55 94.4081 635.819 89.9866C640.088 85.4888 642.222 79.1996 642.222 71.1189C642.222 62.9619 640.088 56.6727 635.819 52.2512C631.55 47.8296 625.565 45.6189 617.866 45.6189C610.166 45.6189 604.144 47.8296 599.799 52.2512C595.453 56.6727 593.281 62.9619 593.281 71.1189C593.281 79.1996 595.453 85.4888 599.799 89.9866C604.144 94.4081 610.166 96.6188 617.866 96.6188Z" fill="#FF5912"/>
<rect x="588.531" y="75.9062" width="63.7438" height="17.4801" transform="rotate(-25.4433 588.531 75.9062)" fill="#FF5912"/>
</svg>

      </div>
      <div className="birth">
        2003.07.19
      </div>
      <div className="profile-img">
        <img src={`${assetBase}img/profile.png`} alt="Profile" />
      </div>
      <div 
        className="resume"
        onClick={async () => {
          try {
            const pdfUrl = `${assetBase}22461010_김가영_이력서.pdf`; // base 대응
            const response = await fetch(pdfUrl);
            if (!response.ok) throw new Error(`PDF not found: ${response.status}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = '김가영_이력서.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error('PDF 다운로드 실패:', error);
          }
        }}
      >
        이력서 PDF <span><svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 11.25L2.8125 6.5625L4.125 5.20312L6.5625 7.64062V0H8.4375V7.64062L10.875 5.20312L12.1875 6.5625L7.5 11.25ZM1.875 15C1.35937 15 0.918125 14.8166 0.55125 14.4497C0.184375 14.0828 0.000625 13.6412 0 13.125V10.3125H1.875V13.125H13.125V10.3125H15V13.125C15 13.6406 14.8166 14.0822 14.4497 14.4497C14.0828 14.8172 13.6413 15.0006 13.125 15H1.875Z" fill="#EFF0F1"/>
</svg>
</span>
      </div>
<div className="tagline">
<div className="typing-text">
    {text}<span className="cursor"></span>
  </div>
        <div>프론트엔드 개발자 <span>김가영</span>입니다.</div>
      </div>
      </div>
      

      {/* 고정된 우측 스킬 설명 */}
      {currentSection > 0 && (
        <div className="skill-section-right-fixed">
          <>
            <h2 className="skill-name" ref={skillNameRef}>
              {selectedSkill ? (scrambledText || selectedSkill.name) : displaySkill.name}
            </h2>
            <p 
              className="skill-description" 
              ref={skillDescriptionRef}
              style={{ 
                opacity: descriptionOpacity,
                transition: isFadingIn ? 'opacity 0.5s ease' : 'none'
              }}
            >
              {selectedSkill ? selectedSkill.description : displaySkill.description}
            </p>
          </>
        </div>
      )}

      {/* FRONT 섹션 */}
      <div className="skill-section front-section" ref={frontSectionRef}>
        <div className="skill-section-left">
          <div className="skill-group">
            <h2 className="skill-group-title">FRONT</h2>
            <div className="skill-items">
              {skillsData.front.map((skill, index) => {
                const imageName = getSkillImage(skill.name);
                return (
                  <div 
                    key={index}
                    className={`skill-item ${selectedSkill?.name === skill.name ? 'active' : ''}`}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="skill-icon">
                      {imageName ? (
                        <img src={`${assetBase}img/skills/${imageName}`} alt={skill.name} />
                      ) : (
                        skill.name.charAt(0)
                      )}
                    </div>
                    <span className="skill-label">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* BACK & SUB 섹션 */}
      <div className="skill-section back-section" ref={backSectionRef}>
        <div className="skill-section-left">
          <div className="skill-group">
            <h2 className="skill-group-title">BACK & SUB</h2>
            <div className="skill-items">
              {skillsData.back.map((skill, index) => {
                const imageName = getSkillImage(skill.name);
                return (
                  <div 
                    key={index}
                    className={`skill-item ${selectedSkill?.name === skill.name ? 'active' : ''}`}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="skill-icon">
                      {imageName ? (
                        <img src={`${assetBase}img/skills/${imageName}`} alt={skill.name} />
                      ) : (
                        skill.name.charAt(0)
                      )}
                    </div>
                    <span className="skill-label">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* TOOL 섹션 */}
      <div className="skill-section tool-section" ref={toolSectionRef}>
        <div className="skill-section-left">
          <div className="skill-group">
            <h2 className="skill-group-title">TOOL</h2>
            <div className="skill-items">
              {skillsData.tool.map((skill, index) => {
                const imageName = getSkillImage(skill.name);
                return (
                  <div 
                    key={index}
                    className={`skill-item ${selectedSkill?.name === skill.name ? 'active' : ''}`}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="skill-icon">
                      {imageName ? (
                        <img src={`${assetBase}img/skills/${imageName}`} alt={skill.name} />
                      ) : (
                        skill.name.charAt(0)
                      )}
                    </div>
                    <span className="skill-label">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
