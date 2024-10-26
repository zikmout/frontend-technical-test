import { Box, Heading, Textarea } from "@chakra-ui/react";

interface DescriptionSectionProps {
  description: string;
  setDescription: (description: string) => void;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
  setDescription,
}) => (
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
);
