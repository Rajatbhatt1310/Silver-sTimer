import { motion } from "framer-motion";

export default function Card({
  children,
  as = "div",
  hover = false,
  padding = "p-6",
  className = "",
  ...rest
}) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={[
        "rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)]",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.02)_inset]",
        hover ? "hover:border-[var(--color-border-strong)] transition-colors duration-200" : "",
        padding,
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </Component>
  );
}
