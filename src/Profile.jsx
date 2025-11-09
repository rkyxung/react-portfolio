const narratives = [
  {
    title: '디자인에서 출발해 구조를 만드는 개발자로 성장 중입니다',
    body: '디지털미디어디자인 전공을 통해 사용자 경험을 시각화하는 방식을 배웠고, 이를 직접 구현하고 싶어 HTML과 CSS로 첫 아이디어를 만들었습니다. 화면이 실제로 작동하는 순간을 경험하며 “디자인이 작동한다”는 감각을 얻었고, 시각적 경험을 구조로 전환하는 프론트엔드 개발의 길을 걷게 되었습니다.',
  },
  {
    title: '안정적인 구조를 끝까지 설계합니다',
    body: "3인 팀 프로젝트 Spike에서는 스크롤 애니메이션과 스와이프 전환이 겹치며 오류가 발생했습니다. Intersection Observer 기반으로 레이아웃을 재설계하고 리소스 호출을 정리해 자연스럽고 안정적인 흐름을 만들었습니다. CODE404 방탈출 게임은 모든 로직을 바닐라 자바스크립트로 작성하며 이벤트 흐름 제어와 디버깅 역량을 키웠습니다.",
  },
  {
    title: '발생한 오류의 근거를 추적합니다',
    body: "Unity 프로젝트 ‘도시를 지켜라’ 제작 중 보스 생성 조건이 꼬이는 문제를 단순히 삭제하지 않고, 조건 로직과 충돌 체크를 분리하며 원인을 끝까지 추적했습니다. 작동하지 않는 이유를 이해할 때까지 멈추지 않는 끈기가 제 작업 방식입니다.",
  },
  {
    title: '협업과 관점의 차이를 존중합니다',
    body: '기획자·디자이너·개발자가 각자의 언어를 가지고 있음을 경험했고, 그 차이를 이해하며 새로운 해결 방식을 찾았습니다. 팀 프로젝트에서 커뮤니케이션을 주도하며 공감대를 만드는 역할을 맡았습니다.',
  },
  {
    title: '끈기와 완성도를 바탕으로 일합니다',
    body: '오류를 단순 수정에 그치지 않고 구조를 재정비하고 테스트를 반복합니다. 사용자가 체험하고 기억에 남는 웹 경험을 만들기 위해 끝까지 파고드는 태도를 유지하겠습니다.',
  },
];

const coreSkills = [
  {
    title: 'HTML · CSS',
    description: '구조적 마크업과 반응형 레이아웃을 설계하고, CSS 애니메이션과 트랜지션으로 인터랙티브 UI를 구현합니다.',
  },
  {
    title: 'JavaScript',
    description: 'DOM 조작, 이벤트 제어, 비동기 로직으로 데이터를 처리하며 동적인 콘텐츠를 렌더링합니다.',
  },
  {
    title: 'React',
    description: '컴포넌트 단위 UI 제작과 상태 관리(useState, useEffect), Context를 통한 전역 상태 흐름을 구성합니다.',
  },
  {
    title: 'Unity · C#',
    description: '충돌 감지, 이벤트 트리거, 오브젝트 제어로 VR/시뮬레이션 인터랙션을 구현합니다.',
  },
];

const supportSkills = [
  {
    title: 'Figma',
    description: 'UI 설계, 프로토타이핑, 컴포넌트 시스템 구성 가능',
  },
  {
    title: 'Adobe Photoshop',
    description: '그래픽 제작 및 편집 가능',
  },
  {
    title: 'Adobe Illustrator',
    description: '아이콘, 브랜드 자산 제작에 활용',
  },
];

function Profile() {
  return (
    <section className="section profile-section">
      <header className="section-header">
        <p className="eyebrow">Profile & Skills</p>
        <h1>사용자 경험을 구조로 만드는 과정</h1>
      </header>

      <div className="narrative-column">
        {narratives.map((item) => (
          <article key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      <div className="skill-section">
        <div>
          <h2>주요 기술</h2>
          <ul>
            {coreSkills.map((skill) => (
              <li key={skill.title}>
                <strong>{skill.title}</strong>
                <p>{skill.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>보조 기술</h2>
          <ul>
            {supportSkills.map((skill) => (
              <li key={skill.title}>
                <strong>{skill.title}</strong>
                <p>{skill.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Profile;
