import type { Metadata } from "next";
import { Alegreya, Alegreya_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-logo",
  subsets: ["latin"],
});

const alegreya = Alegreya({
  variable: "--font-title",
  subsets: ["latin"],
});

const alegreyaSans = Alegreya_Sans({
  variable: "--font-body",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ethny Email Dashboard",
  description: "Internal dashboard for managing Ethny email campaigns with Resend previews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${alegreya.variable} ${alegreyaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
