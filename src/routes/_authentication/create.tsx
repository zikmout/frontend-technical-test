import { Box, Flex, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCaptions } from "../../hooks/useCaptions";
import { useImageDrop } from "../../hooks/useImageDrop";
import { useMemeSubmission } from "../../hooks/useMemeSubmission";
import { UploadSection } from "../../components/create/upload-section";
import { DescriptionSection } from "../../components/create/description-section";
import { CaptionsSection } from "../../components/create/captions-section";

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
          <UploadSection onDrop={handleDrop} memePicture={memePicture} />
          <DescriptionSection
            description={description}
            setDescription={setDescription}
          />
        </VStack>
      </Box>
      <CaptionsSection
        texts={texts}
        memePicture={memePicture}
        addCaption={addCaption}
        deleteCaption={deleteCaption}
        updateCaptionContent={updateCaptionContent}
        submitMeme={submitMeme}
        picture={picture}
        description={description}
      />
    </Flex>
  );
}
