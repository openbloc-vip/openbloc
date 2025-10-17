import React from 'react';
import { BoulderColor, Difficulty } from '../../types';
import { X } from 'lucide-react';

interface BoulderFiltersProps {
  difficulties: Difficulty[];
  colors: BoulderColor[];
  filters: { difficulty: string; color: string; number: string };
  onFilterChange: (filters: { difficulty: string; color: string; number: string }) => void;
  onReset: () => void;
}

const BoulderFilters = ({ difficulties, colors, filters, onFilterChange, onReset }: BoulderFiltersProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 bg-surface rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="number"
          placeholder="Filter by number..."
          value={filters.number}
          onChange={handleInputChange}
          className="w-full p-2 rounded bg-bg border border-border"
        />
        <select
          name="difficulty"
          value={filters.difficulty}
          onChange={handleInputChange}
          className="w-full p-2 rounded bg-bg border border-border"
        >
          <option value="">All Difficulties</option>
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          name="color"
          value={filters.color}
          onChange={handleInputChange}
          className="w-full p-2 rounded bg-bg border border-border"
        >
          <option value="">All Colors</option>
          {colors.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={onReset} className="flex items-center justify-center gap-2 p-2 rounded bg-red-500 text-white hover:bg-red-600 transition">
          <X size={16} /> Reset
        </button>
      </div>
    </div>
  );
};

export default BoulderFilters;
