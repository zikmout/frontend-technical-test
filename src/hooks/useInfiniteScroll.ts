import { useEffect, RefObject } from "react";

type UseInfiniteScrollProps = {
  containerRef: RefObject<HTMLDivElement>;
  onScrollEnd: () => void;
  offset?: number;
};

export const useInfiniteScroll = ({
  containerRef,
  onScrollEnd,
  offset = 10,
}: UseInfiniteScrollProps) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (containerRef.current) {
        clearInterval(intervalId);

        const handleScroll = () => {
          const { scrollTop, scrollHeight, clientHeight } =
            containerRef.current!;
          if (scrollTop + clientHeight >= scrollHeight - offset) {
            onScrollEnd();
          }
        };

        containerRef.current.addEventListener("scroll", handleScroll);

        return () => {
          containerRef.current?.removeEventListener("scroll", handleScroll);
        };
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [containerRef, onScrollEnd, offset]);
};
