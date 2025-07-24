import React from 'react';
import { useTheme } from '../context/themecontext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-light-bg dark:bg-dark-bg text-light-black dark:text-dark-accent shadow-md px-8 py-4 flex justify-between items-center">
      
      {/* Left-aligned nav buttons */}
      <div className="flex items-center space-x-10 pl-10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="relative text-sm hover:text-accent transition-all duration-300 ease-in-out group"
          >
            {item.label}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
          </button>
        ))}
      </div>

      {/* Custom toggle switch */}
      <div
        onClick={toggleTheme}
        className={`cursor-pointer w-20 h-10 rounded-full flex items-center px-1 transition-all duration-500
          ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-yellow-300 to-blue-400'}
        `}
      >
        <div
          className={`w-8 h-8 rounded-full shadow-md transform transition-transform duration-500 ease-in-out
            ${isDarkMode
              ? 'translate-x-10 bg-white flex items-center justify-center'
              : 'translate-x-0 bg-yellow-400 flex items-center justify-center'}
          `}
        >
          {isDarkMode ? (
            <span className="text-sm">🌙</span>
          ) : (
            <span className="text-sm">☀️</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
