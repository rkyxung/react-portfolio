const n=`# 시각 효과 시스템 - glitch.js, deepGlitch.js\r
\r
## Canvas를 이용한 실시간 왜곡 효과\r
\r
오류 상태를 시각적으로 표현하기 위해 Canvas API를 사용해 이미지를 실시간 조작합니다.\r
\r
---\r
\r
## glitch.js: 기본 글리치 효과\r
\r
### 개념\r
\r
원본 이미지를 여러 개의 작은 직사각형으로 나누어, 각 조각을 무작위로 이동시켜 왜곡된 효과를 만듭니다.\r
\r
### 구현\r
\r
\`\`\`javascript\r
export function glitch() {\r
  const canvas = document.getElementById("glitch-layer");\r
  const ctx = canvas.getContext("2d");\r
\r
  // 캔버스 크기 설정\r
  canvas.width = window.innerWidth;\r
  canvas.height = window.innerHeight;\r
\r
  function getTargets() {\r
    // 글리치 효과를 적용할 이미지들 선택\r
    return document.querySelectorAll(".glitch-target");\r
  }\r
\r
  function glitchCanvas() {\r
    // 캔버스 초기화\r
    ctx.clearRect(0, 0, canvas.width, canvas.height);\r
\r
    const targets = getTargets();\r
\r
    // 원본 이미지 먼저 그리기\r
    targets.forEach((img) => {\r
      const rect = img.getBoundingClientRect();\r
      ctx.drawImage(img, rect.left, rect.top, rect.width, rect.height);\r
    });\r
\r
    // 80개의 작은 직사각형으로 왜곡\r
    for (let i = 0; i < 80; i++) {\r
      // 무작위 위치와 크기\r
      const x = Math.random() * canvas.width;\r
      const y = Math.random() * canvas.height;\r
      const w = Math.random() * 80 + 30;    // 30~110px 너비\r
      const h = Math.random() * 6 + 15;     // 15~21px 높이\r
\r
      // 현재 위치의 픽셀 데이터 추출\r
      const imageData = ctx.getImageData(x, y, w, h);\r
\r
      // 약간 이동된 위치에 붙여넣기 (±10px)\r
      ctx.putImageData(\r
        imageData,\r
        x + (Math.random() * 20 - 10),\r
        y + (Math.random() * 10 - 5)\r
      );\r
    }\r
  }\r
\r
  // 500ms마다 글리치 프레임 업데이트\r
  let glitchInterval = setInterval(glitchCanvas, 500);\r
\r
  // 글리치 중지 함수\r
  return () => {\r
    clearInterval(glitchInterval);\r
    ctx.clearRect(0, 0, canvas.width, canvas.height);\r
  };\r
}\r
\`\`\`\r
\r
### 기술적 특징\r
\r
**getImageData/putImageData 활용**\r
\`\`\`javascript\r
const imageData = ctx.getImageData(x, y, w, h); // 사각형 영역 추출\r
ctx.putImageData(imageData, newX, newY);         // 다른 위치에 붙여넣기\r
\`\`\`\r
- 픽셀 단위 조작으로 정교한 왜곡 표현\r
- 원본 이미지 손상 없음 (추출 후 이동만)\r
\r
**무작위성으로 불안정함 표현**\r
\`\`\`javascript\r
const x = Math.random() * canvas.width;      // 무작위 x\r
const w = Math.random() * 80 + 30;           // 무작위 너비 (30~110)\r
\`\`\`\r
- 매 프레임마다 다른 패턴 생성\r
- 오류 상태의 예측 불가능함 표현\r
\r
**성능 최적화**\r
\`\`\`javascript\r
setInterval(glitchCanvas, 500); // 0.5초마다 업데이트\r
\`\`\`\r
- 매 프레임이 아닌 500ms 간격으로 업데이트\r
- CPU 부하 절감하면서도 충분한 시각적 효과 제공\r
\r
---\r
\r
## deepGlitch.js: 고급 글리치 효과 (픽셀화)\r
\r
### 개념\r
\r
glitch()의 왜곡 + 픽셀화를 조합해 더 심각한 손상 상태를 표현합니다.\r
\r
### 구현\r
\r
\`\`\`javascript\r
export function deepGlitch() {\r
  const canvas = document.getElementById("glitch-layer");\r
  const ctx = canvas.getContext("2d");\r
\r
  // 오프스크린 캔버스 (임시 처리용)\r
  const bufferCanvas = document.createElement("canvas");\r
  bufferCanvas.width = canvas.width;\r
  bufferCanvas.height = canvas.height;\r
  const bufferCtx = bufferCanvas.getContext("2d");\r
\r
  function pixelate(context) {\r
    // 랜덤 픽셀 크기로 픽셀화\r
    const pixelSize = Math.random() * 8 + 4; // 4~12px\r
\r
    const imageData = context.getImageData(\r
      0, 0, bufferCanvas.width, bufferCanvas.height\r
    );\r
    const data = imageData.data;\r
\r
    // 픽셀 크기 단위로 색상 평균화\r
    for (let i = 0; i < data.length; i += 4) {\r
      // R, G, B, A 값을 더 큰 블록 단위로 처리\r
      // (간단한 예시 - 실제로는 더 복잡함)\r
    }\r
\r
    context.putImageData(imageData, 0, 0);\r
  }\r
\r
  function glitchCanvas() {\r
    // 버퍼 캔버스에 먼저 그리고 처리\r
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);\r
\r
    // 원본 이미지 버퍼에 그리기\r
    const targets = document.querySelectorAll(".glitch-target");\r
    targets.forEach((img) => {\r
      const rect = img.getBoundingClientRect();\r
      bufferCtx.drawImage(img, rect.left, rect.top, rect.width, rect.height);\r
    });\r
\r
    // 왜곡 효과 (glitch와 유사)\r
    for (let i = 0; i < 100; i++) {\r
      const x = Math.random() * bufferCanvas.width;\r
      const y = Math.random() * bufferCanvas.height;\r
      const w = Math.random() * 100 + 20;\r
      const h = Math.random() * 8 + 10;\r
\r
      const imageData = bufferCtx.getImageData(x, y, w, h);\r
      bufferCtx.putImageData(\r
        imageData,\r
        x + (Math.random() * 30 - 15),\r
        y + (Math.random() * 15 - 7)\r
      );\r
    }\r
\r
    // 픽셀화 처리\r
    pixelate(bufferCtx);\r
\r
    // 최종 결과를 메인 캔버스로 복사\r
    ctx.clearRect(0, 0, canvas.width, canvas.height);\r
    ctx.drawImage(bufferCanvas, 0, 0);\r
  }\r
\r
  // 300ms마다 업데이트 (glitch보다 더 빠름)\r
  let deepGlitchInterval = setInterval(glitchCanvas, 300);\r
\r
  return () => {\r
    clearInterval(deepGlitchInterval);\r
    ctx.clearRect(0, 0, canvas.width, canvas.height);\r
  };\r
}\r
\`\`\`\r
\r
### 기술적 특징\r
\r
**오프스크린 렌더링**\r
\`\`\`javascript\r
const bufferCanvas = document.createElement('canvas');\r
const bufferCtx = bufferCanvas.getContext('2d');\r
\`\`\`\r
- 메인 캔버스 대신 버퍼 캔버스에서 처리\r
- 여러 효과를 순차적으로 적용 가능\r
- 최종 결과만 메인 캔버스로 복사\r
\r
**다단계 효과 처리**\r
1. 버퍼에 원본 이미지 그리기\r
2. 왜곡 적용 (putImageData)\r
3. 픽셀화 처리\r
4. 메인 캔버스로 복사\r
\r
**더 빠른 업데이트**\r
\`\`\`javascript\r
setInterval(glitchCanvas, 300); // glitch는 500ms\r
\`\`\`\r
- 더 자주 업데이트되어 더 격렬한 효과 표현\r
\r
---\r
\r
## 사용 시나리오\r
\r
### glitch() - 오류 상태 초기\r
\r
\`\`\`javascript\r
// start.js\r
yes.addEventListener("click", () => {\r
  ErrorValue = true;\r
  glitch(); // 기본 글리치 시작\r
});\r
\`\`\`\r
\r
### deepGlitch() - 심각한 오류 상태\r
\r
\`\`\`javascript\r
// puzzle02.js - 모든 보안 인증 완료 후\r
setTimeout(() => {\r
  glitchLayer.classList.add("shake");\r
  setTimeout(() => {\r
    glitchLayer.classList.remove("shake");\r
    if (onComplete) onComplete();\r
    deepGlitch(); // 심각한 글리치로 전환\r
  }, 3000);\r
}, 8000);\r
\`\`\`\r
\r
---\r
\r
## stopGlitch() 함수\r
\r
글리치 효과를 중지하려면:\r
\r
\`\`\`javascript\r
export function stopGlitch() {\r
  const canvas = document.getElementById("glitch-layer");\r
  const ctx = canvas.getContext("2d");\r
  ctx.clearRect(0, 0, canvas.width, canvas.height);\r
  // setInterval 정리 (위의 반환 함수 사용)\r
}\r
`;export{n as default};
