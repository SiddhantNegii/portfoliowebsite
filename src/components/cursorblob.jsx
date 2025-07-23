import React, { useEffect, useRef } from "react";

const CursorBlob = () => {
  const blobRef = useRef(null);

  useEffect(() => {
    const blob = blobRef.current;

    const handlePointerMove = (e) => {
      const { clientX, clientY } = e;
      blob.animate(
        {
          transform: `translate(${clientX - 150}px, ${clientY - 150}px)`,
        },
        {
          duration: 3000,
          fill: "forwards",
          easing: "ease",
        }
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <svg
      ref={blobRef}
      className="fixed z-[-10] pointer-events-none mix-blend-difference"
      style={{
        top: 0,
        left: 0,
        width: 300,
        height: 300,
        opacity: 0.8,
      }}
      viewBox="0 0 600 600"
    >
      <defs>
        <filter id="blobFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
      <g filter="url(#blobFilter)">
        <path
          fill="#00FFD1"
          d="M421.5,320.5Q383,391,320.5,424Q258,457,192.5,419.5Q127,382,116,313.5Q105,245,135,179.5Q165,114,241,99Q317,84,376.5,132.5Q436,181,439.5,248Q443,315,421.5,320.5Z"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M421.5,320.5Q383,391,320.5,424Q258,457,192.5,419.5Q127,382,116,313.5Q105,245,135,179.5Q165,114,241,99Q317,84,376.5,132.5Q436,181,439.5,248Q443,315,421.5,320.5Z;
              M436.5,320.5Q396,376,330.5,392.5Q265,409,190.5,389.5Q116,370,91,300Q66,230,117,171.5Q168,113,243,94Q318,75,374.5,122Q431,169,441.5,239.5Q452,310,436.5,320.5Z;
              M421.5,320.5Q383,391,320.5,424Q258,457,192.5,419.5Q127,382,116,313.5Q105,245,135,179.5Q165,114,241,99Q317,84,376.5,132.5Q436,181,439.5,248Q443,315,421.5,320.5Z"
          />
        </path>
      </g>
    </svg>
  );
};

export default CursorBlob;
