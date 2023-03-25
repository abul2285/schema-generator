import Link from "next/link";
import { useState } from "react";
import {
  PlusCircleIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
} from "@heroicons/react/24/outline";

import {
  Navigation,
  NavItem,
  NavItemWrapper,
} from "~/components/Layout/Navigation";
import { api } from "~/utils/api";
import { Head } from "~/components/Layout/Head";

const Predefined = () => {
  const [type, setType] = useState<string>("default");
  return (
    <>
      <Head></Head>
      <Navigation submenu>
        <NavItemWrapper>
          <NavItem hoverAble onClick={() => setType("default")}>
            <BarsArrowUpIcon className="mr-2 h-6 w-6" />
            Default Schemas
          </NavItem>

          <NavItem hoverAble onClick={() => setType("userDefined")}>
            <BarsArrowDownIcon className="mr-2 h-6 w-6" />
            Your Schemas
          </NavItem>
          <div className="flex-1" />
          <Link href="/schema/create-new">
            <NavItem hoverAble>
              <BarsArrowDownIcon className="mr-2 h-6 w-6" />
              Create New
            </NavItem>
          </Link>
        </NavItemWrapper>
      </Navigation>
      <main className="m-4">
        {type === "default" ? <DefaultSchema /> : <UserDefinedSchema />}
      </main>
    </>
  );
};

const DefaultSchema = () => {
  const { data, isLoading } = api.template.getAll.useQuery({ isCustom: false });

  if (isLoading) return <p>Loading....</p>;
  if (!data) return <p>Default Template Not Found</p>;
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {data.map((template, idx) => (
        <div key={idx} className="flex justify-between border px-2 py-4">
          {template.name}

          <Link
            className="flex border-l pl-2"
            href={`/schema/view/${template.schemaId}`}
          >
            <PlusCircleIcon className="mr-2 h-6 w-6" /> Use
          </Link>
        </div>
      ))}
    </div>
  );
};

const UserDefinedSchema = () => {
  const { data, isLoading } = api.template.getAll.useQuery({ isCustom: true });

  if (isLoading) return <p>Loading....</p>;
  if (!data) return <p>Default Template Not Found</p>;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {data.map((template, idx) => (
        <div key={idx} className="flex justify-between border px-2 py-4">
          {template.name}

          <Link
            className="flex border-l pl-2"
            href={`/schema/view/${template.schemaId}`}
          >
            <PlusCircleIcon className="mr-2 h-6 w-6" /> Use
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Predefined;
