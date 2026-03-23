# Chatbot Integration Guide

## 🎯 What's Been Built

Your chatbot interface is now ready with these professional features:

### Core Features

- ✅ Clean, responsive UI with dark/light mode toggle
- ✅ Message input with multiline support (Shift+Enter)
- ✅ File upload capability (📎 button)
- ✅ Voice input/recording (🎤 button)
- ✅ Auto-scrolling message thread
- ✅ Typing indicators
- ✅ Clear chat history button
- ✅ Timestamp on each message

## 📁 File Structure Created

```
src/
├── components/
│   ├── Chatbot.tsx          # Main chat container
│   ├── ChatInput.tsx        # Input with file/voice support
│   └── MessageBubble.tsx    # Message display
├── hooks/
│   └── useChat.ts           # State management (now with API integration)
├── services/
│   └── api.ts               # API client
├── types/
│   └── chat.ts              # TypeScript definitions
└── App.tsx                  # Root component
```

## 🚀 How to Connect Your Backend

### Step 1: Set Environment Variable

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# .env
VITE_API_URL=http://your-backend.com/api
```

### Step 2: Your Backend Should Accept

```
POST /api/chat
Content-Type: multipart/form-data

Request body:
- message: string
- files: File[] (optional)

Response:
{
  "reply": "AI response",
  "success": true
}
```

### Step 3: Test Your Integration

1. Update `VITE_API_URL` in `.env`
2. The `src/services/api.ts` will automatically call your API
3. Messages with files will be sent as `multipart/form-data`

## 🎨 Customization Options

### Dark Mode Theme

The theme colors are managed by Tailwind CSS. Edit `src/components/Chatbot.tsx` to change the color scheme.

### Message Styling

Customize message bubbles in `src/components/MessageBubble.tsx`:

- User message color: Change `bg-blue-*` classes
- Assistant message color: Change `bg-gray-*` classes

### Input Area

Modify voice/file button behavior in `src/components/ChatInput.tsx`:

- Voice recording quality
- File upload limits
- Input placeholder text

## 🔧 Advanced Features to Add

### 1. Authentication

Add JWT token in `src/services/api.ts`:

```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### 2. Message Persistence

Store messages in localStorage in `useChat.ts`:

```typescript
useEffect(() => {
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}, [messages]);
```

### 3. Markdown Support

Install `react-markdown` and render responses as markdown.

### 4. Code Highlighting

Add `react-syntax-highlighter` for code blocks.

## 📦 Dependencies Included

```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "tailwindcss": "^4.2.2",
  "typescript": "~5.9.3",
  "vite": "^8.0.1"
}
```

## 🏃 Running Commands

```bash
# Development
npm run dev         # Start dev server (localhost:5174)

# Production
npm build           # Build for production
npm run preview     # Preview production build

# Code Quality
npm run lint        # Check code with ESLint
```

## ✨ Next Steps

1. **Environment Setup**
   - Create `.env` from `.env.example`
   - Set your backend API URL

2. **API Integration**
   - Update your backend to accept messages
   - Test with a simple echo endpoint first

3. **Testing**
   - Test text messages
   - Test file uploads
   - Test voice input
   - Test dark mode toggle

4. **Enhancement**
   - Add authentication
   - Implement message persistence
   - Add markdown rendering
   - Style customization

## 🐛 Troubleshooting

### CORS Issues

If you get CORS errors, your backend needs:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
```

### File Upload Not Working

- Check file size limits
- Verify multipart/form-data handling on backend

### Voice Input Issues

- Ensure browser has microphone permissions
- Check browser console for errors

## 📞 Support Features

All chat functionality is encapsulated in:

- `useChat.ts` - State management
- `api.ts` - API communication
- Components are reusable and testable

Enjoy your chatbot! 🎉
