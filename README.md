# Thunder bend — ДЗ8

Сайт музыкальной группы на React и TypeScript. Репозиторий: https://github.com/IsagiYoichiEgo/music

Адрес после публикации: https://isagiyoichiego.github.io/music/

## Что работает

- Главная страница группы, адаптивная версия для телефона.
- Регистрация: логин, пароль, повтор пароля; проверка полей и ошибки сервера.
- Вход и выход через настоящий учебный API.
- Просмотр и редактирование профиля: имя, специализация, о себе, гонорар в сомах.
- Сохранение входа после перезагрузки страницы.
- Плашки загрузки при проверке входа, сохранении профиля и выходе; загрузка в формах и блокировка повторной отправки.
- Сообщения об ошибках и повторные попытки; поля сохраняются при неудачном сохранении.

## API и сессия

Swagger: https://inai-col2.fishrungames.com/api/docs/

- POST /api/register/ — { username, password }.
- POST /api/login/ — { username, password }.
- POST /api/logout/.
- GET /api/profile/.
- PATCH /api/profile/ — { first_name, specialization, bio, fee }.
- GET /api/specializations/ — список значений для выбора.

Ответ профиля: { id, username, profile: { first_name, specialization, specialization_display, bio, fee } }. fee передаётся строкой с двумя десятичными знаками.

Все запросы используют credentials: 'include'. Сервер выдаёт HttpOnly-cookie sessionid с SameSite=None; Secure. Пароли и токены в localStorage/sessionStorage не сохраняются. Для восстановления входа при открытии сайта выполняется GET профиля. После login дополнительно выполняется GET профиля, чтобы проверить сохранение cookie браузером. Регистрация переводит пользователя на форму входа.

Если браузер блокирует сторонние cookie, он может не сохранить сессию этого API. В таком случае форма входа покажет понятное сообщение; нужно разрешить cookie для inai-col2.fishrungames.com. Нормальный вход проверен в Chrome с настройками по умолчанию.

## Локальный запуск

Нужен Node.js 24.

```sh
npm ci
npm run dev
```

Открыть адрес Vite из терминала. Не открывать index.html двойным щелчком.

```sh
npm test
npm run build
npm run preview
```

build сначала проверяет TypeScript через tsc --noEmit, затем Vite собирает готовый сайт в dist. Babel и React/Babel-плагин не используются: TS/TSX обрабатывает встроенный Oxc в Vite. Настройка base: './' подходит для размещения внутри /music/.

## Публикация на GitHub Pages — по шагам

Публикацию запускает пользователь самостоятельно.

1. Открыть https://github.com/IsagiYoichiEgo/music/settings/pages.
2. В Build and deployment → Source выбрать GitHub Actions.
3. Перейти в https://github.com/IsagiYoichiEgo/music/actions/workflows/deploy.yml.
4. Справа над списком запусков нажать Run workflow.
5. Выбрать Branch: main и нажать зелёную Run workflow.
6. Открыть новый запуск с событием workflow_dispatch и дождаться зелёных build и deploy.
7. Открыть https://isagiyoichiego.github.io/music/ и проверить регистрацию, вход, изменение профиля и выход. При необходимости обновить Ctrl+F5.

Workflow уже добавлен. Дополнительные шаблоны создавать не нужно. Каждый push в main автоматически проверяет тесты, собирает сайт и сохраняет dist как artifact. На автоматическом push шаг deploy — Skipped: публикация выполняется только вручную из main. Для последующих обновлений сайта снова запустить Run workflow.

Готовый сайт публикуется из dist через actions/upload-pages-artifact и actions/deploy-pages. Ветка gh-pages не используется. Публикация сырого корня main через Deploy from a branch не подходит: браузер получит исходный main.tsx вместо собранного JavaScript.

## Файлы

- src/App.tsx — пользователь, проверка сессии, переключение главной и профиля, выход.
- src/components/HomePage.tsx — главная страница Thunder bend.
- src/components/AuthDialog.tsx — регистрация, вход и валидация.
- src/components/ProfilePage.tsx — просмотр, редактирование и сохранение профиля.
- src/components/LoadingBar.tsx — плашка загрузки.
- src/api.ts — запросы, cookie-сессия и ошибки сервера.
- src/types.ts — типы данных API.
- src/style.css — оформление и адаптивная версия.
- tests/api.test.ts — тесты HTTP-контракта.
- .github/workflows/deploy.yml — сборка main и ручной деплой dist.

## Коротко для защиты

«Я сделал сайт группы Thunder bend на React и TypeScript. Данные пользователя описаны интерфейсами. Состояние храню в useState, при открытии страницы useEffect запрашивает профиль и проверяет сессию. Формы регистрации и входа отправляют JSON через fetch. Cookie сессии браузер отправляет благодаря credentials: include. Для профиля использую GET и PATCH. При выходе вызываю POST logout на сервере. Во время запросов показываю загрузку и отключаю кнопки. GitHub Actions устанавливает зависимости, запускает тесты, проверяет типы TypeScript, собирает dist и при ручном запуске публикует его на Pages».

Демонстрационные тексты и концертное изображение служат оформлением учебного сайта. Даты концертов, записи и реальные сведения об участниках не заявлены. Изображение создано встроенным imagegen, сохранено в public/images/concert.webp; исходный prompt записан в docs/visual-assets.md.
