"use client";

import { motion } from "framer-motion";

export const Footer = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <motion.footer
      className={`mt-8 text-center ${
        darkMode ? "text-gray-400" : "text-gray-500"
      } text-sm`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      &copy; 2024 SoundShare. All rights reserved.
    </motion.footer>
  );
};
