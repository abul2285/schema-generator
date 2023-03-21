import {
  createContext,
  useEffect,
  useContext,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { type FieldType } from "~/types/schema.types";
import { api } from "~/utils/api";
import { isBrowser } from "~/utils/isBrowser";

type SchemaContextValueType = {
  id: string;
  name: string;
  isLoading: boolean;
  schema: FieldType[];
  setSchema: (value: SetStateAction<FieldType[]>) => void;
};

const SchemaContext = createContext<SchemaContextValueType>(
  {} as SchemaContextValueType
);
const Provider = SchemaContext.Provider;

export const SchemaProvider = ({ children }: { children: ReactNode }) => {
  const [schema, setSchema] = useState<FieldType[]>([]);
  const id = isBrowser ? localStorage.getItem("schemaId") || "" : "";

  const { data, isLoading } = api.scheme.getSchemaById.useQuery({ id });

  useEffect(() => {
    if (data) {
      setSchema(JSON.parse(data.schema) as FieldType[]);
    }
  }, [data]);

  return (
    <Provider
      value={{ isLoading, name: data?.name || "", schema, setSchema, id }}
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
