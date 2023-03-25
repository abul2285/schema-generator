import {
  CheckIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import Board from "~/components/Board/Board";
import { type FieldType } from "~/types/schema.types";
import { generateJSON_LD } from "~/utils/generateJSON_LD";

export const Validate = ({ schema }: { schema: FieldType[] }) => {
  const jsonLD = generateJSON_LD(schema);

  const copyToClipboard = (url?: string): void => {
    navigator.clipboard
      .writeText(JSON.stringify(jsonLD, null, 4))
      .then(() => {
        if (url) void window.open(url, "_blank");
      })
      .catch((error) => console.log(error));
  };

  return (
    <main className="mx-8 h-screen">
      <div className="mt-6 mb-4 flex justify-between text-sm">
        <span>JSON-LD</span>
        <div className="flex space-x-2">
          <button
            className="flex items-center rounded-md border bg-sky-300 py-2 px-5"
            onClick={() => copyToClipboard()}
          >
            <ClipboardDocumentCheckIcon className="mr-1 h-4 w-4" />
            Copy
          </button>

          <button
            className="flex items-center rounded-md border bg-sky-300 py-2 px-5"
            onClick={() =>
              copyToClipboard("https://search.google.com/test/rich-results")
            }
          >
            <CheckIcon className="mr-1 h-4 w-4" /> Validate Via Google
          </button>

          <button
            className="flex items-center rounded-md border bg-sky-300 py-2 px-5"
            onClick={() => copyToClipboard("https://validator.schema.org")}
          >
            <CheckIcon className="mr-1 h-4 w-4" /> Validate Via Schema.org
          </button>
        </div>
      </div>
      <Board jsonLD={jsonLD} />
    </main>
  );
};
