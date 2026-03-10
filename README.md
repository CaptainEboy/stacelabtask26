# Stacelabs Task Tracker

A simple, offline-first task management app built with React Native and Expo. Create, complete, and filter your tasks—all stored locally on your device with no internet required.

## Images

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone or download the project
2. Install dependencies:
```bash
npm install
```
```bash
npx expo install
```

```bash
npx expo-doctor
```

3. Start the development server:
```bash
npx expo start --clear --tunnel
```

4. Scan the QRCode to open the app in your Expo Go app on your phone


## Features

- **Add Tasks**: Create new tasks with validation to prevent empty entries
- **Mark Complete**: Tap any task to toggle between complete and incomplete
- **Filter Tasks**: View All, Active, or Completed tasks with live counters
- **Delete Tasks**: Remove tasks you no longer need
- **Offline First**: All data persists locally—works without internet
- **Responsive Design**: Clean, modern UI that works on all screen sizes

## Libraries Used and Why

### Core Framework
- **React Native & Expo**: Cross-platform mobile development with a single codebase. Expo provides tools and libraries that simplify development without requiring native code.
- **Expo Router**: File-based routing system that integrates seamlessly with Expo, enabling simple navigation patterns.

### Storage
- **@react-native-async-storage/async-storage**: Lightweight, async key-value storage that works on both mobile and web. Perfect for storing JSON data locally without external servers.

### UI & Icons
- **React Native StyleSheet**: Built-in styling system with performance optimizations
- **lucide-react-native**: Modern, consistent icon library with a clean design aesthetic

### Development
- **TypeScript**: Type safety and better developer experience with autocompletion and error detection

## Architecture

```
app/
├── (tabs)
         ├── index.tsx           # Main tasks screen with list, filters, and input
lib/
├── db.ts              # AsyncStorage-based persistence layer
```

The app uses a simple persistence layer that abstracts AsyncStorage operations, making it easy to swap storage implementations if needed.

## What I Would Improve With More Time

### User Experience
1. **Swipe to Delete**: Add gesture support for swiping tasks left to delete (instead of requiring a delete button)
2. **Task Editing**: Allow users to edit task titles after creation
3. **Due Dates & Reminders**: Add optional due dates and local notifications
4. **Dark Mode**: Implement system-aware theme switching
5. **Animations**: Add smooth transitions when tasks are added, completed, or deleted

### Data & Performance
1. **SQLite Integration**: Replace AsyncStorage with expo-sqlite for better performance with large task lists
2. **Batch Operations**: Optimize multiple task updates to minimize storage writes
3. **Search Functionality**: Add a search bar to filter tasks by keywords
4. **Data Export**: Allow exporting tasks as JSON or CSV files
5. **Undo/Redo**: Implement action history for reverting changes

### Features
1. **Categories/Tags**: Organize tasks by project or category
2. **Recurring Tasks**: Support daily, weekly, or monthly recurring tasks
3. **Priority Levels**: Add high/medium/low priority indicators
4. **Subtasks**: Break down complex tasks into smaller steps
5. **Cloud Sync**: Optional Supabase sync for backing up tasks across devices
6. **Share Tasks**: Create shareable task lists with other users


### Mobile-Specific
1. **App Icon & Splash Screen**: Custom branding for native apps
2. **Haptic Feedback**: Add vibration feedback for interactions (iOS/Android)
3. **Keyboard Shortcuts**: Support keyboard commands for power users
4. **Offline Indicators**: Show when the app is offline with visual cues
