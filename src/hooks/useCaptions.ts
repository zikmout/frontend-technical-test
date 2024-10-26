import { useState } from "react";
import { MemePictureProps } from "./../components/meme-picture";

export const useCaptions = () => {
  const [texts, setTexts] = useState<MemePictureProps["texts"]>([]);

  const addCaption = () => {
    setTexts([
      ...texts,
      {
        content: `New caption ${texts.length + 1}`,
        x: Math.random() * 400,
        y: Math.random() * 225,
      },
    ]);
  };

  const deleteCaption = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  const updateCaptionContent = (index: number, content: string) => {
    const newTexts = [...texts];
    newTexts[index].content = content;
    setTexts(newTexts);
  };

  return { texts, addCaption, deleteCaption, updateCaptionContent };
};
