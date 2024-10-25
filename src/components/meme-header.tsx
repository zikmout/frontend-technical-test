import { Flex, Avatar, Text } from "@chakra-ui/react";
import { format } from "timeago.js";

interface MemeHeaderProps {
  author: { username: string; pictureUrl: string };
  createdAt: string;
}

export const MemeHeader: React.FC<MemeHeaderProps> = ({
  author,
  createdAt,
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
        <Text ml={2}>{author.username}</Text>
      </Flex>
      <Text fontStyle="italic" color="gray.500" fontSize="small">
        {format(createdAt)}
      </Text>
    </Flex>
  );
};
