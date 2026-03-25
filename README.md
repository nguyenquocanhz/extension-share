# extension-share

**VI:** Starter project dùng Vite + React + Tailwind CSS.  
**EN:** Starter project using Vite + React + Tailwind CSS.

## Trạng thái / Status

- Repo có ví dụ project Vite trong thư mục `extension-share/` (được tạo bởi `makeProject.js`).
- Nếu bạn chỉ có `package.json` mà thiếu `index.html`, `src/`, `vite.config.js`, hãy đảm bảo đã checkout đầy đủ hoặc tạo mới project bằng script.

## Yêu cầu / Requirements

- Node.js: 18 / 20 / 22+ (khuyến nghị dùng bản LTS mới).
- Package manager: `pnpm@9.1.0` (theo trường `packageManager` trong `package.json`).

### (Tuỳ chọn) Pin pnpm bằng Corepack / (Optional) Pin pnpm via Corepack

```bash
corepack enable
corepack prepare pnpm@9.1.0 --activate
```

## Cài đặt / Installation

```bash
cd extension-share
pnpm install
```

## Chạy dev / Development

```bash
cd extension-share
pnpm dev
```

- Mở URL mặc định của Vite (thường là `http://localhost:5173`).

## Scripts

(Chạy trong thư mục project, ví dụ `extension-share/`.)

- `pnpm dev` — chạy dev server (Vite) / run dev server (Vite)
- `pnpm build` — build production (Vite) / build for production (Vite)
- `pnpm preview` — preview bản build (Vite) / preview the build (Vite)
- `pnpm lint` — chạy ESLint / run ESLint

## Công nghệ / Tech stack

- React 18
- Vite 6
- Tailwind CSS 4
- lucide-react
- ESLint 9

## License

Repo này đang để `private` và chưa có file license kèm theo. / This repo is `private` and no license file is included.

