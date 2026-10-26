import React from 'react';
import { Star, ChevronRight } from 'lucide-react';

const FEATURED_COMPANIES = [
  {
    name: 'Tata Consultancy Services',
    industry: 'IT Services & Consulting',
    rating: '4.1',
    reviews: '74.2k+',
    jobsCount: '250+',
    logoBg: 'bg-blue-600',
    initial: 'TCS',
  },
  {
    name: 'Infosys Technologies',
    industry: 'IT Services & Software',
    rating: '4.2',
    reviews: '58.9k+',
    jobsCount: '180+',
    logoBg: 'bg-indigo-600',
    initial: 'INFY',
  },
  {
    name: 'Wipro Enterprises',
    industry: 'Technology & Consulting',
    rating: '3.9',
    reviews: '41.1k+',
    jobsCount: '120+',
    logoBg: 'bg-emerald-600',
    initial: 'WIPRO',
  },
  {
    name: 'Accenture India',
    industry: 'Management & Technology',
    rating: '4.3',
    reviews: '62.4k+',
    jobsCount: '310+',
    logoBg: 'bg-purple-600',
    initial: 'ACN',
  },
];

export default function TopCompanies({ onCompanyClick }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-naukri-navy">
            Top companies hiring now
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Explore active job vacancies from India’s leading employers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURED_COMPANIES.map((company) => (
          <div
            key={company.name}
            onClick={() => onCompanyClick(company.name)}
            className="bg-white border border-gray-200 hover:border-naukri-blue rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-11 h-11 ${company.logoBg} text-white font-black text-xs rounded-xl flex items-center justify-center shadow-xs`}
                >
                  {company.initial}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 group-hover:text-naukri-blue transition-colors line-clamp-1">
                    {company.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {company.rating}
                    </span>
                    <span className="text-[11px] text-gray-400">({company.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{company.industry}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-naukri-blue">
                {company.jobsCount} open jobs
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-naukri-blue transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}