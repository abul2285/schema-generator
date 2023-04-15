import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import { TemplateForm } from "~/components/Form";
import { type Field } from "~/types/schema.types";
import { generateSchema } from "~/utils/generateSchema";
import { WrenchIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";

const JSONToSchema = () => {
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
      <Navigation submenu>
        <NavItemWrapper>
          <NavItem onClick={handleOpenModal}>
            <WrenchIcon className="mr-1 h-6 w-6" />
            Save as schema
          </NavItem>
          <NavItem onClick={handleOpenModal}>
            <WrenchScrewdriverIcon className="mr-1 h-6 w-6" />
            Save As Template
          </NavItem>
        </NavItemWrapper>
      </Navigation>
      <main className="flex h-screen flex-col items-center justify-center bg-slate-600">
        <Editor
          theme="vs-dark"
          defaultValue=""
          defaultLanguage="json"
          className="h-5/6 w-4/5 p-10"
        />
        <TemplateForm open={open} schema={schema} setOpen={setOpen} />
      </main>
    </>
  );
};

export default JSONToSchema;
