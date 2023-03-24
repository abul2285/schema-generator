import {
  HomeIcon,
  Squares2X2Icon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
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
        <Link href="/schema/predefined">
          <NavItem hoverAble>
            <Squares2X2Icon className="mr-2 h-6 w-6" />
            Predefined Templates
          </NavItem>
        </Link>
        <Link href="/schema/custom">
          <NavItem hoverAble>
            <SquaresPlusIcon className="mr-2 h-6 w-6" />
            Custom Template
          </NavItem>
        </Link>
        <div className="flex-1" />
        {children}
      </NavItemWrapper>
    </Navigation>
  );
};
