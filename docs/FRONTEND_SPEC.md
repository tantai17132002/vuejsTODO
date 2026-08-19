# Frontend Specification — Todo App

> Phiên bản: 1.0  
> Phạm vi: thư mục `vuejsToDo/`  
> Spec chung tham chiếu: `../project-spec.md`  
> Trạng thái: đặc tả đích, được xây dựng từ yêu cầu chung và code hiện tại.

## 1. Mục đích và nguyên tắc

Frontend cung cấp giao diện web cho các luồng đăng ký, đăng nhập, quản lý todo, hồ sơ và quản trị người dùng. Tài liệu này chi tiết hóa cách ứng dụng Nuxt triển khai hợp đồng chung trong `project-spec.md`.

Thứ tự ưu tiên khi có mâu thuẫn:

1. Hợp đồng frontend–backend trong `project-spec.md`.
2. Yêu cầu frontend trong tài liệu này.
3. Code hiện tại.

Frontend không tự suy diễn response hoặc gọi endpoint ngoài contract. Thay đổi endpoint, tên field hoặc response công khai phải được cập nhật trong spec chung và phối hợp với backend.

## 2. Phạm vi

### 2.1. Trong phạm vi MVP

- Landing page.
- Đăng ký, đăng nhập và đăng xuất client-side.
- Khôi phục phiên đăng nhập sau reload.
- Hiển thị người dùng hiện tại.
- Route protection cho guest, authenticated user và admin.
- Todo CRUD trên dashboard.
- Phân trang, lọc trạng thái, tìm kiếm, date range và sắp xếp todo.
- Danh sách, chi tiết và cập nhật role user cho admin.
- Validation form.
- Loading, empty, error, success và confirmation states.
- Responsive UI.
- Unit/component test và các luồng E2E quan trọng.

### 2.2. Ngoài phạm vi MVP

- Dark mode.
- Biểu đồ thống kê.
- Upload avatar.
- Refresh token.
- OAuth/social login.
- Quên hoặc đặt lại mật khẩu.
- Realtime/WebSocket.

Đa ngôn ngữ đã có trong code hiện tại và có thể được duy trì, nhưng không phải điều kiện chặn hoàn thành MVP.

## 3. Công nghệ

- Nuxt 4, Vue 3, TypeScript.
- Pinia.
- Axios.
- Tailwind CSS 4.
- VeeValidate và Yup.
- `@nuxtjs/i18n`.
- Nuxt route middleware.
- Cookie để lưu access token trong implementation hiện tại.

### 3.1. Scripts

