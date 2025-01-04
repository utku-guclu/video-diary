# Video Diary App

A modern React Native application for managing and editing personal video collections. Built with Expo and powered by Creatomate for video processing.

## ✨ Features

### Core Features
- 📱 Import videos from device library
- ✂️ Crop videos with precise 5-second segments
- 📝 Add metadata (title, description)
- 🎬 Preview videos with custom player controls
- 📊 Organize videos with thumbnails
- 🔄 Portrait/landscape orientation support
- 🌓 Light/dark theme support

### Advanced Features
- 🔄 State management with Zustand
- 🎨 Styled components for theming
- 📱 Responsive design with React Native Paper
- 🌐 Offline support with SQLite
- 🔒 Data validation schemas with Zod

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/utku-guclu/video-diary.git

# Install dependencies
bun install

# Start development server
bun expo start (--tunnel)
```

## 📱 Running the App

    - Install Expo Go on your mobile device
    - Scan QR code from terminal
    - Or run in web browser at http://localhost:3000 

## 🏗️ Architecture
### Core Technologies

    React Native + Expo
    Firebase Storage
    Creatomate API
    Expo Video

### Key Components

```
app/
  ├── components/       # Reusable UI components
  ├── (tabs)/           # Tab navigation
  ├── details/          # Video details screen
  ├── config/           # App configuration
  ├── constants/        # Global constants
  ├── db/               # Database integration with SQLite
  ├── hooks/            # Custom React hooks
  ├── modals/           # Modal components
  ├── services/         # External service integrations  
  ├── store/            # State management with Zustand
  ├── providers/        # Context providers
  ├── schemas/          # Data validation schemas with Zod
  ├── services/         # External service integrations
  ├── theme/            # Theme configuration
  ├── types/            # TypeScript definitions
  └── utils/            # Helper functions
```

### Video Crop Processing Flow
![Cropping-Process-Schema](https://github.com/user-attachments/assets/c9e632c2-0766-4916-802a-10ea2d8d29f8)

    1. User selects video from library
    2. Video uploads to Firebase Storage
    3. User selects 5-second segment
    4. Creatomate processes crop request
    5. Cropped video downloads and saves locally

### 📦 Core Features
#### Video Management

    Import from device library
    Generate thumbnails
    Save metadata
    Delete videos

#### Video Editing

    Crop 5-second segments
    Preview before saving
    Edit title/description
    Save multiple versions

#### Player Controls

    Play/pause
    Seek timeline
    Duration display
    Orientation switching

## 🔧 Configuration

```
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  storageBucket: "YOUR_BUCKET"
};
```

```Creatomate config
const CREATOMATE_API_KEY = "YOUR_API_KEY";
const CREATOMATE_API_URL = "https://api.creatomate.com/v1";
```

## 📱 Supported Platforms

    iOS 13+
    Android 6.0+
    Web (limited features)

## 🧪 Run tests
```
bun test
```

## 🔨 Build for production
```
bun run build
```

## 📝 Type checking
```
bun run typecheck
```

## 🤝 Contributing

    Fork repository
    Create feature branch
    Commit changes
    Push to branch
    Open pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Credits

[Expo](https://expo.dev/)
[Creatomate](https://creatomate.com)
[Firebase](https://firebase.google.com/)

