import './App.css'
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './Home.jsx';
import Profile from './Profile.jsx';
import History from './History.jsx';
import Projects from './Projects.jsx';
import Contact from './Contact.jsx';
import Dday from './Dday.jsx';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="portfolio-title">Portfolio</h1>
          <nav className="main-nav">
            <NavLink to="/">홈</NavLink>
            <NavLink to="/profile">프로필</NavLink>
            <NavLink to="/history">이력</NavLink>
            <NavLink to="/projects">프로젝트</NavLink>
            <NavLink to="/contact">컨택트</NavLink>
          </nav>
          <div className="header-extra">
            <Dday />
          </div>
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
