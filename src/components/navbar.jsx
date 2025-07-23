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
            className="relative text-sm hover:text-accent transition duration-200 group"
          >
            {item.label}
            {/* Underline on hover */}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
          </button>
        ))}
      </div>

      {/* Theme toggle button (right) */}
      <button
        onClick={toggleTheme}
        className="bg-light-secondary dark:bg-dark-secondary text-light-white dark:text-dark-accent px-3 py-1 rounded hover:opacity-80 transition"
      >
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </nav>
  );
};

export default Navbar;
