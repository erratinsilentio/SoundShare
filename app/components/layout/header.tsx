"use client";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

export const Header = () => {
  return (
    <motion.div
      className="text-center mb-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center mb-2 sm:mb-0">
        <Music className="h-8 w-8 sm:h-12 sm:w-12 text-purple-500 mr-2 sm:mr-4" />
        <h1 className="text-[40px] font-bold bg-gradient-to-r from-blue-600 to-pink-500 text-transparent bg-clip-text">
          SoundShare
        </h1>
      </div>
      <p className="text-gray-600">Share your music with the world</p>
    </motion.div>
  );
};
