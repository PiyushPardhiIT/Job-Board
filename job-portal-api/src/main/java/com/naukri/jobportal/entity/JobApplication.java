package com.naukri.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "job_applications",
        uniqueConstraints = {
                // Database-level protection: A user can only apply ONCE per job
                @UniqueConstraint(name = "uk_job_applicant", columnNames = {"job_id", "applicant_user_id"})
        },
        indexes = {
                @Index(name = "idx_application_status", columnList = "status"),
                @Index(name = "idx_application_job", columnList = "job_id"),
                @Index(name = "idx_application_applicant", columnList = "applicant_user_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_user_id", nullable = false)
    private User applicant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(columnDefinition = "TEXT")
    private String coverNote;

    // Snapshot of the resume used at time of application
    @Column(name = "resume_file_name", nullable = false)
    private String resumeFileName;

    @Column(name = "resume_original_name", nullable = false)
    private String resumeOriginalName;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}