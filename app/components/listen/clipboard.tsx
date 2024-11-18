import { FC, useState } from "react";
import { TrackVersion } from ".";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";

interface clipboardProps {
  darkMode: boolean;
  currentVersion: TrackVersion | null;
}

const Clipboard: FC<clipboardProps> = ({ darkMode, currentVersion }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `https://soundshare.com/share/${currentVersion?.id}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        value={
          currentVersion
            ? `https://soundshare.com/share/${currentVersion.key}`
            : "No Version Selected"
        }
        readOnly
        className={`flex-grow ${darkMode ? "bg-gray-700 text-white" : ""}`}
      />
      <Button onClick={copyToClipboard} variant="outline" size="icon">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Clipboard;
