import { useState, useEffect } from "react";

export const useWidth = () => {
  const [clientWidth, setClientWidth] = useState(
    document.documentElement.clientWidth
  );

  useEffect(() => {
    const handleResize = () =>
      setClientWidth(document.documentElement.clientWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width: clientWidth };
};
