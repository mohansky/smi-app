import { classes, options } from "#site/content";
// import { MDXContent } from "@/components/custom-ui/mdx-components";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { Heading } from "@/components/custom-ui/heading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DemoClassForm } from "@/components/forms/demo-class-form";
import { Button } from "@/components/ui/button";
import { onDemoFormAction } from "@/app/actions/demoFormAction";
import { Container } from "@/components/custom-ui/container";

interface ClassesPageProps {
  params: {
    slug: string[];
  };
}

async function getClassesFromParams(params: ClassesPageProps["params"]) {
  const slug = params?.slug?.join("/");
  const classe = classes.find((classe) => classe.slugAsParams === slug);

  return classe;
}

export async function generateMetadata({
  params,
}: ClassesPageProps): Promise<Metadata> {
  const classe = await getClassesFromParams(params);

  if (!classe) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", classe.title);

  return {
    title: `${classe.title} | Sridhar Musical Institute`,
    description: `Learn to play ${classe.title} from Sridhar Musical Institute. Book a demo class today or visit our institute in Ulsoor,Bangalore.`,
    authors: { name: options.author.name },
    openGraph: {
      title: classe.title,
      description: classe.description,
      type: "article",
      url: classe.slug,
      images: [
        {
          url: classe.img || " ",
          width: 1200,
          height: 630,
          alt: classe.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: classe.title,
      description: classe.description,
    },
  };
}

export async function generateStaticParams(): Promise<
  ClassesPageProps["params"][]
> {
  return classes.map((classe) => ({ slug: classe.slugAsParams.split("/") }));
}

export default async function ClassePage({ params }: ClassesPageProps) {
  const classe = await getClassesFromParams(params);

  if (!classe || !classe.published) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: classe.title,
    image: classe.img,
    description: classe.description,
  };

  return (
    <Container width="marginy">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Heading className="text-center mb-10" asChild={true}>
        <h1> {classe.title} </h1>
      </Heading>
      <article className="flex flex-wrap gap-8">
        <Image
          src={classe.img!}
          className="lg:w-1/2 h-auto object-cover"
          alt={classe.title}
          title={classe.title}
          width={640}
          height={480}
        />
        <div>
          <Heading size="sm" className="mb-5">
            Course Overview
          </Heading>
          <ul className="mb-10 list-inside list-decimal">
            {classe.overview.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <Card>
            <CardContent className="p-5 flex flex-wrap gap-5">
              <div>
                <Heading size="sm">Details</Heading>
                <p className="mt-5 font-semibold">Regular Classes:</p>
                <p>{classe.fees}</p>
                <p>{classe.duration}</p>
                <p className="mt-5 font-semibold">Crash Course:</p>
                <p>{classe.crashCourse}</p>
                <p className="mt-5 font-semibold">{classe.admission}</p>
              </div>
              <div>
                <Heading size="xs" className="mb-5">
                  Register for a demo class.
                </Heading>
                <div className="flex place-content-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Book Demo</Button>
                    </DialogTrigger>
                    <DialogContent
                      className="sm:max-w-md"
                      aria-describedby={undefined}
                    >
                      <DialogHeader>
                        <DialogTitle>Register for a demo class.</DialogTitle>
                      </DialogHeader>
                      <DemoClassForm
                        fetchTitle={classe.title}
                        onDemoFormAction={onDemoFormAction}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>

      {/* <MDXContent code={classe.body || " "} /> */}
    </Container>
  );
}
