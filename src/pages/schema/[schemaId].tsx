import { useRedirect } from "~/hooks";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { SchemaForm } from "~/components/Form";

const EditSchema = () => {
  const { schemaId } = useRouter().query;

  const { status } = useSession();

  useRedirect({ isAuth: status === "authenticated" });

  if (status === "unauthenticated") return null;

  return <SchemaForm id={String(schemaId)} />;
};

export default EditSchema;
