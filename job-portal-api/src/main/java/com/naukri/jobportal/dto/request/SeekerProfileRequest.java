package com.naukri.jobportal.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class SeekerProfileRequest {

    @Size(max = 250, message = "Headline cannot exceed 250 characters")
    private String headline;

    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experienceYears;

    private String currentLocation;
    private BigDecimal currentSalary;
    private BigDecimal expectedSalary;
    private String bio;
    private Set<String> skills;
}