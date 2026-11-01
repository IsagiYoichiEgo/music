import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError, getSpecializations } from '../api';
import type { ProfileInput, Specialization, User } from '../types';

interface Props {
  user: User;
  onSave: (values: ProfileInput) => Promise<void>;
  onExpired: () => void;
  onHome: () => void;
}

export default function ProfilePage({ user, onSave, onExpired, onHome }: Props) {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.profile.first_name);
  const [specialization, setSpecialization] = useState(user.profile.specialization);
  const [bio, setBio] = useState(user.profile.bio);
  const [fee, setFee] = useState(user.profile.fee);
  const [options, setOptions] = useState<Specialization[]>([]);
  const [optionsError, setOptionsError] = useState('');
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    setOptionsLoading(true); setOptionsError('');
    getSpecializations().then((values) => { if (active) setOptions(values); })
      .catch(() => { if (active) setOptionsError('Не удалось загрузить специализации.'); })
      .finally(() => { if (active) setOptionsLoading(false); });
    return () => { active = false; };
  }, [retry]);

  function startEditing() {
    setFirstName(user.profile.first_name); setSpecialization(user.profile.specialization);
    setBio(user.profile.bio); setFee(user.profile.fee);
    setError(''); setSaved(false); setEditing(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(''); setSaved(false);
    if (!/^\d{1,8}(\.\d{1,2})?$/.test(fee)) {
      setError('Гонорар: от 0 до 99 999 999,99 сом, не более двух знаков после точки.'); return;
    }
    if (firstName.trim().length > 100) { setError('Имя должно быть не длиннее 100 символов.'); return; }
    setPending(true);
    try {
      await onSave({ first_name: firstName.trim(), specialization, bio: bio.trim(), fee: Number(fee).toFixed(2) });
      setEditing(false); setSaved(true);
    } catch (cause) {
      if (cause instanceof ApiError && (cause.status === 401 || cause.status === 403)) onExpired();
      else setError(cause instanceof Error ? cause.message : 'Не удалось сохранить профиль.');
    } finally { setPending(false); }
  }

  const profile = user.profile;
  return <main className="profile-page page-width">
    <button className="text-button back-link" type="button" onClick={onHome}>← На главную</button>
    <h1>Профиль</h1>
    <p className="username">Логин: {user.username}</p>
      <section className="profile-card" aria-labelledby="profile-info-title">
        <div className="card-heading"><h2 id="profile-info-title">{editing ? 'Редактирование профиля' : 'Данные профиля'}</h2>
          {!editing && <button className="button button-outline" type="button" onClick={startEditing}>Редактировать</button>}
        </div>
        {editing ? <form onSubmit={handleSubmit} noValidate>
          <fieldset disabled={pending}>
            <label htmlFor="profile-name">Имя</label>
            <input id="profile-name" name="first_name" maxLength={100} autoComplete="given-name"
              value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Введите имя" />
            <label htmlFor="profile-specialization">Специализация</label>
            <select id="profile-specialization" value={specialization} disabled={optionsLoading || Boolean(optionsError)}
              onChange={(event) => setSpecialization(event.target.value)}>
              {options.length === 0 && <option value={specialization}>{profile.specialization_display}</option>}
              {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {optionsLoading && <p className="form-status" role="status">Загружаем специализации…</p>}
            {optionsError && <div className="message error" role="alert">{optionsError}{' '}
              <button className="text-button" type="button" onClick={() => setRetry((value) => value + 1)}>Повторить</button>
            </div>}
            <label htmlFor="profile-bio">О себе</label>
            <textarea id="profile-bio" rows={5} value={bio} onChange={(event) => setBio(event.target.value)}
              placeholder="Опыт и другая информация" />
            <label htmlFor="profile-fee">Гонорар, сом</label>
            <input id="profile-fee" type="number" inputMode="decimal" min="0" max="99999999.99" step="0.01"
              value={fee} onChange={(event) => setFee(event.target.value)} />
            <div className="form-actions">
              <button className="button button-accent" type="submit" disabled={optionsLoading || Boolean(optionsError)}>
                {pending ? 'Сохраняем…' : 'Сохранить изменения'}
              </button>
              <button className="text-button" type="button" onClick={() => { setEditing(false); setError(''); }}>Отмена</button>
            </div>
          </fieldset>
        </form> : <dl className="profile-details">
          <div><dt>Имя</dt><dd>{profile.first_name || 'Не указано'}</dd></div>
          <div><dt>Специализация</dt><dd>{profile.specialization_display}</dd></div>
          <div><dt>О себе</dt><dd className="bio-text">{profile.bio || 'Не указано'}</dd></div>
          <div><dt>Гонорар</dt><dd className="fee-value">{Number(profile.fee).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} <span>сом</span></dd></div>
        </dl>}
        {error && <p className="message error" role="alert">{error}</p>}
        {saved && <p className="message success" role="status">Профиль сохранён.</p>}
      </section>
  </main>;
}
