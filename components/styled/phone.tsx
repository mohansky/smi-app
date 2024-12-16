import { options } from "@/.velite";
import ContactLink from "../custom-ui/contact-link"; 
import { Icon } from "@iconify/react";

export default function Phone() {
  return (
    <>
      <ul className="space-y-3">
        {options.contact.map((item, index) => (
          <li key={index}>
            <ContactLink href={item.href} className="flex" title={item.name}>
              <Icon icon={item.icon} className="w-6 h-6 mr-2 my-auto" />
              {item.name}
            </ContactLink>
          </li>
        ))}
      </ul>
    </>
  );
}
