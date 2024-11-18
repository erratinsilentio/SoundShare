import { Music } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeaderProps {
  darkMode: boolean;
}

export const Header = ({ darkMode = true }: HeaderProps) => (
  <motion.div
    className="text-center mb-8 relative z-10"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Link href={"/"} className="flex items-center justify-center mb-2">
      <Music
        className={`h-9 w-9 ${
          darkMode ? "text-pink-400" : "text-pink-500"
        } mr-2`}
      />
      <h1
        className={`text-4xl font-bold bg-gradient-to-r ${
          darkMode ? "from-blue-400 to-pink-400" : "from-blue-600 to-pink-500"
        } text-transparent bg-clip-text`}
      >
        SoundShare
      </h1>
    </Link>
    <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
      Listen and share your music
    </p>
  </motion.div>
);
