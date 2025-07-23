// components/ScrollProgress.jsx
import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/themecontext';

const ScrollProgress = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const { theme } = useTheme();

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollY / docHeight) * 100;
    setScrollTop(scrolled);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const progressColor = theme === 'dark' ? 'bg-dark-accent' : 'bg-light-secondary';

  return (
    <div className="fixed top-[64px] left-0 w-full h-2 z-40 bg-transparent">
      <div
        className={`h-full transition-all duration-150 ease-out ${progressColor}`}
        style={{ width: `${scrollTop}%` }}
      />
    </div>
  );
};

export default ScrollProgress;
