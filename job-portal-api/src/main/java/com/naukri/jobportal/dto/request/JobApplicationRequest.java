package com.naukri.jobportal.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JobApplicationRequest {
    @Size(max = 1000, message = "Cover note cannot exceed 1000 characters")
    private String coverNote;
}