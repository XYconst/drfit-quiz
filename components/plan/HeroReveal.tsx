'use client';
import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 0.61, 0.36, 1] as const } },
};

export function HeroStagger({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function HeroItem({ children, className, as: Tag = 'div', style }: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'h1' | 'p' | 'span';
  style?: React.CSSProperties;
}) {
  const M = motion[Tag];
  return (
    <M variants={item} className={className} style={style}>
      {children}
    </M>
  );
}