| Script | Mục đích |
| --- | --- |
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run generate` | Sinh static output nếu deployment cho phép |
| `npm run preview` | Preview production build |
| `npm run postinstall` | Chuẩn bị type và generated files của Nuxt |

Ứng dụng cần bổ sung scripts rõ ràng cho `lint`, `typecheck`, `test` và `test:e2e` trước khi coi MVP hoàn thành.

## 4. Kiến trúc source

```text
vuejsToDo/
├── app/
│   └── app.vue
├── assets/
│   └── css/main.css
├── components/
│   ├── forms/
│   ├── navbar/
│   ├── todo/
│   └── ui/
├── composables/
│   ├── useApi.ts
│   └── useModalState.ts
├── i18n/
│   └── locales/
├── layouts/
│   └── default.vue
├── middleware/
│   ├── auth.ts
│   ├── guest.ts
│   └── admin.ts
├── pages/
│   ├── index.vue
│   ├── login.vue
│   ├── register.vue
│   ├── dashboard/
│   │   └── index.vue
│   ├── profile.vue
│   └── users/
│       ├── index.vue
│       └── [id].vue
├── plugins/
│   ├── axios.ts
│   ├── i18n.ts
│   ├── toast.ts
│   └── vee-validate.ts
├── stores/
│   ├── auth.ts
│   ├── todo.ts
│   └── user.ts
├── types/
│   ├── api.ts
│   ├── auth.ts
│   ├── todo.ts
│   └── user.ts
├── nuxt.config.ts
└── .env.example
```

`guest.ts`, `admin.ts`, các page profile/users, user store và thư mục types là cấu trúc đích; code hiện tại chưa có.

### 4.1. Trách nhiệm

- `pages`: route-level composition, không chứa HTTP mapping lặp lại.
- `components`: UI tái sử dụng; nhận data/emit event qua contract rõ ràng.
- `stores`: state và business flow phía client.
- `composables/useApi`: nguồn duy nhất ánh xạ endpoint và xử lý API chung.
- `plugins/axios`: base URL, Bearer token và response interceptor.
- `middleware`: quyết định điều hướng theo trạng thái auth/role.
- `types`: type dùng chung khớp `project-spec.md`.

Không gọi `$axios` rải rác trong page nếu endpoint tương ứng đã có trong API layer/store.

## 5. Routes

### 5.1. Route MVP

| Route | Middleware | Role | Chức năng |
| --- | --- | --- | --- |
| `/` | Không | Public | Landing page |
| `/login` | `guest` | Public | Đăng nhập |
| `/register` | `guest` | Public | Đăng ký |
| `/dashboard` | `auth` | User, Admin | Todo dashboard và modal CRUD |
| `/profile` | `auth` | User, Admin | Thông tin phiên hiện tại |
| `/users` | `auth`, `admin` | Admin | Danh sách user |
| `/users/:id` | `auth`, `admin` | Admin | Chi tiết và cập nhật role |

### 5.2. Route hiện có

Code hiện tại mới có:

- `/`
- `/login`
- `/register`
- `/dashboard`

Todo create/edit dùng modal trên dashboard; đây là lựa chọn UI hợp lệ, không bắt buộc có `/dashboard/create` hoặc `/dashboard/:id`.

### 5.3. Điều hướng

- Guest truy cập route protected → `/login`, giữ `redirect` nếu cần.
- User đã đăng nhập truy cập `/login` hoặc `/register` → `/dashboard`.
- User không phải admin truy cập route admin → `/dashboard` hoặc trang `403`.
- Sau login thành công → tải `/auth/me` → route đích hoặc `/dashboard`.
- Sau register thành công → `/login`; backend không auto-login.
- Logout → xóa toàn bộ state phụ thuộc user → `/login`.
- Route không tồn tại → trang 404 của Nuxt.

## 6. Layout và shell ứng dụng

### 6.1. Default layout

- Navbar.
- Nội dung route.
- Footer.
- Navigation thay đổi theo auth state.
- Menu admin chỉ hiển thị khi `auth.user.role === "admin"`.

### 6.2. Auth layout

Có thể bổ sung layout riêng cho login/register để giảm navigation không cần thiết. Nếu giữ default layout, Navbar không được hiển thị hành động gây nhầm lẫn khi user chưa đăng nhập.

### 6.3. Navbar

- Guest: login, register.
- Authenticated: dashboard, profile, logout.
- Admin: thêm users/admin navigation.
- Chỉ dùng field có trong `CurrentUser`: `id`, `username`, `role`.
- Không hiển thị email/avatar nếu chưa lấy từ endpoint trả `User` đầy đủ.
- Logo phải tồn tại trong `public/` hoặc dùng asset hợp lệ.

## 7. Type contract

Không dùng `any` cho API model.

```ts
export type UserRole = 'user' | 'admin'

export interface CurrentUser {
  id: number
  username: string
  role: UserRole
}

export interface User extends CurrentUser {
  email: string
  createdAt: string
  updatedAt: string
}

