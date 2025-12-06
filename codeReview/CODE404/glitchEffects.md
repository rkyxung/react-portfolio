# 시각 효과 시스템 - glitch.js, deepGlitch.js

## Canvas를 이용한 실시간 왜곡 효과

오류 상태를 시각적으로 표현하기 위해 Canvas API를 사용해 이미지를 실시간 조작합니다.

---

## glitch.js: 기본 글리치 효과

### 개념

원본 이미지를 여러 개의 작은 직사각형으로 나누어, 각 조각을 무작위로 이동시켜 왜곡된 효과를 만듭니다.

### 구현

```javascript
export function glitch() {
  const canvas = document.getElementById("glitch-layer");
  const ctx = canvas.getContext("2d");

  // 캔버스 크기 설정
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  function getTargets() {
    // 글리치 효과를 적용할 이미지들 선택
    return document.querySelectorAll(".glitch-target");
  }

  function glitchCanvas() {
    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const targets = getTargets();

    // 원본 이미지 먼저 그리기
    targets.forEach((img) => {
      const rect = img.getBoundingClientRect();
      ctx.drawImage(img, rect.left, rect.top, rect.width, rect.height);
    });

    // 80개의 작은 직사각형으로 왜곡
    for (let i = 0; i < 80; i++) {
      // 무작위 위치와 크기
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const w = Math.random() * 80 + 30;    // 30~110px 너비
      const h = Math.random() * 6 + 15;     // 15~21px 높이

      // 현재 위치의 픽셀 데이터 추출
      const imageData = ctx.getImageData(x, y, w, h);

      // 약간 이동된 위치에 붙여넣기 (±10px)
      ctx.putImageData(
        imageData,
        x + (Math.random() * 20 - 10),
        y + (Math.random() * 10 - 5)
      );
    }
  }

  // 500ms마다 글리치 프레임 업데이트
  let glitchInterval = setInterval(glitchCanvas, 500);

  // 글리치 중지 함수
  return () => {
    clearInterval(glitchInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}
```

### 기술적 특징

**getImageData/putImageData 활용**
```javascript
const imageData = ctx.getImageData(x, y, w, h); // 사각형 영역 추출
ctx.putImageData(imageData, newX, newY);         // 다른 위치에 붙여넣기
```
- 픽셀 단위 조작으로 정교한 왜곡 표현
- 원본 이미지 손상 없음 (추출 후 이동만)

**무작위성으로 불안정함 표현**
```javascript
const x = Math.random() * canvas.width;      // 무작위 x
const w = Math.random() * 80 + 30;           // 무작위 너비 (30~110)
```
- 매 프레임마다 다른 패턴 생성
- 오류 상태의 예측 불가능함 표현

**성능 최적화**
```javascript
setInterval(glitchCanvas, 500); // 0.5초마다 업데이트
```
- 매 프레임이 아닌 500ms 간격으로 업데이트
- CPU 부하 절감하면서도 충분한 시각적 효과 제공

---

## deepGlitch.js: 고급 글리치 효과 (픽셀화)

### 개념

glitch()의 왜곡 + 픽셀화를 조합해 더 심각한 손상 상태를 표현합니다.

### 구현

```javascript
export function deepGlitch() {
  const canvas = document.getElementById("glitch-layer");
  const ctx = canvas.getContext("2d");

  // 오프스크린 캔버스 (임시 처리용)
  const bufferCanvas = document.createElement("canvas");
  bufferCanvas.width = canvas.width;
  bufferCanvas.height = canvas.height;
  const bufferCtx = bufferCanvas.getContext("2d");

  function pixelate(context) {
    // 랜덤 픽셀 크기로 픽셀화
    const pixelSize = Math.random() * 8 + 4; // 4~12px

    const imageData = context.getImageData(
      0, 0, bufferCanvas.width, bufferCanvas.height
    );
    const data = imageData.data;

    // 픽셀 크기 단위로 색상 평균화
    for (let i = 0; i < data.length; i += 4) {
      // R, G, B, A 값을 더 큰 블록 단위로 처리
      // (간단한 예시 - 실제로는 더 복잡함)
    }

    context.putImageData(imageData, 0, 0);
  }

  function glitchCanvas() {
    // 버퍼 캔버스에 먼저 그리고 처리
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

    // 원본 이미지 버퍼에 그리기
    const targets = document.querySelectorAll(".glitch-target");
    targets.forEach((img) => {
      const rect = img.getBoundingClientRect();
      bufferCtx.drawImage(img, rect.left, rect.top, rect.width, rect.height);
    });

    // 왜곡 효과 (glitch와 유사)
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * bufferCanvas.width;
      const y = Math.random() * bufferCanvas.height;
      const w = Math.random() * 100 + 20;
      const h = Math.random() * 8 + 10;

      const imageData = bufferCtx.getImageData(x, y, w, h);
      bufferCtx.putImageData(
        imageData,
        x + (Math.random() * 30 - 15),
        y + (Math.random() * 15 - 7)
      );
    }

    // 픽셀화 처리
    pixelate(bufferCtx);

    // 최종 결과를 메인 캔버스로 복사
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bufferCanvas, 0, 0);
  }

  // 300ms마다 업데이트 (glitch보다 더 빠름)
  let deepGlitchInterval = setInterval(glitchCanvas, 300);

  return () => {
    clearInterval(deepGlitchInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}
```

### 기술적 특징

**오프스크린 렌더링**
```javascript
const bufferCanvas = document.createElement('canvas');
const bufferCtx = bufferCanvas.getContext('2d');
```
- 메인 캔버스 대신 버퍼 캔버스에서 처리
- 여러 효과를 순차적으로 적용 가능
- 최종 결과만 메인 캔버스로 복사

**다단계 효과 처리**
1. 버퍼에 원본 이미지 그리기
2. 왜곡 적용 (putImageData)
3. 픽셀화 처리
4. 메인 캔버스로 복사

**더 빠른 업데이트**
```javascript
setInterval(glitchCanvas, 300); // glitch는 500ms
```
- 더 자주 업데이트되어 더 격렬한 효과 표현

---

## 사용 시나리오

### glitch() - 오류 상태 초기

```javascript
// start.js
yes.addEventListener("click", () => {
  ErrorValue = true;
  glitch(); // 기본 글리치 시작
});
```

### deepGlitch() - 심각한 오류 상태

```javascript
// puzzle02.js - 모든 보안 인증 완료 후
setTimeout(() => {
  glitchLayer.classList.add("shake");
  setTimeout(() => {
    glitchLayer.classList.remove("shake");
    if (onComplete) onComplete();
    deepGlitch(); // 심각한 글리치로 전환
  }, 3000);
}, 8000);
```

---

## stopGlitch() 함수

글리치 효과를 중지하려면:

```javascript
export function stopGlitch() {
  const canvas = document.getElementById("glitch-layer");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // setInterval 정리 (위의 반환 함수 사용)
}
