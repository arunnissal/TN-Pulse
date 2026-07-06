package com.tnpulse.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "issue_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueImage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "public_id", nullable = false)
    private String publicId; // For Cloudinary
}
