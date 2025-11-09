import './App.css'
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './Home.jsx';
import Profile from './Profile.jsx';
import History from './History.jsx';
import Projects from './Projects.jsx';
import Contact from './Contact.jsx';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="branding">
            <p className="eyebrow">끈기 있는 프론트엔드 개발자</p>
            <h1 className="portfolio-title">김가영 Portfolio</h1>
            <p className="portfolio-subtitle">
              사용자가 체험할 수 있는 웹을 구현하기 위해 문제를 끝까지 파고듭니다.
            </p>
          </div>
          <nav className="main-nav">
            <NavLink to="/">홈</NavLink>
            <NavLink to="/profile">프로필</NavLink>
            <NavLink to="/history">이력</NavLink>
            <NavLink to="/projects">프로젝트</NavLink>
            <NavLink to="/contact">컨택트</NavLink>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
