import React from 'react';
import { useTheme } from '../context/themecontext';

const SunIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-5 h-5">
    <circle cx="32" cy="32" r="12" fill="#facc15" />
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * Math.PI) / 4;
      const x1 = 32 + 16 * Math.cos(angle);
      const y1 = 32 + 16 * Math.sin(angle);
      const x2 = 32 + 22 * Math.cos(angle);
      const y2 = 32 + 22 * Math.sin(angle);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#facc15"
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-5 h-5">
    <circle cx="32" cy="32" r="14" fill="#e5e7eb" />
    <circle cx="40" cy="26" r="4" fill="#d1d5db" />
    <circle cx="24" cy="36" r="3" fill="#d1d5db" />
    <circle cx="36" cy="40" r="2" fill="#d1d5db" />
  </svg>
);

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

      {/* Right: Toggle + Resume */}
      <div className="flex items-center gap-4 pr-6">
        {/* Toggle switch */}
        <div
          onClick={toggleTheme}
          className={`cursor-pointer w-20 h-10 rounded-full flex items-center px-1 transition-all duration-500 shadow-inner
            ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-yellow-300 to-blue-400'}
          `}
        >
          <div
            className={`w-8 h-8 rounded-full shadow-lg transform transition-transform duration-500 ease-in-out flex items-center justify-center
              ${isDarkMode ? 'translate-x-10 bg-gray-200' : 'translate-x-0 bg-yellow-400'}
            `}
          >
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
          </div>
        </div>

        {/* Resume Button */}
        <a
          href="https://drive.google.com/drive/folders/1Brxbntg-LMhTU5FmgqTw_PIyo7faXdY2"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-4 py-2 rounded-md bg-accent text-white font-medium shadow hover:bg-accent-dark transition-all"
        >
          Résumé
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
