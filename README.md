# Todo App — Frontend (Nuxt)

Giao diện web cho Todo App. Spec: `FRONTEND_SPEC.md`, hợp đồng API: `../project-spec.md`.

## Yêu cầu

- Node.js 20+
- Backend NestJS chạy tại `API_BASE_URL` (mặc định `http://localhost:3001`)

## Cài đặt

```bash
cp .env.example .env
npm install
```

Biến môi trường công khai:

- `PORT`: cổng dev frontend, mặc định `3000`
- `API_BASE_URL`: base URL REST API, mặc định `http://localhost:3001`

Không lưu JWT secret hay credential backend ở frontend.

## Scripts

| Script | Mục đích |
| --- | --- |
| `npm run dev` | Development server (`http://localhost:3000`) |
| `npm run build` | Build production |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Kiểm tra TypeScript |
| `npm run test` | Unit test |
| `npm run test:e2e` | E2E (cần frontend + backend đang chạy) |

## Luồng chính

- `/login`, `/register` — khách
- `/dashboard` — CRUD todo, filter, search, sort, phân trang
- `/profile` — username và role từ `/auth/me`
- `/users`, `/users/:id` — chỉ admin

Logout là thao tác client-side, không gọi API.
