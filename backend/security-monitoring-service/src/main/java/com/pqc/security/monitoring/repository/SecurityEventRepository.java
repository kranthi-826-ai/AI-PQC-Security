package com.pqc.security.monitoring.repository;

import com.pqc.security.monitoring.entity.SecurityEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SecurityEventRepository extends JpaRepository<SecurityEventEntity, Long> {

    List<SecurityEventEntity> findTop100ByOrderByOccurredAtDesc();
}
