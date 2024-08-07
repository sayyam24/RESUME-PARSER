// Dashboard.tsx
import React from "react";
import DashboardBox from "./DashboardBox";
import DashboardColumns from "./DashboardColumns";
import DashJobs from "./DashJobs";

const Dashboard: React.FC = () => {
  // Sample data (replace with actual data)
  const dashboardData = {
    numberOfApplications: 100,
    jobDescriptionMatch: 80,
    shortlisted: 30,
    rejected: 50,
    topCandidates: [
      {
        name: "John Doe",
        score: 90,
        jobApplied: "Software Developer",
        profileImage: "profile1.jpg",
      },
      {
        name: "Jane Smith",
        score: 88,
        jobApplied: "UI/UX Designer",
        profileImage: "profile2.jpg",
      },
      {
        name: "Bob Johnson",
        score: 85,
        jobApplied: "Frontend Developer",
        profileImage: "profile3.jpg",
      },
      {
        name: "Alice Brown",
        score: 92,
        jobApplied: "Data Scientist",
        profileImage: "profile4.jpg",
      },
      {
        name: "Mike Wilson",
        score: 87,
        jobApplied: "Product Manager",
        profileImage: "profile5.jpg",
      },
      {
        name: "Eva Martinez",
        score: 89,
        jobApplied: "Backend Developer",
        profileImage: "profile6.jpg",
      },
      {
        name: "Chris Lee",
        score: 86,
        jobApplied: "Marketing Specialist",
        profileImage: "profile7.jpg",
      },
    ],
    jobData: [
      { jobTitle: "Software Developer", applicants: 35 },
      { jobTitle: "UI/UX Designer", applicants: 20 },
      { jobTitle: "Frontend Developer", applicants: 15 },
      { jobTitle: "Data Scientist", applicants: 18 },
      { jobTitle: "Product Manager", applicants: 28 },
      { jobTitle: "Backend Developer", applicants: 22 },
      { jobTitle: "Marketing Specialist", applicants: 12 },
    ],
  };

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl text-center font-bold mb-4">Dashboard</h1>
      <DashboardBox data={dashboardData} />
      <DashboardColumns data={dashboardData} />
      <DashJobs />
    </div>
  );
};

export default Dashboard;