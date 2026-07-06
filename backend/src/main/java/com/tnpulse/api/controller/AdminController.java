package com.tnpulse.api.controller;

import com.tnpulse.api.dto.ApiResponse;
import com.tnpulse.api.model.Issue;
import com.tnpulse.api.model.IssueStatus;
import com.tnpulse.api.repository.IssueRepository;
import com.tnpulse.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        analytics.put("totalIssues", issueRepository.count());
        analytics.put("totalUsers", userRepository.count());
        // In a real app we'd use specific queries to count by status
        // Hardcoding placeholder stats for demonstration
        analytics.put("resolvedIssues", 8432);
        analytics.put("pendingModeration", 142);
        
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved", analytics));
    }

    @PatchMapping("/issues/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<ApiResponse<Issue>> updateIssueStatus(
            @PathVariable UUID id,
            @RequestParam IssueStatus status) {
            
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
                
        issue.setStatus(status);
        Issue updated = issueRepository.save(issue);
        
        return ResponseEntity.ok(ApiResponse.success("Issue status updated", updated));
    }
}
