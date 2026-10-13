package com.naukri.jobportal.config;

import com.naukri.jobportal.entity.Role;
import com.naukri.jobportal.entity.RoleType;
import com.naukri.jobportal.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        for (RoleType roleType : RoleType.values()) {
            roleRepository.findByName(roleType).orElseGet(() ->
                    roleRepository.save(Role.builder().name(roleType).build())
            );
        }
    }
}