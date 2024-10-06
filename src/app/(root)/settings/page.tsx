"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/auth/context/jwt/auth-provider"; // Assume this hook gives you authServiceId
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react"; // Import the loader icon

// Simplify the schema for the form with zod
const notificationsFormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

function NotificationsForm() {
  const { userId: authServiceId } = useAuth(); // Get the authServiceId from your authentication hook
  const [loading, setLoading] = useState(false); // Manage loading state

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      type: "all", // Default to "all"
      communication_emails: false,
      social_emails: false,
      marketing_emails: false,
      security_emails: true,
    },
  });

  useEffect(() => {
    async function fetchNotificationSettings() {
      try {
        const response = await axios.get(`http://localhost:7002/api/authService/user/${authServiceId}`);
        const accountData = response.data.user;

        // Populate the form with existing notification data
        setValue("type", accountData.notificationType || "all");
        setValue("communication_emails", accountData.communication_emails);
        setValue("social_emails", accountData.social_emails);
        setValue("marketing_emails", accountData.marketing_emails);
        setValue("security_emails", accountData.security_emails);
      } catch (error) {
        console.error("Error fetching notification details:", error);
      }
    }

    fetchNotificationSettings();
  }, [authServiceId, setValue]);

  async function onSubmit(data: NotificationsFormValues) {
    setLoading(true); // Set loading to true when the form is submitted
    try {
      const response = await axios.put(`http://localhost:7002/api/authService/user/${authServiceId}`, {
        accountData: data,
      });

      toast({
        title: "Notifications updated",
        description: "Your notification settings have been successfully updated.",
        status: "success",
      });

      console.log("Notification settings saved:", response.data);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error",
        description: "There was an error updating your notification settings.",
        status: "error",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Notify me about... */}
      <div className="max-w-lg mx-auto space-y-6">
        <label className="block text-sm font-medium">Notify me about...</label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-2 mt-2"
            >
              <label className="flex items-center space-x-3">
                <RadioGroupItem value="all" />
                <span className="font-normal">All new messages</span>
              </label>
              <label className="flex items-center space-x-3">
                <RadioGroupItem value="none" />
                <span className="font-normal">Nothing</span>
              </label>
            </RadioGroup>
          )}
        />
        {errors.type && (
          <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Email Notifications */}
      <div className="max-w-lg mx-auto space-y-6">
        <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
        <div className="space-y-4">
          {/* Communication Emails */}
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <label className="block text-base font-medium">
                Communication emails
              </label>
              <p className="text-sm text-gray-500">
                Receive emails about your account activity.
              </p>
            </div>
            <Controller
              name="communication_emails"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          {/* Marketing Emails */}
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <label className="block text-base font-medium">
                Marketing emails
              </label>
              <p className="text-sm text-gray-500">
                Receive emails about new products, features, and more.
              </p>
            </div>
            <Controller
              name="marketing_emails"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          {/* Security Emails */}
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <label className="block text-base font-medium">Security emails</label>
              <p className="text-sm text-gray-500">
                Receive emails about your account activity and security.
              </p>
            </div>
            <Controller
              name="security_emails"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="max-w-lg mx-auto space-y-6">
        <Button type="submit" className="mt-4" disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Notifications"}
        </Button>
      </div>
    </form>
  );
}

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6 px-8 py-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  );
}
