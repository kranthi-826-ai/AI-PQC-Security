package com.pqc.security.business.repository;

import com.pqc.security.business.entity.CryptoExecutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CryptoExecutionRepository extends JpaRepository<CryptoExecutionEntity, String> {
}
