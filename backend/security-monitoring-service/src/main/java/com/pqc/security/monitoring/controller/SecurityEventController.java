package com.pqc.security.monitoring.controller;

import com.pqc.security.events.SecurityEvent;
import com.pqc.security.monitoring.dto.SecurityEventResponse;
import com.pqc.security.monitoring.entity.SecurityEventEntity;
import com.pqc.security.monitoring.repository.SecurityEventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class SecurityEventController {

    private final SecurityEventRepository eventRepository;

    public SecurityEventController(SecurityEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @PostMapping("/internal")
    public ResponseEntity<SecurityEventResponse> collect(@RequestBody SecurityEvent event) {
        SecurityEventEntity saved = eventRepository.save(new SecurityEventEntity(event));
        return ResponseEntity.status(HttpStatus.CREATED).body(SecurityEventResponse.from(saved));
    }

    @GetMapping
    public List<SecurityEventResponse> latestEvents() {
        return eventRepository.findTop100ByOrderByOccurredAtDesc().stream()
                .map(SecurityEventResponse::from)
                .toList();
    }
}
