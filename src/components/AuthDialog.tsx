import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError, getProfile, login, register } from '../api';
import type { User } from '../types';

export type AuthMode = 'login' | 'register';
interface Props {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export default function AuthDialog({ mode, onModeChange, onClose, onLogin }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const isRegister = mode === 'register';

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  function switchMode() {
    setError(''); setNotice(''); setPassword(''); setConfirmation('');
    onModeChange(isRegister ? 'login' : 'register');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(''); setNotice('');
    if (!username.trim() || !password) { setError('Введите логин и пароль.'); return; }
    if (isRegister && (!/^[\p{L}\p{N}_.@+-]+$/u.test(username.trim()) || username.trim().length > 150)) {
      setError('Логин: до 150 символов, буквы, цифры и знаки @ . + - _.'); return;
    }
    if (isRegister && password.length < 6) { setError('Пароль должен содержать не менее 6 символов.'); return; }
    if (isRegister && password !== confirmation) { setError('Пароли не совпадают.'); return; }
    setPending(true);
    try {
      const input = { username: username.trim(), password };
      if (isRegister) {
        await register(input);
        setPassword(''); setConfirmation('');
        onModeChange('login');
        setNotice('Аккаунт создан. Теперь войдите.');
      } else {
        await login(input);
        // Проверяем, что браузер сохранил cookie сессии.
        try { onLogin(await getProfile()); }
        catch (cause) {
          if (cause instanceof ApiError && (cause.status === 401 || cause.status === 403)) {
            throw new Error('Сессия не сохранилась. Разрешите сторонние cookie для inai-col2.fishrungames.com и повторите вход.');
          }
          throw cause;
        }
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не удалось выполнить запрос.');
    } finally {
      setPending(false);
    }
  }

  return <dialog ref={dialog} className="auth-dialog" aria-labelledby="auth-title"
    onCancel={(event) => { event.preventDefault(); if (!pending) onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget && !pending) onClose(); }}>
    <button className="dialog-close" type="button" aria-label="Закрыть" disabled={pending} onClick={onClose}>×</button>
    <h2 id="auth-title">{isRegister ? 'Регистрация' : 'Вход'}</h2>
    <form onSubmit={handleSubmit} noValidate>
      <fieldset disabled={pending}>
        <label htmlFor="auth-username">Логин</label>
        <input id="auth-username" name="username" autoComplete="username" autoFocus required maxLength={150}
          value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Введите логин" />
        <label htmlFor="auth-password">Пароль</label>
        <div className="password-field">
          <input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} required
            autoComplete={isRegister ? 'new-password' : 'current-password'} value={password}
            onChange={(event) => setPassword(event.target.value)} placeholder={isRegister ? 'Не менее 6 символов' : 'Введите пароль'} />
          <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}>{showPassword ? 'Скрыть' : 'Показать'}</button>
        </div>
        {isRegister && <><label htmlFor="auth-confirmation">Повтор пароля</label>
          <input id="auth-confirmation" name="confirmation" type="password" autoComplete="new-password" required
            value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Повторите пароль" />
        </>}
        <button className="button button-accent full-width" type="submit">
          {pending && <span className="spinner" aria-hidden="true" />}
          {pending ? (isRegister ? 'Создаём аккаунт…' : 'Входим…') : (isRegister ? 'Создать аккаунт' : 'Войти')}
        </button>
      </fieldset>
      {pending && <p className="form-status" role="status">Подождите, идёт загрузка…</p>}
      {error && <p className="message error" role="alert">{error}</p>}
      {notice && <p className="message success" role="status">{notice}</p>}
    </form>
    <p className="auth-switch">{isRegister ? 'Есть аккаунт?' : 'Нет аккаунта?'}{' '}
      <button type="button" disabled={pending} onClick={switchMode}>{isRegister ? 'Войти' : 'Зарегистрироваться'}</button>
    </p>
  </dialog>;
}
