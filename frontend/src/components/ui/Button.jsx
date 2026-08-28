const variants = {
  primary:
    "bg-crimsonDeep text-ivory border border-crimson hover:bg-crimson hover:shadow-glow active:bg-crimsonDeep disabled:opacity-40 disabled:hover:shadow-none disabled:hover:bg-crimsonDeep",
  secondary:
    "bg-abyss text-ivory border border-crimson/40 hover:border-crimson hover:bg-charcoal active:bg-abyss disabled:opacity-40",
  destructive:
    "bg-crimsonDeep text-ivory border border-blood/60 hover:bg-blood hover:shadow-glowStrong active:opacity-90 disabled:opacity-40",
  ghost:
    "bg-transparent text-ash border border-transparent hover:text-ivory hover:border-smoke/30 disabled:opacity-40",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition duration-200
        ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
