import { Property } from "../Property";
import { PropertyGroup } from "../PropertyGroup";
import { type FieldType } from "~/types/schema.types";

export const RenderSchemaFields = ({ fields }: { fields: FieldType[] }) => {
  return (
    <>
      {fields.map(({ name, value = "", fields }, idx) => {
        if (fields)
          return (
            <PropertyGroup
              key={idx}
              name={name}
              fields={fields}
              address={`${idx}`}
            />
          );
        return (
          <Property key={idx} address={`${idx}`} name={name} value={value} />
        );
      })}
    </>
  );
};
