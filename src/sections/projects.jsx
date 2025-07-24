// sections/Projects.jsx
import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const projects = [
  {
    title: "Forest Fire Detection using YOLOv8n",
    description:
      "Live forest fire detection using YOLOv8n trained on a custom dataset. Integrated with a buzzer and Gmail alert system for real-time deployment.",
    tech: ["Python", "OpenCV", "YOLOv8n", "NumPy", "smtplib", "Webcam"],
    link: "#"
  },
  {
    title: "Motion-Controlled Car Simulator",
    description:
      "Physical car simulator controller using Arduino, tilt, and Hall sensors. Pedals and steering mapped to keyboard inputs for immersive gameplay.",
    tech: ["Arduino", "C++", "Sensors", "Serial Communication"],
    link: "#"
  },
  {
    title: "Portfolio Website + Groq Chatbot",
    description:
      "Personal portfolio built with React and Node.js. Integrated Groq API to power a chatbot capable of answering dynamic queries.",
    tech: ["React.js", "Node.js", "Vercel", "Groq API", "GitHub Pages"],
    link: "#"
  },
  {
    title: "Touchless Gesture-Controlled Keyboard",
    description:
      "Virtual keyboard that detects hand gestures using MediaPipe and OpenCV. Optimized for use with medical gloves in offline settings.",
    tech: ["Python", "OpenCV", "MediaPipe", "NumPy"],
    link: "#"
  },
  {
    title: "Twitter Sentiment Analysis",
    description:
      "Sentiment classifier trained on Twitter data using TF-IDF and Random Forest. Evaluated and visualized results using sklearn and matplotlib.",
    tech: ["Python", "scikit-learn", "TF-IDF", "Pandas", "Matplotlib"],
    link: "#"
  },
  {
    title: "Chrome Extension Malware Detector",
    description:
      "Real-time malware detection extension using YARA rules and threat intelligence. Backend scanning in Python, alerts via browser notifications.",
    tech: ["JavaScript", "Python", "YARA", "Chrome API"],
    link: "#"
  },
  {
    title: "Telegram Chatbot for University Helpdesk",
    description:
      "Python-based GUI chatbot linked with Telegram for GEHU students. Handled academic queries using regex and link buttons in Tkinter.",
    tech: ["Python", "Tkinter", "Regex", "Telegram API"],
    link: "#"
  },
  {
    title: "Virtual Petrological Microscope",
    description:
      "Desktop app mimicking a microscope for rock/mineral samples. Supports zoom, rotate, and sample loading with Pillow and Tkinter.",
    tech: ["Python", "Tkinter", "Pillow"],
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
  className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
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
  className="inline-block mt-4 text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300"
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
