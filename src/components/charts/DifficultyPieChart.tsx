import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../hooks/useTheme';
import { Boulder, CompletedBoulder } from '../../types';

interface DifficultyPieChartProps {
  completedBoulders: CompletedBoulder[];
  boulders: Boulder[];
}

const DifficultyPieChart = ({ completedBoulders, boulders }: DifficultyPieChartProps) => {
  const { theme } = useTheme();

  const data = React.useMemo(() => {
    const difficultyCounts: Record<string, number> = {};
    completedBoulders.forEach(cb => {
      const boulder = boulders.find(b => b.id === cb.boulder_id);
      if (boulder) {
        difficultyCounts[boulder.difficulty] = (difficultyCounts[boulder.difficulty] || 0) + 1;
      }
    });
    return Object.entries(difficultyCounts).map(([name, value]) => ({ name, value }));
  }, [completedBoulders, boulders]);

  const option = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: theme === 'dark' ? '#F8F7F2' : '#1C1C1C' }
    },
    series: [
      {
        name: 'Completed Boulders',
        type: 'pie',
        radius: '70%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          color: theme === 'dark' ? '#F8F7F2' : '#1C1C1C'
        }
      }
    ],
    color: ['#4ade80', '#60a5fa', '#facc15', '#f87171', '#c084fc', '#374151'].reverse()
  };

  return <ReactECharts option={option} theme={theme} style={{ height: '400px' }} />;
};

export default DifficultyPieChart;
