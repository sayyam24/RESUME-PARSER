import React, { useState } from "react";
import axios from "axios";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    setOtpSent(false); // Reset OTP status when email changes
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

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Simulate OTP sending. In a real scenario, use an OTP service.
      setOtpSent(true);
    } catch (error: any) {
      setErrorMessage("Error sending OTP");
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Simulate OTP verification. In a real scenario, verify OTP.
      setOtpVerified(true);
      console.log(otp);
    } catch (error: any) {
      setErrorMessage("Invalid OTP");
    }
  };

  const handleRegistrationSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const response = await axios.post("/users", {
        mode: "cors",
        first_name: firstName,
        last_name: lastName,
        email: email,
        mobile: mobile,
        password: password,
      });
      // Handle success response, e.g., redirect to login page
      console.log("Registration successful:", response.data);
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

  // Rest of your validation functions...

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/3 bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-2xl font-bold">Register</h2>
        </div>

        {errorMessage && <p>{errorMessage}</p>}
        {!otpSent && !otpVerified && (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
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
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors duration-300 ${
                emailError ? "cursor-not-allowed opacity-50" : ""
              } w-full`}
              //    disabled={emailError}
            >
              Send OTP
            </button>
          </form>
        )}
        {otpSent && !otpVerified && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label htmlFor="otp" className="block mb-1">
                Enter OTP:
              </label>
              <div className="flex">
                <div className="rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200 focus-within:ring-opacity-50 p-2">
                  <input
                    type="number"
                    id="otp1"
                    maxLength={1}
                    value={otp[0] || ""}
                    onChange={(e) => setOtp(e.target.value + otp.substring(1))}
                    className="w-full h-full bg-transparent border-none focus:outline-none text-center text-xl"
                  />
                </div>
                <div className="rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200 focus-within:ring-opacity-50 p-2 ml-2">
                  <input
                    type="number"
                    id="otp2"
                    maxLength={1}
                    value={otp[1] || ""}
                    onChange={(e) =>
                      setOtp(otp[0] + e.target.value + otp.substring(2))
                    }
                    className="w-full h-full bg-transparent border-none focus:outline-none text-center text-xl"
                  />
                </div>
                <div className="rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200 focus-within:ring-opacity-50 p-2 ml-2">
                  <input
                    type="number"
                    id="otp3"
                    maxLength={1}
                    value={otp[2] || ""}
                    onChange={(e) =>
                      setOtp(
                        otp.substring(0, 2) + e.target.value + otp.substring(3)
                      )
                    }
                    className="w-full h-full bg-transparent border-none focus:outline-none text-center text-xl"
                  />
                </div>
                <div className="rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200 focus-within:ring-opacity-50 p-2 ml-2">
                  <input
                    type="number"
                    id="otp4"
                    maxLength={1}
                    value={otp[3] || ""}
                    onChange={(e) =>
                      setOtp(otp.substring(0, 3) + e.target.value)
                    }
                    className="w-full h-full bg-transparent border-none focus:outline-none text-center text-xl"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors duration-300 w-full"
            >
              Verify OTP
            </button>
          </form>
        )}

        {otpVerified && (
          <form onSubmit={handleRegistrationSubmit}>
            <div className="form-group mt-10">
              <div className="flex mb-1">
                <div className="w-1/2 pr-2">
                  <label
                    htmlFor="firstName"
                    className={`block cursor-pointer transition-all ${
                      focusedField === "firstName"
                        ? "text-lg -translate-y-2"
                        : ""
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
                    <span className="text-red-500 text-sm">
                      {firstNameError}
                    </span>
                  )}
                </div>
                <div className="w-1/2 pl-2">
                  <label
                    htmlFor="lastName"
                    className={`block cursor-pointer transition-all ${
                      focusedField === "lastName"
                        ? "text-lg -translate-y-2"
                        : ""
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
                    <span className="text-red-500 text-sm">
                      {lastNameError}
                    </span>
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
        )}
      </div>
    </div>
  );
};

export default Register;
