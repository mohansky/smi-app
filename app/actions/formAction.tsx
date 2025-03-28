import { ContactFormEmailTemplate } from "@/components/emails/contact-form-email-template";
import { formSchema } from "@/lib/formValidation";
import { ActionState } from "@/types";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const onFormAction = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  "use server";
  const data = Object.fromEntries(formData);
  const parsed = formSchema.safeParse(data);

  if (parsed.success) {
    await resend.emails.send({
      from: "MK <mail@mohankumar.dev>",
      to: "mohansky@gmail.com",
      subject: `Enquiry from ${parsed.data.senderName}`,
      replyTo: parsed.data.email as string,
      react: ContactFormEmailTemplate({
        senderName: parsed.data.senderName as string,
        phone: parsed.data.phone as string,
        email: parsed.data.email as string,
        message: parsed.data.message as string,
      }),
    });
    return {
      status: "success",
      data: {
        message: "Form submitted. Thank you for your interest.",
        user: parsed.data,
        issues: undefined,
      },
    };
  } else {
    return {
      status: "error",
      data: {
        message: parsed.error.issues.map((issue) => issue.message),
        issues: parsed.error.issues.map((issue) => issue.message),
        user: undefined,
      },
    };
  }
};
