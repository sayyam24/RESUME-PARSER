import React, { useEffect, useState } from 'react';
import './Ranks.css'; // Import your CSS file
import { useLocation } from 'react-router-dom';

export default function Ranks() {
    const [rankData, setRankData] = useState([]);
    const [numberOfCandidates, setNumberOfCandidates] = useState(10); // Default value

    const location = useLocation();
    const { job } = location.state || {};

    // Function to calculate percentile
    const calculatePercentile = (score, data) => {
        const sortedScores = data.map((item) => item['resume_score(%)']).sort((a, b) => b - a);
        const index = sortedScores.indexOf(score);
        return ((sortedScores.length - index) / sortedScores.length) * 100;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/rank/${job._id}?count=${numberOfCandidates}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Calculate percentile for each item in rankData
                const rankedData = data.data.map((item) => ({
                    ...item,
                    Percentile: calculatePercentile(item['resume_score(%)'], data.data),
                }));

                setRankData(rankedData);
                console.log('Fetched rank data:', rankedData);
            } catch (error) {
                console.error('There was a problem fetching rank data:', error);
            }
        };

        fetchData();
    }, [numberOfCandidates]);

    const handleSliderChange = (event) => {
        setNumberOfCandidates(parseInt(event.target.value, 10));
    };


    const openExternalURL = (item) => {
        // Construct the URL with query parameters based on the item data
        const name = encodeURIComponent(item.Name);
        const mobileNumber = item.Mobile_Number && JSON.parse(item.Mobile_Number.replace(/'/g, '"'))[0];
        const encodedMobileNumber = encodeURIComponent(mobileNumber);

        const filename = name + '_' + encodedMobileNumber
        // Replace 'external-url' with the actual external URL
        const externalURL = `http://127.0.0.1:5000/get-pdf/${filename}`;

        // Open the external URL in a new tab or window
        window.open(externalURL, '_blank');
    };


    return (
        <div className="rank-container">
            <h2 className='mt-2'><strong>{job.title}</strong></h2>
            <label className="slider-label my-5">
                <strong>Number of Candidates to Retrieve: {numberOfCandidates}</strong>
            </label>
            <div className="slider-container mt-2">
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={numberOfCandidates}
                    onChange={handleSliderChange}
                    step="1"
                    className="slider"
                />
            </div>
            <table className="rank-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Mobile Number</th>
                        <th>Resume Score (%)</th>
                        <th>Percentile</th>
                        <th>View Resume</th>
                    </tr>
                </thead>

                <tbody>
                    {rankData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.Name}</td>
                            <td>
                                {item.Mobile_Number && JSON.parse(item.Mobile_Number.replace(/'/g, '"'))[0]}
                            </td>
                            <td>{item['resume_score(%)']}</td>
                            <td>{item.Percentile.toFixed(2)}%</td>
                            <td>
                                <span
                                    className="material-icons"
                                    style={{ cursor: 'pointer', color: 'blue' }}
                                    onClick={() => openExternalURL(item)}
                                >
                                    visibility
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
            <p className="attractive-text">
                This table displays the ranking data along with percentiles.
            </p>
        </div>
    );
}
