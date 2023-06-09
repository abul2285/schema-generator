import { useRouter } from "next/router";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { getTargetItems } from "~/utils/schema";
import { SchemaFieldType } from "~/types/schema.types";
import { generateSchema } from "~/utils/generateSchema";
import type { FieldType, Schema, Field } from "~/types/schema.types";
import type {
  SchemaChangeType,
  SchemaContextValueType,
} from "~/types/context.types";

const SchemaContext = createContext<SchemaContextValueType>(
  {} as SchemaContextValueType
);
const Provider = SchemaContext.Provider;

export const SchemaProvider = ({ children }: { children: ReactNode }) => {
  const [schema, setSchema] = useState<FieldType[]>([]);
  const router = useRouter();
  const { status } = useSession();
  const { schemaId } = router.query;
  const id = schemaId ? String(schemaId) : "";
  const { data, isLoading } = api.scheme.getById.useQuery(
    { id },
    {
      enabled: !!id,
    }
  );

  const isAuth = status === "authenticated";

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
  };

  useEffect(() => {
    const schema = (data ? JSON.parse(data.schema) : []) as FieldType[];
    setSchema(schema);
  }, [data]);

  useEffect(() => {
    if (!isAuth) {
      const template = localStorage.getItem("template");
      if (!template) return;

      const schema = JSON.parse(template) as Schema;
      const jsonLD = JSON.parse(schema.schema) as Field;
      setSchema(generateSchema(jsonLD));
    }
  }, [isAuth]);

  return (
    <Provider
      value={{
        id,
        data,
        schema,
        isLoading,
        setSchema,
        handleAdd,
        handleClone,
        handleChange,
        handleRemove,
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
