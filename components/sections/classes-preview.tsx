import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Heading } from "../custom-ui/heading";
import { Card, CardContent } from "../ui/card";

interface ClassProps {
  title: string;
  slug: string;
  img?: string | undefined;
  duration?: string | undefined;
  fees?: string | undefined;
  crashCourse?: string | undefined;
}

export default function ClassesPreview({
  title,
  slug,
  img,
  duration,
  fees,
  crashCourse,
}: ClassProps) {
  return (
    <div className="relative min-h-96">
      <Image
        title={title}
        alt={title}
        src={img || ""}
        className="w-full h-auto min-h-96 object-cover"
        width={640}
        height={480}
      />
      <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-black/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Heading fontweight="bold" className="mb-2 text-white text-center">
          {title}
        </Heading>
        <Card className="p-5 bg-gray-800/50 text-white mb-5">
          <CardContent>
            <Heading size="xs" fontweight="semibold" className="mb-1">
              Regular Classes:
            </Heading>
            <p className="text-balance">{fees}</p>
            <p className="text-balance text-sm">{duration}</p>
            <Heading size="xs" fontweight="semibold" className="mt-3 mb-1">
              Crash Course:
            </Heading>
            <p className=" text-sm">{crashCourse}</p>
          </CardContent>
        </Card>
        <Link href={`${slug}`} title={title}>
          <Button size="lg" className="w-full">
            Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
