import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hambuger.scss';

function Hambuger() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const hambugerRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false); // 메뉴 닫기
    // HashRouter 사용 시 경로는 그대로 사용 (HashRouter가 자동으로 # 처리)
    navigate(path);
  };

  // 패널이 살짝 나온 호버 상태에서 패널을 눌러도 열리도록 처리
  const handlePanelClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // 패널 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && hambugerRef.current && !hambugerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // 이벤트 리스너를 나중에 추가하여 현재 클릭 이벤트는 무시
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <section className="hambuger" ref={hambugerRef}>
      <div
        type="button"
        className={`hamBtn ${isOpen ? 'hamBtn__open' : ''}`}
        onClick={toggleMenu}
        aria-label="메뉴 토글"
        aria-expanded={isOpen}
      >
        <span />
        <span />
        <span />
      </div>

      <div 
        className={`hamPanel ${isOpen ? 'hamPanel__open' : ''}`}
        onClick={handlePanelClick}
      >
          <nav className="hamPanel-menu">
            <div onClick={(e) => handleNavClick(e, '/')} className="hamPanel-item" style={{ cursor: 'pointer' }}>
              ZER0
            </div>
            <div onClick={(e) => handleNavClick(e, '/profile')} className="hamPanel-item" style={{ cursor: 'pointer' }}>
              Profile
            </div>
            <div onClick={(e) => handleNavClick(e, '/projects')} className="hamPanel-item" style={{ cursor: 'pointer' }}>
              Projects
            </div>
            <div onClick={(e) => handleNavClick(e, '/contact')} className="hamPanel-item" style={{ cursor: 'pointer' }}>
              Contact
            </div>
          </nav>
      </div>
    </section>
  );
}

export default Hambuger;


