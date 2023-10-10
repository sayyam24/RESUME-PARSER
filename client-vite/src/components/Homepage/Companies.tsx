import React from "react";
import { Link } from "react-router-dom";

const Companies: React.FC = () => {
  const companyData = [
    {
      logo: "https://img.naukimg.com/logo_images/groups/v2/4156.gif",
      name: "Cognizant",
      description: "Trusted Global solutions company",
    },
    {
      logo: "https://img.naukimg.com/logo_images/groups/v1/2095704.gif",
      name: "Jio",
      description: "India's Largest 4G network provider",
    },
    {
      logo: "https://img.naukimg.com/logo_images/groups/v1/18850.gif",
      name: "Oracle",
      description: "Cloud technology company since 1977",
    },
    {
      logo: "https://img.naukimg.com/logo_images/groups/v2/398058.gif",
      name: "Amazon",
      description: "World's largest internet company",
    },
    {
      logo: "https://img.naukimg.com/logo_images/groups/v1/3835862.gif",
      name: "Persistent",
      description: "Leading ITeS company with global presence",
    },
    {
      logo: "https://img.naukimg.com/logo_images/groups/v2/214440.gif",
      name: "Reliance",
      description: "Description of Company 6",
    },
  ];
  return (
    <div className="flex items-stretch h-screen p-10 bg-gray-50">
      {/* First Column */}
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
          <hr className="my-4border-t-1 border-gray-300 " />
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
      {/* Second Column */}
      <div className="flex-grow p-4 w-3/4 ml-8">
        <div className="grid grid-cols-2 gap-4">
          {companyData.map((company, index) => (
            <Link to={`/jobs/${company.name}`} key={index}>
              <div className="p-4 border rounded-2xl bg-white cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-16 h-16 object-contain border border-gray-300 mr-4 rounded-lg"
                    />
                    <h3 className="font-bold">{company.name}</h3>
                  </div>
                  <span className="material-symbols-outlined">
                    keyboard_arrow_right
                  </span>
                </div>
                {/* <p>{company.description}</p> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
