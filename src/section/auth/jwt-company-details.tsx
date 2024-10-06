'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams to get query parameters
import { useAuth } from '@/auth/context/jwt/auth-provider';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { userServiceAxios } from '@/utils/axios';
import Image from 'next/image';

export default function Company_Details() {
  const { userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams(); // Use useSearchParams hook
  const [role, setRole] = useState('');
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

  // Retrieve userType from search parameters
  useEffect(() => {
    const userType = searchParams.get('userType'); // Use searchParams to get 'userType' from the URL
    if (userType) {
      setRole(userType.trim()); // Set the role and trim any extra spaces
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userServiceAxios.put(`/api/authService/user/${authServiceId}`, formData);
      router.push('/home');
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <form className="mx-auto grid w-[350px] gap-6" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center">User Details</h1>

          {/* Conditionally Render Form Fields Based on userType */}
          {role === 'jobSeeker' ? (
            <>
              <Input id="currentJobTitle" type="text" placeholder="Current Job Title" value={formData.currentJobTitle} onChange={handleChange} required />
              <Input id="currentCompany" type="text" placeholder="Current Company" value={formData.currentCompany} onChange={handleChange} required />
              <Input id="yearsOfExperience" type="text" placeholder="Years of Experience" value={formData.yearsOfExperience} onChange={handleChange} required />
              <Input id="linkedin" type="text" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} required />
              {/* <Textarea id="professionalSummary" placeholder="Professional Summary" value={formData.professionalSummary} onChange={handleChange} required /> */}
              {/* <Textarea id="skillSet" placeholder="Skill Set (comma separated)" value={formData.skillSet} onChange={handleChange} required /> */}
              <div className='flex items-center justify-between'>
                
              </div>
            </>
          ) : role === 'recruiter' ? (
            <>
              <Input id="companyName" type="text" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />
              <Input id="companyWebsite" type="text" placeholder="Company Website" value={formData.companyWebsite} onChange={handleChange} required />
              <Textarea id="recruitmentFocusAreas" placeholder="Recruitment Focus Areas" value={formData.recruitmentFocusAreas} onChange={handleChange} required />
              <Input id="linkedin" type="text" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} required />
            </>
          ) : (
            <p className="text-red-500">Invalid user type. Please go back and register again.</p>
          )}

          <Button type="submit" className="w-full">
            Submit
          </Button>
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
