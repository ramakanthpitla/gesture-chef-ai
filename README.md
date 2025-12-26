# 🍳 ChefAI - Gesture-Controlled AI Recipe Generator

![Version](https://img.shields.io/badge/version-4.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Vercel](https://img.shields.io/badge/deploy-vercel-black.svg)

> Cook anything with what you have! An AI-powered recipe generator with revolutionary gesture and voice controls for truly hands-free cooking.

## ✨ Features

### 🤖 AI-Powered Recipe Generation
- **OpenAI Integration** - GPT-3.5 generates personalized recipes
- **Smart Fallback** - Works perfectly with mock data if no API keys
- **Customization** - Set cooking time, dietary restrictions, cuisine preferences

### 🖐️ Gesture Control
- **Hand Tracking** - Real-time hand position tracking with MediaPipe
- **Pointer Mode** - Visual cursor follows your hand
- **Pinch to Click** - Interact with any element hands-free
- **Swipe Gestures** - Scroll pages up/down with hand movements
- **Gesture Feedback** - Clear visual indicators for all gestures

### 🎤 Voice Control
- **Speech Recognition** - Add ingredients by speaking
- **Voice Commands** - Navigate recipes with "next", "previous", "play", "stop"
- **Auto-Recovery** - Handles network errors gracefully
- **Multi-language Support** - Works in multiple languages

### 📺 YouTube Integration
- **Video Recommendations** - AI-curated cooking tutorials
- **Embedded Player** - Watch videos directly without leaving the app
- **Smart Search** - Automatically finds relevant tutorials

### 🎨 Premium UI/UX
- **Modern Design** - Glassmorphism, gradients, smooth animations
- **Dark Mode Ready** - Beautiful in any lighting
- **Fully Responsive** - Perfect on mobile, tablet, and desktop
- **Accessibility** - WCAG compliant

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/gesture-chef-ai.git
cd gesture-chef-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` and start cooking! 🎉

## 📦 Tech Stack

- **Framework:** [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI:** [OpenAI GPT-3.5](https://platform.openai.com/)
- **Hand Tracking:** [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html)
- **Speech Recognition:** Web Speech API
- **Video API:** [YouTube Data API v3](https://developers.google.com/youtube/v3)
- **Backend:** [Supabase](https://supabase.com/) (optional)

## 🎮 How to Use

### Basic Recipe Generation
1. Type or speak ingredients (e.g., "chicken, tomatoes, pasta")
2. Set cooking time
3. Click "Generate Recipe"
4. Get AI-powered recipe with step-by-step instructions

### Gesture Controls
1. Click **Gestures** button (camera icon)
2. Allow camera access
3. Use these gestures:
   - **Point** (index finger) → Aim pointer
   - **Pinch** (thumb + index) → Click elements
   - **Swipe Up** → Scroll page up
   - **Swipe Down** → Scroll page down

### Voice Controls
1. Click **Voice** button (mic icon)
2. Allow microphone access
3. Say ingredient names to add them
4. Use commands: "next", "previous", "play", "stop"

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/gesture-chef-ai)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy dist/ folder to your hosting
```

## ⚙️ Configuration

### Environment Variables (Optional)

Create `.env` file (use `.env.example` as template):

```env
# AI Features (Optional - works with mock data if not set)
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key

# Supabase (Optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

**Note:** App works fully without API keys using smart mock data!

## 📖 Documentation

- [**Deployment Guide**](./DEPLOYMENT.md) - How to deploy to Vercel
- [**AI Backend Docs**](./AI_BACKEND_DOCS.md) - AI integration details
- [**Quick Start Guide**](./QUICKSTART.md) - Get started quickly
- [**Gesture Fixes**](./GESTURE_FIXES_V2.md) - Gesture implementation
- [**Pointer & Embed**](./POINTER_EMBED_FEATURES.md) - Advanced features

## 🎯 Browser Support

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Recipe Generation | ✅ | ✅ | ✅ | ✅ |
| Gesture Control | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ✅ | ✅ | ⚠️ Limited |
| YouTube Embed | ✅ | ✅ | ✅ | ✅ |

**Note:** Camera and microphone require HTTPS (Vercel provides this automatically)

## 🐛 Troubleshooting

### Camera not working?
- Ensure HTTPS connection (localhost works too)
- Allow camera permission in browser
- Check camera is not used by another app

### Voice not working?
- Check internet connection (required for speech recognition)
- Use Chrome/Edge/Safari (not Firefox)
- Allow microphone permission
- See detailed troubleshooting in [FINAL_FIXES_SUMMARY.md](./FINAL_FIXES_SUMMARY.md)

### Gestures not responsive?
- Ensure good lighting
- Keep hand 1-3 feet from camera
- Make clear, deliberate gestures
- Try recalibrating (disable/enable gestures)

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for GPT-3.5 API
- [Google MediaPipe](https://google.github.io/mediapipe/) for hand tracking
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Vercel](https://vercel.com/) for amazing deployment platform

## 📧 Contact

Have questions? [Open an issue](https://github.com/YOUR_USERNAME/gesture-chef-ai/issues)

---

Made with ❤️ and AI | **Cook Smarter, Not Harder** 🍳

