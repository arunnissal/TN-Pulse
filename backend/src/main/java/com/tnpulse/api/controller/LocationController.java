package com.tnpulse.api.controller;

import com.tnpulse.api.dto.ApiResponse;
import com.tnpulse.api.model.District;
import com.tnpulse.api.model.Locality;
import com.tnpulse.api.repository.DistrictRepository;
import com.tnpulse.api.repository.LocalityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final DistrictRepository districtRepository;
    private final LocalityRepository localityRepository;

    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<District>>> getDistricts() {
        return ResponseEntity.ok(ApiResponse.success("Districts retrieved", districtRepository.findAll()));
    }

    @GetMapping("/districts/{districtId}/localities")
    public ResponseEntity<ApiResponse<List<Locality>>> getLocalitiesByDistrict(@PathVariable UUID districtId) {
        return ResponseEntity.ok(ApiResponse.success("Localities retrieved", localityRepository.findByDistrictId(districtId)));
    }
}
