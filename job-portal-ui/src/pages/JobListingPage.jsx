import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import FilterSidebar from '../components/jobs/FilterSidebar';
import JobCard from '../components/jobs/JobCard';
import { Search, MapPin, X, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';

export default function JobListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL parameters
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [workModes, setWorkModes] = useState(
    searchParams.getAll('workModes').length > 0 ? searchParams.getAll('workModes') : []
  );
  const [employmentTypes, setEmploymentTypes] = useState(
    searchParams.getAll('employmentTypes').length > 0 ? searchParams.getAll('employmentTypes') : []
  );

  // Sorting & Pagination
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortDir, setSortDir] = useState(searchParams.get('sortDir') || 'desc');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0);

  // Data State
  const [jobs, setJobs] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync state to URL and Fetch Data
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (location.trim()) params.append('location', location.trim());
      if (experience !== '') params.append('experience', experience);
      if (minSalary) params.append('minSalary', minSalary);
      workModes.forEach((mode) => params.append('workModes', mode));
      employmentTypes.forEach((type) => params.append('employmentTypes', type));

      params.append('page', currentPage);
      params.append('size', 10);
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);

      setSearchParams(params, { replace: true });

      const res = await api.get(`/jobs/public/search?${params.toString()}`);
      setJobs(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [experience, minSalary, workModes, employmentTypes, sortBy, sortDir, currentPage]);

  const handleHeaderSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchJobs();
  };

  const handleWorkModeToggle = (mode) => {
    setCurrentPage(0);
    setWorkModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const handleEmploymentTypeToggle = (type) => {
    setCurrentPage(0);
    setEmploymentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const resetAllFilters = () => {
    setKeyword('');
    setLocation('');
    setExperience('');
    setMinSalary('');
    setWorkModes([]);
    setEmploymentTypes([]);
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-16">
      {/* Top Search Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-16 z-40 shadow-xs">
        <form
          onSubmit={handleHeaderSearch}
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3"
        >
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl w-full">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by skills, title, or company..."
              className="w-full text-xs sm:text-sm bg-transparent outline-none text-gray-800"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl w-full">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Location (e.g. Bengaluru, Remote)..."
              className="w-full text-xs sm:text-sm bg-transparent outline-none text-gray-800"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 bg-naukri-blue hover:bg-naukri-blueHover text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shrink-0 shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Active Filters Pill Bar */}
        {(keyword || location || experience || minSalary || workModes.length > 0 || employmentTypes.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap mb-6 bg-white p-3 rounded-xl border border-gray-200 text-xs">
            <span className="font-bold text-gray-500">Active Filters:</span>
            {keyword && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-naukri-blue rounded-full font-semibold">
                "{keyword}" <X className="w-3 h-3 cursor-pointer" onClick={() => { setKeyword(''); }} />
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-naukri-blue rounded-full font-semibold">
                {location} <X className="w-3 h-3 cursor-pointer" onClick={() => { setLocation(''); }} />
              </span>
            )}
            {experience && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-naukri-blue rounded-full font-semibold">
                {experience} Yrs <X className="w-3 h-3 cursor-pointer" onClick={() => setExperience('')} />
              </span>
            )}
            {workModes.map((m) => (
              <span key={m} className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-naukri-blue rounded-full font-semibold">
                {m} <X className="w-3 h-3 cursor-pointer" onClick={() => handleWorkModeToggle(m)} />
              </span>
            ))}
            <button
              onClick={resetAllFilters}
              className="text-xs text-rose-600 font-bold hover:underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filter Column */}
          <div className="lg:col-span-1">
            <FilterSidebar
              workModes={workModes}
              onWorkModeChange={handleWorkModeToggle}
              experience={experience}
              onExperienceChange={(val) => { setCurrentPage(0); setExperience(val); }}
              minSalary={minSalary}
              onSalaryChange={(val) => { setCurrentPage(0); setMinSalary(val); }}
              location={location}
              onLocationChange={(val) => { setCurrentPage(0); setLocation(val); }}
              employmentTypes={employmentTypes}
              onEmploymentTypeChange={handleEmploymentTypeToggle}
              onResetFilters={resetAllFilters}
            />
          </div>

          {/* Right Search Results Column */}
          <div className="lg:col-span-3 space-y-4">
            {/* Header: Result Counts & Sort By */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-gray-600">
                Showing <strong className="text-naukri-navy font-bold">{totalElements}</strong> jobs
                {keyword && <span> for <strong>"{keyword}"</strong></span>}
                {location && <span> in <strong>"{location}"</strong></span>}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Sort by:</span>
                <select
                  value={`${sortBy}_${sortDir}`}
                  onChange={(e) => {
                    const [sBy, sDir] = e.target.value.split('_');
                    setSortBy(sBy);
                    setSortDir(sDir);
                  }}
                  className="bg-transparent font-bold text-naukri-navy outline-none cursor-pointer"
                >
                  <option value="createdAt_desc">Date Posted (Newest)</option>
                  <option value="maxSalary_desc">Salary (High to Low)</option>
                  <option value="minExperience_asc">Experience (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Job Listings List */}
            {loading ? (
              <div className="text-center py-24 text-gray-400 font-medium">Fetching verified job postings...</div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-xs">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">No jobs match your search criteria</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try adjusting or resetting your filter criteria to discover more openings.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-4 px-5 py-2 bg-naukri-blue text-white font-bold text-xs rounded-xl shadow-xs hover:bg-naukri-blueHover transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSkillClick={(skill) => {
                    setKeyword(skill);
                    setCurrentPage(0);
                  }}
                />
              ))
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      currentPage === idx
                        ? 'bg-naukri-blue text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}