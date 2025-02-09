import { Outfit } from "next/font/google";
import "./globals.css";
// import { GoogleTagManager } from '@next/third-parties/google'
// import { GoogleAnalytics } from '@next/third-parties/google'


const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "AI Photo Booth - Click|Craze",
  description: "Click Craze by 7Langkah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
      {/* <GoogleTagManager gtmId="G-3YWLPQZ3JQ" /> */}
      {/* <GoogleAnalytics gaId="G-3YWLPQZ3JQ" /> */}
    </html>
  );
}
