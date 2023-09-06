import { useState, useEffect } from "react";

export const useTimer = (initialTime: number) => {
  const [seconds, setSeconds] = useState(initialTime);

  const resetTimer = () => setSeconds(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev === 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { seconds, resetTimer };
};
