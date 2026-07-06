package com.tnpulse.api.controller;

import com.tnpulse.api.dto.ApiResponse;
import com.tnpulse.api.dto.CreateIssueRequest;
import com.tnpulse.api.dto.DashboardStatsDto;
import com.tnpulse.api.model.Issue;
import com.tnpulse.api.model.IssueConfirmation;
import com.tnpulse.api.model.IssueStatus;
import com.tnpulse.api.model.User;
import com.tnpulse.api.model.UserStats;
import com.tnpulse.api.repository.IssueConfirmationRepository;
import com.tnpulse.api.repository.IssueRepository;
import com.tnpulse.api.repository.UserRepository;
import com.tnpulse.api.repository.UserStatsRepository;
import com.tnpulse.api.security.services.UserDetailsImpl;
import com.tnpulse.api.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;
    private final IssueRepository issueRepository;
    private final IssueConfirmationRepository confirmationRepository;
    private final UserRepository userRepository;
    private final UserStatsRepository userStatsRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Issue>> createIssue(
            @Valid @RequestBody CreateIssueRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        Issue createdIssue = issueService.createIssue(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Issue reported successfully", createdIssue));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Issue>>> getIssues(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "lastActivityTime") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
            
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        
        PageRequest pageable = PageRequest.of(page, size, sort);
        
        Page<Issue> issues = issueRepository.findByStatusNot(IssueStatus.ARCHIVED, pageable);
        
        return ResponseEntity.ok(ApiResponse.success("Issues retrieved", issues));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Issue>> getIssueById(@PathVariable UUID id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        return ResponseEntity.ok(ApiResponse.success("Issue retrieved", issue));
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<String>> confirmIssue(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (issue.getReporter().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Cannot confirm your own issue"));
        }

        if (confirmationRepository.existsByIssueIdAndUserId(id, user.getId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("You have already confirmed this issue"));
        }

        IssueConfirmation confirmation = IssueConfirmation.builder()
                .issue(issue)
                .user(user)
                .build();
        
        confirmationRepository.save(confirmation);

        // Update issue counts
        issue.setConfirmationCount(issue.getConfirmationCount() + 1);
        issue.setReliabilityScore(issue.getReliabilityScore() + 5);
        issue.setHeatScore(issue.getHeatScore() + 10);
        
        if (issue.getConfirmationCount() >= 3 && issue.getStatus() == IssueStatus.REPORTED) {
            issue.setStatus(IssueStatus.VERIFIED);
        }
        
        issueRepository.save(issue);

        // TODO: Fire Gamification Event to reward the user for confirming

        return ResponseEntity.ok(ApiResponse.success("Issue confirmed successfully", "Success"));
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats(
            @RequestParam(required = false) UUID districtId,
            @RequestParam(required = false) UUID localityId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
            
        long activeIssues = issueRepository.countActiveIssues(districtId, localityId);
        long resolvedIssues = issueRepository.countResolvedIssues(districtId, localityId);
        
        List<Issue> trending = issueRepository.findTrendingIssues(districtId, localityId, PageRequest.of(0, 3));
        
        UserStats hero = userStatsRepository.findFirstByOrderByWeeklyCreditsDesc();
        
        UserStats currentUserStats = null;
        if (userDetails != null) {
            currentUserStats = userStatsRepository.findById(userDetails.getId()).orElse(null);
        }

        DashboardStatsDto stats = DashboardStatsDto.builder()
                .activeIssues(activeIssues)
                .resolvedIssues(resolvedIssues)
                .trendingIssues(trending)
                .heroOfTheWeek(hero)
                .communityCredits(currentUserStats != null ? currentUserStats.getTotalCredits() : 0)
                .build();
                
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }
}
