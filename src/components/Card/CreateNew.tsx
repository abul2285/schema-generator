import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export const CreateNew = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="shadow-ld flex h-60  w-60 flex-col items-center justify-center gap-4 rounded-md border border-sky-300">
        <p>{title}</p>
        <button className="cursor-pointer  rounded-lg border bg-sky-400 py-2 px-6 text-white hover:shadow-lg">
          <Link href="/schema/create-new" className="flex">
            <PlusIcon className="mr-2 h-6 w-6" /> Create New
          </Link>
        </button>
      </div>
    </div>
  );
};
