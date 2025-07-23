import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 400);
          return 100;
        }
        return prev + 1;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0d0d0d] text-white font-mono"
        >
          {/* Percentage Text */}
          <div className="flex-grow flex items-center justify-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-5xl md:text-6xl font-bold tracking-widest text-[#9effe0]"
            >
              {progress.toString().padStart(3, "0")}%
            </motion.p>
          </div>

          {/* Bottom Progress Bar */}
          <div className="w-full h-1.5 bg-[#1a1a1a] overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#9effe0] to-[#60f3c7]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.16 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
