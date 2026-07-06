package com.tnpulse.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class CreateIssueRequest {
    @NotBlank
    private String title;
    
    @NotBlank
    private String description;
    
    @NotNull
    private UUID categoryId;
    
    @NotNull
    private Double latitude;
    
    @NotNull
    private Double longitude;
    
    @NotNull
    private Double gpsAccuracy;
    
    @NotBlank
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL
    
    // Optional base64 image data captured from live camera
    private String imageBase64;
}
