import { ReactElement, useEffect } from 'react';

// third party
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// =============================|| LANDING - FADE IN ANIMATION ||============================= //

const FadeInWhenVisible = ({ children }: { children: ReactElement }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.4 }}
      variants={{
        visible: { opacity: 1, translateY: 0 },
        hidden: { opacity: 0, translateY: 300 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInWhenVisible;