import test from 'node:test';
import assert from 'node:assert/strict';
import { login, register, logout, getProfile, updateProfile, getSpecializations, ApiError } from '../src/api.ts';

const user = { id: 42, username: 'thunder_fan', profile: { first_name: 'Мира', specialization: 'guitar', specialization_display: 'Гитара', bio: 'Играю на гитаре', fee: '1500.00' } };

test('login sends credentials to the documented endpoint and enables session cookies', async (t) => {
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    assert.equal(String(input), 'https://inai-col2.fishrungames.com/api/login/');
    assert.equal(init?.method, 'POST');
    assert.equal(init.credentials, 'include');
    assert.equal(new Headers(init.headers).get('Content-Type'), 'application/json');
    assert.deepEqual(JSON.parse(String(init.body)), { username: 'thunder_fan', password: 'test-password' });
    return Response.json(user);
  });
  assert.deepEqual(await login({ username: 'thunder_fan', password: 'test-password' }), user);
});

test('registration uses POST and returns the created user without inventing a token', async (t) => {
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    assert.equal(String(input), 'https://inai-col2.fishrungames.com/api/register/');
    assert.equal(init?.method, 'POST');
    assert.equal(init.credentials, 'include');
    assert.deepEqual(JSON.parse(String(init.body)), { username: 'new_fan', password: 'secure123' });
    return Response.json({ ...user, username: 'new_fan' }, { status: 201 });
  });
  assert.equal((await register({ username: 'new_fan', password: 'secure123' })).username, 'new_fan');
});

test('profile GET authenticates with the same browser cookie session', async (t) => {
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    assert.equal(String(input), 'https://inai-col2.fishrungames.com/api/profile/');
    assert.equal(init?.credentials, 'include');
    assert.equal(init?.body, undefined);
    return Response.json(user);
  });
  assert.equal((await getProfile()).profile.first_name, 'Мира');
});

test('profile update PATCH sends writable fields with decimal fee as a string', async (t) => {
  const input = { first_name: 'Мира', specialization: 'drums', bio: 'Барабанщица', fee: '1800.50' };
  t.mock.method(globalThis, 'fetch', async (url: string | URL | Request, init?: RequestInit) => {
    assert.equal(String(url), 'https://inai-col2.fishrungames.com/api/profile/');
    assert.equal(init?.method, 'PATCH');
    assert.equal(init.credentials, 'include');
    assert.deepEqual(JSON.parse(String(init.body)), input);
    return Response.json({ ...user, profile: { ...input, specialization_display: 'Ударные' } });
  });
  assert.equal((await updateProfile(input)).profile.fee, '1800.50');
});

test('logout calls the server so the cookie session is invalidated', async (t) => {
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    assert.equal(String(input), 'https://inai-col2.fishrungames.com/api/logout/');
    assert.equal(init?.method, 'POST');
    assert.equal(init.credentials, 'include');
    return new Response(null, { status: 204 });
  });
  await logout();
});

test('server field errors retain useful messages and authentication status', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ username: ['Это имя уже занято.'] }, { status: 400 }));
  await assert.rejects(register({ username: 'taken', password: 'secure123' }), /Логин: Это имя уже занято/);
  t.mock.restoreAll();
  t.mock.method(globalThis, 'fetch', async () => Response.json({ detail: 'Вход не выполнен.' }, { status: 403 }));
  await assert.rejects(getProfile(), (error: unknown) => error instanceof ApiError && error.status === 403);
});

test('specializations are read from the backend and malformed profiles are rejected', async (t) => {
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    assert.equal(String(input), 'https://inai-col2.fishrungames.com/api/specializations/');
    return Response.json([{ value: 'guitar', label: 'Гитара' }]);
  });
  assert.deepEqual(await getSpecializations(), [{ value: 'guitar', label: 'Гитара' }]);
  t.mock.restoreAll();
  t.mock.method(globalThis, 'fetch', async () => Response.json({ id: 42, username: 'broken' }));
  await assert.rejects(getProfile(), /формат/i);
});

test('network failures produce a readable connection error', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(getProfile(), /подключ/i);
});
