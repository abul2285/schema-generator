import Link from "next/link";
import { HomeIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

import { Navigation, NavItem, NavItemWrapper } from "../Navigation";

export const Head = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Navigation>
      <NavItemWrapper>
        <Link href="/">
          <NavItem>
            <HomeIcon className="mr-1 h-6 w-6" />
          </NavItem>
        </Link>
        <Link href="/schemas">
          <NavItem hoverAble>
            <Squares2X2Icon className="mr-2 h-6 w-6" />
            Schemas
          </NavItem>
        </Link>
        <div className="flex-1" />
        {children}
      </NavItemWrapper>
    </Navigation>
  );
};
