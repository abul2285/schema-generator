import { type Field, type FieldType } from "~/types/schema.types";

export const generateJSON_LD = (schema: FieldType[]) => {
  const jsonLD = (schema: FieldType[]): Field => {
    return schema.reduce((acc: Field, { name, value = "", fields }) => {
      const _value: string | Field = fields ? jsonLD(fields) : value;

      if (acc[name]) {
        if (!Array.isArray(acc[name])) {
          acc[name] = [acc[name] as typeof _value, _value];
        } else {
          acc[name] = [...(acc[name] as (typeof _value)[]), _value];
        }
      } else {
        acc = { ...acc, [name]: _value };
      }
      return acc;
    }, {});
  };

  return jsonLD(schema);
};
