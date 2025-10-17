import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import BoulderList from '../components/boulders/BoulderList';
import { Boulder, BoulderColor, Difficulty } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Plus } from 'lucide-react';
import BoulderFilters from '../components/boulders/BoulderFilters';
import AdminBoulderModal from '../components/boulders/AdminBoulderModal';
import { useAuth } from '../hooks/useAuth';

const Boulders = () => {
  const { boulders, loading } = useData();
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState({ difficulty: '', color: '', number: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [boulderToEdit, setBoulderToEdit] = useState<Boulder | null>(null);

  const filteredBoulders = useMemo(() => {
    return boulders.filter(b => {
      return (
        (filters.difficulty ? b.difficulty === filters.difficulty : true) &&
        (filters.color ? b.color === filters.color : true) &&
        (filters.number ? b.number.toString().includes(filters.number) : true)
      );
    });
  }, [boulders, filters]);

  const groupedBoulders = useMemo(() => {
    return filteredBoulders.reduce((acc, boulder) => {
      const difficulty = boulder.difficulty;
      if (!acc[difficulty]) {
        acc[difficulty] = [];
      }
      acc[difficulty].push(boulder);
      return acc;
    }, {} as Record<Difficulty, Boulder[]>);
  }, [filteredBoulders]);

  const handleEdit = (boulder: Boulder) => {
    setBoulderToEdit(boulder);
    setModalOpen(true);
  }

  const handleAdd = () => {
    setBoulderToEdit(null);
    setModalOpen(true);
  }

  if (loading) return <div className="text-center p-8">Loading boulders...</div>;

  const difficultiesOrder: Difficulty[] = ['Molt Fàcil', 'Fàcil', 'Mitjà', 'Difícil'];
  const uniqueDifficulties = [...new Set(boulders.map(b => b.difficulty))] as Difficulty[];
  const uniqueColors = [...new Set(boulders.map(b => b.color))] as BoulderColor[];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Boulders</h1>
        <div className="flex items-center gap-2">
            {isAdmin && (
                <button onClick={handleAdd} className="flex items-center gap-2 p-2 rounded-lg bg-accent-hover text-white hover:bg-opacity-90 transition">
                    <Plus size={20} />
                    <span className="hidden sm:inline">Add</span>
                </button>
            )}
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 p-2 rounded-lg bg-surface hover:bg-border transition">
                <Filter size={20} />
                <span className="hidden sm:inline">Filters</span>
            </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <BoulderFilters
              difficulties={uniqueDifficulties}
              colors={uniqueColors}
              filters={filters}
              onFilterChange={setFilters}
              onReset={() => setFilters({ difficulty: '', color: '', number: '' })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {Object.keys(groupedBoulders).length > 0 ? (
        difficultiesOrder.map(difficulty =>
          groupedBoulders[difficulty] ? (
            <BoulderList
              key={difficulty}
              difficulty={difficulty}
              boulders={groupedBoulders[difficulty]}
              onEdit={handleEdit}
            />
          ) : null
        )
      ) : (
        <p className="text-center text-secondary mt-8">No boulders match the current filters.</p>
      )}

      <AdminBoulderModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} boulderToEdit={boulderToEdit} />
    </motion.div>
  );
};

export default Boulders;
