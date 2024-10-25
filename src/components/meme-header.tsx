import { Flex, Avatar, Text } from "@chakra-ui/react";
import { format } from "timeago.js";

interface Author {
  username: string;
  pictureUrl: string;
}
interface MemeHeaderProps {
  author: Author;
  createdAt: string;
  memeId: string;
}

export const MemeHeader: React.FC<MemeHeaderProps> = ({
  author,
  createdAt,
  memeId,
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex>
        <Avatar
          borderWidth="1px"
          borderColor="gray.300"
          size="xs"
          name={author.username}
          src={author.pictureUrl}
        />
        <Text ml={2} data-testid={`meme-author-${memeId}`}>
          {author.username}
        </Text>
      </Flex>
      <Text fontStyle="italic" color="gray.500" fontSize="small">
        {format(createdAt)}
      </Text>
    </Flex>
  );
};
