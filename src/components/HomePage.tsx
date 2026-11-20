import { useEffect, useRef } from 'react';

interface Props {
  signedIn: boolean;
  busy: boolean;
  onJoin: () => void;
  onProfile: () => void;
}

const tracks = [
  ['Гроза над городом', '3:48'], ['Ток', '2:57'], ['Сорок вольт', '4:12'], ['Последний трамвай', '3:31'],
  ['Пыль', '3:05'], ['Шум прибоя в степи', '5:20'], ['Без проводов', '3:44'], ['Утро после', '4:36'],
];
const lineup = [
  { name: 'Тимур', role: 'Вокал', icon: 'mic' },
  { name: 'Алия', role: 'Гитара', icon: 'guitar' },
  { name: 'Даниэль', role: 'Бас-гитара', icon: 'bass' },
  { name: 'Руслан', role: 'Ударные', icon: 'drums' },
] as const;
const tour = [
  { day: '12', month: 'дек', city: 'Бишкек', venue: 'Клуб «Подвал»', status: 'Билеты в продаже' },
  { day: '19', month: 'дек', city: 'Алматы', venue: 'Зал «Северный»', status: 'Осталось мало' },
  { day: '27', month: 'дек', city: 'Ташкент', venue: 'Сцена «Ангар»', status: 'Билеты в продаже' },
  { day: '10', month: 'янв', city: 'Астана', venue: 'Клуб «Тон»', status: 'Всё продано' },
  { day: '24', month: 'янв', city: 'Ош', venue: 'Летний театр', status: 'Скоро в продаже' },
];

function InstrumentIcon({ name }: { name: typeof lineup[number]['icon'] }) {
  const paths = {
    mic: <><rect x="17" y="6" width="14" height="22" rx="7" /><path d="M11 22a13 13 0 0 0 26 0M24 35v7M17 42h14" /></>,
    guitar: <><path d="M31 17 41 7M37 5l6 6" /><path d="M29 19c-4-4-11-3-13 2-1 3-4 3-6 5-4 4-3 11 2 15s11 6 15 2c2-2 2-5 5-6 5-2 6-9 2-13z" /><circle cx="22" cy="28" r="3" /></>,
    bass: <><path d="M30 18 42 6M39 3l6 6" /><path d="M28 20c-3-3-9-2-11 2-1 2-3 3-5 4-4 3-4 10 1 14s11 5 14 1c1-2 2-4 4-5 4-2 5-8 2-11z" /><path d="M16 32l6-6" /></>,
    drums: <><ellipse cx="24" cy="18" rx="15" ry="6" /><path d="M9 18v14c0 3 7 6 15 6s15-3 15-6V18M14 9l7 7M34 9l-7 7" /></>,
  };
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

// Elements with data-reveal fade in once they scroll into view.
function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const items = root.current?.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!items || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    items.forEach((item) => { item.classList.add('will-reveal'); observer.observe(item); });
    return () => observer.disconnect();
  }, [root]);
}

// The concert photo drifts slower than the page.
function useParallax(image: React.RefObject<HTMLImageElement | null>) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => { frame = 0; image.current?.style.setProperty('--parallax', Math.min(window.scrollY, 900) * 0.35 + 'px'); };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); };
  }, [image]);
}

