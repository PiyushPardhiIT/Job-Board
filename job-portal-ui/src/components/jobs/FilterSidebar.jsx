import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  workModes,
  onWorkModeChange,
  experience,
  onExperienceChange,
  minSalary,
  onSalaryChange,
  location,
  onLocationChange,
  employmentTypes,
  onEmploymentTypeChange,
  onResetFilters,
}) {
  // Accordion toggle states
  const [openSections, setOpenSections] = useState({
    workMode: true,
    experience: true,
    salary: true,
    location: true,
    employmentType: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const CITIES = ['Bengaluru', 'Delhi / NCR', 'Hyderabad', 'Pune', 'Mumbai', 'Chennai', 'Noida'];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-naukri-navy text-sm">
          <Filter className="w-4 h-4 text-naukri-blue" /> All Filters
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-naukri-blue hover:underline flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3 h-3" /> Clear All
        </button>
      </div>

      {/* 1. Work Mode Accordion */}
      <div className="border-b border-gray-100 pb-4">
        <button
          type="button"
          onClick={() => toggleSection('workMode')}
          className="w-full flex items-center justify-between text-xs font-bold text-gray-800 mb-2.5"
        >
          <span>Work Mode</span>
          {openSections.workMode ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>

        {openSections.workMode && (
          <div className="space-y-2">
            {[
              { label: 'Work from Office (On-site)', value: 'ON_SITE' },
              { label: 'Hybrid', value: 'HYBRID' },
              { label: 'Remote', value: 'REMOTE' },
            ].map((mode) => (
              <label key={mode.value} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={workModes.includes(mode.value)}
                  onChange={() => onWorkModeChange(mode.value)}
                  className="rounded text-naukri-blue focus:ring-0"
                />
                {mode.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 2. Experience Accordion */}
      <div className="border-b border-gray-100 pb-4">
        <button
          type="button"
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between text-xs font-bold text-gray-800 mb-2.5"
        >
          <span>Experience</span>
          {openSections.experience ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>

        {openSections.experience && (
          <div className="space-y-2">
            {[
              { label: 'Any Experience', value: '' },
              { label: 'Fresher (0 Years)', value: '0' },
              { label: '2 Years', value: '2' },
              { label: '3 Years', value: '3' },
              { label: '5 Years', value: '5' },
              { label: '8+ Years', value: '8' },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="radio"
                  name="experienceFilter"
                  checked={experience === opt.value}
                  onChange={() => onExperienceChange(opt.value)}
                  className="text-naukri-blue focus:ring-0"
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 3. Salary Brackets Accordion */}
      <div className="border-b border-gray-100 pb-4">
        <button
          type="button"
          onClick={() => toggleSection('salary')}
          className="w-full flex items-center justify-between text-xs font-bold text-gray-800 mb-2.5"
        >
          <span>Minimum Salary</span>
          {openSections.salary ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>

        {openSections.salary && (
          <div className="space-y-2">
            {[
              { label: 'Any Salary', value: '' },
              { label: '₹3 Lakhs+', value: '300000' },
              { label: '₹6 Lakhs+', value: '600000' },
              { label: '₹10 Lakhs+', value: '1000000' },
              { label: '₹15 Lakhs+', value: '1500000' },
            ].map((sal) => (
              <label key={sal.label} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="radio"
                  name="salaryFilter"
                  checked={minSalary === sal.value}
                  onChange={() => onSalaryChange(sal.value)}
                  className="text-naukri-blue focus:ring-0"
                />
                {sal.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 4. Location Checkboxes */}
      <div className="border-b border-gray-100 pb-4">
        <button
          type="button"
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between text-xs font-bold text-gray-800 mb-2.5"
        >
          <span>Popular Cities</span>
          {openSections.location ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>

        {openSections.location && (
          <div className="space-y-2">
            {CITIES.map((city) => (
              <label key={city} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={location.toLowerCase().includes(city.toLowerCase())}
                  onChange={() => onLocationChange(location === city ? '' : city)}
                  className="rounded text-naukri-blue focus:ring-0"
                />
                {city}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 5. Employment Type */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('employmentType')}
          className="w-full flex items-center justify-between text-xs font-bold text-gray-800 mb-2.5"
        >
          <span>Employment Type</span>
          {openSections.employmentType ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>

        {openSections.employmentType && (
          <div className="space-y-2">
            {[
              { label: 'Full Time', value: 'FULL_TIME' },
              { label: 'Part Time', value: 'PART_TIME' },
              { label: 'Contract', value: 'CONTRACT' },
              { label: 'Internship', value: 'INTERNSHIP' },
            ].map((type) => (
              <label key={type.value} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={employmentTypes.includes(type.value)}
                  onChange={() => onEmploymentTypeChange(type.value)}
                  className="rounded text-naukri-blue focus:ring-0"
                />
                {type.label}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}