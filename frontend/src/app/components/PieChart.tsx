"use client"

import React from "react"
import { 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

const COLORS = ["#ff6b6b", "#51cf66", "#10b981", "#06b6d4"]

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radian = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * radian)
  const y = cy + radius * Math.sin(-midAngle * radian)

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="12px"
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  )
}

export default function CategoryPieChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data)
    .map(([name, value], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: parseFloat(value.toFixed(2)),
    }))
    .filter(item => item.value > 0)

  return (
    <div className="glass p-6 h-80">
      <h3 className="text-lg font-bold text-white mb-6 text-center tracking-tight">
        Anomalies by Category
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            innerRadius={40}
            paddingAngle={3}
            minAngle={8}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}




// "use client";


// import React from "react";
// import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";


// const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];


// export default function CategoryPieChart({ data }: { data: Record<string, number> }) {
//   const chartData = Object.entries(data).map(([name, value]) => ({
//     name: name.charAt(0).toUpperCase() + name.slice(1),
//     value: parseFloat(value.toFixed(2)),
//   }));


//   return (
//     <div className="w-full h-80">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             data={chartData}
//             cx="50%"
//             cy="50%"
//             labelLine={false}
//             label={({ name, value }: { name: string; value: number }) => `${name}: ${value}%`}
//             outerRadius={100}
//             fill="#8884d8"
//             dataKey="value"
//           >
//             {chartData.map((_, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip formatter={(value) => `${value}%`} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

