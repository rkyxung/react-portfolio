import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'; // 라우터를 사용하기 위해 추가

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/react-portfolio/"> 
      {/* 라우터로 앱을 감싸기 */}
      {/* basename에 Repository 경로를 추가 */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
