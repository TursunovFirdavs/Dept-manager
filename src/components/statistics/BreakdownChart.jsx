import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 shadow-md rounded-lg p-3 z-50">
        <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {payload[0].name}
        </p>
        <p className="text-[14px] font-bold text-slate-900 dark:text-white">
          {payload[0].value.toLocaleString("fr-FR")} <span className="text-[11px] text-slate-500">UZS</span>
        </p>
      </div>
    );
  }
  return null;
};

export const BreakdownChart = ({ title, totalAmount, data, colors }) => {
  return (
    <Card className="w-full p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <Info className="w-4 h-4 text-slate-400" />
      </div>

      <div className="flex justify-center mb-6 relative h-50">
        {data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-35 h-35 rounded-full border-10 border-slate-100 dark:border-slate-800/50"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">
            Jami
          </p>
          <p className="text-[16px] font-bold text-slate-900 dark:text-white">
            {totalAmount >= 1000000
              ? (totalAmount / 1000000).toFixed(1) + "M"
              : totalAmount >= 1000
                ? (totalAmount / 1000).toFixed(1) + "k"
                : totalAmount.toLocaleString("fr-FR")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {data.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">Ma'lumot yo'q</p>
        ) : (
          data.slice(0, 4).map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-[13px]"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
              <span className="font-medium text-slate-500 dark:text-slate-400">
                {item.value.toLocaleString("uz-UZ")}
                <span className="text-[10px]">UZS</span>
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
