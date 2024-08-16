import { IPhotoMode } from "@/Constants/mode";

const MODES: { id: IPhotoMode; title: string }[] = [
  {
    id: "stats",
    title: "Statistics",
  },
  {
    id: "votes",
    title: "Votes",
  },
];

interface IPhotoModeSelect {
  mode: IPhotoMode;
  handleUpdateMode: (mode: IPhotoMode) => void;
}

export const PhotoModeSelect = ({
  mode,
  handleUpdateMode,
}: IPhotoModeSelect) => {
  return (
    <div className="bg-light-contour rounded-lg flex gap-1 p-1 w-full text-sm">
      {MODES.map(({ id, title }) => {
        return (
          <button
            key={id}
            onClick={() => {
              handleUpdateMode(id);
            }}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md ${
              mode === id ? "bg-white font-semibold" : ""
            }`}
            style={{ flex: 1 }}
          >
            <div>{title}</div>
          </button>
        );
      })}
    </div>
  );
};
