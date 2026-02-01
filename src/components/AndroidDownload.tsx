import { useState } from 'react';

const APK_URL = import.meta.env.VITE_APK_DOWNLOAD_URL || '/notes-app.apk';
const IS_EXTERNAL = APK_URL.startsWith('http');

export function AndroidDownload() {
  const [error, setError] = useState<string | null>(null);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    setError(null);

    if (IS_EXTERNAL) {
      window.open(APK_URL, '_blank', 'noopener');
      return;
    }

    try {
      const res = await fetch(APK_URL, { method: 'HEAD' });
      if (res.ok) {
        const link = document.createElement('a');
        link.href = APK_URL;
        link.download = 'Notes-App.apk';
        link.click();
      } else {
        setError(
          'APK not available. Build in Android Studio, add notes-app.apk to public/, then redeploy. Or set VITE_APK_DOWNLOAD_URL to a hosted APK URL.'
        );
      }
    } catch {
      setError(
        'APK not available. Build in Android Studio, add notes-app.apk to public/, then redeploy. Or set VITE_APK_DOWNLOAD_URL to a hosted APK URL.'
      );
    }
  }

  return (
    <div className="android-download-wrap">
      <button
        type="button"
        onClick={handleClick}
        className="android-download"
        aria-label="Download APK file"
      >
        <svg
          className="android-download-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download APK file
      </button>
      {error && <p className="android-download-error">{error}</p>}
    </div>
  );
}
