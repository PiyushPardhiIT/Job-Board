import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, MapPin } from 'lucide-react';

export default function HeroSearch({
  keyword: parentKeyword = '',
  setKeyword: parentSetKeyword,
  location: parentLocation = '',
  setLocation: parentSetLocation,
  experience: parentExperience = '',
  setExperience: parentSetExperience,
}) {
  const navigate = useNavigate();

  // Local state with support for parent state synchronization
  const [keyword, setKeyword] = useState(parentKeyword);
  const [location, setLocation] = useState(parentLocation);
  const [experience, setExperience] = useState(parentExperience);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    if (parentSetKeyword) parentSetKeyword(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    if (parentSetLocation) parentSetLocation(e.target.value);
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
    if (parentSetExperience) parentSetExperience(e.target.value);
  };

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    if (experience !== '') params.append('experience', experience);

    // Redirect to the dedicated search results page
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50/60 to-transparent pt-12 pb-8 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-naukri-navy tracking-tight leading-tight">
          Find your dream job now
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500 font-medium">
          5 lakh+ jobs for you to explore across India's top companies
        </p>

        {/* 4-Segment Unified Search Bar */}
        <form
          onSubmit={handleHeroSubmit}
          className="mt-8 bg-white p-2 rounded-full shadow-lg border border-gray-200 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200 transition-shadow hover:shadow-xl"
        >
          {/* Segment 1: Skills / Designations / Companies */}
          <div className="flex-1 flex items-center gap-3 px-5 py-3 w-full">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Enter skills / designations / companies"
              className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              value={keyword}
              onChange={handleKeywordChange}
            />
          </div>

          {/* Segment 2: Experience Dropdown */}
          <div className="flex items-center gap-2 px-5 py-3 w-full md:w-56 shrink-0">
            <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              className="w-full text-xs sm:text-sm text-gray-700 bg-transparent outline-none cursor-pointer"
              value={experience}
              onChange={handleExperienceChange}
            >
              <option value="">Select experience</option>
              <option value="0">Fresher (less than 1 year)</option>
              <option value="1">1 Year</option>
              <option value="2">2 Years</option>
              <option value="3">3 Years</option>
              <option value="5">5 Years</option>
              <option value="8">8+ Years</option>
            </select>
          </div>

          {/* Segment 3: Location */}
          <div className="flex-1 flex items-center gap-3 px-5 py-3 w-full">
            <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Enter location"
              className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              value={location}
              onChange={handleLocationChange}
            />
          </div>

          {/* Segment 4: Search CTA Button */}
          <div className="p-1 w-full md:w-auto">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-naukri-blue hover:bg-naukri-blueHover text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}