export default function HomePage({ signedIn, busy, onJoin, onProfile }: Props) {
  const root = useRef<HTMLElement>(null);
  const image = useRef<HTMLImageElement>(null);
  useReveal(root);
  useParallax(image);
  const join = signedIn ? onProfile : onJoin;

  return <main ref={root}>
    <section className="hero" aria-labelledby="hero-title">
      <img ref={image} className="hero-image" src="./images/concert.webp" alt="Иллюстрация: музыканты на тёмной сцене в свете прожекторов" fetchPriority="high" />
      <div className="hero-beams" aria-hidden="true"><i /><i /><i /></div>
      <div className="hero-content page-width">
        <p className="hero-intro">Новый альбом «Гроза» уже вышел</p>
        <h1 id="hero-title" aria-label="Thunder bend">
          <span aria-hidden="true">{[...'Thunder'].map((letter, index) => <b key={index} style={{ '--i': index } as React.CSSProperties}>{letter}</b>)}</span>
          <span aria-hidden="true">{[...'bend'].map((letter, index) => <b key={index} style={{ '--i': index + 7 } as React.CSSProperties}>{letter}</b>)}<span className="title-period">.</span></span>
        </h1>
        <div className="hero-caption">
          <p>Громкий рок из Бишкека. Создайте аккаунт<br className="desktop-break" /> и заполните профиль музыканта.</p>
          <div className="hero-actions">
            <button className="button button-accent" type="button" disabled={busy} onClick={join}>{signedIn ? 'Открыть профиль' : 'Создать аккаунт'}</button>
            <a className="button button-ghost" href="#tour">Даты тура</a>
          </div>
        </div>
      </div>
      <div className="hero-bottom page-width">
        <a href="#album" className="hero-scroll"><span className="scroll-symbol" aria-hidden="true">↓</span>Листайте вниз</a>
        <span className="hero-note">Концертное изображение — иллюстрация</span>
      </div>
    </section>

    <div className="ticker" aria-hidden="true"><div className="ticker-track">
      {[0, 1].map((copy) => <span key={copy}>Альбом «Гроза» <i>✦</i> Тур по Центральной Азии <i>✦</i> Живой звук <i>✦</i> Бишкек — Алматы — Ташкент — Астана — Ош <i>✦</i> </span>)}
    </div></div>

    <section className="album-section page-width" id="album" aria-labelledby="album-title">
      <div className="album-art" data-reveal aria-hidden="true">
        <div className="vinyl"><span>TB</span></div>
        <div className="sleeve"><strong>Гроза</strong><small>Thunder bend · 2026</small><svg viewBox="0 0 120 60"><path d="M62 2 44 30h16L50 58 80 24H63z" /></svg></div>
      </div>
      <div className="album-copy" data-reveal>
        <p className="section-label">Альбом 2026 года</p>
        <h2 id="album-title">Гроза</h2>
        <p className="album-lead">Восемь песен, записанных вживую за три ночи. Без лишних дублей, как на концерте.</p>
        <ol className="tracklist">{tracks.map(([title, length], index) => <li key={title}><span className="track-no">{String(index + 1).padStart(2, '0')}</span><span>{title}</span><span className="track-len">{length}</span></li>)}</ol>
      </div>
    </section>

    <section className="lineup-section page-width" id="lineup" aria-labelledby="lineup-title">
      <div className="section-head" data-reveal><p className="section-label">Состав</p><h2 id="lineup-title">Четыре человека,<br />один звук</h2></div>
      <ul className="lineup">{lineup.map((member, index) => <li key={member.name} data-reveal style={{ '--d': index } as React.CSSProperties}>
        <span className="member-icon"><InstrumentIcon name={member.icon} /></span>
        <span className="member-initial" aria-hidden="true">{member.name[0]}</span>
        <h3>{member.name}</h3><p>{member.role}</p>
      </li>)}</ul>
    </section>

    <section className="tour-section page-width" id="tour" aria-labelledby="tour-title">
      <div className="section-head" data-reveal><p className="section-label">Тур «Гроза»</p><h2 id="tour-title">Где услышать вживую</h2></div>
      <ul className="tour-list">{tour.map((show) => {
        const soldOut = show.status === 'Всё продано';
        return <li key={show.city} data-reveal className={soldOut ? 'is-sold' : ''}>
          <time><b>{show.day}</b>{show.month}</time>
          <div><h3>{show.city}</h3><p>{show.venue}</p></div>
          <span className="tour-status">{show.status}</span>
        </li>;
      })}</ul>
    </section>

    <section className="about-section page-width" id="about" aria-labelledby="about-title">
      <div className="about-copy" data-reveal>
        <p className="section-label">Для музыкантов</p>
        <h2 id="about-title">Профиль<br />музыканта</h2>
        <p>Хотите играть с нами или на разогреве? Создайте аккаунт и расскажите о себе: специализация, опыт и гонорар.</p>
        <button className="text-link" type="button" disabled={busy} onClick={join}>
          {signedIn ? 'Перейти в профиль' : 'Зарегистрироваться'}<span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="profile-features" data-reveal>
        <div className="feature-row"><h3>Имя и специализация</h3><p>Укажите имя и свою специализацию.</p></div>
        <div className="feature-row"><h3>Несколько слов о себе</h3><p>Расскажите о музыкальном опыте.</p></div>
        <div className="feature-row"><h3>Гонорар</h3><p>Добавьте сумму и меняйте её в профиле.</p></div>
      </div>
    </section>
  </main>;
}
