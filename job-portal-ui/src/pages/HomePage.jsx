import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import HeroSearch from '../components/home/HeroSearch';
import PopularChips from '../components/home/PopularChips';
import TopCompanies from '../components/home/TopCompanies';
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Filter,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Bookmark,
} from 'lucide-react';

export default function HomePage() {
  const { user, isSeeker, isRecruiter } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [applyingId, setApplyingId] = useState(null);

  // Search parameters
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [workModes, setWorkModes] = useState([]);
  const [minSalary, setMinSalary] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (location.trim()) params.append('location', location.trim());
      if (experience !== '') params.append('experience', experience);
      if (minSalary) params.append('minSalary', minSalary);
      workModes.forEach((mode) => params.append('workModes', mode));

      const res = await api.get(`/jobs/public/search?${params.toString()}`);
      setJobs(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Failed to search jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [workModes, minSalary, experience]);

  const handleApply = async (jobId) => {
    if (!user) {
      toast.error('Please login as a Jobseeker to apply!');
      return;
    }
    if (!isSeeker) {
      toast.error('Only Jobseekers can apply to jobs.');
      return;
    }

    setApplyingId(jobId);
    try {
      await api.post(`/applications/jobs/${jobId}/apply`, {});
      toast.success('Applied successfully! Track it in "My Applications".');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit application.');
    } finally {
      setApplyingId(null);
    }
  };

  const handleCategorySelect = (category) => {
    if (category.filterType === 'workMode') {
      setWorkModes([category.filterVal]);
    } else if (category.filterType === 'experience') {
      setExperience(category.filterVal);
    } else {
      setKeyword(category.query);
      setTimeout(fetchJobs, 50);
    }
  };

  const handleCompanyClick = (companyName) => {
    setKeyword(companyName);
    setTimeout(fetchJobs, 50);
  };

  const clearFilters = () => {
    setKeyword('');
    setLocation('');
    setExperience('');
    setWorkModes([]);
    setMinSalary('');
    setTimeout(fetchJobs, 50);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* 1. Hero 4-Segment Search Section */}
      <HeroSearch
        keyword={keyword}
        setKeyword={setKeyword}
        location={location}
        setLocation={setLocation}
        experience={experience}
        setExperience={setExperience}
        onSearch={fetchJobs}
      />

      {/* 2. Trending Category Pills */}
      <PopularChips onSelectCategory={handleCategorySelect} />

      {/* 3. Fast-Track Action Callouts (Naukri style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                For Jobseekers
              </span>
              <h3 className="text-lg font-bold mt-2">Get 3x more recruiter views</h3>
              <p className="text-xs text-blue-100 mt-1 max-w-sm">
                Upload your resume and complete your profile score to stand out to employers.
              </p>
            </div>
            <Link
              to="/profile"
              className="px-4 py-2 bg-white text-naukri-blue rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shrink-0 shadow-xs flex items-center gap-1"
            >
              Update Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-gradient-to-r from-slate-800 to-navy-900 rounded-2xl p-6 text-white shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                For Employers
              </span>
              <h3 className="text-lg font-bold mt-2">Hire top talent fast</h3>
              <p className="text-xs text-gray-300 mt-1 max-w-sm">
                Post vacancies and review incoming verified resumes on our built-in ATS.
              </p>
            </div>
            <Link
              to={isRecruiter ? '/recruiter/post-job' : '/register'}
              className="px-4 py-2 bg-naukri-blue text-white rounded-xl text-xs font-bold hover:bg-naukri-blueHover transition-colors shrink-0 shadow-xs flex items-center gap-1"
            >
              Post a Job <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Top Companies Hiring Showcase */}
      <TopCompanies onCompanyClick={handleCompanyClick} />

      {/* 5. Main Content: Side Filters + Live Job Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-naukri-navy">
            Recommended Jobs for you
          </h2>
          <span className="text-xs font-semibold text-gray-500">
            Showing <strong className="text-gray-900">{totalElements}</strong> jobs
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Filter Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-6 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-naukri-navy text-sm">
                  <Filter className="w-4 h-4 text-naukri-blue" /> All Filters
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-naukri-blue hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Work Mode */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-2.5">Work Mode</label>
                <div className="space-y-2">
                  {[
                    { label: 'Work from Office (On-site)', value: 'ON_SITE' },
                    { label: 'Hybrid', value: 'HYBRID' },
                    { label: 'Remote', value: 'REMOTE' },
                  ].map((mode) => (
                    <label key={mode.value} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workModes.includes(mode.value)}
                        onChange={() => {
                          setWorkModes((prev) =>
                            prev.includes(mode.value)
                              ? prev.filter((m) => m !== mode.value)
                              : [...prev, mode.value]
                          );
                        }}
                        className="rounded text-naukri-blue focus:ring-0"
                      />
                      {mode.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-2">Experience</label>
                <select
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-naukri-blue cursor-pointer"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option value="">Any Experience</option>
                  <option value="0">Fresher (0 Years)</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="5">5 Years</option>
                  <option value="8">8+ Years</option>
                </select>
              </div>

              {/* Minimum Salary */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-2">Minimum Annual Salary</label>
                <select
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-naukri-blue cursor-pointer"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                >
                  <option value="">Any Salary</option>
                  <option value="300000">₹3 Lakhs+</option>
                  <option value="600000">₹6 Lakhs+</option>
                  <option value="1000000">₹10 Lakhs+</option>
                  <option value="1500000">₹15 Lakhs+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Job Cards Column */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="text-center py-24 text-gray-400 font-medium">Loading verified openings...</div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-xs">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">No jobs match your selected criteria</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try clearing some filters or searching for broader keywords like "Java" or "Remote".
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-5 py-2 bg-blue-50 text-naukri-blue font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 hover:border-naukri-blue/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-3.5 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-naukri-navy group-hover:text-naukri-blue transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-gray-700">{job.companyName}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                          Verified
                        </span>
                      </div>
                    </div>

                    <button className="text-gray-400 hover:text-naukri-blue p-1 rounded-full hover:bg-gray-50 transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      {job.minExperience} - {job.maxExperience} Yrs
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                      ₹{(job.minSalary / 100000).toFixed(1)} - ₹{(job.maxSalary / 100000).toFixed(1)} Lacs PA
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {job.location} ({job.workMode})
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills & Apply Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={applyingId === job.id}
                      className="px-5 py-2 bg-naukri-blue hover:bg-naukri-blueHover text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all shrink-0"
                    >
                      {applyingId === job.id ? 'Submitting...' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}