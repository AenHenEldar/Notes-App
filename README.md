# Notes App

A notes application with authentication built with React, TypeScript, and Supabase.

## Features

- **Authentication**: Sign up, sign in, and sign out with email/password
- **Notes CRUD**: Create, read, update, and delete notes
- **Protected routes**: Notes are only accessible when signed in
- **Real-time updates**: Notes sync across tabs using Supabase realtime

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. In **Project Settings** → **API**, copy your project URL and anon/public key

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Create the database table

In your Supabase dashboard, go to **SQL Editor** and run the contents of `supabase-setup.sql`. This creates the `notes` table with Row Level Security (RLS).

### 5. Configure Supabase Auth (optional)

By default, Supabase requires email confirmation. For local development, you can disable this in **Authentication** → **Providers** → **Email** → turn off "Confirm email".

### 6. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Android App

The app is configured for Android via Capacitor.

### Requirements

- [Android Studio](https://developer.android.com/studio) (for building and emulator)
- Node.js 20+ (Capacitor 7)

### Build and run on Android

1. Build the web app and sync to Android:
   ```bash
   npm run build:android
   ```

2. Open in Android Studio:
   ```bash
   npx cap open android
   ```

3. In Android Studio: run on an emulator or connected device (Run ▶️ button).

### One-command build and open

```bash
npm run open:android
```

### Generate release APK/AAB for Google Play

In Android Studio: **Build** → **Generate Signed Bundle / APK** → choose **Android App Bundle** (AAB) for Play Store submission.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Supabase** for authentication and database
- **Capacitor** for Android native packaging
