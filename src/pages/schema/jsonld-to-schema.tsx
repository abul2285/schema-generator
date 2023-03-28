import { useRef, useState } from "react";

import { TemplateForm } from "~/components/Form";
import { type Field } from "~/types/schema.types";
import { generateSchema } from "~/utils/generateSchema";

const Home = () => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [open, setOpen] = useState(false);
  const [schema, setSchema] = useState("");

  const handleOpenModal = () => {
    try {
      if (!ref.current?.value) throw new Error("Field is required");
      const { value } = ref.current;
      const jsonLD = JSON.parse(value) as Field;
      const generatedSchema = generateSchema(jsonLD);
      setSchema(JSON.stringify(generatedSchema));
      setOpen(true);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <main className="fixed top-0 left-0 right-0 bottom-0 -z-10 flex h-screen flex-col items-center justify-center bg-slate-600">
        <textarea
          ref={ref}
          className="mt-4 h-3/4 w-4/5 rounded-md border p-4 leading-8 tracking-wider text-sky-600 shadow-lg"
        />
        <button
          className="peer mt-2 w-1/3 self-center rounded-lg border bg-sky-400 py-2 px-6 text-white"
          onClick={handleOpenModal}
        >
          Create Template From JSON-LD
        </button>
        <TemplateForm open={open} schema={schema} setOpen={setOpen} />
      </main>
    </>
  );
};

export default Home;
