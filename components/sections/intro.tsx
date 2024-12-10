import { Container } from "../custom-ui/container";
import { Heading } from "../custom-ui/heading";
import { options } from "@/.velite";

export default function Intro() {
  return (
    <>
      <Container width="marginxy">
        <Heading
          size="sm"
          fontweight="medium"
          className="text-center text-balance"
        >
          {options.intro}
        </Heading>
      </Container>
    </>
  );
}
