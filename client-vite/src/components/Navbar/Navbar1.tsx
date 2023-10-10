import { Link } from "react-router-dom";

const Navbar1 = () => {
  //   const handleLogout = () => {
  //     // Clear the isLoggedIn flag in local storage
  //     localStorage.removeItem("isLoggedIn");

  //     // Update the state
  //     // setIsLoggedIn(false);
  //   };
  return (
    <div className="navBar flex justify-between items-center p-[2rem] sticky">
      <div className="logoDiv flex gap-10 items-center">
        <Link to="/">
          <h1 className="logo text-2xl ">
            <strong className="tracking-wide">
              <span className="material-symbols-outlined">done</span>Answers
            </strong>
          </h1>
        </Link>
      </div>
      <div className="menu flex items-center gap-8">
        <Link to="/jobs">
          <li className="menuList text-[#3c3b3b] hover:text-blueColor">Jobs</li>
        </Link>
        <Link to="/companies">
          <li className="menuList text-[#3c3b3b] hover:text-blueColor">
            Companies
          </li>
        </Link>
        <div className="h-8 w-0.5 bg-gray-400"></div>
        <Link to="/employerlogin">
          <li className="menuList text-[#3c3b3b] hover:text-blueColor">
            Employers
          </li>
        </Link>
        {/* <button onClick={handleLogout}>Logout</button> */}
      </div>
    </div>
  );
};

export default Navbar1;
