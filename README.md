# Mini CRM (gpt5-docker)

社内ミニCRM（営業リード・案件・活動管理）。Next.js(App Router) + Hono + Prisma + MySQL。

## クイックスタート

前提: Docker / Docker Compose がインストール済み。

1) 環境変数の確認（任意）

```
cp .env.example .env
```

2) 起動

```
docker compose up --build -d
```

初回は `api` サービス起動時に `prisma generate` → `migrate deploy` → `seed` が実行されます。

3) アクセス

- Web: http://localhost:3000
- API: http://localhost:8787

ログイン例:
- Email: `admin@example.com`
- Password: `password123`

## テスト

API (Vitest + supertest) と E2E (Playwright) を用意予定。実行方法は後述の「テスト」章に追記します。

## ディレクトリ

```
gpt5-docker/
  apps/
    api/  # Hono + Prisma
    web/  # Next.js (App Router)
  docker-compose.yml
```

詳細は各 `apps/*/README`（後日追加）をご覧ください。
