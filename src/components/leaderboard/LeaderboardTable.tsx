import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Profile, Boulder, Gender, Category, CompletedBoulder } from '../../types';
import { cn } from '../../lib/utils';

interface LeaderboardTableProps {
  profiles: Profile[];
  boulders: Boulder[];
  completedBoulders: CompletedBoulder[];
}

type SortKey = 'rank' | 'name' | 'score' | 'completed';

const LeaderboardTable = ({ profiles, boulders, completedBoulders }: LeaderboardTableProps) => {
  const [filters, setFilters] = useState({ gender: '', category: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'rank', direction: 'asc' });

  const boulderMap = useMemo(() => new Map(boulders.map(b => [b.id, b])), [boulders]);

  const leaderboardData = useMemo(() => {
    const completedByuser = completedBoulders.reduce((acc, cb) => {
        if (!acc[cb.user_id]) acc[cb.user_id] = [];
        acc[cb.user_id].push(cb.boulder_id);
        return acc;
    }, {} as Record<string, string[]>);

    return profiles
      .filter(p => p.role === 'PARTICIPANT')
      .map(profile => {
        const userCompleted = completedByuser[profile.id] || [];
        const score = userCompleted.reduce((acc, boulderId) => {
          return acc + (boulderMap.get(boulderId)?.points || 0);
        }, 0);
        return { ...profile, score, completedCount: userCompleted.length };
      })
      .sort((a, b) => b.score - a.score)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  }, [profiles, boulderMap, completedBoulders]);

  const filteredAndSortedData = useMemo(() => {
    let data = [...leaderboardData].filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.gender) {
      data = data.filter(u => u.gender === filters.gender);
    }
    if (filters.category) {
      data = data.filter(u => u.category === filters.category);
    }

    data.sort((a, b) => {
      let aVal, bVal;
      if (sortConfig.key === 'completed') {
        aVal = a.completedCount;
        bVal = b.completedCount;
      } else if (sortConfig.key === 'name') {
        aVal = a.name;
        bVal = b.name;
      } else {
        aVal = a[sortConfig.key];
        bVal = b[sortConfig.key];
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [leaderboardData, filters, sortConfig, searchTerm]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const SortableHeader = ({ sortKey, label }: { sortKey: SortKey; label: string }) => (
    <th onClick={() => requestSort(sortKey)} className="p-3 text-left cursor-pointer">
      <div className="flex items-center gap-1">
        {label}
        {sortConfig.key === sortKey && (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
      </div>
    </th>
  );

  return (
    <div className="bg-surface rounded-lg shadow-md p-4 overflow-x-auto">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 rounded bg-bg border border-border"
            />
        </div>
        <select onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))} className="p-2 rounded bg-bg border border-border">
          <option value="">All Genders</option>
          {(['Masculí', 'Femení'] as Gender[]).map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className="p-2 rounded bg-bg border border-border">
          <option value="">All Categories</option>
          {(['Universitaris', 'Absoluta', 'Sub-18'] as Category[]).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      
      {/* Table */}
      <table className="w-full min-w-[600px]">
        <thead className="border-b border-border">
          <tr>
            <SortableHeader sortKey="rank" label="Rank" />
            <SortableHeader sortKey="name" label="Name" />
            <th className="p-3 text-left">Category</th>
            <SortableHeader sortKey="completed" label="Completed" />
            <SortableHeader sortKey="score" label="Score" />
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map((user, index) => (
            <motion.tr 
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn("border-b border-border", {
                'bg-yellow-400/20': user.rank === 1,
                'bg-gray-400/20': user.rank === 2,
                'bg-yellow-700/20': user.rank === 3,
              })}
            >
              <td className="p-3 font-bold">{user.rank}</td>
              <td className="p-3">{user.name}</td>
              <td className="p-3 text-secondary">{user.category}</td>
              <td className="p-3">{user.completedCount}</td>
              <td className="p-3 font-semibold text-accent-hover">{user.score}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
