"use client";

import FileUpload from '@/components/upload/FileUpload';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 bg-neutral-900">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-4 text-center text-white">RosettaSub</h1>
          <p className="text-lg mb-16 text-center text-white">
            Upload audio or video files to automatically generate and translate subtitles.
          </p>
          <FileUpload />
        </div>
      </div>
    </main>
  );
}