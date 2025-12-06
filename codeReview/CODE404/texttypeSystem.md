# 텍스트 렌더링 시스템 - textType.js

## 글자별 애니메이션 + 음성 동기화

### 요구사항

- 한 글자씩 화면에 나타나기
- 일정 주기마다 타이핑 효과음 재생
- 모든 글자 완료 후 콜백 실행

### 구현

```javascript
export function textType(textArray, targetElement, callback, delay = 100) {
  let currentArrayIndex = 0;
  
  function displayText(textObj) {
    let text = textObj.text;
    let index = 0;
    
    function typeCharacter() {
      if (index < text.length) {
        targetElement.textContent += text[index];
        
        // 4글자마다 타이핑 사운드 재생
        if (index % 4 === 0 && index !== 0) {
          typingAudio.currentTime = 0; // 효과음 초기화
          typingAudio.play();
        }
        
        index++;
        setTimeout(typeCharacter, delay);
      } else {
        // 현재 메시지 완료
        if (textObj.isDot) {
          // 점 애니메이션 처리
          addDotAnimation(targetElement);
        }
        
        currentArrayIndex++;
        
        if (currentArrayIndex < textArray.length) {
          // 다음 메시지 출력 (1초 대기)
          setTimeout(() => {
            displayText(textArray[currentArrayIndex]);
          }, 1000);
        } else {
          // 모든 메시지 완료
          if (callback) callback();
        }
      }
    }
    
    typeCharacter();
  }
  
  // 첫 메시지 시작
  displayText(textArray[currentArrayIndex]);
}
```

### 기술적 특징

**재귀 + 비동기 처리**
- `typeCharacter()` 함수가 재귀적으로 호출되지만, `setTimeout`으로 비동기 처리
- 스택 오버플로우 없이 수백 글자 처리 가능

**모듈로 연산 (%)으로 주기 제어**
```javascript
if (index % 4 === 0 && index !== 0) {
  typingAudio.play(); // 4글자마다 재생
}
```

**배열 기반 메시지 관리**
- 각 메시지는 `{ text: "...", isDot: true/false }` 형태
- `currentArrayIndex`로 현재 메시지 추적
- 모든 메시지 완료 후 콜백 실행

**효과음 초기화**
```javascript
typingAudio.currentTime = 0; // 효과음이 중복 재생되지 않도록
typingAudio.play();
```

---

## 사용 예시

### Puzzle 1에서의 사용

```javascript
const officePswdMessage = [
  { text: "> 보안 시스템 활성화", isDot: true },
  { text: "> 비밀번호 입력 대기 중", isDot: false }
];

textType(officePswdMessage, messageElement, () => {
  console.log("메시지 완료, 비밀번호 입력 가능");
});
```

### Puzzle 2에서의 사용

```javascript
const errorMessages = [
  { text: "> 시스템 오류 감지", isDot: true },
  { text: "> 관리자 권한 확인 중", isDot: true },
  { text: "> 접근 거부됨", isDot: false }
];

textType(errorMessages, messageElement, () => {
  // 메시지 완료 후 다음 단계
  glitch();
  deepGlitch();
});
```

---

## 렌더링 흐름

```
textType() 호출
    ↓
textArray[0] 메시지 시작
    ├─ 글자 1 출력 (t = 0ms)
    ├─ 글자 2 출력 (t = 100ms)
    ├─ 글자 3 출력 (t = 200ms)
    ├─ 글자 4 출력 + 사운드 재생 (t = 300ms)
    ├─ 글자 5 출력 (t = 400ms)
    └─ ... 반복
        ↓
    모든 글자 완료 (isDot=true 시 점 애니메이션)
        ↓
    1초 대기
        ↓
    textArray[1] 메시지 시작
        ↓
    ... (반복)
        ↓
    모든 메시지 완료
        ↓
    callback() 실행
```