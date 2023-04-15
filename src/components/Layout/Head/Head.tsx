import Link from "next/link";
import Image from "next/image";
import { signIn, useSession, signOut } from "next-auth/react";
import {
  HomeIcon,
  Squares2X2Icon,
  CommandLineIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  Bars4Icon,
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

        <div className="group/menu flex cursor-pointer space-y-4 py-4 md:hidden">
          <div className="relative">
            <button className="flex items-center text-gray-700 hover:text-gray-900">
              <Bars4Icon className="h-6 w-6" />
            </button>
            <div className="absolute z-10 mt-5 hidden w-48 rounded-lg bg-white shadow-lg group-hover/menu:block">
              <Link
                href="/templates"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                <NavItem>
                  <Squares2X2Icon className="mr-2 h-6 w-6" />
                  Templates
                </NavItem>
              </Link>
              {session?.user.role === "ADMIN" && (
                <Link
                  href="/schema/jsonld-to-schema"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  <NavItem>
                    <CommandLineIcon className="mr-2 h-6 w-6" />
                    JSON-LD to Schema
                  </NavItem>
                </Link>
              )}
            </div>
          </div>
        </div>

        <Link href="/templates" className="hidden md:block">
          <NavItem hoverAble>
            <Squares2X2Icon className="mr-2 h-6 w-6" />
            Templates
          </NavItem>
        </Link>
        {session?.user.role === "ADMIN" && (
          <Link href="/schema/jsonld-to-schema" className="hidden md:block">
            <NavItem hoverAble>
              <CommandLineIcon className="mr-2 h-6 w-6" />
              JSON-LD to Schema
            </NavItem>
          </Link>
        )}
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
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Settings
                </Link>
                <hr className="my-2" />
                <button
                  onClick={() => void signOut()}
                  className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </button>
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
