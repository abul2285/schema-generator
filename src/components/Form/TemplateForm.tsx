import { useState } from "react";

import { Modal } from "../Modal";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export const TemplateForm = ({
  open,
  schema,
  setOpen,
  templateName = "",
}: {
  open: boolean;
  templateName?: string;
  schema?: string;
  setOpen: (open: boolean) => void;
}) => {
  const [template, setTemplate] = useState<{
    name: string;
    description: string;
    templateName: string;
  }>({
    name: "",
    description: "",
    templateName,
  });
  const router = useRouter();

  const schemaId = router.query.schemaId && String(router.query.schemaId);

  const handleCloseDialog = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setOpen(false);
  };

  const { mutate: createSchema } = api.scheme.create.useMutation({
    onSuccess: () => {
      if (schema) {
        setOpen(false);
        void router.push(`/templates?type=default`);
      }
    },
  });
  const { mutate: updateSchema } = api.scheme.updateSchema.useMutation({
    onSuccess: () => {
      setOpen(false);
    },
  });
  const handleSave = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    try {
      if (schema) {
        return createSchema({ ...template, schema, isCustom: false });
      }
      if (!schemaId) return;
      updateSchema({
        id: schemaId,
        isCustom: true,
        templateName: template.templateName,
      });
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  };

  return (
    <Modal open={open}>
      <form className="flex flex-col gap-2">
        <input
          name="templateName"
          defaultValue={templateName}
          onChange={(e) =>
            setTemplate((prev) => ({ ...prev, templateName: e.target.value }))
          }
          placeholder="Template Name"
          className="h-9 w-96 rounded-md border border-sky-900 bg-sky-100 p-2 text-sky-900 "
        />
        {schema && (
          <>
            <input
              name="name"
              onChange={(e) =>
                setTemplate((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Schema Name"
              className="h-9 w-96 rounded-md border border-sky-900 bg-sky-100 p-2 text-sky-900 "
            />
            <textarea
              rows={4}
              onChange={(e) =>
                setTemplate((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Schema Description"
              className="w-full rounded-md border border-sky-900 bg-sky-100 p-2 text-sky-900 "
            />
          </>
        )}

        <div className="mt-2 ">
          <button
            onClick={handleSave}
            className="mr-1 rounded-lg border bg-sky-400 py-1 px-4 text-white"
          >
            Save
          </button>
          <button
            onClick={handleCloseDialog}
            className="rounded-lg border border-sky-400 bg-white py-1 px-4 text-sky-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
