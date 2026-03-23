# ChatBot AI - Frontend

A modern, full-featured chatbot interface built with React, TypeScript, and Tailwind CSS.

## Features

- ✨ **Dark Mode Support** - Toggle between light and dark themes
- 🎤 **Voice Input** - Record and send audio messages
- 📎 **File Upload** - Attach files to your messages
- ⌨️ **Smart Input** - Type messages or use Shift+Enter for multiline input
- 📜 **Message History** - Auto-scrolling message thread
- ⏱️ **Timestamps** - Each message shows when it was sent
- 💬 **Typing Indicator** - Visual feedback when waiting for response
- 📱 **Responsive Design** - Works perfectly on desktop and mobile

## Project Structure

```
src/
├── components/
│   ├── Chatbot.tsx         # Main chatbot component
│   ├── ChatInput.tsx       # Input area with file/voice support
│   └── MessageBubble.tsx   # Message display component
├── hooks/
│   └── useChat.ts          # Chat state management hook
├── types/
│   └── chat.ts             # TypeScript type definitions
├── App.tsx                 # Root component
├── main.tsx                # React entry point
├── index.css               # Global styles (Tailwind)
├── App.css                 # Component-specific styles
└── assets/                 # Static assets
```

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5174/`

### Build

```bash
# Build for production
npm build

# Preview production build
npm run preview
```

## Connecting to Your Backend API

The chatbot currently uses a mock API. To connect to your custom backend:

### 1. Update the `useChat` Hook

Edit `src/hooks/useChat.ts` to call your API:

```typescript
const handleApiCall = async (message: string, attachments?: File[]) => {
  const formData = new FormData();
  formData.append("message", message);

  // Add attachments if any
  if (attachments) {
    attachments.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response = await fetch("YOUR_API_ENDPOINT", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.reply;
};
```

### 2. Example API Request Handler

Your backend should accept:

```
POST /api/chat
Content-Type: multipart/form-data

{
  message: "user message",
  files: [file1, file2, ...]
}
```

And return:

```json
{
  "reply": "AI response here",
  "success": true
}
```

### 3. Update the Mock API Call

In `src/hooks/useChat.ts`, replace the `setTimeout` with your actual API call:

```typescript
const addMessage = useCallback(
  (role: "user" | "assistant", content: string, attachments?: File[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      attachments,
    };

    setMessages((prev) => [...prev, newMessage]);

    if (role === "user") {
      setIsLoading(true);

      // Call your API here instead of setTimeout
      const response = await fetch("YOUR_API_ENDPOINT", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }
  },
  [],
);
```

## Technologies Used

- **React 19.2.4** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **ESLint** - Code quality

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Features to Add

- [ ] Message export
- [ ] Chat search functionality
- [ ] User authentication
- [ ] Conversation history storage
- [ ] Emoji picker
- [ ] Image preview in messages
- [ ] Code syntax highlighting
- [ ] Message editing/deletion

## License

MIT
