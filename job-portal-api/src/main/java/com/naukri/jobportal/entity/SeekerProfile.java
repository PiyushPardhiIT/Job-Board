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
@Table(name = "seeker_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeekerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true, nullable = false)
    private User user;

    @Column(length = 250)
    private String headline; // e.g. "Senior Java Developer | Spring Boot | Microservices"

    @Column(name = "experience_years")
    private Integer experienceYears; // 0 for Fresher, 1, 2, 3...

    @Column(name = "current_location")
    private String currentLocation;

    @Column(name = "current_salary", precision = 12, scale = 2)
    private BigDecimal currentSalary;

    @Column(name = "expected_salary", precision = 12, scale = 2)
    private BigDecimal expectedSalary;

    @Column(columnDefinition = "TEXT")
    private String bio;

    // Resume metadata
    @Column(name = "resume_file_name")
    private String resumeFileName; // Stored UUID file name on disk

    @Column(name = "resume_original_name")
    private String resumeOriginalName; // User's original upload name (e.g. "Rahul_Resume_2026.pdf")

    @Column(name = "resume_content_type")
    private String resumeContentType;

    @Column(name = "resume_size_bytes")
    private Long resumeSizeBytes;

    @Builder.Default
    @Column(name = "profile_completeness_percent")
    private Integer profileCompletenessPercent = 20;

    // Technical Skills (Set of tags e.g. "Java", "Spring Boot", "React", "Docker")
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "seeker_skills", joinColumns = @JoinColumn(name = "seeker_id"))
    @Column(name = "skill_name")
    @Builder.Default
    private Set<String> skills = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}