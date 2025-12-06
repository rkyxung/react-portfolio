# CountDown Page

## 개요
이벤트까지 남은 시간을 정확하게 계산해 카운트다운을 표시합니다. 모바일과 데스크톱에서 3D 객체를 다르게 렌더링하며 레거시 브라우저 호환성도 고려했습니다.

## 주요 코드

EVENT_START 상수로 정확한 시간 계산 기준을 설정했고, setInterval을 1초 단위로 실행해 시간을 계속 갱신합니다. padStart로 시간을 2자리로 포맷팅하고(예: 3 → "03"), 모바일과 데스크톱에서 cameraDistance와 autoRotate 값을 다르게 설정합니다.

```jsx
"use client";

import { useEffect, useState } from "react";
import { PIVOTTIME } from "../../../components/svgCode";
import Line3D from "../../../components/mainSections/3dKeyVisual/line3D";

const EVENT_START = new Date("2025-11-21T10:00:00+09:00");

const MOBILE_AUTO_ROTATE_SPEED = 0.003;
const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

const getTimeRemaining = () => {
  const now = Date.now();
  const target = EVENT_START.getTime();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / MS_IN_DAY);
  const hours = Math.floor((diff % MS_IN_DAY) / MS_IN_HOUR);
  const minutes = Math.floor((diff % MS_IN_HOUR) / MS_IN_MINUTE);
  const seconds = Math.floor((diff % MS_IN_MINUTE) / MS_IN_SECOND);

  return { days, hours, minutes, seconds };
};

const formatSegment = (value) => String(value).padStart(2, "0");

export default function CountDown() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeRemaining());
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateMatch = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMatch);
    } else {
      mediaQuery.addListener(updateMatch);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", updateMatch);
      } else {
        mediaQuery.removeListener(updateMatch);
      }
    };
  }, []);

  const cameraDistance = isMobile ? 650 : 400;

  return (
    <div className="d-day">
      <div className="object">
        <Line3D
          cameraDistance={cameraDistance}
          interactive={!isMobile}
          enableHover={!isMobile}
          autoRotate={isMobile}
          autoRotateSpeed={MOBILE_AUTO_ROTATE_SPEED}
        />
      </div>
    </div>
  );
}
```

시간 단위를 상수로 정의하고 나머지 연산으로 일, 시, 분, 초를 개별 추출합니다. Math.max로 음수 시간이 나오지 않도록 보장합니다. padStart를 사용해 모든 시간 값을 2자리로 표시합니다(예: 3 → "03").
