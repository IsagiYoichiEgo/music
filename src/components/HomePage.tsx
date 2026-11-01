interface Props { signedIn: boolean; busy: boolean; onJoin: () => void; onProfile: () => void; }

export default function HomePage({ signedIn, busy, onJoin, onProfile }: Props) {
  return <main>
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-image" src="./images/concert.webp" alt="Музыканты на сцене в лучах концертного света" fetchPriority="high" />
      <div className="hero-shade" />
      <div className="hero-content page-width">
        <p className="eyebrow"><span className="status-dot" /> ГРОМЧЕ, ЧЕМ ПРОСТО МУЗЫКА</p>
        <h1 id="hero-title">THUNDER<br /><span>BEND</span><span className="hero-star" aria-hidden="true">✳</span></h1>
        <p className="hero-description">Своя сцена. Свой звук. Свои люди.<br />Найди своё место в нашем ритме.</p>
        <div className="hero-actions">
          <button className="button button-accent" type="button" disabled={busy} onClick={signedIn ? onProfile : onJoin}>
            {signedIn ? 'Мой профиль' : 'Стать частью группы'} <span aria-hidden="true">↗</span>
          </button>
          <a className="hero-link" href="#about">Узнать о нас <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-bottom"><span>INDIE / ALTERNATIVE / LIVE</span><span>МУЗЫКА НАЧИНАЕТСЯ С ЛЮДЕЙ</span></div>
      </div>
    </section>
    <section className="about-section page-width" id="about">
      <div className="about-label"><p className="eyebrow">01 / О ГРУППЕ</p><span className="large-bolt" aria-hidden="true">ϟ</span></div>
      <div className="about-copy"><h2>Разные истории.<br /><span>Один общий звук.</span></h2>
        <p>Thunder bend — пространство для тех, кто слышит музыку по-своему. Здесь встречаются гитары, живой ритм и люди, которым есть что сказать.</p>
        <p>Неважно, стоишь ты у микрофона или только ищешь свой инструмент. Главное — желание создавать что-то вместе.</p>
        <div className="genre-tags"><span>ГИТАРЫ</span><span>ЖИВОЙ РИТМ</span><span>СВОБОДА ЗВУКА</span></div>
      </div>
    </section>
    <section className="community-section page-width" id="community">
      <div><p className="eyebrow">02 / СООБЩЕСТВО</p><h2>В этой группе<br />есть место <span>тебе.</span></h2>
        <p>Создай профиль музыканта: расскажи о себе,<br className="desktop-break" /> выбери специализацию и настрой свои данные.</p>
      </div>
      <button className="round-join" type="button" disabled={busy} onClick={signedIn ? onProfile : onJoin}
        aria-label={signedIn ? 'Открыть мой профиль' : 'Зарегистрироваться в сообществе'}>↗</button>
    </section>
  </main>;
}
