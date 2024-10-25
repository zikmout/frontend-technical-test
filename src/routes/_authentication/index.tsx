// import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Flex, Icon, StackDivider, Text, VStack } from "@chakra-ui/react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import {
  getMemeComments,
  GetMemeCommentsResponse,
  getMemes,
  GetMemesResponse,
  getUserById,
} from "../../api";
import { MemeHeader } from "../../components/meme-header";
import { MemeContent } from "../../components/meme-content";
import { MemeCommentSection } from "../../components/meme-comment-section";
import { useAuthToken } from "../../contexts/authentication";
import { Loader } from "../../components/loader";
import { useState, useEffect, useCallback, useRef } from "react";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
// import { jwtDecode } from "jwt-decode";

export const MemeFeedPage: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [memes, setMemes] = useState<GetMemesResponse["results"]>([]);
  const [memeComments, setMemeComments] = useState<{
    [key: string]: {
      comments: GetMemeCommentsResponse["results"];
      currentPage: number;
    };
  }>({});

  const [openedCommentSection, setOpenedCommentSection] = useState<
    string | null
  >(null);
  const [commentContent, setCommentContent] = useState<{
    [key: string]: string;
  }>({});
  const token = useAuthToken();

  const loadNextPage = () => setPage((prevPage) => prevPage + 1);

  useInfiniteScroll({
    containerRef: scrollContainerRef,
    onScrollEnd: loadNextPage,
    offset: 10,
  });

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
    async (memeId: string, page: number = 1) => {
      const commentsResponse = await getMemeComments(token, memeId, page);
      const commentsWithAuthors = await Promise.all(
        commentsResponse.results.map(async (comment) => {
          const author = await getUserById(token, comment.authorId);
          return { ...comment, author };
        })
      );

      setMemeComments((prev) => ({
        ...prev,
        [memeId]: {
          comments: [...(prev[memeId]?.comments || []), ...commentsWithAuthors],
          currentPage: page,
        },
      }));
    },
    [token]
  );

  // const { data: user } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: async () => {
  //     return await getUserById(token, jwtDecode<{ id: string }>(token).id);
  //   },
  // });

  const handleCommentSectionToggle = (memeId: string) => {
    const isOpening = openedCommentSection !== memeId;
    setOpenedCommentSection(isOpening ? memeId : null);

    if (isOpening && !memeComments[memeId]) {
      fetchComments(memeId, 1);
    }
  };

  const loadMoreComments = (memeId: string) => {
    const currentPage = memeComments[memeId]?.currentPage || 1;
    fetchComments(memeId, currentPage + 1);
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
        {memes?.map((meme) => (
          <VStack key={meme.id} p={4} width="full" align="stretch">
            <MemeHeader author={meme.author} createdAt={meme.createdAt} />
            <MemeContent
              pictureUrl={meme.pictureUrl}
              texts={meme.texts}
              description={meme.description}
              memeId={meme.id}
            />
            <Flex
              alignItems="center"
              onClick={() => handleCommentSectionToggle(meme.id)}
            >
              <Text>{meme.commentsCount} comments</Text>
              <Icon
                as={openedCommentSection === meme.id ? CaretUp : CaretDown}
                ml={2}
                mt={1}
              />
            </Flex>
            <MemeCommentSection
              memeId={meme.id}
              comments={memeComments[meme.id]?.comments || []}
              commentContent={commentContent[meme.id] || ""}
              handleCommentChange={(memeId, content) =>
                setCommentContent((prev) => ({ ...prev, [memeId]: content }))
              }
              handleSubmit={(e, memeId) => {
                e.preventDefault();
                if (commentContent[memeId]) {
                  // TODO : Fix in next part of the exercise
                  // mutate({
                  //   memeId: meme.id,
                  //   content: commentContent[meme.id],
                  // });
                }
              }}
              loadMoreComments={() => loadMoreComments(meme.id)}
              isOpen={openedCommentSection === meme.id}
            />
          </VStack>
        ))}
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute("/_authentication/")({
  component: MemeFeedPage,
});
