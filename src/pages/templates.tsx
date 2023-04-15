import Link from "next/link";
import {
  BarsArrowUpIcon,
  BarsArrowDownIcon,
} from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import { Card, CreateNew } from "~/components/Card";
import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { CardLoading } from "~/components/Loading";

const Templates = () => {
  const { query, push } = useRouter();
  const { status } = useSession();
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
            Default Templates
          </NavItem>
          {status === "authenticated" && (
            <NavItem
              hoverAble
              onClick={() => void push({ query: { type: "custom" } })}
            >
              <BarsArrowDownIcon className="mr-2 h-6 w-6" />
              Your Templates
            </NavItem>
          )}

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
  const { data, isLoading } = api.scheme.getDefaultSchemas.useQuery();

  if (isLoading) return <CardLoading />;
  if (!data?.length) return <CreateNew title="No Template Found" />;
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {data.map((schema) => (
        <Card key={schema.id} {...schema} />
      ))}
    </div>
  );
};

const UserDefinedSchema = () => {
  const { data, isLoading } = api.scheme.getCurrentUserSchemas.useQuery({
    templateOnly: true,
  });

  if (isLoading) return <CardLoading />;
  if (!data?.length) return <CreateNew title="No Template Found" />;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {data.map((schema) => (
        <Card key={schema.id} {...schema} />
      ))}
    </div>
  );
};

export default Templates;
