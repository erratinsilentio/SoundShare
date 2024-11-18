"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { TrackVersion } from ".";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import UploadNewVersionButton from "./upload-button";
import { useStore } from "@nanostores/react";
import { $darkMode } from "@/store/store";

interface DownloadUploadButtonProps {
  setVersions: Dispatch<SetStateAction<TrackVersion[]>>;
  versions: TrackVersion[];
  currentVersion: TrackVersion | null;
  handleDownload: () => void;
}

const DownloadUploadButtons: FC<DownloadUploadButtonProps> = ({
  setVersions,
  versions,
  currentVersion,
  handleDownload,
}) => {
  const darkMode = useStore($darkMode);

  return (
    <div className="w-1/2 flex flex-row items-center justify-center gap-2">
      {/* DOWNLOAD BUTTON */}
      <Button
        onClick={handleDownload}
        disabled={!currentVersion}
        className="flex items-center"
      >
        <Download className="mr-1 h-4 w-4" /> Download
      </Button>
      {/* UPLOAD BUTTON */}
      <UploadNewVersionButton
        darkMode={darkMode}
        setVersions={setVersions}
        versions={versions}
      />
    </div>
  );
};

export default DownloadUploadButtons;
