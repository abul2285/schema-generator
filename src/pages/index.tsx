import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { CreateNew } from "~/components/Card";
import { generateSchema } from "~/utils/generateSchema";
import { generateJSON_LD } from "~/utils/generateJSON_LD";
import { CardLoading, Loading } from "~/components/Loading";
import type { Schema, Field, FieldType } from "~/types/schema.types";

type TemplateCardProps = {
  id?: string;
  name: string;
  schema?: string;
  isCustom?: boolean;
  description: string;
};

type TemplateCardType = TemplateCardProps[];

const templates: TemplateCardType = [
  {
    name: "Article",
    description:
      "A news, sports, or blog article displayed in various rich result features, such as the title of the article and larger-than-thumbnail images.",
    schema: `{
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Title of a News Article",
    "image": [
      "https://example.com/photos/1x1/photo.jpg",
      "https://example.com/photos/4x3/photo.jpg",
      "https://example.com/photos/16x9/photo.jpg"
     ],
    "datePublished": "2015-02-05T08:00:00+08:00",
    "dateModified": "2015-02-05T09:20:00+08:00",
    "author": [{
        "@type": "Person",
        "name": "Jane Doe",
        "url": "https://example.com/profile/janedoe123"
      },{
        "@type": "Person",
        "name": "John Doe",
        "url": "https://example.com/profile/johndoe123"
    }]
  }`,
  },
  {
    name: "Book",
    description: `Book actions that enable users to buy the book that they find directly from Search results.`,
  },
  {
    name: "Education Q&A",
    description: `Education-related questions and answers that help students discover flashcards on Google Search.`,
  },
  {
    name: "FAQ",
    description: `A Frequently Asked Question (FAQ) page contains a list of questions and answers pertaining to a particular topic.`,
  },
  {
    name: "How-to",
    description: `A How-to walks users through a set of steps to successfully complete a task, featuring video, images, and text.`,
  },
  {
    name: "Learning Video",
    description: `Help students and teachers discover and watch educational videos by adding Learning Video structured data to your educational videos.`,
  },
];

const Home = () => {
  const { status } = useSession();

  return (
    <main className="m-8">
      <section>
        <h2 className="mb-4 text-2xl font-bold">
          Start Form Default Templates
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, key) => {
            return (
              <TemplateCard
                key={key}
                template={template}
                isAuth={status === "authenticated"}
              />
            );
          })}
        </div>
      </section>
      {status === "authenticated" && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold">Start Form Your Templates</h2>
          <UserTemplates />
        </section>
      )}
    </main>
  );
};

const TemplateCard = ({
  isAuth,
  template,
}: {
  template: TemplateCardProps;
  isAuth: boolean;
}) => {
  const { name, description, schema, isCustom, id = "" } = template;
  const router = useRouter();
  const utils = api.useContext();

  const { mutateAsync, isLoading: isCreating } =
    api.scheme.create.useMutation();
  const { mutate: deleteSchema, isLoading: isDeleting } =
    api.scheme.deleteSchema.useMutation({
      onSuccess: (data) => {
        if (data?.isCustom)
          return void utils.scheme.getCurrentUserSchemas.invalidate();
        void utils.scheme.getDefaultSchemas.invalidate();
      },
    });

  const handleCreateSchema = async () => {
    if (!schema)
      return alert(
        "Sorry for the interruption. Currently, only the Article template is ready. Others will be added soon"
      );
    if (!isAuth) {
      localStorage.setItem("template", JSON.stringify(template));
      return router.push("/schema/create-new");
    }
    const jsonLD = JSON.parse(schema) as Field;
    const generatedSchema = generateSchema(jsonLD);
    const data = await mutateAsync({
      name,
      description,
      isCustom: true,
      schema: JSON.stringify(generatedSchema),
    });
    if (data?.id) {
      void router.push(`/schema/${data.id}`);
    }
  };
  return (
    <article className="flex flex-col justify-between rounded-lg border p-6 shadow-sm">
      <h3 className="font-semibold">{name}</h3>
      <p className="font-sm mt-4 mb-3 leading-6 text-gray-700">{description}</p>
      <div className="flex gap-2">
        <button
          disabled={isCreating}
          onClick={() => void handleCreateSchema()}
          className="mt-2 flex cursor-pointer self-start rounded-lg border bg-sky-400 py-2 px-6 text-white hover:shadow-lg"
        >
          {isCreating && <Loading />}
          Get Started
        </button>
        {isCustom && (
          <button
            disabled={isDeleting}
            onClick={() => void deleteSchema({ id })}
            className="mt-2 flex cursor-pointer self-start rounded-lg border border-red-400 bg-white py-2 px-6 text-red-400 hover:bg-red-400 hover:text-white hover:shadow-lg"
          >
            {isDeleting && <Loading />}
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

const UserTemplates = () => {
  const { data, isLoading } = api.scheme.getCurrentUserSchemas.useQuery({
    schemaOnly: true,
  });

  if (isLoading) return <CardLoading />;

  if (!data?.length) return <CreateNew title="No Schema Found" />;

  const userTemplates = data.map((template: Schema) => {
    const schema = generateJSON_LD(JSON.parse(template.schema) as FieldType[]);
    return {
      ...template,
      isCustom: !!template.isCustom,
      schema: JSON.stringify(schema),
    };
  });

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {userTemplates.map((template) => {
        return <TemplateCard isAuth key={template.id} template={template} />;
      })}
    </div>
  );
};

export default Home;
