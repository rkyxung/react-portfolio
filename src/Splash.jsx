import { useEffect, useState, useRef } from 'react';
import './Splash.scss';

function Splash({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showSecondPart, setShowSecondPart] = useState(false);
  const [fillProgress, setFillProgress] = useState(0);
  const [showPeriod, setShowPeriod] = useState(false);
  const [periodExpanding, setPeriodExpanding] = useState(false);
  const [periodPosition, setPeriodPosition] = useState({ left: '50%', top: '50%' });
  const [circleSize, setCircleSize] = useState('0px');
  const periodRef = useRef(null);

  useEffect(() => {
    // ===== ", I'm gayoung" 표시 타이밍 =====
    // 조절 가능: "Hi" 모션이 끝나고 ", I'm gayoung"이 나타나는 시간 (밀리초, 기본값 2000 = 2초)
    // "Hi" 애니메이션이 1.8초이므로 그 이후에 나타나도록 설정
    const SHOW_SECOND_PART_DELAY = 1600;
    const secondPartTimer = setTimeout(() => {
      setShowSecondPart(true);
    }, SHOW_SECOND_PART_DELAY);

    // ===== fill 애니메이션 타이밍 =====
    // 조절 가능: ", I'm gayoung" 표시 후 fill 애니메이션이 시작되는 시간 (밀리초, 기본값 2500 = 2.5초)
    const FILL_START_DELAY = 2100;
    const fillTimer = setTimeout(() => {
      // 조절 가능: fill 진행률 업데이트 간격 (밀리초, 기본값 10 = 0.01초마다 업데이트)
      const FILL_UPDATE_INTERVAL = 10;
      // 조절 가능: fill 진행률 증가량 (기본값 1.5, 높을수록 빠름)
      const FILL_INCREMENT = 1.7;
      
      const fillInterval = setInterval(() => {
        
        setFillProgress(prev => {
          if (prev >= 100) {
            clearInterval(fillInterval);
            // fill이 100% 되면 점 표시
            setTimeout(() => {
            setShowPeriod(true);
            }, 800);
            
            // ===== 점 확대 타이밍 =====
            // 조절 가능: 점이 나타난 후 확대가 시작되는 지연 시간 (밀리초, 기본값 300 = 0.3초)
            const PERIOD_EXPAND_DELAY = 100;
            setTimeout(() => {
              // 점의 원래 위치를 계산해서 fixed로 고정 (원래 위치 유지)
              if (periodRef.current) {
                const rect = periodRef.current.getBoundingClientRect();
                setPeriodPosition({
                  left: `${rect.left + rect.width / 2}px`,
                  top: `${rect.top + rect.height / 2}px`
                });
                const diagonal = Math.hypot(window.innerWidth, window.innerHeight) * 1.2;
                setCircleSize(`${diagonal}px`);
              }
              setPeriodExpanding(true);
              
              // ===== 홈 전환 타이밍 =====
              // 조절 가능: 점 확대 애니메이션 완료 후 홈으로 전환되는 시간 (밀리초, 기본값 2000 = 2초)
              const HOME_TRANSITION_DELAY = 1000;
              // 조절 가능: 홈 전환 시 페이드아웃 시간 (밀리초, 기본값 500 = 0.5초)
              const FADEOUT_DURATION = 10;
              
              setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                  if (onComplete) onComplete();
                }, FADEOUT_DURATION);
              }, HOME_TRANSITION_DELAY);
            }, PERIOD_EXPAND_DELAY);
            return 100;
          }
          return prev + FILL_INCREMENT;
        });
      }, FILL_UPDATE_INTERVAL);
      
      return () => clearInterval(fillInterval);
    }, FILL_START_DELAY);

    return () => {
      clearTimeout(secondPartTimer);
      clearTimeout(fillTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${!isVisible ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-text-container">
          <span className="splash-hi">Hi</span>
          <span className={`splash-rest ${showSecondPart ? 'visible' : ''}`}>
            <span className="splash-comma">,</span>
            <span className="splash-im"> I'm </span>
            <span className="splash-name">
              <span className="splash-name-stroke">gayoung</span>
              <span className="splash-name-fill" style={{ '--fill-progress': `${fillProgress}%` }}>
                gayo
              </span>
            </span>
            <span 
              ref={periodRef}
              className={`splash-period ${showPeriod ? 'visible' : ''} ${periodExpanding ? 'expanding' : ''}`}
              aria-hidden="true"
            >.</span>
          </span>
        </div>
        {periodExpanding && (
          <div
            className="splash-period-circle"
            style={{ left: periodPosition.left, top: periodPosition.top, '--circle-size': circleSize }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export default Splash;

