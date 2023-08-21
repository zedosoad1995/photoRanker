import { useRef, useEffect, useState } from "react";

interface IMultipleRangeSlider {
  initialValue: [number, number];
  onChange: (leftVal: number, rightVal: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const MultipleRangeSlider = ({
  initialValue,
  onChange: handleChange,
  min = 0,
  max = 100,
  step = 1,
}: IMultipleRangeSlider) => {
  const isDraggingRef = useRef(false);
  const activeHandler = useRef<React.RefObject<HTMLDivElement> | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderLeftHandleRef = useRef<HTMLDivElement>(null);
  const sliderRightHandleRef = useRef<HTMLDivElement>(null);
  const leftValueRef = useRef(initialValue[0]);
  const rightValueRef = useRef(initialValue[1]);
  const betweenTrailRef = useRef<HTMLDivElement>(null);

  const [initialLeft, setInitialLeft] = useState("");
  const [initialRight, setInitialRight] = useState("");
  const [highlightLeft, setHighlightLeft] = useState("");
  const [highlightWidth, setHighlightWidth] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const moveHandle = (
    e: React.MouseEvent | MouseEvent,
    handleRef: React.RefObject<HTMLDivElement>
  ) => {
    if (
      !sliderContainerRef.current ||
      !handleRef.current ||
      !sliderLeftHandleRef.current ||
      !sliderRightHandleRef.current ||
      !betweenTrailRef.current
    )
      return;

    const containerBounds = sliderContainerRef.current.getBoundingClientRect();
    let newX = e.clientX - containerBounds.left - handleRef.current.offsetWidth / 2;

    if (handleRef === sliderLeftHandleRef && sliderRightHandleRef.current) {
      const rightHandleRightPosition =
        sliderRightHandleRef.current.offsetLeft + sliderRightHandleRef.current.offsetWidth;
      if (newX + handleRef.current.offsetWidth > rightHandleRightPosition) {
        newX = rightHandleRightPosition - handleRef.current.offsetWidth;
      }
    }

    if (handleRef === sliderRightHandleRef && sliderLeftHandleRef.current) {
      const leftHandleLeftPosition = sliderLeftHandleRef.current.offsetLeft;
      if (newX < leftHandleLeftPosition) {
        newX = leftHandleLeftPosition;
      }
    }

    let newValue =
      Math.round((newX / (containerBounds.width - handleRef.current.offsetWidth)) * (max - min)) +
      min;

    newValue = Math.round(newValue / step) * step;

    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;

    if (handleRef === sliderLeftHandleRef) {
      if (newValue !== leftValueRef.current) handleChange(newValue, rightValueRef.current);
      leftValueRef.current = newValue;
    } else {
      if (newValue !== rightValueRef.current) handleChange(leftValueRef.current, newValue);
      rightValueRef.current = newValue;
    }

    newX =
      ((newValue - min) / (max - min)) * (containerBounds.width - handleRef.current.offsetWidth);

    handleRef.current.style.left = newX + "px";

    const leftHandlePos = sliderLeftHandleRef.current.offsetLeft;
    const rightHandlePos = sliderRightHandleRef.current.offsetLeft;

    betweenTrailRef.current.style.left =
      leftHandlePos + sliderLeftHandleRef.current.offsetWidth / 2 + "px";
    betweenTrailRef.current.style.width = rightHandlePos - leftHandlePos + "px";
  };

  const handleMouseDown = (handleRef: React.RefObject<HTMLDivElement>) => (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    activeHandler.current = handleRef;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !activeHandler.current) return;

    moveHandle(e, activeHandler.current);
  };

  const handleClickTrack = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!sliderLeftHandleRef.current || !sliderRightHandleRef.current) return;

    const rectLeft = sliderLeftHandleRef.current.getBoundingClientRect();
    const centerLeftX = rectLeft.left + rectLeft.width / 2;

    const rectRight = sliderRightHandleRef.current.getBoundingClientRect();
    const centerRightX = rectRight.left + rectRight.width / 2;

