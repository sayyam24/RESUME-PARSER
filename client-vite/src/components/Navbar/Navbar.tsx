import { Link } from "react-router-dom";

const Navbar = () => {
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
        {/* <li className="menuList text-[#6f6f6f] hover:text-blueColor">Jobs</li>
        <li className="menuList text-[#6f6f6f] hover:text-blueColor">
          Companies
        </li> */}
      </div>
      <div className="menu flex items-center gap-8">
        <Link to="/jobs">
          <li className="menuList text-[#3a3a3a] hover:text-blueColor">Jobs</li>
        </Link>
        <Link to="/companies">
          <li className="menuList text-[#3c3b3b] hover:text-blueColor">
            Companies
          </li>
        </Link>

        <Link to="/userlogin">
          <button className="loginBtn ">Login</button>
        </Link>
        <Link to="/userregister">
          <button className="registerBtn">Register</button>
        </Link>

        <div className="h-8 w-0.5 bg-gray-400"></div>
        <Link to="/employerlogin">
          <li className="menuList text-[#3c3b3b] hover:text-blueColor">
            Employers
          </li>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
// // import React from "react";
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios"; // Import axios

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   // Fetch user data from the API
//   const handleDropdownToggle = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/users"); // Replace with your API endpoint
//       const userData = response.data; // Assuming the response contains user data

//       if (userData.data && userData.data.length > 0) {
//         const firstUser = userData.data[0]; // Extract the first user object
//         setIsLoggedIn(true);
//         setUserEmail(firstUser.username);
//       }
//     } catch (error) {
//       // Handle error
//     }
//   };

//   // Function to simulate logging out
//   const handleLogout = async () => {
//     const userTokenBeforeLogout = localStorage.getItem("token");

//     try {
//       await axios.post("http://localhost:5000/logout");
//       // Clear token from cookies or local storage
//       document.cookie =
//         "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//       localStorage.removeItem("token");
//       setIsLoggedIn(false);
//       setUserEmail("");

//       const userTokenAfterLogout = localStorage.getItem("token");

//       console.log("Token before logout:", userTokenBeforeLogout);
//       console.log("Token after logout:", userTokenAfterLogout);

//       // Redirect user to the desired page (e.g., home or login page)
//       window.location.href = "/userlogin"; // Change this to the appropriate route
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <div className="navBar flex justify-between items-center p-[2rem] sticky">
//       <div className="logoDiv flex gap-10 items-center">
//         <Link to="/">
//           <h1 className="logo text-2xl ">
//             <strong className="tracking-wide">
//               <span className="material-symbols-outlined">done</span>Answers
//             </strong>
//           </h1>
//         </Link>
//         {/* <li className="menuList text-[#6f6f6f] hover:text-blueColor">Jobs</li>
//         <li className="menuList text-[#6f6f6f] hover:text-blueColor">
//           Companies
//         </li> */}
//       </div>
//       <div className="menu flex items-center gap-8">
//         <Link to="/jobs">
//           <li className="menuList text-[#6f6f6f] hover:text-blueColor">Jobs</li>
//         </Link>
//         <Link to="/companies">
//           <li className="menuList text-[#6f6f6f] hover:text-blueColor">
//             Companies
//           </li>
//         </Link>

//         {isLoggedIn ? (
//           <div className="user-profile relative">
//             <div className="user-profile-info flex items-center gap-4">
//               <span className="material-symbols-outlined">person</span>
//               <span>{userEmail}</span>
//               {/* Add your profile icon here */}
//               <button
//                 className="profile-toggle-btn"
//                 onClick={handleDropdownToggle}
//               >
//                 <span className="material-symbols-outlined">
//                   keyboard_arrow_down
//                 </span>
//               </button>
//             </div>

//             {isDropdownOpen && (
//               <div className="dropdown-menu absolute top-full left-0 bg-white border border-gray-300 rounded shadow-md z-10">
//                 <button className="dropdown-item px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100">
//                   Profile Update
//                 </button>
//                 <button
//                   className="dropdown-item px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="menu flex items-center gap-8">
//             {/* <Link to="/jobs">
//               <li className="menuList text-[#6f6f6f] hover:text-blueColor">
//                 Jobs
//               </li>
//             </Link>
//             <Link to="/companies">
//               <li className="menuList text-[#6f6f6f] hover:text-blueColor">
//                 Companies
//               </li>
//             </Link> */}
//             <Link to="/userlogin">
//               <button className="loginBtn ">Login</button>
//             </Link>
//             <Link to="/userregister">
//               <button className="registerBtn">Register</button>
//             </Link>
//             <div className="h-8 w-0.5 bg-gray-400"></div>
//             <Link to="/employerlogin">
//               <li className="menuList text-[#6f6f6f] hover:text-blueColor">
//                 Employers
//               </li>
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   //     </div>
//   //   </div>
//   // );
// };

// export default Navbar;
