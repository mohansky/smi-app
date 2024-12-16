import { options } from "@/.velite"; 
import { Icon } from "@iconify/react";
import ContactLink from "../custom-ui/contact-link";

export default function Address() {
  return (
    <>
      <ContactLink href={options.address.href} title="Address">
        <div className="flex">
          <Icon icon={options.address.icon} className="w-6 h-6 mr-2 " />
          <ul className="flex flex-col">
            {options.address.name.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </ContactLink>
    </>
  );
}
