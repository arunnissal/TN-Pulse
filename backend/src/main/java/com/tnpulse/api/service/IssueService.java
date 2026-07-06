package com.tnpulse.api.service;

import com.tnpulse.api.dto.CreateIssueRequest;
import com.tnpulse.api.dto.LocationDto;
import com.tnpulse.api.model.*;
import com.tnpulse.api.repository.CategoryRepository;
import com.tnpulse.api.repository.DistrictRepository;
import com.tnpulse.api.repository.IssueRepository;
import com.tnpulse.api.repository.LocalityRepository;
import com.tnpulse.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final DistrictRepository districtRepository;
    private final LocalityRepository localityRepository;
    private final GeocodingService geocodingService;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public Issue createIssue(CreateIssueRequest request, UUID reporterId) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Reverse Geocoding
        LocationDto locationDto = geocodingService.reverseGeocode(request.getLatitude(), request.getLongitude())
                .orElseThrow(() -> new RuntimeException("Could not determine location from GPS"));

        District district = districtRepository.findByName(locationDto.getDistrict())
                .orElseGet(() -> districtRepository.save(District.builder().name(locationDto.getDistrict()).build()));

        Locality locality = localityRepository.findByNameAndDistrictId(locationDto.getLocality(), district.getId())
                .orElseGet(() -> localityRepository.save(Locality.builder().name(locationDto.getLocality()).district(district).build()));

        // Duplicate Check (Last 2 hours)
        LocalDateTime twoHoursAgo = LocalDateTime.now().minusHours(2);
        List<Issue> potentialDuplicates = issueRepository.findPossibleDuplicates(category.getId(), locality.getId(), twoHoursAgo);
        
        if (!potentialDuplicates.isEmpty()) {
            // In a real flow, we would return these to the user to confirm. 
            // For now, we log and proceed or throw an exception based on business rules.
            log.info("Found {} potential duplicates for issue creation.", potentialDuplicates.size());
        }

        int verificationLevel = calculateGpsVerificationLevel(request.getGpsAccuracy());

        Issue issue = Issue.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .reporter(reporter)
                .district(district)
                .locality(locality)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .gpsAccuracy(request.getGpsAccuracy())
                .gpsVerificationLevel(verificationLevel)
                .severity(Severity.valueOf(request.getSeverity()))
                .priority(IssuePriority.NORMAL)
                .status(IssueStatus.REPORTED)
                .lastActivityTime(LocalDateTime.now())
                .build();

        if (request.getImageBase64() != null && !request.getImageBase64().isEmpty()) {
            try {
                java.util.Map uploadResult = cloudinaryService.uploadImage(request.getImageBase64());
                String imageUrl = (String) uploadResult.get("secure_url");
                String publicId = (String) uploadResult.get("public_id");

                IssueImage issueImage = IssueImage.builder()
                        .issue(issue)
                        .imageUrl(imageUrl)
                        .publicId(publicId)
                        .build();

                issue.getImages().add(issueImage);
            } catch (Exception e) {
                log.error("Failed to upload image to Cloudinary", e);
            }
        }

        return issueRepository.save(issue);
    }

    private int calculateGpsVerificationLevel(Double accuracy) {
        if (accuracy == null) return 1;
        if (accuracy <= 20) return 5;
        if (accuracy <= 100) return 4;
        if (accuracy <= 500) return 3;
        return 2;
    }
}
