import React from 'react';
import { Boulder } from '../../types';
import BoulderCard from './BoulderCard';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';

interface BoulderListProps {
  difficulty: string;
  boulders: Boulder[];
  onEdit: (boulder: Boulder) => void;
}

const BoulderList = ({ difficulty, boulders, onEdit }: BoulderListProps) => {
  const { user } = useAuth();
  const { toggleBoulderComplete, completedBoulders } = useData();
  
  const userCompletedSet = React.useMemo(() => 
    new Set(completedBoulders.filter(cb => cb.user_id === user?.supabaseUser.id).map(cb => cb.boulder_id)),
    [completedBoulders, user]
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">{difficulty}</h2>
      <div className="flex flex-wrap gap-4">
        {boulders.map((boulder) => (
          <BoulderCard
            key={boulder.id}
            boulder={boulder}
            isCompleted={userCompletedSet.has(boulder.id)}
            onToggleComplete={toggleBoulderComplete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default BoulderList;
