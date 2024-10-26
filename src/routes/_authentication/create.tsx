import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuthToken } from "../../contexts/authentication";
import { MemeEditor } from "../../components/meme-editor";
import { useMemo, useState } from "react";
import { MemePictureProps } from "../../components/meme-picture";
import { Plus, Trash } from "@phosphor-icons/react";
import axios from "axios";

export const Route = createFileRoute("/_authentication/create")({
  component: CreateMemePage,
});

type Picture = {
  url: string;
  file: File;
};

function CreateMemePage() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = useAuthToken();
  const [picture, setPicture] = useState<Picture | null>(null);
  const [texts, setTexts] = useState<MemePictureProps["texts"]>([]);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleDrop = (file: File) => {
    setPicture({
      url: URL.createObjectURL(file),
      file,
    });
  };

  const handleAddCaptionButtonClick = () => {
    setTexts([
      ...texts,
      {
        content: `New caption ${texts.length + 1}`,
        x: Math.random() * 400,
        y: Math.random() * 225,
      },
    ]);
  };

  const handleDeleteCaptionButtonClick = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const memePicture = useMemo(() => {
    if (!picture) {
      return undefined;
    }
    return {
      pictureUrl: picture.url,
      texts,
    };
  }, [picture, texts]);

  const handleSubmit = async () => {
    if (!picture || !description || texts.length === 0) return;

    const formData = new FormData();
    formData.append("Picture", picture.file);

    formData.append("Description", description.trim());

    texts.forEach((text, index) => {
      const roundedX = Math.round(text.x);
      const roundedY = Math.round(text.y);
      formData.append(`Texts[${index}][Content]`, text.content);
      formData.append(`Texts[${index}][X]`, roundedX.toString());
      formData.append(`Texts[${index}][Y]`, roundedY.toString());
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

  return (
    <Flex width="full" height="full">
      <Box flexGrow={1} height="full" p={4} overflowY="auto">
        <VStack spacing={5} align="stretch">
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Upload your picture
            </Heading>
            <MemeEditor onDrop={handleDrop} memePicture={memePicture} />
          </Box>
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Describe your meme
            </Heading>
            <Textarea
              placeholder="Type your description here..."
              value={description}
              onChange={handleDescriptionChange}
            />
          </Box>
        </VStack>
      </Box>
      <Flex
        flexDir="column"
        width="30%"
        minW="250"
        height="full"
        boxShadow="lg"
      >
        <Heading as="h2" size="md" mb={2} p={4}>
          Add your captions
        </Heading>
        <Box p={4} flexGrow={1} height={0} overflowY="auto">
          <VStack>
            {texts.map((text, index) => (
              <Flex width="full" key={index}>
                <Input
                  value={text.content}
                  onChange={(e) => {
                    const newTexts = [...texts];
                    newTexts[index].content = e.target.value;
                    setTexts(newTexts);
                  }}
                  mr={1}
                />
                <IconButton
                  onClick={() => handleDeleteCaptionButtonClick(index)}
                  aria-label="Delete caption"
                  icon={<Icon as={Trash} />}
                />
              </Flex>
            ))}
            <Button
              colorScheme="cyan"
              leftIcon={<Icon as={Plus} />}
              variant="ghost"
              size="sm"
              width="full"
              onClick={handleAddCaptionButtonClick}
              isDisabled={memePicture === undefined}
            >
              Add a caption
            </Button>
          </VStack>
        </Box>
        <HStack p={4}>
          <Button
            as={Link}
            to="/"
            colorScheme="cyan"
            variant="outline"
            size="sm"
            width="full"
          >
            Cancel
          </Button>
          <Button
            colorScheme="cyan"
            size="sm"
            width="full"
            color="white"
            onClick={handleSubmit}
            isDisabled={!picture || description === ""}
          >
            Submit
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}
