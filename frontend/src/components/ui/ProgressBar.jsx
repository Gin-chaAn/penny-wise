/**
 * Spending-limit progress bar. Color reflects status per spec section 20:
 * normal -> penny-crimson, caution/warning -> muted-rose/deep-crimson, exceeded -> blood-red.
 */
const statusColor = {
  normal: "bg-crimson",
  caution: "bg-rose",
  warning: "bg-crimsonDeep",
  exceeded: "bg-blood shadow-glowStrong",
};

const statusLabel = {
  normal: "ON TRACK",
  caution: "CAUTION",
  warning: "APPROACHING LIMIT",
  exceeded: "LIMIT EXCEEDED",
};

export default function ProgressBar({ percentage, status = "normal" }) {
  const clamped = Math.min(percentage, 100);
  return (
    <div>
      <div className="w-full h-2.5 rounded-full bg-charcoal border border-wine overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${statusColor[status]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-ash tracking-wide">{statusLabel[status]}</span>
        <span className="text-ivory font-medium">{percentage}% USED</span>
      </div>
    </div>
  );
}
