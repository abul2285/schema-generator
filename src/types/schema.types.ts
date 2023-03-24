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
