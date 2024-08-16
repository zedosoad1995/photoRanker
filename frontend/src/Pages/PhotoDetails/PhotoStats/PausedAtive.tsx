import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";

interface IPauseActive {
  isActive: boolean;
}

export const PauseActive = ({ isActive }: IPauseActive) => {
  const text = isActive ? "ACTIVE" : "PAUSED";
  const Icon = isActive ? PauseIcon : PlayIcon;

  return (
    <>
      <Icon className="h-4 w-4 text-center" />
      <span className="font-semibold text-placeholder-text text-sm leading-none">
        {text}
      </span>
    </>
  );
};
