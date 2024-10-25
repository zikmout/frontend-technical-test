import { Flex, Text } from "@chakra-ui/react";

interface LoadMoreButtonProps {
  loadMore: () => void;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ loadMore }) => (
  <Flex justify="center">
    <Text as="button" color="blue.500" onClick={loadMore}>
      Load more comments
    </Text>
  </Flex>
);
