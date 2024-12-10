"use client";
import { useActionState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { demoFormSchema } from "@/lib/demoFormValidation";
import { DemoFormState } from "@/types";

export const DemoClassForm = ({
  fetchTitle,
  onDemoFormAction,
}: {
  fetchTitle: string;
  onDemoFormAction: (
    prevState: DemoFormState,
    data: FormData
  ) => Promise<DemoFormState>;
}) => {
  const [state, formAction, isPending] = useActionState(
    async (prevState: DemoFormState, data: FormData) => {
      return onDemoFormAction(prevState, data);
    },
    {
      status: "idle",
      data: {
        message: "",
        user: undefined,
        issues: [],
      },
      fetchTitle: fetchTitle,
    }
  );

  const form = useForm<z.infer<typeof demoFormSchema>>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      senderName: "",
      email: "",
      phone: "",
      title: fetchTitle,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (state.status === "success" && !state.data?.issues) {
      form.reset();
    }
  }, [state, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      form.trigger();
      return values;
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      {state?.data?.message && (
        <div
          className={`font-bold mb-5 ${
            state.data.issues ? "text-destructive" : "text-active"
          }`}
        >
          {state.data.issues ? (
            <p>Invalid Fields please check.</p>
          ) : (
            <p>{state.data.message}</p>
          )}
        </div>
      )}
      <form action={formAction} className="space-y-4 w-full">
        <input id="title" name="title" type="hidden" value={fetchTitle} />

        <FormField
          control={form.control}
          name="senderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="sm:justify-start">
          <Button size="lg" type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>

          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
};
