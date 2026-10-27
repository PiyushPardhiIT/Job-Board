import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  IndianRupee,
  MapPin,
  Clock,
  Bookmark,
  Star,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function JobCard({ job, onSkillClick }) {
  const { user, isSeeker } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login as a Jobseeker to apply!');
      return;
    }
    if (!isSeeker) {
      toast.error('Only Jobseekers can apply to vacancies.');
      return;
    }

    setApplying(true);
    try {
      await api.post(`/applications/jobs/${job.id}/apply`, {});
      setApplied(true);
      toast.success('Applied successfully! Track it in "My Applications".');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit application.');
    } finally {
      setApplying(false);
    }
  };

  const toggleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from saved jobs' : 'Job saved to your bookmarks!');
  };

  // Helper to format "Posted X days ago"
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Posted recently';
    const postedDate = new Date(dateString);
    const diffDays = Math.floor((new Date() - postedDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Posted today';
    if (diffDays === 1) return 'Posted 1 day ago';
    return `Posted ${diffDays} days ago`;
  };

  return (
    <div className="bg-white border border-gray-200 hover:border-naukri-blue/60 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 group">
      {/* Header Row: Title, Company, Bookmark */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-naukri-navy group-hover:text-naukri-blue transition-colors">
            {job.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs font-bold text-gray-700">{job.companyName}</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              4.1
            </span>
            <span className="text-[11px] text-gray-400">(1.2k+ Reviews)</span>
          </div>
        </div>

        <button
          onClick={toggleBookmark}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked
              ? 'text-naukri-blue bg-blue-50'
              : 'text-gray-400 hover:text-naukri-blue hover:bg-gray-50'
          }`}
          title="Save Job"
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-naukri-blue' : ''}`} />
        </button>
      </div>

      {/* Metadata Row: Experience, Salary, Location */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-600 font-medium">
        <span className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
          {job.minExperience} - {job.maxExperience} Yrs
        </span>
        <span className="flex items-center gap-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
          ₹{(job.minSalary / 100000).toFixed(1)} - ₹{(job.maxSalary / 100000).toFixed(1)} Lacs PA
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          {job.location}
        </span>
        <span className="text-[11px] px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full font-semibold">
          {job.workMode}
        </span>
      </div>

      {/* Job Description Snippet */}
      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Skill Tags Row */}
      <div className="flex flex-wrap gap-1.5">
        {job.requiredSkills.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => onSkillClick && onSkillClick(skill)}
            className="px-2.5 py-0.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-naukri-blue rounded-full text-[11px] font-medium transition-colors"
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Card Footer: Posted date & Apply Button */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
        <span className="flex items-center gap-1 text-gray-400 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {getRelativeTime(job.createdAt)}
        </span>

        {applied ? (
          <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Applied
          </span>
        ) : (
          <button
            onClick={handleApply}
            disabled={applying}
            className="px-5 py-2 bg-naukri-blue hover:bg-naukri-blueHover text-white font-bold rounded-xl shadow-xs hover:shadow transition-all"
          >
            {applying ? 'Applying...' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
}