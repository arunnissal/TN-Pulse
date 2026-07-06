package com.tnpulse.api.controller;

import com.tnpulse.api.dto.ApiResponse;
import com.tnpulse.api.model.User;
import com.tnpulse.api.model.UserStats;
import com.tnpulse.api.repository.UserRepository;
import com.tnpulse.api.repository.UserStatsRepository;
import com.tnpulse.api.security.services.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserStatsRepository userStatsRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUserStats(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
            
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        UserStats stats = userStatsRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User stats not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("stats", stats);
        
        // Exclude password from response
        user.setPasswordHash(null);

        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", response));
    }
}
