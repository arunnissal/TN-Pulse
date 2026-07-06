package com.tnpulse.api.service;

import com.tnpulse.api.dto.LocationDto;
import java.util.Optional;

public interface GeocodingService {
    Optional<LocationDto> reverseGeocode(double latitude, double longitude);
}
