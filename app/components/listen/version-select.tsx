"use client";
import { FC } from "react";
import { TrackVersion } from ".";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface versionSelectProps {
  handleVersionChange: (versionId: string) => void;
  versions: TrackVersion[];
  currentVersion: TrackVersion | null;
}

const VersionSelect: FC<versionSelectProps> = ({
  handleVersionChange,
  versions,
  currentVersion,
}) => {
  return (
    <Select onValueChange={handleVersionChange} value={currentVersion?.key}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select version" />
      </SelectTrigger>
      <SelectContent>
        {versions.map((version) => (
          <SelectItem key={version.key} value={version.key}>
            {version.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VersionSelect;
