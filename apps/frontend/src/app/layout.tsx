import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { VaultProvider } from "@/lib/vault/VaultProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VaultSpace - Secure cloud storage",
  description:
    "Encrypt files in your browser before they reach the server. Keys stay wrapped behind your vault passphrase.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">
        <ThemeProvider>
          <AuthProvider>
            <VaultProvider>{children}</VaultProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
