import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hambuger.scss';

function Hambuger() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <section className="hambuger">
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
        onClick={toggleMenu}
        style={{ cursor: 'pointer' }}
      >
          <nav className="hamPanel-menu">
            <div onClick={(e) => handleNavClick(e, '/')} className="hamPanel-item" style={{ cursor: 'pointer' }}>
              ZER0
            </div>
            <div onClick={(e) => handleNavClick(e, '/profile')} className="hamPanel-item" style={{ cursor: 'pointer' }}>
              Profile
            </div>
            <div onClick={(e) => handleNavClick(e, '/history')} className="hamPanel-item" style={{ cursor: 'pointer' }}>
              History
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