    if (Math.abs(e.clientX - centerLeftX) < Math.abs(e.clientX - centerRightX)) {
      activeHandler.current = sliderLeftHandleRef;
    } else {
      activeHandler.current = sliderRightHandleRef;
    }

    moveHandle(e, activeHandler.current);
    activeHandler.current = null;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    activeHandler.current = null;
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const computePosition = (val: number, ref: React.RefObject<HTMLDivElement>) => {
    if (!sliderContainerRef.current || !ref.current) return 0;

    const containerWidth =
      sliderContainerRef.current.getBoundingClientRect().width - ref.current.offsetWidth;
    const position = ((val - min) / (max - min)) * containerWidth;
    return position;
  };

  const computeHighlighter = (left: number, right: number) => {
    if (!sliderContainerRef.current || !sliderLeftHandleRef.current) return ["0", "0"];

    const containerWidth =
      sliderContainerRef.current.getBoundingClientRect().width -
      sliderLeftHandleRef.current.offsetWidth;

    const positionLeft =
      ((left - min) / (max - min)) * containerWidth + sliderLeftHandleRef.current.offsetWidth / 2;
    const width =
      ((right - left) / (max - min)) * containerWidth + sliderLeftHandleRef.current.offsetWidth / 2;

    return [positionLeft + "px", width + "px"];
  };

  useEffect(() => {
    const [left, width] = computeHighlighter(initialValue[0], initialValue[1]);
    setHighlightLeft(left);
    setHighlightWidth(width);
    setInitialLeft(computePosition(initialValue[0], sliderLeftHandleRef) + "px");
    setInitialRight(computePosition(initialValue[1], sliderRightHandleRef) + "px");
  }, []);

  useEffect(() => {
    if (
      highlightLeft.length &&
      highlightWidth.length &&
      initialLeft.length &&
      initialRight.length
    ) {
      setIsInitialized(true);
    }
  }, [highlightLeft, highlightWidth, initialLeft, initialRight]);

  useEffect(() => {
    const updateHandlePositions = () => {
      const [left, width] = computeHighlighter(leftValueRef.current, rightValueRef.current);
      setHighlightLeft(left);
      setHighlightWidth(width);
      setInitialLeft(computePosition(leftValueRef.current, sliderLeftHandleRef) + "px");
      setInitialRight(computePosition(rightValueRef.current, sliderRightHandleRef) + "px");
    };

    window.addEventListener("resize", updateHandlePositions);

    return () => {
      window.removeEventListener("resize", updateHandlePositions);
    };
  }, []);

  const areBothMax = leftValueRef.current === rightValueRef.current && leftValueRef.current === max;

  return (
    <div
      onClick={handleClickTrack}
      className={`relative cursor-pointer w-full h-5 ${isInitialized ? "visible" : "invisible"}`}
      ref={sliderContainerRef}
    >
      <div className="bg-gray-200 rounded-lg w-full h-1 absolute top-1/2 -translate-y-1/2"></div>
      <div
        ref={betweenTrailRef}
        className="bg-primary-hover rounded-lg w-full h-[6px] absolute top-1/2 -translate-y-1/2"
        style={{
          left: highlightLeft,
          width: highlightWidth,
        }}
      ></div>
      <div
        ref={sliderLeftHandleRef}
        className={`w-4 h-4 bg-white border border-normal-contour hover:border-primary rounded-full absolute top-1/2 -translate-y-1/2 cursor-pointer ${
          areBothMax ? "z-10" : ""
        }`}
        style={{ left: initialLeft }}
        onMouseDown={handleMouseDown(sliderLeftHandleRef)}
      ></div>
      <div
        ref={sliderRightHandleRef}
        className="w-4 h-4 bg-white border border-normal-contour hover:border-primary rounded-full absolute top-1/2 -translate-y-1/2 cursor-pointer"
        style={{ left: initialRight }}
        onMouseDown={handleMouseDown(sliderRightHandleRef)}
      ></div>
    </div>
  );
};

export default MultipleRangeSlider;
