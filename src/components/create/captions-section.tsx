import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { Plus, Trash } from "@phosphor-icons/react";

interface CaptionsSectionProps {
  texts: { content: string; x: number; y: number }[];
  memePicture:
    | { pictureUrl: string; texts: { content: string; x: number; y: number }[] }
    | undefined;
  addCaption: () => void;
  deleteCaption: (index: number) => void;
  updateCaptionContent: (index: number, content: string) => void;
  submitMeme: () => void;
  picture: { url: string; file: File } | null;
  description: string;
}

export const CaptionsSection: React.FC<CaptionsSectionProps> = ({
  texts,
  memePicture,
  addCaption,
  deleteCaption,
  updateCaptionContent,
  submitMeme,
  picture,
  description,
}) => (
  <Flex flexDir="column" width="30%" minW="250" height="full" boxShadow="lg">
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
);
