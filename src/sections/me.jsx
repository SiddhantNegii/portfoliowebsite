import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation
import EchoesBot from '/avatar.jpg';

const Me = () => {
  const navigate = useNavigate();

  const goToChatbot = () => {
    navigate('/chatbot');
  };

  return (
    <section
      id="me"
      className="min-h-screen flex flex-col md:flex-row justify-center items-center text-center md:text-left px-6 py-12 gap-10"
    >
      {/* Left Text Section */}
      <div className="flex-1 space-y-6">
        <motion.h1
          className="text-4xl md:text-6xl font-bold leading-tight"
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Hi, I’m Siddhant
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted max-w-xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          A Security & ML Enthusiast who likes to build cool things and learn faster than LLMs 👨‍💻✨
        </motion.p>

        {/* Redirect Button to Chatbot */}
        <motion.div
          className="flex items-center gap-4 mt-6 cursor-pointer bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-full shadow-md w-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          onClick={goToChatbot}
        >
          <img
            src={EchoesBot}
            alt="Echoes Bot Avatar"
            className="w-10 h-10 rounded-full border border-white"
          />
          <span className="text-md font-semibold">Talk to Echoes Companion</span>
        </motion.div>
      </div>

      {/* Right Image Section */}
      <motion.div
        className="flex-1 max-w-xs md:max-w-sm"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <img
          src="/picture.jpg"
          alt="Siddhant"
          className="w-full rounded-full border-4 border-primary shadow-md"
        />
      </motion.div>
    </section>
  );
};

export default Me;
