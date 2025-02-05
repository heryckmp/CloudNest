"use client";

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ActivityData {
  date: string;
  uploads: number;
  downloads: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

const ActivityChart = ({ data }: ActivityChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'currentColor' }}
            tickLine={{ stroke: 'currentColor' }}
          />
          <YAxis
            tick={{ fill: 'currentColor' }}
            tickLine={{ stroke: 'currentColor' }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg bg-white p-3 shadow-lg dark:bg-gray-800">
                    <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {label}
                    </p>
                    {payload.map((entry) => (
                      <p
                        key={entry.name}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: entry.color }}
                      >
                        <span className="font-medium">
                          {entry.name === 'uploads' ? 'Uploads' : 'Downloads'}:
                        </span>
                        {entry.value}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="uploads"
            stackId="1"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="downloads"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart; 