// sections/Skills.jsx
import React, { useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect } from "react";

const skills = [
  "JavaScript", "React", "Next.js", "Node.js",
  "Python", "Express", "MongoDB", "SQL",
  "HTML", "CSS", "Tailwind", "Git",
  "AWS", "Docker", "Linux", "Cybersecurity"
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("show");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  return (
    <section id="skills" className="px-6 md:px-20 py-20 bg-gray-100 dark:bg-neutral-900">
      <motion.div
        ref={ref}
        className="max-w-4xl mx-auto text-center"
        initial="hidden"
        animate={controls}
        variants={container}
      >
        <motion.h2 className="text-3xl md:text-4xl font-bold text-primary mb-8" variants={item}>
          Skills
        </motion.h2>

        <motion.div className="flex flex-wrap justify-center gap-4" variants={container}>
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              className="px-4 py-2 bg-white dark:bg-neutral-800 text-sm rounded-full border border-gray-300 dark:border-neutral-600 shadow-sm hover:scale-105 transition-transform"
              variants={item}
            >
              {skill}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
