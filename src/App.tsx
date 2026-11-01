import { useEffect, useState } from 'react';
import { ApiError, getProfile, logout, updateProfile } from './api';
import type { ProfileInput, User } from './types';
import AuthDialog from './components/AuthDialog';
import type { AuthMode } from './components/AuthDialog';
import HomePage from './components/HomePage';
import LoadingBar from './components/LoadingBar';
import ProfilePage from './components/ProfilePage';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [busy, setBusy] = useState('Проверяем вход…');
  const [notice, setNotice] = useState('');
  const [check, setCheck] = useState(0);

  useEffect(() => {
    let active = true;
    setBusy('Проверяем вход…'); setNotice('');
    getProfile().then((profile) => { if (active) setUser(profile); })
      .catch((cause) => {
        if (!active) return;
        if (cause instanceof ApiError && (cause.status === 401 || cause.status === 403)) setUser(null);
        else setNotice('Не удалось проверить вход: сервер недоступен. Можно повторить проверку или войти заново.');
      }).finally(() => { if (active) setBusy(''); });
    return () => { active = false; };
  }, [check]);

  function openHome() { setShowProfile(false); window.scrollTo({ top: 0 }); }
  function openProfile() { setShowProfile(true); window.scrollTo({ top: 0 }); }
  function onLogin(profile: User) { setUser(profile); setAuthMode(null); setNotice(''); openProfile(); }
  function onExpired() {
    setUser(null); setShowProfile(false); setAuthMode('login');
    setNotice('Сессия истекла. Войдите снова.');
  }
  async function saveProfile(values: ProfileInput) {
    setBusy('Сохраняем профиль…');
    try { setUser(await updateProfile(values)); }
    finally { setBusy(''); }
  }
  async function handleLogout() {
    setBusy('Выходим из аккаунта…'); setNotice('');
    try { await logout(); setUser(null); setShowProfile(false); }
    catch (cause) {
      if (cause instanceof ApiError && (cause.status === 401 || cause.status === 403)) { setUser(null); setShowProfile(false); }
      else setNotice('Не удалось выйти из аккаунта. Проверьте подключение и повторите выход.');
    } finally { setBusy(''); }
  }

  return <>
    <a className="skip-link" href="#main-content">К содержимому</a>
    <header className="site-header">
      <div className="header-inner page-width">
        <button className="brand" type="button" onClick={openHome} aria-label="Thunder bend — главная">
          <span className="brand-symbol" aria-hidden="true">ϟ</span><span>THUNDER<span className="brand-second">BEND</span></span>
        </button>
        <nav className="main-nav" aria-label="Главное меню">
          <button className={!showProfile ? 'active' : ''} type="button" onClick={openHome}>Главная</button>
          {!showProfile && <a href="#about">О группе</a>}
          {!showProfile && <a href="#community">Сообщество</a>}
        </nav>
        <div className="account-actions">
          {user ? <><button className="account-button" type="button" disabled={Boolean(busy)} onClick={openProfile}>
            <span className="avatar-small" aria-hidden="true">{(user.profile.first_name || user.username).slice(0, 1).toUpperCase()}</span>
            <span className="account-name">Мой профиль</span>
          </button><button className="text-button logout-button" type="button" disabled={Boolean(busy)} onClick={() => void handleLogout()}>Выйти</button></>
            : <><button className="text-button login-link" type="button" disabled={Boolean(busy)} onClick={() => setAuthMode('login')}>Войти</button>
              <button className="button button-small button-outline" type="button" disabled={Boolean(busy)} onClick={() => setAuthMode('register')}>Регистрация <span aria-hidden="true">↗</span></button></>}
        </div>
      </div>
    </header>
    <LoadingBar message={busy} />
    {notice && <div className="site-notice page-width" role="alert"><span>{notice}</span>
      <button className="text-button" type="button" disabled={Boolean(busy)} onClick={() => setCheck((value) => value + 1)}>Проверить вход</button>
      <button className="notice-close" type="button" aria-label="Закрыть уведомление" onClick={() => setNotice('')}>×</button>
    </div>}
    <div id="main-content" tabIndex={-1}>
      {showProfile && user ? <ProfilePage key={user.id} user={user} onSave={saveProfile} onExpired={onExpired} onHome={openHome} />
        : <HomePage signedIn={Boolean(user)} busy={Boolean(busy)} onJoin={() => setAuthMode('register')} onProfile={openProfile} />}
    </div>
    <footer className="site-footer page-width"><span className="footer-name">THUNDER BEND<span className="accent">.</span></span>
      <span>Учебный сайт · ДЗ8</span><span>СОЗДАЁМ СВОЙ ЗВУК / 2026</span>
    </footer>
    {authMode && <AuthDialog mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} onLogin={onLogin} />}
  </>;
}
