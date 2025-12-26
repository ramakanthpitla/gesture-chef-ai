# ChefAI - Gesture-Controlled AI Recipe Generator

ChefAI is an innovative, hands-free cooking assistant that combines **gesture control**, **voice input**, and **AI-powered recipe generation** to create a seamless cooking experience.

## 🌟 Features

- **🤖 AI-Powered Recipe Generation**: Uses OpenAI to generate intelligent, personalized recipes based on your ingredients
- **🖐️ Gesture Control**: Navigate and control the app hands-free using MediaPipe hand tracking
- **🎤 Voice Input**: Add ingredients and control the app using voice commands
- **📺 YouTube Integration**: Get relevant cooking tutorials and videos
- **🎯 Smart Filtering**: Filter recipes by dietary restrictions, cuisine type, difficulty, and time constraints
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **⚡ Real-time Updates**: Instant recipe generation and video recommendations

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will run at `http://localhost:5173`

## 🔧 Configuration

### AI Backend Setup (Optional)

ChefAI works out of the box with mock data, but for the full AI experience, configure these API keys in your `.env` file:

#### 1. OpenAI API (for AI Recipe Generation)

```bash
VITE_OPENAI_API_KEY="your-openai-api-key"
```

Get your API key from: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

#### 2. YouTube Data API (for Video Recommendations)

```bash
VITE_YOUTUBE_API_KEY="your-youtube-api-key"
```

Get your API key from: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

**Note**: Without these API keys, the app will use mock data for recipes and videos, which is perfect for development and testing.

## 💻 Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Gesture Control**: MediaPipe Hands
- **AI Backend**: OpenAI GPT-3.5
- **Video API**: YouTube Data API v3
- **Database**: Supabase (optional)

## 🎮 How to Use

1. **Add Ingredients**: Type or speak your available ingredients
2. **Set Preferences**: Choose max cooking time, dietary restrictions, cuisine type
3. **Generate Recipe**: Click generate and let AI create a custom recipe
4. **Control with Gestures**: Use hand gestures to navigate through recipe steps
5. **Watch Tutorials**: View related YouTube cooking videos

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is open source and available for educational and personal use.

---

Made with ❤️ by ChefAI

