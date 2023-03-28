import { useState } from "react";

import { Modal } from "../Modal";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

export const TemplateForm = ({
  open,
  schema,
  setOpen,
}: {
  open: boolean;
  schema: string;
  setOpen: (open: boolean) => void;
}) => {
  const [template, setTemplate] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });

  const handleCloseDialog = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setOpen(false);
  };

  const router = useRouter();
  const { mutate: createTemplate } = api.template.create.useMutation({
    onSuccess: (data) => {
      if (data) {
        void router.push(`/schemas?type=default`);
      }
    },
  });
  const { mutate } = api.scheme.create.useMutation({
    onSuccess: (data) => {
      if (!data) return;
      createTemplate({ name: data.name, schemaId: data.id, isCustom: false });
    },
  });
  const handleSave = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    try {
      if (!template.name || !template.description) return;
      mutate({ ...template, schema });
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  };

  return (
    <Modal open={open}>
      <form className="flex flex-col gap-2">
        <input
          name="name"
          onChange={(e) =>
            setTemplate((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter Template Name"
          className="h-9 w-96 rounded-md border border-sky-900 bg-sky-100 p-2 text-sky-900 "
        />
        <textarea
          rows={4}
          onChange={(e) =>
            setTemplate((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Enter Template Description"
          className="w-full rounded-md border border-sky-900 bg-sky-100 p-2 text-sky-900 "
        />

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
