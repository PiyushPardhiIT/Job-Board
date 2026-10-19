package com.naukri.jobportal.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
public class SeekerProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String headline;
    private Integer experienceYears;
    private String currentLocation;
    private BigDecimal currentSalary;
    private BigDecimal expectedSalary;
    private String bio;
    private Set<String> skills;
    private String resumeOriginalName;
    private Long resumeSizeBytes;
    private boolean hasResume;
    private Integer profileCompletenessPercent;
}