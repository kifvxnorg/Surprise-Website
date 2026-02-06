import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export function Section({ children, className, delay = 0, id }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={cn("w-full py-16 md:py-24 px-4 relative z-10", className)}
    >
      {children}
    </motion.section>
  );
}
