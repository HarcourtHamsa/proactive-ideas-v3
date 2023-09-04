import React from "react";
import { Link } from "react-router-dom";

function CustomLink({
  href,
  children,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link to={href} {...rest}>
      {children}
    </Link>
  );
}

export default CustomLink;
