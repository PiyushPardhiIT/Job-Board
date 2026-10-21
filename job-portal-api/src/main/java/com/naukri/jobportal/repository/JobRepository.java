package com.naukri.jobportal.repository;

import com.naukri.jobportal.entity.Job;
import com.naukri.jobportal.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    Page<Job> findByPostedByEmailOrderByCreatedAtDesc(String email, Pageable pageable);
    Page<Job> findByStatusOrderByCreatedAtDesc(JobStatus status, Pageable pageable);
    long countByPostedByEmail(String email);
}