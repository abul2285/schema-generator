import Link from "next/link";
import {
  BarsArrowUpIcon,
  BarsArrowDownIcon,
} from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import { Card } from "~/components/Card";
import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";
import { useRouter } from "next/router";

const Schemas = () => {
  const { query, push } = useRouter();
  const { type } = query;

  return (
    <>
      <Navigation submenu>
        <NavItemWrapper>
          <NavItem
            hoverAble
            onClick={() => void push({ query: { type: "default" } })}
          >
            <BarsArrowUpIcon className="mr-2 h-6 w-6" />
            Default Schemas
          </NavItem>

          <NavItem
            hoverAble
            onClick={() => void push({ query: { type: "custom" } })}
          >
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
        {type === "custom" ? <UserDefinedSchema /> : <DefaultSchema />}
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
          id={template.id}
          name={template.name}
          schemaId={template.schemaId}
          isCustom={!!template.isCustom}
          schema={template.schemaTemplate.schema}
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
          id={template.id}
          key={template.id}
          name={template.name}
          schemaId={template.schemaId}
          isCustom={!!template.isCustom}
          schema={template.schemaTemplate.schema}
        />
      ))}
    </div>
  );
};

export default Schemas;
