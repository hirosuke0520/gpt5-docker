# Mini CRM (gpt5-docker)

社内ミニCRM（営業リード・案件・活動管理）。
- フロント: Next.js(App Router, TypeScript, Tailwind)
- API: Hono.js (TypeScript)
- DB/ORM: MySQL 8 + Prisma
- 認証: email/password (bcrypt) + JWT(HttpOnly Cookie, SameSite=Lax)

## クイックスタート

前提: Docker / Docker Compose がインストール済み。

1) 環境変数の確認（任意）

```
cp .env.example .env
```

2) 起動（初回はDBスキーマ作成とシード投入まで自動）

```
docker compose up --build -d
```

初回は `api` サービス起動時に `prisma generate` → `migrate deploy`（マイグレーションが無い場合は `db push`）→ `seed` を実行します。

3) アクセス

- Web: http://localhost:3000
- API: http://localhost:8787

ログイン例（seedで投入済み）:
- Email: `admin@example.com`
- Password: `password123`

ログアウトはヘッダー右上の「Logout」から実行できます。

## テスト

API (Vitest + supertest) と E2E (Playwright) を同梱。

### API テスト

```
docker compose up -d db
cd apps/api
npm install
npx prisma generate
npx prisma migrate deploy || npx prisma db push
npm run prisma:seed
npm test
```

### E2E テスト（Web + API を起動してから）

```
docker compose up -d --build
cd apps/web
npm install
npx playwright install --with-deps
npm test
```

### スクリーンショットの取得

```
cd apps/web
npx playwright test screenshots.spec.ts
# 出力: docs/screenshots/*.png
```

## ディレクトリ

```
gpt5-docker/
  apps/
    api/  # Hono + Prisma + Vitest(supertest) + seed
    web/  # Next.js (App Router) + Tailwind + Playwright
  docker-compose.yml
```

詳細は各 `apps/*/README`（後日追加）をご覧ください。
