import React from "react";

type TextProps = {
  children: React.ReactNode;
  className?: string;
};

const Text = ({ children, className }: TextProps) => {
  return <p className={`leading-7  ${className}`}>{children}</p>;
};

export default Text;
