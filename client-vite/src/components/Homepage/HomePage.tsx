import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [companies, setCompanies] = useState<
    { logo: string; name: string; description: string }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCompanies = companies.length;
  const cardsPerPage = 5;

  const getNextIndex = (currentIndex: number) => {
    let nextIndex = currentIndex + cardsPerPage;
    if (nextIndex >= totalCompanies) {
      nextIndex = nextIndex % totalCompanies;
    }
    return nextIndex;
  };

  const getVisibleCompanies = () => {
    const endIndex = currentIndex + cardsPerPage;
    if (endIndex <= totalCompanies) {
      return companies.slice(currentIndex, endIndex);
    } else {
      const firstSlice = companies.slice(currentIndex);
      const secondSlice = companies.slice(0, endIndex % totalCompanies);
      return [...firstSlice, ...secondSlice];
    }
  };

  const handleNextClick = () => {
    const nextIndex = getNextIndex(currentIndex);
    setCurrentIndex(nextIndex);
  };

  const handleSearch = () => {
    console.log("Keywords:", keywords);
    console.log("Location:", location);
    setKeywords("");
    setLocation("");
    // Add your search functionality
  };

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

  useEffect(() => {
    setCompanies(companyData);
  }, []);

  return (
    <div className="contentContainer mt-8 mb-4 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Match your skills to opportunities
      </h1>
      <h2 className="text-xl mb-4">Search, Apply, and Succeed</h2>
      <div className="flex items-center justify-center mt-16">
        <div className="searchContainer shadow-lg rounded-3xl p-4 flex items-center justify-center">
          <div className="searchIcon mr-3">
            <i className="fas fa-search"></i>
          </div>
          <input
            type="text"
            placeholder="Job titles/keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="searchInput pl-4 py-2 w-64 focus:outline-none"
          />
          <div className="locationIcon mx-2">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="searchInput pl-4 py-2 w-48 rounded-r-lg focus:outline-none"
          />
          <button onClick={handleSearch} className="searchButton">
            Search
          </button>
        </div>
      </div>
      {/* <div className="mt-20 w-1/2 mx-auto flex items-center justify-between py-4 px-6  rounded-xl  ">
        <h1 className="text-2xl font-bold">Let the employers find you</h1>
        <Link to="/uploadresume">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-2xl">
            Upload Resume
          </button>
        </Link>
      </div> */}
      <div className="topCompaniesContainer mt-16">
        <h1 className="text-xl font-bold mb-4">Top Companies hiring now</h1>

        <div className="cardContainer flex flex-wrap justify-center h-1/2 overflow-x-auto transition-transform duration-300 ease-in-out">
          {/* Company cards */}
          {getVisibleCompanies().map((company, index) => (
            <div
              key={index}
              className="companyCard mx-4 my-4 bg-white rounded-lg shadow-lg p-6 w-64 hover:shadow-xl hover:scale-110 transform-gpu transition-all duration-300 cursor-pointer"
            >
              <img
                src={company.logo}
                alt={`${company.name} Logo`}
                className="mx-auto mb-4 w-auto h-16 object-contain"
              />
              <h3 className="text-xl font-bold mb-2">{company.name}</h3>
              <p className="text-gray-600">{company.description}</p>
              <div className="buttonContainer mt-4 mb-4">
                <Link to={`/jobs/${company.name}`} key={index}>
                  <button className="bg-white text-blue-500 border border-blue-500 py-1 px-3 rounded-lg transition-colors duration-300 hover:bg-blue-500 hover:text-white">
                    View Jobs
                  </button>
                </Link>
              </div>
            </div>
          ))}
          <button onClick={handleNextClick}>
            <span className="material-symbols-outlined">
              keyboard_arrow_right
            </span>
          </button>
        </div>

        {/* Next button */}
      </div>
    </div>
  );
};

export default HomePage;
