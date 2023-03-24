import { useRef } from "react";
import { CommandLineIcon } from "@heroicons/react/24/outline";

import { api } from "~/utils/api";
import { Head } from "~/components/Layout/Head";
import { type Field } from "~/types/schema.types";
import { generateSchema } from "~/utils/generateSchema";
import { NavItem } from "~/components/Layout/Navigation";

const Home = () => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const { mutate: createTemplate } = api.template.create.useMutation();
  const { mutate } = api.scheme.create.useMutation({
    onSuccess: (data) => {
      if (!data) return;
      createTemplate({ name: data.name, schemaId: data.id, isCustom: false });
    },
  });
  const handleSave = () => {
    try {
      if (!ref.current) return;
      const { value } = ref.current;
      const jsonLD = JSON.parse(value) as Field;
      const schema = generateSchema(jsonLD);
      const name = prompt("Enter your schema name", "random") as string;
      mutate({ name, schema: JSON.stringify(schema) });
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <NavItem hoverAble>
          <CommandLineIcon className="mr-2 h-6 w-6" />
          JSON-LD to Schema
        </NavItem>
      </Head>

      <main className="fixed top-0 left-0 right-0 bottom-0 -z-10 flex h-screen flex-col items-center justify-center bg-slate-600">
        <textarea
          ref={ref}
          className="mt-4 h-3/4 w-4/5 rounded-md border p-4 leading-8 tracking-wider text-sky-600 shadow-lg"
        />
        <button
          className="mt-2 w-1/3 self-center rounded-lg border bg-sky-400 py-2 px-6 text-white"
          onClick={handleSave}
        >
          Create Template From JSON-LD
        </button>
      </main>
    </>
  );
};

export default Home;
