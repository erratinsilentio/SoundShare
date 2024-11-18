"use client";
import { useState } from "react";
import { UploadCard } from "./upload-card";
import { AudioPlayer } from "./audio-player";

export default function Home() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [data, setData] = useState<
    { key: string; name: string } | null | undefined
  >(null);

  const songUrl = `https://utfs.io/f/${data?.key}`;
  const songName = data?.name || "Untitled";
  const shareUrl = `http://localhost:3000/listen?key=${data?.key}&name=${songName}`;

  return (
    <>
      {!isUploaded ? (
        <UploadCard setIsUploaded={setIsUploaded} setData={setData} />
      ) : (
        <AudioPlayer
          songUrl={songUrl}
          songName={songName}
          shareUrl={shareUrl}
        />
      )}
    </>
  );
}
