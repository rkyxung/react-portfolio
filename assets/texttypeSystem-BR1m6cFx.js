const r=`# 텍스트 렌더링 시스템 - textType.js\r
\r
## 글자별 애니메이션 + 음성 동기화\r
\r
### 요구사항\r
\r
- 한 글자씩 화면에 나타나기\r
- 일정 주기마다 타이핑 효과음 재생\r
- 모든 글자 완료 후 콜백 실행\r
\r
### 구현\r
\r
\`\`\`javascript\r
export function textType(textArray, targetElement, callback, delay = 100) {\r
  let currentArrayIndex = 0;\r
  \r
  function displayText(textObj) {\r
    let text = textObj.text;\r
    let index = 0;\r
    \r
    function typeCharacter() {\r
      if (index < text.length) {\r
        targetElement.textContent += text[index];\r
        \r
        // 4글자마다 타이핑 사운드 재생\r
        if (index % 4 === 0 && index !== 0) {\r
          typingAudio.currentTime = 0; // 효과음 초기화\r
          typingAudio.play();\r
        }\r
        \r
        index++;\r
        setTimeout(typeCharacter, delay);\r
      } else {\r
        // 현재 메시지 완료\r
        if (textObj.isDot) {\r
          // 점 애니메이션 처리\r
          addDotAnimation(targetElement);\r
        }\r
        \r
        currentArrayIndex++;\r
        \r
        if (currentArrayIndex < textArray.length) {\r
          // 다음 메시지 출력 (1초 대기)\r
          setTimeout(() => {\r
            displayText(textArray[currentArrayIndex]);\r
          }, 1000);\r
        } else {\r
          // 모든 메시지 완료\r
          if (callback) callback();\r
        }\r
      }\r
    }\r
    \r
    typeCharacter();\r
  }\r
  \r
  // 첫 메시지 시작\r
  displayText(textArray[currentArrayIndex]);\r
}\r
\`\`\`\r
\r
### 기술적 특징\r
\r
**재귀 + 비동기 처리**\r
- \`typeCharacter()\` 함수가 재귀적으로 호출되지만, \`setTimeout\`으로 비동기 처리\r
- 스택 오버플로우 없이 수백 글자 처리 가능\r
\r
**모듈로 연산 (%)으로 주기 제어**\r
\`\`\`javascript\r
if (index % 4 === 0 && index !== 0) {\r
  typingAudio.play(); // 4글자마다 재생\r
}\r
\`\`\`\r
\r
**배열 기반 메시지 관리**\r
- 각 메시지는 \`{ text: "...", isDot: true/false }\` 형태\r
- \`currentArrayIndex\`로 현재 메시지 추적\r
- 모든 메시지 완료 후 콜백 실행\r
\r
**효과음 초기화**\r
\`\`\`javascript\r
typingAudio.currentTime = 0; // 효과음이 중복 재생되지 않도록\r
typingAudio.play();\r
\`\`\`\r
\r
---\r
\r
## 사용 예시\r
\r
### Puzzle 1에서의 사용\r
\r
\`\`\`javascript\r
const officePswdMessage = [\r
  { text: "> 보안 시스템 활성화", isDot: true },\r
  { text: "> 비밀번호 입력 대기 중", isDot: false }\r
];\r
\r
textType(officePswdMessage, messageElement, () => {\r
  console.log("메시지 완료, 비밀번호 입력 가능");\r
});\r
\`\`\`\r
\r
### Puzzle 2에서의 사용\r
\r
\`\`\`javascript\r
const errorMessages = [\r
  { text: "> 시스템 오류 감지", isDot: true },\r
  { text: "> 관리자 권한 확인 중", isDot: true },\r
  { text: "> 접근 거부됨", isDot: false }\r
];\r
\r
textType(errorMessages, messageElement, () => {\r
  // 메시지 완료 후 다음 단계\r
  glitch();\r
  deepGlitch();\r
});\r
\`\`\`\r
\r
---\r
\r
## 렌더링 흐름\r
\r
\`\`\`\r
textType() 호출\r
    ↓\r
textArray[0] 메시지 시작\r
    ├─ 글자 1 출력 (t = 0ms)\r
    ├─ 글자 2 출력 (t = 100ms)\r
    ├─ 글자 3 출력 (t = 200ms)\r
    ├─ 글자 4 출력 + 사운드 재생 (t = 300ms)\r
    ├─ 글자 5 출력 (t = 400ms)\r
    └─ ... 반복\r
        ↓\r
    모든 글자 완료 (isDot=true 시 점 애니메이션)\r
        ↓\r
    1초 대기\r
        ↓\r
    textArray[1] 메시지 시작\r
        ↓\r
    ... (반복)\r
        ↓\r
    모든 메시지 완료\r
        ↓\r
    callback() 실행\r
\`\`\``;export{r as default};
