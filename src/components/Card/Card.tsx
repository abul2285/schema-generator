import Link from "next/link";
import {
  EyeIcon,
  TrashIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

import { api } from "~/utils/api";

export const Card = (template: {
  id: string;
  name: string;
  schema: string;
  schemaId: string;
  isCustom: boolean;
}) => {
  const utils = api.useContext();
  const { mutate: deleteTemplate, isLoading } = api.template.delete.useMutation(
    {
      onSuccess: (data) => {
        if (data) {
          void utils.template.getAll.invalidate({ isCustom: !!data.isCustom });
        }
      },
    }
  );

  const { mutate: duplicateTemplate, isLoading: isDuplicating } =
    api.template.duplicate.useMutation({
      onSuccess: (data) => {
        if (data) {
          void utils.template.getAll.invalidate({ isCustom: !!data.isCustom });
        }
      },
    });

  return (
    <div className="flex cursor-pointer flex-col justify-between rounded-lg border p-6 shadow-sm hover:shadow-lg">
      <div className="mb-6 grid grid-cols-2 leading-6 tracking-wide">
        <p>
          <span className="font-bold">Name</span> :{" "}
          <span className="font-mono">{template.name}</span>
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
        <Link className="flex" href={`/schema/${template.schemaId}`}>
          <PencilSquareIcon className="mr-2 h-6 w-6" /> Edit
        </Link>
        <Link className="flex" href={`/schema/view/${template.schemaId}`}>
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
              onClick={() => deleteTemplate({ id: template.id })}
            >
              <TrashIcon className="mr-2 h-6 w-6" />
              Delete
            </button>
            <button
              className={`flex px-4 py-2 hover:bg-sky-300 ${
                isDuplicating ? "animate-spin" : ""
              }`}
              disabled={isDuplicating}
              onClick={() =>
                duplicateTemplate({
                  schema: template.schema,
                  name: `${template.name} copy`,
                  isCustom: template.isCustom,
                  description: "fallback description",
                })
              }
            >
              <DocumentDuplicateIcon className="mr-2 h-6 w-6" /> Duplicate
            </button>
            <button className="flex px-3 py-2 hover:bg-sky-300">
              <PlusCircleIcon className="mr-2 h-6 w-6" /> Use It To Create
            </button>
          </div>
        </button>
      </div>
    </div>
  );
};
