'use client';

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray, FormProvider } from "react-hook-form";
import { Plus, Loader2 } from "lucide-react"; // Import the loader icon
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/auth/context/jwt/auth-provider";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast"; // Import the toast component

// Define Zod schema for validation
const profileFormSchema = z.object({
  userType: z.enum(["jobSeeker", "recruiter"], { required_error: "Please select a user type." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(30, { message: "Username must not be longer than 30 characters." }),
  email: z.string({ required_error: "Please enter an email to display." }).email(),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).max(15, { message: "Phone number must not be longer than 15 digits." }),
  bio: z.string().max(160).min(0).optional(),
  jobTitle: z.string().min(2, { message: "Job title must be at least 2 characters." }).optional(),
  company: z.string().min(2, { message: "Company must be at least 2 characters." }).optional(),
  yearsExperience: z.number().min(0, { message: "Years of experience must be a positive number." }).max(50, { message: "Years of experience must be less than 50." }).optional(),
  recruiterCompany: z.string().min(2, { message: "Company name must be at least 2 characters." }).optional(),
  recruiterIndustry: z.string().min(2, { message: "Industry must be at least 2 characters." }).optional(),
  recruiterPosition: z.string().min(2, { message: "Position must be at least 2 characters." }).optional(),
  urls: z.array(z.object({ value: z.string().url({ message: "Please enter a valid URL." }) })).optional(),
  skills: z.array(z.string().min(1, { message: "Skill must be at least 1 character." })).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function ProfileForm() {
  const { userId: authServiceId } = useAuth(); // Get the authServiceId from your authentication hook
  const [loading, setLoading] = useState(false); // Manage loading state

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      urls: [{ value: "" }], // Ensure one input is always present for URLs
      skills: [""], // Ensure one input is always present for skills
    },
    mode: "onChange",
  });

  const { setValue, control, getValues } = methods;
  const { fields: urlFields, append: appendUrl } = useFieldArray({ name: "urls", control });
  const { fields: skillFields, append: appendSkill } = useFieldArray({ name: "skills", control });

  useEffect(() => {
    async function fetchAccountDetails() {
      try {
        console.log("Fetching account details for:", authServiceId);
        const response = await axios.get(`http://localhost:7002/api/authService/user/${authServiceId}`);
        const accountData = response.data.user;
        console.log("Fetched account data:", accountData);

        // Populate the form with existing data
        setValue("username", `${accountData.firstName} ${accountData.lastName}`);
        setValue("email", accountData.email);
        setValue("phone", accountData.phone);
        setValue("bio", accountData.bio || "");

        if (accountData.userType === "jobSeeker") {
          setValue("jobTitle", accountData.currentJob?.title || "");
          setValue("company", accountData.currentJob?.company || "");
          setValue("yearsExperience", accountData.currentJob?.yearsOfExperience || 0);
          setValue("skills", accountData.skillSet || [""]);
        } else if (accountData.userType === "recruiter") {
          setValue("recruiterCompany", accountData.recruiterCompany || "");
          setValue("recruiterIndustry", accountData.recruiterIndustry || "");
          setValue("recruiterPosition", accountData.recruiterPosition || "");
        }

        setValue("urls", accountData.urls || [{ value: "" }]);
      } catch (error) {
        console.error("Error fetching account details:", error);
      }
    }

    fetchAccountDetails();
  }, [authServiceId, setValue]);

  // Directly update profile data when the button is clicked
  async function handleUpdate() {
    setLoading(true); // Set loading to true
    const formData = getValues(); // Get form values directly
    try {
      console.log("Submitting form data:", formData);
      const response = await axios.put(`http://localhost:7002/api/authService/user/${authServiceId}`, {
        accountData: formData,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        status: "success",
      });

      console.log("Profile settings updated:", response.data);
    } catch (error) {
      console.error("Error updating profile settings:", error);
      toast({
        title: "Error",
        description: "There was an error updating your profile.",
        status: "error",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <FormProvider {...methods}>
      <form className="space-y-8">
        <div className="max-w-lg mx-auto space-y-6">
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
                  <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Fields */}
          {methods.watch("userType") === "jobSeeker" && (
            <>
              <FormField
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="yearsExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <div className="flex items-center justify-between">
                  <FormLabel>Skills</FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendSkill("")} className="ml-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
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
              </div>
            </>
          )}

          {/* Recruiter Fields */}
          {methods.watch("userType") === "recruiter" && (
            <>
              <FormField
                name="recruiterCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="recruiterIndustry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Industry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="recruiterPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Position" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* URLs / Social Media */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>URLs / Social Media</FormLabel>
              <Button type="button" variant="outline" size="sm" onClick={() => appendUrl({ value: "" })} className="ml-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
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
          </div>

          {/* Update Button */}
          <Button type="button" className="w-full" onClick={handleUpdate} disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Profile"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6 px-8 py-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
