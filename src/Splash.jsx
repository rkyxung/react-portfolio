import { useEffect, useState, useRef } from 'react';
import './styles/Splash.scss';

const LINE_DURATION = 1500; // 선이 채워지는 시간 (ms)

// 각 자릿수별 속도 (ms)
const INTERVALS = {
  THOUSANDS: 400,  // 천의 자리: 가장 느리게
  HUNDREDS: 300,   // 백의 자리: 중간
  TENS: 200,       // 십의 자리: 빠르게
  ONES: 500,       // 일의 자리: 가장 빠르게
  ONES_SLOW: 1000  // 일의 자리 1→0: 매우 느리게
};

function Splash({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lineProgress, setLineProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  // 각 자릿수별 값 (천, 백, 십, 일)
  const [digits, setDigits] = useState([9, 9, 9, 9]);
  // 각 자릿수별 표시 여부
  const [visibleDigits, setVisibleDigits] = useState([true, true, true, true]);
  // 각 자릿수가 리셋 중인지 추적 (transition 제거용)
  const [isResetting, setIsResetting] = useState([false, false, false, false]);
  
  // 각 자릿수가 사라졌는지 추적
  const hasDisappeared = useRef([false, false, false, false]);
  // 이전 자릿수 값 추적 (리셋 감지용)
  const prevDigits = useRef([9, 9, 9, 9]);

  // 선 애니메이션 (왼쪽에서 오른쪽으로)
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / LINE_DURATION, 1);
      setLineProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasStarted(true);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  // 각 자릿수별 독립적인 카운트다운 (9→0 반복)
  useEffect(() => {
    if (!hasStarted) return;

    // 천의 자리 (가장 느리게, 9→0 반복하다가 사라질 순간에만 1에서 사라짐)
    const thousandsTimer = setInterval(() => {
      setDigits(prev => {
        const newDigits = [...prev];
        if (newDigits[0] > 0) {
          newDigits[0] = newDigits[0] - 1;
        } else {
          // 0이 되면 다시 9로 리셋
          newDigits[0] = 9;
        }
        
        // 사라질 조건: 1이 되었을 때 사라짐 (한 번만)
        if (newDigits[0] === 1 && !hasDisappeared.current[0]) {
          hasDisappeared.current[0] = true;
          setVisibleDigits(prev => [false, prev[1], prev[2], prev[3]]);
          clearInterval(thousandsTimer);
        }
        
        prevDigits.current[0] = newDigits[0];
        return newDigits;
      });
    }, INTERVALS.THOUSANDS);

    // 백의 자리 (천의 자리가 사라지기 전까지 계속 9→0 반복)
    const hundredsTimer = setInterval(() => {
      setDigits(prev => {
        const newDigits = [...prev];
        if (newDigits[1] > 0) {
          newDigits[1] = newDigits[1] - 1;
        } else {
          // 0이 되면 다시 9로 리셋
          if (!hasDisappeared.current[0]) {
            // 리셋 감지: 0에서 9로 변경
            if (prevDigits.current[1] === 0) {
              setIsResetting(prev => [prev[0], true, prev[2], prev[3]]);
              newDigits[1] = 9;
              // 다음 프레임에서 transition 복원
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setIsResetting(prev => [prev[0], false, prev[2], prev[3]]);
                });
              });
            } else {
              newDigits[1] = 9;
            }
          }
        }
        
        // 사라질 조건: 천의 자리가 사라졌고 백의 자리가 1이 되면 사라짐
        if (hasDisappeared.current[0] && newDigits[1] === 1 && !hasDisappeared.current[1]) {
          hasDisappeared.current[1] = true;
          setVisibleDigits(prev => [prev[0], false, prev[2], prev[3]]);
          clearInterval(hundredsTimer);
        }
        
        prevDigits.current[1] = newDigits[1];
        return newDigits;
      });
    }, INTERVALS.HUNDREDS);

    // 십의 자리 (백의 자리가 사라지기 전까지 계속 9→0 반복)
    const tensTimer = setInterval(() => {
      setDigits(prev => {
        const newDigits = [...prev];
        if (newDigits[2] > 0) {
          newDigits[2] = newDigits[2] - 1;
        } else {
          // 0이 되면 다시 9로 리셋
          if (!hasDisappeared.current[1]) {
            // 리셋 감지: 0에서 9로 변경
            if (prevDigits.current[2] === 0) {
              setIsResetting(prev => [prev[0], prev[1], true, prev[3]]);
              newDigits[2] = 9;
              // 다음 프레임에서 transition 복원
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setIsResetting(prev => [prev[0], prev[1], false, prev[3]]);
                });
              });
            } else {
              newDigits[2] = 9;
            }
          }
        }
        
        // 사라질 조건: 백의 자리가 사라졌고 십의 자리가 1이 되면 사라짐
        if (hasDisappeared.current[1] && newDigits[2] === 1 && !hasDisappeared.current[2]) {
          hasDisappeared.current[2] = true;
          setVisibleDigits(prev => [prev[0], prev[1], false, prev[3]]);
          clearInterval(tensTimer);
        }
        
        prevDigits.current[2] = newDigits[2];
        return newDigits;
      });
    }, INTERVALS.TENS);

    // 일의 자리 (십의 자리가 사라지기 전까지 계속 9→0 반복, 마지막에 1→0만 느리게)
    let onesCurrent = 9;
    let onesInterval = INTERVALS.ONES;
    let isOnesSlow = false;
    
    const onesTick = () => {
      setDigits(prev => {
        const newDigits = [...prev];
        
        if (onesCurrent > 0) {
          // 일의 자리만 남았을 때 1→0은 느리게
          if (hasDisappeared.current[2] && onesCurrent === 1 && !isOnesSlow) {
            isOnesSlow = true;
            onesInterval = INTERVALS.ONES_SLOW;
          }
          
          onesCurrent = onesCurrent - 1;
          newDigits[3] = onesCurrent;
          prevDigits.current[3] = newDigits[3];
          
          // 일의 자리만 남았을 때 0이 되면 더 이상 진행하지 않음 (0을 보여줌)
          if (hasDisappeared.current[2] && onesCurrent === 0) {
            // 0을 표시하기 위해 state 업데이트 후 종료
            return newDigits;
          }
          
          // 계속 반복 (0이 아니거나, 십의 자리가 아직 있으면)
          if (onesCurrent > 0 || !hasDisappeared.current[2]) {
            setTimeout(onesTick, onesInterval);
          }
        } else {
          // 십의 자리가 아직 있으면 다시 9로 리셋하고 반복
          if (!hasDisappeared.current[2]) {
            // 리셋 감지: 0에서 9로 변경
            if (prevDigits.current[3] === 0) {
              setIsResetting(prev => [prev[0], prev[1], prev[2], true]);
              onesCurrent = 9;
              newDigits[3] = 9;
              onesInterval = INTERVALS.ONES;
              isOnesSlow = false;
              prevDigits.current[3] = newDigits[3];
              // 다음 프레임에서 transition 복원
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setIsResetting(prev => [prev[0], prev[1], prev[2], false]);
                });
              });
            } else {
              onesCurrent = 9;
              newDigits[3] = 9;
              onesInterval = INTERVALS.ONES;
              isOnesSlow = false;
              prevDigits.current[3] = newDigits[3];
            }
            setTimeout(onesTick, onesInterval);
          } else {
            // 일의 자리만 남았고 0이 되면 완료 (메인으로 넘어가지 않음)
            prevDigits.current[3] = 0;
            return newDigits;
          }
        }
        
        return newDigits;
      });
    };
    
    setTimeout(onesTick, INTERVALS.ONES);

    return () => {
      clearInterval(thousandsTimer);
      clearInterval(hundredsTimer);
      clearInterval(tensTimer);
    };
  }, [hasStarted, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      {/* 선 (하단 하나) */}
      <div className="splash-line">
        <div
          className="splash-line-fill"
          style={{ width: `${lineProgress * 100}%` }}
        />
      </div>

      {/* 카운터 */}
      {hasStarted && (
        <div className="splash-counter">
          {digits.map((digit, idx) => {
            if (!visibleDigits[idx]) return null;
            
            return (
              <div key={idx} className="digit-wrapper">
                <div 
                  className="digit-stack"
                  style={{ 
                    transform: `translateY(-${digit * 1.2}em)`,
                    transition: isResetting[idx]
                      ? 'none'
                      : hasDisappeared.current[2] && idx === 3 && (digit === 0 || digit === 1)
                        ? `transform ${INTERVALS.ONES_SLOW / 1000}s cubic-bezier(0.4, 0, 0.2, 1)`
                        : idx === 0 
                          ? `transform ${INTERVALS.THOUSANDS / 1000}s linear`
                          : idx === 1
                            ? `transform ${INTERVALS.HUNDREDS / 1000}s linear`
                            : idx === 2
                              ? `transform ${INTERVALS.TENS / 1000}s linear`
                              : `transform ${INTERVALS.ONES / 1000}s linear`
                  }}
                >
                  {Array.from({ length: 10 }, (_, n) => (
                    <span key={n} className="digit">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Splash;
