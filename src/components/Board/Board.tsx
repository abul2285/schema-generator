import React from "react";

import Editor from "@monaco-editor/react";

import { type Field } from "~/types/schema.types";

const Board = ({ jsonLD, indent = 4 }: { jsonLD: Field; indent?: number }) => {
  return (
    <Editor
      className="h-3/4"
      theme="vs-dark"
      defaultLanguage="json"
      options={{ readOnly: true }}
      defaultValue={JSON.stringify(jsonLD, null, indent)}
    />
  );
};

export default Board;
