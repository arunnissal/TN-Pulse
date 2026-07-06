package com.tnpulse.api.dto;

import com.tnpulse.api.model.Issue;
import com.tnpulse.api.model.UserStats;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long activeIssues;
    private long resolvedIssues;
    private long communityCredits; // For the current user
    private List<Issue> trendingIssues;
    private UserStats heroOfTheWeek;
}
