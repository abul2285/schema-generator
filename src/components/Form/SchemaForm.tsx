import { useRouter } from "next/router";
import { type ChangeEvent, useState, useEffect } from "react";
import {
  TrashIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import { useSchemaContext } from "~/contexts";
import { Validate } from "~/components/Validate";
import { api, type RouterOutputs } from "~/utils/api";
import { RenderSchemaFields } from "~/components/RenderSchemaField";
import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";

const loadInitialData = (data: RouterOutputs["scheme"]["getById"]) => {
  return { name: data?.name || "", description: data?.description || "" };
};

export const SchemaForm = ({ id }: { id?: string }) => {
  const [validate, setValidate] = useState(false);
  const router = useRouter();
  const { data, schema, isLoading, setSchema } = useSchemaContext();
  const [{ name, description }, setSchemaDetails] = useState<{
    name: string;
    description: string;
  }>(() => loadInitialData(data));

  const { data: template, refetch } = api.template.getBySchemaId.useQuery({
    schemaId: id || "",
  });

  console.log({ name, description, template });

  const { mutate: createTemplate, isLoading: isTemplateCreating } =
    api.template.create.useMutation({
      onSuccess: (data) => {
        if (data) {
          void refetch();
          handleSaveOrUpdate();
        }
      },
    });
  const { mutate: updateTemplate, isLoading: isTemplateUpdating } =
    api.template.update.useMutation({
      onSuccess: (data) => {
        if (data) {
          handleSaveOrUpdate();
        }
      },
    });

  const { mutate: createSchema } = api.scheme.create.useMutation({
    onSuccess: (data) => {
      if (!data) return;
      void router.push(`/schema/${data.id}`);
    },
  });

  const { mutate: updateSchema } = api.scheme.updateSchema.useMutation();

  const handleAddProperty = () => {
    const payload = [...schema, { name: "", value: "" }];
    setSchema(payload);
  };
  const handleAddGroup = () => {
    const payload = [...schema, { name: "", fields: [] }];
    setSchema(payload);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.target;
    setSchemaDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveOrUpdate = () => {
    const payload: {
      name: string;
      schema: string;
      isCustom: boolean;
      description: string;
    } = {
      name,
      description,
      isCustom: true,
      schema: JSON.stringify(schema),
    };
    if (id) {
      updateSchema({
        id,
        ...payload,
      });
    } else {
      createSchema(payload);
    }
  };

  useEffect(() => {
    setSchemaDetails(loadInitialData(data));
  }, [data, id]);

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

          <NavItem className="justify-end" onClick={handleSaveOrUpdate}>
            <CheckCircleIcon className="mr-1 h-6 w-6" />
            Save
          </NavItem>
          <NavItem hoverAble className="hover:border-b-transparent">
            <TrashIcon className="mr-1 h-6 w-6" />
            Delete
          </NavItem>
          {id && (
            <>
              <div className="flex-1" />
              <NavItem
                className="justify-end"
                onClick={() => {
                  if (template?.id) {
                    updateTemplate({ id: template.id, name });
                  } else {
                    createTemplate({ name, isCustom: true, schemaId: id });
                  }
                }}
              >
                <CheckCircleIcon className="mr-1 h-6 w-6" />
                Save as template
              </NavItem>
            </>
          )}
        </NavItemWrapper>
      </Navigation>
      {validate ? (
        <Validate schema={schema} />
      ) : (
        <main className="p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <input
              name="name"
              value={name}
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
          <textarea
            value={description}
            name="description"
            onChange={handleChange}
            placeholder="Description"
            className="h-24 w-full rounded-md border border-sky-900 bg-sky-100 p-2 text-sky-900 "
          />
        </main>
      )}
    </>
  );
};
