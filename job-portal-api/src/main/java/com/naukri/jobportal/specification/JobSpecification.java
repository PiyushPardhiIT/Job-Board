package com.naukri.jobportal.specification;

import com.naukri.jobportal.dto.request.JobSearchCriteria;
import com.naukri.jobportal.entity.Company;
import com.naukri.jobportal.entity.Job;
import com.naukri.jobportal.entity.JobStatus;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class JobSpecification {

    public static Specification<Job> build(JobSearchCriteria criteria) {
        return (Root<Job> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Rule 1: Public searches must ONLY return ACTIVE jobs
            predicates.add(cb.equal(root.get("status"), JobStatus.ACTIVE));

            // Rule 2: Keyword search across Title, Description, Company Name, and Required Skills
            if (StringUtils.hasText(criteria.getKeyword())) {
                String searchPattern = "%" + criteria.getKeyword().trim().toLowerCase() + "%";

                Join<Job, Company> companyJoin = root.join("company", JoinType.LEFT);
                Expression<String> skillsJoin = root.join("requiredSkills", JoinType.LEFT);

                Predicate titleMatch = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), searchPattern);
                Predicate companyMatch = cb.like(cb.lower(companyJoin.get("companyName")), searchPattern);
                Predicate skillMatch = cb.like(cb.lower(skillsJoin), searchPattern);

                predicates.add(cb.or(titleMatch, descMatch, companyMatch, skillMatch));

                // Eliminate duplicate rows caused by collection joins
                query.distinct(true);
            }

            // Rule 3: Location search (case-insensitive substring match)
            if (StringUtils.hasText(criteria.getLocation())) {
                String locPattern = "%" + criteria.getLocation().trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("location")), locPattern));
            }

            // Rule 4: Experience Range Match
            // A job matches if: candidate experience is between minExperience and maxExperience
            if (criteria.getExperience() != null) {
                Predicate minExpMatch = cb.lessThanOrEqualTo(root.get("minExperience"), criteria.getExperience());
                Predicate maxExpMatch = cb.greaterThanOrEqualTo(root.get("maxExperience"), criteria.getExperience());
                predicates.add(cb.and(minExpMatch, maxExpMatch));
            }

            // Rule 5: Work Modes (e.g. In case of checkboxes: REMOTE, HYBRID, ON_SITE)
            if (criteria.getWorkModes() != null && !criteria.getWorkModes().isEmpty()) {
                predicates.add(root.get("workMode").in(criteria.getWorkModes()));
            }

            // Rule 6: Employment Types (e.g. FULL_TIME, CONTRACT)
            if (criteria.getEmploymentTypes() != null && !criteria.getEmploymentTypes().isEmpty()) {
                predicates.add(root.get("employmentType").in(criteria.getEmploymentTypes()));
            }

            // Rule 7: Salary Floor (Find jobs offering up to or above candidate's minimum salary)
            if (criteria.getMinSalary() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("maxSalary"), criteria.getMinSalary()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}