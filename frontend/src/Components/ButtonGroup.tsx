interface IButtonGroup {
  options: string[];
  selectedOption: string;
  onClick: (buttonLabel: string) => void;
}

const ButtonGroup = ({ options, onClick, selectedOption }: IButtonGroup) => {
  return (
    <div className="inline-flex rounded-md shadow-sm">
      {options.map((option, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        const isExtremity = isFirst || isLast;

        let rounded = "";
        if (isFirst) {
          rounded = "rounded-l-lg";
        } else if (isLast) {
          rounded = "rounded-r-lg";
        }

        const isSlectedOption = option === selectedOption;

        return (
          <button
            key={option}
            onClick={() => onClick(option)}
            className={`px-4 py-2 text-sm font-medium ${
              isExtremity ? "border" : "border-t border-b"
            } border-gray-900 ${rounded} ${
              isSlectedOption
                ? "bg-primary text-white"
                : "bg-transparent text-gray-900 hover:bg-primary-hover hover:text-white"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
