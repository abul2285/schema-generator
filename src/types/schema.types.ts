import type { RouterOutputs } from "~/utils/api";

export type FieldType = {
  name: string;
  value?: string;
  fields?: FieldType[];
};

export enum SchemaFieldType {
  GROUP = "GROUP",
  PROPERTY = "PROPERTY",
}

export type Field = {
  [key: string]: string | Field | (Field | string)[];
};

export type Schema = Exclude<
  RouterOutputs["scheme"]["getCurrentUserSchemas"],
  undefined
>[number];
