"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiUserCircle,
  HiOutlineLogout,
  HiMenu,
  HiX,
} from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import axios from "axios";
import LoginModel from "./LoginModel";
import CampaignForm from "./CampaignForm";
import FormModal from "./AddCampaignForm";
const PublicHeader = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage?.getItem("authToken"));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://temple-donation.onrender.com/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (typeof window !== "undefined") {
        localStorage?.removeItem("authToken");
      }
      setIsProfileDropdownOpen(false);
      setToken(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigationLinks = [
    { name: "How it works?", path: "/" },
    { name: "Explore Campaign", path: "/about" },
    { name: "Featured Campaign", path: "/campaigns" },
    { name: "FAQ", path: "#faq" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  src="/logo1.png"
                  alt="Logo"
                  className="w-44 h-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {navigationLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* <button
                onClick={() => setIsCampaignModalOpen(true)}
                className="hidden sm:block bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-red-600 hover:to-yellow-600 transition duration-300"
              >
                Start Campaign
              </button> */}

              {token ? (
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <HiUserCircle className="w-6 h-6 text-gray-700" />
                    <IoIosArrowDown className="w-4 h-4 text-gray-700" />
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-150"
                      >
                        <FiUser className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-150"
                      >
                        <HiOutlineLogout className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gradient-to-r  bg-orange-600 text-white px-4 py-[5px] rounded-full text-sm font-semibold  transition duration-300"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="text-gray-700 focus:outline-none"
                >
                  <HiMenu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-md py-4 px-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <Link to="/">
                  <img
                    src="/logo1.png"
                    alt="Logo"
                    className="w-36 h-auto"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 focus:outline-none"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col space-y-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsCampaignModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold  transition duration-300"
                >
                   <a href="https://tally.so/r/w4Lgjb" target='_blank'>
                  Start a Campaign
                   </a>
                </button>
                {token ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiUser className="w-5 h-5 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                    >
                      <HiOutlineLogout className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r  to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-blue-900 hover:to-yellow-600 transition duration-300"
                  >
                    Login
                  </button>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <LoginModel
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <FormModal
        open={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
      />
    </>
  );
};

export default PublicHeader;
