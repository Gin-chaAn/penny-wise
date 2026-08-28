import { NavLink } from "react-router-dom";
import { formatMonthLabel, currentMonthKey } from "../../utils/format";

const navItems = [
  { to: "/", label: "OVERVIEW" },
  { to: "/fixed", label: "FIXED" },
  { to: "/random", label: "RANDOM" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-wine bg-abyss/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-xl text-ivory tracking-widest">PENNY WISE</h1>
          <span className="text-xs text-smoke tracking-wider hidden sm:inline">
            {formatMonthLabel(currentMonthKey())}
          </span>
        </div>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs tracking-widest rounded-md transition duration-200 border-b-2 ${
                  isActive
                    ? "text-ivory border-crimson"
                    : "text-ash border-transparent hover:text-ivory hover:border-smoke/40"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
