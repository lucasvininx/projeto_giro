"use client";

import localFont from "next/font/local";
import "./globals.css";
import { Smooch_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

const smoochSans = Smooch_Sans({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-smooch-sans",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} ${smoochSans.variable} font-sans antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.NEXTAUTH_SECRET = "${process.env.NEXTAUTH_SECRET}";
                window.NEXTAUTH_URL = "${process.env.NEXTAUTH_URL}";
              `,
            }}
          />
        </body>
      </html>
    </SessionProvider>
  );
}
