'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

const data = [
  { name: 'Week 1', Cables: 4000, Soundbars: 2400, 'SD Cards': 2400, Speakers: 1500 },
  { name: 'Week 2', Cables: 4500, Soundbars: 3200, 'SD Cards': 2600, Speakers: 1700 },
  { name: 'Week 3', Cables: 4200, Soundbars: 4800, 'SD Cards': 2900, Speakers: 2200 },
  { name: 'Week 4', Cables: 4800, Soundbars: 6800, 'SD Cards': 3500, Speakers: 2800 },
];

export default function AnalyticsChart() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm h-full flex flex-col group/container hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg group-hover/container:scale-110 transition-transform duration-300">
            <Activity size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Global Upselling Trends</h2>
        </div>
        <div className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
          <TrendingUp size={14} className="mr-1" /> Soundbars +183%
        </div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Search volume growth over the last 30 days. Highlighting the fastest growing product categories.
      </p>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => (value / 1000) + 'k'}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            
            <Line type="monotone" dataKey="Soundbars" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Cables" stroke="#3b82f6" strokeWidth={2} dot={false} opacity={0.6} />
            <Line type="monotone" dataKey="SD Cards" stroke="#10b981" strokeWidth={2} dot={false} opacity={0.6} />
            <Line type="monotone" dataKey="Speakers" stroke="#f59e0b" strokeWidth={2} dot={false} opacity={0.6} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
