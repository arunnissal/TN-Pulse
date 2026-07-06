package com.tnpulse.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "localities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Locality {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private District district;

    @Column(nullable = false)
    private String name;

    @Column(name = "pincode")
    private String pincode;
}
