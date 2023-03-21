import React from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Property } from "../Property";
import { type FieldType } from "~/types/schema.types";
import { NavItem, NavItemWrapper } from "~/components/Layout/Navigation";

export const PropertyGroup = ({
  name,
  fields,
  address = "0",
}: {
  name: string;
  address: string;
  fields: FieldType[];
}) => {
  const marginLeft =
    {
      2: "ml-4",
      3: "ml-8",
    }[address.length] || "ml-0";
  return (
    <div className="my-1 flex flex-col">
      <div
        className={`flex items-center justify-between bg-sky-200 px-4 ${marginLeft}`}
      >
        <input
          className="h-9 w-96 rounded-md border p-2 text-gray-700 "
          placeholder="Group Name"
          defaultValue={name}
        />

        <NavItemWrapper>
          <NavItem>
            <PlusCircleIcon className="mr-1 h-6 w-6" />
            Add Property
          </NavItem>
          <NavItem>
            <PlusCircleIcon className="mr-1 h-6 w-6" />
            Add Group
          </NavItem>
          <NavItem>
            <PlusCircleIcon className="mr-1 h-6 w-6" />
            Duplicate Group
          </NavItem>
          <NavItem>
            <TrashIcon className="mr-1 h-6 w-6" />
            Delete
          </NavItem>
        </NavItemWrapper>
      </div>
      {fields.map(({ name, value = "", fields }, idx) => {
        const addr = `${address}.${idx}`;
        if (fields)
          return <PropertyGroup name={name} fields={fields} address={addr} />;
        return (
          <Property
            key={idx}
            name={name}
            value={value}
            className={`${marginLeft} `}
          />
        );
      })}
    </div>
  );
};
