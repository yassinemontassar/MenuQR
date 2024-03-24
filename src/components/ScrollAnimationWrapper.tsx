import { motion } from 'framer-motion';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any; // Allow for additional props for flexibility
}

export default function ScrollAnimationWrapper({
  children,
  className,
  ...props
}: ScrollAnimationWrapperProps) {
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.8 }}
      className={className}
      {...props} // Spread remaining props to the div
    >
      {children}
    </motion.div>
  );
}
