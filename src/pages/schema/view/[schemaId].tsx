import { useRouter } from "next/router";

import { api } from "~/utils/api";
import Board from "~/components/Board/Board";
import { type FieldType } from "~/types/schema.types";
import { generateJSON_LD } from "~/utils/generateJSON_LD";
import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";

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
      <Navigation submenu>
        <NavItemWrapper>
          <NavItem hoverAble>JSON-LD</NavItem>

          <NavItem hoverAble>Structure</NavItem>
        </NavItemWrapper>
      </Navigation>
      <main className="m-8 h-screen">
        <Board jsonLD={jsonLD} />
      </main>
    </>
  );
};

export default SchemaTemplate;
