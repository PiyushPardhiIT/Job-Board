import React from 'react';
import { Home, Building, Laptop, Award, Coins, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { label: 'Remote', icon: Home, query: 'Remote', filterType: 'workMode', filterVal: 'REMOTE' },
  { label: 'MNC', icon: Building, query: 'MNC', filterType: 'keyword', filterVal: 'MNC' },
  { label: 'Software & IT', icon: Laptop, query: 'Software', filterType: 'keyword', filterVal: 'Software' },
  { label: 'Fresher Jobs', icon: Award, query: 'Fresher', filterType: 'experience', filterVal: '0' },
  { label: 'Banking & Finance', icon: Coins, query: 'Finance', filterType: 'keyword', filterVal: 'Finance' },
  { label: 'Data Science', icon: Sparkles, query: 'Data Science', filterType: 'keyword', filterVal: 'Data Science' },
];

export default function PopularChips({ onSelectCategory }) {
  return (
    <div className="max-w-5xl mx-auto px-4 pb-8">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Trending:
        </span>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.label}
              onClick={() => onSelectCategory(cat)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50/70 border border-gray-200 hover:border-naukri-blue text-xs font-semibold text-gray-700 hover:text-naukri-blue rounded-full shadow-xs transition-all"
            >
              <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-naukri-blue" />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}