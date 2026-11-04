import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Editorial section heading.
 * Supports centered and asymmetric (default) layouts.
 */
const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "center",
  titleSize = "text-4xl sm:text-5xl",
}) => {
  const prefersReducedMotion = useReducedMotion();

  const alignment =
    align === "center"
      ? "mx-auto text-center items-center"
      : "text-left items-start";

  const titleVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE },
    },
  };

  const descVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.12, ease: EASE },
    },
  };

  return (
    <motion.div
      className={`flex max-w-3xl flex-col gap-5 ${alignment}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={titleVariants}
    >
      {eyebrow && (
        <motion.p
          variants={descVariants}
          className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#fa520f]"
        >
          {eyebrow}
        </motion.p>
      )}

      <motion.h2
        variants={titleVariants}
        className={`max-w-2xl text-4xl font-bold tracking-[-0.02em] text-[#18181b] sm:text-5xl lg:text-6xl ${align === "center" ? "mx-auto" : ""}`}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          variants={descVariants}
          className={`mt-2 max-w-2xl text-base leading-relaxed text-[#737373] sm:text-lg ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
