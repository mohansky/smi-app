import React from "react";
import { options } from "@/.velite";
import { Heading } from "../custom-ui/heading";

export default function Timmings() {
  return (
    <>
      <Heading className="mb-5">Timings</Heading>
      <ul className="space-y-2">
        {options.timmings.map((item, index) => (
          <li key={index} className="font-semibold flex flex-row">
            <p>
              <strong> {item.day}</strong>:&nbsp; {item.time}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
