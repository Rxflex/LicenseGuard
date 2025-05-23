# Next.js License Server

## Overview | Обзор

A Next.js license server with Tailwind CSS UI, MySQL database, and administrator authentication.

Сервер лицензий на Next.js с UI на Tailwind CSS, базой данных MySQL и авторизацией для администраторов.

### Features | Возможности

- 🔐 **Authentication**: Administrators and moderators only
- 📋 **License Management**: Create, edit, block licenses
- 🔍 **License Verification API**: Check keys, IP, and validity periods
- 📊 **Logging**: Track all API requests

- 🔐 **Аутентификация**: Только для администраторов и модераторов
- 📋 **Управление лицензиями**: Создание, редактирование, блокировка
- 🔍 **API проверки лицензий**: Проверка ключей, IP и сроков действия
- 📊 **Логирование**: Отслеживание всех обращений к API

## Vercel Deployment | Развертывание на Vercel

### Environment Variables | Переменные окружения

Add the following environment variables in your Vercel settings:

Добавьте следующие переменные окружения в настройках Vercel:

```env
DATABASE_URL="mysql://username:password@host:port/database"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="secure-password"
```

### Automatic Deployment | Автоматическое развертывание

1. **Connect your repository** to Vercel
2. **Add environment variables** in project settings
3. **Create MySQL database** (Neon recommended)
4. **Vercel will automatically** install dependencies and build the project
5. **After deployment** run database migration:
   ```bash
   # Locally with correct DATABASE_URL
   npx prisma db push
   ```
6. **Open your site** - system will automatically redirect to setup page

1. **Подключите репозиторий** к Vercel
2. **Добавьте переменные окружения** в настройках проекта
3. **Создайте MySQL базу данных** (рекомендуется Neon)
4. **Vercel автоматически** установит зависимости и соберет проект
5. **После деплоя** выполните миграцию базы данных:
   ```bash
   # Локально с правильным DATABASE_URL
   npx prisma db push
   ```
6. **Откройте ваш сайт** - система автоматически перенаправит на страницу настройки

### Database Setup | Настройка базы данных

After first successful deployment:

После первого успешного деплоя:

1. **Run migration** (locally or via Vercel CLI):
   ```bash
   npx prisma db push
   ```

2. **Open your site** - setup page will be shown

3. **Click "Initialize Administrator"** - admin will be created from environment variables

1. **Выполните миграцию** (локально или через Vercel CLI):
   ```bash
   npx prisma db push
   ```

2. **Откройте ваш сайт** - будет показана страница настройки

3. **Нажмите "Initialize Administrator"** - создастся админ из переменных окружения

## Local Development | Локальная разработка

### Prerequisites | Предварительные требования

- Node.js 18+ and npm
- MySQL server

- Node.js 18+ и npm
- MySQL сервер

### Installation Steps | Шаги установки

1. **Clone repository**

```bash
git clone https://github.com/Rxflex/licenseguard.git
cd licenseguard
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
# Edit .env file
```

4. **Initialize database**

```bash
npx prisma db push
```

5. **Start development server**

```bash
npm run dev
```

1. **Клонировать репозиторий**

```bash
git clone https://github.com/Rxflex/licenseguard.git
cd licenseguard
```

2. **Установить зависимости**

```bash
npm install
```

3. **Настроить переменные окружения**

```bash
cp .env.example .env
# Отредактируйте .env файл
```

4. **Инициализировать базу данных**

```bash
npx prisma db push
```

5. **Запустить сервер разработки**

```bash
npm run dev
```

## License Verification API | API для проверки лицензий

### License Check | Проверка лицензии
```http
GET /api/check-license?key=LICENSE_KEY&
```

**Response | Ответ:**
```json
{
  "status": "valid|expired|blocked|invalid|ip_blocked",
  "message": "Status description"
}
```

### System Monitoring | Мониторинг системы
```http
GET /api/health
```

**Response | Ответ:**
```json
{
  "status": "healthy",
  "database": "connected",
  "admin": "initialized",
  "stats": {
    "users": 1,
    "licenses": 0
  }
}
```

## Environment Variables | Переменные окружения

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection URL | ✅ |
| `NEXTAUTH_URL` | Your site URL | ✅ |
| `NEXTAUTH_SECRET` | JWT secret key | ✅ |
| `ADMIN_EMAIL` | Administrator email | ✅ |
| `ADMIN_PASSWORD` | Administrator password | ✅ |

| Переменная | Описание | Обязательная |
|------------|----------|--------------|
| `DATABASE_URL` | URL подключения к MySQL | ✅ |
| `NEXTAUTH_URL` | URL вашего сайта | ✅ |
| `NEXTAUTH_SECRET` | Секретный ключ для JWT | ✅ |
| `ADMIN_EMAIL` | Email администратора | ✅ |
| `ADMIN_PASSWORD` | Пароль администратора | ✅ |

## Troubleshooting | Устранение неполадок

### Vercel Issues | Проблемы с Vercel

1. **Ensure all environment variables are set**
2. **Check build logs** in Vercel dashboard
3. **Run database migration** after first deployment
4. **Verify database accessibility** from Vercel

1. **Убедитесь, что все переменные окружения установлены**
2. **Проверьте логи сборки** в панели Vercel
3. **Выполните миграцию базы данных** после первого деплоя
4. **Проверьте доступность базы данных** из Vercel

### Database Issues | Проблемы с базой данных

1. Check `DATABASE_URL` in environment variables
2. Ensure database is accessible from internet
3. Run migration: `npx prisma db push`

1. Проверьте `DATABASE_URL` в переменных окружения
2. Убедитесь, что база данных доступна из интернета
3. Выполните миграцию: `npx prisma db push`

### Administrator Issues | Проблемы с администратором

1. Open `/setup` to check status
2. Ensure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
3. Click "Initialize Administrator" on setup page

1. Откройте `/setup` для проверки статуса
2. Убедитесь, что `ADMIN_EMAIL` и `ADMIN_PASSWORD` установлены
3. Нажмите "Initialize Administrator" на странице настройки

## Architecture | Архитектура

- **Frontend**: Next.js 15 + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes + NextAuth.js
- **Database**: MySQL + Prisma ORM
- **Deployment**: Vercel

## Security | Безопасность

- Passwords hashed with bcrypt
- JWT tokens for sessions
- API-level access control
- Operation logging

- Пароли хешируются с помощью bcrypt
- JWT токены для сессий
- Проверка прав доступа на уровне API
- Логирование всех операций
