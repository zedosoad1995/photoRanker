import NextLink from "next/link";

interface ILink {
  url: string;
  children: React.ReactNode;
}

export default function Link({ url, children }: ILink) {
  return (
    <NextLink
      href={url}
      className="text-sm font-semibold text-primary hover:text-primary-hover"
    >
      {children}
    </NextLink>
  );
}
