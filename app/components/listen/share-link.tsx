import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareLinkProps {
  darkMode: boolean;
  shareUrl: string;
}

export const ShareLink = ({ darkMode, shareUrl }: ShareLinkProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        value={shareUrl}
        readOnly
        className={`flex-grow ${darkMode ? "bg-gray-700 text-white" : ""}`}
      />
      <Button onClick={copyToClipboard} variant="outline" size="icon">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};
