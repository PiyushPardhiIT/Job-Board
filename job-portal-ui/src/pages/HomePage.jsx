import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState({ loading: true, online: false });

  useEffect(() => {
    api.get('/health')
      .then(() => setApiStatus({ loading: false, online: true }))
      .catch(() => setApiStatus({ loading: false, online: false }));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Backend Connectivity Status Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
          apiStatus.loading 
            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
            : apiStatus.online 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {apiStatus.loading ? (
            <span>Connecting to Spring Boot Backend (http://localhost:8080/api/health)...</span>
          ) : apiStatus.online ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Backend Connected: Spring Boot 3 API is responding live!</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Backend Disconnected: Ensure Spring Boot is running on port 8080.</span>
            </>
          )}
        </div>
      </div>

      {/* Hero Header Mockup */}
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-naukri-navy tracking-tight">
          Find your dream job now
        </h1>
        <p className="mt-4 text-lg text-naukri-textMuted max-w-2xl mx-auto">
          5 lakh+ jobs for you to explore. Ready for your career jump?
        </p>
      </main>
    </div>
  );
}