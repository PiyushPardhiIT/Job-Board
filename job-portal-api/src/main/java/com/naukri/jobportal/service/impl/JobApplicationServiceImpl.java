package com.naukri.jobportal.service.impl;

import com.naukri.jobportal.dto.request.JobApplicationRequest;
import com.naukri.jobportal.dto.response.JobApplicationResponse;
import com.naukri.jobportal.entity.*;
import com.naukri.jobportal.repository.JobApplicationRepository;
import com.naukri.jobportal.repository.JobRepository;
import com.naukri.jobportal.repository.SeekerProfileRepository;
import com.naukri.jobportal.repository.UserRepository;
import com.naukri.jobportal.service.FileStorageService;
import com.naukri.jobportal.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final SeekerProfileRepository profileRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public JobApplicationResponse applyToJob(Long jobId, JobApplicationRequest request, String applicantEmail) {
        // 1. Validate Job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with id: " + jobId));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new RuntimeException("This job posting is no longer active.");
        }

        // 2. Prevent Duplicate Application
        if (applicationRepository.existsByJobIdAndApplicantEmail(jobId, applicantEmail)) {
            throw new RuntimeException("You have already applied for this job!");
        }

        // 3. Candidate & Profile Validation
        User applicant = userRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + applicantEmail));

        SeekerProfile profile = profileRepository.findByUserEmail(applicantEmail)
                .orElseThrow(() -> new RuntimeException("Please complete your profile before applying."));

        if (!StringUtils.hasText(profile.getResumeFileName())) {
            throw new RuntimeException("Please upload your resume to your profile before applying!");
        }

        // 4. Create Snapshot Application Record
        JobApplication application = JobApplication.builder()
                .job(job)
                .applicant(applicant)
                .status(ApplicationStatus.APPLIED)
                .coverNote(request != null ? request.getCoverNote() : null)
                .resumeFileName(profile.getResumeFileName())
                .resumeOriginalName(profile.getResumeOriginalName())
                .build();

        return mapToResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getMyApplications(String applicantEmail, Pageable pageable) {
        return applicationRepository.findByApplicantEmailOrderByCreatedAtDesc(applicantEmail, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasUserApplied(Long jobId, String applicantEmail) {
        return applicationRepository.existsByJobIdAndApplicantEmail(jobId, applicantEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getJobApplicants(Long jobId, String recruiterEmail, Pageable pageable) {
        validateRecruiterJobOwnership(jobId, recruiterEmail);
        return applicationRepository.findByJobIdOrderByCreatedAtDesc(jobId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public JobApplicationResponse updateStatus(Long applicationId, ApplicationStatus status, String recruiterEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        validateRecruiterJobOwnership(application.getJob().getId(), recruiterEmail);

        application.setStatus(status);
        return mapToResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadApplicantResume(Long applicationId, String recruiterEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        validateRecruiterJobOwnership(application.getJob().getId(), recruiterEmail);

        return fileStorageService.loadFileAsResource(application.getResumeFileName());
    }

    @Override
    @Transactional(readOnly = true)
    public String getApplicantResumeName(Long applicationId, String recruiterEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        validateRecruiterJobOwnership(application.getJob().getId(), recruiterEmail);
        return application.getResumeOriginalName();
    }

    private void validateRecruiterJobOwnership(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        if (!job.getPostedBy().getEmail().equalsIgnoreCase(recruiterEmail)) {
            throw new RuntimeException("Access Denied: You do not own this job listing.");
        }
    }

    private JobApplicationResponse mapToResponse(JobApplication app) {
        String headline = profileRepository.findByUserId(app.getApplicant().getId())
                .map(SeekerProfile::getHeadline)
                .orElse("Candidate");

        return JobApplicationResponse.builder()
                .id(app.getId())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyName(app.getJob().getCompany().getCompanyName())
                .jobLocation(app.getJob().getLocation())
                .applicantId(app.getApplicant().getId())
                .applicantName(app.getApplicant().getFullName())
                .applicantEmail(app.getApplicant().getEmail())
                .applicantPhone(app.getApplicant().getPhoneNumber())
                .candidateHeadline(headline)
                .status(app.getStatus())
                .coverNote(app.getCoverNote())
                .resumeOriginalName(app.getResumeOriginalName())
                .appliedAt(app.getCreatedAt())
                .build();
    }
}