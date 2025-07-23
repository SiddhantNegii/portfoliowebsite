import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/themecontext';

const CustomCursor = () => {
  const { theme } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => setPosition({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', move);
    return () => document.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer Circle */}
      <div
        className={`w-8 h-8 rounded-full border-2 ${
          theme === 'dark' ? 'border-white' : 'border-black'
        } relative`}
      >
        {/* Center Dot */}
        <div
          className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${
            theme === 'dark' ? 'bg-white' : 'bg-black'
          }`}
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
};

export default CustomCursor;
