package com.naukri.jobportal.service.impl;

import com.naukri.jobportal.dto.request.JobCreateRequest;
import com.naukri.jobportal.dto.request.JobSearchCriteria;
import com.naukri.jobportal.dto.response.JobResponse;
import com.naukri.jobportal.entity.Company;
import com.naukri.jobportal.entity.Job;
import com.naukri.jobportal.entity.JobStatus;
import com.naukri.jobportal.entity.User;
import com.naukri.jobportal.repository.CompanyRepository;
import com.naukri.jobportal.repository.JobRepository;
import com.naukri.jobportal.repository.UserRepository;
import com.naukri.jobportal.service.JobService;
import com.naukri.jobportal.specification.JobSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public JobResponse createJob(
            JobCreateRequest request,
            String recruiterEmail) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException(
                        "Recruiter not found: " + recruiterEmail));

        // Find an existing company or create a new one
        Company company = companyRepository
                .findByCompanyNameIgnoreCase(request.getCompanyName())
                .orElseGet(() -> companyRepository.save(
                        Company.builder()
                                .companyName(request.getCompanyName())
                                .website(request.getCompanyWebsite())
                                .industry(
                                        request.getCompanyIndustry() != null
                                                ? request.getCompanyIndustry()
                                                : "IT & Software")
                                .about(request.getCompanyAbout())
                                .build()
                ));

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .company(company)
                .postedBy(recruiter)
                .employmentType(request.getEmploymentType())
                .workMode(request.getWorkMode())
                .minExperience(request.getMinExperience())
                .maxExperience(request.getMaxExperience())
                .minSalary(request.getMinSalary())
                .maxSalary(request.getMaxSalary())
                .location(request.getLocation())
                .status(JobStatus.ACTIVE)
                .requiredSkills(request.getRequiredSkills())
                .build();

        return mapToResponse(jobRepository.save(job));
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Job not found with id: " + id));

        return mapToResponse(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> getMyPostedJobs(
            String recruiterEmail,
            Pageable pageable) {

        return jobRepository
                .findByPostedByEmailOrderByCreatedAtDesc(
                        recruiterEmail, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> searchJobs(
            JobSearchCriteria criteria,
            Pageable pageable) {

        Specification<Job> spec = JobSpecification.build(criteria);

        return jobRepository.findAll(spec, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public JobResponse updateJob(
            Long jobId,
            JobCreateRequest request,
            String recruiterEmail) {

        Job job = getJobAndValidateOwnership(jobId, recruiterEmail);

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setEmploymentType(request.getEmploymentType());
        job.setWorkMode(request.getWorkMode());
        job.setMinExperience(request.getMinExperience());
        job.setMaxExperience(request.getMaxExperience());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setLocation(request.getLocation());
        job.setRequiredSkills(request.getRequiredSkills());

        return mapToResponse(jobRepository.save(job));
    }

    @Override
    @Transactional
    public JobResponse updateJobStatus(
            Long jobId,
            JobStatus status,
            String recruiterEmail) {

        Job job = getJobAndValidateOwnership(jobId, recruiterEmail);

        job.setStatus(status);

        return mapToResponse(jobRepository.save(job));
    }

    @Override
    @Transactional
    public void deleteJob(Long jobId, String recruiterEmail) {

        Job job = getJobAndValidateOwnership(jobId, recruiterEmail);

        jobRepository.delete(job);
    }

    private Job getJobAndValidateOwnership(
            Long jobId,
            String recruiterEmail) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException(
                        "Job not found with id: " + jobId));

        if (!job.getPostedBy().getEmail()
                .equalsIgnoreCase(recruiterEmail)) {

            throw new RuntimeException(
                    "Access Denied: You can only manage jobs posted by you.");
        }

        return job;
    }

    private JobResponse mapToResponse(Job job) {

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getCompanyName())
                .companyWebsite(job.getCompany().getWebsite())
                .companyLogoUrl(job.getCompany().getLogoUrl())
                .companyIndustry(job.getCompany().getIndustry())
                .recruiterName(job.getPostedBy().getFullName())
                .recruiterEmail(job.getPostedBy().getEmail())
                .employmentType(job.getEmploymentType())
                .workMode(job.getWorkMode())
                .minExperience(job.getMinExperience())
                .maxExperience(job.getMaxExperience())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .location(job.getLocation())
                .status(job.getStatus())
                .requiredSkills(job.getRequiredSkills())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
