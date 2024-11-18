import { Play, Pause } from "lucide-react";
import { TrackVersion } from ".";

interface PlayButton {
  onPlayPause: () => void;
  currentVersion: TrackVersion | null;
  isPlaying: boolean;
  darkMode: boolean;
}

export default function PlayButton({
  onPlayPause,
  currentVersion,
  isPlaying,
  darkMode,
}: PlayButton) {
  return (
    <button
      onClick={onPlayPause}
      disabled={!currentVersion}
      className={`relative group flex items-center justify-center w-12 h-12 transition-all duration-300 ease-in-out rounded-full bg-white-10 hover:bg-white-20 
      backdrop-blur-md focus:outline-none focus:ring-[0.5px] focus:ring-offset-[0.5px] focus:ring-offset-transparent
      ${darkMode ? "focus:ring-white/50" : "focus:ring-black/50"}`}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      <div className="relative w-6 h-6 transition-transform duration-300 ease-in-out group-hover:scale-110">
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isPlaying ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <Pause
            className={`w-full h-full ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
            strokeWidth={1.5}
          />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            isPlaying ? "scale-0 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <Play
            className={`w-full h-full ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
            strokeWidth={1.5}
          />
        </div>
      </div>
      <div
        className={`absolute inset-0 rounded-full border transition-all duration-300 
      ${
        darkMode
          ? "border-white/20 group-hover:border-white/40"
          : "border-black/20 group-hover:border-black/40"
      }`}
      />
      <div
        className={`absolute -inset-1 rounded-full blur opacity-0 transition-opacity duration-300 group-hover:opacity-100
      ${darkMode ? "bg-white/5" : "bg-black/5"}`}
      />
    </button>
  );
}
