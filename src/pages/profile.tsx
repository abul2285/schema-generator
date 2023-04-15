import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import type { Schema } from "~/types/schema.types";
import { FullPageLoading, Loading } from "~/components/Loading";

const Profile = () => {
  const idRef = useRef("");
  const router = useRouter();
  const utils = api.useContext();
  const { data: session, status } = useSession();

  const { data, isLoading } = api.scheme.getCurrentUserSchemas.useQuery();
  const { mutate: deleteSchema, isLoading: isDeleting } =
    api.scheme.deleteSchema.useMutation({
      onSuccess: () => {
        toast.success("Deleted Successfully");
        void utils.scheme.getCurrentUserSchemas.invalidate();
      },
      onMutate({ id }) {
        idRef.current = id;
      },
    });

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [router, status]);

  if (isLoading || !data) return <FullPageLoading />;

  const templatesNumber = data.filter((schema) => schema.templateName).length;

  return (
    <>
      <div className="bg-sky-200">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <div className="flex items-center">
              <Image
                width={96}
                height={96}
                alt="User Avatar"
                className="mr-4 rounded-full"
                src={session?.user.image || ""}
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {session?.user.name}
                </h1>
                <p className="text-gray-600">{session?.user.email}</p>
              </div>
            </div>
            <div className="mt-4 text-right md:mt-0">
              <p className="text-gray-600">
                Templates created:{" "}
                <span className="font-bold">{templatesNumber}</span>
              </p>
              <p className="text-gray-600">
                Schemas created:{" "}
                <span className="font-bold">
                  {data.length - templatesNumber}
                </span>
              </p>
              <p className="border-t-2 border-gray-500 text-gray-600">
                Total: <span className="font-bold">{data.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-screen bg-sky-100">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="mt-8">
            <h2 className="text-xl font-medium text-gray-900">
              Schemas And Templates
            </h2>
            <div className="mt-4">
              <table className="min-w-full divide-y divide-blue-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200 bg-white">
                  {data.map((schema) => (
                    <TableRow
                      key={schema.id}
                      schema={schema}
                      deleteSchema={deleteSchema}
                      isLoading={isDeleting && idRef.current === schema.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const TableRow = ({
  schema,
  isLoading,
  deleteSchema,
}: {
  schema: Schema;
  deleteSchema: ({ id }: { id: string }) => void;
  isLoading: boolean;
}) => {
  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{schema.name}</div>
      </td>
      <td className="overflow-hidden text-ellipsis px-6 py-4">
        <div className="text-sm text-gray-900">{schema.description}</div>
      </td>
      <td className="whitespace-nowrap px-6 py-4  text-sm font-medium">
        {schema.templateName ? "Template" : "Schema"}
      </td>
      <td className="space-x-2 whitespace-nowrap px-6 py-4 text-right  text-sm font-medium">
        <Link
          href={`/schema/view/${schema.id}`}
          className="text-blue-600 hover:text-blue-900"
        >
          View
        </Link>
        <Link
          href={`/schema/${schema.id}`}
          className="text-blue-600 hover:text-blue-900"
        >
          Edit
        </Link>
        <button
          className="inline-flex text-red-600 hover:text-red-900"
          onClick={() => deleteSchema({ id: schema.id })}
        >
          {isLoading && <Loading />}
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Profile;
