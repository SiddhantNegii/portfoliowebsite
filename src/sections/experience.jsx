// sections/Experience.jsx
import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const experiences = [
  {
  title: "Security Engineering Intern",
  company: "Cvent (Global SaaS, Gurugram / Hybrid)",
  duration: "Jan 2025 – July 2025",
  description: [
    "Automated Netskope tagging for 500+ apps using Python, GitHub Actions, Jenkins, and Groovy",
    "Built a Slack Help Bot using Glean API + Azure OpenAI (TF-IDF + cosine similarity); reduced manual load by 40%",
    "Developed an XGBoost-based ML pipeline to assess Chrome extension risks via manifest, CSP, and permissions",
    "Contributed to insider threat detection using Splunk and behavioral log analysis"
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
