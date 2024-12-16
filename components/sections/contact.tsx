import React from "react";
import { Container } from "../custom-ui/container";
import Address from "../styled/address";
import Phone from "../styled/phone";
import SocialLinks from "../styled/social-links";
import { Heading } from "../custom-ui/heading";
import { ContactForm } from "../forms/contact-form";
import { onFormAction } from "@/app/actions/formAction";

export default function Contact() {
  return (
    <Container width="marginxy" id="contact">
      <Heading className="mb-5">Contact</Heading>
      <div className="grid md:grid-cols-2">
        <div className=" ">
          <div className="mb-5">
            <Address />
          </div>
          <div className="mb-10">
            <Phone />
          </div>
          <div className="mb-20">
            <SocialLinks />
          </div>
        </div>
        <div>
          <ContactForm onFormAction={onFormAction} />
        </div>
      </div>
    </Container>
  );
}
