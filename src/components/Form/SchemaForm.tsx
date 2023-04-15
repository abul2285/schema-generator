import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { type ChangeEvent, useState, useEffect } from "react";
import {
  TrashIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import { CreateNew } from "../Card";
import { useSchemaContext } from "~/contexts";
import { TemplateForm } from "./TemplateForm";
import { Validate } from "~/components/Validate";
import { FullPageLoading, Loading } from "../Loading";
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
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const [validate, setValidate] = useState(false);
  const router = useRouter();
  const { data, schema, isLoading, setSchema } = useSchemaContext();
  const [{ name, description }, setSchemaDetails] = useState<{
    name: string;
    description: string;
  }>(() => loadInitialData(data));

  const isAuth = status === "authenticated";

  const { mutate: createSchema, isLoading: isCreating } =
    api.scheme.create.useMutation({
      onSuccess: (data) => {
        if (!data) return;
        const name = data?.templateName || data?.name || "";
        toast.success(`${name} created successfully`);
        void router.push(`/schema/${data.id}`);
      },
    });

  const { mutate: updateSchema, isLoading: isUpdating } =
    api.scheme.updateSchema.useMutation({
      onSuccess: (data) => {
        const name = data?.templateName || data?.name || "";
        toast.success(`${name} updated successfully`);
      },
    });

  const { mutate: deleteSchema, isLoading: isDeleting } =
    api.scheme.deleteSchema.useMutation({
      onSuccess: (data) => {
        const name = data?.templateName || data?.name || "";
        toast.success(`${name} deleted successfully`);
        void router.push("/templates");
      },
    });

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

  if (isLoading && id) return <FullPageLoading />;
  if (id && !data)
    return (
      <div className="mt-24">
        <CreateNew title="No Schema Found" />;
      </div>
    );

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

          {isAuth && (
            <NavItem className="justify-end" onClick={handleSaveOrUpdate}>
              {isCreating || isUpdating ? (
                <Loading />
              ) : (
                <CheckCircleIcon className="mr-1 h-6 w-6" />
              )}
              Save
            </NavItem>
          )}

          {id && (
            <NavItem
              hoverAble
              className="hover:border-b-transparent"
              onClick={() => deleteSchema({ id })}
            >
              {isDeleting && <Loading />}
              <TrashIcon
                className="mt-0 mr-1 h-6 w-6"
                style={{ marginTop: 0 }}
              />
              Delete
            </NavItem>
          )}

          {id && (
            <>
              <div className="flex-1" />
              <NavItem
                className="justify-end"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <CheckCircleIcon className="mr-1 h-6 w-6" />
                {data?.templateName ? "Edit Template" : "Save As Template"}
              </NavItem>
            </>
          )}
        </NavItemWrapper>
      </Navigation>
      <TemplateForm
        open={open}
        setOpen={setOpen}
        templateName={data?.templateName || ""}
      />
      {validate ? (
        <Validate schema={schema || []} />
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
