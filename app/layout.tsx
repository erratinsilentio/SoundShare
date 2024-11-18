import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import LoadingPage from "./loading";
import { TRPCProvider } from "@/trpc/client";
import { Anybody } from "next/font/google";
import { Footer } from "./components/layout/footer";
import { ThemeToggle } from "./components/layout/theme-toggle";
import { MainWrapper } from "./components/layout/main-wrapper";
import { Header } from "./components/layout/header";

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
      <body className={`${anybody.className} antialiased`}>
        <TRPCProvider>
          <Suspense fallback={<LoadingPage />}>
            <MainWrapper>
              <Header />
              {children}
              <Footer />
              <ThemeToggle />
            </MainWrapper>
          </Suspense>
        </TRPCProvider>
      </body>
    </html>
  );
}
