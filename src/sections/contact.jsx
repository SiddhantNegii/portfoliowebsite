import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaCode } from 'react-icons/fa';

const Contact = () => {
  const email = "siddhantnegi275@gmail.com";
  const subject = "Let's Connect";
  const body = "Hi Siddhant, I wanted to reach out...";

  const openGmail = () => {
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  return (
    <div className="text-center px-6 md:px-20 py-10">
      <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
        Have a question or want to work together? Feel free to reach out!
      </p>

      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={openGmail}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
        >
          <FaEnvelope /> Gmail
        </button>

        <a
          href="https://www.linkedin.com/in/siddhantnegii/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
        >
          <FaLinkedin /> LinkedIn
        </a>

        <a
          href="https://github.com/siddhantnegii"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
        >
          <FaGithub /> GitHub
        </a>

        <a
          href="https://leetcode.com/siddhantnegi"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-2 rounded-lg hover:opacity-90 transition"
        >
          <FaCode /> LeetCode
        </a>
      </div>
    </div>
  );
};

export default Contact;
