package com.naukri.jobportal.service;

import com.naukri.jobportal.dto.request.JobApplicationRequest;
import com.naukri.jobportal.dto.response.JobApplicationResponse;
import com.naukri.jobportal.entity.ApplicationStatus;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobApplicationService {
    // Seeker actions
    JobApplicationResponse applyToJob(Long jobId, JobApplicationRequest request, String applicantEmail);
    Page<JobApplicationResponse> getMyApplications(String applicantEmail, Pageable pageable);
    boolean hasUserApplied(Long jobId, String applicantEmail);

    // Recruiter actions
    Page<JobApplicationResponse> getJobApplicants(Long jobId, String recruiterEmail, Pageable pageable);
    JobApplicationResponse updateStatus(Long applicationId, ApplicationStatus status, String recruiterEmail);
    Resource downloadApplicantResume(Long applicationId, String recruiterEmail);
    String getApplicantResumeName(Long applicationId, String recruiterEmail);
}