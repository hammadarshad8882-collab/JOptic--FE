import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/components/ReduxProvider';
import Navbar from '@/components/Navbar';


import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: 'JOptics — See the world in focus',
  description: 'Premium optical & sunwear.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-[#f0f0f0]" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <ReduxProvider>
          <Toaster />
          <Navbar />
          <main className="">{children}</main>
          
        </ReduxProvider>
      </body>
    </html>
  );
}
