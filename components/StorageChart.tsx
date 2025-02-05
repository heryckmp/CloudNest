"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatStorageSize } from '@/lib/utils';

interface StorageChartProps {
  data: {
    name: string;
    size: number;
    color: string;
  }[];
  totalSpace: number;
}

const StorageChart = ({ data, totalSpace }: StorageChartProps) => {
  const usedSpace = data.reduce((acc, item) => acc + item.size, 0);
  const freeSpace = totalSpace - usedSpace;
  
  // Add free space to the data
  const chartData = [
    ...data,
    {
      name: 'Disponível',
      size: freeSpace,
      color: '#E2E8F0'
    }
  ];

  return (
    <div className="relative h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="size"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {data.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatStorageSize(data.size)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatStorageSize(usedSpace)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          de {formatStorageSize(totalSpace)}
        </p>
      </div>
    </div>
  );
};

export default StorageChart; 