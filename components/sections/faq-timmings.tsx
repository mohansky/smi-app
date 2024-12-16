import React from "react";
import FAQ from "../styled/faq";
import Timmings from "../styled/timmings";
import { Container } from "../custom-ui/container";

export default function FAQTimmings() {
  return (
    <Container width="marginxy">
      <div className="grid md:grid-cols-2 gap-20">
        <div>
          <FAQ />
        </div>
        <div>
          <Timmings />
        </div>
      </div>
    </Container>
  );
}
