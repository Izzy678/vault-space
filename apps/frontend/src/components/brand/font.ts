import localFont from "next/font/local";

export const brandFont = localFont({
  src: "../landing/fonts/Inter-Latin.woff2",
  variable: "--font-landing-inter",
  weight: "100 900",
  style: "normal",
  display: "swap",
});
