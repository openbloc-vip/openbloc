import React from 'react';
import { useData } from '../hooks/useData';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const { profiles, boulders, completedBoulders, loading } = useData();

  if (loading) return <div className="text-center p-8">Loading leaderboard...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold mb-6">Classificació</h1>
      <LeaderboardTable profiles={profiles} boulders={boulders} completedBoulders={completedBoulders} />
    </motion.div>
  );
};

export default Leaderboard;
