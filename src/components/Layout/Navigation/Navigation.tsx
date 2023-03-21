import React from "react";

export const Navigation = ({ children }: { children: React.ReactNode }) => {
  return <nav className="bg-slate-200 px-12">{children}</nav>;
};

export const NavItemWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ul className="flex space-x-8">{children}</ul>;
};

export const NavItem = ({
  onClick,
  children,
  className = "",
  hoverAble = false,
}: {
  className?: string;
  hoverAble?: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
}) => {
  const hoverStyle = hoverAble
    ? "border-b-2 hover:border-b-2 hover:border-b-orange-900"
    : "";
  return (
    <li
      onClick={onClick}
      className={`flex cursor-pointer space-y-4 py-4 ${hoverStyle} ${className}`}
    >
      {children}
    </li>
  );
};
