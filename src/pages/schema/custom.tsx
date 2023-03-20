import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  NavItem,
  Navigation,
  NavItemWrapper,
} from "~/components/Layout/Navigation";
import { type FieldType } from "~/types/schema.types";
import { RenderSchemaFields } from "~/components/RenderSchemaField";

const Custom = () => {
  const customSchema: FieldType = {
    name: "Custom-Schema",
    fields: [
      {
        name: "@type",
        value: "Organization",
      },
      {
        name: "ContactInfo",
        fields: [
          {
            name: "@type",
            value: "contactInfo",
          },
          {
            name: "email",
            value: "abul@dorik.io",
          },
          {
            name: "name",
            value: "abul",
          },
          {
            name: "News",
            fields: [
              {
                name: "@type",
                value: "News",
              },
              {
                name: "@type",
                value: "News",
              },
              {
                name: "@type",
                value: "News",
              },
              {
                name: "@type",
                value: "News",
              },
            ],
          },
        ],
      },
    ],
  };
  return (
    <>
      <Navigation>
        <NavItemWrapper>
          <NavItem hoverAble>
            <PlusCircleIcon className="mr-1 h-6 w-6" />
            Edit Schema
          </NavItem>
          <NavItem hoverAble>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="mr-1 h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
            Validate Schema
          </NavItem>
        </NavItemWrapper>
      </Navigation>
      <main>
        <div className="flex items-center justify-between bg-sky-300 px-4">
          <input
            className="h-9 w-96 rounded-md border p-2 text-gray-700 "
            placeholder="Schema Name"
            value={customSchema.name}
          />
          <NavItemWrapper>
            <NavItem className="hover:border-b-transparent">
              <PlusCircleIcon className="mr-1 h-6 w-6" />
              Add Property
            </NavItem>
            <NavItem className="hover:border-b-transparent">
              <PlusCircleIcon className="mr-1 h-6 w-6" />
              Add Group
            </NavItem>
            <NavItem className="hover:border-b-transparent">
              <TrashIcon className="mr-1 h-6 w-6" />
              Delete
            </NavItem>
          </NavItemWrapper>
        </div>
        <RenderSchemaFields fields={customSchema.fields || []} />
      </main>
    </>
  );
};

export default Custom;
