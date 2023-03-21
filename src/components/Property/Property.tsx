import { DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/outline";

export const Property = ({
  name,
  value,
  className = "",
}: {
  className?: string;
  name: string;
  value: string | number;
}) => {
  return (
    <div
      className={`flex items-center justify-between space-x-4  bg-sky-100 p-4 ${className}`}
    >
      <input
        className="h-9 w-96 rounded-md border p-2 text-gray-700 "
        placeholder="Property Name"
        defaultValue={name}
      />
      <input
        className="h-9 w-96 flex-1 rounded-md border p-2 text-gray-700"
        placeholder="Property Value"
        defaultValue={value}
      />
      <div className="flex space-x-2">
        <button className="flex h-9 w-9 items-center justify-center rounded  border border-stone-500 bg-white text-stone-500">
          <DocumentDuplicateIcon className="h-4 w-4" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded  border border-stone-500 bg-white text-stone-500">
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
