import React from "react";
import { Link, useLocation } from "react-router-dom";

interface JobDetailsParams {
  jobId: string;
}

const JobDetails: React.FC = () => {
  const location = useLocation();
  const jobD = location.state && location.state.job;
  console.log(jobD)
  const company = {
    name: "Cognizant",
    description: "Join our innovative team and shape the future of technology.",
  };
  // You can fetch job details using the jobId from an API or use static data
  const job = {
    id: 1,
    positionTitle: jobD.title,
    ctc: jobD.salary,
    location: jobD.location,
    jobDescription: jobD.description,
    // salaryRange: "80000-100000",
    duration: jobD.duration,
    education: jobD.education.join(' / '),
    skills: jobD.skill,
    extraDetails: jobD.extra,
    experience: jobD.experience,
    language: jobD.language.join(', '),
    locationDetail: "Bangalore, India",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* <div className="bg-blue-500 text-white py-8 text-center">
        <h1 className="text-4xl font-semibold">{company.name}</h1>
        <p className="text-lg">{company.description}</p>
      </div> */}
      <div className="flex-1 flex items-center justify-center">
        <div className="mt-10 w-2/3 bg-white p-8 rounded-lg shadow-lg space-y-6">
          <h2 className="text-3xl font-bold">{job.positionTitle}</h2>
          <div className="border-2 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold">CTC</h4>
                <div className="mt-2 text-base text-gray-600">
                  <div className="rounded-2xl bg-gray-200 px-4 py-2 inline-block">
                    {job.ctc}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold">Location</h4>
                <div className="mt-2 text-base text-gray-600">
                  <div className="rounded-2xl bg-gray-200 px-4 py-2 inline-block">
                    {job.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <hr className="border-t border-gray-300" /> */}
          <div className="border-2 rounded-xl p-4">
            <div>
              <h4 className="text-lg font-semibold">Job Description</h4>
              {/* <div className="rounded bg-gray-200 p-2 mt-2"> */}
              <p className="text-lg leading-relaxed">{job.jobDescription}</p>
              {/* </div> */}
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <h4 className="text-lg font-semibold">Duration</h4>
                <div className="text-base text-gray-600">
                  <div className="rounded-2xl bg-gray-200  px-4 py-2 inline-block">
                    {job.duration}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold">Education</h4>
                <div className="text-base text-gray-600">
                  <div className="rounded-2xl bg-gray-200  px-4 py-2 inline-block">
                    {job.education}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-semibold">Skills</h4>
              <div className="flex space-x-2">
                {job.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-gray-200  px-4 py-1 text-sm inline-block"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div className="text-base">
                <h4 className="text-lg font-semibold">Language</h4>
                <div className="rounded-2xl bg-gray-200 px-4 py-2 inline-block">
                  {job.language}
                </div>
              </div>

              <div className="text-base">
                <h4 className="text-lg font-semibold">Experience</h4>
                <div className="rounded-2xl bg-gray-200 px-4 py-2 inline-block">
                  {job.experience}
                </div>
              </div>
            </div>
          </div>

          {/* <hr className="border-t border-gray-300" /> */}
          <div className="border-2 rounded-xl p-4">
            <div className="text-lg leading-relaxed mb-4">
              {job.extraDetails}
            </div>
          </div>

          <Link to="/uploadresume">
            <button className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-full shadow-md">
              Apply Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
