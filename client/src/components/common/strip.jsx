import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './strip.css';

const Strip = ({ step, text,delay }) => {
  const [showStrip, setShowStrip] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowStrip(true);
    }, delay);

    // Clear the timeout when component unmounts
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <motion.div
      className={`strip ${showStrip ? 'show' : ''}`}
      initial={{ x: '-100vw' }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 120, duration: 0.5 }}
    >
      <p>Step {step} &gt; {text}</p>
    </motion.div>
  );
};

export default Strip;

