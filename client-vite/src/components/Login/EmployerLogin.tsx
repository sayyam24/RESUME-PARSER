import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface JobDescriptionData {
  jobId: number;
  jobTitle: string;
  recruiter: string;
  jobDescription: string;
  startingSalary: string;
  endingSalary: string;
  duration: string;
  education: string[];
  skills: string[];
  experience: string;
  language: string[];
  extraDetails: string[];
  location: string;
}

const EmployerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobs, setJobs] = useState<JobDescriptionData[]>([]);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Login successful');
        // Call the function to fetch jobs here
        fetchJobs(email);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const fetchJobs = async (recruiterEmail: string) => {
    try {
      const response = await fetch(`http://localhost:5000/jobs?recruiter=${recruiterEmail}`);
      const data = await response.json();
      if (response.ok) {
        setJobs(data);
      } else {
        console.error("Failed to fetch jobs:", data.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching jobs:", error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="w-3/4 mx-auto bg-white p-6 rounded-2xl shadow-2xl">
        <Link to="/">
          <button className="mt-4 mb-4 bg-transparent text-blue-500 font-semibold text-lg hover:text-gray-400">
            Back
          </button>
        </Link>
        <h2 className="text-3xl font-semibold mb-8">Employer Login</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Login
            </button>
          </div>
        </form>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Posted Jobs</h2>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.jobId} className="mb-4 p-4 border rounded">
                <h3 className="text-xl font-semibold">{job.jobTitle}</h3>
                <p><strong>Recruiter:</strong> {job.recruiter}</p>
                <p><strong>Description:</strong> {job.jobDescription}</p>
                <p><strong>Salary:</strong> {job.startingSalary} - {job.endingSalary}</p>
                <p><strong>Duration:</strong> {job.duration}</p>
                <p><strong>Education:</strong> {job.education.join(', ')}</p>
                <p><strong>Skills:</strong> {job.skills.join(', ')}</p>
                <p><strong>Experience:</strong> {job.experience}</p>
                <p><strong>Languages:</strong> {job.language.join(', ')}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Extra Details:</strong> {job.extraDetails.join(', ')}</p>
              </div>
            ))
          ) : (
            <p>No jobs posted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
