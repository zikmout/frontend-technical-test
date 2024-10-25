import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Avatar,
  Box,
  Collapse,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [memes, setMemes] = useState<GetMemesResponse["results"]>([]);
  const [openedCommentSection, setOpenedCommentSection] = useState<
    string | null
  >(null);
  const [commentContent, setCommentContent] = useState<{
    [key: string]: string;
  }>({});
  const token = useAuthToken();

  // const { isLoading, data: memes } = useQuery({
  //   queryKey: ["memes"],
  //   queryFn: async () => {
  //     const memes: GetMemesResponse["results"] = [];

  //     const firstPage = await getMemes(token, 1); // Recupere les mems de la page 1
  //     memes.push(...firstPage.results);
  //     const remainingPages =
  //       Math.ceil(firstPage.total / firstPage.pageSize) - 1; // Calcule le nombre de pages restantes
  //     for (let i = 0; i < remainingPages; i++) {
  //       const page = await getMemes(token, i + 2);
  //       memes.push(...page.results); // Stocke dans le tableau memes les memes de chaque page
  //     }
  //     const memesWithAuthorAndComments = [];

  //     for (let meme of memes) {
  //       const author = await getUserById(token, meme.authorId); // Recupere l'auteur du meme
  //       const comments: GetMemeCommentsResponse["results"] = [];

  //       const firstPage = await getMemeComments(token, meme.id, 1); // Recupere les commentaires de la page 1
  //       comments.push(...firstPage.results);
  //       const remainingCommentPages =
  //         Math.ceil(firstPage.total / firstPage.pageSize) - 1; // Calcule le nombre de pages restantes
  //       for (let i = 0; i < remainingCommentPages; i++) {
  //         const page = await getMemeComments(token, meme.id, i + 2);
  //         comments.push(...page.results); // Stocke dans le tableau comments les commentaires de chaque page
  //       }

  //       const commentsWithAuthor: (GetMemeCommentsResponse["results"][0] & {
  //         author: GetUserByIdResponse;
  //       })[] = [];

  //       for (let comment of comments) {
  //         const author = await getUserById(token, comment.authorId);
  //         commentsWithAuthor.push({ ...comment, author });
  //       }
  //       memesWithAuthorAndComments.push({
  //         ...meme,
  //         author,
  //         comments: commentsWithAuthor,
  //       });
  //     }
  //     return memesWithAuthorAndComments;
  //   },
  // });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollContainerRef.current) {
        console.log("scrollContainerRef actuel :", scrollContainerRef.current);
        clearInterval(intervalId);

        const handleScroll = () => {
          if (scrollContainerRef.current) {
            const scrollTop = scrollContainerRef.current.scrollTop;
            const scrollHeight = scrollContainerRef.current.scrollHeight;
            const clientHeight = scrollContainerRef.current.clientHeight;
            setScrollPosition(scrollContainerRef.current.scrollTop);
            console.log(
              "Position Y du scroll :",
              scrollContainerRef.current.scrollTop
            );

            if (scrollTop + clientHeight >= scrollHeight - 10) {
              // Ajuste la marge si nécessaire
              console.log("Fin de la page atteinte !");

              setPage((prevPage) => prevPage + 1);
              // Appelle ici la fonction pour charger plus de contenu
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
    }, 100); // Vérifie toutes les 100ms jusqu'à ce que la référence ne soit plus null

    return () => clearInterval(intervalId);
  }, []);

  const fetchMemes = useCallback(async () => {
    setIsLoading(true); // Début du chargement

    const newMemesPage = await getMemes(token, page); // Charger les mèmes de la page actuelle
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

    setIsLoading(false); // Fin du chargement
  }, [page, token]);

  useEffect(() => {
    fetchMemes();
  }, [fetchMemes]);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getUserById(token, jwtDecode<{ id: string }>(token).id);
    },
  });

  // const { mutate } = useMutation({
  //   mutationFn: async (data: { memeId: string; content: string }) => {
  //     await createMemeComment(token, data.memeId, data.content);
  //   },
  // });

  // Scroll useEffect

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
                  Description:{" "}
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
              <LinkBox as={Box} py={2} borderBottom="1px solid black">
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex alignItems="center">
                    <LinkOverlay
                      data-testid={`meme-comments-section-${meme.id}`}
                      cursor="pointer"
                      onClick={() =>
                        setOpenedCommentSection(
                          openedCommentSection === meme.id ? null : meme.id
                        )
                      }
                    >
                      <Text data-testid={`meme-comments-count-${meme.id}`}>
                        {meme.commentsCount} comments
                      </Text>
                    </LinkOverlay>
                    <Icon
                      as={
                        openedCommentSection !== meme.id ? CaretDown : CaretUp
                      }
                      ml={2}
                      mt={1}
                    />
                  </Flex>
                  <Icon as={Chat} />
                </Flex>
              </LinkBox>
              <Collapse in={openedCommentSection === meme.id} animateOpacity>
                <Box mb={6}>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (commentContent[meme.id]) {
                        mutate({
                          memeId: meme.id,
                          content: commentContent[meme.id],
                        });
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
                {/* <VStack align="stretch" spacing={4}>
                  {meme.comments.map((comment) => (
                    <Flex key={comment.id}>
                      <Avatar
                        borderWidth="1px"
                        borderColor="gray.300"
                        size="sm"
                        name={comment.author.username}
                        src={comment.author.pictureUrl}
                        mr={2}
                      />
                      <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Flex>
                            <Text
                              data-testid={`meme-comment-author-${meme.id}-${comment.id}`}
                            >
                              {comment.author.username}
                            </Text>
                          </Flex>
                          <Text
                            fontStyle="italic"
                            color="gray.500"
                            fontSize="small"
                          >
                            {format(comment.createdAt)}
                          </Text>
                        </Flex>
                        <Text
                          color="gray.500"
                          whiteSpace="pre-line"
                          data-testid={`meme-comment-content-${meme.id}-${comment.id}`}
                        >
                          {comment.content}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </VStack> */}
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
