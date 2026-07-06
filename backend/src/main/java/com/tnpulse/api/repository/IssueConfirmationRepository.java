package com.tnpulse.api.repository;

import com.tnpulse.api.model.IssueConfirmation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface IssueConfirmationRepository extends JpaRepository<IssueConfirmation, UUID> {
    boolean existsByIssueIdAndUserId(UUID issueId, UUID userId);
}
