package com.naukri.jobportal.controller;

import com.naukri.jobportal.dto.request.SeekerProfileRequest;
import com.naukri.jobportal.dto.response.SeekerProfileResponse;
import com.naukri.jobportal.service.SeekerProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/seeker")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SEEKER')")
public class SeekerProfileController {

    private final SeekerProfileService profileService;

    @GetMapping("/profile")
    public ResponseEntity<SeekerProfileResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<SeekerProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SeekerProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(userDetails.getUsername(), request));
    }

    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SeekerProfileResponse> uploadResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(profileService.uploadResume(userDetails.getUsername(), file));
    }

    @GetMapping("/resume/download")
    public ResponseEntity<Resource> downloadResume(@AuthenticationPrincipal UserDetails userDetails) {
        Resource resource = profileService.downloadResume(userDetails.getUsername());
        String originalName = profileService.getResumeOriginalName(userDetails.getUsername());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + originalName + "\"")
                .body(resource);
    }

    @DeleteMapping("/resume")
    public ResponseEntity<Void> deleteResume(@AuthenticationPrincipal UserDetails userDetails) {
        profileService.deleteResume(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}