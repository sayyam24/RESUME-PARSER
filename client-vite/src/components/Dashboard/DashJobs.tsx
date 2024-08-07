import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Job = {
    _id: string;
    title: string;
    recruiter: string;
    description: string;
    salary: string;
    location: string;
};

export default function DashJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const username = localStorage.getItem("username") || "";
                const response = await fetch(`http://127.0.0.1:5000/jobs?recruiter=${username}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setJobs(data.jobs || []);
                console.log("Fetched job details:", data.jobs);
            } catch (error) {
                setError("There was a problem fetching job data.");
                console.error("There was a problem fetching job data:", error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div>
            <div className="flex-grow p-8 w-4/4 ml-8">
                <h1 className="text-center text-3xl font-extrabold mb-8">Your Job Postings</h1>
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-2 gap-6">
                    {jobs.length === 0 ? (
                        <p>No jobs available.</p>
                    ) : (
                        jobs.map((job) => (
                            <div key={job._id} className="p-4 border rounded-lg bg-white">
                                <h3 className="text-2xl font-semibold">{job.recruiter}</h3>
                                <div className="mt-4 flex space-x-4 items-center">
                                    <span className="material-symbols-outlined mr-2">business</span>
                                    <h3 className="text-xl font-semibold">{job.title}</h3>
                                </div>
                                <div className="mt-2 flex space-x-4 items-center">
                                    <span className="material-symbols-outlined mr-2">currency_rupee</span>
                                    <span className="font-semibold">Salary</span>
                                    <div className="ml-2 px-4 rounded-xl bg-gray-100">
                                        <p>{job.salary}</p>
                                    </div>
                                    <span className="material-symbols-outlined mr-2">location_on</span>
                                    <span className="font-semibold">Location</span>
                                    <div className="ml-2 px-4 rounded-xl bg-gray-100">
                                        <p>{job.location}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link to={`/ranking/${job.recruiter}/${job._id}`} state={{ job }}>
                                        <button className="bg-blue-500 text-white px-4 py-1.5 rounded-xl float-right">
                                            Top Candidates
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
