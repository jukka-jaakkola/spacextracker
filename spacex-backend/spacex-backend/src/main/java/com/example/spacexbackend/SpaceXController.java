package com.example.spacexbackend;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.List;
import java.util.stream.Collectors;

@Configuration
@EnableCaching
@EnableScheduling
class AppConfig {}

@RestController
@RequestMapping("/api/spacex")
public class SpaceXController {

    private final String SPACEX_API_URL = "https://api.spacexdata.com/v4/launches";
    private List<Object> cachedLaunches;
    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/launches")
    @Cacheable("launches")
    public List<Object> getLaunches() {
        return cachedLaunches;
    }

    @GetMapping("/upcoming")
    public List<Object> getUpcomingLaunches() {
        return cachedLaunches.stream()
                .filter(launch -> launch.toString().contains("upcoming=true"))
                .collect(Collectors.toList());
    }

    @Scheduled(fixedRate = 3600000) // Refresh data every hour
    public void fetchLaunchData() {
        try {
            Object[] launches = restTemplate.getForObject(SPACEX_API_URL, Object[].class);
            if (launches != null) {
                cachedLaunches = List.of(launches);
            }
        } catch (Exception e) {
            System.err.println("Error fetching SpaceX data: " + e.getMessage());
        }
    }
}

