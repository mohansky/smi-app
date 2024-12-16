import React from "react";
import Image from "next/image";
import Address from "../styled/address";
import Contact from "../styled/phone";
import SocialLinks from "../styled/social-links";
import { Heading } from "../custom-ui/heading";
import { options } from "@/.velite";

export default function Footer() {
  return (
    <>
      <footer className="border-t-2 border-primary bg-accent">
        <div className="py-10 px-20 flex flex-wrap space-y-10"> 
          <div className="lg:basis-1/3">
            <Image
              className="mb-5 w-52 h-auto"
              src={options?.logo || ""}
              alt={options.title}
              title={options.title}
              width={200}
              height={180}
            />
            <Address />
          </div>
          <div className="lg:basis-1/3">
            <Heading variant="cardtitle" size="md" className="mb-5">
              Get in touch
            </Heading>
            <Contact />
          </div>
          <div className="lg:basis-1/3">
            <SocialLinks />
          </div>
        </div> 
        <div className="flex justify-between border-t border-muted-foreground/50 text-muted-foreground/50 text-xs p-1">
          <p className="m-0">© {new Date().getFullYear()}, Property of SMI</p>
          <p className="m-0">
            Designed and Developed by
            <a
              className="footer-link"
              href="https://mohankumar.dev/"
              target="_blank"
              title="Mohan Kumar"
            >
              {" "}
              Mohan{" "}
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
