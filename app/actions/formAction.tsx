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
  
  // Extract honeypot field
  const honeypotValue = formData.get('website');
  
  // Check if honeypot field is filled (if it is, it's likely a bot)
  if (honeypotValue) {
    console.log("Spam detected via honeypot");
    // Return success without actually sending an email
    // This silently fails for bots without letting them know why
    return {
      status: "success",
      data: {
        message: "Form submitted. Thank you for your interest.",
        user: undefined,
        issues: undefined,
      },
    };
  }
  
  const data = Object.fromEntries(formData);
  const parsed = formSchema.safeParse(data);
  
  if (parsed.success) {
    // Additional spam checks
    if (isSpamMessage(parsed.data.message) || isSpamEmail(parsed.data.email)) {
      console.log("Spam detected via content analysis");
      // Return success without actually sending an email
      return {
        status: "success",
        data: {
          message: "Form submitted. Thank you for your interest.",
          user: parsed.data,
          issues: undefined,
        },
      };
    }
    
    // Only send email for legitimate submissions
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

// Helper functions to detect spam
function isSpamMessage(message: string): boolean {
  // Check for spam patterns in the message
  const spamPatterns = [
    /buy viagra/i,
    /casino/i,
    /\bloan\b/i,
    /\bcheap\b.*\bmedication\b/i,
    /\bmake money fast\b/i,
    /https?:\/\/(?!.*mohankumar\.dev)/i, // Links to external domains (adjust with your domain)
  ];
  
  return spamPatterns.some(pattern => pattern.test(message));
}

function isSpamEmail(email: string): boolean {
  // Check for known spam email domains
  const spamDomains = [
    /\.xyz$/i,
    /\.top$/i,
    /temporary-mail\.net/i,
    /disposable-email\.com/i,
    /temp-mail\./i,
    /10minutemail\./i,
  ];
  
  return spamDomains.some(pattern => pattern.test(email));
}


// import { ContactFormEmailTemplate } from "@/components/emails/contact-form-email-template";
// import { formSchema } from "@/lib/formValidation";
// import { ActionState } from "@/types";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const onFormAction = async (
//   prevState: ActionState,
//   formData: FormData
// ): Promise<ActionState> => {
//   "use server";
//   const data = Object.fromEntries(formData);
//   const parsed = formSchema.safeParse(data);

//   if (parsed.success) {
//     await resend.emails.send({
//       from: "MK <mail@mohankumar.dev>",
//       to: "mohansky@gmail.com",
//       subject: `Enquiry from ${parsed.data.senderName}`,
//       replyTo: parsed.data.email as string,
//       react: ContactFormEmailTemplate({
//         senderName: parsed.data.senderName as string,
//         phone: parsed.data.phone as string,
//         email: parsed.data.email as string,
//         message: parsed.data.message as string,
//       }),
//     });
//     return {
//       status: "success",
//       data: {
//         message: "Form submitted. Thank you for your interest.",
//         user: parsed.data,
//         issues: undefined,
//       },
//     };
//   } else {
//     return {
//       status: "error",
//       data: {
//         message: parsed.error.issues.map((issue) => issue.message),
//         issues: parsed.error.issues.map((issue) => issue.message),
//         user: undefined,
//       },
//     };
//   }
// };
