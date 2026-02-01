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

### Live reload (see CSS changes without rebuilding)

1. Get your machine's IP: run `ipconfig` (Windows) and note your IPv4 address (e.g. `192.168.1.100`). For Android emulator, use `10.0.2.2`.
2. Start the dev server in one terminal:
   ```bash
   npm run dev
   ```
3. In another terminal, set the live reload URL and run the app:
   ```bash
   set CAPACITOR_LIVE_RELOAD=http://YOUR_IP:5173
   npx cap sync android
   npx cap run android
   ```
   (PowerShell: `$env:CAPACITOR_LIVE_RELOAD="http://YOUR_IP:5173"`)
4. The Android app loads from your dev server — CSS changes appear immediately. Before building for production, run `npx cap sync android` without the env var.

### Generate release APK/AAB for Google Play

In Android Studio: **Build** → **Generate Signed Bundle / APK** → choose **Android App Bundle** (AAB) for Play Store submission.

### APK download button (web)

To enable the "Download Android app" button on the website:

**Option A – Host APK in the project**
1. Build a release APK in Android Studio: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Copy the APK from `android/app/build/outputs/apk/release/app-release-unsigned.apk` (or the signed APK path)
3. Rename it to `notes-app.apk` and place it in the `public/` folder
4. Rebuild and deploy the web app

**Option B – Host APK externally (e.g. GitHub Releases)**
1. Build the APK and upload it to [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
2. Add `VITE_APK_DOWNLOAD_URL` to your `.env` with the direct download URL (e.g. `https://github.com/user/repo/releases/download/v1.0/notes-app.apk`)
3. Rebuild and deploy

If the APK is missing, the button shows a helpful error message instead of a 404.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Supabase** for authentication and database
- **Capacitor** for Android native packaging
