const contacts = [
  { label: 'Email', value: 'kimgy071928@gmail.com', link: 'mailto:kimgy071928@gmail.com' },
  { label: 'Phone', value: '010-6202-5991' },
  { label: 'GitHub', value: 'github.com/rkyxung', link: 'https://github.com/rkyxung' },
];

function Contact() {
  return (
    <section className="section contact-section">
      <header className="section-header">
        <p className="eyebrow">Contact</p>
        <h1>프로젝트 제안 · 협업 문의</h1>
        <p>사용자 경험을 구조화하고 테스트하며 완성도를 높이는 작업을 함께하고 싶습니다.</p>
      </header>

      <div className="contact-board">
        <div>
          <h2>연락처</h2>
          <ul>
            {contacts.map((contact) => (
              <li key={contact.label}>
                <span>{contact.label}</span>
                {contact.link ? (
                  <a href={contact.link} target="_blank" rel="noreferrer">
                    {contact.value}
                  </a>
                ) : (
                  contact.value
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>작업 신념</h2>
          <p>
            오류를 임시로 덮지 않고 원인을 분석해 구조를 재정비하고, 테스트와 기록을 반복하며 근본적인
            해결을 추구합니다. 사용자 경험이 기억에 남는 웹을 만드는 일에 집중하고 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
