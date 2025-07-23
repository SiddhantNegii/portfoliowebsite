// sections/Experience.jsx
import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const experiences = [
  {
    title: "Security Engineering Intern",
    company: "Cvent",
    duration: "Jan 2025 - Present",
    description: [
      "Working on automation and security tools",
      "Integrating Slack bots with OpenAI and internal search tools",
      "Performing risk analysis for browser extensions"
    ]
  },
  {
    title: "Machine Learning Intern",
    company: "Some Startup",
    duration: "Aug 2024 - Dec 2024",
    description: [
      "Built ML models for text classification and forecasting",
      "Worked with NLP and XGBoost for production use",
      "Collaborated with devs to deploy models"
    ]
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 }
};

export default function Experience() {
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
    <section id="experience" className="px-6 md:px-20 py-20 bg-white dark:bg-neutral-950">
      <motion.div
        ref={ref}
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate={controls}
        variants={container}
      >
        <motion.h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-10" variants={item}>
          Experience
        </motion.h2>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 dark:bg-neutral-900 p-6 rounded-lg shadow-md"
              variants={item}
            >
              <h3 className="text-xl font-semibold">{exp.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company} — {exp.duration}</p>
              <ul className="list-disc list-inside mt-3 text-gray-800 dark:text-gray-200">
                {exp.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
