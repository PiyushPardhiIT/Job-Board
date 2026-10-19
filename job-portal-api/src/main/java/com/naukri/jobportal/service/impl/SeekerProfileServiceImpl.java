package com.naukri.jobportal.service.impl;

import com.naukri.jobportal.dto.request.SeekerProfileRequest;
import com.naukri.jobportal.dto.response.SeekerProfileResponse;
import com.naukri.jobportal.entity.SeekerProfile;
import com.naukri.jobportal.entity.User;
import com.naukri.jobportal.repository.SeekerProfileRepository;
import com.naukri.jobportal.repository.UserRepository;
import com.naukri.jobportal.service.FileStorageService;
import com.naukri.jobportal.service.SeekerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class SeekerProfileServiceImpl implements SeekerProfileService {

    private final SeekerProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public SeekerProfileResponse getProfile(String email) {
        SeekerProfile profile = getOrCreateProfile(email);
        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public SeekerProfileResponse updateProfile(String email, SeekerProfileRequest request) {
        SeekerProfile profile = getOrCreateProfile(email);

        profile.setHeadline(request.getHeadline());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setCurrentLocation(request.getCurrentLocation());
        profile.setCurrentSalary(request.getCurrentSalary());
        profile.setExpectedSalary(request.getExpectedSalary());
        profile.setBio(request.getBio());

        if (request.getSkills() != null) {
            profile.setSkills(request.getSkills());
        }

        profile.setProfileCompletenessPercent(calculateCompleteness(profile));
        SeekerProfile saved = profileRepository.save(profile);

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public SeekerProfileResponse uploadResume(String email, MultipartFile file) {
        SeekerProfile profile = getOrCreateProfile(email);

        // Delete old file if present
        if (profile.getResumeFileName() != null) {
            fileStorageService.deleteFile(profile.getResumeFileName());
        }

        String storedFileName = fileStorageService.storeFile(file);

        profile.setResumeFileName(storedFileName);
        profile.setResumeOriginalName(file.getOriginalFilename());
        profile.setResumeContentType(file.getContentType());
        profile.setResumeSizeBytes(file.getSize());

        profile.setProfileCompletenessPercent(calculateCompleteness(profile));
        SeekerProfile saved = profileRepository.save(profile);

        return mapToResponse(saved);
    }

    @Override
    public Resource downloadResume(String email) {
        SeekerProfile profile = profileRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (!StringUtils.hasText(profile.getResumeFileName())) {
            throw new RuntimeException("No resume uploaded yet.");
        }

        return fileStorageService.loadFileAsResource(profile.getResumeFileName());
    }

    @Override
    public String getResumeOriginalName(String email) {
        SeekerProfile profile = profileRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return profile.getResumeOriginalName() != null ? profile.getResumeOriginalName() : "resume.pdf";
    }

    @Override
    @Transactional
    public void deleteResume(String email) {
        SeekerProfile profile = getOrCreateProfile(email);
        if (profile.getResumeFileName() != null) {
            fileStorageService.deleteFile(profile.getResumeFileName());
            profile.setResumeFileName(null);
            profile.setResumeOriginalName(null);
            profile.setResumeContentType(null);
            profile.setResumeSizeBytes(null);
            profile.setProfileCompletenessPercent(calculateCompleteness(profile));
            profileRepository.save(profile);
        }
    }

    private SeekerProfile getOrCreateProfile(String email) {
        return profileRepository.findByUserEmail(email).orElseGet(() -> {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            SeekerProfile newProfile = SeekerProfile.builder()
                    .user(user)
                    .profileCompletenessPercent(20) // Base score for account creation
                    .build();
            return profileRepository.save(newProfile);
        });
    }

    /**
     * Naukri-Inspired Profile Completeness Formula (Total = 100%):
     * - Basic Info (Account, Email, Phone): 20%
     * - Professional Headline & Bio: 20%
     * - Experience & Location: 20%
     * - Key Skills (at least 3 skills): 20%
     * - Uploaded PDF Resume: 20%
     */
    private int calculateCompleteness(SeekerProfile p) {
        int score = 20; // Base score for registered user

        if (StringUtils.hasText(p.getHeadline())) score += 10;
        if (StringUtils.hasText(p.getBio())) score += 10;

        if (p.getExperienceYears() != null) score += 10;
        if (StringUtils.hasText(p.getCurrentLocation())) score += 10;

        if (p.getSkills() != null && p.getSkills().size() >= 3) {
            score += 20;
        } else if (p.getSkills() != null && !p.getSkills().isEmpty()) {
            score += 10;
        }

        if (StringUtils.hasText(p.getResumeFileName())) score += 20;

        return Math.min(score, 100);
    }

    private SeekerProfileResponse mapToResponse(SeekerProfile p) {
        return SeekerProfileResponse.builder()
                .id(p.getId())
                .fullName(p.getUser().getFullName())
                .email(p.getUser().getEmail())
                .phoneNumber(p.getUser().getPhoneNumber())
                .headline(p.getHeadline())
                .experienceYears(p.getExperienceYears())
                .currentLocation(p.getCurrentLocation())
                .currentSalary(p.getCurrentSalary())
                .expectedSalary(p.getExpectedSalary())
                .bio(p.getBio())
                .skills(p.getSkills())
                .resumeOriginalName(p.getResumeOriginalName())
                .resumeSizeBytes(p.getResumeSizeBytes())
                .hasResume(p.getResumeFileName() != null)
                .profileCompletenessPercent(p.getProfileCompletenessPercent())
                .build();
    }
}