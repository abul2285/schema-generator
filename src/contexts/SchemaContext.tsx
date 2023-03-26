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
import { getTargetItems } from "~/utils/schema";
import {
  type SchemaChangeType,
  type SchemaContextValueType,
} from "~/types/context.types";
import { SchemaFieldType, type FieldType } from "~/types/schema.types";
import { useRouter } from "next/router";

const SchemaContext = createContext<SchemaContextValueType>(
  {} as SchemaContextValueType
);
const Provider = SchemaContext.Provider;

export const SchemaProvider = ({ children }: { children: ReactNode }) => {
  const [schema, setSchema] = useState<FieldType[]>([]);
  const router = useRouter();
  const { schemaId } = router.query;
  const id = schemaId ? String(schemaId) : "";
  const { mutate: createSchema } = api.scheme.create.useMutation({
    onSuccess: (data) => {
      if (!data) return;
      void router.push(`/schema/${data.id}`);
    },
  });

  const { mutate: updateSchema } = api.scheme.updateSchema.useMutation();

  const { data, isLoading } = api.scheme.getById.useQuery({ id });

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
    handleBackgroundSave(data?.name || "", clonedSchema);
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
    handleBackgroundSave(data?.name || "", clonedSchema);
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
    handleBackgroundSave(data?.name || "", clonedSchema);
  };

  const handleChange = ({ key, value, address }: SchemaChangeType) => {
    const clonedSchema = JSON.parse(JSON.stringify(schema)) as FieldType[];
    const indexes = address.split(".");
    const lastIndex = indexes.pop();
    const fields = getTargetItems(indexes, clonedSchema);
    const property = fields[Number(lastIndex)];
    if (property) {
      property[key] = value;
    }

    setSchema(clonedSchema);
    handleBackgroundSave(data?.name || "", clonedSchema);
  };

  const handleNameChange = ({ name }: { name: string }) => {
    const clonedSchema = JSON.parse(JSON.stringify(schema)) as FieldType[];
    setSchema(clonedSchema);
    handleBackgroundSave(name, clonedSchema);
  };

  const handleBackgroundSave = useMemo(
    () =>
      debounce((name: string, schema: FieldType[]) => {
        const payload: { id?: string; name: string; schema: string } = {
          name,
          schema: JSON.stringify(schema),
        };
        if (id) {
          updateSchema({
            id,
            ...payload,
          });
        } else {
          createSchema(payload);
        }
      }, 3000),
    [createSchema, id, updateSchema]
  );

  useEffect(() => {
    const schema = (data ? JSON.parse(data.schema) : []) as FieldType[];
    setSchema(schema);
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
        handleChange,
        handleRemove,
        handleNameChange,
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
