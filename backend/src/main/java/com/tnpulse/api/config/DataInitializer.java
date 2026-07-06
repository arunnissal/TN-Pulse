package com.tnpulse.api.config;

import com.tnpulse.api.model.Category;
import com.tnpulse.api.model.District;
import com.tnpulse.api.model.Locality;
import com.tnpulse.api.repository.CategoryRepository;
import com.tnpulse.api.repository.DistrictRepository;
import com.tnpulse.api.repository.LocalityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class DataInitializer {

    private final DistrictRepository districtRepository;
    private final LocalityRepository localityRepository;
    private final CategoryRepository categoryRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            log.info("Initializing Seed Data...");

            // Seed Districts
            List<String> districts = Arrays.asList(
                "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", 
                "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", 
                "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
                "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", 
                "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", 
                "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
            );
            
            for (String dName : districts) {
                if (districtRepository.findByName(dName).isEmpty()) {
                    districtRepository.save(District.builder().name(dName).build());
                }
            }

            // Seed Localities for key cities
            districtRepository.findByName("Chennai").ifPresent(chennai -> {
                List<String> localities = Arrays.asList("Adyar", "Anna Nagar", "T Nagar", "Velachery", "Mylapore", "Tambaram", "Guindy", "Chromepet");
                for (String lName : localities) {
                    if (localityRepository.findByNameAndDistrictId(lName, chennai.getId()).isEmpty()) {
                        localityRepository.save(Locality.builder().name(lName).district(chennai).build());
                    }
                }
            });

            districtRepository.findByName("Coimbatore").ifPresent(cbe -> {
                List<String> localities = Arrays.asList("Peelamedu", "RS Puram", "Gandhipuram", "Saibaba Colony", "Saravanampatti", "Townhall", "Singanallur");
                for (String lName : localities) {
                    if (localityRepository.findByNameAndDistrictId(lName, cbe.getId()).isEmpty()) {
                        localityRepository.save(Locality.builder().name(lName).district(cbe).build());
                    }
                }
            });

            districtRepository.findByName("Madurai").ifPresent(madurai -> {
                List<String> localities = Arrays.asList("KK Nagar", "Anna Nagar", "Simmakkal", "Thirunagar", "Mattuthavani");
                for (String lName : localities) {
                    if (localityRepository.findByNameAndDistrictId(lName, madurai.getId()).isEmpty()) {
                        localityRepository.save(Locality.builder().name(lName).district(madurai).build());
                    }
                }
            });

            // Seed Categories
            if (categoryRepository.count() == 0) {
                List<Category> categories = Arrays.asList(
                    Category.builder().name("Traffic").description("Traffic jams and signal issues").icon("Car").isActive(true).build(),
                    Category.builder().name("Road Damage").description("Potholes and broken roads").icon("AlertTriangle").isActive(true).build(),
                    Category.builder().name("Waterlogging").description("Flooded streets").icon("Droplets").isActive(true).build(),
                    Category.builder().name("Garbage").description("Uncollected trash and dumpsters").icon("Trash2").isActive(true).build(),
                    Category.builder().name("Street Light").description("Broken or non-functioning street lights").icon("Lightbulb").isActive(true).build(),
                    Category.builder().name("Others").description("Other civic issues").icon("HelpCircle").isActive(true).build()
                );
                categoryRepository.saveAll(categories);
                log.info("Seeded Categories.");
            }
        };
    }
}
