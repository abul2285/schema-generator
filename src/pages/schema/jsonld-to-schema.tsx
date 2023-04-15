import { useState } from "react";
import { toast } from "react-hot-toast";
import Editor from "@monaco-editor/react";
import type { OnValidate } from "@monaco-editor/react";

import { TemplateForm } from "~/components/Form";
import { type Field } from "~/types/schema.types";
import { generateSchema } from "~/utils/generateSchema";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";

const JSONToSchema = () => {
  const [open, setOpen] = useState(false);
  const [schema, setSchema] = useState("");
  const [markers, setMarkers] = useState<Parameters<OnValidate>[number]>([]);

  const handleEditorChange = (value?: string) => {
    if (!value) return;
    const jsonLD = JSON.parse(value) as Field;
    const generatedSchema = generateSchema(jsonLD);
    setSchema(JSON.stringify(generatedSchema));
  };

  function handleEditorValidation(markers: Parameters<OnValidate>[number]) {
    setMarkers(markers);
  }

  const hasError = () => {
    const hasError = markers.length || !schema;

    let errorMessage =
      markers.length &&
      markers
        .map(
          (marker: { message: string; endLineNumber: number }) =>
            `${marker.message} at line ${marker.endLineNumber}`
        )
        .join(",");

    if (!schema) {
      errorMessage = "Please write something to the editor";
    }

    if (errorMessage) toast.error(errorMessage);

    return hasError;
  };

  const handleOpenModal = () => {
    if (hasError()) return;
    setOpen(true);
  };

  return (
    <>
      <Navigation submenu>
        <NavItemWrapper>
          {/* <NavItem onClick={handleSaveAsSchema}>
            <WrenchIcon className="mr-1 h-6 w-6" />
            Save as schema
          </NavItem> */}
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
          onChange={handleEditorChange}
          onValidate={handleEditorValidation}
        />
        <TemplateForm open={open} schema={schema} setOpen={setOpen} />
      </main>
    </>
  );
};

export default JSONToSchema;
