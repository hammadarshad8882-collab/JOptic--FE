import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import Navbar from "@/components/Navbar";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "JOptics — See the world in focus",
  description: "Premium optical & sunwear.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen text-[#f0f0f0]"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      ><Script
  id="meta-pixel"
  strategy="afterInteractive"
>
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
    fbq('track', 'PageView');
  `}
</Script>
        <ReduxProvider>
          <Toaster />
          <Navbar />
          <main className="">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
