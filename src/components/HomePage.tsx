interface Props {
  signedIn: boolean;
  busy: boolean;
  onJoin: () => void;
  onProfile: () => void;
}

export default function HomePage({ signedIn, busy, onJoin, onProfile }: Props) {
  return <main>
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-image" src="./images/concert.webp" alt="Иллюстрация: музыканты на тёмной сцене в свете прожекторов" fetchPriority="high" />
      <div className="hero-content page-width">
        <p className="hero-intro">Сайт музыкальной группы</p>
        <h1 id="hero-title"><span>Thunder</span><span>bend<span className="title-period" aria-hidden="true">.</span></span></h1>
        <div className="hero-caption">
          <p>Создайте аккаунт и заполните<br className="desktop-break" /> профиль музыканта.</p>
          <button className="button button-accent" type="button" disabled={busy}
            onClick={signedIn ? onProfile : onJoin}>
            {signedIn ? 'Открыть профиль' : 'Создать аккаунт'}
          </button>
        </div>
      </div>
      <div className="hero-bottom page-width">
        <a href="#about" className="hero-scroll"><span className="scroll-symbol" aria-hidden="true">↓</span>О проекте</a>
        <span className="hero-note">Концертное изображение — иллюстрация</span>
      </div>
    </section>
    <section className="about-section page-width" id="about" aria-labelledby="about-title">
      <div className="about-copy">
        <p className="section-label">Учебный проект</p>
        <h2 id="about-title">Профиль<br />музыканта</h2>
        <p>Thunder bend — учебный сайт музыкальной группы. Здесь можно создать аккаунт и сохранить информацию о себе.</p>
        <button className="text-link" type="button" disabled={busy} onClick={signedIn ? onProfile : onJoin}>
          {signedIn ? 'Перейти в профиль' : 'Зарегистрироваться'}<span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="profile-features">
        <div className="feature-row"><h3>Имя и специализация</h3><p>Укажите имя и свою специализацию.</p></div>
        <div className="feature-row"><h3>Несколько слов о себе</h3><p>Расскажите о музыкальном опыте.</p></div>
        <div className="feature-row"><h3>Гонорар</h3><p>Добавьте сумму и меняйте её в профиле.</p></div>
      </div>
    </section>
  </main>;
}
