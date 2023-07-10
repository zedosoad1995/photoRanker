import { Link as ReactLink } from "react-router-dom";

interface ILink {
  url: string;
  children: React.ReactNode;
}

export default function Link({ url, children }: ILink) {
  return (
    <ReactLink to={url} className="text-sm font-semibold text-primary hover:text-primary-hover">
      {children}
    </ReactLink>
  );
}
