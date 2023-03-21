import { Property } from "../Property";
import { PropertyGroup } from "../PropertyGroup";
import { type FieldType } from "~/types/schema.types";

export const RenderSchemaFields = ({ fields }: { fields: FieldType[] }) => {
  return (
    <>
      {fields.map(({ name, value = "", fields }, idx) => {
        if (fields)
          return (
            <PropertyGroup address="0" key={idx} name={name} fields={fields} />
          );
        return <Property key={idx} className="" name={name} value={value} />;
      })}
    </>
  );
};
