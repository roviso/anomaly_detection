import React from "react";
import photo from "../../resources/hospital-empanelment.png";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

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
          Welcome to Hospital Management System
          </span>
        </div>
        <div className="h-full xxs:bg-white sm:bg-zinc-100 flex xxs:w-full sm:w-1/2 rounded-lg">
          {/* Buttons for Login or Register */}
          <div className="w-full flex justify-center flex-col gap-4 h-full">
            <button
              className="xxs:w-48 lg:w-96 bg-zinc-800 mx-auto rounded-lg hover:bg-zinc-900 text-center text-white p-2"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
            <button
              className="xxs:w-48 lg:w-96 bg-zinc-800 mx-auto rounded-lg hover:bg-zinc-900 text-center text-white p-2"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
