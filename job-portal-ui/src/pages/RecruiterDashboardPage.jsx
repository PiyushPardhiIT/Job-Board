import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Briefcase, Plus, MapPin, IndianRupee, Trash2 } from 'lucide-react';

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/recruiter/my-jobs');
      setJobs(res.data.content || []);
    } catch (err) {
      toast.error('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await api.patch(`/jobs/${jobId}/status?status=${newStatus}`);
      toast.success(`Job marked as ${newStatus}`);
      fetchJobs();
    } catch (err) {
      toast.error('Could not update status');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-naukri-navy">Employer Dashboard</h1>
          <p className="text-sm text-naukri-textMuted mt-1">Manage your active job postings and applicants</p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="flex items-center gap-2 px-5 py-2.5 bg-naukri-blue hover:bg-naukri-blueHover text-white font-semibold rounded-lg shadow-sm text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">Loading your job postings...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-naukri-border rounded-2xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No jobs posted yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            You haven't posted any jobs. Start hiring top talent today!
          </p>
          <Link
            to="/recruiter/post-job"
            className="inline-block mt-4 px-6 py-2.5 bg-naukri-blue text-white rounded-lg text-sm font-semibold hover:bg-naukri-blueHover"
          >
            Create Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-naukri-border rounded-xl p-6 shadow-sm hover:border-blue-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-naukri-navy">{job.title}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      job.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-sm font-semibold text-gray-600">{job.companyName}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> {job.minExperience} - {job.maxExperience} Yrs
                  </span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" /> ₹{(job.minSalary / 100000).toFixed(1)} - ₹{(job.maxSalary / 100000).toFixed(1)} LPA
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location} ({job.workMode})
                  </span>
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <button
                  onClick={() => toggleStatus(job.id, job.status)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold border ${
                    job.status === 'ACTIVE'
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {job.status === 'ACTIVE' ? 'Close Job' : 'Reopen Job'}
                </button>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}