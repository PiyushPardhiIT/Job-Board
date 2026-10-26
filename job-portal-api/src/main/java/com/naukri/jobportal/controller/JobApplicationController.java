package com.naukri.jobportal.controller;

import com.naukri.jobportal.dto.request.JobApplicationRequest;
import com.naukri.jobportal.dto.response.JobApplicationResponse;
import com.naukri.jobportal.entity.ApplicationStatus;
import com.naukri.jobportal.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;

    // --- SEEKER ENDPOINTS ---

    @PostMapping("/jobs/{jobId}/apply")
    @PreAuthorize("hasRole('SEEKER')")
    public ResponseEntity<JobApplicationResponse> applyToJob(
            @PathVariable Long jobId,
            @Valid @RequestBody(required = false) JobApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.applyToJob(jobId, request, userDetails.getUsername()));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('SEEKER')")
    public ResponseEntity<Page<JobApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(applicationService.getMyApplications(userDetails.getUsername(), PageRequest.of(page, size)));
    }

    @GetMapping("/jobs/{jobId}/check")
    @PreAuthorize("hasRole('SEEKER')")
    public ResponseEntity<Map<String, Boolean>> checkApplicationStatus(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean applied = applicationService.hasUserApplied(jobId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("applied", applied));
    }

    // --- RECRUITER ENDPOINTS ---

    @GetMapping("/jobs/{jobId}/applicants")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Page<JobApplicationResponse>> getJobApplicants(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(applicationService.getJobApplicants(jobId, userDetails.getUsername(), PageRequest.of(page, size)));
    }

    @PatchMapping("/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobApplicationResponse> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.updateStatus(applicationId, status, userDetails.getUsername()));
    }

    @GetMapping("/{applicationId}/resume/download")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Resource> downloadApplicantResume(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Resource file = applicationService.downloadApplicantResume(applicationId, userDetails.getUsername());
        String filename = applicationService.getApplicantResumeName(applicationId, userDetails.getUsername());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(file);
    }
}