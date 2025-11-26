"use client";

import FileUpload from '@/components/upload/FileUpload';
import { Navbar } from '@/components/layout/NavigationBar';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <div className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 bg-neutral-900">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-4 text-center text-white">RosettaSub</h1>
            <p className="text-lg mb-16 text-center text-white">
              Understand any audio or video content with ease. Upload your files to automatically generate and translate subtitles. 
            </p>
            <a href="/transcribe">
              <Button variant="outline">
                Start Transcribing
              </Button>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}