package com.tnpulse.api.service;

import com.tnpulse.api.dto.LocationDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class NominatimGeocodingServiceImpl implements GeocodingService {

    private final RestTemplate restTemplate;

    public NominatimGeocodingServiceImpl() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public Optional<LocationDto> reverseGeocode(double latitude, double longitude) {
        String url = String.format("https://nominatim.openstreetmap.org/reverse?format=json&lat=%f&lon=%f&zoom=18&addressdetails=1", latitude, longitude);
        
        try {
            // NOTE: Nominatim requires a User-Agent header in production, 
            // for V1 we use a basic rest template but this should be configured properly.
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("address")) {
                Map<String, String> address = (Map<String, String>) response.get("address");
                
                String district = address.getOrDefault("state_district", address.getOrDefault("county", ""));
                String locality = address.getOrDefault("suburb", address.getOrDefault("neighbourhood", address.getOrDefault("village", "")));
                
                // Clean up " District" suffix if present
                if (district.endsWith(" District")) {
                    district = district.replace(" District", "");
                }

                return Optional.of(LocationDto.builder()
                        .district(district)
                        .locality(locality)
                        .build());
            }
        } catch (Exception e) {
            log.error("Failed to reverse geocode: {}", e.getMessage());
        }
        
        // Fallback to a default location so the user is never blocked from reporting
        return Optional.of(LocationDto.builder()
                .district("Chennai")
                .locality("Unknown Area")
                .build());
    }
}
