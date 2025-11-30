import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './Home.jsx';
import Profile from './Profile.jsx';
import History from './History.jsx';
import Projects from './Projects.jsx';
import Contact from './Contact.jsx';
import Splash from './Splash.jsx';
import ParticleZero from './components/ParticleZero.jsx';
import Nav from './components/nav';

function App() {
  const [isLoading, setIsLoading] = useState(false); // 스플래시 비활성화

  const handleSplashComplete = () => {
    setIsLoading(false);
  };

  // return (
  //   <ParticleMorph />
  // )

  return (
  <div className={`app-container ${!isLoading ? 'home-loaded' : ''}`}>
    {isLoading && <Splash onComplete={handleSplashComplete} />}
    {!isLoading && (
      <>
        <Nav />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </>
    )}
  </div>
)

}



export default App