export interface Todo {
  id: number
  title: string
  description?: string
  isDone: boolean
  ownerId: number
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiError {
  statusCode: number
  message: string | string[]
  error?: string
  timestamp: string
  path: string
  details?: Array<{
    field: string
    message: string
  }>
  requestId?: string
}
```

Todo list query:

```ts
export interface TodoQuery {
  page?: number
  limit?: number
  isDone?: boolean
  search?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'id' | 'title' | 'isDone' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}
```

## 8. API integration

### 8.1. Axios

Axios instance lấy base URL từ:

```ts
runtimeConfig.public.apiBaseUrl
```

Request interceptor:

- Đọc token từ auth state đã được hydrate.
- Gắn `Authorization: Bearer <access_token>`.
- Không log token hoặc toàn bộ request headers.

Response interceptor:

- `401`: clear auth, reset user/todo/admin stores và chuyển tới `/login`.
- `403`: giữ phiên, hiển thị thông báo không đủ quyền; nếu đang ở admin route thì điều hướng an toàn.
- Lỗi network/`500`: trả lỗi cho caller và hiển thị message chung.
- Tránh redirect loop khi chính request login trả `401`.

### 8.2. API layer duy nhất

`useApi` hoặc module API tương đương phải là nguồn ánh xạ endpoint duy nhất:

```ts
authApi.register({ username, email, password })
authApi.login({ usernameOrEmail, password })
authApi.me()

todoApi.list(query)
todoApi.create(payload)
todoApi.getById(id)
todoApi.update(id, payload)
todoApi.remove(id)

userApi.list(query)
userApi.getById(id)
userApi.updateRole(id, role)
```

Không tồn tại trong backend contract:

- `POST /auth/logout`
- `GET /user/profile`
- `PUT /user/profile`

Các mapping này phải bị xóa. Logout là client-side; profile hiện dùng `/auth/me` hoặc `/users/:id` theo quyền.

### 8.3. Response handling

- API layer nên unwrap `AxiosResponse.data` và trả typed payload.
- Component/store không cần biết chi tiết Axios.
- Không giả định global response envelope vì backend trả response flat.
- Không điều khiển logic bằng cách tìm substring trong message tiếng Anh.
- Ưu tiên HTTP status và `details` cho field error.

## 9. Authentication và session

### 9.1. Login

Request:

```json
{
  "usernameOrEmail": "john_doe",
  "password": "password123"
}
```

Flow:

1. Validate form.
2. `POST /auth/login`.
3. Lấy `access_token`.
4. Lưu token.
5. `GET /auth/me`.
6. Gán `CurrentUser` vào auth store.
7. Điều hướng.

### 9.2. Register

Request:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Backend trả `{ message, user }`, không trả token.

Flow:

1. Validate form.
2. `POST /auth/register`.
3. Hiển thị success.
4. Điều hướng tới `/login`.
5. Không gọi `setToken` từ register response.

### 9.3. Session restore

- Token phải được đọc ở cấp ứng dụng/plugin hoặc auth store init, không chỉ trong middleware dashboard.
- Nếu có token nhưng chưa có user, gọi và `await` `/auth/me`.
- Trong thời gian xác minh phiên, UI dùng trạng thái `initializing`, không nhấp nháy guest/auth menu.
- Token không hợp lệ → clear auth.
- Public route và Navbar phải nhận đúng trạng thái sau reload.

### 9.4. Logout

- Không gọi backend.
- Xóa cookie token.
- Reset auth user/token.
- Reset todo và admin-related state để không lộ dữ liệu giữa hai phiên.
- Đóng modal/toast nhạy cảm nếu có.
- Điều hướng tới `/login`.

### 9.5. Token storage

Implementation hiện tại lưu token trong cookie tên `token`, `maxAge` một ngày và cookie đọc được bằng JavaScript.

Tối thiểu:

- `sameSite: "lax"`.
- `secure: true` ở HTTPS production.
- `path: "/"`.
- Đồng bộ thời gian cookie với JWT expiration.
- Không đưa token vào localStorage, URL hoặc log.

Cookie được set bằng JavaScript không thể là `HttpOnly`; token vẫn có thể bị đánh cắp qua XSS. Nếu yêu cầu bảo mật cao hơn, cần chuyển sang mô hình Nuxt server/BFF để server set HttpOnly cookie và proxy request tới backend. Đây là thay đổi kiến trúc, không được mô tả như một flag client đơn giản.

### 9.6. Auth store

State:

```ts
{
  user: CurrentUser | null
  token: string | null
  initializing: boolean
  initialized: boolean
}
```

Actions:

- `setToken`
- `restoreSession`
- `fetchMe`
- `logout`/`clearAuth`

Getters:

- `isLoggedIn`
- `isAdmin`

`isLoggedIn` chỉ biểu thị có token; route quyết định cuối cùng phải chờ restore/validation khi cần.

## 10. Route middleware

### 10.1. `auth`

- Await quá trình restore session.
- Không có token hoặc `/auth/me` thất bại → `/login`.
- Có token hợp lệ → cho tiếp tục.

### 10.2. `guest`

- Chờ auth init.
- User hợp lệ → `/dashboard`.
- Guest → cho truy cập login/register.

### 10.3. `admin`

- Chạy sau auth.
- `role !== "admin"` → từ chối/redirect.
- Middleware chỉ cải thiện UX; backend vẫn kiểm tra quyền.

## 11. State management

### 11.1. Todo store

State:

```ts
{
  items: Todo[]
  query: TodoQuery
  pagination: Pagination
  filters: Record<string, unknown>
  loading: boolean
  mutating: boolean
  error: ApiError | null
}
```

Actions:

- `fetchTodos(query?)`
- `createTodo(payload)`
- `updateTodo(id, payload)`
- `deleteTodo(id)`
- `toggleTodo(id, isDone)`
- `setPage(page)`
- `setFilters(filters)`
- `reset()`

Quy tắc:

- Store giữ toàn bộ query hiện tại.
- Chuyển trang không làm mất `isDone`, search, date range hoặc sort.
- Thay filter/search reset page về 1.
- Chỉ có một request initial load.
- Tránh mutation local và refetch chồng chéo không cần thiết.
- Xử lý out-of-order response khi search nhanh bằng debounce/cancel hoặc request identity.

### 11.2. User admin store

State:

- `users`
- `selectedUser`
- `pagination`
- `loading`, `mutating`, `error`

Actions:

- `fetchUsers({ page, limit })`
- `fetchUser(id)`
- `updateRole(id, role)`
- `reset()`

Sau khi cập nhật role:

- Cập nhật list/detail nhất quán.
- Nếu admin đổi role của chính mình, refresh `/auth/me` hoặc xử lý response `403` sau đó.
- Hiển thị `409` nếu cố hạ cấp admin cuối cùng.

## 12. Todo dashboard

### 12.1. Danh sách

- Hiển thị title, description, trạng thái và thời gian.
- Format datetime theo locale hiện tại.
- Loading skeleton/spinner.
- Empty state khi không có dữ liệu.
- Error state có retry.
- Pagination dùng metadata backend.

### 12.2. Filter và sort

- Trạng thái: all, pending, completed.
- Search theo title/description.
- Date range `dateFrom`, `dateTo`.
- Sort field và direction.
- Có nút reset filter.
- Có thể đồng bộ query với URL để reload/share giữ trạng thái.
- Không phụ thuộc `filters` echo để quyết định quyền.

### 12.3. Create

- Modal trên dashboard.
- `title` bắt buộc.
- `description` tùy chọn.
- Submit disabled khi request đang chạy.
- Thành công: đóng modal, cập nhật/refetch đúng trang.

### 12.4. Edit

- Modal nhận todo đang chọn.
- Form prefill title, description, isDone.
- Phải truyền trạng thái edit để hiển thị toggle hoàn thành.
- Chỉ gửi field được phép: title, description, isDone.
- Không gửi nguyên `Todo` chứa `id`, `ownerId`, timestamps.

### 12.5. Toggle

- Gửi `PATCH /todos/:id` với `{ isDone }`.
- Có optimistic update thì phải rollback khi lỗi.
- Không vừa gọi API qua composable vừa mutation store bằng một luồng khác.

### 12.6. Delete

- Có confirmation modal.
- Disable nút confirm khi đang xóa.
- Thành công: xóa/refetch và điều chỉnh page nếu trang hiện tại trở thành rỗng.
- `403`, `404` hiển thị message phù hợp và refresh list.

## 13. Profile

`/profile` dùng `/auth/me` để hiển thị:

- Username.
- Role.

Contract hiện không trả email/timestamps. Nếu cần profile đầy đủ:

- User có thể gọi `GET /users/:id` của chính mình.
- Frontend phải dùng `User` shape và xử lý `403/404`.

MVP không có endpoint cập nhật profile; không hiển thị form update giả.

## 14. Admin user management

### 14.1. Danh sách

- Route `/users`.
- Chỉ admin.
- Hiển thị username, email, role, createdAt.
- Pagination `page`, `limit`.
- Backend hiện chưa hỗ trợ search/role filter cho users; UI không gửi param chưa có trong contract.

### 14.2. Chi tiết

- Route `/users/:id`.
- Tải `GET /users/:id`.
- Hiển thị public user fields.

### 14.3. Cập nhật role

- Chọn `user` hoặc `admin`.
- Confirmation cho thao tác hạ quyền.
- Gửi `PATCH /users/:id/role`.
- Xử lý `409` khi user là admin cuối cùng.
- Không cho UI khẳng định thành công trước response backend.

## 15. Form validation

### 15.1. Login

- `usernameOrEmail`: bắt buộc.
- `password`: bắt buộc, tối thiểu 8 ký tự để khớp backend.

### 15.2. Register

- `username`: bắt buộc.
- `email`: bắt buộc, đúng định dạng.
- `password`: tối thiểu 8 ký tự.
- Không có field role.

### 15.3. Todo

- `title`: trim, bắt buộc; client có thể yêu cầu tối thiểu 3 ký tự.
- `description`: string tùy chọn.
- `isDone`: boolean.
- Update phải có ít nhất một thay đổi.

Validation client phục vụ UX, không thay thế validation backend.

Field error backend ưu tiên map từ `details`. Nếu backend chỉ trả `message` string/array, hiển thị form-level error an toàn.

## 16. UI/UX

- Responsive mobile/desktop.
- Nút submit/mutation bị disable trong lúc request.
- Không gửi request lặp do double-click.
- Có visible focus state và label.
- Modal trap focus, đóng bằng Escape và trả focus cho trigger.
- Confirmation trước delete/logout/role downgrade.
- Toast cho mutation thành công/thất bại; không toast success khi fetch nền.
- Không gọi `closeAll` nếu điều đó xóa thông báo quan trọng không liên quan.
- Error message không hiển thị stack trace hoặc raw object.
- Empty, loading, error và forbidden state được phân biệt.

## 17. i18n

Locale:

- `vi` mặc định.
- `en` tùy chọn.
- Strategy `no_prefix`.

Yêu cầu:

- `langDir` phải trỏ đúng tới `i18n/locales/`.
- Locale preference lưu phía client với key nhất quán.
- Tránh SSR/client mismatch: chỉ áp dụng localStorage locale sau khi client ready hoặc dùng cookie SSR-aware.
- Toàn bộ label, validation, loading và error fallback dùng translation key.
- Date format theo locale đang active, không hard-code `vi-VN`.
- Thiếu translation phải fallback an toàn.

## 18. Styling và assets

- Tailwind CSS 4 là nền tảng styling.
- Component dùng design token/class pattern nhất quán.
- Màu, spacing, radius, shadow và typography được tái sử dụng.
- Asset tham chiếu trong template phải tồn tại.
- Không phụ thuộc generated `.nuxt` files.
- Dark mode không thuộc MVP.

## 19. Configuration

`nuxt.config.ts`:

- Dev port mặc định `3000`.
- Public API base URL mặc định `http://localhost:3001`.
- `srcDir: "."`, Nuxt pages enabled.

`.env.example`:

```dotenv
PORT=3000
API_BASE_URL=http://localhost:3001
```

Yêu cầu:

- Không commit `.env`.
- Chỉ đưa config công khai vào `runtimeConfig.public`.
- Không lưu JWT secret, database credential hoặc backend secret ở frontend.
- README phải mô tả setup, env, development/build/preview và dependency backend.

### 19.1. Dependency hygiene

Chỉ giữ module được sử dụng. Cần đánh giá và loại bỏ nếu không dùng:

- `@nuxt/content`
- `better-sqlite3`
- `@nuxt/image`
- `@nuxt/scripts`
- `@nuxt/ui`
- `universal-cookie`

`@nuxt/test-utils` nên chuyển thành dev dependency khi test được thiết lập.

## 20. Error handling

| Status | Hành vi frontend |
| --- | --- |
| `400` | Hiển thị field/form error |
| `401` | Clear session, redirect login, trừ request login |
| `403` | Giữ session, hiển thị forbidden, redirect nếu route không hợp lệ |
| `404` | Hiển thị not found, refresh list nếu tài nguyên vừa bị xóa |
| `409` | Hiển thị conflict cụ thể ở form/modal |
| `500` | Hiển thị lỗi chung và cho retry |
| Network | Hiển thị mất kết nối, không xóa phiên ngay |

Không parse nguyên văn message để xác định error type. Không nuốt lỗi trong store khiến component hiểu nhầm request thành công.

## 21. Testing

### 21.1. Unit test

- Auth store: token, restore session, fetchMe failure, clear/reset.
- Todo store: query persistence, pagination, CRUD state và lỗi.
- User store: list/detail/update role.
- API layer: endpoint, request body, unwrap response, interceptor.
- Middleware: auth, guest, admin.

### 21.2. Component test

- Login/register validation.
- Todo create/edit forms.
- Filter/search/sort.
- Pagination.
- Confirmation modal.
- Navbar theo auth/role.
- Loading/empty/error states.

### 21.3. E2E

- Register → login → me → dashboard.
- Session restore sau reload.
- Todo create/edit/toggle/delete.
- Filter và pagination giữ nguyên cùng nhau.
- `401` clear session.
- User không vào route admin.
- Admin list user và update role.

Code hiện tại chưa có test file hoặc test runner script. Đây là khoảng trống MVP.

## 22. Accessibility và performance

- Dùng semantic HTML.
- Input có label và error association.
- Modal có role/aria phù hợp.
- Icon button có accessible name.
- Keyboard navigation cho dropdown/modal.
- Màu đạt độ tương phản cần thiết.
- Debounce search.
- Không fetch dashboard hai lần khi mount.
- Lazy-load phần admin nếu cần.
- Tránh module/dependency không sử dụng làm tăng build.

## 23. Tiêu chí hoàn thành frontend

- `npm run build`, lint, typecheck và test thành công.
- Route auth/guest/admin hoạt động sau reload và SSR/CSR navigation.
- Register không đọc token không tồn tại.
- Login validation khớp backend.
- `401` được xử lý toàn cục không tạo redirect loop.
- Dashboard chỉ fetch một lần và giữ filter khi đổi trang.
- Todo CRUD và mọi query option trong spec chung hoạt động.
- Profile và admin user management hoạt động.
- Không gọi endpoint ngoài contract.
- Không dùng `any` cho model/API state chính.
- UI có loading, empty, error, forbidden và confirmation states.
- Cookie có flags phù hợp với môi trường hoặc kiến trúc HttpOnly được triển khai đúng.
- Không có lỗi hydration nghiêm trọng.
- i18n không làm build/runtime lỗi.

## 24. Khoảng cách của code hiện tại so với spec

Các điểm sau cần được xử lý trong implementation; tài liệu hóa không đồng nghĩa code đã đạt yêu cầu:

1. Register đang đọc `res.data.access_token`, nhưng backend trả `{ message, user }`.
2. Login validation chấp nhận password 6 ký tự, backend yêu cầu tối thiểu 8.
3. `useApi.authApi.login` gửi `{ email, password }` thay vì `{ usernameOrEmail, password }`.
4. `useApi.authApi.register` gửi `name` thay vì `username`.
5. `POST /auth/logout`, `GET /user/profile`, `PUT /user/profile` không tồn tại.
6. Auth session chỉ được restore trong `auth` middleware; Navbar/public route có thể hiển thị sai sau reload.
7. Auth middleware gọi `fetchMe()` nhưng không `await`, tạo race condition.
8. Axios chưa có response interceptor cho `401/403`.
9. Cookie token thiếu cấu hình `sameSite`, `secure`, `path` và đọc được bằng JavaScript.
10. Auth user dùng `any`; Navbar kỳ vọng email/avatar không có trong `/auth/me`.
11. Chưa có `guest` và `admin` middleware.
12. Chưa có page profile, user list và user detail.
13. Todo chưa hỗ trợ search, date range và sort.
14. Chuyển page làm mất filter trạng thái.
15. Dashboard gọi API danh sách hai lần khi mount.
16. Dashboard/store/composable gọi API theo nhiều đường khác nhau, dễ lệch state.
17. Edit modal không truyền trạng thái edit nên toggle `isDone` có thể không hiển thị.
18. Todo filter dùng tên component có thể không khớp auto-import `UiDropdownItem`.
19. Logo `/logoSchedule.png` không tồn tại.
20. `i18n.langDir` không khớp vị trí `i18n/locales/`.
21. Một số loading/error/date text hard-code tiếng Việt dù có i18n.
22. Parse API error bằng substring message tiếng Anh.
23. `.env.example` chưa tồn tại và README còn là boilerplate Nuxt.
24. Không có test.
25. Nhiều module/dependency được cài nhưng chưa sử dụng.
