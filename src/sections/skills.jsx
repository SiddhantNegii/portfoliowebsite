// sections/Skills.jsx
import React, { useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect } from "react";

const skillGroups = {
  "Languages": ["Python", "C++", "C", "Java", "JavaScript", "SQL", "HTML", "CSS"],
  "Frameworks & Libraries": [
    "React", "Next.js", "Express", "Tailwind", 
    "NumPy", "Pandas", "scikit-learn", "TensorFlow", "PyTorch", "YOLO"
  ],
  "Dev Tools": ["Git", "GitHub", "Docker", "Jupyter", "VS Code", "Node.js"],
  "Cloud & DevOps": ["AWS", "Jenkins", "Linux"],
  "Security & Monitoring": ["Splunk", "Netskope", "Cybersecurity", "CrowdStrike"],
  "API & Integrations": ["REST APIs", "Slack", "Glean", "OpenAI", "AuditBoard"],
  "Databases": ["MongoDB", "SQL"]
};

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

        {Object.entries(skillGroups).map(([category, skills], idx) => (
          <motion.div key={idx} className="mb-8" variants={container}>
            <motion.h3 className="text-xl font-semibold text-secondary mb-4" variants={item}>
              {category}
            </motion.h3>
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="px-4 py-2 bg-white dark:bg-neutral-800 text-sm rounded-full border border-gray-300 dark:border-neutral-600 shadow-sm hover:scale-105 transition-transform"
                  variants={item}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
