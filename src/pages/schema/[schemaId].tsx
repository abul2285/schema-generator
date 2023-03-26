import { SchemaForm } from "~/components/Form";
import { useRouter } from "next/router";

const EditSchema = () => {
  const { schemaId } = useRouter().query;

  return <SchemaForm id={String(schemaId)} />;
};

export default EditSchema;
