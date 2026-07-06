package com.tnpulse.api.repository;

import com.tnpulse.api.model.Issue;
import com.tnpulse.api.model.IssueStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface IssueRepository extends JpaRepository<Issue, UUID> {
    
    Page<Issue> findByStatusNot(IssueStatus status, Pageable pageable);

    @Query("SELECT i FROM Issue i WHERE i.category.id = :categoryId AND i.locality.id = :localityId " +
           "AND i.status != 'ARCHIVED' AND i.createdAt >= :timeWindow")
    List<Issue> findPossibleDuplicates(@Param("categoryId") UUID categoryId, 
                                       @Param("localityId") UUID localityId, 
                                       @Param("timeWindow") LocalDateTime timeWindow);

    List<Issue> findByStatusAndLastActivityTimeBefore(IssueStatus status, LocalDateTime time);

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status NOT IN ('RESOLVED', 'ARCHIVED') " +
           "AND (:districtId IS NULL OR i.district.id = :districtId) " +
           "AND (:localityId IS NULL OR i.locality.id = :localityId)")
    long countActiveIssues(@Param("districtId") UUID districtId, @Param("localityId") UUID localityId);

    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status = 'RESOLVED' " +
           "AND (:districtId IS NULL OR i.district.id = :districtId) " +
           "AND (:localityId IS NULL OR i.locality.id = :localityId)")
    long countResolvedIssues(@Param("districtId") UUID districtId, @Param("localityId") UUID localityId);

    @Query("SELECT i FROM Issue i WHERE i.status IN ('REPORTED', 'VERIFIED', 'IN_PROGRESS') " +
           "AND (:districtId IS NULL OR i.district.id = :districtId) " +
           "AND (:localityId IS NULL OR i.locality.id = :localityId) " +
           "ORDER BY i.heatScore DESC")
    List<Issue> findTrendingIssues(@Param("districtId") UUID districtId, @Param("localityId") UUID localityId, Pageable pageable);
}
