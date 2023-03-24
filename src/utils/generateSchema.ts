import { isObject } from "lodash";
import { type Field, type FieldType } from "~/types/schema.types";

export const generateSchema = (jsonLD: Field) => {
  const schemaGenerator = (jsonLD: Field) => {
    return Object.entries(jsonLD).reduce((acc, [name, value]) => {
      let payload: FieldType[];
      if (isObject(value)) {
        const _p = Array.isArray(value) ? value : [value];
        payload = _p.map((v): FieldType => {
          if (typeof v === "string") {
            return { name, value: v };
          }
          return { name, fields: schemaGenerator(v) };
        });
      } else {
        payload = [
          {
            name,
            value,
          },
        ];
      }

      return acc.concat(payload);
    }, [] as FieldType[]);
  };

  const data = schemaGenerator(jsonLD);

  return data;
};
