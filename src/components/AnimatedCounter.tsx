'use client';

import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
}
export default function AnimatedCounter({ value }: AnimatedCounterProps) {
  const y = -24;
  return (
    <motion.div
      initial={{ y: y }}
      exit={{ y: y }}
      animate={{ y: 0 }}
      transition={{ duration: 0.15, delay: 0.3 }}
    >
      {value}
    </motion.div>
  );
}
