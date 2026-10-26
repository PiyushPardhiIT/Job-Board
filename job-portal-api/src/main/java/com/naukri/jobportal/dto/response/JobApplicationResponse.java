package com.naukri.jobportal.dto.response;

import com.naukri.jobportal.entity.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class JobApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String jobLocation;

    // Candidate Snapshot
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String candidateHeadline;

    // Application Details
    private ApplicationStatus status;
    private String coverNote;
    private String resumeOriginalName;
    private LocalDateTime appliedAt;
}