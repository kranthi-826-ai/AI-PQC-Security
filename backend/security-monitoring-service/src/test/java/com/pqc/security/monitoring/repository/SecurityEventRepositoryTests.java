package com.pqc.security.monitoring.repository;

import com.pqc.security.events.SecurityEvent;
import com.pqc.security.events.SecurityEventType;
import com.pqc.security.events.SecurityOutcome;
import com.pqc.security.monitoring.entity.SecurityEventEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class SecurityEventRepositoryTests {

    @Autowired
    private SecurityEventRepository repository;

    @BeforeEach
    void clearEvents() {
        repository.deleteAll();
    }

    @Test
    void persistsNormalizedSecurityEvent() {
        SecurityEvent event = SecurityEvent.create(
                SecurityEventType.API_ACCESS_GRANTED,
                SecurityOutcome.SUCCESS,
                "business-service",
                "alice",
                "correlation-123",
                "GET",
                "/api/v1/business/secure-data",
                "127.0.0.1",
                "Protected business API accessed");

        repository.save(new SecurityEventEntity(event));

        assertThat(repository.findTop100ByOrderByOccurredAtDesc())
                .singleElement()
                .satisfies(saved -> {
                    assertThat(saved.getEventId()).isEqualTo(event.eventId().toString());
                    assertThat(saved.getEventType()).isEqualTo("API_ACCESS_GRANTED");
                    assertThat(saved.getCorrelationId()).isEqualTo("correlation-123");
                });
    }
}
