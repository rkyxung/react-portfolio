# 마이페이지 로그·영상 업로드

## 개요
세션 로그 작성, 영상 업로드/미리보기, 저장된 로그 리스트, 찜 모아보기까지 한 화면에서 제공해 기록→회고 흐름을 완결했습니다. 입력 검증 후 즉시 리스트에 반영하고, 업로드한 파일을 `URL.createObjectURL`로 바로 재생할 수 있게 처리했습니다.

## 주요 코드
```jsx
// 업로드 상태
const [uploadedVideos, setUploadedVideos] = useState([]);
const handleVideoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const newVideo = {
      id: Date.now(),
      name: file.name,
      file: URL.createObjectURL(file),
      level: 'Level 1',
      date: new Date().toISOString().split('T')[0]
    };
    setUploadedVideos(prev => [...prev, newVideo]);
  }
};
```
- 파일 선택 즉시 미리보기 URL을 만들어 썸네일/재생에 활용.

```jsx
// 로그 저장
const handleSaveLog = () => {
  if (title && gym && level && content) {
    const newLog = { id: Date.now(), ... };
    setLogs(prev => [newLog, ...prev]); // prepend로 최신 우선
    setUploadedVideos([]);
    alert('로그가 저장되었습니다!');
  } else {
    alert('모든 필드를 입력해주세요.');
  }
};
```
- 필수 필드 검증 후 로그를 추가하고, 폼/업로드 상태를 초기화해 연속 입력 UX를 깔끔히 유지.

## 기술적 특징
- **즉시 피드백**: 업로드 직후 썸네일과 이름을 보여주고, 삭제 버튼으로 개별 제거 가능.
- **상태 초기화**: 저장 시 입력값·업로드 목록을 리셋해 중복 입력/중복 업로드를 방지.
- **안전한 찜 접근**: `likedItems` 미존재 시 기본값을 세팅해 null 접근 에러를 회피.
- **플레이어 상태 분리**: `playingVideo`로 현재 재생 중인 로그를 별도 관리해 UI 분기 간결.