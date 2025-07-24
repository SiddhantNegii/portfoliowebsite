import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center text-sm py-6 border-t dark:border-gray-800">
      <p className="text-muted hover:opacity-70 transition-all duration-300 cursor-pointer">
  Made with ❤️ by Siddhant — {new Date().getFullYear()}
</p>

    </footer>
  );
};

export default Footer;
