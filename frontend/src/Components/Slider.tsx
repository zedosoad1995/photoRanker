import { useRef, useEffect } from "react";

interface ISlider {
  min?: number;
  max?: number;
  step?: number;
}

const Slider = ({ min = 18, max = 100, step = 1 }: ISlider) => {
  const isDraggingRef = useRef(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderHandleRef = useRef<HTMLDivElement>(null);

  const moveHandle = (e: React.MouseEvent | MouseEvent) => {
    if (!sliderContainerRef.current || !sliderHandleRef.current) return;

    const containerBounds = sliderContainerRef.current.getBoundingClientRect();
    let newX = e.clientX - containerBounds.left - sliderHandleRef.current.offsetWidth / 2;

    let newValue =
      Math.round(
        (newX / (containerBounds.width - sliderHandleRef.current.offsetWidth)) * (max - min)
      ) + min;

    newValue = Math.round(newValue / step) * step;

    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;

    newX =
      ((newValue - min) / (max - min)) *
      (containerBounds.width - sliderHandleRef.current.offsetWidth);

    sliderHandleRef.current.style.left = newX + "px";
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef) return;

    moveHandle(e);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div onClick={moveHandle} className="relative cursor-pointer" ref={sliderContainerRef}>
      <div className="bg-gray-200 rounded-lg w-full h-1 absolute top-1/2 transform -translate-y-1/2"></div>
      <div
        ref={sliderHandleRef}
        className="w-4 h-4 bg-primary hover:bg-primary-hover rounded-full absolute top-1/2 transform -translate-y-1/2 cursor-pointer"
        style={{ left: "0px" }}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Slider;
