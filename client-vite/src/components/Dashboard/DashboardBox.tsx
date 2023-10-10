import React from "react";

interface DashboardBoxProps {
  data: {
    numberOfApplications: number;
    jobDescriptionMatch: number;
    shortlisted: number;
    rejected: number;
  };
}

const DashboardBox: React.FC<DashboardBoxProps> = ({ data }) => {
  return (
    <div className="bg-gray-400 rounded-lg p-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-3 shadow-md text-center">
          <div className="font-semibold text-lg">No of Applications</div>
          <div className="text-xl">{data.numberOfApplications}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="font-semibold text-lg">Job Description Match</div>
          <div className="text-xl">{data.jobDescriptionMatch}</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-md text-center">
          <div className="font-semibold text-lg">Shortlisted</div>
          <div className="text-xl">{data.shortlisted}</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-md text-center">
          <div className="font-semibold text-lg">Rejected</div>
          <div className="text-xl">{data.rejected}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBox;
