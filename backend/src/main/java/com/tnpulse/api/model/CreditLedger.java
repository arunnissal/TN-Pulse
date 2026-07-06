package com.tnpulse.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "credit_ledger")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditLedger extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "action_type", nullable = false)
    private String actionType; // REPORT_ISSUE, CONFIRM_ISSUE, HELPFUL_COMMENT, RESOLVED_REPORT

    @Column(nullable = false)
    private Integer points;

    @Column(name = "reference_id")
    private UUID referenceId; // issue_id, comment_id, etc.
}
