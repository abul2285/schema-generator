import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";

import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";

const Predefined = () => {
  return (
    <Navigation>
      <NavItemWrapper>
        <Link href="/">
          <NavItem hoverAble>
            <HomeIcon className="mr-1 h-6 w-6" />
            Back To Home
          </NavItem>
        </Link>
        <Link href="/schema/custom">
          <NavItem hoverAble>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-1 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Custom Template
          </NavItem>
        </Link>
      </NavItemWrapper>
    </Navigation>
  );
};

export default Predefined;
