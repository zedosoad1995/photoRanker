import { useEffect, useRef, useState } from "react";

export const Modes = () => {
  const vsRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [mode, setMode] = useState<"global" | "personal">("personal");

  useEffect(() => {
    const handleResize = () => {
      if (!vsRef.current || !imgRef.current) return;
      vsRef.current.style.top = `${imgRef.current.height / 2}px`;
      vsRef.current.style.width = `${Math.max(
        imgRef.current.width * 0.3,
        50
      )}px`;
      vsRef.current.style.height = `${Math.max(
        imgRef.current.width * 0.3,
        50
      )}px`;
    };

    const imgEl = imgRef.current;

    if (imgEl) {
      if (imgEl.complete) {
        handleResize();
      } else {
        imgEl.addEventListener("load", handleResize);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      imgEl?.removeEventListener("load", handleResize);
    };
  }, [mode]);

  return (
    <section className="py-20 md:py-[111px] px-5 sm:px-[70px] bg-[#F8FBFD]">
      <div
        className={`text-3xl md:text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px]`}
      >
        2 MODES
      </div>
      <div className="mb-[25px] w-[82px] h-[6px] bg-[#eee] mx-auto" />
      <div className="bg-light-contour rounded-lg flex gap-1 p-1 w-full sm:w-fit text-sm mx-auto mb-4">
        <button
          onClick={() => {
            setMode("global");
          }}
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md flex-1 sm:flex-auto ${
            mode === "global" ? "bg-white font-semibold" : ""
          }`}
        >
          <div>Me vs Others</div>
        </button>
        <button
          onClick={() => {
            setMode("personal");
          }}
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md flex-1 sm:flex-auto ${
            mode === "personal" ? "bg-white font-semibold" : ""
          }`}
        >
          <div>Me vs Me</div>
        </button>
      </div>
      {/* <div className="text-[#374048] text-2xl font-semibold mb-2">
        Me vs Others
      </div> */}
      {mode === "global" && (
        <>
          <div className="text-[#82898f] text-base font-light mb-5 text-center">
            See how your photos rank globally by competing against other users’
            images. Find out how you stack up!
          </div>
          <div className="flex gap-3 mb-10 relative justify-center">
            <div className="cursor-pointer rounded-t-md shadow-md w-56">
              <div className="relative">
                <div className="rounded-t-md overflow-hidden">
                  <img
                    ref={imgRef}
                    className="mx-auto w-full"
                    src="/asian_woman.webp"
                    alt="asian woman"
                  />
                </div>
              </div>
              <div className="p-3 font-semibold text-[8px] min-[300px]:text-[10px] min-[350px]:text-xs xs:text-sm bg-white rounded-b-md">
                <div className="flex justify-between">
                  <span>Score:</span> <span>Top 18%</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span>Votes:</span> <span>17</span>
                </div>
              </div>
            </div>
            <div className="cursor-pointer rounded-t-md shadow-md w-56">
              <div className="relative">
                <div className="rounded-t-md overflow-hidden">
                  <img
                    className="mx-auto w-full"
                    src="/black_woman.webp"
                    alt="black woman"
                  />
                </div>
              </div>
              <div className="p-3 font-semibold text-[8px] min-[300px]:text-[10px] min-[350px]:text-xs xs:text-sm bg-white rounded-b-md">
                <div className="flex justify-between">
                  <span>Score:</span> <span>Top 14%</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                  <span>Votes:</span> <span>21</span>
                </div>
              </div>
            </div>
            <div
              className="bg-yellow-300 absolute flex items-center justify-center z-30 rounded-full font-semibold text-xl min-[430px]:text-2xl -translate-y-1/2 shadow-inner"
              style={{
                fontFamily: "'Trebuchet MS', sans-serif",
              }}
              ref={vsRef}
            >
              vs
            </div>
          </div>
        </>
      )}
      {/* <div className="text-[#374048] text-2xl font-semibold mb-2">Me vs Me</div> */}
      {mode === "personal" && (
        <>
          <div className="text-[#82898f] text-base font-light mb-5 text-center">
            Compete only with yourself: find out which of your photos people
            love most, as your images go head-to-head with each other. Just you,
            your photos, and the crowd's choice.
          </div>
          <div className="flex justify-center">
            <img
              className="mx-auto w-full max-w-lg"
              src="/me_vs_me.webp"
              alt="males rated 1-10"
            />
          </div>
        </>
      )}
    </section>
  );
};
