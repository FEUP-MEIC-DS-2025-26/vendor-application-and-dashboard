import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SalesDataPoint } from "../types/dashboard";

interface SalesChartProps {
  data: SalesDataPoint[];
  currency: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, currency }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No sales data available for this period.</p>
      </div>
    );
  }

  // Formata a data para "MM-DD"
  const formattedData = data.map(item => ({
    ...item,
    shortDate: item.date.substring(5),
  }));

  return (
    <section className="dashboard-section">
      <h2 className="section-title">Sales Performance (Last 30 Days)</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5a3c" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5a3c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis 
              dataKey="shortDate"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number | string) => `${currency}${value}`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "#fff", 
                borderRadius: "8px", 
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
              formatter={(value: number | string) => [`${currency}${value}`, "Sales"]}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#8b5a3c"
              fillOpacity={1}
              fill="url(#colorSales)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default SalesChart;
