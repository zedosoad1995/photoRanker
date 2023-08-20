import { useRef, useEffect } from "react";

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

  useEffect(() => {
    setInitialHighlight();
  }, []);

  const setInitialHighlight = () => {
    if (!sliderLeftHandleRef.current || !sliderRightHandleRef.current || !betweenTrailRef.current)
      return;

    const leftHandlePosition = sliderLeftHandleRef.current.offsetLeft;
    const rightHandlePosition = sliderRightHandleRef.current.offsetLeft;

    const highlightWidth = rightHandlePosition - leftHandlePosition;
    betweenTrailRef.current.style.left =
      leftHandlePosition + sliderLeftHandleRef.current.offsetWidth / 2 + "px";
    betweenTrailRef.current.style.width = highlightWidth + "px";
  };

  return (
    <div onClick={handleClickTrack} className="relative cursor-pointer" ref={sliderContainerRef}>
      <div className="bg-gray-200 rounded-lg w-full h-1 absolute top-1/2 transform -translate-y-1/2"></div>
      <div
        ref={betweenTrailRef}
        className="bg-primary-hover rounded-lg w-full h-[6px] absolute top-1/2 transform -translate-y-1/2"
        style={{
          left: "0px",
          width: "opx",
        }}
      ></div>
      <div
        ref={sliderLeftHandleRef}
        className="w-4 h-4 bg-white border border-normal-contour hover:border-primary rounded-full absolute top-1/2 transform -translate-y-1/2 cursor-pointer"
        style={{ left: `${((initialValue[0] - min) / (max - min)) * 100}%` }}
        onMouseDown={handleMouseDown(sliderLeftHandleRef)}
      ></div>
      <div
        ref={sliderRightHandleRef}
        className="w-4 h-4 bg-white border border-normal-contour hover:border-primary rounded-full absolute top-1/2 transform -translate-y-1/2 cursor-pointer"
        style={{ left: `${((initialValue[1] - min) / (max - min)) * 100}%` }}
        onMouseDown={handleMouseDown(sliderRightHandleRef)}
      ></div>
    </div>
  );
};

export default MultipleRangeSlider;
