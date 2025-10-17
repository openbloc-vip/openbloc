import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Edit } from 'lucide-react';
import { Boulder } from '../../types';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

interface BoulderCardProps {
  boulder: Boulder;
  isCompleted: boolean;
  onToggleComplete: (boulderId: string) => void;
  onEdit: (boulder: Boulder) => void;
}

const boulderColorStyles: Record<string, string> = {
  green: 'bg-boulder-green',
  blue: 'bg-boulder-blue',
  yellow: 'bg-boulder-yellow',
  red: 'bg-boulder-red',
  purple: 'bg-boulder-purple',
  black: 'bg-boulder-black text-white',
};

const BoulderCard = ({ boulder, isCompleted, onToggleComplete, onEdit }: BoulderCardProps) => {
  const { isAuthenticated, isAdmin } = useAuth();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated && !isAdmin) {
      onToggleComplete(boulder.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(boulder);
  }

  return (
    <motion.div
      layout
      onClick={handleToggle}
      className={cn(
        'relative w-28 h-36 flex-shrink-0 rounded-lg shadow-lg transition-all duration-300',
        boulderColorStyles[boulder.color] || 'bg-gray-400',
        isCompleted ? 'opacity-100' : 'opacity-70 hover:opacity-100',
        isAuthenticated && !isAdmin && 'cursor-pointer'
      )}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
        <span className="font-extrabold text-4xl text-black/60 drop-shadow-sm">
          {boulder.number.toString().padStart(2, '0')}
        </span>
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center pointer-events-none"
            >
              <CheckCircle className="text-white/90" size={40} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {isAdmin && (
            <button onClick={handleEdit} className="absolute top-2 right-2 p-1 bg-white/30 rounded-full hover:bg-white/50 transition">
                <Edit size={16} className="text-black/70"/>
            </button>
        )}
      </div>
    </motion.div>
  );
};

export default BoulderCard;
