import { Heading } from "../custom-ui/heading";
import ContactLink from "../custom-ui/contact-link";
import { Icon } from "@iconify/react";
import { options } from "@/.velite";

export default function SocialLinks() {
  return (
    <>
      <Heading variant="cardtitle" size="md" className="mb-5">
        Follow us{" "}
      </Heading>

      <ul className="flex space-x-5">
        {options.socials.map((item, index) => (
          <li key={index}>
            <ContactLink href={item.link} title={item.name}>
              <Icon icon={item.icon} className="w-10 h-10" />
            </ContactLink>
          </li>
        ))}
      </ul>
    </>
  );
}
