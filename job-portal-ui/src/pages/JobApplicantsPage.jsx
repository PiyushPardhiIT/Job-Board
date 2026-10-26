import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Download, User, Mail, Phone, Clock } from 'lucide-react';

export default function JobApplicantsPage() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/applications/jobs/${jobId}/applicants`);
      setApplicants(res.data.content || []);
    } catch (err) {
      toast.error('Failed to load applicants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status?status=${newStatus}`);
      toast.success(`Candidate marked as ${newStatus}`);
      fetchApplicants();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDownloadResume = async (applicationId, filename) => {
    try {
      const res = await api.get(`/applications/${applicationId}/resume/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Could not download resume.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        to="/recruiter/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-naukri-blue font-semibold hover:underline mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-naukri-navy">Applicant Review Pipeline (ATS)</h1>
          <p className="text-xs text-naukri-textMuted mt-1">Review candidates and update recruitment stages</p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 bg-blue-50 text-naukri-blue rounded-full border border-blue-200">
          Total Candidates: {applicants.length}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading candidate applications...</div>
      ) : applicants.length === 0 ? (
        <div className="bg-white border border-naukri-border rounded-2xl p-12 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No applicants yet</h3>
          <p className="text-xs text-gray-500 mt-1">Candidates who apply will appear here immediately.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-naukri-border rounded-xl p-6 shadow-sm hover:border-blue-200 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Candidate Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-naukri-navy">{app.applicantName}</h3>
                  <span className="text-xs text-gray-400">• Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                </div>

                <p className="text-xs font-semibold text-naukri-blue">{app.candidateHeadline}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {app.applicantEmail}
                  </span>
                  {app.applicantPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {app.applicantPhone}
                    </span>
                  )}
                </div>

                {app.coverNote && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 max-w-xl">
                    <span className="font-semibold text-gray-700">Cover Note:</span> "{app.coverNote}"
                  </p>
                )}
              </div>

              {/* Status Selector & Resume Download */}
              <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 shrink-0">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className="p-2 border border-gray-200 rounded-lg text-xs font-bold bg-white focus:outline-none focus:border-naukri-blue"
                >
                  <option value="APPLIED">APPLIED</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="INTERVIEWING">INTERVIEWING</option>
                  <option value="HIRED">HIRED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>

                <button
                  onClick={() => handleDownloadResume(app.id, app.resumeOriginalName)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-naukri-blue text-white rounded-lg text-xs font-semibold hover:bg-naukri-blueHover shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Resume ({app.resumeOriginalName})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}