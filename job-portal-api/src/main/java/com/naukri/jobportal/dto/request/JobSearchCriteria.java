package com.naukri.jobportal.dto.request;

import com.naukri.jobportal.entity.EmploymentType;
import com.naukri.jobportal.entity.WorkMode;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class JobSearchCriteria {
    private String keyword;                     // Title, company, skill, or description
    private String location;                    // City name
    private Integer experience;                 // Candidate's years of experience
    private List<WorkMode> workModes;           // e.g. [REMOTE, HYBRID]
    private List<EmploymentType> employmentTypes; // e.g. [FULL_TIME, CONTRACT]
    private BigDecimal minSalary;               // Minimum expected annual salary
}