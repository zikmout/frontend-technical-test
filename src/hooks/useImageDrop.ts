import { useState } from "react";

type Picture = {
  url: string;
  file: File;
};

export const useImageDrop = () => {
  const [picture, setPicture] = useState<Picture | null>(null);

  const handleDrop = (file: File) => {
    setPicture({
      url: URL.createObjectURL(file),
      file,
    });
  };

  return { picture, handleDrop };
};
