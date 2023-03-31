import Link from "next/link";
import {
  EyeIcon,
  TrashIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

import { api, type RouterOutputs } from "~/utils/api";
import { useRouter } from "next/router";

export const Card = (template: RouterOutputs["scheme"]["getById"]) => {
  const utils = api.useContext();
  const router = useRouter();
  const { mutate: deleteSchema, isLoading } =
    api.scheme.deleteSchema.useMutation({
      onSuccess: (data) => {
        if (data) {
          const { isCustom } = data;
          if (isCustom) void utils.scheme.getCurrentUserSchemas.invalidate();
          else void utils.scheme.getDefaultSchemas.invalidate();
        }
      },
    });

  const { mutateAsync: duplicateSchema, isLoading: isDuplicating } =
    api.scheme.create.useMutation({
      onSuccess: (data) => {
        if (data) {
          void utils.scheme.getCurrentUserSchemas.invalidate();
        }
      },
    });

  const handleDuplicateTemplate = async (isCustom: boolean) => {
    if (!template) return;
    const { name, description, templateName, schema } = template;
    return duplicateSchema({
      schema,
      description,
      isCustom,
      name: `${name} ${Date.now()}`,
      templateName: `${templateName as string} ${Date.now()}`,
    });
  };

  const handleCreateFromTemplate = async () => {
    const data = await handleDuplicateTemplate(true);

    if (data) {
      void router.push(`/schema/${data.id}`);
    }
  };

  console.log({ template });

  if (!template) return null;

  return (
    <div className="flex cursor-pointer flex-col justify-between rounded-lg border p-6 shadow-sm hover:shadow-lg">
      <div className="mb-6 grid grid-cols-2 leading-6 tracking-wide">
        <p>
          <span className="font-bold">Name</span> :{" "}
          <span className="font-mono">{template.templateName}</span>
        </p>
        <p>
          <span className="font-bold">Total Fields</span> :{" "}
          <span className="font-mono">20</span>
        </p>
        <p>
          <span className="font-bold">Properties</span> :{" "}
          <span className="font-mono">16</span>
        </p>
        <p>
          <span className="font-bold">Groups</span> :{" "}
          <span className="font-mono">4</span>
        </p>
      </div>
      <div className="flex justify-between">
        <Link className="flex" href={`/schema/${template.id}`}>
          <PencilSquareIcon className="mr-2 h-6 w-6" /> Edit
        </Link>
        <Link className="flex" href={`/schema/view/${template.id}`}>
          <EyeIcon className="mr-2 h-6 w-6" /> View
        </Link>
        <button className="group relative">
          <EllipsisHorizontalIcon className="mr-2 h-6 w-6" />
          <div className="absolute -right-3/4 bottom-full hidden w-52 flex-col rounded-sm bg-sky-200 shadow-lg group-hover:flex">
            <button
              className={`flex px-4 py-2 hover:bg-sky-300 ${
                isLoading ? "animate-spin" : ""
              }`}
              disabled={isLoading}
              onClick={() => deleteSchema({ id: template.id })}
            >
              <TrashIcon className="mr-2 h-6 w-6" />
              Delete
            </button>
            <button
              className={`flex px-4 py-2 hover:bg-sky-300 ${
                isDuplicating ? "animate-spin" : ""
              }`}
              disabled={isDuplicating}
              onClick={() => void handleDuplicateTemplate(true)}
            >
              <DocumentDuplicateIcon className="mr-2 h-6 w-6" /> Duplicate
            </button>
            <button
              className="flex px-3 py-2 hover:bg-sky-300"
              onClick={() => void handleCreateFromTemplate()}
            >
              <PlusCircleIcon className="mr-2 h-6 w-6" /> Use It To Create
            </button>
          </div>
        </button>
      </div>
    </div>
  );
};
