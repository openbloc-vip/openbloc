import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../hooks/useTheme';
import { Boulder, CompletedBoulder } from '../../types';

interface PopularityBarChartProps {
  completedBoulders: CompletedBoulder[];
  boulders: Boulder[];
}

const PopularityBarChart = ({ completedBoulders, boulders }: PopularityBarChartProps) => {
  const { theme } = useTheme();

  const data = React.useMemo(() => {
    const popularity: Record<string, number> = {};
    completedBoulders.forEach(cb => {
      popularity[cb.boulder_id] = (popularity[cb.boulder_id] || 0) + 1;
    });

    return Object.entries(popularity)
      .map(([boulderId, count]) => ({
        boulderId,
        count,
        boulderNumber: boulders.find(b => b.id === boulderId)?.number || 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [completedBoulders, boulders]);

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLine: { lineStyle: { color: theme === 'dark' ? '#BDBBDD' : '#6A603C' } }
    },
    yAxis: {
      type: 'category',
      data: data.map(item => `Boulder ${item.boulderNumber}`).reverse(),
      axisLine: { lineStyle: { color: theme === 'dark' ? '#BDBBDD' : '#6A603C' } }
    },
    series: [
      {
        name: 'Completions',
        type: 'bar',
        data: data.map(item => item.count).reverse(),
        itemStyle: { color: '#8A87B1' }
      }
    ]
  };

  return <ReactECharts option={option} theme={theme} style={{ height: '400px' }} />;
};

export default PopularityBarChart;
