// pages/create/CreateMemePage.tsx
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
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { MemeEditor } from "../../components/meme-editor";
import { useCaptions } from "../../hooks/useCaptions";
import { useImageDrop } from "../../hooks/useImageDrop";
import { useMemeSubmission } from "../../hooks/useMemeSubmission";

export const Route = createFileRoute("/_authentication/create")({
  component: CreateMemePage,
});

function CreateMemePage() {
  const [description, setDescription] = useState("");
  const { picture, handleDrop } = useImageDrop();
  const { texts, addCaption, deleteCaption, updateCaptionContent } =
    useCaptions();
  const submitMeme = useMemeSubmission(picture, texts, description);

  const memePicture = picture
    ? {
        pictureUrl: picture.url,
        texts,
      }
    : undefined;

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
              onChange={(e) => setDescription(e.target.value)}
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
                  onChange={(e) => updateCaptionContent(index, e.target.value)}
                  mr={1}
                />
                <IconButton
                  onClick={() => deleteCaption(index)}
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
              onClick={addCaption}
              isDisabled={!memePicture}
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
            onClick={submitMeme}
            isDisabled={!picture || description === ""}
          >
            Submit
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}
