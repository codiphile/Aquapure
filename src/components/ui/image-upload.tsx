"use client";

import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./button";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // In a real app, you would upload to a cloud storage service
      // For this demo, we'll use a base64 encoding instead
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onChange(base64);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 
                      hover:bg-gray-50 dark:hover:bg-gray-900 transition cursor-pointer"
      >
        {value ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => onChange("")}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image alt="Upload" fill className="object-cover" src={value} />
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-1 h-32 cursor-pointer">
            <UploadCloud
              className={`h-8 w-8 ${
                isUploading ? "animate-pulse text-indigo-500" : "text-gray-500"
              }`}
            />
            <span className="text-xs text-gray-500">
              {isUploading ? "Uploading..." : "Click to upload an image"}
            </span>
            <span className="text-xs text-gray-400">Max size: 5MB</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={disabled || isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
};
