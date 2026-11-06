import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "./Eyebrow";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Editorial section heading.
 * Supports centered and asymmetric (default) layouts.
 */
const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}) => {
  const prefersReducedMotion = useReducedMotion();

  const alignment =
    align === "center" ? "mx-auto items-center text-center" : "items-start text-left";

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
      className={`flex max-w-3xl flex-col gap-5 ${alignment} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={titleVariants}
    >
      {eyebrow && (
        <motion.div variants={descVariants}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
      )}

      <motion.h2
        variants={titleVariants}
        className={`max-w-2xl font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-5xl lg:text-6xl ${
          align === "center" ? "mx-auto" : ""
        }`}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          variants={descVariants}
          className={`max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
