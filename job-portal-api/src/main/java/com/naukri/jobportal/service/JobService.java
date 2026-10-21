package com.naukri.jobportal.service;

import com.naukri.jobportal.dto.request.JobCreateRequest;
import com.naukri.jobportal.dto.response.JobResponse;
import com.naukri.jobportal.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobService {
    JobResponse createJob(JobCreateRequest request, String recruiterEmail);
    JobResponse getJobById(Long id);
    Page<JobResponse> getMyPostedJobs(String recruiterEmail, Pageable pageable);
    JobResponse updateJob(Long jobId, JobCreateRequest request, String recruiterEmail);
    JobResponse updateJobStatus(Long jobId, JobStatus status, String recruiterEmail);
    void deleteJob(Long jobId, String recruiterEmail);
}