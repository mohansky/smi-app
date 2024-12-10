import { z } from "zod";

// phone validation (India)
const phoneValidation = new RegExp(
  /^(?:(?:\+|00)?(91)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/
);

export const demoFormSchema = z.object({
  senderName: z.string().trim().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().trim()
  .min(10, { message: 'Must have at least 10 digits.' })
  .regex(phoneValidation, { message: 'Invalid phone number.' }), 
  email: z.string().trim().email({
    message: "Invalid email.",
  }),
  title: z.string(),
});
