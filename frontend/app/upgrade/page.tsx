"use client";
import { Navbar1 } from '@/components/layout/NavigationBar';

export default function ContactPage() {
  return (
    <main className="">
      <Navbar1 />
      <div className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 bg-neutral-900">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-4 text-center text-white">RosettaSub</h1>
            <p className="text-lg mb-16 text-center text-white">
              Upgrading to a premium plan unlocks additional features and higher usage limits. Visit our pricing page to learn more about the available plans and choose the one that best fits your needs.
              TBD, needs accounts first
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}