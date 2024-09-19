"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/auth/context/jwt/auth-provider"; // Assume this hook gives you authServiceId
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

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

export function NotificationsForm() {
  const { authServiceId } = useAuth(); // Get the authServiceId from your authentication hook
  const { register, handleSubmit, setValue } = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    async function fetchNotificationSettings() {
      try {
        const response = await axios.get(`/api/accounts/${authServiceId}`);
        const accountData = response.data;

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
    try {
      const response = await axios.post("https://localhost:7006/api/accounts", {
        authServiceId,
        accountData: data, // The data object contains the form data
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
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <form className="space-y-6">
        <FormField
          control={register.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notify me about...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="all" />
                    </FormControl>
                    <FormLabel className="font-normal">All new messages</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="mentions" />
                    </FormControl>
                    <FormLabel className="font-normal">Direct messages and mentions</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="none" />
                    </FormControl>
                    <FormLabel className="font-normal">Nothing</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={register.control}
              name="communication_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Communication emails</FormLabel>
                    <FormDescription>Receive emails about your account activity.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={register.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Marketing emails</FormLabel>
                    <FormDescription>Receive emails about new products, features, and more.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={register.control}
              name="social_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Social emails</FormLabel>
                    <FormDescription>Receive emails for friend requests, follows, and more.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={register.control}
              name="security_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Security emails</FormLabel>
                    <FormDescription>Receive emails about your account activity and security.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Update Notifications</Button>
      </form>
    </Form>
  );
}
