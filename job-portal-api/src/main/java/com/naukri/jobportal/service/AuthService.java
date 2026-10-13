package com.naukri.jobportal.service;

import com.naukri.jobportal.dto.request.LoginRequest;
import com.naukri.jobportal.dto.request.RegisterRequest;
import com.naukri.jobportal.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse getCurrentUser(String email);
}