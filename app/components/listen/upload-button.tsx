"use client";
import { Dispatch, FC, SetStateAction } from "react";
import { UploadButton } from "@/app/utils/uploadthing";
import { Upload } from "lucide-react";
import { TrackVersion } from ".";

interface UploadButtonProps {
  darkMode: boolean;
  setVersions: Dispatch<SetStateAction<TrackVersion[]>>;
  versions: TrackVersion[];
}

const UploadNewVersionButton: FC<UploadButtonProps> = ({
  darkMode,
  setVersions,
  versions,
}) => {
  return (
    <UploadButton
      content={{
        button({ ready }) {
          if (ready)
            return (
              <span
                className={`flex flex-row gap-2 w-[300px] justify-center items-center ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                <Upload className="mr-1 h-4 w-4" /> Upload New Version
              </span>
            );
        },
      }}
      appearance={{
        allowedContent: "hidden",
        button: `w-[200px] border-white bg-transparent ${
          darkMode ? "text-white" : ""
        }`,
      }}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        setVersions([
          ...versions,
          {
            key: res[0].key,
            name: res[0].name,
            url: `https://utfs.io/f/${res[0].key}`,
          },
        ]);
        console.log("good");
      }}
      onUploadError={(error: Error) => {
        alert(
          `****! Looks like there was an error with uploading your track: ${error.message}`
        );
      }}
    />
  );
};

export default UploadNewVersionButton;
