import { options } from "@/.velite";
import React from "react";
import Image from "next/image";
import { Container } from "@/components/custom-ui/container";
import { Heading } from "@/components/custom-ui/heading";

export default function Gallery() {
  return (
    <>
      <Container width="marginxy">
        <Heading className="text-center mb-10">Gallery</Heading>

        <iframe
          className="w-1/2 aspect-video mx-auto my-10 rounded-lg"
          // width="560"
          // height="315"
          src={options.featuredVideo}
          // src="https://www.youtube.com/embed/L90F-dqohu4?si=QrXMWy6pZXsQrmvX"
          title="YouTube video player"
          // frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {options.gallery.map((item, index) => (
            <li key={index}>
              <Image
                className="rounded-lg"
                src={item.image}
                alt={item.title}
                width={720}
                height={480}
              />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
