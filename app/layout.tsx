import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import LoadingPage from "./loading";
import { TRPCProvider } from "@/trpc/client";
import { Anybody } from "next/font/google";

const anybody = Anybody({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoundShare",
  description: "Share Music Fast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${anybody.className} antialiased edges`}>
        <TRPCProvider>
          <Suspense fallback={<LoadingPage />}>{children}</Suspense>
        </TRPCProvider>
      </body>
    </html>
  );
}
