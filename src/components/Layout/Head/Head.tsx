import Link from "next/link";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import {
  HomeIcon,
  Squares2X2Icon,
  CommandLineIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { Navigation, NavItem, NavItemWrapper } from "../Navigation";

export const Head = () => {
  const { data: session } = useSession();

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
        <Link href="/schema/jsonld-to-schema">
          <NavItem hoverAble>
            <CommandLineIcon className="mr-2 h-6 w-6" />
            JSON-LD to Schema
          </NavItem>
        </Link>
        <div className="flex-1" />

        {session ? (
          <NavItem className="group/avatar">
            <div className="relative inline-block">
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                <Image
                  width={32}
                  height={32}
                  className="mr-2 rounded-full"
                  src={session.user.image as string}
                  alt="Avatar"
                />
                <span className="text-sm font-medium">{session.user.name}</span>
                <ChevronDownIcon className="h-5 w-5" />
              </button>
              <div className="absolute right-0 z-10 mt-4 hidden w-48 rounded-lg bg-white shadow-lg group-hover/avatar:block">
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Settings
                </a>
                <hr className="my-2" />
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </a>
              </div>
            </div>
          </NavItem>
        ) : (
          <NavItem hoverAble onClick={() => void signIn()}>
            <ArrowRightOnRectangleIcon className="mr-2 h-6 w-6" />
            Login
          </NavItem>
        )}
      </NavItemWrapper>
    </Navigation>
  );
};
