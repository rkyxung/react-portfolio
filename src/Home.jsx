import React, { useState, useEffect, useRef } from 'react'; // React import 추가
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ZeroHero from './components/ZeroHero';
import Square3D from './components/Square3D';
import './styles/Home.scss';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function Home() {
  const navigate = useNavigate();
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const homeProjectRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef(null); // 'up' | 'down' | null
  const isScrollingRef = useRef(false);

  // 홈 진입 시 항상 첫 섹션(hero)으로 스크롤 및 상태 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsHeroVisible(true);
  }, []); // 컴포넌트 마운트 시 한 번만 실행
  
  // 로고 및 ZeroHero 애니메이션 제어용 ref
  const zeroLogoRef = useRef(null);
  const gayoungLogoRef = useRef(null);
  const zeroHeroRef = useRef(null);
  const txtRef = useRef(null);
  const aboutProfileBtnRef = useRef(null);
  
  // 프로젝트 정보 상태
  const [currentProject, setCurrentProject] = useState(0); // 0: front, 1: right, 2: back, 3: left
  
  // 프로젝트 정보 데이터
  const projects = [
    { 
      name: 'Spikle', 
      description: [
        '혈당 스파이크 관리와 건강 습관 형성을 돕는 모바일 앱 \'Spikle\'을 소개하는 웹',
        '앱의 기획 의도, 핵심 기능, 디자인 시스템, 타겟 유저 등의 정보를 사용자가 스크롤하며,',
        '흥미롭게 탐색할 수 있도록 인터랙티브한 경험을 제공하는 데 중점을 두었습니다.'
      ]
    }, // Front (spikle.jpg)
    { 
      name: 'CLIMB ON', 
      description: [
        '클라이밍 입문자와 애호가들을 위한 웹 기반 정보 플랫폼',
        '초보자 가이드를 통해 클라이밍에 필요한 준비와 기본 지식을 익힐 수 있으며,',
        '사용자는 개인화된 로그북을 작성하고, 관심 있는 아이템을 찜(좋아요)하여 모아볼 수 있습니다.'
      ]
    }, // Left (climb-on.jpg)
    { 
      name: 'PIVOT TIME', 
      description: [
        '계원예술대학교 디지털미디어디자인과 2025 졸업전시 웹',
        '전시의 주제인 \'PIVOT\'과 학생들의 열정을 시각적으로 전달하기 위해,',
        '정적인 정보 전달을 넘어 사용자가 직접 참여하고 몰입할 수 있는 인터랙티브 웹을 구현했습니다.'
      ]
    }, // Back (pivot-time.jpg)
    { 
      name: 'CODE404:System.themepark', 
      description: [
        '디지털 중독을 주제로, 가상 테마파크 시스템의 오류를 복구하며 탈출하는 1인칭 방탈출 게임',
        '플레이어는 제한 시간 내에 퍼즐을 풀어 오류를 복구하는 과정에서',
        '디지털 중독에 대한 경각심을 얻거나 시스템에 영원히 갇히는 멀티 엔딩을 경험합니다.'
      ]
    }, // Right (code404.jpg)
  ];
  
  // 3D 박스 회전 각도에 따라 프로젝트 정보 업데이트
  const handleRotationChange = (rotationY) => {
    // 각도를 0~2π 범위로 정규화
    let angle = rotationY;
    if (angle < 0) {
      angle += Math.PI * 2;
    }
    angle = angle % (Math.PI * 2);
    
    // 각 면의 범위 (45도씩 여유를 두고 계산)
    // Box Geometry Material 순서: [Right, Left, Top, Bottom, Front, Back]
    // 실제 이미지: Right=code404, Left=climb-on, Front=spikle, Back=pivot-time
    // 프로젝트 순서: [0: Spikle(Front), 1: CLIMB ON(Left), 2: PIVOT TIME(Back), 3: CODE404(Right)]
    
    let faceIndex = 0;
    
    // Front (spikle) - 0도 기준 ±45도
    if (angle >= (7 * Math.PI) / 4 || angle < Math.PI / 4) {
      faceIndex = 0; // Spikle
    }
    // Right (code404) - 90도 기준 ±45도
    else if (angle >= Math.PI / 4 && angle < (3 * Math.PI) / 4) {
      faceIndex = 3; // CODE404
    }
    // Back (pivot-time) - 180도 기준 ±45도
    else if (angle >= (3 * Math.PI) / 4 && angle < (5 * Math.PI) / 4) {
      faceIndex = 2; // PIVOT TIME
    }
    // Left (climb-on) - 270도 기준 ±45도
    else if (angle >= (5 * Math.PI) / 4 && angle < (7 * Math.PI) / 4) {
      faceIndex = 1; // CLIMB ON
    }
    
    setCurrentProject(faceIndex);
  };

  // 스크롤 감도 및 속도 설정
  const SCROLL_CONFIG = {
    minScrollDelta: 1,        // 스크롤 감지 최소값 (낮을수록 민감)
    scrollDuration: 1.3,        // 스크롤 애니메이션 속도 (초) - 낮을수록 빠름
    scrollEase: 'power2.inOut', // 이징 함수: 'power1', 'power2', 'power3', 'power4', 'expo', 'sine' 등
    heroThreshold: 0.3,         // Hero 섹션 감지 임계값 (0~1)
    aboutThreshold: 0.7,        // About 섹션 감지 임계값 (0~1)
  };


  // 반응형 위치값 계산 함수
  const getResponsiveValues = () => {
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    return {
      zeroFirstX: -vw * 0.47, // -0.4vw
      zeroSecondX: vw * 8.48, // 8.6vw
      zeroY: window.scrollY - (vh * 4.5), // -4.5vh
      pTagInitialY: vh * 1.85, // 1.85vh
      logoInitialY: -vh * 0.93, // -0.93vh
    };
  };

  useEffect(() => {
    if (!heroRef.current || !aboutRef.current || !homeProjectRef.current) return;

    const handleWheel = (e) => {
      // 섹션 스냅 애니메이션이 진행 중일 때는 기본 스크롤 자체를 막아 덜컹거림 방지
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }
      
      const currentScrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const heroTop = heroRef.current.offsetTop;
      const aboutTop = aboutRef.current.offsetTop;
      const homeProjectTop = homeProjectRef.current.offsetTop;
      
      // 스크롤 방향 감지
      const scrollDelta = e.deltaY;
      
      // 최소 스크롤 감도 체크 (너무 작은 움직임은 무시)
      if (Math.abs(scrollDelta) < SCROLL_CONFIG.minScrollDelta) {
        return;
      }
      
      const isScrollingDown = scrollDelta > 0;
      const isScrollingUp = scrollDelta < 0;
      
      // 현재 위치 확인
      const isAtHero = currentScrollY < heroTop + windowHeight * SCROLL_CONFIG.heroThreshold;
      const isAtAbout = currentScrollY >= heroTop + windowHeight * SCROLL_CONFIG.aboutThreshold && 
                        currentScrollY < aboutTop + windowHeight * 0.5;
      const isAtHomeProject = currentScrollY >= aboutTop + windowHeight * 0.5;
      
      // 스크롤 방향에 따라 섹션 이동
      if (isScrollingDown && isAtHero) {
        // 아래로 스크롤하고 Hero에 있으면 About으로 이동
        e.preventDefault();
        isScrollingRef.current = true;
        scrollDirectionRef.current = 'down';
        
        gsap.to(window, {
          scrollTo: { y: aboutTop, autoKill: false },
          duration: SCROLL_CONFIG.scrollDuration,
          ease: SCROLL_CONFIG.scrollEase,
          onComplete: () => {
            isScrollingRef.current = false;
            setIsHeroVisible(false);
          }
        });
      } else if (isScrollingDown && isAtAbout) {
        // 아래로 스크롤하고 About에 있으면 HomeProject로 이동
        e.preventDefault();
        isScrollingRef.current = true;
        scrollDirectionRef.current = 'down';
        
        gsap.to(window, {
          scrollTo: { y: homeProjectTop, autoKill: false },
          duration: SCROLL_CONFIG.scrollDuration,
          ease: SCROLL_CONFIG.scrollEase,
          onComplete: () => {
            isScrollingRef.current = false;
          }
        });
      } else if (isScrollingUp && isAtHomeProject) {
        // 위로 스크롤하고 HomeProject에 있으면 About으로 이동
        e.preventDefault();
        isScrollingRef.current = true;
        scrollDirectionRef.current = 'up';
        
        gsap.to(window, {
          scrollTo: { y: aboutTop, autoKill: false },
          duration: SCROLL_CONFIG.scrollDuration,
          ease: SCROLL_CONFIG.scrollEase,
          onComplete: () => {
            isScrollingRef.current = false;
          }
        });
      } else if (isScrollingUp && isAtAbout) {
        // 위로 스크롤하고 About에 있으면 Hero로 이동
        e.preventDefault();
        isScrollingRef.current = true;
        scrollDirectionRef.current = 'up';
        
        // 제로 로고와 txt 페이드아웃 (스크롤 시작과 동시에)
        if (zeroLogoRef.current && txtRef.current) {
          const pTags = txtRef.current.querySelectorAll('p');
          gsap.to(zeroLogoRef.current, {
            opacity: 0,
            duration: SCROLL_CONFIG.scrollDuration * 0.5, // 스크롤 시간의 30%
            ease: 'power2.in',
          });
          gsap.to(pTags, {
            opacity: 0,
            duration: SCROLL_CONFIG.scrollDuration * 0.5,
            ease: 'power2.in',
          });
        }
        
        // 0이 초기 위치로 이동 (스크롤과 동시에)
        if (zeroHeroRef.current) {
          gsap.to(zeroHeroRef.current, {
            x: 0,
            y: 0,
            scale: 1, // 초기 크기 (41vw)
            duration: SCROLL_CONFIG.scrollDuration,
            ease: SCROLL_CONFIG.scrollEase,
          });
        }
        
        // 스크롤 애니메이션
        gsap.to(window, {
          scrollTo: { y: heroTop, autoKill: false },
          duration: SCROLL_CONFIG.scrollDuration,
          ease: SCROLL_CONFIG.scrollEase,
          onComplete: () => {
            isScrollingRef.current = false;
            setIsHeroVisible(true);
            
            // 로고들 초기 상태로 리셋 - 반응형
            if (gayoungLogoRef.current) {
              const responsiveValues = getResponsiveValues();
              gsap.set(gayoungLogoRef.current, {
                opacity: 0,
                y: responsiveValues.logoInitialY,
                clearProps: 'all',
              });
            }
          }
        });
      }
    };

    // 스크롤 위치에 따라 상태 업데이트
    const handleScroll = () => {
      // 스크롤 애니메이션 중이면 무시 (애니메이션 완료 후에만 처리)
      if (isScrollingRef.current) return;
      
      const currentScrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const heroTop = heroRef.current.offsetTop;
      const aboutTop = aboutRef.current.offsetTop;
      const threshold = heroTop + windowHeight * 0.5;
      
      if (currentScrollY < threshold) {
        // Hero 섹션
        if (!isHeroVisible) {
          setIsHeroVisible(true);
        }
      } else {
        // About 섹션
        if (isHeroVisible) {
          setIsHeroVisible(false);
        }
      }
      
      lastScrollYRef.current = currentScrollY;
    };

    // 이벤트 리스너 등록
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHeroVisible]); // showZerText 제거하여 불필요한 재등록 방지

  // 컴포넌트 마운트 시 txt p 태그들 초기 상태 설정 (깜빡임 방지)
  useEffect(() => {
    if (!txtRef.current) return;
    
    const pTags = txtRef.current.querySelectorAll('p');
    const responsiveValues = getResponsiveValues();
    gsap.set(pTags, {
      opacity: 0,
      y: responsiveValues.pTagInitialY,
    });
  }, []); // 마운트 시 한 번만 실행

  // 애니메이션 시퀀스: 0 이동 -> 가영 로고 등장 -> 가영 로고 사라짐 -> 0 이동 -> 제로 로고 등장
  useEffect(() => {
    if (isHeroVisible) return; // hero 섹션에 있으면 실행 안 함
    
    if (!zeroHeroRef.current || !gayoungLogoRef.current || !zeroLogoRef.current || !txtRef.current || !aboutProfileBtnRef.current) return;

    // p 태그들 초기 상태 재설정 (확실하게) - 반응형
    const pTags = txtRef.current.querySelectorAll('p');
    const responsiveValues = getResponsiveValues();
    gsap.set(pTags, {
      opacity: 0,
      y: responsiveValues.pTagInitialY, // 아래에서 시작 (반응형)
    });

    const timeline = gsap.timeline({ delay: 0.5 }); // 초기 딜레이 (원하는 값으로 조정)

    // 1. 0 첫 번째 이동 - 반응형
    timeline.to(zeroHeroRef.current, {
      x: responsiveValues.zeroFirstX,
      y: responsiveValues.zeroY,
      duration: 0.5, // 애니메이션 시간 (원하는 값으로 조정)
      ease: 'power2.out',
    });
    
    // 2. 가영 로고 등장 (p 태그 애니메이션과 동시에 시작) - 반응형
    gsap.set(gayoungLogoRef.current, {
      y: responsiveValues.logoInitialY,
      opacity: 0,
    });
    
    timeline.to(gayoungLogoRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8, // 애니메이션 시간 (원하는 값으로 조정)
      ease: 'back.out(1.7)', // 쫀득한 느낌 (값이 클수록 더 쫀득함, 원하는 값으로 조정)
    }, '>'); // 0 이동 완료 후 시작
    
    // txt p 태그들 순차적으로 페이드인 (가영 로고와 동시에 시작)
    pTags.forEach((p, index) => {
      timeline.to(p, {
        y: 0, // 원래 위치로
        opacity: 1,
        duration: index === 0 ? 1.5 : 0.9, // 첫 번째는 더 길게, 나머지는 원래대로 (원하는 값으로 조정)
        ease: 'power1.out', // 더 부드러운 페이드인 (power1이 power2보다 더 부드러움)
      }, index === 0 ? '+=0.2' : '-=0.4'); // 첫 번째는 가영 로고와 동시에, 나머지는 0.4초 간격 (원하는 값으로 조정)
      
      // y 이동은 쫀득하게 별도로 처리 (opacity보다 약간 빠르게)
      timeline.to(p, {
        y: 0,
        duration: index === 0 ? 1.2 : 0.9, // 첫 번째는 더 길게
        ease: 'back.out(2)', // 쫀득한 느낌 (값이 클수록 더 쫀득함, 원하는 값으로 조정)
      }, index === 0 ? '<' : '-=1.1'); // opacity 애니메이션과 약간 겹치게
    });

    // 3. 가영 로고 유지 시간 (p 태그 애니메이션과 겹치면서 진행)
    timeline.to({}, {
      duration: 0.7, // 가영 로고가 보이는 시간 (원하는 값으로 조정)
    }, '-=0.5'); // p 태그 애니메이션과 겹치게

    // 4. 가영 로고 사라짐 (p 태그 애니메이션과 겹치면서 진행)
    timeline.to(gayoungLogoRef.current, {
      opacity: 0,
      duration: 0.4, // 애니메이션 시간 (원하는 값으로 조정)
      ease: 'power2.in',
    }, '-=0.3'); // p 태그 애니메이션과 겹치게

    // 5. 0 두 번째 이동 (p 태그 애니메이션과 겹치면서 진행) - 반응형
    timeline.to(zeroHeroRef.current, {
      x: responsiveValues.zeroSecondX,
      y: responsiveValues.zeroY,
      duration: 1.0, // 애니메이션 시간 (원하는 값으로 조정)
      ease: 'power2.out',
    }, '-=0.2'); // p 태그 애니메이션과 겹치게

    // 제로 로고 초기화 - 반응형
    gsap.set(zeroLogoRef.current, {
      y: responsiveValues.logoInitialY,
      opacity: 0,
    });

    // 6. 제로 로고 등장 (p 태그 애니메이션과 겹치면서 진행)
    timeline.to(zeroLogoRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8, // 애니메이션 시간 (원하는 값으로 조정)
      ease: 'back.out(1.7)', // 쫀득한 느낌 (값이 클수록 더 쫀득함, 원하는 값으로 조정)
    }, '-=0.3'); // p 태그 애니메이션과 겹치게

    // 7. about-profile-btn 페이드인 (모든 로고 애니메이션 완료 후)
    if (aboutProfileBtnRef.current) {
      gsap.set(aboutProfileBtnRef.current, {
        opacity: 0,
      });
      
      timeline.to(aboutProfileBtnRef.current, {
        opacity: 1,
        duration: 0.8, // 애니메이션 시간 (원하는 값으로 조정)
        ease: 'power2.out',
      }, '>'); // 제로 로고 애니메이션 완료 후 시작
    }

    return () => {
      timeline.kill(); // 컴포넌트 언마운트 시 애니메이션 정리
    };
  }, [isHeroVisible]);

  return (
    <section className="main" ref={mainRef}>
      <div className="hero" ref={heroRef}>
        <div className="top-wrapper">
          <div className="web-developer">
            <div className="web-wrapper">
              <p>WEB</p>
              <p>WEB</p>
              <p>WEB</p>
            </div>
            <div className="developer">DEVELOPER</div>
          </div>
          <div className="lines">
            {Array.from({ length: 6 }, (_, idx) => {
              const opacity = 1.0 - (idx * 0.18);
              return <div key={idx} className="lines__bar" style={{ '--opacity': opacity }} />;
            })}
          </div>
        </div>

        <div className="bottom-wrapper">
          <div className="lines">
            {Array.from({ length: 9 }, (_, idx) => {
              const opacity = 0.1 + (idx * 0.1125);
              return <div key={idx} className="lines__bar" style={{ '--opacity': opacity }} />;
            })}
          </div>
          <div className="front-end">
            <div className="front">FRONT</div>
            <div className="dash">-</div>
            <div className="end-wrapper">
              <p>END</p>
              <p>END</p>
              <p>END</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about" ref={aboutRef}>
        <div className="zero-logo" ref={zeroLogoRef}>
        <svg viewBox="0 0 312 103" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 102.155V81.7505L66.7881 16.187L87.1918 22.172H0.40808V0H98.074V20.4037L31.2857 86.1035L13.7385 79.9825H98.482V102.155H0ZM194.055 40.9434V61.3471H119.378V40.9434H194.055ZM138.557 51.1453L131.892 92.0885L120.466 79.3025H198.544V102.155H103.735L111.488 51.1453L103.735 0.136101H197.864V22.9882H120.466L131.892 10.2019L138.557 51.1453ZM227.51 44.7521H264.644C269.179 44.7521 272.715 43.7093 275.254 41.6236C277.793 39.5378 279.063 36.636 279.063 32.918C279.063 29.1093 277.793 26.2074 275.254 24.2124C272.715 22.1267 269.179 21.0838 264.644 21.0838H223.565L236.215 7.6174V102.155H208.058V0.136101H268.589C276.388 0.136101 283.189 1.5416 288.993 4.3528C294.796 7.0733 299.331 10.882 302.595 15.7789C305.86 20.5851 307.492 26.2981 307.492 32.918C307.492 39.3565 305.86 45.0242 302.595 49.9211C299.331 54.8179 294.796 58.6266 288.993 61.3471C283.189 64.0676 276.388 65.4279 268.589 65.4279H227.51V44.7521ZM242.744 54.4099H274.438L311.029 102.155H278.383L242.744 54.4099Z" fill="#FF5912"/>
</svg>
        </div>

        <div className="gayoung-logo" ref={gayoungLogoRef}>
        <svg viewBox="0 0 821 169" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M113.988 91.7915C113.716 97.958 112.446 103.852 110.179 109.474C108.003 115.006 104.783 119.948 100.521 124.301C96.3497 128.654 91.0901 132.054 84.7423 134.503C78.4852 136.951 71.1852 138.175 62.8424 138.175C54.8622 138.175 47.3809 137.042 40.3983 134.775C33.4157 132.417 27.2493 128.971 21.899 124.437C16.6393 119.903 12.5133 114.326 9.52076 107.706C6.6189 101.086 5.16797 93.5145 5.16797 84.9903C5.16797 76.4661 6.66424 68.894 9.65679 62.2742C12.6493 55.6543 16.8207 50.0773 22.171 45.5432C27.612 41.009 33.8691 37.6084 40.9424 35.3413C48.1064 32.9835 55.9051 31.8047 64.3386 31.8047C75.5833 31.8047 85.2864 33.5276 93.4479 36.9736C101.609 40.4196 108.184 45.1351 113.171 51.1202C118.159 57.1052 121.378 64.0425 122.829 71.9319H94.4001C93.4932 68.486 91.6342 65.5388 88.8231 63.0903C86.1026 60.5512 82.6566 58.6469 78.4852 57.3773C74.4044 56.017 69.7343 55.3369 64.4747 55.3369C58.1268 55.3369 52.6405 56.4705 48.0157 58.7375C43.3908 60.9139 39.8089 64.2239 37.2697 68.6673C34.7306 73.0201 33.461 78.4611 33.461 84.9903C33.461 91.6101 34.8213 97.1872 37.5418 101.721C40.2623 106.255 44.1163 109.656 49.1039 111.923C54.1821 114.19 60.1219 115.323 66.9231 115.323C73.543 115.323 79.392 114.416 84.4703 112.603C89.5485 110.698 93.5839 107.933 96.5765 104.305C99.6597 100.678 101.428 96.3257 101.881 91.2474L113.988 91.7915ZM69.6436 103.081V83.222H123.781V135.999H103.786L99.841 95.6002L105.146 103.081H69.6436ZM151.696 116.411V93.6959H222.021V116.411H151.696ZM205.97 33.9811L252.354 135.999H222.293L183.39 45.9512H191.551L152.512 135.999H122.451L168.835 33.9811H205.97ZM272.605 135.999V86.3505H300.898V135.999H272.605ZM224.724 33.9811H256.01L293.009 81.0456H280.358L317.221 33.9811H348.507L295.729 101.041L277.638 101.313L224.724 33.9811ZM487.324 90.4313C487.324 95.0561 488.186 99.0915 489.909 102.537C491.722 105.892 494.352 108.477 497.798 110.29C501.335 112.104 505.642 113.011 510.72 113.011C515.889 113.011 520.197 112.104 523.643 110.29C527.089 108.477 529.673 105.892 531.396 102.537C533.119 99.0915 533.98 95.0561 533.98 90.4313V33.9811H562.274V91.7915C562.274 101.131 560.097 109.293 555.744 116.275C551.482 123.167 545.497 128.563 537.789 132.462C530.081 136.271 521.058 138.175 510.72 138.175C500.473 138.175 491.45 136.271 483.651 132.462C475.943 128.563 469.913 123.167 465.56 116.275C461.298 109.293 459.167 101.131 459.167 91.7915V33.9811H487.324V90.4313ZM667.683 116.275L658.978 118.044V33.9811H686.318V135.999H650.816L591.917 52.0723L600.487 50.304V135.999H573.146V33.9811H609.601L667.683 116.275ZM802.984 91.7915C802.712 97.958 801.442 103.852 799.175 109.474C796.999 115.006 793.78 119.948 789.518 124.301C785.346 128.654 780.087 132.054 773.739 134.503C767.482 136.951 760.182 138.175 751.839 138.175C743.859 138.175 736.377 137.042 729.395 134.775C722.412 132.417 716.246 128.971 710.895 124.437C705.636 119.903 701.51 114.326 698.517 107.706C695.615 101.086 694.164 93.5145 694.164 84.9903C694.164 76.4661 695.661 68.894 698.653 62.2742C701.646 55.6543 705.817 50.0773 711.167 45.5432C716.608 41.009 722.866 37.6084 729.939 35.3413C737.103 32.9835 744.902 31.8047 753.335 31.8047C764.58 31.8047 774.283 33.5276 782.444 36.9736C790.606 40.4196 797.18 45.1351 802.168 51.1202C807.155 57.1052 810.375 64.0425 811.826 71.9319H783.396C782.49 68.486 780.631 65.5388 777.819 63.0903C775.099 60.5512 771.653 58.6469 767.482 57.3773C763.401 56.017 758.731 55.3369 753.471 55.3369C747.123 55.3369 741.637 56.4705 737.012 58.7375C732.387 60.9139 728.805 64.2239 726.266 68.6673C723.727 73.0201 722.457 78.4611 722.457 84.9903C722.457 91.6101 723.818 97.1872 726.538 101.721C729.259 106.255 733.113 109.656 738.1 111.923C743.179 114.19 749.118 115.323 755.919 115.323C762.539 115.323 768.388 114.416 773.467 112.603C778.545 110.698 782.58 107.933 785.573 104.305C788.656 100.678 790.424 96.3257 790.878 91.2474L802.984 91.7915ZM758.64 103.081V83.222H812.778V135.999H792.782L788.837 95.6002L794.142 103.081H758.64Z" fill="#FF5912"/>
</svg>
        </div>

        <div className="txt" ref={txtRef}>
        <p>ZERO는 제 이름 '가영'의 '영(0)'에서 시작된 상징입니다.</p>
        <p>0은 비어 있지만, 동시에 얼마나 더 나아질지 모를 '미지수의 가능성'이 담겨 있습니다.</p>
        <p>그래서 저는 0을, 제 역량이 무한하게 확장될 시작점이라는 의미를 담았습니다.</p>
        </div>

        <div 
          className="about-profile-btn" 
          ref={aboutProfileBtnRef}
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer' }}
        >
        WHO IS GAY0UNG?
        </div>
      </div>

        <ZeroHero isInteractive={isHeroVisible} ref={zeroHeroRef} />

        <div className="home-project" ref={homeProjectRef}>
          <Square3D onRotationChange={handleRotationChange} />

          <div className="home-project-txt">
            <div>{projects[currentProject].name}</div>
            <p>
              {Array.isArray(projects[currentProject].description) 
                ? projects[currentProject].description.map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < projects[currentProject].description.length - 1 && <br />}
                    </span>
                  ))
                : projects[currentProject].description}
            </p>
          </div>

          <div 
            className="more-project-btn"
            onClick={() => navigate('/projects')}
            style={{ cursor: 'pointer' }}
          >
            MORE PROJECTS +
          </div>
        </div>

    </section>
  );
}

export default Home;