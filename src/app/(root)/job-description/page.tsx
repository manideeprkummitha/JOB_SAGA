'use client'

import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Building, Briefcase, UsersRound, Bookmark } from "lucide-react"
import logoImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed

export default function JobDescription() {
  return (
    <div className="flex h-full w-full flex-col p-6 pb-10 text-white lg:p-6 mb-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-start gap-4 mb-6">
          <Image src={logoImage} alt="Company Logo" width={60} height={60} />
          <div className="flex-1">
            <h1 className="text-3xl font-semibold">Software Engineer</h1>
            <p className="text-gray-300">Bengaluru, Karnataka, India · 4 days ago · Over 100 applicants</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                Remote
              </span>
              <span className="inline-flex items-center gap-1">
                . Full-time
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1">
                <Building className="h-4 w-4" />
                10,001+ employees · Software Development
              </span>
              <span className="inline-flex items-center gap-1">
                <UsersRound className="h-4 w-4" />
                9 school alumni work here•
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button className="bg-black text-white">Apply Now</Button>
            <Button variant="outline" className="text-gray-700 border-gray-300 flex items-center">
              Save
              <Bookmark className="ml-2" size={16} />
            </Button>
          </div>
        </div>
        <div className="bg-zinc-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold ">About the Job</h2>
          <p className="mt-4">
            Myntra’s Engineering team builds the technology platform that empowers our customers’ shopping experience and enables the smooth flow of products from suppliers to our customers’ doorsteps. We work on areas such as building massive-scale web-applications, engaging user-interfaces, big-data analytics, mobile apps, workflow systems, inventory management, etc. We are a small technology team where each individual makes a huge impact. You will have the opportunity to be part of a rapidly growing organization and gain exposure to all parts of a comprehensive e-commerce platform.
          </p>
          <h3 className="mt-6 text-lg font-semibold">About Team</h3>
          <p className="mt-2">
            You will be a part of: Storefront (SF)
          </p>
          <p className="mt-2">
            If you are enthusiastic to work on Myntra Storefront customer-facing technology platform built for extremely high scale, working on cutting-edge open source technologies, designing & architecting highly performant fault-tolerant systems serving 10s of millions of requests each day scaling to 100s of millions of requests on high sale events then Myntra Storefront is the right place to be.
          </p>
          <p className="mt-2">
            To manage 10s of millions of requests each day scaling to 100s of millions of requests on high sale events Myntra SF Engineering team builds the technology platform that personalizes our customer’s shopping experience and enables the smooth flow of products from suppliers to our customers’ doorstep. We work on areas such as building massive-scale mobile and web-applications, engaging user-interfaces, user personalization, recommendation & social commerce platforms, content systems, payment systems, search systems, imaging and visualization systems for products, etc. We are a technology team where each individual has a huge impact and gets to experience the delight of your hard labor & tech excellence being visible to real users. You will work closely with the business in shaping our product and serve hundreds of millions of Indians! You will have the opportunity to be part of a rapidly growing SF organization and gain exposure to all parts of a comprehensive e-commerce platform.
          </p>
          <p className="mt-2">
            The SF team at Myntra operates within distinct verticals which are (Storefront – Services Platform, Storefront Platforms for personalization & Store Channels (Client Apps-Android/iOS/MWeb/Desktop).
          </p>

          <h3 className="mt-6 text-lg font-semibold">Roles And Responsibilities</h3>
          <ul className="mt-2 list-disc list-inside">
            <li>Write maintainable/scalable/efficient and modular code for a front end for the portal and alternative channels</li>
            <li>Design and develop user interface for business-sensitive consumer-facing e-commerce portal.</li>
            <li>Work in a cross-functional team, collaborating with peers during the entire SDLC.</li>
            <li>Follow coding standards, unit-testing, code reviews, etc.</li>
            <li>Follow release cycles and commitment to deadlines</li>
          </ul>
          <h3 className="mt-6 text-lg font-semibold">Qualifications & Experience</h3>
          <ul className="mt-2 list-disc list-inside">
            <li>Minimum 1-5 years’ experience in developing front-end for large-scale web-based consumer-facing products. Hands-on developer & focused on being an individual contributor.</li>
            <li>Strong understanding of mobile platforms and browsers.</li>
            <li>Experience and expertise in UI architecture, component/framework design.</li>
            <li>Fair experience in JavaScript, CSS, HTML5.</li>
            <li>Building advanced responsive layouts.</li>
            <li>React.js background is essential.</li>
            <li>Ability to write code compatible across browsers and other clients.</li>
            <li>Fair understanding of backend systems i.e. web services, APIs from a consumer perspective.</li>
            <li>B Tech/BE or M Tech/MS in Computer Science or equivalent.</li>
          </ul>
          <h3 className="mt-6 text-lg font-semibold">Skills Associated with the Job Post</h3>
          <ul className="mt-2 list-disc list-inside">
            <li>HTML5</li>
            <li>React.js</li>
            <li>Cascading Style Sheets (CSS)</li>
            <li>Back-End Web Development</li>
            <li>Front-End Development</li>
            <li>Technical Architecture</li>
            <li>Computer Science</li>
          </ul>
          {/* <div className="flex w-full items-center justify-between mt-6">
            <Button className="bg-black text-white">Apply Now</Button>
            <Button variant="outline" className="text-gray-700 border-gray-300 flex items-center">
              Save
              <Bookmark className="ml-2" size={16} />
            </Button>          
          </div> */}
        </div>
      </div>
    </div>
  );
}
