import { Avatar, Flex, Text, Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface MemeCommentProps {
  author: { username: string; pictureUrl: string };
  content: string;
  createdAt: string; // Eventually type format differently,
  memeId: string;
  commentId: string;
}

export const MemeComment: React.FC<MemeCommentProps> = ({
  author,
  content,
  createdAt,
  memeId,
  commentId,
}) => {
  return (
    <Flex align="flex-start">
      <Avatar
        size="sm"
        borderWidth="1px"
        borderColor="gray.300"
        name={author.username}
        src={author.pictureUrl}
        mr={2}
      />

      <Box
        bg="gray.50"
        p={2}
        borderRadius="md"
        flex="1"
        border="1px solid"
        borderColor="white"
      >
        <Flex
          justify="space-between"
          align="center"
          data-testid={`meme-comment-author-${memeId}-${commentId}`}
        >
          <Text>{author.username}</Text>
          <Text fontStyle="italic" color="gray.500" fontSize="small">
            {dayjs(createdAt).fromNow()}
          </Text>
        </Flex>
        <Text
          color="gray.500"
          data-testid={`meme-comment-content-${memeId}-${commentId}`}
        >
          {content}
        </Text>
      </Box>
    </Flex>
  );
};
