import { VStack, Collapse } from "@chakra-ui/react";
import { MemeComment } from "./meme-comment";
import { CommentForm } from "./comment-form";
import { LoadMoreButton } from "./load-more-button";

interface MemeCommentSectionProps {
  memeId: string;
  comments: {
    id: string;
    author?: { username: string; pictureUrl: string };
    content: string;
    createdAt: string;
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
      <CommentForm
        memeId={memeId}
        commentContent={commentContent}
        handleSubmit={handleSubmit}
        handleCommentChange={handleCommentChange}
      />

      <VStack align="stretch" spacing={4}>
        {comments.map(({ id, author, content, createdAt }) => (
          <MemeComment
            key={id}
            author={author}
            content={content}
            createdAt={createdAt}
          />
        ))}

        <LoadMoreButton loadMore={loadMoreComments} />
      </VStack>
    </Collapse>
  );
};
