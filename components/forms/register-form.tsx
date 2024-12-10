// "use client";
// import { useActionState, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { createUser } from "@/app/actions/users";
// import { toast } from "sonner";
// import { useEffect } from "react";
// import { Eye, EyeOff } from "lucide-react";

// export function RegisterForm() {
//   const [state, formAction, isPending] = useActionState(createUser, null);
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (state?.success) {
//       toast.success(state.success);
//       router.push("/login");
//     }
//     if (state?.error) {
//       toast.error(state.error);
//     }
//   }, [state, router]);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Register</CardTitle>
//         <CardDescription>Create a new account to get started</CardDescription>
//       </CardHeader>
//       <form action={formAction}>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <label htmlFor="name">User Name</label>
//             <Input
//               id="name"
//               name="name"
//               type="name"
//               placeholder="Enter your user Name"
//               required
//             />
//           </div>
//           <div className="space-y-2 relative">
//             <label htmlFor="email">Email</label>
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           <div className="space-y-2 relative">
//             <label htmlFor="password">Password</label>
//             <div className="relative">
//               <Input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 required
//                 className="pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={togglePasswordVisibility}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
//               >
//                 {showPassword ? (
//                   <EyeOff className="h-5 w-5" />
//                 ) : (
//                   <Eye className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="role">Role</label>
//             <Select name="role" defaultValue="USER">
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="USER">User</SelectItem>
//                 <SelectItem value="ADMIN">Admin</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button className="w-full" type="submit" disabled={isPending}>
//             {isPending ? "Creating account..." : "Register"}
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// }


"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"; 
import { createUser } from "@/app/actions/users";
import { UserSchema } from "@/lib/validations/user";
 

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize the form with react-hook-form and zod
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      // role: "USER"
    }
  });

  // Handle form submission
  // const onSubmit = async (values: z.infer<typeof UserSchema>) => {
  //   try {
  //     const result = await createUser(null, values);
      
  //     if (result?.success) {
  //       toast.success(result.success);
  //       router.push("/login");
  //     } else if (result?.error) {
  //       toast.error(result.error);
  //     }
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //     toast.error("An unexpected error occurred");
  //   }
  // };

  const onSubmit = async (values: z.infer<typeof UserSchema>) => {
    try {
      const formData = new FormData();
      (Object.keys(values) as Array<keyof typeof values>).forEach(key => {
        formData.append(key, values[key] as string);
      });
  
      const result = await createUser(null, formData);
      
      if (result?.success) {
        toast.success(result.success);
        router.push("/login");
      } else if (result?.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your user name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      type="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Enter your password" 
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        {...field} 
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Select */}
            {/* <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </CardContent>

          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating account..." : "Register"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}