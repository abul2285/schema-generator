import Link from "next/link";
import { useState } from "react";
import {
  PlusCircleIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
} from "@heroicons/react/24/outline";

import { NavItem } from "~/components/Layout/Navigation";
import { api } from "~/utils/api";
import { Head } from "~/components/Layout/Head";

const Predefined = () => {
  const [type, setType] = useState<string>("default");
  return (
    <>
      <Head>
        <NavItem hoverAble onClick={() => setType("default")}>
          <BarsArrowUpIcon className="mr-2 h-6 w-6" />
          Default Schemas
        </NavItem>

        <NavItem hoverAble onClick={() => setType("userDefined")}>
          <BarsArrowDownIcon className="mr-2 h-6 w-6" />
          Your Schemas
        </NavItem>
      </Head>
      <main className="m-4">
        {type === "default" ? <DefaultSchema /> : <UserDefinedSchema />}
      </main>
    </>
  );
};

const DefaultSchema = () => {
  const { data, isLoading } = api.template.getAll.useQuery();
  console.log({ data });

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
  const s = ["Custom-1", "Custom-2", "Custom-3", "Custom-4", "Custom-5"];
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {s.map((schema, idx) => (
        <div key={idx} className="flex justify-between border px-2 py-4">
          {schema}

          <button className="flex border-l pl-2">
            <PlusCircleIcon className="mr-2 h-6 w-6" /> Use
          </button>
        </div>
      ))}
    </div>
  );
};

export default Predefined;
