# Thunder bend

Домашнее задание 8. Сайт группы на React и TypeScript.

Работают регистрация, вход, выход, просмотр и редактирование профиля. При запросах отображается загрузка.

## Запуск

Нужен Node.js 24.

```sh
npm ci
npm run dev
```

Откройте адрес из терминала.

## Проверка и сборка

```sh
npm test
npm run build
```

Сначала проверяются типы TypeScript, затем Vite собирает сайт в dist. Babel не используется.

## Код

- src/App.tsx — пользователь, проверка входа и выход.
- src/components/HomePage.tsx — главная страница.
- src/components/AuthDialog.tsx — регистрация и вход.
- src/components/ProfilePage.tsx — данные профиля и форма редактирования.
- src/components/LoadingBar.tsx — загрузка.
- src/api.ts — запросы к серверу.
- src/types.ts — типы данных.
- src/style.css — стили.

## Бэкенд

[Swagger](https://inai-col2.fishrungames.com/api/docs/).

Используются POST register, POST login, POST logout, GET/PATCH profile и GET specializations. В запросах указан credentials: 'include', чтобы браузер отправлял cookie сессии. Пароли в браузере не сохраняются.

## GitHub Pages

1. В [Settings → Pages](https://github.com/IsagiYoichiEgo/music/settings/pages) выбрать Source: GitHub Actions.
2. Открыть [Deploy to GitHub Pages](https://github.com/IsagiYoichiEgo/music/actions/workflows/deploy.yml).
3. Нажать Run workflow, выбрать main и нажать зелёную Run workflow.
4. Дождаться зелёных build и deploy.
5. Открыть https://isagiyoichiego.github.io/music/.

При push выполняются тесты и сборка. Публикация запускается вручную. Для обновления сайта нужно снова нажать Run workflow. Публикуется готовая папка dist, ветка gh-pages не используется.

Концертное изображение — иллюстрация. Описание источника: docs/visual-assets.md.
