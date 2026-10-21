package com.naukri.jobportal.dto.response;

import com.naukri.jobportal.entity.EmploymentType;
import com.naukri.jobportal.entity.JobStatus;
import com.naukri.jobportal.entity.WorkMode;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;

    // Company Details
    private Long companyId;
    private String companyName;
    private String companyWebsite;
    private String companyLogoUrl;
    private String companyIndustry;

    // Recruiter Info
    private String recruiterName;
    private String recruiterEmail;

    // Job Specs
    private EmploymentType employmentType;
    private WorkMode workMode;
    private Integer minExperience;
    private Integer maxExperience;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String location;
    private JobStatus status;
    private Set<String> requiredSkills;
    private LocalDateTime createdAt;
}