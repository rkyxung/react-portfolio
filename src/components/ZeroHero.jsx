import { useState, useRef, useEffect, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/ZeroHero.scss';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ['GAYOUNG', 'POSSIBILITY', 'ZERO', 'POTENTIAL', 'UNKNOWN'];

const ZeroHero = forwardRef(({ isInteractive = true }, ref) => {
  const [state, setState] = useState('default'); // 'default' | 'hover' | 'open' | 'closing'
  const [currentWord, setCurrentWord] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [lastWord, setLastWord] = useState('');
  const [gap, setGap] = useState(2); // 괄호 간격 (vw 단위)
  const [isBold, setIsBold] = useState(false); // 폰트 굵기 상태
  const timeoutRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const isBoldRef = useRef(false); // 폰트 굵기 ref (스크롤 업데이트용)

  // 랜덤 단어 선택 (직전 단어 제외)
  const getRandomWord = () => {
    const availableWords = WORDS.filter(word => word !== lastWord);
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
  };

  // 타이핑 효과 (텍스트 실제 너비를 측정하여 간격 계산)
  const startTyping = (word) => {
    setDisplayedText('');
    let index = 0;
    
    const calculateGap = () => {
      // 실제 텍스트 너비를 측정
      if (textRef.current) {
        const textWidth = textRef.current.offsetWidth;
        const viewportWidth = window.innerWidth;
        const textWidthVw = (textWidth / viewportWidth) * 100;
        
        // 텍스트 너비의 절반만 사용 (중앙 기준으로 양쪽으로 벌어지므로)
        // 패딩만 사용 (기본 간격 제거)
        const padding = 2; // 좌우 패딩 (2vw * 2)
        const calculatedGap = (textWidthVw / 3) + padding;
        return calculatedGap;
      }
      // 폴백: 텍스트 길이 기반 추정
      const charWidth = 0.25;
      const padding = 4;
      return (word.length * charWidth) + padding;
    };
    
    const typeNextChar = () => {
      if (index < word.length) {
        const currentText = word.slice(0, index + 1);
        setDisplayedText(currentText);
        
        // DOM 업데이트 후 실제 너비 측정
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const newGap = calculateGap();
            setGap(newGap);
            if (containerRef.current) {
              containerRef.current.style.setProperty('--gap', `${newGap}vw`);
            }
          });
        });
        
        index++;
        typingTimeoutRef.current = setTimeout(typeNextChar, 80); // 0.08초 간격
      } else {
        // 타이핑 완료 후 최종 너비 측정
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const newGap = calculateGap();
            setGap(newGap);
            if (containerRef.current) {
              containerRef.current.style.setProperty('--gap', `${newGap}vw`);
            }
          });
        });
        
        // 타이핑 완료 후 1~1.5초 유지
        timeoutRef.current = setTimeout(() => {
          handleClose();
        }, 1200);
      }
    };
    
    typeNextChar();
  };

  // 호버 핸들러
  const handleMouseEnter = () => {
    if (!isInteractive) return;
    if (state === 'default') {
      setState('hover');
    }
  };

  const handleMouseLeave = () => {
    if (!isInteractive) return;
    if (state === 'hover') {
      setState('default');
    }
  };

  // 클릭 핸들러
  const handleClick = () => {
    if (!isInteractive) return;
    if (state === 'hover' || state === 'default') {
      const word = getRandomWord();
      setLastWord(word);
      setCurrentWord(word);
      setState('open');
      startTyping(word);
    }
  };

  // 닫힘 핸들러
  const handleClose = () => {
    setState('closing');
    setGap(2); // 간격 리셋 (vw 단위)
    
    // 글자 페이드아웃
    setTimeout(() => {
      setDisplayedText('');
      setCurrentWord('');
      if (containerRef.current) {
        containerRef.current.style.setProperty('--gap', '2vw');
      }
      
      // 사선 복귀 및 기본 상태로
      setTimeout(() => {
        setState('default');
      }, 500);
    }, 200);
  };

  const zeroHeroRef = useRef(null);
  const initialYRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const stateRef = useRef(state);
  const isInteractingRef = useRef(false);

  // state 변경 시 ref 업데이트
  useEffect(() => {
    stateRef.current = state;
    isInteractingRef.current = state !== 'default';
  }, [state]);

  // 스크롤에 따라 Zero가 함께 이동하도록 GSAP 설정
  useEffect(() => {
    if (!zeroHeroRef.current) return;

    // 초기 위치 저장
    if (initialYRef.current === null) {
      const rect = zeroHeroRef.current.getBoundingClientRect();
      initialYRef.current = rect.top + window.scrollY;
    }

    // 스크롤에 따라 Zero가 함께 이동하고 크기 조절 (즉각적으로 반응)
    // about 섹션에서만 작동하도록 제한
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;
    
    // about 섹션의 끝 위치 계산 (최종 위치 - 여기서 멈춤)
    const aboutEnd = aboutSection.offsetTop + aboutSection.offsetHeight;
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: '.main',
      start: 'top top',
      end: aboutEnd, // about 섹션 끝까지만 - 여기서 ScrollTrigger 완전히 종료
      scrub: false, // 즉각적으로 반응 (애니메이션 없음)
      invalidateOnRefresh: true, // 리사이즈 시 재계산
      onUpdate: (self) => {
        const scrollY = window.scrollY || window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // about 섹션의 끝 위치를 넘어가면 즉시 종료 (더 이상 움직이지 않음)
        // aboutEnd는 외부에서 계산된 값 사용
        if (scrollY >= aboutEnd) {
          // about 섹션 끝 위치에서 고정 (한 번만 설정)
          if (zeroHeroRef.current) {
            const finalY = aboutEnd - (window.innerHeight * 0.04);
            const finalScale = 7.08 / 41;
            gsap.set(zeroHeroRef.current, {
              y: finalY,
              scale: finalScale,
              immediateRender: true
            });
          }
          return; // 여기서 완전히 종료 - 더 이상 업데이트하지 않음
        }
        
        // about 섹션 내에서만 실행되는 코드
        // 스크롤 진행도 계산 (0 ~ 1)
        // hero 섹션(100vh)을 지나면 최종 크기로
        const scrollProgress = Math.min(scrollY / windowHeight, 1);
        
        // 초기 크기: 41vw, 최종 크기: 7.08vw
        const initialSize = 41;
        const finalSize = 7.08;
        const scale = 1 - scrollProgress * (1 - finalSize / initialSize);
        
        // 최종 크기 비율 계산 (약 0.1727)
        const finalScaleRatio = finalSize / initialSize;
        // 최종 크기에 가까워지면 (약 80% 이상 축소되었을 때) bold로 변경
        const boldThreshold = finalScaleRatio + (1 - finalScaleRatio) * 0.2; // 약 0.34 정도
        
        // 폰트 굵기 업데이트
        if (scale <= boldThreshold && !isBoldRef.current) {
          isBoldRef.current = true;
          setIsBold(true);
        } else if (scale > boldThreshold && isBoldRef.current) {
          isBoldRef.current = false;
          setIsBold(false);
        }
        
        // 스크롤 위치 및 크기 업데이트 (즉시 반영)
        // about 섹션 내에서만 업데이트 (aboutEnd 미만일 때만)
        if (zeroHeroRef.current && scrollY < aboutEnd) {
          gsap.set(zeroHeroRef.current, {
            y: scrollY - (window.innerHeight * 0.04),
            scale: scale,
            immediateRender: true // 즉시 렌더링
          });
        } else if (zeroHeroRef.current && scrollY >= aboutEnd) {
          // about 섹션을 넘어가면 최종 위치에 고정
          const finalY = aboutEnd - (window.innerHeight * 0.04);
          const finalScale = 7.08 / 41;
          gsap.set(zeroHeroRef.current, {
            y: finalY,
            scale: finalScale,
            immediateRender: true
          });
        }

        // 스크롤이 발생했고, 인터렉션이 진행 중이면 초기 상태로 리셋
        const scrollDelta = Math.abs(scrollY - lastScrollYRef.current);
        if (scrollDelta > 5 && isInteractingRef.current) { // 5px 이상 스크롤 시에만 리셋
          // 모든 타이머 정리
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
          
          // 상태 초기화
          setState('default');
          setDisplayedText('');
          setCurrentWord('');
          setGap(2);
          if (containerRef.current) {
            containerRef.current.style.setProperty('--gap', '2vw');
          }
        }
        
        lastScrollYRef.current = scrollY;
      }
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []); // 의존성 배열 비워서 한 번만 실행

  // 외부 ref와 내부 ref 연결
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(zeroHeroRef.current);
      } else {
        ref.current = zeroHeroRef.current;
      }
    }
  }, [ref]);

  return (
    <div 
      ref={zeroHeroRef}
      className={`zero-hero ${state}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ pointerEvents: isInteractive ? 'auto' : 'none' }}
    >
      <div className="zero-container" ref={containerRef}>
        <div className="zero-left">
          <span className={`zero-text ${isBold ? 'bold' : ''}`}>0</span>
        </div>
        

        <div className="zero-right">
          <span className={`zero-text ${isBold ? 'bold' : ''}`}>0</span>
        </div>
        
        {/* 사선(바) */}
        <div className="diagonal-bar" />
        
        {/* 타이핑 단어 */}
        {displayedText && (
          <div className="typing-word" ref={textRef}>
            {displayedText}
          </div>
        )}
      </div>
    </div>
  );
});

ZeroHero.displayName = 'ZeroHero';

export default ZeroHero;

