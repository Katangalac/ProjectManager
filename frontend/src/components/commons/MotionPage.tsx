import { motion } from "framer-motion";
import { slideUp, smoothTransition } from "@/lib/motion";

// Composant MotionPage pour les animations de page
export default function MotionPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="show"
      exit="exit"
      transition={smoothTransition}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
