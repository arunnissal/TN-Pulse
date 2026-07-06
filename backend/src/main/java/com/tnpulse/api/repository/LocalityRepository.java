package com.tnpulse.api.repository;

import com.tnpulse.api.model.Locality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LocalityRepository extends JpaRepository<Locality, UUID> {
    List<Locality> findByDistrictId(UUID districtId);
    Optional<Locality> findByNameAndDistrictId(String name, UUID districtId);
}
