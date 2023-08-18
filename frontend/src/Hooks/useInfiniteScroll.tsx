import { useEffect } from "react";

interface IUseInfiniteScroll {
  isLoading?: boolean;
  threshold?: number;
  onUpdate: () => void;
}

function useInfiniteScroll(
  { isLoading, threshold = 300, onUpdate: handleUpdate }: IUseInfiniteScroll,
  deps: any[]
) {
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <
          document.documentElement.scrollHeight - threshold ||
        isLoading
      ) {
        return;
      }

      handleUpdate();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [...deps, isLoading]);
}

export default useInfiniteScroll;
