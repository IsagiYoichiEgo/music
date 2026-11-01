import type { Credentials, ProfileInput, Specialization, User } from './types.ts';

const API_URL = 'https://inai-col2.fishrungames.com/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function serverMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return 'Сервер не смог выполнить запрос. Повторите попытку.';
  const labels: Record<string, string> = {
    username: 'Логин', password: 'Пароль', first_name: 'Имя',
    specialization: 'Специализация', bio: 'О себе', fee: 'Гонорар',
  };
  const messages = Object.entries(data).flatMap(([key, value]) => {
    const message = Array.isArray(value) ? value.filter((item) => typeof item === 'string').join(' ') : value;
    if (typeof message !== 'string') return [];
    return [labels[key] ? labels[key] + ': ' + message : message];
  });
  return messages.join(' ') || 'Сервер не смог выполнить запрос. Повторите попытку.';
}

async function request(path: string, options: RequestInit = {}): Promise<unknown> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set('Content-Type', 'application/json');
  let response: Response;
  try {
    response = await fetch(API_URL + path, {
      ...options, headers, credentials: 'include', signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new ApiError('Не удалось подключиться к серверу. Проверьте интернет и повторите попытку.', 0);
  }
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(serverMessage(data), response.status);
  return data;
}

function readUser(data: unknown): User {
  if (!data || typeof data !== 'object') throw new ApiError('Неверный формат профиля от сервера.', 502);
  const user = data as User;
  const profile = user.profile;
  if (!Number.isSafeInteger(user.id) || typeof user.username !== 'string' || !profile
    || typeof profile.first_name !== 'string' || typeof profile.specialization !== 'string'
    || typeof profile.specialization_display !== 'string' || typeof profile.bio !== 'string'
    || typeof profile.fee !== 'string') {
    throw new ApiError('Неверный формат профиля от сервера.', 502);
  }
  return user;
}

export async function login(input: Credentials): Promise<User> {
  return readUser(await request('/login/', { method: 'POST', body: JSON.stringify(input) }));
}
export async function register(input: Credentials): Promise<User> {
  return readUser(await request('/register/', { method: 'POST', body: JSON.stringify(input) }));
}
export async function getProfile(): Promise<User> {
  return readUser(await request('/profile/'));
}
export async function updateProfile(input: ProfileInput): Promise<User> {
  return readUser(await request('/profile/', { method: 'PATCH', body: JSON.stringify(input) }));
}
export async function logout(): Promise<void> {
  await request('/logout/', { method: 'POST' });
}
export async function getSpecializations(): Promise<Specialization[]> {
  const data = await request('/specializations/');
  if (!Array.isArray(data) || !data.every((item) => item && typeof item.value === 'string' && typeof item.label === 'string')) {
    throw new ApiError('Неверный формат списка специализаций.', 502);
  }
  return data as Specialization[];
}
