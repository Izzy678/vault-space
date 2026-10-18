import type { Metadata } from "next";
import { Geist_Mono, Syne } from "next/font/google";
import { brandFont } from "@/components/brand/font";
import brandTokens from "@/components/brand/brand.module.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { VaultProvider } from "@/lib/vault/VaultProvider";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const landingDisplay = Syne({
  variable: "--font-landing-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
      className={`${brandFont.variable} ${brandTokens.theme} ${geistMono.variable} ${landingDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("vaultspace-theme");if(t==="dark"){document.documentElement.classList.add("dark");document.documentElement.dataset.theme="dark";}else{document.documentElement.dataset.theme="light";}}catch(e){}})();`,
          }}
        />
      </head>
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
