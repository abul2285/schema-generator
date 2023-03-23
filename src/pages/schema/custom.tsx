import Link from "next/link";
import debounce from "lodash/debounce";
import { type ChangeEvent, useMemo } from "react";
import {
  HomeIcon,
  TrashIcon,
  PlusCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";
import { useSchemaContext } from "~/contexts";
import { type FieldType } from "~/types/schema.types";
import { RenderSchemaFields } from "~/components/RenderSchemaField";

const Custom = () => {
  const { name, schema, isLoading, setSchema, id } = useSchemaContext();
  const { mutate: createSchema } = api.scheme.create.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("schemaId", data?.id || "");
    },
  });

  const { mutate: updateSchema } = api.scheme.updateSchema.useMutation();

  const handleBackgroundSave = useMemo(
    () =>
      debounce((name: string, schema: FieldType[]) => {
        createSchema({ name, schema: JSON.stringify(schema) });
      }, 1000),
    [createSchema]
  );

  const handleAddProperty = () => {
    const payload = [...schema, { name: "", value: "" }];
    setSchema(payload);
  };
  const handleAddGroup = () => {
    const payload = [...schema, { name: "", fields: [] }];
    setSchema(payload);
  };

  const handleNameChange = useMemo(
    () =>
      debounce((event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const payload = { name: value, schema: JSON.stringify(schema) };
        if (id) {
          return updateSchema({ ...payload, id });
        }
        createSchema(payload);
      }, 3000),
    [createSchema, id, schema, updateSchema]
  );

  if (isLoading) return <p>loading...</p>;

  return (
    <>
      <Navigation>
        <NavItemWrapper>
          <Link href="/">
            <NavItem hoverAble>
              <HomeIcon className="mr-1 h-6 w-6" />
              Back To Home
            </NavItem>
          </Link>
          <NavItem hoverAble>
            <PlusCircleIcon className="mr-1 h-6 w-6" />
            Edit Schema
          </NavItem>
          <NavItem hoverAble>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mr-1 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            Validate Schema
          </NavItem>
        </NavItemWrapper>
      </Navigation>
      <main>
        <div className="flex items-center justify-between bg-sky-300 px-4">
          <input
            defaultValue={name}
            onChange={handleNameChange}
            placeholder="Schema Name"
            className="h-9 w-96 rounded-md border p-2 text-gray-700 "
          />
          <NavItemWrapper>
            <NavItem
              onClick={handleAddProperty}
              className="hover:border-b-transparent"
            >
              <PlusCircleIcon className="mr-1 h-6 w-6" />
              Add Property
            </NavItem>
            <NavItem
              onClick={handleAddGroup}
              className="hover:border-b-transparent"
            >
              <PlusCircleIcon className="mr-1 h-6 w-6" />
              Add Group
            </NavItem>
            <NavItem
              className="flex-1 justify-end"
              onClick={() => handleBackgroundSave(name, schema)}
            >
              <CheckCircleIcon className="mr-1 h-6 w-6" />
              Save
            </NavItem>
            <NavItem className="hover:border-b-transparent">
              <TrashIcon className="mr-1 h-6 w-6" />
              Delete
            </NavItem>
          </NavItemWrapper>
        </div>
        <RenderSchemaFields fields={schema || []} />
      </main>
    </>
  );
};

export default Custom;
