import { useRef, useState } from "react";

export function useStateRef<T>(initialVal: T) {
  const [state, setState] = useState<T>(initialVal);
  const ref = useRef(initialVal);

  const update = (val: T) => {
    ref.current = val;
    setState(val);
  };

  return [{ state, ref: ref.current }, update] as const;
}
