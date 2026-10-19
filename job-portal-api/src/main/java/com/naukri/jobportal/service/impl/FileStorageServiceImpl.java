package com.naukri.jobportal.service.impl;

import com.naukri.jobportal.service.FileStorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageServiceImpl(@Value("${app.upload.dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create directory for uploaded files.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        // 1. Validate file is not empty
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload an empty file.");
        }

        // 2. Validate MIME type & Extension (PDF only)
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        if (!originalFilename.toLowerCase().endsWith(".pdf") || !"application/pdf".equals(file.getContentType())) {
            throw new RuntimeException("Invalid file format! Only PDF resumes are accepted.");
        }

        // 3. Generate unique storage filename to avoid collisions
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID() + "_" + System.currentTimeMillis() + fileExtension;

        try {
            // Check for path traversal attacks
            if (uniqueFileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence: " + uniqueFileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return uniqueFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + uniqueFileName + ". Please try again!", ex);
        }
    }

    @Override
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File path is invalid: " + fileName, ex);
        }
    }

    @Override
    public void deleteFile(String fileName) {
        if (fileName == null || fileName.isBlank()) return;
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
            // Log warning in production
        }
    }
}