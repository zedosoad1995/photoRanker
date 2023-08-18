import { useState, useRef, useEffect } from "react";

type StateObject = {
  [key: string]: any;
};

function useDeferredState<T extends StateObject>(initialValues: T) {
  const [states, setStates] = useState<T>(initialValues);
  const isWaitingAllStates = useRef(false);
  const pendingUpdates = useRef<Array<{ key: keyof T; value: any }>>([]);

  const setState = (key: keyof T, value: any, isDeferred = false) => {
    if (isDeferred) {
      pendingUpdates.current.push({ key, value });

      if (
        isWaitingAllStates.current &&
        pendingUpdates.current.length === Object.keys(initialValues).length
      ) {
        applyUpdates();
        isWaitingAllStates.current = false;
      }
    } else {
      setStates((prevStates) => {
        const newStates = { ...prevStates };
        newStates[key] = value;
        return newStates;
      });
    }
  };

  const applyUpdates = () => {
    if (pendingUpdates.current.length === Object.keys(initialValues).length) {
      setStates((prevStates) => {
        const newStates = { ...prevStates };
        const currentUpdates = [...pendingUpdates.current];
        for (let update of currentUpdates) {
          newStates[update.key] = update.value;
        }
        return newStates;
      });
    } else {
      isWaitingAllStates.current = true;
    }
  };

  useEffect(() => {
    if (pendingUpdates.current.length) {
      pendingUpdates.current = [];
    }
  }, [states]);

  return [states, setState, applyUpdates] as const;
}

export default useDeferredState;
