import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { CameraIcon } from "@heroicons/react/24/outline";

import { api } from "~/utils/api";

const Settings = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { mutate, isLoading } = api.user.update.useMutation();

  const { name, email, image, role } = session?.user || {};

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [router, status]);

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Account Settings
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Update your account information.
          </p>
        </div>
        <form
          className="border-t border-gray-200"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("submit");
          }}
        >
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={name || ""}
                  className="block h-10 w-full rounded-md border border-sky-300 px-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </dd>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={email || ""}
                  className="block h-10 w-full rounded-md border border-sky-300 px-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </dd>
            </div>

            <div className="items-center bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Avatar</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <div className="group/avatar relative h-40 w-40 overflow-hidden rounded-full">
                  <Image
                    className="object-cover"
                    src={image || ""}
                    width={200}
                    height={200}
                    alt="avatar"
                  />
                  <div className="absolute inset-0 cursor-pointer group-hover/avatar:bg-gray-800 group-hover/avatar:opacity-50"></div>
                  <div className="absolute inset-0 hidden items-center justify-center group-hover/avatar:flex">
                    <CameraIcon className="mr-1 h-6 w-6 text-white" />
                    <div className="ml-2 text-sm text-white">Change photo</div>
                    <input
                      type="file"
                      className="absolute inset-0 z-10 opacity-0"
                    />
                  </div>
                </div>
              </dd>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <select
                  id="role"
                  name="role"
                  defaultValue={role}
                  className="block h-10 w-full rounded-md border border-sky-300 px-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500"></dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <button className="cursor-pointer self-start rounded-lg border bg-sky-400 py-2 px-6 text-white hover:shadow-lg">
                  Update
                </button>
              </dd>
            </div>
          </dl>
        </form>
      </div>
    </div>
  );
};

export default Settings;
