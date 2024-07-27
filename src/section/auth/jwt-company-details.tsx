'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/auth/context/jwt/auth-provider'; // Access the authentication context
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { userServiceAxios } from '@/utils/axios';
import Image from 'next/image';

export default function Company_Details() {
  const { userId } = useAuth(); // Access userId from context
  const router = useRouter();
  const [role, setRole] = useState('job_seeker');
  const [formData, setFormData] = useState({
    currentJobTitle: '',
    currentCompany: '',
    yearsOfExperience: '',
    linkedin: '',
    professionalSummary: '',
    skillSet: '',
    companyName: '',
    companyWebsite: '',
    recruitmentFocusAreas: '',
  });

  const authServiceId = userId;

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(`Updating ${id} to`, value);
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);

    try {
      console.log('Sending PUT request to update user details...');
      const response = await userServiceAxios.put(`/api/authService/user/${authServiceId}`, formData);
      console.log('User details updated successfully:', response.data);

      console.log('Redirecting to /home');
      router.push('/home');
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <form className="mx-auto grid w-[350px] gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">User Details</h1>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Select onValueChange={(value) => setRole(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="job_seeker">Job Seeker</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {role === 'job_seeker' ? (
              <>
                <div className="grid gap-2">
                  <Input id="currentJobTitle" type="text" placeholder="Current Job Title" value={formData.currentJobTitle} onChange={handleChange} required />
                  <Input id="currentCompany" type="text" placeholder="Current Company" value={formData.currentCompany} onChange={handleChange} required />
                  <Input id="yearsOfExperience" type="text" placeholder="Years of Experience" value={formData.yearsOfExperience} onChange={handleChange} required />
                  <Input id="linkedin" type="text" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} required />
                  <Textarea id="professionalSummary" placeholder="Professional Summary" value={formData.professionalSummary} onChange={handleChange} required />
                  <Textarea id="skillSet" placeholder="Skill Set (comma separated)" value={formData.skillSet} onChange={handleChange} required />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Input id="companyName" type="text" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />
                  <Input id="companyWebsite" type="text" placeholder="Company Website" value={formData.companyWebsite} onChange={handleChange} required />
                  <Textarea id="recruitmentFocusAreas" placeholder="Recruitment Focus Areas" value={formData.recruitmentFocusAreas} onChange={handleChange} required />
                  <Input id="linkedin" type="text" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} required />
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
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
