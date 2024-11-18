import { Play, Pause } from "lucide-react";
import { TrackVersion } from ".";

interface PlayButton {
  onPlayPause: () => void;
  currentVersion: TrackVersion | null;
  isPlaying: boolean;
}

export default function PlayButton({
  onPlayPause,
  currentVersion,
  isPlaying,
}: PlayButton) {
  return (
    <button
      onClick={onPlayPause}
      disabled={!currentVersion}
      className="relative flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out rounded-xl bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      <div className="relative w-5 h-5">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <Pause className="w-full h-full text-primary-foreground" />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isPlaying ? "opacity-0" : "opacity-100"
          }`}
        >
          <Play className="w-full h-full text-primary-foreground" />
        </div>
      </div>
    </button>
  );
}
