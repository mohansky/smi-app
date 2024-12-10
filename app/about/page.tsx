import React from "react";
import Image from "next/image";
import { Heading } from "@/components/custom-ui/heading";
import { Container } from "@/components/custom-ui/container"; 
import { options } from "@/.velite";

export default function About() {
  return (
    <>
      <Container width="marginxy">
        <Heading className="text-center">{options.about.title}</Heading>
        <Image
          className="mx-auto my-10 rounded-full"
          alt="Sridhar Stephen Joseph "
          src="/images/steve.jpg"
          title="Sridhar Stephen Joseph"
          width="300"
          height="300"
        />
        {options.about.body.map((item, index) => (
          <p key={index} className=" max-w-4xl mx-auto mb-5 text-lg text-justify leading-loose">
            {item}
          </p>
        ))}
      </Container>
    </>
  );
}
