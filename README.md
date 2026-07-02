# Dashy Mobile

A React Native client for the self-hosted [Dashy](https://github.com/PetitOursManu/dashy) dashboard. Built with Expo SDK 57 and TypeScript.

## Features

### Authentication
- Connect to any self-hosted Dashy instance via URL
- Login with email/password, including 2FA (TOTP or backup code)
- Secure token storage via `expo-secure-store`
- Auto-restore session on app launch

### Dashboard
- Personalized greeting and overview card
- Hosted apps grid with authenticated preview images and favorite toggle
- Open hosted apps in a full-screen in-app WebView with Bearer token authentication + cookie injection
- Personal note with HTML rendering (synced to server)
- Floating glassmorphism tab bar with animated transitions (`react-native-reanimated`)
- Tab navigation: Home, Apps, Notifications, Chat

### Dashy Bot Chat
- AI assistant chat interface powered by the Dashy server's chat API
- Non-streaming, stateless design (full conversation history sent each request)
- Typing indicator, haptic feedback, error handling
- Store proposals displayed inline for admin users
- Fallback "request access" flow when chat is unavailable

### Notifications
- In-app notification list with mark-as-read
- Unread badge on the floating tab bar

### Requests
- Submit idea or file requests to the server
- Staff (admin/subadmin) can: reply, mark as done, dismiss, reopen, archive/unarchive
- Filter tabs: All, Pending, Resolved, Dismissed, Archived
- Inline reply box with send confirmation

### Profile & Settings
- Edit profile: nickname, full name, job title, timezone, language, theme, date format
- Personal note editor with plain-text input
- Connected devices / active sessions list with revoke capability
- Server connection settings (change URL, disconnect)
- Theme selection: Light, Dark, Violet, Glass (glassmorphism)
- Language selection with instant app-wide translation

### Security
- Two-factor authentication status display
- Active session management with revocation
- Session info: device, IP, last seen

### Admin
- Store: Installed apps, Catalog, and Stats overview
- Stats: total apps, total users, total opens, opens-by-month chart, top apps
- User management (redirects to web interface)

### i18n (Internationalization)
- Full app translation in 7 languages: English, French, Spanish, German, Italian, Chinese, Russian
- Powered by `i18next` + `react-i18next` + `expo-localization`
- Language selection in Edit Profile instantly switches the UI language
- Device locale detection on first launch
- All ~120 user-visible strings translated across all screens

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Expo SDK 57 (managed workflow) |
| Runtime | React Native 0.86, React 19.2 |
| Navigation | React Navigation v7 (native-stack, bottom-tabs, drawer) |
| Language | TypeScript (strict mode) |
| i18n | i18next 26 + react-i18next 17 + expo-localization |
| Animations | react-native-reanimated 4.5 |
| WebView | react-native-webview (in-app hosted app rendering) |
| Fonts | Inter (Google Fonts via expo-font) |
| Icons | Material Symbols (@expo/vector-icons) |
| Glassmorphism | expo-blur (BlurView on iOS) |
| Haptics | expo-haptics |
| Design system | Warm Sunrise (custom theme tokens, Material 3 color roles) |

## Getting Started

```bash
# Install dependencies
npm install

# Start the bundler
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios
```

## Connecting to a Server

On first launch, enter your Dashy server URL (e.g. `https://dashy.example.com`). The app validates the URL against `GET /api/mobile/v1/info` before showing the login screen.

## API

The app communicates with the Dashy server via two API surfaces:

1. **Mobile API** (`/api/mobile/v1`) — primary endpoint for all app features
   - `GET /info` — server capabilities check
   - `POST /auth/login`, `POST /auth/2fa` — authentication
   - `GET /auth/me` — session restore
   - `GET /sync` — full dashboard snapshot (user, apps, notifications, requests, chat status, admin data)
   - `POST /apps/:id/favorite` — toggle favorite
   - `POST /notifications/:id/read` — mark notification as read
   - `GET /chat/status`, `POST /chat` — Dashy Bot chat
   - `PATCH /profile` — update user profile

2. **Web API** (`/api`) — used for staff-only request management
   - `GET /requests` — list all requests (with optional status filter)
   - `PATCH /requests/:id/status` — update request status
   - `POST /requests/:id/reply` — reply to a request
   - `PATCH /requests/:id/archive` — archive/unarchive a request

Authentication uses a JWT Bearer token stored in `expo-secure-store`, sent via the `Authorization` header and injected as the `dashy_token` cookie for WebView.

## Project Structure

```
src/
├── api/             # Typed fetch wrappers and API client
│   ├── admin.ts     #   Store, catalog, stats, users
│   ├── apps.ts      #   Favorite toggle
│   ├── auth.ts      #   Login, 2FA, session restore
│   ├── chat.ts      #   Dashy Bot chat endpoints
│   ├── client.ts    #   Base fetch with auth, error handling, URL building
│   ├── notifications.ts
│   ├── profile.ts   #   Profile update
│   ├── requests.ts  #   Request CRUD + staff management
│   ├── sessions.ts  #   Session list and revoke
│   └── sync.ts      #   Full dashboard sync
├── components/       # Reusable UI and domain components
│   ├── ui/          #   Primitives: Text, Button, Card, Input, Icon, etc.
│   ├── AppCard.tsx  #   App tile with open/view/favorite
│   ├── AppGrid.tsx  #   Responsive app grid
│   ├── RequestItem.tsx # Request card with staff actions
│   ├── ScreenHeader.tsx # Header with drawer button + title
│   ├── TabButton.tsx #  Tab selector button
│   └── ...
├── context/         # React contexts
│   ├── AuthContext.tsx    # Login state, token management
│   ├── ServerContext.tsx  # Server URL, info, API version check
│   └── SyncContext.tsx    # Dashboard data, favorites, notifications, requests
├── hooks/           # Custom hooks (image auth, navigation reset)
├── i18n/            # Internationalization
│   ├── config.ts    #   i18next init, LanguageSync, changeAppLanguage
│   └── locales/     #   7 translation files (en, fr, es, de, it, zh, ru)
├── navigation/      # React Navigation configuration
│   ├── RootNavigator.tsx       # Root stack (splash, onboarding, auth, main)
│   ├── DrawerNavigator.tsx     # Side drawer (dashboard, store, users, etc.)
│   ├── DashboardTabNavigator.tsx # Floating animated tab bar
│   └── ...StackNavigator.tsx   # Section-specific stacks
├── screens/         # All app screens
│   ├── auth/        #   Splash, Login, TwoFactor
│   ├── onboarding/  #   ServerUrl setup
│   ├── dashboard/   #   Home, Apps, Notifications, Chat
│   ├── profile/     #   Settings, EditProfile, Note, Sessions, ServerSettings
│   ├── requests/    #   Requests list, NewRequest
│   ├── store/       #   Catalog, Installed
│   ├── admin/       #   Stats overview
│   ├── users/       #   Users (admin)
│   ├── security/    #   Security & 2FA
│   └── WebViewScreen.tsx # Full-screen hosted app viewer
├── theme/           # Warm Sunrise design system
│   ├── colors.ts    #   Material 3 color roles per theme
│   ├── tokens.ts    #   Spacing, radius, typography tokens
│   ├── styles.ts    #   Shared style helpers
│   └── ThemeContext.tsx # Theme provider + sync from user profile
├── types/           # TypeScript type definitions
│   └── api.ts       #   All API interfaces (User, App, Notification, etc.)
└── utils/           # Utilities
    ├── date.ts      #   Relative time (i18n-aware)
    ├── deviceName.ts
    └── storage.ts   #   AsyncStorage + SecureStore wrappers
```

## Design System

The app uses a custom **Warm Sunrise** design system with:
- Material 3 color roles (primary, secondary, tertiary, surface, etc.)
- 4 theme variants: Light, Dark, Violet, Glass
- Glassmorphism via `expo-blur` BlurView (iOS) and solid fallback (Android)
- Inter font family (400–800 weights)
- Consistent spacing, radius, and typography tokens
- Floating tab bar with spring-based animations
- Haptic feedback on key interactions