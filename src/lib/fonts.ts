import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";

export const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const fontDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const fontCode = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});
