const contact = [
  { label: 'Email', value: 'kimgy071928@gmail.com', href: 'mailto:kimgy071928@gmail.com' },
  { label: 'Phone', value: '010-6202-5991' },
  { label: 'GitHub', value: 'github.com/rkyxung', href: 'https://github.com/rkyxung' },
];

const snapshot = [
  {
    title: '현재',
    detail: '계원예술대학교 디지털미디어디자인 전공 · 2024.03 입학, 재학 중',
  },
  {
    title: '주요 기술',
    detail: 'HTML · CSS · JavaScript · React · Unity · C#',
  },
  {
    title: '프로젝트',
    detail: 'Spike, CODE404, CLIMB ON 등 팀/개인 프로젝트 9건',
  },
];

function Home() {
  return (
    <section className="section home-section">
      <header className="section-headline">
        <p className="eyebrow">끈기 있는 프론트엔드 개발자</p>
        <h1>김가영 · 2003.07.19</h1>
        <p>
          사용자가 체험할 수 있는 웹을 구현하기 위해 문제를 끝까지 파고드는 프론트엔드 개발자
          김가영입니다.
        </p>
      </header>

      <dl className="contact-row">
        {contact.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="snapshot-grid">
        {snapshot.map((item) => (
          <article key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>

      <div className="plain-note">
        <p>
          디자인 전공을 통해 구조적인 사고를 익혔고, 웹과 게임 프로젝트에서 사용자 흐름을 직접 설계하고
          검증하며 실전 경험을 쌓았습니다. 문제의 원인을 끝까지 추적하고, 작동하는 구조를 코드로 재현하는
          일에 집중하고 있습니다.
        </p>
      </div>
    </section>
  );
}

export default Home;
