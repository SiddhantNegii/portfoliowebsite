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
        I’m someone who loves exploring how things work — whether that’s training a machine learning model, uncovering security loopholes, or building tools that make life easier. I enjoy moving across domains, picking up new skills, and applying them in ways that solve real problems.

My projects have taught me a lot — not just technically, but also in how to approach real-world challenges that have an impact beyond just code. They’ve reinforced how much I enjoy working on things that make a tangible difference.

Outside of tech, I enjoy observing, questioning, and occasionally going down rabbit holes I didn't plan for — whether it's in anime lore, human psychology, or why my code worked yesterday but refuses to compile today. I believe life’s best when you’re constantly evolving — not just professionally, but as a person.

If you’re working on something interesting — or just want to talk ideas, tech, or anything in between — I’m always open to connect.
      </motion.p>
    </section>
  );
};

export default About;
