import { Box, Heading } from "@chakra-ui/react";
import { MemeEditor } from "./../meme-editor";
import { MemePictureProps } from "./../meme-picture";

interface UploadSectionProps {
  onDrop: (file: File) => void;
  memePicture: MemePictureProps | undefined;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onDrop,
  memePicture,
}) => (
  <Box>
    <Heading as="h2" size="md" mb={2}>
      Upload your picture
    </Heading>
    <MemeEditor onDrop={onDrop} memePicture={memePicture} />
  </Box>
);
