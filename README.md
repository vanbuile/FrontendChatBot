# BLVChat - AI Chatbot Frontend

Giao diện frontend cho BLVChat, một ứng dụng chatbot AI hiện đại được xây dựng với React, TypeScript, Tailwind CSS và Vite.

## 🔗 Links Quan Trọng

- **Backend Repository**: [Link đến Backend Repo](https://github.com/vanbuile/BackendChatBot)
- **Production**: [https://frontend-chat-bot-phi.vercel.app/](https://frontend-chat-bot-phi.vercel.app/)

## 📋 Yêu Cầu Hệ Thống

- Node.js phiên bản 16.0.0 hoặc cao hơn
- npm hoặc yarn
- Git

## 🚀 Cách Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd FrontendChatBot
```

### 2. Cài Đặt Dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Cấu Hình Environment Variables

Tạo file `.env` tại thư mục gốc project (sao chép từ `.env.example`):

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với cấu hình của bạn:

```
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### 4. Chạy Development Server

```bash
npm run dev
# hoặc
yarn dev
```

Mở trình duyệt và truy cập: `http://localhost:5173`

## 📦 Build cho Production

```bash
npm run build
# hoặc
yarn build
```

Output sẽ được tạo trong thư mục `dist/`.

## 🧪 Preview Production Build

```bash
npm run preview
# hoặc
yarn preview
```

## 📁 Cấu Trúc Dự Án

```
src/
├── components/          # React components
│   ├── Chatbot.tsx
│   ├── ChatInput.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── MessageBubble.tsx
│   ├── MessagesContainer.tsx
│   └── Sidebar.tsx
├── hooks/              # Custom React hooks
│   └── useChat.ts
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript types
│   └── chat.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 Công Nghệ Sử Dụng

- **React 18** - UI library
- **TypeScript** - Static typing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Markdown** - Markdown rendering

## 🔧 Các Lệnh Khác

- `npm run lint` - Chạy ESLint
- `npm run preview` - Preview production build

## 📝 Ghi Chú

- Đảm bảo backend server đang chạy trên `http://localhost:5000` hoặc cập nhật `VITE_API_URL` trong `.env`
- Ứng dụng hỗ trợ responsive design cho tất cả thiết bị
- Chat history được tải từ backend khi ứng dụng khởi động

## 🤝 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra backend đang chạy
2. Kiểm tra `.env` configuration
3. Mở console browser để xem error messages
4. Liên hệ team development

## 📄 License

MIT
