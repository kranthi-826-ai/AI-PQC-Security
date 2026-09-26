package com.pqc.security.auth.event;

import com.pqc.security.events.SecurityEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class SecurityEventPublisher {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityEventPublisher.class);

    private final RestClient restClient;
    private final String apiKey;

    public SecurityEventPublisher(
            @LoadBalanced RestClient.Builder restClientBuilder,
            @Value("${monitoring.base-url}") String monitoringBaseUrl,
            @Value("${monitoring.api-key}") String apiKey) {
        this.restClient = restClientBuilder.baseUrl(monitoringBaseUrl).build();
        this.apiKey = apiKey;
    }

    public void publish(SecurityEvent event) {
        try {
            restClient.post()
                    .uri("/api/v1/events/internal")
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
