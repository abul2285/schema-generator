export const Navigation = ({
  children,
  submenu = false,
}: {
  submenu?: boolean;
  children: React.ReactNode;
}) => {
  const bg = submenu ? "bg-sky-300" : "bg-slate-200";
  return <nav className={`group px-12 ${bg}`}>{children}</nav>;
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
    ? "border-b-2 border-b-transparent hover:border-b-2 hover:border-b-orange-900"
    : "";
  return (
    <li
      onClick={onClick}
      className={`flex cursor-pointer space-y-4 py-4 group-[.bg-sky-300]:py-3 ${hoverStyle} ${className}`}
    >
      {children}
    </li>
  );
};
