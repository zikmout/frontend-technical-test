import { Avatar, Flex, Input, Box } from "@chakra-ui/react";

interface CommentFormProps {
  memeId: string;
  commentContent: string;
  handleSubmit: (event: React.FormEvent, memeId: string) => void;
  handleCommentChange: (memeId: string, content: string) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  memeId,
  commentContent,
  handleSubmit,
  handleCommentChange,
}) => {
  return (
    <Box mb={6}>
      <form onSubmit={(event) => handleSubmit(event, memeId)}>
        <Flex alignItems="center">
          <Avatar
            borderWidth="1px"
            borderColor="gray.300"
            name="username"
            src="pictureUrl"
            size="sm"
            mr={2}
          />
          <Input
            placeholder="Type your comment here..."
            onChange={(event) =>
              handleCommentChange(memeId, event.target.value)
            }
            value={commentContent}
          />
        </Flex>
      </form>
    </Box>
  );
};
