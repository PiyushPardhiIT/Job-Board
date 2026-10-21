package com.naukri.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    private String website;

    @Column(name = "logo_url")
    private String logoUrl;

    private String industry; // e.g. "IT Services", "Fintech", "Healthcare"

    @Column(name = "company_size")
    private String companySize; // e.g. "50-200 employees", "1000+ employees"

    @Column(columnDefinition = "TEXT")
    private String about;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}