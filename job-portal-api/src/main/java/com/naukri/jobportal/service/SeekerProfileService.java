package com.naukri.jobportal.service;

import com.naukri.jobportal.dto.request.SeekerProfileRequest;
import com.naukri.jobportal.dto.response.SeekerProfileResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface SeekerProfileService {
    SeekerProfileResponse getProfile(String email);
    SeekerProfileResponse updateProfile(String email, SeekerProfileRequest request);
    SeekerProfileResponse uploadResume(String email, MultipartFile file);
    Resource downloadResume(String email);
    String getResumeOriginalName(String email);
    void deleteResume(String email);
}