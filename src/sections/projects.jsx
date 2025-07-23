// sections/Projects.jsx
import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const projects = [
  {
    title: "Cab Booking Website",
    description: "A working Uber-like website with Google Maps, real-time cab location tracking, and closest cab assignment.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Google Maps API"],
    link: "https://yourcabapp.com"
  },
  {
    title: "Car IoT Simulator",
    description: "A car simulator controlled via an IoT dashboard using sensors and actuators. Built on Arduino and Python.",
    tech: ["Arduino", "Python", "Serial Communication", "Sensors"],
    link: "#"
  },
  {
    title: "Chrome Extension Risk Scorer",
    description: "Extracts metadata and security features from Chrome extensions and gives a risk score using XGBoost.",
    tech: ["Python", "Machine Learning", "Browser Security"],
    link: "#"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function Projects() {
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
    <section id="projects" className="px-6 md:px-20 py-20 bg-gray-50 dark:bg-neutral-950">
      <motion.div
        ref={ref}
        className="max-w-5xl mx-auto"
        initial="hidden"
        animate={controls}
        variants={container}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-primary text-center mb-12"
          variants={item}
        >
          Projects
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md"
              variants={item}
            >
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-primary font-medium">
                {project.tech.map((tech, i) => (
                  <span key={i} className="bg-primary/10 dark:bg-white/10 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  View Project →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
