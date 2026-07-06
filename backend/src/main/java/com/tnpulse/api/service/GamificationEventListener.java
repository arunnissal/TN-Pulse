package com.tnpulse.api.service;

import com.tnpulse.api.model.CreditLedger;
import com.tnpulse.api.model.UserStats;
import com.tnpulse.api.repository.CreditLedgerRepository;
import com.tnpulse.api.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class GamificationEventListener {

    private final UserStatsRepository userStatsRepository;
    private final CreditLedgerRepository creditLedgerRepository;

    @Async
    @EventListener
    @Transactional
    public void handleIssueCreated(IssueCreatedEvent event) {
        log.info("Handling gamification for newly created issue: {}", event.getIssue().getId());
        
        // 1. Log Credit
        CreditLedger ledger = CreditLedger.builder()
                .user(event.getIssue().getReporter())
                .actionType("REPORT_ISSUE")
                .points(20) // Configurable in a real app
                .referenceId(event.getIssue().getId())
                .build();
        creditLedgerRepository.save(ledger);

        // 2. Update User Stats
        userStatsRepository.findById(event.getIssue().getReporter().getId()).ifPresent(stats -> {
            stats.setTotalCredits(stats.getTotalCredits() + 20);
            stats.setWeeklyCredits(stats.getWeeklyCredits() + 20);
            stats.setMonthlyCredits(stats.getMonthlyCredits() + 20);
            
            // Basic Impact Calculation
            stats.setCommunityImpactScore(stats.getCommunityImpactScore() + 5);
            
            userStatsRepository.save(stats);
            
            // Check for new Badges (Implementation abstracted)
            checkAndAwardBadges(stats);
        });
    }
    
    private void checkAndAwardBadges(UserStats stats) {
        // Logic to award "Active Citizen" or "Community Hero" based on thresholds
        // e.g. if stats.getTotalCredits() > 100 award Badge X
    }
}
