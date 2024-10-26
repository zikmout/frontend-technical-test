import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import { useAuthToken } from "./../contexts/authentication";

type Picture = {
  file: File;
  url: string;
};

type Caption = {
  content: string;
  x: number;
  y: number;
};

export const useMemeSubmission = (
  picture: Picture | null,
  texts: Caption[],
  description: string
) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const token = useAuthToken();
  const navigate = useNavigate();

  const submitMeme = async () => {
    if (!picture || !description || texts.length === 0) return;

    const formData = new FormData();
    formData.append("Picture", picture.file);
    formData.append("Description", description.trim());

    texts.forEach((text, index) => {
      formData.append(`Texts[${index}][Content]`, text.content);
      formData.append(`Texts[${index}][X]`, Math.round(text.x).toString());
      formData.append(`Texts[${index}][Y]`, Math.round(text.y).toString());
    });

    try {
      await axios.post(`${baseUrl}/memes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate({ to: "/" });
    } catch (error) {
      console.error("Échec de la soumission du meme :", error);
    }
  };

  return submitMeme;
};
