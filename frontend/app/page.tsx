"use client";

import FileUpload from '@/components/upload/FileUpload';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-8 text-center">RosettaSub</h1>
          <p className="text-lg mb-10 text-center">
            Upload audio or video files to automatically generate and translate subtitles.
          </p>
          
          <FileUpload />
        </div>
      </div>
    </main>
  );
}