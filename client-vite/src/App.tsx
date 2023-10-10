import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import HomePage from "./components/Homepage/HomePage";
// import Login from "./components/Login/Login";
import Login1 from "./components/Login/Login1";
import Navbar from "./components/Navbar/Navbar";
import Register2 from "./components/Register/Register2";
import Jobs from "./components/Homepage/Jobs";
import Companies from "./components/Homepage/Companies";
import UploadResume from "./components/UploadResume";
import JobDescription from "./components/JobDescription/JobDescription";
import EmployerLogin from "./components/Login/EmployerLogin";
import JobDetails from "./components/Homepage/JobDetails";
// import Register1 from "./components/Register/Register1";
import EmployeeRegister from "./components/Register/EmployeeRegister";
import Navbar1 from "./components/Navbar/Navbar1";
import Navbar2 from "./components/Navbar/Navbar2";
import Dashboard from "./components/Dashboard/Dashboard";
import Ranks from "./components/Dashboard/Ranks";
import DashJobs from "./components/Dashboard/DashJobs";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [isEmployer, setIsEmployer] = useState(
    localStorage.getItem("isEmployer") === "true"
  );

  // Define a function to handle user login
  const handleUserLogin = () => {
    setIsLoggedIn(true);
    setIsEmployer(false); // Set isEmployer to false for user login
  };

  // Define a function to handle employer login
  const handleEmployerLogin = (isEmployerLogin: boolean) => {
    setIsLoggedIn(true);
    setIsEmployer(isEmployerLogin); // Set isEmployer based on the argument
  };

  return (
    <BrowserRouter>
      <div className="App">
        {/* {isLoggedIn ? <Navbar1 /> : <Navbar />} */}
        {/* <Navbar /> */}
        {/* <HomePage /> */}
        {/* <Routes> */}
        {/* <Route path="/userlogin" element={<Login />} /> */}
        {/* <Route path="/userlogin" element={<Login1 />} /> */}
        {!isLoggedIn && <Navbar />}{" "}
        {/* Display Navbar if no one is logged in */}
        {isLoggedIn && !isEmployer && <Navbar1 />}{" "}
        {/* Display Navbar1 for users */}
        {isLoggedIn && isEmployer && <Navbar2 />}{" "}
        {/* Display Navbar2 for employers */}
        <Routes>
          <Route
            path="/userlogin"
            element={<Login1 onLogin={handleUserLogin} />}
          />
          <Route
            path="/employerlogin"
            element={<EmployerLogin onLogin={handleEmployerLogin} />}
          />
          {/* <Route path="/userlogin" element={<Login1 onLogin={handleLogin} />} />
          <Route
            path="/employerlogin"
            element={<EmployerLogin onLogin={handleLogin} />}
          /> */}
          <Route path="/jobdescription" element={<JobDescription />} />
          <Route path="/jobpostings" element={<DashJobs />} />
          <Route path="/jobdetails" element={<JobDetails />} />
          <Route path="/employerregistration" element={<EmployeeRegister />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/userregister" element={<Register2 />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/*" element={<Jobs />} />
          <Route path="/jobs/:companyName/:jobId" element={<JobDetails />} />
          <Route path="/ranking/:companyName/:jobId" element={(<Ranks />)} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/uploadresume" element={<UploadResume />} />
          <Route path="/employerdashboard" element={<Dashboard />} />

          {/* <Route path="/api/login" element={<Login />} />
          <Route path="/api/register" element={<Register />} /> */}
        </Routes>
        {/* {isLoggedIn ? <Navbar2 /> : null} */}
      </div>
    </BrowserRouter>
  );
}

export default App;
