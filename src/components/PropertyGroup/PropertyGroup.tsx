import React from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Property } from "../Property";
import { useSchemaContext } from "~/contexts";
import { generateGroupStyle } from "~/utils/generateGroupStyle";
import { SchemaFieldType, type FieldType } from "~/types/schema.types";
import { NavItem, NavItemWrapper } from "~/components/Layout/Navigation";

export const PropertyGroup = ({
  name,
  fields,
  address,
}: {
  name: string;
  address: string;
  fields: FieldType[];
}) => {
  const { handleAdd, handleClone, handleRemove } = useSchemaContext();
  const groupStyles = generateGroupStyle(address);

  return (
    <div className="my-1 flex flex-col">
      <div
        className={`flex items-center justify-between bg-sky-200 px-4 ${groupStyles}`}
      >
        <input
          className="h-9 w-96 rounded-md border p-2 text-gray-700 "
          placeholder="Group Name"
          defaultValue={name}
        />

        <NavItemWrapper>
          <NavItem onClick={() => handleAdd(address, SchemaFieldType.PROPERTY)}>
            <PlusCircleIcon className="mr-1 h-6 w-6" />
            Add Property
          </NavItem>
          <NavItem onClick={() => handleAdd(address, SchemaFieldType.GROUP)}>
            <PlusCircleIcon className="mr-1 h-6 w-6" />
            Add Group
          </NavItem>
          <NavItem onClick={() => handleClone(address)}>
            <PlusCircleIcon className="mr-1 h-6 w-6" />
            Duplicate Group
          </NavItem>
          <NavItem onClick={() => handleRemove(address)}>
            <TrashIcon className="mr-1 h-6 w-6" />
            Delete
          </NavItem>
        </NavItemWrapper>
      </div>
      {fields.map(({ name, value = "", fields }, idx) => {
        const addr = `${address}.${idx}`;
        if (fields)
          return (
            <PropertyGroup
              key={idx}
              name={name}
              fields={fields}
              address={addr}
            />
          );
        return <Property key={idx} name={name} value={value} address={addr} />;
      })}
    </div>
  );
};
