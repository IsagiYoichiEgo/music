// The study server is sometimes offline. When it is, the site switches to a demo
// backend stored in this browser, so every page keeps working.
import * as api from './api';
import { ApiError } from './api';
import type { Credentials, ProfileInput, Specialization, User } from './types';

export { ApiError };

const SPECIALIZATIONS: Specialization[] = [
  { value: 'vocals', label: 'Вокал' }, { value: 'guitar', label: 'Гитара' },
  { value: 'bass', label: 'Бас-гитара' }, { value: 'drums', label: 'Ударные' },
  { value: 'keys', label: 'Клавишные' }, { value: 'producer', label: 'Саунд-продюсер' },
];
export const DEMO_LOGIN = { username: 'demo', password: 'demo123' };

interface Store { nextId: number; session: string | null; users: Record<string, { password: string; user: User }> }
const KEY = 'thunder-bend-demo';

function seed(): Store {
  return { nextId: 2, session: null, users: { demo: { password: DEMO_LOGIN.password, user: {
    id: 1, username: 'demo',
    profile: { first_name: 'Алия', specialization: 'guitar', specialization_display: 'Гитара',
      bio: 'Играю на гитаре восемь лет. Люблю тяжёлый рифф и тихие баллады.', fee: '12000.00' },
  } } } };
}
function read(): Store {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw) as Store; } catch { /* storage unavailable */ }
  return seed();
}
function write(store: Store) { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* storage unavailable */ } }
const pause = () => new Promise((resolve) => setTimeout(resolve, 350));

let demo = false;
const listeners = new Set<(value: boolean) => void>();
export const isDemo = () => demo;
export function onDemoChange(listener: (value: boolean) => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function enterDemo() { if (!demo) { demo = true; listeners.forEach((listener) => listener(true)); } }
const isOutage = (cause: unknown) => cause instanceof ApiError && (cause.status === 0 || cause.status >= 500);

async function run<T>(real: () => Promise<T>, fake: () => Promise<T>): Promise<T> {
  if (demo) return fake();
  try { return await real(); }
  catch (cause) { if (!isOutage(cause)) throw cause; enterDemo(); return fake(); }
}

const fake = {
  async login({ username, password }: Credentials) {
    await pause(); const store = read(); const entry = store.users[username.toLowerCase()];
    if (!entry || entry.password !== password) throw new ApiError('Неверный логин или пароль.', 400);
    store.session = entry.user.username; write(store); return entry.user;
  },
  async register({ username, password }: Credentials) {
    await pause(); const store = read(); const key = username.toLowerCase();
    if (store.users[key]) throw new ApiError('Логин: пользователь с таким логином уже существует.', 400);
    const user: User = { id: store.nextId++, username, profile: { first_name: '', specialization: 'vocals', specialization_display: 'Вокал', bio: '', fee: '0.00' } };
    store.users[key] = { password, user }; write(store); return user;
  },
  async getProfile() {
    await pause(); const store = read();
    const entry = store.session ? store.users[store.session.toLowerCase()] : undefined;
    if (!entry) throw new ApiError('Войдите в аккаунт.', 401);
    return entry.user;
  },
  async updateProfile(input: ProfileInput) {
    await pause(); const store = read();
    const entry = store.session ? store.users[store.session.toLowerCase()] : undefined;
    if (!entry) throw new ApiError('Сессия истекла.', 401);
    const label = SPECIALIZATIONS.find((item) => item.value === input.specialization)?.label ?? input.specialization;
    entry.user = { ...entry.user, profile: { ...input, specialization_display: label } };
    write(store); return entry.user;
  },
  async logout() { await pause(); const store = read(); store.session = null; write(store); },
  async getSpecializations() { return SPECIALIZATIONS; },
};

export const login = (input: Credentials) => run(() => api.login(input), () => fake.login(input));
export const register = (input: Credentials) => run(() => api.register(input), () => fake.register(input));
export const getProfile = () => run(api.getProfile, fake.getProfile);
export const updateProfile = (input: ProfileInput) => run(() => api.updateProfile(input), () => fake.updateProfile(input));
export const logout = () => run(api.logout, fake.logout);
export const getSpecializations = () => run(api.getSpecializations, fake.getSpecializations);
