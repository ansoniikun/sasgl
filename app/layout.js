import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Link from "next/link";
import ClientWrapper from "./ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"], // pick weights you need
  display: "swap",
});

export const metadata = {
  title: "South Africa Social Golf League",
  description: "South Africa's fastest growing golf social league",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.className} antialiased`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
