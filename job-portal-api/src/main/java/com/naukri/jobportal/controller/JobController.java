package com.naukri.jobportal.controller;

import com.naukri.jobportal.dto.request.JobCreateRequest;
import com.naukri.jobportal.dto.response.JobResponse;
import com.naukri.jobportal.entity.JobStatus;
import com.naukri.jobportal.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.naukri.jobportal.dto.request.JobSearchCriteria;
import com.naukri.jobportal.entity.EmploymentType;
import com.naukri.jobportal.entity.WorkMode;
import org.springframework.data.domain.Sort;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // Public endpoint: View single job specifications
    @GetMapping("/public/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    // Recruiter endpoint: Post a new job
    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponse> createJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody JobCreateRequest request) {
        return ResponseEntity.ok(jobService.createJob(request, userDetails.getUsername()));
    }

    // Recruiter endpoint: View jobs posted by logged-in recruiter
    @GetMapping("/recruiter/my-jobs")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Page<JobResponse>> getMyJobs(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getMyPostedJobs(userDetails.getUsername(), PageRequest.of(page, size)));
    }

    // Recruiter endpoint: Update existing job
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody JobCreateRequest request) {
        return ResponseEntity.ok(jobService.updateJob(id, request, userDetails.getUsername()));
    }

    // Recruiter endpoint: Toggle job status (ACTIVE <-> CLOSED)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponse> updateJobStatus(
            @PathVariable Long id,
            @RequestParam JobStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(jobService.updateJobStatus(id, status, userDetails.getUsername()));
    }

    // Recruiter endpoint: Delete job
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        jobService.deleteJob(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/public/search")
    public ResponseEntity<Page<JobResponse>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer experience,
            @RequestParam(required = false) List<WorkMode> workModes,
            @RequestParam(required = false) List<EmploymentType> employmentTypes,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        JobSearchCriteria criteria = new JobSearchCriteria();
        criteria.setKeyword(keyword);
        criteria.setLocation(location);
        criteria.setExperience(experience);
        criteria.setWorkModes(workModes);
        criteria.setEmploymentTypes(employmentTypes);
        criteria.setMinSalary(minSalary);
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(jobService.searchJobs(criteria, pageRequest));
    }
}