import { type SetStateAction } from "react";
import { type RouterOutputs } from "~/utils/api";
import { type SchemaFieldType, type FieldType } from "./schema.types";

export type SchemaContextValueType = {
  id: string;
  data: RouterOutputs["scheme"]["getById"];
  isLoading: boolean;
  schema: FieldType[];
  handleClone: (string: string) => void;
  handleRemove: (string: string) => void;
  setSchema: (value: SetStateAction<FieldType[]>) => void;
  handleAdd: (address: string, type: SchemaFieldType) => void;
  handleChange: ({ address, key, value }: SchemaChangeType) => void;
};

export type SchemaChangeType = {
  value: string;
  address: string;
  key: Exclude<keyof FieldType, "fields">;
};
