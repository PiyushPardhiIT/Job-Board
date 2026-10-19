package com.naukri.jobportal.repository;

import com.naukri.jobportal.entity.SeekerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeekerProfileRepository extends JpaRepository<SeekerProfile, Long> {
    Optional<SeekerProfile> findByUserEmail(String email);
    Optional<SeekerProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}