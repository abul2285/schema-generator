import { useRouter } from "next/router";
import React from "react";
import Board from "~/components/Board/Board";
import { Head } from "~/components/Layout/Head";
import {
  Navigation,
  NavItem,
  NavItemWrapper,
} from "~/components/Layout/Navigation";
import { type FieldType } from "~/types/schema.types";
import { api } from "~/utils/api";
import { generateJSON_LD } from "~/utils/generateJSON_LD";

const SchemaTemplate = () => {
  const { schemaId } = useRouter().query;
  const { data, isLoading } = api.scheme.getById.useQuery(
    { id: schemaId as string },
    {
      enabled: !!schemaId,
    }
  );

  if (isLoading || !data) return <p>Loading...</p>;
  const jsonLD = generateJSON_LD(JSON.parse(data.schema) as FieldType[]);
  return (
    <>
      <Head>
        <NavItem hoverAble>JSON-LD</NavItem>

        <NavItem hoverAble>Structure</NavItem>
      </Head>
      <main className="m-8 h-screen">
        <Board jsonLD={jsonLD} />
      </main>
    </>
  );
};

export default SchemaTemplate;
