import React from 'react';

const Contact = () => {
  const openEmailClient = () => {
    const email = "siddhantnegi275@gmail.com";
    const subject = "Let's Connect";
    const body = "Hi Siddhant, I wanted to reach out...";

    const userAgent = window.navigator.userAgent.toLowerCase();

    // Gmail
    if (userAgent.includes("gmail") || userAgent.includes("chrome")) {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
        "_blank"
      );
    }
    // Outlook
    else if (userAgent.includes("outlook") || userAgent.includes("windows")) {
      window.open(
        `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${subject}&body=${body}`,
        "_blank"
      );
    }
    // Fallback
    else {
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className="text-center px-6 md:px-20 py-10">
      <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
        Have a question or want to work together? Feel free to reach out!
      </p>
      <button
        onClick={openEmailClient}
        className="inline-block bg-light-secondary dark:bg-dark-secondary text-light-white dark:text-dark-accent px-6 py-3 rounded-lg hover:opacity-80 transition"
      >
        📩 Say Hello
      </button>
    </div>
  );
};

export default Contact;
