"use client";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { $darkMode } from "@/store/store";
import { useStore } from "@nanostores/react";

export const ThemeToggle = () => {
  const darkMode = useStore($darkMode);

  return (
    <Button
      className={`fixed top-4 right-4 p-2 rounded-full px-3 ${
        darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-800"
      } z-20`}
      onClick={() => $darkMode.set(!$darkMode.get())}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};
