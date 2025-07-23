import { motion } from 'framer-motion';
import React from 'react';

const About = () => {
  return (
    <section id="about" className="px-6 md:px-16 py-20 bg-gray-100 dark:bg-gray-900">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        About Me
      </motion.h2>

      <motion.p
        className="max-w-3xl mx-auto text-lg text-center text-muted"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        I’m currently interning as a Security Engineer at Cvent, pursuing BTech in Computer Science. I’m passionate about ML, security automation, and building real-world tools like browser extension analyzers and internal bots.
      </motion.p>
    </section>
  );
};

export default About;
