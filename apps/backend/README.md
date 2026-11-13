# VibeSpace Backend Service

Thư mục chứa mã nguồn Backend cho dự án VibeSpace.

## Cấu trúc dự án
```
apps/backend/
├── src/
│   └── index.ts        # Điểm khởi chạy backend service
├── package.json        # Cấu hình dependency & script (@vibespace/backend)
├── tsconfig.json       # Cấu hình TypeScript compiler
└── README.md
```

## Các lệnh phát triển
Chạy từ thư mục gốc monorepo:
- `npm run dev:backend` : Chạy backend ở chế độ watch/hot-reload (sử dụng tsx)
- `npm run build:backend` : Compile TypeScript sang thư mục `dist/`
- `npm run start:backend` : Khởi chạy bundle đã compile
