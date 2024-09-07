import React from "react";
type HeadingProps = {
  children: React.ReactNode;
  className?: string;
};

const Heading = ({ children, className }: HeadingProps) => {
  return (
    <h1
      className={`scroll-m-20 text-xl font-extrabold tracking-tight ${className}`}
    >
      {children}
    </h1>
  );
};

export default Heading;
