import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Heart({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: "100vh", x: Math.random() * 100 - 50 }}
      animate={{
        opacity: [0, 1, 0],
        y: "-20vh",
        x: Math.random() * 200 - 100,
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
      className="fixed text-primary/20 z-0 pointer-events-none text-4xl select-none"
      style={{ left: `${Math.random() * 100}%` }}
    >
      ❤️
    </motion.div>
  );
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<number[]>([]);

  useEffect(() => {
    // Generate static array only once on mount to avoid re-renders
    setHearts(Array.from({ length: 15 }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((i) => (
        <Heart key={i} delay={i * 2} />
      ))}
    </div>
  );
}
