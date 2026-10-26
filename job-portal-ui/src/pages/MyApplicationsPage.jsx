import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Briefcase, Building2, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        setApplications(res.data.content || []);
      } catch (err) {
        toast.error('Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'UNDER_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SHORTLISTED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'INTERVIEWING':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'HIRED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-naukri-navy">My Job Applications</h1>
        <p className="text-xs text-naukri-textMuted mt-1">Track real-time hiring updates for all jobs you applied to</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white border border-naukri-border rounded-2xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">You haven't applied to any jobs yet</h3>
          <p className="text-xs text-gray-500 mt-1">Explore openings on the home page and apply with 1-click!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-naukri-border rounded-xl p-5 shadow-sm hover:border-blue-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-naukri-navy">{app.jobTitle}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    {app.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  {app.companyName}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {app.jobLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                {app.coverNote && (
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg italic">
                    "{app.coverNote}"
                  </p>
                )}
              </div>

              <div className="text-right text-xs text-gray-400 sm:self-center">
                Resume: <span className="font-semibold text-gray-700">{app.resumeOriginalName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}