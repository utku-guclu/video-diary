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
- 🔄 State management with ZustandState management with Zustand (with AsyncStorage)
- 🎨 Styled components for theming
- 📱 Responsive design with React Native Paper
- 🌐 Offline support with SQLite
- 🔒 Data validation schemas with Zod
- 🎥 Smooth animations with React Native Reanimated
- ⚙ Background processing using Tanstack Query

### Preview the App
![video-diary](https://github.com/user-attachments/assets/3ba0a812-df1f-44f1-bfb6-a0864774ffd0)

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

    React Native + Expo: Base framework for app development
    Firebase Storage: For uploading and storing videos
    Tanstack Query: Robust async operation handling
    Expo Video: For video playback
    Zustand + AsyncStorage: State management and persistent storage
    Expo SQLite: Structured offline storage
    NativeWind: Responsive styling
    Zod: Validation schemas for formsReact Native + Expo

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

    Import videos from the device library
    Save and persist cropped video data
    Display organized lists with thumbnails 

#### Video Editing

    Scrubber-enabled cropping
    Add/edit metadata (title, description)
    Save multiple versions of cropped segments

#### Player Controls

    Play/pause
    Seek timeline
    Display duration
    Switch between portrait/landscape views

#### Database & Offline Features

    Expo SQLite integration for video records
    AsyncStorage for state persistence
    Seamless offline access

#### UI/UX Enhancements
    Clean navigation with Expo Router
    Responsive styling via NativeWind
    Smooth animations using React Native Reanimated

## 🔧 Configuration

### .env

```
EXPO_PUBLIC_CREATOMATE_API_KEY=YOUR_CREATOMATE_API_KEY
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
EXPO_PUBLIC_CREATOMATE_API_URL=YOUR_CREATOMATE_API_URL
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
```

### Firebase
```
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  storageBucket: "YOUR_BUCKET"
};
```

### Creatomate API
```Creatomate config
const CREATOMATE_API_KEY = "YOUR_API_KEY";
const CREATOMATE_API_URL = "https://api.creatomate.com/v1";
```

## ⏳ Performance
    Virtualized lists for smooth scrolling (`FlashList`)
    Memoized components with `React.memo`
    Deferred loading with `Suspense`
    Selective store updates with Zustand selectors
    Persisted state with efficient storage strategies
    LRU cache for frequently accessed data

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

