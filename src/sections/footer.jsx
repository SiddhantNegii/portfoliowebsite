import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center text-sm py-6 border-t dark:border-gray-800">
      <p className="text-muted">
        Made with ❤️ by Siddhant — {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
