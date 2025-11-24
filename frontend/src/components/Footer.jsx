import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = ({
  brand = "QuizMaster",
  year = new Date().getFullYear(),
  navLinks = [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Support", href: "#" },
  ],
  socialLinks = [
    { href: "https://github.com/Vignesh-Ajri", icon: <FaGithub /> },
    // { href: "https://twitter.com", icon: <FaTwitter /> },
    {
      href: "https://linkedin.com/in/vignesh-s-a127172a",
      icon: <FaLinkedin />,
    },
  ],
}) => {
  return (
    <footer className="bg-white dark:bg-gray-900 py-6 mt-auto shadow-inner">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Section: Brand & Links */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {year} {brand}. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Section: Social Icons */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-2xl text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
