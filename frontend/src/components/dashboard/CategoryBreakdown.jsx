import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatCurrency } from "../../utils/format";

// Tonal variation within the Penny Wise palette only — no rainbow chart colors (spec section 18/19).
const CHART_COLORS = ["#7A1626", "#A51D2D", "#B85C68", "#4A0F18", "#241114", "#E8D8C8", "#B4AAA5", "#766D6A"];

export default function CategoryBreakdown({ items }) {
  if (!items || items.length === 0) {
    return (
      <Card>
        <p className="text-xs uppercase tracking-widest text-ash mb-4">Category Breakdown</p>
        <EmptyState
          title="NO SPENDING YET"
          description="Random expenses will appear here, grouped by category."
        />
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-xs uppercase tracking-widest text-ash mb-4">Category Breakdown</p>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="total"
                nameKey="category"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                stroke="#080606"
                strokeWidth={2}
              >
                {items.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  background: "#1A1516",
                  border: "1px solid #241114",
                  borderRadius: 8,
                  color: "#E8D8C8",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 w-full space-y-2">
          {items.map((item, i) => (
            <div key={item.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-ash">{item.category}</span>
              </div>
              <div className="text-ivory">
                {formatCurrency(item.total)}{" "}
                <span className="text-smoke text-xs">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
