"use client";

import { useRef } from "react";
import { Upload, FileVideo, AlertTriangle } from "lucide-react";

interface FilePickerProps {
  videoName: string;
  expectedFileName?: string;
  onFileSelected: (file: File) => void;
  className?: string;
}

export function FilePicker({
  videoName,
  expectedFileName,
  onFileSelected,
  className = "",
}: FilePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("video/")) {
        onFileSelected(file);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative group ${className}`}>
      <div
        onClick={handleClick}
        className="cursor-pointer bg-secondary/50 border-2 border-dashed border-accent/30 hover:border-accent/60 rounded-lg p-6 text-center transition-all duration-300 hover:bg-secondary/70"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <FileVideo className="w-12 h-12 text-accent/60" />
            <AlertTriangle className="w-5 h-5 text-yellow-500 absolute -top-1 -right-1" />
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Video file missing
            </h3>
            <p className="text-sm text-foreground/60 mb-2">
              Click to locate: <span className="font-medium">{videoName}</span>
            </p>
            {expectedFileName && (
              <p className="text-xs text-foreground/40">
                Looking for: {expectedFileName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
            <Upload className="w-4 h-4" />
            Select Video File
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
