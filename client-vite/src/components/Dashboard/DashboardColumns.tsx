
import React from "react";

interface DashboardColumnsProps {
  data: {
    topCandidates: {
      name: string;
      score: number;
      jobApplied: string;
      profileImage: string;
    }[];
    jobData: { jobTitle: string; applicants: number }[];
  };
}

const DashboardColumns: React.FC<DashboardColumnsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="bg-black text-white rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-4">
          Top Candidates
          <span className="material-symbols-outlined">monitoring</span>
        </h2>
        {data.topCandidates.map((candidate, index) => (
          <div key={index} className="flex items-center mb-4">
            <div>
              <span className="material-symbols-outlined">account_circle</span>
            </div>
            <div className="ml-4">
              <h3 className="text-md font-semibold">{candidate.name}</h3>
              <p className="text-base">
                Applied for {candidate.jobApplied} job
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-blue-950 text-white rounded-lg p-4 shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg text-white font-bold mb-2">
              Job Titles
              {/* Job Titles<span className="material-symbols-outlined">work</span> */}
            </h2>
            {data.jobData.map((job, index) => (
              <div key={index} className="mb-2 text-lg font-medium">
                {job.jobTitle}
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2">
              Applicants{" "}
              {/* <span className="material-symbols-outlined">monitoring</span> */}
            </h2>
            {data.jobData.map((job, index) => (
              <div key={index} className="mb-2 text-lg">
                {job.applicants}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardColumns;
