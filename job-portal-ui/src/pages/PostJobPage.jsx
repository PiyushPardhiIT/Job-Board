import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Briefcase, Building2, MapPin, IndianRupee, Plus, X } from 'lucide-react';

export default function PostJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [form, setForm] = useState({
    title: '',
    companyName: '',
    companyWebsite: '',
    companyIndustry: 'IT & Software',
    employmentType: 'FULL_TIME',
    workMode: 'ON_SITE',
    minExperience: 2,
    maxExperience: 5,
    minSalary: 600000,
    maxSalary: 1200000,
    location: '',
    description: '',
    requiredSkills: ['Java', 'Spring Boot', 'React'],
  });

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !form.requiredSkills.includes(newSkill.trim())) {
      setForm({ ...form, requiredSkills: [...form.requiredSkills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm({
      ...form,
      requiredSkills: form.requiredSkills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.requiredSkills.length === 0) {
      toast.error('Please add at least one required skill');
      return;
    }

    setLoading(true);
    try {
      await api.post('/jobs', form);
      toast.success('Job posted successfully!');
      navigate('/recruiter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-naukri-border rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
          <Briefcase className="w-6 h-6 text-naukri-blue" />
          <div>
            <h1 className="text-xl font-bold text-naukri-navy">Post a New Job Vacancy</h1>
            <p className="text-xs text-naukri-textMuted">Reach millions of active jobseekers across India</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700">Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Full Stack Developer"
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Infosys, TCS, Startup"
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </div>
          </div>

          {/* Work Mode & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700">Work Mode</label>
              <select
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue bg-white"
                value={form.workMode}
                onChange={(e) => setForm({ ...form, workMode: e.target.value })}
              >
                <option value="ON_SITE">On-Site (Office)</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote (Work from Home)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Employment Type</label>
              <select
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue bg-white"
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>

          {/* Experience Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700">Min Experience (Years) *</label>
              <input
                type="number"
                min="0"
                required
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.minExperience}
                onChange={(e) => setForm({ ...form, minExperience: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Max Experience (Years) *</label>
              <input
                type="number"
                min="0"
                required
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.maxExperience}
                onChange={(e) => setForm({ ...form, maxExperience: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Salary & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700">Min Salary (₹ PA)</label>
              <input
                type="number"
                placeholder="e.g. 500000"
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.minSalary}
                onChange={(e) => setForm({ ...form, minSalary: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Max Salary (₹ PA)</label>
              <input
                type="number"
                placeholder="e.g. 1000000"
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.maxSalary}
                onChange={(e) => setForm({ ...form, maxSalary: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Location (City) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru, Hyderabad"
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          {/* Key Skills */}
          <div>
            <label className="text-xs font-semibold text-gray-700">Required Skills *</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Type a skill and hit Enter or Add"
                className="flex-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill(e)}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {form.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-naukri-blue border border-blue-200 rounded-full text-xs font-semibold"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>
                    <X className="w-3.5 h-3.5 hover:text-rose-600" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="text-xs font-semibold text-gray-700">Job Description & Responsibilities *</label>
            <textarea
              rows="5"
              required
              placeholder="Detail responsibilities, tech stack, qualifications, and company culture..."
              className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-naukri-blue hover:bg-naukri-blueHover text-white font-semibold rounded-lg shadow text-sm transition-colors"
          >
            {loading ? 'Publishing Vacancy...' : 'Publish Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}