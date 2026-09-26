package com.pqc.security.business.controller;

import com.pqc.security.business.dto.SecureDataResponse;
import com.pqc.security.business.event.SecurityEventPublisher;
import com.pqc.security.events.SecurityEvent;
import com.pqc.security.events.SecurityEventType;
import com.pqc.security.events.SecurityOutcome;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/business")
public class BusinessController {

    private final SecurityEventPublisher eventPublisher;

    public BusinessController(SecurityEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @GetMapping("/secure-data")
    public ResponseEntity<SecureDataResponse> secureData(
            Authentication authentication,
            HttpServletRequest request) {
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("ROLE_USER");
        String correlationId = request.getHeader("X-Correlation-ID");

        eventPublisher.publish(SecurityEvent.create(
                SecurityEventType.API_ACCESS_GRANTED,
                SecurityOutcome.SUCCESS,
                "business-service",
                authentication.getName(),
                correlationId,
                request.getMethod(),
                request.getRequestURI(),
                request.getRemoteAddr(),
                "Protected business API accessed"));

        return ResponseEntity.ok(new SecureDataResponse(
                "Protected business data accessed successfully",
                authentication.getName(),
                role,
                correlationId));
    }
}
