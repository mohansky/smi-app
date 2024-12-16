import * as React from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text, 
  Img,
} from "@react-email/components";
import { options } from "@/.velite";

// const baseUrl = `https://sridharmusicalinstitute.com/public/images/smilogoold.png`;
const baseUrl = `${options.basepath}` ? `https://${options.basepath}` : "";

interface EmailTemplateProps {
  senderName: string;
  phone: string;
  email: string;
  title?: string;
}

export const DemoClassEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  senderName,
  phone,
  email,
  title,
}) => (
  <Html>
    <Head />
    <Preview>Enquiry from {senderName}.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          // src={`${baseUrl}`}
          src={`${baseUrl}/public/images/smilogo-tp.svg`}
          width="170"
          height="50"
          alt="Sridhar Musical Institute"
          style={logo}
        />
        <Section style={box}>
          <Text style={heading1}>
            Demo {title} class for {senderName}!{" "}
          </Text>
          <Text style={paragraph}>
            Email:{" "}
            <Link style={anchor} href={`mailto:${email}`}>
              {email}
            </Link>
          </Text>
          <Text style={paragraph}>
            Phone:{" "}
            <Link style={anchor} href={`telto:${phone}`}>
              {phone}
            </Link>
          </Text>
          <Text style={paragraph}>
            Hi I am interested in {title} classes please call me on {phone}
            <Link style={anchor} href={`telto:${phone}`}>
              {phone}
            </Link>{" "}
            .
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Sridhar Musical Institute 17/ 1 Cambridge Road Ulsoor Bangalore,
            India <br />{" "}
            <Link style={anchor} href="telto:+91 819 775 4070">
              +91 819 775 4070
            </Link>{" "}
            <Link
              style={anchor}
              href="mailto:sridharmusicalinstitute@gmail.com"
            >
              sridharmusicalinstitute@gmail.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const logo = {
  margin: "0 auto",
};

const heading1 = {
  color: "#525f7f",
  fontSize: "24px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#556cd6",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
