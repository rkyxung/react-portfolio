# 레이아웃·라우팅

## 개요
정적 배포 환경에서도 라우팅이 끊기지 않도록 `HashRouter`를 선택했고, `Layout`이 네비게이션/푸터와 실제 콘텐츠를 깔끔히 분리합니다. 좋아요 기능이 필요한 페이지와 아닌 페이지를 라우트 레벨에서 명확히 구분해 책임을 분리했습니다.

## 주요 코드
```jsx
// src/App.js
import { HashRouter } from 'react-router-dom';
import Layout from './Components/Layout';

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}
```

```jsx
// src/Components/Layout.jsx (발췌)
<LikeProvider>
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/Ham" element={<Ham />} />
    {/* 좋아요 필요 없는 페이지 */}
    {/* ... */}
    {/* 좋아요 기능 있는 페이지 */}
    <Route path="/Gym" element={<Gym />} />
    <Route path="/Gear" element={<Gear />} />
    <Route path="/Stretch" element={<Stretch />} />
    <Route path="/MyPage" element={<MyPage />} />
  </Routes>
</LikeProvider>
{location.pathname !== '/Ham' && <Footer />}
```

- Hash 기반 라우팅으로 GitHub Pages 등 정적 호스팅에서 새로고침 404를 방지.
- 공통 네비/푸터를 고정하고, `/Ham`처럼 몰입형 페이지는 조건부로 푸터를 숨겨 화면 집중도 확보.
- 좋아요 기능의 범위를 라우트에서 정의해 전역 상태 사용 범위가 한눈에 들어옴.

## 기술적 특징
- **정적 호스팅 대응**: HashRouter 선택으로 경로 재해석 문제 해결.
- **UI 일관성**: Layout이 공통 레이아웃을 강제하여 페이지 전환에도 헤더/푸터 경험이 동일.
- **책임 분리**: 좋아요 유/무 페이지를 분리해 상태 의존도를 명확화.