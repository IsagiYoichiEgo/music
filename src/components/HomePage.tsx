interface Props {
  signedIn: boolean;
  busy: boolean;
  onJoin: () => void;
  onProfile: () => void;
}

export default function HomePage({ signedIn, busy, onJoin, onProfile }: Props) {
  return <main>
    <section className="hero" aria-labelledby="hero-title">
      <img className="hero-image" src="./images/concert.webp" alt="Группа на сцене" fetchPriority="high" />
      <div className="hero-content page-width">
        <h1 id="hero-title">Thunder bend</h1>
        <p>Сайт музыкальной группы</p>
        <button className="button button-accent" type="button" disabled={busy}
          onClick={signedIn ? onProfile : onJoin}>
          {signedIn ? 'Открыть профиль' : 'Зарегистрироваться'}
        </button>
      </div>
    </section>
    <section className="about-section page-width" id="about">
      <h2>О группе</h2>
      <p>Thunder bend — музыкальная группа.</p>
      <p>На сайте можно создать аккаунт и заполнить профиль музыканта: указать имя, специализацию и информацию о себе.</p>
    </section>
  </main>;
}
