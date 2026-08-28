export function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs uppercase tracking-wider text-ash mb-1.5">{label}</span>
      )}
      <input
        className={`w-full bg-abyss border ${error ? "border-blood" : "border-wine"} 
          rounded-md px-3 py-2 text-sm text-ivory placeholder:text-smoke
          focus:border-crimson focus:outline-none transition duration-200 ${className}`}
        {...props}
      />
      {error && <span className="block text-xs text-blood mt-1">{error}</span>}
    </label>
  );
}

export function Select({ label, error, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs uppercase tracking-wider text-ash mb-1.5">{label}</span>
      )}
      <select
        className={`w-full bg-abyss border ${error ? "border-blood" : "border-wine"} 
          rounded-md px-3 py-2 text-sm text-ivory
          focus:border-crimson focus:outline-none transition duration-200 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="block text-xs text-blood mt-1">{error}</span>}
    </label>
  );
}
