package com.naukri.jobportal.repository;

import com.naukri.jobportal.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Check duplicate applications
    boolean existsByJobIdAndApplicantEmail(Long jobId, String applicantEmail);

    // Seeker query: View all jobs applied by the logged-in candidate
    Page<JobApplication> findByApplicantEmailOrderByCreatedAtDesc(String applicantEmail, Pageable pageable);

    // Recruiter query: View all applicants for a specific job posting
    Page<JobApplication> findByJobIdOrderByCreatedAtDesc(Long jobId, Pageable pageable);

    // Total applicant counter for a job
    long countByJobId(Long jobId);
}