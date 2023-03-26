import Link from "next/link";
import { useState } from "react";
import {
  BarsArrowUpIcon,
  BarsArrowDownIcon,
} from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import { Card } from "~/components/Card";
import { Head } from "~/components/Layout/Head";
import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";

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
      {data.map((template) => (
        <Card
          key={template.id}
          name={template.name}
          schemaId={template.schemaId}
        />
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
      {data.map((template) => (
        <Card
          key={template.id}
          name={template.name}
          schemaId={template.schemaId}
        />
      ))}
    </div>
  );
};

export default Predefined;
