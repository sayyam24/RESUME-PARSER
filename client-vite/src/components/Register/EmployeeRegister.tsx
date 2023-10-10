import React, { useState } from "react";
import axios from "axios";

const EmployeeRegister: React.FC = () => {
  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  // const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [companyName, setCompanyName] = useState("");
  // const [companyCode, setCompanyCode] = useState("");
  const [role, setRole] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  // const [companyCodeError, setCompanyCodeError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCompanyNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setCompanyName(value);
    setCompanyNameError(validateCompanyName(value));
  };

  // const handleCompanyCodeChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const { value } = event.target;
  //   setCompanyCode(value);
  //   setCompanyCodeError(validateCompanyCode(value));
  // };

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setFirstName(value);
    setFirstNameError(validateFirstName(value));
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setLastName(value);
    setLastNameError(validateLastName(value));
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setRole(value);
    setRoleError(validateRole(value));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleMobileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMobile(value);
    setMobileError(validateMobile(value));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleInputFocus = (field: string) => {
    setFocusedField(field);
  };

  // const handleRegister = () => {
  //   if (
  //     !firstNameError &&
  //     !lastNameError &&
  //     !emailError &&
  //     !mobileError &&
  //     !passwordError
  //   ) {
  //     console.log("Registration successful");
  //   }
  // };
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/register", {
        company_name: companyName,
        first_name: firstName,
        last_name: lastName,
        role: role,
        username: email,
        email: email,
        mobile: mobile,
        password: password,
      });
      if (response.data.status === 201) {
        // Handle success response, e.g., redirect to login page
        console.log("Registration successful:", response.data);
        window.location.href = "/employerlogin";
      } else {
        console.log("Registration failed. Status:", response.data);
        // window.alert(response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error: any) {
      // Handle error response
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred during registration.");
      }
    }
  };

  // const closeAlert = () => {
  //   setErrorMessage("");
  // };

  const validateCompanyName = (companyName: string) => {
    if (!companyName) {
      return "Company name is required";
    }

    return "";
  };

  // const validateCompanyCode = (companyCode: string) => {
  //   if (!companyCode) {
  //     return "Company code is required";
  //   }

  //   if (!/^[A-Z]\d{5}[A-Z]\d{4}PTC\d{6}$/.test(companyCode)) {
  //     return "Invalid CIN number format";
  //   }

  //   return "";
  // };

  const validateFirstName = (firstName: string) => {
    if (!firstName) {
      return "First name is required";
    }

    return "";
  };

  const validateLastName = (lastName: string) => {
    if (!lastName) {
      return "Last name is required";
    }

    return "";
  };

  const validateRole = (role: string) => {
    if (!role) {
      return "Role is required";
    }

    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email format";
    }

    return "";
  };

  const validateMobile = (mobile: string) => {
    if (!mobile) {
      return "Mobile number is required";
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return "Invalid mobile number format";
    }

    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/.test(password)
    ) {
      return "Invalid password format";
    }

    return "";
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mt-16 w-1/3 bg-white rounded-lg shadow-lg  p-6 ">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-2xl font-bold">Employer Registration</h2>
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label
              htmlFor="companyName"
              className={`block mb-1 cursor-pointer transition-all ${
                focusedField === "companyName" ? "text-lg -translate-y-2" : ""
              }mt-4`}
            >
              Company name
            </label>
            <input
              type="companyName"
              id="companyName"
              value={companyName}
              onChange={handleCompanyNameChange}
              onFocus={() => handleInputFocus("companyName")}
              onBlur={() => setFocusedField("")}
              className={`border-b ${
                companyNameError ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none py-1 px-3 w-full mb-4`}
            />
            {companyNameError && (
              <span className="text-red-500 text-sm">{companyNameError}</span>
            )}
          </div>
          {/* <div className="form-group">
            <label
              htmlFor="companyCode"
              className={`block mb-1 cursor-pointer transition-all ${
                focusedField === "companyCode" ? "text-lg -translate-y-2" : ""
              }mt-4`}
            >
              Company code
            </label>
            <input
              type="companyCode"
              id="companyCode"
              value={companyCode}
              onChange={handleCompanyCodeChange}
              onFocus={() => handleInputFocus("companyCode")}
              onBlur={() => setFocusedField("")}
              className={`border-b ${
                companyCodeError ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none py-1 px-3 w-full mb-4`}
            />
            {companyCodeError && (
              <span className="text-red-500 text-sm">{companyCodeError}</span>
            )}
          </div> */}
          <div className="form-group mt-10">
            <div className="flex mb-1">
              <div className="w-1/2 pr-2">
                <label
                  htmlFor="firstName"
                  className={`block cursor-pointer transition-all ${
                    focusedField === "firstName" ? "text-lg -translate-y-2" : ""
                  }`}
                >
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  onFocus={() => handleInputFocus("firstName")}
                  onBlur={() => setFocusedField("")}
                  className={`border-b ${
                    firstNameError ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none py-1 px-3 w-full`}
                />
                {firstNameError && (
                  <span className="text-red-500 text-sm">{firstNameError}</span>
                )}
              </div>
              <div className="w-1/2 pl-2">
                <label
                  htmlFor="lastName"
                  className={`block cursor-pointer transition-all ${
                    focusedField === "lastName" ? "text-lg -translate-y-2" : ""
                  }`}
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={handleLastNameChange}
                  onFocus={() => handleInputFocus("lastName")}
                  onBlur={() => setFocusedField("")}
                  className={`border-b ${
                    lastNameError ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-500 focus:outline-none py-1 px-3 w-full`}
                />
                {lastNameError && (
                  <span className="text-red-500 text-sm">{lastNameError}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label
              htmlFor="role"
              className={`block mb-1 cursor-pointer transition-all ${
                focusedField === "role" ? "text-lg -translate-y-2" : ""
              }mt-4`}
            >
              Role
            </label>
            <input
              type="role"
              id="role"
              value={role}
              onChange={handleRoleChange}
              onFocus={() => handleInputFocus("role")}
              onBlur={() => setFocusedField("")}
              className={`border-b ${
                roleError ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none py-1 px-3 w-full mb-4`}
            />
            {roleError && (
              <span className="text-red-500 text-sm">{roleError}</span>
            )}
          </div>

          <div className="form-group">
            <label
              htmlFor="email"
              className={`block mb-1 cursor-pointer transition-all ${
                focusedField === "email" ? "text-lg -translate-y-2" : ""
              }mt-4`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => handleInputFocus("email")}
              onBlur={() => setFocusedField("")}
              className={`border-b ${
                emailError ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none py-1 px-3 w-full mb-4`}
            />
            {emailError && (
              <span className="text-red-500 text-sm">{emailError}</span>
            )}
          </div>
          <div className="form-group">
            <label
              htmlFor="mobile"
              className={`block mb-1 cursor-pointer transition-all ${
                focusedField === "mobile" ? "text-lg -translate-y-2" : ""
              } mt-4`}
            >
              Mobile number
            </label>
            <input
              type="text"
              id="mobile"
              value={mobile}
              onChange={handleMobileChange}
              onFocus={() => handleInputFocus("mobile")}
              onBlur={() => setFocusedField("")}
              className={`border-b ${
                mobileError ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none py-1 px-3 w-full mb-4`}
            />
            {mobileError && (
              <span className="text-red-500 text-sm">{mobileError}</span>
            )}
          </div>
          <div className="form-group">
            <label
              htmlFor="password"
              className={`block mb-1 cursor-pointer transition-all ${
                focusedField === "password" ? "text-lg -translate-y-2" : ""
              } mt-4`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => handleInputFocus("password")}
              onBlur={() => setFocusedField("")}
              className={`border-b ${
                passwordError ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none py-1 px-3 w-full mb-4`}
            />
            {passwordError && (
              <span className="text-red-500 text-sm">{passwordError}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div></div>
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors duration-300 ${
                companyNameError ||
                firstNameError ||
                lastNameError ||
                roleError ||
                emailError ||
                mobileError ||
                passwordError
                  ? "cursor-not-allowed opacity-50"
                  : ""
              } w-full mt-8`}
            >
              Register
            </button>
          </div>
        </form>
      </div>
      {/* {errorMessage && (
        <div className="custom-alert">
          <p className="error-message">{errorMessage}</p>
          <button className="close-button" onClick={closeAlert}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )} */}
    </div>
  );
};

export default EmployeeRegister;
