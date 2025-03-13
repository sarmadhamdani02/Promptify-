// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';

const geistSans = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
