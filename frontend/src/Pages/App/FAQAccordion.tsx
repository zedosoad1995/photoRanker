import { useRef, useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { MdCheckCircleOutline, MdExpandLess, MdExpandMore, MdOutlineCancel } from "react-icons/md";
import { useInView } from "react-intersection-observer";

const FAQ = [
  {
    question: "Is Photo Scorer free?",
    answer:
      "Photo Scorer is 100% free. Additional paid features may be added in the future, but we want to keep the core high quality and free.",
  },
  {
    question: "Why not use a 1-10 scale?",
    answer: (
      <>
        1-10 rating system has many problems:
        <ul className="list-inside mt-1">
          <li>
            <span className="inline-block mr-2 align-middle">
              <IconContext.Provider value={{ color: "#EF4444" }}>
                <MdOutlineCancel />
              </IconContext.Provider>
            </span>
            <b className="font-semibold">Highly subjective</b>: people have different voting styles.
          </li>
          <li>
            <span className="inline-block mr-2 align-middle">
              <IconContext.Provider value={{ color: "#EF4444" }}>
                <MdOutlineCancel />
              </IconContext.Provider>
            </span>
            <b className="font-semibold">Inconsistent</b>: The same person changes their voting
            style regularly.
          </li>
          <li>
            <span className="inline-block mr-2 align-middle">
              <IconContext.Provider value={{ color: "#EF4444" }}>
                <MdOutlineCancel />
              </IconContext.Provider>
            </span>
            <b className="font-semibold">Tedious and slow</b>: Having 10 highly subjective options
            is slow and tiring.
          </li>
        </ul>
        <br />
        With a side-by-side voting system we aim for:
        <ul className="list-inside mt-1">
          <li>
            <span className="inline-block mr-2 align-middle">
              <IconContext.Provider value={{ color: "#0E9F6E" }}>
                <MdCheckCircleOutline />
              </IconContext.Provider>
            </span>
            <b className="font-semibold">Fast and fun voting</b>: choosing the prefered picture is
            much simpler and quick.
          </li>
          <li>
            <span className="inline-block mr-2 align-middle">
              <IconContext.Provider value={{ color: "#0E9F6E" }}>
                <MdCheckCircleOutline />
              </IconContext.Provider>
            </span>
            <b className="font-semibold">Consistency</b>: having a binary choice makes voting
            consistent.
          </li>
          <li>
            <span className="inline-block mr-2 align-middle">
              <IconContext.Provider value={{ color: "#0E9F6E" }}>
                <MdCheckCircleOutline />
              </IconContext.Provider>
            </span>
            <b className="font-semibold">More votes and accuracy</b>: our method allows users to
            give 4 to 20 times more votes. Leading to higher accuracy and a quicker feedback. For
            each click, 2 votes happen: the winner and the loser.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "How to interpret my picture's score?",
    answer: (
      <>
        <div>
          The score tells you how well you compare to others in terms of attractiveness, by giving
          you a percentile.
        </div>
        <br />
        <div>
          For example: Top 10% means that you are in the best 10%, better than 90% of the
          population. Or "Bottom 10%" means you are worse than 90% of the population.
        </div>
        <br />
        <div>
          Try not to take it personally, as many factors like photo quality, facial expression, etc.
          have a high effect. Instead, test multiple pictures to find out which ones people prefer.
        </div>
      </>
    ),
  },
  {
    question: "How are the scores obtained?",
    answer: (
      <>
        <div>
          Our algorithm works similarly to the one used in chess or online gaming to calculate the
          "elo" of each image, but it is optimized for our case. For each match, depending on how
          strong the adversary is, the score is updated. The pictures are then sorted by elo and
          their % score can be inferred.
        </div>
        <br />
        <div>
          We also make sure to match 2 pictures with similar elos. This improves the accuracy,
          allows for a quicker convergence, and avoids big jumps in the score.
        </div>
      </>
    ),
  },
];

export const FAQAccordion = () => {
  const [openItem, setOpenItem] = useState(0);
  const [divHeights, setDivHeights] = useState<number[]>([]);
  const divRefs = useRef<HTMLDivElement[]>([]);

  const { ref: refEl, inView: inViewEl } = useInView({
    threshold: 0.7,
    triggerOnce: true,
  });

  const addDivRef = (el: HTMLDivElement | null) => {
    if (el && !divRefs.current.includes(el)) {
      divRefs.current.push(el);
    }
  };

  const updateDivHeights = () => {
    setDivHeights(divRefs.current.map((div) => div.offsetHeight));
  };

  useEffect(() => {
    updateDivHeights();
    window.addEventListener("resize", updateDivHeights);
    return () => {
      window.removeEventListener("resize", updateDivHeights);
    };
  }, []);

  const handleClick = (index: number) => () => {
    if (openItem === index) {
      setOpenItem(-1);
    } else {
      setOpenItem(index);
    }
  };

  return (
    <div>
      {FAQ.map(({ question, answer }, index) => (
        <div
          key={question}
          onClick={handleClick(index)}
          ref={index === 0 ? refEl : null}
          className={`cursor-pointer border rounded-md p-6 mb-2 ${
            inViewEl ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } transition-all duration-500 ease-in delay-[${index * 300}ms]`}
        >
          <div className="flex justify-between items-center">
            <div className="text-[20px] leading-[20px] font-medium text-[#374048]">{question}</div>
            <IconContext.Provider value={{ color: "#374048", size: "30" }}>
              {openItem === index ? <MdExpandLess /> : <MdExpandMore />}
            </IconContext.Provider>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={`cursor-auto overflow-hidden transition-all ease-in-out duration-500 ${
              openItem === index ? `mt-6` : "mt-0"
            }`}
            style={{
              maxHeight: openItem === index ? divHeights[index] : 0,
            }}
          >
            <div className={`text-[15px] leading-[25px] font-light text-[#82898f]`} ref={addDivRef}>
              {answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
