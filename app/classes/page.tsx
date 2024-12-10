import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/custom-ui/heading";
import { Container } from "@/components/custom-ui/container";
import { classes, options } from "@/.velite";


interface ClassProps {
  title: string;
  description?: string | undefined;
  crashCourse?: string | undefined;
  img?: string | undefined;
  duration?: string | undefined;
  slug: string;
  weight: number;
  published: boolean;
  admission?: string | undefined;
}

export default async function ClassesPage() {
  const orderedProducts = classes.sort((classe1, classe2) =>
    classe1.weight > classe2.weight ? 1 : -1
  );
  const displayClasses = orderedProducts.filter((classe) => classe.published);

  return (
    <Container width="marginy">
      <Heading
        className="w-5/6 text-center text-balance mx-auto my-10"
        size="md"
        fontweight="medium"
      >
        {options.classesTitle}
      </Heading>

      {displayClasses?.length > 0 ? (
        <ul className="mt-20">
          {displayClasses.map((classe: ClassProps) => (
            <Card
              key={classe.slug}
              className="border-0 rounded-none flex flex-row flex-wrap even:flex-row-reverse"
            >
              <Image
                className="lg:w-1/2 "
                src={classe.img || ""}
                alt={classe.title}
                title={classe.title}
                width={720}
                height={480}
              />

              <div className="p-10 lg:w-1/2 ">
                <h2 className="font-bold text-3xl mb-10">{classe.title}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="col-span-2 md:col-span-1 p-5">
                    <Heading size="sm">Regular class</Heading>
                    <p>{classe.description}</p>
                  </Card>
                  <Card className="col-span-2 md:col-span-1 p-5">
                    <Heading size="sm">Crash Course</Heading>
                    <p>{classe.crashCourse}</p>
                  </Card>
                  <Card className="col-span-2 p-5">
                    <p className="font-semibold">{classe.admission}</p>
                  </Card>
                </div>
                <Link href={`${classe.slug}`} title={classe.title}>
                  <Button className="my-5">Learn more</Button>
                </Link>
              </div>
            </Card>
          ))}
        </ul>
      ) : (
        <p> No posts</p>
      )}
    </Container>
  );
}
