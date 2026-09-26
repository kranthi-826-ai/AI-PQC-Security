package com.pqc.security.auth.event;

import com.pqc.security.events.SecurityEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.util.Optional;

@Component
public class SecurityEventPublisher {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityEventPublisher.class);
    private static final String MONITORING_SERVICE = "security-monitoring-service";

    private final RestClient restClient = RestClient.create();
    private final DiscoveryClient discoveryClient;
    private final String apiKey;

    public SecurityEventPublisher(
            DiscoveryClient discoveryClient,
            @Value("${monitoring.api-key}") String apiKey) {
        this.discoveryClient = discoveryClient;
        this.apiKey = apiKey;
    }

    public void publish(SecurityEvent event) {
        try {
            Optional<ServiceInstance> instance = discoveryClient.getInstances(MONITORING_SERVICE)
                    .stream()
                    .findFirst();
            if (instance.isEmpty()) {
                LOGGER.warn("Security event was not published because {} is unavailable", MONITORING_SERVICE);
                return;
            }
            URI endpoint = instance.get().getUri().resolve("/api/v1/events/internal");
            restClient.post()
                    .uri(endpoint)
                    .header("X-Internal-API-Key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(event)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RuntimeException exception) {
            LOGGER.warn("Unable to publish security event {}: {}", event.eventId(), exception.getMessage());
        }
    }
}
