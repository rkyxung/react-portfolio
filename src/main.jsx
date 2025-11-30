import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'; // HashRouter로 변경

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter> 
      {/* HashRouter 사용 - #profile, #projects 등 해시 라우팅 */}
      <App />
    </HashRouter>
  </StrictMode>,
)
