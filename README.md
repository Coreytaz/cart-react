# React Cart — TypeScript + pnpm + Vite

React-приложение корзины с подсчётом стоимости, добавлением и удалением товаров и скидкой до 100%. Исходное поведение и оформление сохранены. Исходники, React-компоненты, тесты и конфигурация Vite переведены на TypeScript.

## Требования

- Node.js **22.23.3+** или Node.js 24+;
- **pnpm 12.14.0** (закреплён в `package.json`); используется `pnpm-workspace.yaml`.

Установка pnpm (если ещё не установлен):

```bash
corepack enable
corepack prepare pnpm@12.14.0 --activate
pnpm --version
```

Если Corepack не установлен, установите pnpm самостоятельно по [официальной инструкции](https://pnpm.io/installation). `npm` допускается использовать **только** для установки самого pnpm; зависимости проекта нужно устанавливать через pnpm.

## Первый запуск

```bash
pnpm install
pnpm dev
```

Откройте адрес, который выведет Vite (обычно `http://localhost:5173`).

**Важно — о lock-файле.** В среде подготовки этого архива DNS-доступ к `registry.npmjs.org` отсутствовал (проверено запуском Corepack). Поэтому выполнить `pnpm install`, разрешить транзитивные зависимости и корректно сгенерировать `pnpm-lock.yaml` не удалось. Lock-файл **не вложен намеренно**: вручную составленный или неполный файл не обеспечит воспроизводимость. Первая успешная команда `pnpm install` создаст полноценный `pnpm-lock.yaml`; добавьте его в Git. В дальнейшем на CI и при установках используйте `pnpm install --frozen-lockfile`.

## Команды

| Команда | Действие |
| --- | --- |
| `pnpm verify:structure` | Проверка исходников и конфигурации без установки зависимостей |
| `pnpm dev` | Development-сервер Vite |
| `pnpm typecheck` | Строгая проверка типов TypeScript |
| `pnpm lint` | ESLint с правилами TypeScript и React Hooks |
| `pnpm test` | Интеграционные тесты React/Vitest |
| `pnpm test:unit` | Автономные TypeScript unit-тесты Node.js |
| `pnpm format:check` | Проверка форматирования |
| `pnpm build` | `tsc --noEmit` и production-сборка Vite |
| `pnpm preview` | Локальная проверка `dist/` |
| `pnpm deploy` | Сборка и публикация GitHub Pages |

## Структура

```text
src/
  main.tsx                         React entry point
  App.tsx                          Композиция корзины и состояния
  App.test.tsx                     UI-тесты
  features/cart/
    model/cart.ts                  Типы и чистые функции для корзины
    components/*.tsx               Форма, скидка, список и итог
  test/setup.ts                    Настройка jest-dom/Vitest
tests/cart.unit.mts                 Unit-тесты для Node.js
pnpm-workspace.yaml                 Настройки pnpm 12
scripts/verify-structure.mjs       Проверка структуры без зависимостей
tsconfig.json                       Строгая конфигурация TypeScript
vite.config.ts                     Конфигурация Vite и Vitest
eslint.config.js                   ESLint с поддержкой TypeScript
```

Цены хранятся в копейках целым числом. Корзина хранится в состоянии React и очищается после перезагрузки, как в оригинале. Серверное API, роутинг и внешнее хранилище состояния не используются.

## GitHub Pages

```bash
pnpm deploy
```

Публикация собирает приложение с `--base /cart-react/` и отправляет `dist/` через `gh-pages`. Если название репозитория изменилось, скорректируйте параметр `--base` в `package.json`.

## Результаты и ограничения проверки

- `node --experimental-strip-types --test tests/cart.unit.mts`: **8/8 тестов пройдено**.
- Статическая проверка TypeScript-синтаксиса, расширений файлов и локальных импортов выполнена отдельно.
- Из-за отсутствия доступа к npm-реестру **не подтверждены** `pnpm install`, `pnpm typecheck`, `pnpm lint`, `pnpm test` и `pnpm build`. Для них нужна успешная установка зависимостей.

Подробнее — в `MIGRATION_REPORT.md`.

## Контроль версии архива

Это **исправленная сборка v2** после повторной проверки. В версии v2 устранено возможное нарушение строгой типизации при отображении скидки, а итоговая сумма со скидкой рассчитывается из округлённых цен строк корзины. Добавлена явная конфигурация `pnpm-workspace.yaml` и проверка `verify:structure`. В архиве также есть `SHA256SUMS.txt` со списком контрольных сумм файлов.
