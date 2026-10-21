package com.naukri.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "jobs", indexes = {
        @Index(name = "idx_job_status", columnList = "status"),
        @Index(name = "idx_job_location", columnList = "location"),
        @Index(name = "idx_job_work_mode", columnList = "work_mode")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // e.g. "Senior Java Backend Engineer"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description; // Full role requirements and responsibilities

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by_user_id", nullable = false)
    private User postedBy; // Recruiter who created the posting

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", nullable = false)
    private EmploymentType employmentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode", nullable = false)
    private WorkMode workMode;

    @Column(name = "min_experience", nullable = false)
    private Integer minExperience; // e.g. 2 years

    @Column(name = "max_experience", nullable = false)
    private Integer maxExperience; // e.g. 5 years

    @Column(name = "min_salary", precision = 12, scale = 2)
    private BigDecimal minSalary; // e.g. 600000.00 (6 LPA)

    @Column(name = "max_salary", precision = 12, scale = 2)
    private BigDecimal maxSalary; // e.g. 1200000.00 (12 LPA)

    @Column(nullable = false)
    private String location; // e.g. "Bengaluru, Karnataka"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private JobStatus status = JobStatus.ACTIVE;

    // Required Skills tags for Naukri-like card pills
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill_name")
    @Builder.Default
    private Set<String> requiredSkills = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}