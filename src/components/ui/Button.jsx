import { motion } from "framer-motion";

const VARIANT_CLASSES = {
  primary:
    "bg-[var(--color-primary)] text-[#06170d] hover:bg-[var(--color-primary-light)] shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_8px_20px_-8px_rgba(34,197,94,0.55)]",
  secondary:
    "bg-[var(--color-card)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-card-hover)]",
  ghost:
    "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/5",
  icon: "bg-[var(--color-card)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]",
};

const SIZE_CLASSES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-[15px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  isIconOnly = false,
  disabled = false,
  type = "button",
  className = "",
  onClick,
  ...rest
}) {
  const iconOnlySize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-10 w-10";

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.015 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        "transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
        VARIANT_CLASSES[variant],
        isIconOnly ? iconOnlySize : SIZE_CLASSES[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {Icon && iconPosition === "left" && <Icon size={16} strokeWidth={2.25} />}
      {!isIconOnly && children}
      {Icon && iconPosition === "right" && <Icon size={16} strokeWidth={2.25} />}
    </motion.button>
  );
}
