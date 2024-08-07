import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  onLogin: () => void; // Define the prop type for the callback function
}

const Login: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleInputFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: email, // Ensure 'email' key is used here
        password: password, // Ensure 'password' key is used here
      });

      // Handle success response, e.g., store user token, redirect, etc.
      if (response.data.status === 200) {
        console.log("Login successful:", response.data);
        localStorage.setItem("isLoggedIn", "true");
        onLogin();
        navigate("/");
      } else {
        console.log("Login failed. Status:", response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error: any) {
      // Handle error response
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred during login.");
      }
    }
  };

  const closeAlert = () => {
    setErrorMessage("");
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
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="w-1/3 bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleLogin}>
            <div className="flex justify-center items-center mb-6">
              <h2 className="text-2xl font-bold">Login</h2>
            </div>
            <div className="form-group">
              <label
                htmlFor="email"
                className={`mt-4 block mb-1 cursor-pointer transition-all ${
                  focusedField === "email" ? "text-lg -translate-y-2" : ""
                }`}
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
                htmlFor="password"
                className={`mt-4 block mb-1 cursor-pointer transition-all ${
                  focusedField === "password" ? "text-lg -translate-y-2" : ""
                }`}
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
              <div>
                <button
                  className="text-blue-500 hover:text-blue-700 text-sm "
                  onClick={() => console.log("Forgot password clicked")}
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`mt-8 bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors duration-300 w-full`}
              style={{
                cursor:
                  emailError !== "" || passwordError !== ""
                    ? "not-allowed"
                    : "pointer",
              }}
              disabled={emailError !== "" || passwordError !== ""}
            >
              Login
            </button>
          </form>
        </div>
        {errorMessage && (
          <div className="custom-alert">
            <p className="error-message">{errorMessage}</p>
            <button className="close-button" onClick={closeAlert}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
