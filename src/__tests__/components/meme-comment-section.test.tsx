import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemeCommentSection } from "../../components/meme-comment-section";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticationContext } from "../../contexts/authentication";

describe("MemeCommentSection", () => {
  function renderWithProviders(ui: React.ReactElement) {
    return render(
      <ChakraProvider>
        <QueryClientProvider client={new QueryClient()}>
          <AuthenticationContext.Provider
            value={{
              state: {
                isAuthenticated: true,
                userId: "dummy_user_id",
                token: "dummy_token",
              },
              authenticate: () => {},
              signout: () => {},
            }}
          >
            {ui}
          </AuthenticationContext.Provider>
        </QueryClientProvider>
      </ChakraProvider>
    );
  }

  it("renders the comment form and comments", () => {
    const handleSubmit = vi.fn();
    const handleCommentChange = vi.fn();
    const loadMoreComments = vi.fn();
    const comments = [
      {
        id: "1",
        author: { username: "User1", pictureUrl: "/user1.png" },
        content: "First comment",
        createdAt: "2024-10-25T13:02:45.52",
      },
    ];

    renderWithProviders(
      <MemeCommentSection
        memeId="meme123"
        comments={comments}
        commentContent="New comment"
        handleSubmit={handleSubmit}
        handleCommentChange={handleCommentChange}
        loadMoreComments={loadMoreComments}
        isOpen={true}
      />
    );

    // Check if comment input is displayed
    expect(
      screen.getByPlaceholderText("Type your comment here...")
    ).toBeInTheDocument();

    // Check if the comments are displayed
    expect(screen.getByText("First comment")).toBeInTheDocument();
    expect(screen.getByText("User1")).toBeInTheDocument();
  });
});
