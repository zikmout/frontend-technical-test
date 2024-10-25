import { MemePicture } from "./meme-picture";
import { Box, Text } from "@chakra-ui/react";

interface MemeContentProps {
  pictureUrl: string;
  texts: string[];
  description: string;
  memeId: string;
}

export const MemeContent: React.FC<MemeContentProps> = ({
  pictureUrl,
  texts,
  description,
  memeId,
}) => {
  return (
    <Box>
      <MemePicture
        pictureUrl={pictureUrl}
        texts={texts}
        dataTestId={`meme-picture-${memeId}`}
      />
      <Box mt={4}>
        <Text fontWeight="bold" fontSize="medium" mb={2}>
          Description:
        </Text>
        <Box p={2} borderRadius={8} border="1px solid" borderColor="gray.100">
          <Text color="gray.500" whiteSpace="pre-line">
            {description}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
