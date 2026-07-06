package com.tnpulse.api.repository;

import com.tnpulse.api.model.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, UUID> {
    UserStats findFirstByOrderByWeeklyCreditsDesc();
}
