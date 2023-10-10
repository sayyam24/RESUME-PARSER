import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

type Job = {
  uId: number;
  _id: number;
  title: string;
  recruiter: string;
  description: string;
  salary: string;
  duration: string;
  education: string[];
  skills: string[];
  experience: string;
  language: string[];
  extraDetails: string[];
  location: string;
};
const FilterBox = () => {
  return (
    <div className="w-1/4 p-4 border rounded-lg shadow-xl overflow-x-auto max-w-full bg-white">
      <h2 className="font-bold mb-2 text-center">All Filters</h2>
      <hr className="my-4 border-t-1 border-gray-300" />
      <ul className="space-y-4">
        {/* Company Type Filter */}
        <li className="m-4 pl-4 space-y-2">
          <h2 className="font-bold mb-2">Company Type</h2>
          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Foreign MNC</span>
              <span className="ml-1">(1149)</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Corporate</span>
              <span className="ml-1">(681)</span>
            </label>
          </li>
        </li>
        <hr className="my-4 border-t-1 border-gray-300" />
        {/* Location Filter */}
        <li className="m-4 pl-4 space-y-2">
          <h2 className="font-bold mb-2">Location</h2>
          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Bangalore/Bengaluru</span>
              <span className="ml-1">(1202)</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Delhi / NCR</span>
              <span className="ml-1">(1088)</span>
            </label>
          </li>
        </li>
        <hr className="my-4 border-t-1 border-gray-300" />
        {/* Industry Filter */}
        <li className="m-4 pl-4 space-y-2">
          <h2 className="font-bold mb-2">Industry</h2>
          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>IT Services & Consulting</span>
              <span className="ml-1">(621)</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Software Product</span>
              <span className="ml-1">(198)</span>
            </label>
          </li>
        </li>
        <hr className="my-4 border-t-1 border-gray-300" />
        {/* Department Filter */}
        <li className="m-4 pl-4 space-y-2">
          <h2 className="font-bold mb-2">Department</h2>

          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Engineering - Software & QA</span>
              <span className="ml-1">(1418)</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Sales & Business Development</span>
              <span className="ml-1">(1131)</span>
            </label>
          </li>
          {/* Add other department filters here */}
        </li>
        <hr className="my-4 border-t-1 border-gray-300" />
        {/* Experience Filter */}
        <li className="m-4 pl-4 space-y-2">
          <h2 className="font-bold mb-2">Experience</h2>
          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Experienced</span>
              <span className="ml-1">(2417)</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Entry Level</span>
              <span className="ml-1">(671)</span>
            </label>
          </li>
        </li>
        <hr className="my-4 border-t-1 border-gray-300" />
        {/* Nature of Business Filter */}
        <li className="m-4 pl-4 space-y-2">
          <h2 className="font-bold mb-2">Nature of Business</h2>

          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>B2B</span>
              <span className="ml-1">(1896)</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>B2C</span>
              <span className="ml-1">(981)</span>
            </label>
          </li>
        </li>
        <hr className="my-4 border-t-1 border-gray-300" />
      </ul>
    </div>
  );
};

const Jobs = () => {
  const { "*": routeParams } = useParams<{ "*": string }>();

  const [jobs, setJobs] = useState<Job[]>([]); // Specify the type as Job[]

  useEffect(() => {
    // Define a function to fetch jobs for a specific company
    const fetchJobsForCompany = async (companyName: string) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/jobs?recruiter=${companyName}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setJobs(data.data); // Update the jobs state with the fetched data.data
        console.log("Fetched job details:", data.data);
      } catch (error) {
        console.error("There was a problem fetching job data:", error);
      }
    };

    if (routeParams) {
      const params = routeParams.split("/");
      if (params.length === 1) {
        const [companyName] = params;
        // Fetch jobs for the specified company
        fetchJobsForCompany(companyName);
      }
    } else {
      // Fetch all jobs when routeParams is empty
      const fetchAllJobs = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/jobs");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setJobs(data.data); // Update the jobs state with all jobs
          console.log("Fetched all job details:", data.data);
        } catch (error) {
          console.error("There was a problem fetching job data:", error);
        }
      };

      fetchAllJobs();
    }
  }, [routeParams]);

  if (!routeParams) {
    // Render all jobs
    return (
      <div className="flex items-stretch h-screen p-10 bg-gray-50">
        {/* Filter Box */}
        <FilterBox />

        <div className="flex-grow p-4 w-3/4 ml-8">
          <h1 className="text-center text-3xl font-extrabold mb-8">All Jobs</h1>
          <div className="grid grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div key={job._id} className="p-4 border rounded-lg bg-white">
                <h3 className="text-2xl font-semibold">{job.recruiter}</h3>
                <div className="mt-4 flex space-x-4 items-center">
                  <span className="material-symbols-outlined mr-2">
                    business
                  </span>
                  {/* <span className="font-semibold">Company:</span> */}
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                </div>
                <div className="mt-2 flex space-x-4 items-center">
                  <span className="material-symbols-outlined mr-2">
                    currency_rupee
                  </span>
                  <span className="font-semibold">Salary</span>
                  <div className="ml-2 px-4 rounded-xl bg-gray-100">
                    <p>{job.salary}</p>
                  </div>
                  <span className="material-symbols-outlined mr-2">
                    location_on
                  </span>
                  <span className="font-semibold">Location</span>
                  <div className="ml-2 px-4 rounded-xl bg-gray-100">
                    <p>{job.location}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link to={`/jobs/${job.recruiter}/${job._id}`} state={{ job }}>
                    <button className="bg-blue-500 text-white px-4 py-1.5 rounded-xl float-right">
                      Apply Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    const params = routeParams.split("/");
    if (params.length === 1) {
      const [companyName] = params;
      // Render jobs for a specific company
      return (
        <div className="flex items-stretch h-screen p-10 bg-gray-50">
          {/* Filter Box */}
          <FilterBox />

          {/* Job Listings */}
          <div className="flex-grow p-4 w-3/4 ml-8">
            <h2 className="text-2xl font-bold mb-4">Jobs at {companyName}</h2>
            <div className="grid grid-cols-2 gap-4">
              {jobs
                .filter((job) => job.recruiter === companyName) // Filter jobs by recruiter/company name
                .map((job) => (
                  <div key={job._id} className="p-4 border rounded-lg bg-white">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <div className="mt-4 flex space-x-4">
                      <div className="flex items-center">
                        <span className="material-symbols-outlined mr-2">
                          currency_rupee
                        </span>
                        CTC
                        <div className="ml-2 px-4 rounded-xl bg-gray-100">
                          <p>{job.salary}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="material-symbols-outlined mr-2">
                          location_on
                        </span>
                        Location
                        <div className="ml-2 px-4 rounded-xl bg-gray-100">
                          <p>{job.location}</p>
                        </div>
                      </div>
                    </div>
                    <Link to={`/jobs/${companyName}/${job._id}`}>
                      <button className="bg-blue-500 text-white px-4 py-1.5 mt-8 rounded-xl float-right">
                        Apply Now
                      </button>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      );
    } else {
      // Invalid URL structure
      return <h2>Invalid URL</h2>;
    }
  }
};

export default Jobs;
