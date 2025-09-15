// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트
import Page1 from './Page1.jsx';
import Page2 from './Page2.jsx';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <nav>
        <Link to="/page1">페이지 1</Link> | {" "}
        <Link to="/page2">페이지 2</Link>
      </nav>
      <Routes>
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
      </Routes>
    </>
  )
}

export default App
