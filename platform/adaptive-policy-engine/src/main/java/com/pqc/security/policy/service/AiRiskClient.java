package com.pqc.security.policy.service;

import com.pqc.security.policy.dto.AiPredictionResponse;
import com.pqc.security.policy.dto.NetworkPolicyRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_GATEWAY;

@Component
public class AiRiskClient {

    private final RestClient restClient;

    public AiRiskClient(
            @Value("${ai.security-service.url}") String serviceUrl,
            @Value("${internal.api-key}") String internalApiKey) {
        this.restClient = RestClient.builder()
                .baseUrl(serviceUrl)
                .defaultHeader("X-Internal-API-Key", internalApiKey)
                .build();
    }

    public AiPredictionResponse predict(NetworkPolicyRequest request) {
        try {
            AiPredictionResponse response = restClient.post()
                    .uri("/api/v1/ai/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "features", request.features(),
                            "correlation_id", request.correlationId() == null ? "" : request.correlationId(),
                            "source_service", request.sourceService()))
                    .retrieve()
                    .body(AiPredictionResponse.class);
            if (response == null) {
                throw new ResponseStatusException(BAD_GATEWAY, "AI service returned no prediction");
            }
            return response;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(BAD_GATEWAY, "AI security service is unavailable", exception);
        }
    }
}
