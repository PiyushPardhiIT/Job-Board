import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { UploadCloud, FileText, Trash2, Download, Plus, X, Award, CheckCircle } from 'lucide-react';

export default function SeekerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [formData, setFormData] = useState({
    headline: '',
    experienceYears: 0,
    currentLocation: '',
    currentSalary: '',
    expectedSalary: '',
    bio: '',
    skills: [],
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get('/seeker/profile');
      setProfile(res.data);
      setFormData({
        headline: res.data.headline || '',
        experienceYears: res.data.experienceYears || 0,
        currentLocation: res.data.currentLocation || '',
        currentSalary: res.data.currentSalary || '',
        expectedSalary: res.data.expectedSalary || '',
        bio: res.data.bio || '',
        skills: res.data.skills || [],
      });
    } catch (err) {
      toast.error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/seeker/profile', formData);
      setProfile(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const data = new FormData();
    data.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/seeker/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await api.get('/seeker/resume/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', profile.resumeOriginalName || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Could not download resume.');
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;
    try {
      await api.delete('/seeker/resume');
      fetchProfile();
      toast.success('Resume deleted.');
    } catch (err) {
      toast.error('Failed to delete resume.');
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500 font-medium">Loading profile...</div>;
  }

  const completeness = profile?.profileCompletenessPercent || 20;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Naukri Completeness Banner */}
      <div className="bg-white border border-naukri-border rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-naukri-blue" />
              <h2 className="text-lg font-bold text-naukri-navy">Profile Completeness Score</h2>
            </div>
            <p className="text-xs text-naukri-textMuted mt-1">
              Recruiters prioritize profiles with 80%+ completeness score.
            </p>
          </div>
          <div className="text-2xl font-black text-naukri-blue">{completeness}%</div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-gray-200 h-2.5 rounded-full mt-4 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-naukri-blue' : 'bg-amber-500'
            }`}
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Resume Upload Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-naukri-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-naukri-navy mb-4">Resume / CV</h3>

            {profile?.hasResume ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-naukri-blue shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {profile.resumeOriginalName}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {(profile.resumeSizeBytes / (1024 * 1024)).toFixed(2)} MB • PDF
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white text-naukri-blue border border-naukri-blue rounded-lg text-xs font-semibold hover:bg-blue-50"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                  <button
                    onClick={handleDeleteResume}
                    className="p-1.5 bg-white text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 hover:border-naukri-blue rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-naukri-blue mb-2 transition-colors" />
                <span className="text-xs font-bold text-gray-700">
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </span>
                <span className="text-[10px] text-gray-400 mt-1">Supported Formats: PDF (Max 5MB)</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleResumeUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Right Column: Career Details Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdate} className="bg-white border border-naukri-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-naukri-navy mb-2">Professional Details</h3>

            <div>
              <label className="text-xs font-semibold text-gray-700">Resume Headline</label>
              <input
                type="text"
                placeholder="e.g. Full Stack Developer | Java | Spring Boot | React"
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700">Total Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Current Location (City)</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Mumbai, Delhi"
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                  value={formData.currentLocation}
                  onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700">Current CTC (in ₹ INR/Year)</label>
                <input
                  type="number"
                  placeholder="e.g. 600000"
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                  value={formData.currentSalary}
                  onChange={(e) => setFormData({ ...formData, currentSalary: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Expected CTC (in ₹ INR/Year)</label>
                <input
                  type="number"
                  placeholder="e.g. 1000000"
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                  value={formData.expectedSalary}
                  onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                />
              </div>
            </div>

            {/* Key Skills Tag Input */}
            <div>
              <label className="text-xs font-semibold text-gray-700">Key Skills (Add 3+ for higher score)</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="e.g. Java, Spring Boot, React, MySQL"
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

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.skills.map((skill) => (
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

            <div>
              <label className="text-xs font-semibold text-gray-700">Professional Summary / Bio</label>
              <textarea
                rows="3"
                placeholder="Summarize your career, accomplishments, and tech stack..."
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-naukri-blue hover:bg-naukri-blueHover text-white font-semibold rounded-lg shadow text-sm transition-colors"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}