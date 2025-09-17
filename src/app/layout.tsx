import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";
import Script from 'next/script';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I-Health - Healthcare Management System",
  description: "Modern healthcare management system built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* Ensure theme CSS loads early from public/assets */}
        <link rel="stylesheet" href="/assets/css/ihealth.style.min.css" />
        <link rel="stylesheet" href="/assets/fonts/icofont/icofont.min.css" />
      </head>
      <body className={inter.variable}>
        <AuthProvider>
          <div id="ihealth-layout" className="theme-tradewind">
            {children}
          </div>
        </AuthProvider>
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
