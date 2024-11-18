"use client";
import { $darkMode } from "@/store/store";
import { useStore } from "@nanostores/react";
import React from "react";

export const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  const darkMode = useStore($darkMode);
  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        darkMode ? "dark bg-zinc-900" : "bg-white"
      }`}
    >
      {children}
    </main>
  );
};
