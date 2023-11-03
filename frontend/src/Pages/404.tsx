import Link from "@/Components/Link";
import { HOME } from "@/Constants/routes";

export const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center flex-col h-full">
      <div className="text-9xl">404</div>
      <div>Page not found</div>
      <div>
        Click <Link url={HOME}>here</Link> to return to the homepage.
      </div>
    </div>
  );
};
