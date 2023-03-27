import debounce from "lodash/debounce";
import { type ChangeEvent, useMemo, useState } from "react";
import {
  TrashIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import {
  Navigation,
  NavItem,
  NavItemWrapper,
} from "~/components/Layout/Navigation";
import { useSchemaContext } from "~/contexts";
import { Head } from "~/components/Layout/Head";
import { Validate } from "~/components/Validate";
import { RenderSchemaFields } from "~/components/RenderSchemaField";

export const SchemaForm = ({ id }: { id?: string }) => {
  const [validate, setValidate] = useState(false);
  const { name, schema, isLoading, setSchema, handleNameChange } =
    useSchemaContext();

  const { mutate: createTemplate, isLoading: isTemplateCreating } =
    api.template.create.useMutation();

  const handleAddProperty = () => {
    const payload = [...schema, { name: "", value: "" }];
    setSchema(payload);
  };
  const handleAddGroup = () => {
    const payload = [...schema, { name: "", fields: [] }];
    setSchema(payload);
  };

  const handleChange = useMemo(
    () =>
      debounce((event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        handleNameChange({ name: value });
      }, 3000),
    [handleNameChange]
  );

  if (isLoading) return <p>loading...</p>;

  return (
    <>
      <Navigation submenu>
        <NavItemWrapper>
          <NavItem hoverAble onClick={() => setValidate(false)}>
            <PlusCircleIcon className="mr-1 h-6 w-6" />
            Edit Schema
          </NavItem>

          <NavItem hoverAble onClick={() => setValidate(true)}>
            <ShieldCheckIcon className="mr-1 h-6 w-6" />
            Validate Schema
          </NavItem>

          <NavItem
            className="justify-end"
            onClick={() => {
              if (id) {
                createTemplate({ name, isCustom: true, schemaId: id });
              } else {
                alert("No id provided");
              }
            }}
          >
            <CheckCircleIcon className="mr-1 h-6 w-6" />
            Save as template
          </NavItem>
          <NavItem hoverAble className="hover:border-b-transparent">
            <TrashIcon className="mr-1 h-6 w-6" />
            Delete
          </NavItem>
        </NavItemWrapper>
      </Navigation>
      {validate ? (
        <Validate schema={schema} />
      ) : (
        <main className="p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <input
              defaultValue={name}
              onChange={handleChange}
              placeholder="Schema Name"
              className="h-9 w-96 rounded-md border border-sky-900 bg-sky-100 p-2 text-sky-900 "
            />

            <div className="flex space-x-2">
              <button
                onClick={handleAddProperty}
                className="flex self-center rounded-md bg-sky-300 p-2 hover:border-b-transparent"
              >
                <PlusCircleIcon className="mr-1 h-6 w-6" />
                Add Property
              </button>

              <button
                onClick={handleAddGroup}
                className="flex self-center rounded-md bg-sky-300 p-2 hover:border-b-transparent"
              >
                <PlusCircleIcon className="mr-1 h-6 w-6" />
                Add Group
              </button>
            </div>
          </div>
          <RenderSchemaFields fields={schema || []} />
        </main>
      )}
    </>
  );
};
