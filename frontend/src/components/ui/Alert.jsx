export default function Alert({ children, variant = "error" }) {
  const styles =
    variant === "error"
      ? "border-blood/50 bg-blood/10 text-rose"
      : "border-crimson/50 bg-crimson/10 text-ivory";
  return (
    <div className={`border rounded-md px-3 py-2 text-sm ${styles}`} role="alert">
      {children}
    </div>
  );
}
