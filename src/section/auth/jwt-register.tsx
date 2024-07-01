import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RegisterForm() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                {/* <Label htmlFor="first-name">First name</Label> */}
                <Input id="first-name" placeholder="First Name" required />
              </div>
              <div className="grid gap-2">
                {/* <Label htmlFor="last-name">Last name</Label> */}
                <Input id="last-name" placeholder="Last Name" required />
              </div>
            </div>

            <div className="grid gap-2">
              {/* <Label htmlFor="email">Email</Label> */}
              <Input
                id="email"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                {/* <Label htmlFor="password">Password</Label> */}
              </div>
              <Input id="password" type="password" placeholder="Password" required />
            </div>

            <div className="grid gap-2">
              {/* <Label>Country</Label> */}
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="grid gap-2">
              <Label htmlFor="zipcode">ZipCode</Label>
              <Input id="zipcode" type="text" placeholder="ZipCode" required />
            </div> */}

            <div className="grid gap-2">
              {/* <Label htmlFor="whatsapp">Valid Whatsapp Number</Label> */}
              <Input id="whatsapp" type="text" placeholder="Phone Number" required />
            </div>

            <div className="grid gap-2">
              {/* <Label>User Type</Label> */}
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Job Seeker">Job Seeker</SelectItem>
                    <SelectItem value="Recruiter">Recruiter</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>
            <Button variant="outline" className="w-full">
              Register with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
