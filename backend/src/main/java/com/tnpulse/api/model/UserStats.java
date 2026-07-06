package com.tnpulse.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "user_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStats {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Builder.Default
    @Column(name = "total_credits", nullable = false)
    private Integer totalCredits = 0;

    @Builder.Default
    @Column(name = "weekly_credits", nullable = false)
    private Integer weeklyCredits = 0;

    @Builder.Default
    @Column(name = "monthly_credits", nullable = false)
    private Integer monthlyCredits = 0;

    @Builder.Default
    @Column(name = "trust_score", nullable = false)
    private Integer trustScore = 0;

    @Builder.Default
    @Column(name = "community_impact_score", nullable = false)
    private Integer communityImpactScore = 0;

    @Column(name = "weekly_rank")
    private Integer weeklyRank;

    @Column(name = "all_time_rank")
    private Integer allTimeRank;

    @Builder.Default
    @Column(name = "is_community_hero", nullable = false)
    private Boolean isCommunityHero = false;
}
