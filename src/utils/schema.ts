import { type FieldType } from "~/types/schema.types";

export const getTargetItems = (
  indexes: string[],
  schema: FieldType[]
): FieldType[] => {
  return indexes.reduce((schema: FieldType[], index) => {
    const a = schema[Number(index)];
    if (!a?.fields) return [];

    return a.fields;
  }, schema);
};
