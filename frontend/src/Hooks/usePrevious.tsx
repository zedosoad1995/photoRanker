import { useRef, useEffect } from "react";

function usePrevious<T>(value: T): T | undefined {
  const refPrev = useRef<T | undefined>();
  const refCurr = useRef<T | undefined>(value);

  useEffect(() => {
    if (refCurr.current === value) return;

    refPrev.current = refCurr.current;
    refCurr.current = value;
  }, [value]);

  return refPrev.current;
}

export default usePrevious;
