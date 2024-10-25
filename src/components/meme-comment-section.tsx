import {
  Box,
  Flex,
  VStack,
  Avatar,
  Text,
  Input,
  Collapse,
} from "@chakra-ui/react";

interface MemeCommentSectionProps {
  memeId: string;
  comments: {
    id: string;
    author: { username: string; pictureUrl: string };
    content: string;
  }[];
  commentContent: string;
  handleCommentChange: (memeId: string, content: string) => void;
  handleSubmit: (event: React.FormEvent, memeId: string) => void;
  loadMoreComments: () => void;
  isOpen: boolean;
}

export const MemeCommentSection: React.FC<MemeCommentSectionProps> = ({
  memeId,
  comments,
  commentContent,
  handleCommentChange,
  handleSubmit,
  loadMoreComments,
  isOpen,
}) => {
  return (
    <Collapse in={isOpen} animateOpacity>
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
      <VStack align="stretch" spacing={4}>
        {comments.map((comment) => (
          <Flex key={comment.id} align="center">
            <Avatar
              size="xs"
              name={comment.author.username}
              src={comment.author.pictureUrl}
              mr={2}
            />
            <Text fontWeight="bold">{comment.author.username}</Text>
            <Text ml={2}>{comment.content}</Text>
          </Flex>
        ))}
        <Flex justify="center">
          <Text as="button" color="blue.500" onClick={loadMoreComments}>
            Charger plus de commentaires
          </Text>
        </Flex>
      </VStack>
    </Collapse>
  );
};
