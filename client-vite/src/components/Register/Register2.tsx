import React, { useState } from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();
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
  const [errorMessage, setErrorMessage] = useState("");

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
        first_name: firstName,
        last_name: lastName,
        username: email,
        email: email,
        mobile: mobile,
        password: password,
      });
      // Handle success response, e.g., redirect to login page
      console.log("Registration successful:", response.data);
      alert(response.data["message"]);
      if (response.data["status"] == 201) navigate("/userlogin");
    } catch (error: any) {
      // Handle error response
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred during registration.");
      }
    }
  };

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
      <div className="img-div"></div>
      <div className="w-1/3 bg-white rounded-lg shadow-lg  p-6">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-2xl font-bold">Register</h2>
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={handleRegister}>
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
                firstNameError ||
                lastNameError ||
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
    </div>
  );
};

export default Register;
