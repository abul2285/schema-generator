import Link from "next/link";
import debounce from "lodash/debounce";
import { type ChangeEvent, useMemo } from "react";
import {
  TrashIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import { NavItem, NavItemWrapper } from "~/components/Layout/Navigation";
import { useSchemaContext } from "~/contexts";
import { RenderSchemaFields } from "~/components/RenderSchemaField";
import { Head } from "~/components/Layout/Head";

const Custom = () => {
  const { name, schema, isLoading, setSchema, id } = useSchemaContext();
  const { mutate: createSchema } = api.scheme.create.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("schemaId", data?.id || "");
    },
  });

  const { mutate: createTemplate, isLoading: isTemplateCreating } =
    api.template.create.useMutation();

  const { mutate: updateSchema } = api.scheme.updateSchema.useMutation();

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
      <Head>
        <Link href="/schema/custom">
          <NavItem hoverAble>
            <PlusCircleIcon className="mr-1 h-6 w-6" />
            Edit Schema
          </NavItem>
        </Link>
        <Link href="/schema/validation">
          <NavItem hoverAble>
            <ShieldCheckIcon className="mr-1 h-6 w-6" />
            Validate Schema
          </NavItem>
        </Link>
      </Head>
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
              className="justify-end"
              onClick={() =>
                createTemplate({ name, isCustom: true, schemaId: id })
              }
            >
              <CheckCircleIcon className="mr-1 h-6 w-6" />
              Save as template
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
