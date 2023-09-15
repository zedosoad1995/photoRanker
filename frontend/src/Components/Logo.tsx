import { useNavigate } from "react-router-dom";

interface ILogo {
  navigatePath?: string;
}

export default function Logo({ navigatePath }: ILogo) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        if (navigatePath) navigate(navigatePath);
      }}
      className="text-2xl min-[300px]:text-3xl font-oswald font-semibold cursor-pointer flex items-center justify-center"
    >
      PHOTO SCORER
    </div>
  );
}
