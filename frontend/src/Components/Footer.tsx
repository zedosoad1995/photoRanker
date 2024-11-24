import { PRIVACY, TERMS } from "@/Constants/routes";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  const handleGoToTerms = () => {
    navigate(TERMS);
    window.scrollTo(0, 0);
  };
  const handleGoToPrivacy = () => {
    navigate(PRIVACY);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#111827] py-6 px-8">
      <a
        className="text-white pr-8 cursor-pointer hover:underline"
        onClick={handleGoToTerms}
      >
        Terms of Service
      </a>
      <a
        className="text-white cursor-pointer hover:underline"
        onClick={handleGoToPrivacy}
      >
        Privacy Policy
      </a>
    </div>
  );
};
