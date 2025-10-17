import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Boulder, BoulderColor, Difficulty } from '../../types';
import { useData } from '../../hooks/useData';
import { X } from 'lucide-react';

const difficulties: Difficulty[] = ['Molt Fàcil', 'Fàcil', 'Mitjà', 'Difícil'];
const colors: BoulderColor[] = ['green', 'blue', 'yellow', 'red', 'purple', 'black'];

const getPoints = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case 'Molt Fàcil': return 1;
      case 'Fàcil': return 2;
      case 'Mitjà': return 5;
      case 'Difícil': return 10;
      default: return 0;
    }
  };

interface AdminBoulderModalProps {
  isOpen: boolean;
  onClose: () => void;
  boulderToEdit: Boulder | null;
}

const AdminBoulderModal = ({ isOpen, onClose, boulderToEdit }: AdminBoulderModalProps) => {
  const { addBoulder, updateBoulder } = useData();
  const [formData, setFormData] = useState({
    difficulty: 'Fàcil' as Difficulty,
    color: 'green' as BoulderColor,
  });

  useEffect(() => {
    if (boulderToEdit) {
      setFormData({
        difficulty: boulderToEdit.difficulty,
        color: boulderToEdit.color,
      });
    } else {
      setFormData({ difficulty: 'Fàcil', color: 'green' });
    }
  }, [boulderToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const points = getPoints(formData.difficulty);
    if (boulderToEdit) {
      updateBoulder({ ...boulderToEdit, ...formData, points });
    } else {
      addBoulder({ ...formData, points });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">{boulderToEdit ? 'Edit Boulder' : 'Add New Boulder'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full p-2 rounded bg-bg border border-border">
                  {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <select name="color" value={formData.color} onChange={handleChange} className="w-full p-2 rounded bg-bg border border-border">
                  {colors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full p-2 rounded bg-accent-hover text-white font-semibold hover:bg-opacity-90 transition">
                {boulderToEdit ? 'Update Boulder' : 'Add Boulder'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminBoulderModal;
