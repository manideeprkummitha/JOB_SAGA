"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

// Extend the schema to include all required details
const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  email: z
    .string({ required_error: "Please enter an email to display." })
    .email(),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must not be longer than 15 digits." }),
  dob: z.date({ required_error: "A date of birth is required." }),
  bio: z.string().max(160).min(4),
  jobTitle: z
    .string()
    .min(2, { message: "Job title must be at least 2 characters." }),
  company: z
    .string()
    .min(2, { message: "Company must be at least 2 characters." }),
  yearsExperience: z
    .number()
    .min(0, { message: "Years of experience must be a positive number." })
    .max(50, { message: "Years of experience must be less than 50." }),
  // resume: z.string().url({ message: "Please enter a valid URL." }).optional(),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
  skills: z
    .array(z.string().min(1, { message: "Skill must be at least 1 character." }))
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  username: "JohnDoe",
  email: "johndoe@example.com",
  phone: "1234567890",
  dob: new Date("1990-05-15"),
  bio: "I own a computer.",
  jobTitle: "Software Engineer",
  company: "Tech Company",
  yearsExperience: 5,
  resume: "https://example.com/current_resume.pdf",
  urls: [
    { value: "https://linkedin.com/in/johndoe" },
    { value: "https://github.com/johndoe" },
  ],
  skills: ["JavaScript", "React", "Node.js"],
};

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields: urlFields, append: appendUrl } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  const { fields: skillFields, append: appendSkill } = useFieldArray({
    name: "skills",
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" {...field} />
              </FormControl>
              <FormDescription>
                You can manage verified email addresses in your email settings.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormDescription>Your contact number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Date of Birth */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can @mention other users and organizations to link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Job Title */}
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormDescription>Your current job title or position.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Company */}
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Tech Company" {...field} />
              </FormControl>
              <FormDescription>
                The name of the company you are currently working for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Years of Experience */}
        <FormField
          control={form.control}
          name="yearsExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5" {...field} />
              </FormControl>
              <FormDescription>
                Number of years you have been working in your field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Current Resume */}
        {/* <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Resume</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/current_resume.pdf" {...field} />
              </FormControl>
              <FormDescription>Provide a link to your current resume.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        
        {/* URLs / Social Media */}
        <div>
          <FormLabel>URLs / Social Media</FormLabel>
          {urlFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => appendUrl({ value: "" })}
          >
            Add URL
          </Button>
        </div>
        
        {/* Skills */}
        <div>
          <FormLabel>Skills</FormLabel>
          {skillFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`skills.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter a skill" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => appendSkill("")}
          >
            Add Skill
          </Button>
        </div>

        <Button type="submit">Update Profile</Button>
      </form>
    </Form>
  );
}
