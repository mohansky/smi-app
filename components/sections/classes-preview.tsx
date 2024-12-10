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
      <div className="absolute top-1 left-1 p-8">
        <Heading className="mb-2 text-white">{title}</Heading>
        <Card className="p-5 bg-gray-800/50 text-white mb-5">
          <CardContent>
            <Heading size="xs" fontweight="normal" className="mb-1">
              Regular Classes: <br />
              {fees}
              <br />
              {duration}
            </Heading>
            <p className="text-balance text-xs">
              Crash Course: <br /> {crashCourse}
            </p>
          </CardContent>
        </Card>
        <Link href={`${slug}`} title={title}>
          <Button size="lg">Details</Button>
        </Link>
      </div>
    </div>
  );
}
