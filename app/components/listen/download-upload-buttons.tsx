"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { TrackVersion } from ".";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import UploadNewVersionButton from "./upload-button";

interface DownloadUploadButtonProps {
  darkMode: boolean;
  setVersions: Dispatch<SetStateAction<TrackVersion[]>>;
  versions: TrackVersion[];
  currentVersion: TrackVersion | null;
  handleDownload: () => void;
}

const DownloadUploadButtons: FC<DownloadUploadButtonProps> = ({
  darkMode,
  setVersions,
  versions,
  currentVersion,
  handleDownload,
}) => {
  return (
    <div className="w-1/2 flex flex-row items-center justify-center gap-2">
      {/* DOWNLOAD BUTTON */}
      <Button onClick={handleDownload} disabled={!currentVersion}>
        <Download className="mr-2 h-4 w-4" /> Download
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
