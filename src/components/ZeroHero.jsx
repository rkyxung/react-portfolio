import { useState, useRef, useEffect, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/ZeroHero.scss';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ['GAYOUNG', 'POSSIBILITY', 'ZERO', 'POTENTIAL', 'UNKNOWN'];

const ZeroHero = forwardRef(({ isInteractive = true }, ref) => {
  const [state, setState] = useState('default'); // 'default' | 'hover' | 'open' | 'closing'
  const [displayedText, setDisplayedText] = useState('');
  const [lastWord, setLastWord] = useState('');
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
      setState('open');
      startTyping(word);
    }
  };

  // 닫힘 핸들러
  const handleClose = () => {
    setState('closing');
    
    // 글자 페이드아웃
    setTimeout(() => {
      setDisplayedText('');
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
    const aboutTop = aboutSection.offsetTop;
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: '.main',
      start: 'top top',
      end: aboutTop,
      scrub: false, 
      invalidateOnRefresh: true,
      onUpdate: () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        if (scrollY >= aboutTop) {
          if (zeroHeroRef.current) {
            const finalY = aboutTop - (window.innerHeight * 0.04);
            const finalScale = 7.08 / 41;
            gsap.set(zeroHeroRef.current, {
              y: finalY,
              scale: finalScale,
              immediateRender: true
            });
          }
          return;
        }
        
        const scrollProgress = Math.min(scrollY / windowHeight, 1);
        
        const initialSize = 41;
        const finalSize = 7.08;
        const scale = 1 - scrollProgress * (1 - finalSize / initialSize);
        
        const finalScaleRatio = finalSize / initialSize;
        const boldThreshold = finalScaleRatio + (1 - finalScaleRatio) * 0.2;
        
        if (scale <= boldThreshold && !isBoldRef.current) {
          isBoldRef.current = true;
          setIsBold(true);
        } else if (scale > boldThreshold && isBoldRef.current) {
          isBoldRef.current = false;
          setIsBold(false);
        }
        
        if (zeroHeroRef.current && scrollY < aboutTop) {
          gsap.set(zeroHeroRef.current, {
            y: scrollY - (window.innerHeight * 0.04),
            scale: scale,
            immediateRender: true
          });
        } else if (zeroHeroRef.current && scrollY >= aboutTop) {
          const finalY = aboutTop - (window.innerHeight * 0.04);
          const finalScale = 7.08 / 41;
          gsap.set(zeroHeroRef.current, {
            y: finalY,
            scale: finalScale,
            immediateRender: true
          });
        }

        const scrollDelta = Math.abs(scrollY - lastScrollYRef.current);
        if (scrollDelta > 5 && isInteractingRef.current) { 
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
          
          setState('default');
          setDisplayedText('');
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

