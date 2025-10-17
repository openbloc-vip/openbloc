import React from 'react';
import { useData } from '../hooks/useData';
import { motion } from 'framer-motion';
import StatCard from '../components/common/StatCard';
import { Users, Target, BarChartHorizontal } from 'lucide-react';
import DifficultyPieChart from '../components/charts/DifficultyPieChart';
import PopularityBarChart from '../components/charts/PopularityBarChart';
import { Profile } from '../types';

const Stats = () => {
  const { profiles, boulders, completedBoulders, loading } = useData();

  const stats = React.useMemo(() => {
    if (loading || profiles.length === 0) {
      return {
        totalParticipants: 0,
        totalCompleted: 0,
        avgCompleted: '0.0',
      };
    }
    const participants = profiles.filter((p: Profile) => p.role === 'PARTICIPANT');
    const totalCompleted = completedBoulders.length;
    const avgCompleted = (totalCompleted / (participants.length || 1)).toFixed(1);

    return {
      totalParticipants: participants.length,
      totalCompleted,
      avgCompleted,
    };
  }, [profiles, completedBoulders, loading]);

  if (loading) return <div className="text-center p-8">Loading stats...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-3xl font-bold">Estadístiques</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Participants" value={stats.totalParticipants} icon={<Users size={32} />} />
        <StatCard title="Total Boulders Sent" value={stats.totalCompleted} icon={<Target size={32} />} />
        <StatCard title="Avg Boulders / Climber" value={stats.avgCompleted} icon={<BarChartHorizontal size={32} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Completed by Difficulty</h2>
          <DifficultyPieChart completedBoulders={completedBoulders} boulders={boulders} />
        </div>
        <div className="bg-surface rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Top 10 Most Popular Boulders</h2>
          <PopularityBarChart completedBoulders={completedBoulders} boulders={boulders} />
        </div>
      </div>
    </motion.div>
  );
};

export default Stats;
