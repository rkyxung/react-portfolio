const n=`# CountDown Page\r
\r
## 개요\r
이벤트까지 남은 시간을 정확하게 계산해 카운트다운을 표시합니다. 모바일과 데스크톱에서 3D 객체를 다르게 렌더링하며 레거시 브라우저 호환성도 고려했습니다.\r
\r
## 주요 코드\r
\r
EVENT_START 상수로 정확한 시간 계산 기준을 설정했고, setInterval을 1초 단위로 실행해 시간을 계속 갱신합니다. padStart로 시간을 2자리로 포맷팅하고(예: 3 → "03"), 모바일과 데스크톱에서 cameraDistance와 autoRotate 값을 다르게 설정합니다.\r
\r
\`\`\`jsx\r
"use client";\r
\r
import { useEffect, useState } from "react";\r
import { PIVOTTIME } from "../../../components/svgCode";\r
import Line3D from "../../../components/mainSections/3dKeyVisual/line3D";\r
\r
const EVENT_START = new Date("2025-11-21T10:00:00+09:00");\r
\r
const MOBILE_AUTO_ROTATE_SPEED = 0.003;\r
const MS_IN_SECOND = 1000;\r
const MS_IN_MINUTE = 60 * MS_IN_SECOND;\r
const MS_IN_HOUR = 60 * MS_IN_MINUTE;\r
const MS_IN_DAY = 24 * MS_IN_HOUR;\r
\r
const getTimeRemaining = () => {\r
  const now = Date.now();\r
  const target = EVENT_START.getTime();\r
  const diff = Math.max(0, target - now);\r
\r
  const days = Math.floor(diff / MS_IN_DAY);\r
  const hours = Math.floor((diff % MS_IN_DAY) / MS_IN_HOUR);\r
  const minutes = Math.floor((diff % MS_IN_HOUR) / MS_IN_MINUTE);\r
  const seconds = Math.floor((diff % MS_IN_MINUTE) / MS_IN_SECOND);\r
\r
  return { days, hours, minutes, seconds };\r
};\r
\r
const formatSegment = (value) => String(value).padStart(2, "0");\r
\r
export default function CountDown() {\r
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining);\r
  const [isMobile, setIsMobile] = useState(false);\r
\r
  useEffect(() => {\r
    const tick = () => setTimeLeft(getTimeRemaining());\r
    const intervalId = setInterval(tick, 1000);\r
    return () => clearInterval(intervalId);\r
  }, []);\r
\r
  useEffect(() => {\r
    if (typeof window === "undefined") return;\r
\r
    const mediaQuery = window.matchMedia("(max-width: 640px)");\r
    const updateMatch = (event) => setIsMobile(event.matches);\r
\r
    setIsMobile(mediaQuery.matches);\r
\r
    if (typeof mediaQuery.addEventListener === "function") {\r
      mediaQuery.addEventListener("change", updateMatch);\r
    } else {\r
      mediaQuery.addListener(updateMatch);\r
    }\r
\r
    return () => {\r
      if (typeof mediaQuery.removeEventListener === "function") {\r
        mediaQuery.removeEventListener("change", updateMatch);\r
      } else {\r
        mediaQuery.removeListener(updateMatch);\r
      }\r
    };\r
  }, []);\r
\r
  const cameraDistance = isMobile ? 650 : 400;\r
\r
  return (\r
    <div className="d-day">\r
      <div className="object">\r
        <Line3D\r
          cameraDistance={cameraDistance}\r
          interactive={!isMobile}\r
          enableHover={!isMobile}\r
          autoRotate={isMobile}\r
          autoRotateSpeed={MOBILE_AUTO_ROTATE_SPEED}\r
        />\r
      </div>\r
    </div>\r
  );\r
}\r
\`\`\`\r
\r
시간 단위를 상수로 정의하고 나머지 연산으로 일, 시, 분, 초를 개별 추출합니다. Math.max로 음수 시간이 나오지 않도록 보장합니다. padStart를 사용해 모든 시간 값을 2자리로 표시합니다(예: 3 → "03").\r
`;export{n as default};
