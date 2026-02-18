export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

export const slideLeft = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
};

export const spring = {
  type: "spring",
  stiffness: 300,
  damping: 26,
};

export const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export const smoothTransition = {
  duration: 0.8,
  ease: "easeOut" as const,
};

export const fadeTransition = {
  duration: 0.8,
  ease: "easeOut" as const,
};

export const fast = { duration: 0.2 };
