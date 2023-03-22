import {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
  type ReactNode,
} from "react";
import debounce from "lodash/debounce";

import { api } from "~/utils/api";
import { isBrowser } from "~/utils/isBrowser";
import { getTargetItems } from "~/utils/schema";
import { type SchemaContextValueType } from "~/types/context.types";
import { SchemaFieldType, type FieldType } from "~/types/schema.types";

const SchemaContext = createContext<SchemaContextValueType>(
  {} as SchemaContextValueType
);
const Provider = SchemaContext.Provider;

export const SchemaProvider = ({ children }: { children: ReactNode }) => {
  const [schema, setSchema] = useState<FieldType[]>([]);
  const id = isBrowser ? localStorage.getItem("schemaId") || "" : "";
  const { mutate: updateSchema } = api.scheme.updateSchema.useMutation();

  const { data, isLoading } = api.scheme.getSchemaById.useQuery({ id });

  const handleAdd = (address: string, type: SchemaFieldType) => {
    const clonedSchema = JSON.parse(JSON.stringify(schema)) as FieldType[];

    const indexes = address.split(".");
    const fields = getTargetItems(indexes, clonedSchema);
    const payload: FieldType = { name: "" };
    if (type === SchemaFieldType.GROUP) {
      payload.fields = [];
    } else {
      payload.value = "";
    }
    fields.push(payload);
    setSchema(clonedSchema);
    handleBackgroundSave(id, data?.name || "", clonedSchema);
  };

  const handleRemove = (address: string) => {
    const clonedSchema = JSON.parse(JSON.stringify(schema)) as FieldType[];
    const indexes = address.split(".");
    const lastIndex = indexes.pop();
    const fields = getTargetItems(indexes, clonedSchema);
    if (lastIndex) {
      fields.splice(Number(lastIndex), 1);
    }
    setSchema(clonedSchema);
    handleBackgroundSave(id, data?.name || "", clonedSchema);
  };

  const handleClone = (address: string) => {
    const clonedSchema = JSON.parse(JSON.stringify(schema)) as FieldType[];
    const indexes = address.split(".");
    const lastIndex = indexes.pop();
    const fields = getTargetItems(indexes, clonedSchema);
    const property = fields[Number(lastIndex)];
    if (property) {
      fields.splice(Number(lastIndex), 0, property);
    }
    setSchema(clonedSchema);
    handleBackgroundSave(id, data?.name || "", clonedSchema);
  };

  const handleBackgroundSave = useMemo(
    () =>
      debounce((id: string, name: string, schema: FieldType[]) => {
        updateSchema({
          id,
          name,
          schema: JSON.stringify(schema),
        });
      }, 3000),
    [updateSchema]
  );

  useEffect(() => {
    if (data) {
      setSchema(JSON.parse(data.schema) as FieldType[]);
    }
  }, [data]);

  return (
    <Provider
      value={{
        id,
        schema,
        isLoading,
        setSchema,
        handleAdd,
        handleClone,
        handleRemove,
        name: data?.name || "",
      }}
    >
      {children}
    </Provider>
  );
};

export const useSchemaContext = () => {
  const context = useContext(SchemaContext);

  if (!context)
    throw new Error("useSchemaContext should be used within SchemaProvider");

  return context;
};
