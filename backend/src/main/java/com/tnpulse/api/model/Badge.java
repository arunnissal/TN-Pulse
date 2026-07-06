package com.tnpulse.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String icon;

    @Column(name = "milestone_type", nullable = false)
    private String milestoneType; // CREDITS, REPORTS, CONFIRMATIONS

    @Column(name = "milestone_value", nullable = false)
    private Integer milestoneValue;
}
