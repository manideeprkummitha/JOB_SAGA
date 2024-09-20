"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { z } from "zod";
import { useAuth } from "@/auth/context/jwt/auth-provider"; // Assume this hook gives you authServiceId
import axios from "axios";
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

export default function ProfileForm() {
  const { authServiceId } = useAuth(); // Get the authServiceId from your authentication hook
  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {},
    mode: "onChange",
  });

  const { register, handleSubmit, setValue, control } = methods;

  const { fields: urlFields, append: appendUrl } = useFieldArray({
    name: "urls",
    control,
  });

  const { fields: skillFields, append: appendSkill } = useFieldArray({
    name: "skills",
    control,
  });

  useEffect(() => {
    async function fetchAccountDetails() {
      try {
        const response = await axios.get(`/api/accounts/${authServiceId}`);
        const accountData = response.data;

        // Populate the form with existing data
        setValue("username", accountData.username);
        setValue("email", accountData.email);
        setValue("phone", accountData.phone);
        setValue("dob", new Date(accountData.dob));
        setValue("bio", accountData.bio);
        setValue("jobTitle", accountData.jobTitle);
        setValue("company", accountData.company);
        setValue("yearsExperience", accountData.yearsExperience);
        setValue("urls", accountData.urls || []);
        setValue("skills", accountData.skills || []);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    }

    fetchAccountDetails();
  }, [authServiceId, setValue]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      const response = await axios.post("https://localhost:7006/api/accounts", {
        authServiceId,
        accountData: data, // The data object contains the form data
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        status: "success",
      });

      console.log("Account saved:", response.data);
    } catch (error) {
      console.error("Error saving account:", error);
      toast({
        title: "Error",
        description: "There was an error updating your profile.",
        status: "error",
      });
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Username */}
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" {...field} />
              </FormControl>
              <FormDescription>You can manage verified email addresses in your email settings.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
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
              <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
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
              <FormDescription>You can @mention other users and organizations to link to them.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Job Title */}
        <FormField
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
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Tech Company" {...field} />
              </FormControl>
              <FormDescription>The name of the company you are currently working for.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Years of Experience */}
        <FormField
          name="yearsExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5" {...field} />
              </FormControl>
              <FormDescription>Number of years you have been working in your field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URLs / Social Media */}
        <div>
          <FormLabel>URLs / Social Media</FormLabel>
          {urlFields.map((field, index) => (
            <FormField
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
    </FormProvider>
  );
}
