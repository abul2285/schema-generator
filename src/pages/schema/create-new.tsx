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

const Custom = () => {
  const [validate, setValidate] = useState(false);
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
      <Head />
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
            onClick={() =>
              createTemplate({ name, isCustom: true, schemaId: id })
            }
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
          <div className="mb-2 flex items-center justify-between">
            <input
              defaultValue={name}
              onChange={handleNameChange}
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

export default Custom;
