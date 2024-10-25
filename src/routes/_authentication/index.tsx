import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Avatar,
  Box,
  Collapse,
  Flex,
  Icon,
  StackDivider,
  Text,
  Input,
  VStack,
} from "@chakra-ui/react";
import { CaretDown, CaretUp, Chat } from "@phosphor-icons/react";
import { format } from "timeago.js";
import {
  createMemeComment,
  getMemeComments,
  GetMemeCommentsResponse,
  getMemes,
  GetMemesResponse,
  getUserById,
  GetUserByIdResponse,
} from "../../api";
import { useAuthToken } from "../../contexts/authentication";
import { Loader } from "../../components/loader";
import { MemePicture } from "../../components/meme-picture";
import { useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";

export const MemeFeedPage: React.FC = () => {
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [memes, setMemes] = useState<GetMemesResponse["results"]>([]);
  const [memeComments, setMemeComments] = useState<{
    [key: string]: GetMemeCommentsResponse["results"];
  }>({});
  const [openedCommentSection, setOpenedCommentSection] = useState<
    string | null
  >(null);
  const [commentContent, setCommentContent] = useState<{
    [key: string]: string;
  }>({});
  const token = useAuthToken();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollContainerRef.current) {
        clearInterval(intervalId);

        const handleScroll = () => {
          if (scrollContainerRef.current) {
            const scrollTop = scrollContainerRef.current.scrollTop;
            const scrollHeight = scrollContainerRef.current.scrollHeight;
            const clientHeight = scrollContainerRef.current.clientHeight;
            setScrollPosition(scrollContainerRef.current.scrollTop);

            if (scrollTop + clientHeight >= scrollHeight - 10) {
              setPage((prevPage) => prevPage + 1);
            }
          }
        };

        scrollContainerRef.current.addEventListener("scroll", handleScroll);

        return () => {
          scrollContainerRef.current?.removeEventListener(
            "scroll",
            handleScroll
          );
        };
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  const fetchMemes = useCallback(async () => {
    setIsLoading(true);

    const newMemesPage = await getMemes(token, page);
    const newMemesWithAuthors = await Promise.all(
      newMemesPage.results.map(async (meme) => {
        const author = await getUserById(token, meme.authorId);
        return { ...meme, author };
      })
    );

    setMemes((prevMemes) => [
      ...prevMemes,
      ...newMemesWithAuthors.filter(
        (newMeme) => !prevMemes.some((meme) => meme.id === newMeme.id)
      ),
    ]);

    setIsLoading(false);
  }, [page, token]);

  useEffect(() => {
    fetchMemes();
  }, [fetchMemes]);

  const fetchComments = useCallback(
    async (memeId: string) => {
      if (!memeComments[memeId]) {
        const commentsResponse = await getMemeComments(token, memeId, 1);

        const commentsWithAuthors = await Promise.all(
          commentsResponse.results.map(async (comment) => {
            const author = await getUserById(token, comment.authorId);
            return { ...comment, author };
          })
        );

        setMemeComments((prev) => ({
          ...prev,
          [memeId]: commentsWithAuthors,
        }));
      }
    },
    [memeComments, token]
  );

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getUserById(token, jwtDecode<{ id: string }>(token).id);
    },
  });

  const handleCommentSectionToggle = (memeId: string) => {
    const isOpening = openedCommentSection !== memeId;
    setOpenedCommentSection(isOpening ? memeId : null);

    if (isOpening && !memeComments[memeId]) {
      fetchComments(memeId);
    }
  };

  if (memes.length === 0 && isLoading) {
    return <Loader data-testid="meme-feed-loader" />;
  }
  return (
    <Flex
      ref={scrollContainerRef}
      width="full"
      height="full"
      justifyContent="center"
      overflowY="auto"
    >
      <VStack
        p={4}
        width="full"
        maxWidth={800}
        divider={<StackDivider border="gray.200" />}
      >
        {memes?.map((meme) => {
          return (
            <VStack key={meme.id} p={4} width="full" align="stretch">
              <Flex justifyContent="space-between" alignItems="center">
                <Flex>
                  <Avatar
                    borderWidth="1px"
                    borderColor="gray.300"
                    size="xs"
                    name={meme.author.username}
                    src={meme.author.pictureUrl}
                  />
                  <Text ml={2} data-testid={`meme-author-${meme.id}`}>
                    {meme.author.username}
                  </Text>
                </Flex>
                <Text fontStyle="italic" color="gray.500" fontSize="small">
                  {format(meme.createdAt)}
                </Text>
              </Flex>
              <MemePicture
                pictureUrl={meme.pictureUrl}
                texts={meme.texts}
                dataTestId={`meme-picture-${meme.id}`}
              />
              <Box>
                <Text fontWeight="bold" fontSize="medium" mb={2}>
                  Description:
                </Text>
                <Box
                  p={2}
                  borderRadius={8}
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <Text
                    color="gray.500"
                    whiteSpace="pre-line"
                    data-testid={`meme-description-${meme.id}`}
                  >
                    {meme.description}
                  </Text>
                </Box>
              </Box>
              <Flex
                // justifyContent="space-between"
                alignItems="center"
                onClick={() => handleCommentSectionToggle(meme.id)}
              >
                <Text data-testid={`meme-comments-count-${meme.id}`}>
                  {meme.commentsCount} comments
                </Text>

                <Icon
                  as={openedCommentSection === meme.id ? CaretUp : CaretDown}
                  ml={2}
                  mt={1}
                />
              </Flex>
              <Collapse in={openedCommentSection === meme.id} animateOpacity>
                <Box mb={6}>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (commentContent[meme.id]) {
                        // Replace `mutate` with the appropriate function to handle comment creation
                      }
                    }}
                  >
                    <Flex alignItems="center">
                      <Avatar
                        borderWidth="1px"
                        borderColor="gray.300"
                        name={user?.username}
                        src={user?.pictureUrl}
                        size="sm"
                        mr={2}
                      />
                      <Input
                        placeholder="Type your comment here..."
                        onChange={(event) => {
                          setCommentContent({
                            ...commentContent,
                            [meme.id]: event.target.value,
                          });
                        }}
                        value={commentContent[meme.id]}
                      />
                    </Flex>
                  </form>
                </Box>
                <VStack align="stretch" spacing={4}>
                  {(memeComments[meme.id] || []).map((comment) => (
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
                </VStack>
              </Collapse>
            </VStack>
          );
        })}
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute("/_authentication/")({
  component: MemeFeedPage,
});
