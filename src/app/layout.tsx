// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { MantineProvider, createTheme } from "@mantine/core";
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

// ✅ Define a custom Mantine theme
const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Inter, sans-serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
