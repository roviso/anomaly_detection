import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig.js";
import photo from "../../resources/hospital-empanelment.png";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [registerError, setRegisterError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/dashboard/users/csrf_token", { withCredentials: true })
      .then((response) => {
        setCsrfToken(response.data);
        console.log("Received CSRF token: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching CSRF token", error.response);
      });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Use URLSearchParams or FormData to encode the data as form data
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);

      const response = await axiosInstance.post(
        "/dashboard/users/create",
        formData,
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
          withCredentials: true,
        }
      );

      console.log("Registration successful", response.data);
      navigate("/login");
    } catch (error) {
      setRegisterError("Registration failed. Please try again.");
      console.error("Registration failed", error.response);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center">
      <div className="relative xxs:h-[500px] sm:h-[1080px] text-black w-screen flex h-full xxs:flex-col sm:flex-row xxs:gap-6 sm:gap-0 p-2">
        <div className="xxs:w-full sm:w-1/2 flex flex-col h-full justify-center items-center relative">
          {/* Background and Product Name */}
          <h2 className="xxs:text-sm lg:text-2xl font-bold z-10 bg-zinc-100 p-2 rounded-xl shadow-xl">
            Hospital Management System
          </h2>
          <div className="absolute inset-1 shadow-md rounded-b-2xl">
            <img
              src={photo}
              alt="Background"
              className="object-cover objec object-center w-full h-full opacity-30"
            />
          </div>
          <span className="absolute xxs:bottom-0 lg:bottom-2 xxs:tracking-normal sm:tracking-wider xxs:text-xs sm:text-sm lg:text-lg mt-10 font-mono font-bold text-black p-1">
            Swikriti Timilsina
          </span>
        </div>
        <div className="h-full xxs:bg-white sm:bg-zinc-100 flex flex-col items-center justify-center xxs:w-full sm:w-1/2 rounded-lg">
          {/* Username and Password Input */}
          <div className="flex h-full items-center p-2">
            <form onSubmit={handleRegister} className="flex-col flex">
              <label for="username" className="text-xs font-semibold mb-1 p-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="p-2 placeholder:text-sm bg-white xxs:border xxs:border-black sm:border-none rounded-lg mb-4"
                required
              />
              <label for="email" className="text-xs font-semibold mb-1 p-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 placeholder:text-sm bg-white xxs:border xxs:border-black sm:border-none rounded-lg mb-4"
                placeholder="Email"
                required
              />

              <label for="password" className="text-xs font-semibold mb-1 p-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="p-2 placeholder:text-sm bg-white xxs:border xxs:border-black sm:border-none rounded-lg mb-4"
                required
              />
              <button
                type="submit"
                className="xxs:w-48 lg:w-96 bg-zinc-800 mx-auto rounded-lg hover:bg-zinc-900 text-center text-white p-2"
              >
                Register
              </button>
            </form>
          </div>
          {registerError && <p className="text-red-500">{registerError}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
