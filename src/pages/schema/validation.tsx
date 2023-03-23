import Link from "next/link";
import Highlight from "react-highlight";
import "highlight.js/styles/shades-of-purple.css";
import {
  HomeIcon,
  CheckIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";
import { useSchemaContext } from "~/contexts";
import { type FieldType } from "~/types/schema.types";

type Field = {
  [key: string]: string | Field | Field[];
};

const generateJSON_LD = (schema: FieldType[]) => {
  const jsonLD = (schema: FieldType[]): Field => {
    return schema.reduce((acc: Field, { name, value = "", fields }) => {
      if (fields) {
        const _fields = jsonLD(fields);

        if (acc[name]) {
          acc[name] = [acc[name] as Field, _fields];
        } else {
          acc = {
            ...acc,
            [name]: _fields,
          };
        }
      } else {
        acc = { ...acc, [name]: value };
      }
      return acc;
    }, {});
  };

  return jsonLD(schema);
};

const Predefined = () => {
  const { schema } = useSchemaContext();
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
    <>
      <Navigation>
        <NavItemWrapper>
          <Link href="/">
            <NavItem hoverAble>
              <HomeIcon className="mr-1 h-6 w-6" />
              Back To Home
            </NavItem>
          </Link>
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
        </NavItemWrapper>
      </Navigation>
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
        <Highlight>{JSON.stringify(jsonLD, null, 4)}</Highlight>
      </main>
    </>
  );
};

export default Predefined;
