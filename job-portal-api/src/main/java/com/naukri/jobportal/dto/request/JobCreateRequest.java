package com.naukri.jobportal.dto.request;

import com.naukri.jobportal.entity.EmploymentType;
import com.naukri.jobportal.entity.WorkMode;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class JobCreateRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String companyWebsite;
    private String companyIndustry;
    private String companyAbout;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;

    @NotNull(message = "Work mode is required")
    private WorkMode workMode;

    @NotNull(message = "Minimum experience is required")
    @Min(value = 0, message = "Experience cannot be negative")
    private Integer minExperience;

    @NotNull(message = "Maximum experience is required")
    private Integer maxExperience;

    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    @NotBlank(message = "Job location is required")
    private String location;

    @NotEmpty(message = "Please provide at least one required skill")
    private Set<String> requiredSkills;
}