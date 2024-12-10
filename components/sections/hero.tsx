"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heading } from "../custom-ui/heading";
import { Button } from "../ui/button";
import { options } from "@/.velite";

export default function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[plugin.current]}
      className="relative w-full h-screen"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      {/* <Image
        className="absolute top-0 left-0 w-screen h-screen object-cover"
        width={1920}
        height={1080}
        src="/images/classes/guitar.jpg"
        alt={options.title}
        title={options.title}
      /> */}
      <CarouselContent className="">
        {options.heroslider.map((item, index) => (
          <CarouselItem key={index}>
            <div className="relative w-screen h-screen">
              <Image
                className="absolute top-0 left-0 w-screen h-screen object-cover"
                width={1920}
                height={1080}
                src={item.image || "/images/classes/guitar.jpg"}
                alt={item.title}
                title={item.title}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-white w-full text-center">
                <Heading
                  size="xl"
                  fontstyle="display"
                  className="mb-5"
                  asChild={true}
                >
                  <h1>{item.title}</h1>
                </Heading>
                <Heading
                  size="md"
                  fontweight="medium"
                  className="mb-5 w-10/12 text-balance mx-auto"
                >
                  {item.subtitle}
                </Heading>
                <Link href={item.link}>
                  <Button size="lg" className="uppercase font-semibold">
                    {item.btnText}
                  </Button>
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absoute left-2" />
      <CarouselNext className="absoute right-2" />
    </Carousel>
  );
}
