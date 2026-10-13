package com.naukri.jobportal.repository;
import com.naukri.jobportal.entity.Role;
import com.naukri.jobportal.entity.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}

