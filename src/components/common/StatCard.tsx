import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <motion.div
      className="bg-surface p-6 rounded-xl shadow-md flex items-center justify-between"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div>
        <p className="text-sm font-medium text-secondary">{title}</p>
        <p className="text-3xl font-bold text-primary">{value}</p>
      </div>
      <div className="text-accent-hover">
        {icon}
      </div>
    </motion.div>
  );
};

export default StatCard;
