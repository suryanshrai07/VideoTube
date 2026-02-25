import React,{useState} from "react";
import logo from "../assets/logo.svg";
import searchIcon from "../assets/search-bar.svg";
import signUpSvg from "../assets/sign-up.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UploadVideo from "./UploadVideo";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="w-full h-13 sm:h-18  border-b border-[#EAECF0] bg-black sm:px-7 px-2">
      <div className="flex items-center justify-between">
        <div className="logo">
          <img
            src={logo}
            alt="logo"
            className="cursor-pointer w-7.75 sm:w-full"
          />
        </div>

        <div className="search-bar relative sm:w-full w-1/2 md:max-w-md">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <img src={searchIcon} alt="search-bar" />
          </div>
          <input
            type="search"
            name="search-bar"
            id="search-bar"
            className="w-full h-9 sm:h-11 pl-12 pr-4 bg-transparent border border-[#EAECF0] rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
            placeholder="Search"
          />
        </div>

        <div className="buttons flex items-center gap-2 sm:gap-4 ">
          {!isAuthenticated && (
            <>
              <button
                onClick={() => navigate("/sign-in")}
                className="text-white  font-semibold px-2  sm:px-6 py-3 hover:opacity-80 transition-opacity cursor-pointer"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/sign-up")}
                className="hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img src={signUpSvg} alt="sign-up" className="h-9 sm:h-12" />
              </button>
            </>
          )}

          {isAuthenticated && (
            <div>
              <button
                className="flex items-center justify-center gap-1.5 text-white font-normal text-xs border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-sm transition-all duration-200 px-2 py-2 rounded-full md:text-sm md:px-4 md:py-2 md:rounded-lg cursor-pointer"
                onClick={() => setShowUpload(true)}
              >
                <span className="text-base leading-none">+</span>
                <span>New video</span>
              </button>
            </div>
          )}

          {showUpload && (
            <UploadVideo
              onClose={() => setShowUpload(false)}
            />
          )}
          {isAuthenticated && (
            <>
              <img
                src={user.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white ring-2 ring-indigo-200 cursor-pointer"
                onClick={() => navigate(`/user/${user.username}`)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
