import {
  MdOutlinePhotoLibrary,
  MdPercent,
  MdSpeed,
  MdOutlineManageAccounts,
  MdTune,
  MdBalance,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { IconContext } from "react-icons";
import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Logo from "@/Components/Logo";
import { useNavigate } from "react-router-dom";
import { LOGIN, REGISTER } from "@/Constants/routes";
import { FAQAccordion } from "./FAQAccordion";
import { Modes } from "./Modes";
import { PhotoStats } from "./PhotoStats";
import { VotingDetails } from "./VotingDetails";
import { Footer } from "@/Components/Footer";

function App() {
  const [showFloatBtn, setShowFloatBtn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const vsRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const handleGoToSignUp = () => navigate(REGISTER);
  const handleGoToLogin = () => navigate(LOGIN);

  const { ref: refHero, inView: inViewHero } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const { ref: refHowItWorks, inView: inViewHowItWorks } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const { ref: refStep1ImgMobile, inView: inViewStep1ImgMobile } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const { ref: refStep1TextMobile, inView: inViewStep1TextMobile } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });
  const { ref: refStep2TextMobile, inView: inViewStep2TextMobile } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });
  const { ref: refStep3TextMobile, inView: inViewStep3TextMobile } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const { ref: refStep2ImgMobile, inView: inViewStep2ImgMobile } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const { ref: refStep3ImgMobile, inView: inViewStep3ImgMobile } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { ref: refStep1Img, inView: inViewStep1Img } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const { ref: refStep2Img, inView: inViewStep2Img } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const { ref: refStep3Img, inView: inViewStep3Img } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const { ref: refFeatures, inView: inViewFeatures } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const { ref: refFeatureEl, inView: inViewFeatureEl } = useInView({
    threshold: 0.7,
    triggerOnce: true,
  });

  const { ref: refFAQ, inView: inViewFAQ } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const { ref: refFunctionality, inView: inViewFunctionality } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 200) {
        if (!showFloatBtn) setShowFloatBtn(true);
      } else {
        if (showFloatBtn) setShowFloatBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showFloatBtn]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
  }, []);

  return (
    <div className="bg-white">
      <button
        onClick={scrollToTop}
        className={`z-50 fixed text-xl rounded-full right-6 bottom-6 bg-[#111827] text-white hover:bg-[#0084FF] transition-all ease-in-out duration-[400ms] w-14 h-14 pb-1 ${
          showFloatBtn ? "opacity-90" : "opacity-0"
        }`}
      >
        ↑
      </button>
      <section
        ref={refHero}
        className={`min-h-[680px] bg-[#F8FBFD] pb-20 ${
          inViewHero ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500 ease-in `}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center w-full px-5 py-6">
            <Logo hideIcon />
            <div className="hidden md:flex gap-3">
              <button
                onClick={handleGoToLogin}
                className="border border-[#111827] hover:bg-[#111827] hover:text-white transition-colors ease-in-out duration-200 text-base py-3 font-medium rounded-[60px] px-7"
              >
                Login
              </button>
              <button
                onClick={handleGoToSignUp}
                className="bg-[#111827] text-base py-3 font-medium text-white rounded-[60px] px-7"
              >
                Sign up
              </button>
            </div>
            <div
              onClick={() => setIsMenuOpen((val) => !val)}
              className="block md:hidden cursor-pointer"
            >
              <IconContext.Provider
                value={{ color: "#111827", className: "text-[32px]" }}
              >
                {isMenuOpen ? <MdClose /> : <MdMenu />}
              </IconContext.Provider>
            </div>
          </div>
          <div
            className={`block md:hidden overflow-hidden px-4 absolute bg-[#F8FBFD] w-full transition-all ease-in-out duration-500 ${
              isMenuOpen ? "max-h-36 py-4" : "max-h-0 py-0"
            }`}
          >
            <div className="max-w-md flex flex-col gap-3 mx-auto">
              <button
                onClick={handleGoToLogin}
                className="w-full border border-[#111827] hover:bg-[#111827] hover:text-white transition-colors ease-in-out duration-200 text-base py-3 font-medium rounded-[60px] px-7"
              >
                Login
              </button>
              <button
                onClick={handleGoToSignUp}
                className="w-full bg-[#111827] text-base py-3 font-medium text-white rounded-[60px] px-7"
              >
                Sign up
              </button>
            </div>
          </div>
          <div className="flex mx-5 sm:mx-[70px] mt-10">
            <div className="w-[100%] my-auto">
              <h1 className="font-semibold text-[#374048 max-[350px]:text-2xl max-[500px]:text-[30px] max-[900px]:text-[35px] max-[900px]:leading-[35px] text-[68px] leading-[68px] mb-2 text-center">
                Find your best photo
              </h1>
              <h2 className="text-[#8a9095] max-[350px]:text-lg max-[500px]:text-xl text-[24px] mb-[40px] text-center">
                Let strangers rate your pictures, in a fun side-by-side
                comparison
              </h2>
              <div className="flex relative justify-center max-[370px]:gap-3 gap-5 mb-[40px]">
                <div className="cursor-pointer rounded-t-md shadow-md w-56">
                  <div className="relative">
                    <div className="rounded-t-md overflow-hidden">
                      <img
                        ref={imgRef}
                        className="mx-auto w-full"
                        src="/dude.webp"
                        alt="male rated 1-10"
                      />
                    </div>
                  </div>
                  <div className="p-3 font-semibold text-[8px] min-[300px]:text-[10px] min-[350px]:text-xs xs:text-sm bg-white rounded-b-md">
                    <div className="flex justify-between">
                      <span>Score:</span> <span>Top 17%</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                      <span>Votes:</span> <span>35</span>
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
                <div className="cursor-pointer rounded-t-md shadow-md w-56">
                  <div className="relative">
                    <div className="rounded-t-md overflow-hidden">
                      <img
                        className="mx-auto w-full"
                        src="/dude2.webp"
                        alt="another male rated 1-10"
                      />
                    </div>
                  </div>
                  <div className="p-3 font-semibold text-[8px] min-[300px]:text-[10px] min-[350px]:text-xs xs:text-sm bg-white rounded-b-md">
                    <div className="flex justify-between">
                      <span>Score:</span> <span>Top 22%</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                      <span>Votes:</span> <span>29</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={handleGoToSignUp}
                  className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-in-out duration-300 max-[500px]:text-lg max-[500px]:py-4 max-[500px]:px-10 text-2xl py-5 font-medium text-white rounded-[60px] px-11"
                >
                  Test your photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-20 md:pt-[104px] pb-[95px] px-5 sm:px-[70px]">
        <div className="max-w-6xl mx-auto">
          <div
            ref={refHowItWorks}
            className={`text-3xl md:text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[75px] ${
              inViewHowItWorks
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            } transition-all duration-500 ease-in`}
          >
            HOW IT WORKS
          </div>
          <div className="flex md:hidden gap-5 flex-col">
            <div
              ref={refStep1ImgMobile}
              className={`bg-[#B2F7D5] rounded-3xl py-8 px-[15%] m-auto ${
                inViewStep1ImgMobile ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in`}
            >
              <div className="rounded-lg overflow-hidden">
                <img src="/upload.webp" alt="upload photo" loading="lazy" />
              </div>
            </div>
            <div
              ref={refStep1TextMobile}
              className={`pl-3 lg:pl-20 my-auto ${
                inViewStep1TextMobile ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in`}
            >
              <div className="text-[#374048] text-2xl font-semibold mb-5">
                1. Upload Photo
              </div>
              <div className="text-[#82898f] text-base font-light mb-5">
                Upload a picture you want to get rated. You can upload multiple
                if you wish.
              </div>
              <button
                onClick={handleGoToSignUp}
                className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-in-out duration-300 text-base py-4 px-8 font-medium text-white rounded-[60px]"
              >
                Upload Photo
              </button>
            </div>
          </div>
          <div className="hidden md:flex gap-5 ">
            <div
              ref={refStep1Img}
              className={`w-1/2 bg-[#B2F7D5] rounded-3xl py-8 px-[15%] m-auto ${
                inViewStep1Img ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in`}
            >
              <div className="rounded-lg overflow-hidden">
                <img src="/upload.webp" alt="upload photo" loading="lazy" />
              </div>
            </div>
            <div className="w-1/2 pl-3 lg:pl-20 my-auto">
              <div
                className={`text-[#374048] text-3xl lg:text-4xl font-semibold mb-5 ${
                  inViewStep1Img ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500 ease-in`}
              >
                1. Upload Photo
              </div>
              <div
                className={`text-[#82898f] text-lg font-light mb-5 ${
                  inViewStep1Img ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500 ease-in`}
              >
                Upload a picture you want to get rated. You can upload multiple
                if you wish.
              </div>
              <button
                onClick={handleGoToSignUp}
                className={`bg-[#0084FF] hover:bg-[#006ACC] max-[500px]:text-lg max-[500px]:py-4 max-[500px]:px-10 text-lg py-[18px] px-[34px] font-medium text-white rounded-[60px] ${
                  inViewStep1Img ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transitionProperty: "background-color, opacity",
                  transitionDuration: "0.3s, 0.5s",
                  transitionTimingFunction: "ease-in-out, ease-in",
                }}
              >
                Upload Photo
              </button>
            </div>
          </div>

          <div className="flex md:hidden gap-5 flex-col mt-20">
            <div
              ref={refStep2ImgMobile}
              className={`bg-[#B2E6F7] rounded-3xl py-8 px-[15%] m-auto ${
                inViewStep2ImgMobile ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in`}
            >
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/side-by-side-click.webp"
                  alt="vote images side by side"
                  loading="lazy"
                />
              </div>
            </div>
            <div
              ref={refStep2TextMobile}
              className={`pl-3 lg:pl-20 my-auto ${
                inViewStep2TextMobile ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in`}
            >
              <div className="text-[#374048] text-2xl font-semibold mb-5">
                2. Receive Votes
              </div>
              <div className="text-[#82898f] text-base font-light mb-5">
                Get rated by strangers based on attractiveness. Our unique
                side-by-side voting system allows for more votes and avoids gray
                areas typical in 1-10 rating.
              </div>
              <button
                onClick={handleGoToSignUp}
                className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-in-out duration-300 text-base py-4 px-8 font-medium text-white rounded-[60px]"
              >
                Start Voting Now
              </button>
            </div>
          </div>

          <div className="hidden md:flex gap-5 mt-[100px]">
            <div className="w-1/2 pr-3 lg:pr-20 my-auto">
              <div
                className={`text-[#374048] text-3xl lg:text-4xl font-semibold mb-5 ${
                  inViewStep2Img ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500 ease-in`}
              >
                2. Receive Votes
              </div>
              <div
                className={`text-[#82898f] text-lg font-light mb-5 ${
                  inViewStep2Img ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500 ease-in`}
              >
                Get rated by strangers based on attractiveness. Our unique
                side-by-side voting system allows for more votes and avoids gray
                areas typical in 1-10 rating.
              </div>
              <button
                onClick={handleGoToSignUp}
                className={`bg-[#0084FF] hover:bg-[#006ACC] max-[500px]:text-lg max-[500px]:py-4 max-[500px]:px-10 text-lg py-[18px] px-[34px] font-medium text-white rounded-[60px] ${
                  inViewStep2Img ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transitionProperty: "background-color, opacity",
                  transitionDuration: "0.3s, 0.5s",
                  transitionTimingFunction: "ease-in-out, ease-in",
                }}
              >
                Start Voting Now
              </button>
            </div>
            <div
              ref={refStep2Img}
              className={`w-1/2 bg-[#B2E6F7] rounded-3xl p-8 m-auto ${
                inViewStep2Img ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in`}
            >
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/side-by-side-click.webp"
                  alt="vote images side by side"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="flex md:hidden gap-5 flex-col mt-20">
            <div
              ref={refStep3ImgMobile}
              className={`bg-[#FFFFB2] rounded-3xl py-8 px-[15%] m-auto ${
                inViewStep3ImgMobile ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in`}
            >
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/score.webp"
                  alt="get rated by attractiveness"
                  loading="lazy"
                />
              </div>
            </div>
            <div
              ref={refStep3TextMobile}
              className={`pl-3 lg:pl-20 my-auto ${
                inViewStep3TextMobile ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in`}
            >
              <div className="text-[#374048] text-2xl font-semibold mb-5">
                3. Get Score
              </div>
              <div className="text-[#82898f] text-base font-light mb-5">
                Discover how does you photo compare to the general population.
              </div>
              <button
                onClick={handleGoToSignUp}
                className="bg-[#0084FF] hover:bg-[#006ACC] transition-colors ease-in-out duration-300 text-base py-4 px-8 font-medium text-white rounded-[60px]"
              >
                Find your rating
              </button>
            </div>
          </div>

          <div className="hidden md:flex gap-5 mt-[100px]">
            <div
              ref={refStep3Img}
              className={`w-1/2 bg-[#FFFFB2] rounded-3xl px-[9%] pt-8 m-auto ${
                inViewStep3Img ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in`}
            >
              <div className="rounded-t-lg overflow-hidden">
                <img
                  src="/score.webp"
                  alt="get rated by attractiveness"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="w-1/2 pl-3 lg:pl-20 my-auto">
              <div
                className={`text-[#374048] text-3xl lg:text-4xl font-semibold mb-5 ${
                  inViewStep3Img ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500 ease-in`}
              >
                3. Get Score
              </div>
              <div
                className={`text-[#82898f] text-lg font-light mb-5 ${
                  inViewStep3Img ? "opacity-100" : "opacity-0"
                } transition-opacity duration-500 ease-in`}
              >
                Discover how does you photo compare to the general population.
              </div>
              <button
                onClick={handleGoToSignUp}
                className={`bg-[#0084FF] hover:bg-[#006ACC] max-[500px]:text-lg max-[500px]:py-4 max-[500px]:px-10 text-lg py-[18px] px-[34px] font-medium text-white rounded-[60px] ${
                  inViewStep3Img ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transitionProperty: "background-color, opacity",
                  transitionDuration: "0.3s, 0.5s",
                  transitionTimingFunction: "ease-in-out, ease-in",
                }}
              >
                Find your rating
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 md:py-[111px] bg-[#F8FBFD] px-5 sm:px-[70px]">
        <div className="mx-auto max-w-4xl">
          <div
            ref={refFunctionality}
            className={`text-3xl md:text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px] ${
              inViewFunctionality
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            } transition-all duration-500 ease-in`}
          >
            FUNCTIONALITIES
          </div>
          <div
            className={`mb-[25px] w-[82px] h-[6px] bg-[#eee] mx-auto ${
              inViewFunctionality
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            } transition-all duration-500 ease-in`}
          />
          <Modes inView={inViewFunctionality} />
          <div className="mb-20" />
          <PhotoStats />
          <div className="mb-20" />
          <VotingDetails />
        </div>
      </section>
      <section className="py-20 md:py-[111px] px-5 sm:px-[70px]">
        <div className="max-w-6xl mx-auto">
          <div
            ref={refFeatures}
            className={`text-3xl md:text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px] ${
              inViewFeatures
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            } transition-all duration-500 ease-in`}
          >
            FEATURES
          </div>
          <div
            className={`mb-[25px] ${
              inViewFeatures
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            } transition-all duration-500 ease-in`}
          >
            <div className="w-[82px] h-[6px] bg-[#eee] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div
              ref={refFeatureEl}
              className={`mt-[60px] md:px-[15px] ${
                inViewFeatureEl ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in`}
            >
              <div className="flex">
                <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                  <IconContext.Provider
                    value={{ color: "#0084ff", className: "text-[36px]" }}
                  >
                    <MdOutlinePhotoLibrary />
                  </IconContext.Provider>
                </div>
                <div>
                  <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                    Many Votes Quickly
                  </div>
                  <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                    Our side-by-side makes voting easy and fun, leading to more
                    votes and greater accuracy.
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`mt-[60px] md:px-[15px] ${
                inViewFeatureEl ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in delay-[300ms]`}
            >
              <div className="flex">
                <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                  <IconContext.Provider
                    value={{ color: "#0084ff", className: "text-[36px]" }}
                  >
                    <MdOutlineManageAccounts />
                  </IconContext.Provider>
                </div>
                <div>
                  <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                    Choose Your Judges
                  </div>
                  <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                    Select the age and gender of your voters for targeted
                    feedback.
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`mt-[60px] md:px-[15px] ${
                inViewFeatureEl ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in delay-[600ms]`}
            >
              <div className="flex">
                <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                  <IconContext.Provider
                    value={{ color: "#0084ff", className: "text-[36px]" }}
                  >
                    <MdSpeed />
                  </IconContext.Provider>
                </div>
                <div>
                  <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                    High Accuracy
                  </div>
                  <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                    Our algorithm is designed for speed and precision,
                    delivering reliable photo rankings quickly.
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`mt-[60px] md:px-[15px] ${
                inViewFeatureEl ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in delay-[900ms]`}
            >
              <div className="flex">
                <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                  <IconContext.Provider
                    value={{ color: "#0084ff", className: "text-[36px]" }}
                  >
                    <MdTune />
                  </IconContext.Provider>
                </div>
                <div>
                  <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                    Vote Your Way
                  </div>
                  <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                    Pick the photos you want to vote based on age and gender
                    preferences.
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`mt-[60px] md:px-[15px] ${
                inViewFeatureEl ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in delay-[1200ms]`}
            >
              <div className="flex">
                <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                  <IconContext.Provider
                    value={{ color: "#0084ff", className: "text-[36px]" }}
                  >
                    <MdBalance />
                  </IconContext.Provider>
                </div>
                <div>
                  <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                    Bias-Free Voting
                  </div>
                  <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                    Binary decisions remove ambiguity, making each vote more
                    meaningful and reliable.
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`mt-[60px] md:px-[15px] ${
                inViewFeatureEl ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in delay-[1500ms]`}
            >
              <div className="flex">
                <div className="w-[70px] min-w-[70px] flex justify-center items-start">
                  <IconContext.Provider
                    value={{ color: "#0084ff", className: "text-[36px]" }}
                  >
                    <MdPercent />
                  </IconContext.Provider>
                </div>
                <div>
                  <div className="text-[#374048] text-[20px] leading-[20px] font-semibold mb-[6px]">
                    Where Do You Rank?
                  </div>
                  <div className="text-[#82898f] text-[14px] leading-[22px] font-light">
                    Find out your photo's numerical rank against others.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-20 bg-[#F8FBFD] md:pt-[98px] pb-[78px] px-5 sm:px-[70px]">
        <div className="max-w-6xl mx-auto">
          <div
            ref={refFAQ}
            className={`text-3xl md:text-[48px] leading-[29px] text-[#374048] font-semibold text-center mb-[25px] ${
              inViewFAQ
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            } transition-all duration-500 ease-in`}
          >
            FAQ
          </div>
          <div
            className={`mb-[75px] ${
              inViewFAQ
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            } transition-all duration-500 ease-in`}
          >
            <div className="text-[#969da3] text-lg md:text-xl text-center leading-8 font-thin mb-5">
              Got more questions? Feel free to send us an email to{" "}
              <a className="text-[#0084ff]">help@photoscorer.com</a>
            </div>
            <div className="w-[82px] h-[6px] bg-[#eee] mx-auto" />
          </div>
          <FAQAccordion />
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default App;
